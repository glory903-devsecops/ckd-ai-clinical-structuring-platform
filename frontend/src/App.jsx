import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  BookOpen, 
  Layers, 
  Code2, 
  Search, 
  ChevronRight, 
  Database, 
  ExternalLink,
  ClipboardList
} from 'lucide-react';
import { mockResults, mockSources } from './mockData';

function App() {
  const [diseaseInput, setDiseaseInput] = useState('');
  const [perspective, setPerspective] = useState('치료 단계 중심');
  const [activeTab, setActiveTab] = useState('구조화 결과');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // 시연용 초기값 로드
  useEffect(() => {
    handleSearch('만성 콩팥병');
  }, []);

  const handleSearch = (disease = diseaseInput) => {
    if (!disease) return;
    
    setIsLoading(true);
    // AI 처리 시뮬레이션
    setTimeout(() => {
      const found = mockResults[disease]?.[perspective] || mockResults['만성 콩팥병'][perspective];
      setResult({
        disease,
        perspective,
        ...found
      });
      setIsLoading(false);
    }, 800);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="empty-state">
          <div className="logo-icon rotating" style={{ background: '#3b82f6' }}>
            <Activity size={20} />
          </div>
          <p>임상 문서를 분석하여 구조를 생성 중입니다...</p>
        </div>
      );
    }

    if (!result) return null;

    switch (activeTab) {
      case '구조화 결과':
        return (
          <div className="grid-2">
            <div className="main-sections">
              <h3 className="card-title"><Layers size={20} className="text-secondary" /> 맞춤형 구조화 정보</h3>
              {result.sections.map((section, idx) => (
                <div key={idx} className="card">
                  <h4 style={{ color: '#10b981', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ChevronRight size={18} /> {section.title}
                  </h4>
                  <ul style={{ listStyle: 'none' }}>
                    {section.items.map((item, i) => (
                      <li key={i} style={{ padding: '8px 0', borderBottom: i < section.items.length - 1 ? '1px solid #f1f5f9' : 'none', color: '#334155' }}>
                        • {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="side-info">
              <div className="card" style={{ background: '#f8fafc' }}>
                <h4 className="card-title">질환 개요</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#475569' }}>{result.overview}</p>
              </div>
              <div className="card" style={{ borderLeft: '4px solid #10b981' }}>
                <h4 className="card-title">정리 관점: {result.perspective}</h4>
                <p style={{ fontSize: '0.9rem', color: '#64748b' }}>{result.preference_desc}</p>
              </div>
              <div className="card">
                <h4 className="card-title">추출 키워드</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {result.keywords.map((kw, i) => (
                    <span key={i} className="badge">{kw}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case '참고 정보':
        return (
          <div>
            <h3 className="card-title"><Database size={20} className="text-secondary" /> 출처 및 근거 문서</h3>
            <div className="grid-cards">
              {mockSources.map((source, idx) => (
                <div key={idx} className="card source-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', background: '#ecfdf5', padding: '2px 8px', borderRadius: '4px' }}>
                      {source.topic}
                    </span>
                    <ExternalLink size={14} className="text-muted" />
                  </div>
                  <h4 style={{ fontSize: '1rem', marginBottom: '10px' }}>{source.title}</h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{source.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case '프롬프트 미리보기':
        return (
          <div className="card">
            <h3 className="card-title"><Code2 size={20} className="text-secondary" /> RAG Prompt Engineering</h3>
            <p style={{ marginBottom: '16px', fontSize: '0.9rem', color: '#64748b' }}>
              선택한 관점에 맞게 임상 정보를 추출하기 위해 LLM에 전달되는 최종 프롬프트 데이터입니다.
            </p>
            <div className="code-block">
              {result.prompt}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo-area">
          <div className="logo-icon">
            <Activity size={20} />
          </div>
          <div className="logo-text">
            <span style={{ color: '#10b981' }}>CKD</span> AI<br />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Clinical Structuring</span>
          </div>
        </div>

        <div className="config-group">
          <label className="label">질환명 입력</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="질환명을 입력하세요..." 
              value={diseaseInput}
              onChange={(e) => setDiseaseInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search 
              size={18} 
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', cursor: 'pointer' }} 
              onClick={() => handleSearch()}
            />
          </div>
        </div>

        <div className="config-group">
          <label className="label">정보 정리 기준 선택</label>
          <select 
            className="input-field select-field"
            value={perspective}
            onChange={(e) => {
              setPerspective(e.target.value);
              // 관점 변경 시 즉시 재검색 (시뮬레이션)
              if (diseaseInput || result) handleSearch(diseaseInput || result.disease);
            }}
          >
            <option>치료 단계 중심</option>
            <option>약물 기전 중심</option>
            <option>부작용 고려 중심</option>
            <option>복용 편의성 중심</option>
          </select>
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div className="card" style={{ background: '#f1f5f9', border: 'none', padding: '16px' }}>
            <h5 style={{ fontSize: '0.8rem', fontWeight: '700', marginBottom: '8px' }}>PoC Platform Notes</h5>
            <p style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: '1.4' }}>
              본 시스템은 의료적 판단을 제공하지 않습니다. 정보 구조화 프레임의 가능성을 검증하기 위한 PoC입니다.
            </p>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.7rem', color: '#cbd5e1', marginTop: '16px' }}>
            © 2024 Clinical Structuring PoC
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="tab-nav">
            {['구조화 결과', '참고 정보', '프롬프트 미리보기'].map(tab => (
              <div 
                key={tab} 
                className={`tab-item ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === '구조화 결과' && <ClipboardList size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />}
                {tab === '참고 정보' && <BookOpen size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />}
                {tab === '프롬프트 미리보기' && <Code2 size={16} style={{ verticalAlign: 'middle', marginRight: '6px' }} />}
                {tab}
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => handleSearch()}>
            정보 구조화 실행
          </button>
        </header>

        <div className="content-viewport">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
}

export default App;
