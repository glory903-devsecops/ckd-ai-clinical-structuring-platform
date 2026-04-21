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
  const [showSidebar, setShowSidebar] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [viewMode, setViewMode] = useState('archive'); // 'archive' or 'trash'
  const [trashDiagnoses, setTrashDiagnoses] = useState([]);
  const [isIntersection, setIsIntersection] = useState(false); // New: Filter logic toggle

  const fetchDiagnoses = async () => {
    setIsLoadingHistory(true);
    const demoDomain = window.location.hostname !== 'localhost';
    
    try {
      if (demoDomain) throw new Error("Demo Environment");
      
      const [activeRes, trashRes] = await Promise.all([
        fetch('http://localhost:8000/api/diagnoses'),
        fetch('http://localhost:8000/api/diagnoses/trash')
      ]);

      if (activeRes.ok && trashRes.ok) {
        const activeData = await activeRes.json();
        const trashData = await trashRes.json();
        setDiagnoses(activeData.length > 0 ? activeData : initialDiagnoses);
        setTrashDiagnoses(trashData);
        setIsDemoMode(false);
      } else {
        throw new Error("Backend unreachable");
      }
    } catch (err) {
      setIsDemoMode(true);
      const saved = localStorage.getItem(ARCHIVE_KEY);
      const savedTrash = localStorage.getItem(ARCHIVE_KEY + "_trash");
      
      if (saved) {
        const all = JSON.parse(saved);
        setDiagnoses(all.filter(d => !d.is_deleted));
        setTrashDiagnoses(all.filter(d => d.is_deleted));
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
      setTimeout(() => {
        const mockKeywords = keywordDictionary.filter(kw => inputVal.includes(kw));
        const newEntry = {
          id: Date.now(),
          date: new Date().toLocaleString(),
          rawContent: inputVal,
          summary: inputVal.substring(0, 30) + "...",
          keywords: mockKeywords.length > 0 ? mockKeywords : ["일반 소견"],
          perspective: "데모 지능형 추출",
          isDemo: true
        };
        updateLocalStore([newEntry, ...diagnoses]);
        setInputVal('');
        setIsAnalyzing(false);
        setIsSearchView(false);
      }, 1200);
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
      setIsDemoMode(true);
      handleAddDiagnosis();
    } finally {
      if (!isDemoMode) setIsAnalyzing(false);
    }
  };

  const handleDelete = async (id) => {
    if (isDemoMode) {
      const target = diagnoses.find(d => d.id === id);
      if (target) {
        const newActive = diagnoses.filter(d => d.id !== id);
        const newTrash = [{ ...target, is_deleted: true, deleted_at: new Date().toISOString() }, ...trashDiagnoses];
        setDiagnoses(newActive);
        setTrashDiagnoses(newTrash);
        localStorage.setItem(ARCHIVE_KEY, JSON.stringify([...newActive, ...newTrash]));
      }
      setDeleteConfirmId(null);
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/diagnoses/${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchDiagnoses();
        setDeleteConfirmId(null);
      }
    } catch (err) {}
  };

  const handleRestore = async (id) => {
    if (isDemoMode) {
      const target = trashDiagnoses.find(d => d.id === id);
      if (target) {
        const newTrash = trashDiagnoses.filter(d => d.id !== id);
        const newActive = [{ ...target, is_deleted: false }, ...diagnoses];
        setDiagnoses(newActive);
        setTrashDiagnoses(newTrash);
        localStorage.setItem(ARCHIVE_KEY, JSON.stringify([...newActive, ...newTrash]));
      }
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/diagnoses/${id}/restore`, { method: 'POST' });
      if (response.ok) {
        await fetchDiagnoses();
      }
    } catch (err) {}
  };

  const handlePurge = async () => {
    if (isDemoMode) {
      setTrashDiagnoses([]);
      const active = diagnoses.filter(d => !d.is_deleted);
      localStorage.setItem(ARCHIVE_KEY, JSON.stringify(active));
      return;
    }
    try {
      const response = await fetch(`http://localhost:8000/api/diagnoses/purge`, { method: 'POST' });
      if (response.ok) {
        await fetchDiagnoses();
      }
    } catch (err) {}
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
    } catch (err) {}
  };

  const handleCsvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target.result;
      const lines = text.split('\n').filter(line => line.trim());
      // 첫 번째 줄은 헤더로 가정하고 나머지 데이터 파싱
      const rows = lines.slice(1);
      
      const bulkData = rows.map(row => {
        const cols = row.split(',');
        return {
          diagnosis: cols[0]?.trim() || "내용 없음",
          perspective: cols[1]?.trim() || "치료 단계 중심"
        };
      }).filter(item => item.diagnosis !== "내용 없음");

      // 자산 보호 정책: 완전히 동일한 내용+시간이 아닌 한 모두 인입
      const existingContents = diagnoses.map(d => d.rawContent);

      if (isDemoMode) {
        const newEntries = bulkData.map((item, i) => ({
          id: Date.now() + i,
          date: new Date().toLocaleString(),
          rawContent: item.diagnosis,
          summary: item.diagnosis.substring(0, 30) + "...",
          keywords: ["일괄 인입"],
          isDemo: true
        }));
        updateLocalStore([...newEntries, ...diagnoses]);
        setIsUploading(false);
        setIsSearchView(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:8000/api/diagnoses/bulk', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(bulkData)
        });
        if (response.ok) {
          await fetchDiagnoses();
          setIsSearchView(false);
        }
      } catch (err) {
        console.error("Bulk upload failed", err);
      } finally {
        setIsUploading(false);
      }
    };
    reader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    const csvContent = "diagnosis,perspective\n\"환자의 상태를 입력하세요\",\"치료 단계 중심\"\n\"복용 중인 약물을 입력하세요\",\"신장 보호 중심\"";
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "standard_diagnosis_template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const [showCsvHelp, setShowCsvHelp] = useState(false);

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
      // 키워드 필터링: 합집합(OR) 또는 교집합(AND) 선택 적용
      result = result.filter(d => {
        const itemKeys = (d?.keywords || []).map(k => k.trim());
        const selectedTrimmed = selectedKeywords.map(sk => sk.trim());
        
        if (isIntersection) {
          return selectedTrimmed.every(sk => itemKeys.includes(sk));
        } else {
          return selectedTrimmed.some(sk => itemKeys.includes(sk));
        }
      });
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(d => 
        (d?.rawContent || "").toLowerCase().includes(q) || (d?.keywords || []).some(k => k.toLowerCase().includes(q))
      );
    }
    return result;
  }, [diagnoses, selectedKeywords, searchQuery, isIntersection]);

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
            {isAnalyzing ? "지능형 키워드 추출 중..." : "진단 데이터 수집 및 구조화 시작"}
          </button>
        </div>
        <div style={{ marginTop: '40px', display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="text-link-btn" onClick={() => setIsSearchView(false)}>아카이브 맵 탐색기 열기</button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <label className="text-link-btn" style={{ cursor: 'pointer', border: '1px solid var(--border-glass)', padding: '8px 20px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)' }}>
              {isUploading ? "업로드 중..." : "CSV 일괄 업로드"}
              <input type="file" accept=".csv" style={{ display: 'none' }} onChange={handleCsvUpload} disabled={isUploading} />
            </label>
            <button className="icon-btn" style={{ padding: '8px', color: 'var(--secondary)', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '10px' }} onClick={() => setShowCsvHelp(true)}>
              <AlertTriangle size={20} />
            </button>
          </div>
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
              <h2 style={{ fontSize: '1.4rem' }} className="responsive-title">Clinical Data Discovery</h2>
            </div>
            <div className="badge-group">
              <div className="badge secondary" onClick={() => setViewMode('archive')} style={{ cursor: 'pointer', opacity: viewMode === 'archive' ? 1 : 0.6 }}>
                기록: {diagnoses.length}
              </div>
              <div className="badge secondary" onClick={() => setViewMode('trash')} style={{ cursor: 'pointer', opacity: viewMode === 'trash' ? 1 : 0.6, background: 'rgba(239, 68, 68, 0.1)' }}>
                휴지통: {trashDiagnoses.length}
              </div>
              <div className={`badge ${isDemoMode ? 'accent' : 'primary'}`} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                {isDemoMode ? <Globe size={12} /> : <RefreshCcw size={12} className={isLoadingHistory ? "spin" : ""} />}
                {isDemoMode ? '지능형 데모 모드' : '백엔드 동기화 모드'}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button 
              className={`nav-tab ${viewMode === 'archive' ? 'active' : ''}`} 
              onClick={() => setViewMode('archive')}
            >
              <Activity size={16} /> 활성 아카이브
            </button>
            <button 
              className={`nav-tab ${viewMode === 'trash' ? 'active' : ''}`} 
              onClick={() => setViewMode('trash')}
            >
              <Trash2 size={16} /> 휴지통
            </button>
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
            {allKeywords.map((kw, idx) => (
              <button key={kw} 
                className={`keyword-btn pastel-${(idx % 6) + 1} ${selectedKeywords.includes(kw) ? 'active' : ''}`} 
                onClick={() => toggleKeyword(kw)}>
                #{kw}
              </button>
            ))}
            {selectedKeywords.length > 0 && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="keyword-btn reset" onClick={() => { setSelectedKeywords([]); setIsIntersection(false); }}>필터 초기화</button>
                {selectedKeywords.length > 1 && (
                  <button 
                    className={`keyword-btn ${isIntersection ? 'active-logic' : 'inactive-logic'}`} 
                    onClick={() => setIsIntersection(!isIntersection)}
                    style={{ borderStyle: 'dashed' }}
                  >
                    {isIntersection ? "교집합(AND) 모드" : "합집합(OR) 모드"}
                  </button>
                )}
              </div>
            )}
          </div>
        </header>

        <main className="results-list">
          {viewMode === 'trash' && trashDiagnoses.length > 0 && (
            <div style={{ padding: '0 20px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-dim)' }}>* 휴지통을 비워도 백엔드 시스템에는 영구 보관됩니다.</span>
              <button className="reset-btn" style={{ color: 'var(--danger)' }} onClick={handlePurge}>휴지통 전체 비우기</button>
            </div>
          )}

          {(viewMode === 'archive' ? filteredDiagnoses : trashDiagnoses).length > 0 ? (viewMode === 'archive' ? filteredDiagnoses : trashDiagnoses).map((item, idx) => (
            <div key={item.id || idx} className="case-card" style={{ opacity: viewMode === 'trash' ? 0.7 : 1 }}>
              <div className="card-actions">
                {viewMode === 'archive' ? (
                  <>
                    <button className="action-btn" onClick={() => { setEditingDiagnosis(item); setEditText(item.rawContent); }}><Edit size={14} /></button>
                    <button className="action-btn delete" onClick={() => setDeleteConfirmId(item.id)}><Trash2 size={14} /></button>
                  </>
                ) : (
                  <button className="action-btn" onClick={() => handleRestore(item.id)} style={{ color: 'var(--primary)' }} title="복구"><RefreshCcw size={14} /></button>
                )}
              </div>
              <div className="case-meta">
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(item?.keywords || []).map(k => <span key={k} className="case-tag">#{k}</span>)}
                </div>
                <span className="case-date">{item?.date || item?.saved_at}</span>
              </div>
              <div className="case-body">{item?.rawContent}</div>
              {viewMode === 'archive' && (
                <div className="case-footer">
                  <button className="text-action-btn" onClick={() => setSelectedDiagnosis(item)}>구조화 JSON 리포트 확인</button>
                </div>
              )}
            </div>
          )) : (
            <div style={{ textAlign: 'center', padding: '100px', color: 'var(--text-dim)' }}>
              <Search size={48} style={{ opacity: 0.2, marginBottom: '20px' }} />
              <p>{viewMode === 'archive' ? '기록이 없습니다.' : '휴지통이 비어있습니다.'}</p>
              {viewMode === 'archive' && <button className="text-link-btn" style={{ marginTop: '12px' }} onClick={() => setSelectedKeywords([])}>모든 기록 보기</button>}
            </div>
          )}
        </main>
      </div>

      <aside className={`timeline-sidebar ${showSidebar ? 'active' : ''}`}>
        <div className="sidebar-header">
          <Clock size={20} className="text-dim" />
          <h3 style={{ fontSize: '1.1rem' }}>아카이브 타임라인</h3>
        </div>
        <div className="timeline-scroll">
          {(viewMode === 'archive' ? filteredDiagnoses : trashDiagnoses).map((d, i) => (
            <div key={d.id || i} className="timeline-item" onClick={() => { setIsSearchView(false); setSelectedDiagnosis(d); }}>
              <div className="timeline-title">{d?.summary || d?.rawContent?.substring(0, 30)}</div>
              <div className="timeline-tags">{(d?.keywords || []).slice(0, 3).map(k => <span key={k}>#{k}</span>)}</div>
            </div>
          ))}
        </div>
      </aside>
      
      {!isSearchView && (
        <button className="sidebar-toggle-btn" onClick={() => setShowSidebar(!showSidebar)}>
          {showSidebar ? <X size={24} /> : <Clock size={24} />}
        </button>
      )}
    </div>
  );

  return (
    <div className="app-container">
      {isSearchView ? renderLanding() : renderDashboard()}
      {deleteConfirmId && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <AlertTriangle size={48} color="var(--danger)" style={{ marginBottom: '16px' }} />
            <h3>휴지통으로 이동하시겠습니까?</h3>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginTop: '10px' }}>삭제된 데이터는 휴지통에서 언제든 복구할 수 있습니다.</p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button className="btn-submit" style={{ flex: 1, background: '#334155' }} onClick={() => setDeleteConfirmId(null)}>취소</button>
              <button className="btn-submit" style={{ flex: 1, background: 'var(--danger)' }} onClick={() => handleDelete(deleteConfirmId)}>이동</button>
            </div>
          </div>
        </div>
      )}
      {editingDiagnosis && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header"><h3>진단 기록 수정</h3><button className="icon-btn" onClick={() => setEditingDiagnosis(null)}><X size={20} /></button></div>
            <div className="modal-body" style={{ marginTop: '20px' }}>
              <textarea className="main-textarea" style={{ height: '200px', fontSize: '1.1rem', background: '#0a0c10', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }} value={editText} onChange={(e) => setEditText(e.target.value)}/>
              <button className="btn-submit" style={{ width: '100%', marginTop: '20px' }} onClick={handleUpdate}>저장</button>
            </div>
          </div>
        </div>
      )}
      {selectedDiagnosis && !editingDiagnosis && (
        <div className="modal-overlay" onClick={() => setSelectedDiagnosis(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><h3>Clinical Report</h3><button className="icon-btn" onClick={() => setSelectedDiagnosis(null)}><X size={20} /></button></div>
            <div className="modal-body"><div className="json-container"><pre>{JSON.stringify(selectedDiagnosis, null, 2)}</pre></div></div>
          </div>
        </div>
      )}

      {showCsvHelp && (
        <div className="modal-overlay" onClick={() => setShowCsvHelp(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px' }}>
            <div className="modal-header"><h3>CSV 업로드 가이드</h3><button className="icon-btn" onClick={() => setShowCsvHelp(false)}><X size={20} /></button></div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-dim)', marginBottom: '20px' }}>복잡한 데이터도 텍스트 중심으로 간단히 정리하여 업로드할 수 있습니다.</p>
              <div style={{ background: 'rgba(0,0,0,0.3)', padding: '15px', borderRadius: '8px', fontSize: '0.9rem', marginBottom: '20px' }}>
                <code style={{ color: 'var(--primary)' }}>diagnosis, perspective</code><br/>
                <code>"환자 소견 1", "치료 단계 중심"</code><br/>
                <code>"환자 소견 2", "신장 보호 중심"</code>
              </div>
              <button className="btn-submit" style={{ width: '100%', background: 'var(--secondary)' }} onClick={handleDownloadTemplate}>표준 양식(.CSV) 다운로드</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
