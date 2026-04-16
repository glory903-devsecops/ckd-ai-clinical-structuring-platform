# Clinical Diagnosis Discovery Platform (CDDP)

의료 전문가의 실시간 진단 내용을 지능형 아카이브로 통합하고, 키워드 기반의 전방위 탐색을 지원하는 임상 지식 구조화 플랫폼입니다.

[Live Demo (Interactive Mode)](https://glory903.github.io/ckd-ai-clinical-structuring-platform/)

## 🌟 핵심 가치 (Value Proposition)

본 플랫폼은 파편화된 의료 진단 데이터를 수집하는 단계를 넘어, 의료진이 본인의 데이터를 능동적으로 탐색하고 관리할 수 있는 **지능형 아카이브** 환경을 제공합니다.

- **Centered Ingestion**: 전문가의 사고 흐름을 방해하지 않는 몰입형 입력 환경.
- **Intelligent Discovery**: 자동 추출된 키워드 맵을 통한 수만 건의 데이터 실시간 필터링.
- **Interoperability**: 표준화된 JSON 리포트 생성을 통한 외부 HIS 시스템과의 연동성 확보.
- **Full Control (CRUD)**: 전문가가 직접 진단 내역을 수정하고 최적화할 수 있는 데이터 관리 기능.

## 🛠️ 주요 기능

- **Immersive Entry**: 첫 화면 집중 모드를 통한 빠른 진단 데이터 인입.
- **Hybrid Search Bar**: 텍스트 검색과 키워드 필(Pill)을 결합한 하이브리드 탐색.
- **Persistent Archive**: 브라우저 로컬 저장소 및 서버 영구 DB를 통한 데이터 보존.
- **Diagnostic Report**: AI 기반의 임상 데이터 구조화 및 JSON 시각화.

## 🚀 시작하기

### 로컬 환경 (Full Architecture)
1. 리포지토리 클론
2. Docker Compose 실행:
   ```bash
   docker-compose -p ckd-platform up -d --build
   ```
3. 접속:
   - **Frontend (Platform)**: `http://localhost:80`
   - **Backend API**: `http://localhost:8000`
   - **Expert UI (Streamlit)**: `http://localhost:8501`

### 데모 사이트 (Interactive Mode)
GitHub Pages를 통해 제공되는 [데모 사이트](https://glory903.github.io/ckd-ai-clinical-structuring-platform/)에서는 별도의 서버 설치 없이 브라우저 단에서 모든 CRUD 기능을 체험해 보실 수 있습니다.

---
Developed by Glory Deepmind CDA Team.
