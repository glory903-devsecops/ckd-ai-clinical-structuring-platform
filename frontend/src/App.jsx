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
  ClipboardList,
  Stethoscope,
  Sparkles,
  Zap,
  Target
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
    }, 1200);
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="empty-state fade-in">
          <div className="logo-icon rotating" style={{ marginBottom: '24px' }}>
            <Zap size={24} />
          </div>
          <h2 style={{ marginBottom: '8px' }}>데이터 구조화 분석 중...</h2>
          <p style={{ color: 'var(--text-dim)' }}>최신 임상 가이드라인과 학술 소스를 병합하여 맞춤형 구조를 생성하고 있습니다.</p>
        </div>
      );
    }

    if (!result) return null;

    switch (activeTab) {
      case '구조화 결과':
        return (
          <div className="grid-2 fade-in">
            <div className="main-sections">
              <div className="card">
                <h3 className="card-title">
                  <Sparkles size={20} style={{ color: 'var(--primary)' }} /> 
                  정리 관점: {result.perspective}
                </h3>
                <p style={{ color: 'var(--text-dim)', marginBottom: '32px', fontSize: '1rem', lineHeight: '1.6' }}>
                  {result.preference_desc}
                </p>

                {result.sections.map((section, idx) => (
                  <div key={idx} style={{ marginBottom: '32px' }}>
                    <h4 style={{ color: 'white', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.1rem' }}>
                      <Target size={18} style={{ color: 'var(--secondary)' }} /> {section.title}
                    </h4>
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {section.items.map((item, i) => (
                        <div key={i} className="structuring-item">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="side-info">
              <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
                <h4 className="card-title" style={{ fontSize: '1rem' }}><Stethoscope size={18} /> 질환 개요</h4>
                <p style={{ fontSize: '0.95rem', lineHeight: '1.7', color: 'var(--text-dim)' }}>{result.overview}</p>
              </div>
              
              <div className="card">
                <h4 className="card-title" style={{ fontSize: '1rem' }}><Layers size={18} /> 핵심 키워드</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {result.keywords.map((kw, i) => (
                    <span key={i} className="badge">{kw}</span>
                  ))}
                </div>
              </div>

              <div className="card" style={{ background: 'rgba(99, 102, 241, 0.05)', borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                <h5 style={{ color: 'var(--secondary)', marginBottom: '12px', fontSize: '0.9rem', fontWeight: '700' }}>Platform Intelligence</h5>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
                  본 브리핑은 KDIGO 2024 권고안 및 최신 RCT 데이터를 기반으로 실시간 구조화되었습니다.
                </p>
              </div>
            </div>
          </div>
        );
      case '참고 정보':
        return (
          <div className="fade-in">
            <h3 className="card-title"><Database size={20} style={{ color: 'var(--secondary)' }} /> 데이터 소스 및 임상 근거</h3>
            <p style={{ color: 'var(--text-dim)', marginBottom: '32px' }}>구조화에 활용된 원문 소스 조각들입니다. 각 내역은 벡터 임베딩을 통해 추출되었습니다.</p>
            <div className="grid-cards">
              {mockSources.map((source, idx) => (
                <div key={idx} className="card source-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span className="badge" style={{ margin: 0 }}>
                      {source.topic}
                    </span>
                    <ExternalLink size={16} className="text-dim" />
                  </div>
                  <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'white' }}>{source.title}</h4>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: '1.6' }}>{source.snippet}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case '프롬프트 미리보기':
        return (
          <div className="card fade-in">
            <h3 className="card-title"><Code2 size={20} style={{ color: 'var(--accent)' }} /> RAG Logic & Prompt Engineering</h3>
            <p style={{ marginBottom: '24px', fontSize: '0.95rem', color: 'var(--text-dim)' }}>
              선택한 관점에 따른 지식 추출을 위해 LLM(GPT-4o)에 전달되는 시스템 지시어와 컨텍스트 구조입니다.
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
            <Activity size={24} />
          </div>
          <div className="logo-text">
            CKD AI<br />
            <span style={{ fontSize: '0.85rem', fontWeight: '500', opacity: 0.7 }}>Platform Workspace</span>
          </div>
        </div>

        <div className="config-group">
          <label className="label">대상 질환</label>
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
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', cursor: 'pointer' }} 
              onClick={() => handleSearch()}
            />
          </div>
        </div>

        <div className="config-group">
          <label className="label">정리 프레임워크</label>
          <select 
            className="input-field select-field"
            value={perspective}
            onChange={(e) => {
              setPerspective(e.target.value);
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
          <div className="card" style={{ background: 'rgba(255, 255, 255, 0.05)', padding: '20px', border: '1px solid var(--border-glass)' }}>
            <h5 style={{ fontSize: '0.85rem', fontWeight: '700', marginBottom: '8px', color: 'var(--secondary)' }}>PoC Scope Disclaimer</h5>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', lineHeight: '1.5' }}>
              본 제품은 정보 탐색 경험의 혁신을 제안하는 PoC 프로젝트입니다. 실제 처방이나 진단에는 활용될 수 없습니다.
            </p>
          </div>
          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '24px', opacity: 0.5 }}>
            © 2024 Clinical Structuring Agent
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div className="tab-nav">
            {[
              { id: '구조화 결과', icon: <ClipboardList size={18} /> },
              { id: '참고 정보', icon: <BookOpen size={18} /> },
              { id: '프롬프트 미리보기', icon: <Code2 size={18} /> }
            ].map(tab => (
              <div 
                key={tab.id} 
                className={`tab-item ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.id}
              </div>
            ))}
          </div>
          <button className="btn-primary" onClick={() => handleSearch()}>
            브리핑 생성하기
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
