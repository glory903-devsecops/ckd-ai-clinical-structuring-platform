# CKD AI Clinical Information Structuring Platform (PoC)

### 🔗 [Live Demo 바로가기](https://glory903-devsecops.github.io/ckd-ai-clinical-structuring-platform/)

본 저장소는 의료진의 정보 정리 관점(Mental Model)에 맞춰 임상 정보를 구조화하는 AI 기반 워크스페이스의 PoC(Proof of Concept) 프로젝트입니다.

## 1. 프로젝트 개요
제약 디지털 마케팅 및 HCP(Healthcare Professional) 플랫폼 기획 단계에서 제안되는 시스템으로, 의료진이 방대한 임상 데이터 속에서 **자신이 선호하는 구조**로 정보를 즉각 재구성하여 탐색할 수 있는 경험을 제공합니다.

- **핵심 가치**: "찾기"에서 "정리된 결과 보기"로의 패러다임 전환
- **주요 대상**: 신장내과 전문의, 전공의, MSL(Medical Science Liaison) 등

## 2. 문제 정의 (Pain Point)
- **정보 과잉**: 최신 가이드라인, 학술지, 약물 정보가 여러 곳에 산재되어 있음
- **정리 기준의 파편화**: 동일 질환이라도 의료진의 관심사에 따라 정보를 정리하는 방식(치료 단계 vs 약물 기전 vs 부작용 등)이 다름
- **비효율적 탐색**: 플랫폼이 제공하는 고정된 UI 구조로 인해 의료진은 정보를 다시 머릿속에서 재구성해야 하는 인지적 부담을 가짐

## 3. 솔루션 개념 (Solution Concept)
본 플랫폼은 **Decision Support(진단/처방)** 시스템이 아닌 **Information Structuring(정보 구조화)** 도구입니다. 사용자가 선택한 '관점'에 따라 RAG(Retrieval-Augmented Generation) 기술이 문맥을 재배치합니다.

### 주요 정리 관점 예시:
- **치료 단계 중심**: 병기(Stage 1~5)에 따른 표준 관리 경로
- **약물 기전 중심**: MOA(작용 기전) 및 계열별 약리적 특성
- **부작용 고려 중심**: 안전성 프로파일 및 환자별 금기 사항
- **복용 편의성 중심**: 투여 경로, 빈도 및 환자 순응도 최적화

## 4. 데모 사이트 실행 방법

### 프론트엔드 (React Dashboard)
1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. 브라우저에서 `localhost:5173` 접속

### 백엔드 아키텍처 (Python Skeleton - 선택 사항)
향후 LLM 연동 및 파이프라인 확장을 위한 모듈형 구조가 `app/` 폴더에 구현되어 있습니다.
1. `pip install -r requirements.txt`
2. `streamlit run app/main.py`

## 5. 폴더 구조
```text
ckd-ai-clinical-structuring-platform/
├── app/                # Python 백엔드/체인 로직 (Skeleton)
│   ├── chains/         # LangChain 기반 구조화 체인
│   ├── retrieval/      # 벡터 스토어 및 리트리버 로 로직
│   ├── services/       # 비즈니스 워크플로우 서비스
│   ├── ui/             # Streamlit 레이아웃 (Reference)
│   └── prompts/        # 시스템/유저 프롬프트 템플릿
├── frontend/           # 프리미엄 데모 사이트 (Vite + React)
├── data/               # 시연용 샘플 임상 데이터
├── docs/               # 설계 및 명세 문서 (Korean)
└── .github/workflows/  # 자동 배포 설정
```

## 6. 배포 가이드
본 프로젝트의 데모 사이트는 GitHub Actions를 통해 GitHub Pages로 자동 배포되도록 설정되어 있습니다.

## 7. 법적 고지 및 범위
- 본 시스템은 의료진의 의사결정을 지원하거나 진단/처방을 권고하지 않습니다.
- 제공되는 정보는 검증된 가이드라인과 논문에 기반한 구조화 시뮬레이션입니다.
- PoC 단계에서는 정해진 샘플 데이터(만성 콩팥병 중심)를 통해 UX 가능성을 검증합니다.
