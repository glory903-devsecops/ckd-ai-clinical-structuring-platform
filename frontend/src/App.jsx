import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Clock, 
  ArrowLeft,
  ChevronRight,
  X,
  RefreshCcw,
  Activity,
  Trash2,
  Edit,
  Save,
  AlertTriangle,
  Globe
} from 'lucide-react';
import { initialDiagnoses, keywordDictionary } from './mockData';

const ARCHIVE_KEY = 'cddp_demo_archive';

function App() {
  const [diagnoses, setDiagnoses] = useState([]); 
  const [inputVal, setInputVal] = useState('');
  const [isSearchView, setIsSearchView] = useState(true);
  const [selectedKeywords, setSelectedKeywords] = useState([]); 
  const [searchQuery, setSearchQuery] = useState(''); 
  const [selectedDiagnosis, setSelectedDiagnosis] = useState(null); 
  const [editingDiagnosis, setEditingDiagnosis] = useState(null);
  const [editText, setEditText] = useState('');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [error, setError] = useState(null);

  // 1. 데모 모드 감지 및 초기 데이터 동기화
  const fetchDiagnoses = async () => {
    setIsLoadingHistory(true);
    const demoDomain = window.location.hostname !== 'localhost';
    
    try {
      if (demoDomain) throw new Error("Demo Environment"); // 데모 버전은 항상 로컬 스토리지 우선

      const response = await fetch('http://localhost:8000/api/diagnoses');
      if (response.ok) {
        const data = await response.json();
        setDiagnoses(data.length > 0 ? data : initialDiagnoses);
        setIsDemoMode(false);
      } else {
        throw new Error("Backend unreachable");
      }
    } catch (err) {
      console.log("Entering Demo Mode (LocalStorage Sync)");
      setIsDemoMode(true);
      const saved = localStorage.getItem(ARCHIVE_KEY);
      if (saved) {
        setDiagnoses(JSON.parse(saved));
      } else {
        setDiagnoses(initialDiagnoses);
        localStorage.setItem(ARCHIVE_KEY, JSON.stringify(initialDiagnoses));
      }
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  // 2. LocalStorage 업데이트 (데모 모드용)
  const updateLocalStore = (newDiagnoses) => {
    setDiagnoses(newDiagnoses);
    if (isDemoMode) {
      localStorage.setItem(ARCHIVE_KEY, JSON.stringify(newDiagnoses));
    }
  };

  const handleAddDiagnosis = async () => {
    if (!inputVal.trim()) return;
    setIsAnalyzing(true);

    if (isDemoMode) {
      // 데모 모드 시뮬레이션
      setTimeout(() => {
        const mockKeywords = keywordDictionary.filter(kw => inputVal.includes(kw));
        const newEntry = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          rawContent: inputVal,
          summary: inputVal.substring(0, 30) + "...",
          keywords: mockKeywords.length > 0 ? mockKeywords : ["General Case"],
          perspective: "데모 시뮬레이션",
          isDemo: true
        };
        updateLocalStore([newEntry, ...diagnoses]);
        setInputVal('');
        setIsAnalyzing(false);
        setIsSearchView(false);
      }, 1500);
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/structure', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diagnosis: inputVal, perspective: "치료 단계 중심" })
      });
      if (response.ok) {
        await fetchDiagnoses();
        setInputVal('');
        setIsSearchView(false);
      }
    } catch (err) {
      console.error("API Error - Switching to Demo session");
      setIsDemoMode(true);
      handleAddDiagnosis(); // 재시도
    } finally {
      if (!isDemoMode) setIsAnalyzing(false);
    }
  };

  const handleDelete = async (id) => {
    if (isDemoMode) {
      updateLocalStore(diagnoses.filter(d => d.id !== id));
      setDeleteConfirmId(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/diagnoses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchDiagnoses();
        setDeleteConfirmId(null);
      }
    } catch (err) {
      console.error("Delete failed");
    }
  };

  const handleUpdate = async () => {
    if (!editingDiagnosis || !editText.trim()) return;

    if (isDemoMode) {
      const updated = diagnoses.map(d => 
        d.id === editingDiagnosis.id ? { ...d, rawContent: editText, updated_at: new Date().toISOString() } : d
      );
      updateLocalStore(updated);
      setEditingDiagnosis(null);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/diagnoses/${editingDiagnosis.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawContent: editText })
      });
      if (response.ok) {
        await fetchDiagnoses();
        setEditingDiagnosis(null);
      }
    } catch (err) {
      console.error("Update failed");
    }
  };

  const toggleKeyword = (kw) => {
    setSelectedKeywords(prev => 
      prev.includes(kw) ? prev.filter(k => k !== kw) : [...prev, kw]
    );
  };

  const allKeywords = useMemo(() => {
    const keys = new Set();
    diagnoses.forEach(d => {
      (d?.keywords || []).forEach(k => keys.add(k));
    });
    return Array.from(keys);
  }, [diagnoses]);

  const filteredDiagnoses = useMemo(() => {
    let result = diagnoses;
    if (selectedKeywords.length > 0) {
      result = result.filter(d => selectedKeywords.every(sk => (d?.keywords || []).includes(sk)));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        (d?.rawContent || "").toLowerCase().includes(q) || (d?.keywords || []).some(k => k.toLowerCase().includes(q))
      );
    }
    return result;
  }, [diagnoses, selectedKeywords, searchQuery]);

  const renderLanding = () => (
    <div className="landing-content full-screen">
      <div className="search-container fade-in">
        <Activity size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
        <h1 className="logo-title">Clinical Discovery Ingestion</h1>
        <p className="hero-subtitle">의료 전문가의 실시간 진단 데이터를 지능형 아카이브로 통합합니다.</p>
        
        <div className="search-input-area hero">
          <textarea 
            className="main-textarea"
            placeholder="환자의 진단 내용 또는 임상 소견을 상세히 입력하세요..."
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <button className="btn-submit hero-btn" onClick={handleAddDiagnosis} disabled={isAnalyzing}>
            {isAnalyzing ? "AI 분석 엔진 구동 중..." : "진단 데이터 수집 및 구조화 시작"}
          </button>
        </div>

        <div style={{ marginTop: '40px' }}>
          <button className="text-link-btn" onClick={() => setIsSearchView(false)}>
            기존 아카이브 맵 탐색기 <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );

  const renderDashboard = () => (
    <div className="dashboard-layout fade-in">
      <div className="dashboard-content">
        <header className="dashboard-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button className="icon-btn" onClick={() => setIsSearchView(true)}><ArrowLeft size={18} /></button>
              <h2 style={{ fontSize: '1.4rem' }}>Clinical Data Discovery</h2>
            </div>
            <div className="badge-group">
              <div className="badge secondary">Total: {diagnoses.length}</div>
              <div className={`badge ${isDemoMode ? 'accent' : 'primary'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isDemoMode ? <Globe size={12} /> : <RefreshCcw size={12} className={isLoadingHistory ? "spin" : ""} />}
                {isDemoMode ? '데모 시뮬레이션 모드' : '백엔드 동기화 모드'}
              </div>
            </div>
          </div>

          <div className="dashboard-search-area">
            <div className="search-bar-wrapper">
              <Search size={20} className="search-icon" />
              <input 
                type="text" 
                className="dashboard-search-input"
                placeholder="키워드 또는 내용 실시간 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="keyword-bar">
            {allKeywords.map(kw => (
              <button key={kw} className={`keyword-btn ${selectedKeywords.includes(kw) ? 'active' : ''}`} onClick={() => toggleKeyword(kw)}>#{kw}</button>
            ))}
          </div>
        </header>

        <main className="results-list">
          {filteredDiagnoses.map((item, idx) => (
            <div key={item.id || idx} className="case-card">
              <div className="card-actions">
                <button className="action-btn" onClick={() => { setEditingDiagnosis(item); setEditText(item.rawContent); }}>
                  <Edit size={14} />
                </button>
                <button className="action-btn delete" onClick={() => setDeleteConfirmId(item.id)}>
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="case-meta">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(item?.keywords || []).map(k => <span key={k} className="case-tag">#{k}</span>)}
                </div>
                <span className="case-date">{item?.date || item?.saved_at}</span>
              </div>
              <div className="case-body">{item?.rawContent}</div>
              <div className="case-footer">
                 <button className="text-action-btn" onClick={() => setSelectedDiagnosis(item)}>구조화 JSON 리포트 확인</button>
              </div>
            </div>
          ))}
        </main>
      </div>

      <aside className="timeline-sidebar">
        <div className="sidebar-header">
          <Clock size={20} className="text-dim" />
          <h3 style={{ fontSize: '1.1rem' }}>아카이브 타임라인</h3>
        </div>
        <div className="timeline-scroll">
          {diagnoses.map((d, i) => (
            <div key={d.id || i} className="timeline-item" onClick={() => { setIsSearchView(false); setSelectedDiagnosis(d); }}>
              <div className="timeline-title">{d?.summary || d?.rawContent?.substring(0, 30)}</div>
              <div className="timeline-tags">{(d?.keywords || []).slice(0, 3).map(k => <span key={k}>#{k}</span>)}</div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );

  return (
    <div className="app-container">
      {isSearchView ? renderLanding() : renderDashboard()}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
            <h3>영후 삭제 확인 - CDDP</h3>
            <p style={{ color: 'var(--text-dim)', margin: '12px 0 24px' }}>
              {isDemoMode ? '데모 버전에서는 브라우저 저장소에서 제거됩니다.' : '아카이브에서 영구적으로 삭제하시겠습니까?'}
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn-submit" style={{ flex: 1, background: '#334155' }} onClick={() => setDeleteConfirmId(null)}>취소</button>
              <button className="btn-submit" style={{ flex: 1, background: 'var(--danger)' }} onClick={() => handleDelete(deleteConfirmId)}>영구 삭제</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingDiagnosis && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>진단 기록 수정</h3>
              <button className="icon-btn" onClick={() => setEditingDiagnosis(null)}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ marginTop: '20px' }}>
              <textarea 
                className="main-textarea" 
                style={{ height: '200px', fontSize: '1.1rem', background: '#0a0c10', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)', textAlign: 'left' }}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <button className="btn-submit" style={{ width: '100%', marginTop: '20px' }} onClick={handleUpdate}>
                변경 사항 저장
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedDiagnosis && !editingDiagnosis && (
        <div className="modal-overlay" onClick={() => setSelectedDiagnosis(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Persistent Clinical Report</h3>
              <button className="icon-btn" onClick={() => setSelectedDiagnosis(null)}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="json-container">
                <pre>{JSON.stringify(selectedDiagnosis, null, 2)}</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
