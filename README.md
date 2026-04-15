# CKD AI Clinical Information Structuring Platform (PoC)

<p align="center">
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=Vite&logoColor=white" />
  <img src="https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=React&logoColor=black" />
  <img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=Python&logoColor=white" />
  <img src="https://img.shields.io/badge/LangChain-1C3C3C?style=for-the-badge&logo=LangChain&logoColor=white" />
  <img src="https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=GitHub-Actions&logoColor=white" />
</p>

### 🌐 [Live Demo 바로가기](https://glory903-devsecops.github.io/ckd-ai-clinical-structuring-platform/)

본 프로젝트는 의료진의 개별적인 정보 정리 관점(**Mental Model**)에 따라 방대한 임상 데이터를 실시간으로 재구성하여 제공하는 **AI 기반 임상 정보 구조화 워크스페이스**의 PoC(Proof of Concept)입니다.

---

## 💎 Project Vision: "From Searching to Structuring"
제약 디지털 마케팅 및 HCP 플랫폼 환경에서 의료진은 매일 쏟아지는 방대한 데이터를 처리해야 합니다. 본 프로젝트는 단순히 정보를 나열하는 검색 엔진의 단계를 넘어, **사용자가 정의한 '관점'으로 정보를 즉각 재배치**함으로써 의료진의 인지적 부담을 해결하는 것을 목표로 합니다.

## ⚠️ 문제 정의 (Problem Statement)
- **정보의 비표준화 및 파편화**: 동일 질환이라도 병원별, 의료인별로 정보를 수집하고 정리하는 방식이 상이하여 **데이터 통합 및 상호운용성**에 큰 장애가 발생합니다.
- **Mental Model의 파편화**: 의료인 개개인마다 정보를 이해하는 '정리 기준'이 다르기 때문에, 고정된 UI 구조의 기존 플랫폼은 정보를 다시 머릿속에서 재구성해야 하는 비효율을 초래합니다.
- **데이터 전처리의 한계**: 텍스트 형태의 임상 정보를 자신만의 RAG(Retrieval-Augmented Generation)로 구축하려 할 때, 전문가의 관점이 반영된 고도화된 **전처리 엔진**의 부재가 프로젝트의 병목이 됩니다.

## 🎨 Design Philosophy: "Clinical, Reliable, Minimal"
본 플랫폼의 인터페이스는 신뢰도 높은 전문가용 도구로서의 가치를 극대화하기 위해 다음과 같은 디자인 원칙을 준수합니다.
- **Glassmorphism**: 정교한 배경 블러(Blur)와 반투명 효과를 통해 레이어 간의 깊이감을 형성하고 현대적인 SaaS 느낌을 구현했습니다.
- **Midnight & Emerald Theme**: 신뢰를 상징하는 Deep Slate와 활력을 의미하는 Emerald 컬러를 조화시켜 임상 현장에 어울리는 미학적 균형을 맞췄습니다.
- **Micro-Interactions**: 질환 분석 시의 스캐닝 애니메이션 및 탭 전환 효과를 통해 AI가 정보를 처리하는 과정의 투명성과 사용자 경험을 개선했습니다.

## 🛠 Core Features
- **Dynamic Perspective Structuring**: '치료 단계', '약물 기전', '부작용' 등 의료진의 관심사에 따른 결과물 동적 생성.
- **Evidence-Based RAG Card**: 구조화된 각 항목의 근거가 되는 원본 문서 조각(Chunk)을 즉시 매칭하여 제시.
- **Prompt Engineering Visibility**: AI가 정보를 처리하는 논리(System Prompt)를 투명하게 공개하여 시스템의 신뢰성 보완.
- **Premium Dashboard UI**: 고도화된 타이포그래피와 레이아웃을 반영한 전문가용 워크스페이스 제공.

## 📂 Project Structure
```text
ckd-ai-clinical-structuring-platform/
├── frontend/           # 프리미엄 데모 사이트 (Vite + React)
│   ├── src/App.jsx     # UI 로직 및 데이터 인터렉션
│   └── src/index.css   # Glassmorphism 기반 프리미엄 스타일링
├── app/                # Python 백엔드 아키텍처 (LangChain Skeleton)
│   ├── chains/         # 정보 구조화 체인 로직
│   └── retrieval/      # 벡터 데이터 추출 엔진
├── docs/               # 한국어 상세 설계 및 기획 문서
└── .github/workflows/  # 자동 배포 (GitHub Pages) 파이프라인
```

---

## 🏠 시작하기

### Docker를 이용한 즉각 실행 (추천)
프로젝트 루트 폴더에서 아래 명령어를 입력하면 프론트엔드와 백엔드가 각각 컨테이너로 빌드 및 실행됩니다.
```bash
docker-compose up --build
```
- **프론트엔드**: [http://localhost:80](http://localhost:80)
- **백엔드(참조용)**: [http://localhost:8501](http://localhost:8501)

### 로컬 개발 환경 실행
#### 프론트엔드 (React Dashboard)
```bash
cd frontend
npm install
npm run dev
```

#### 백엔드 아키텍처 (Python Skeleton)
```bash
pip install -r requirements.txt
streamlit run app/main.py
```

---

## ⚖️ Legal Disclaimer
- 본 플랫폼은 의료진의 의사결정을 지원하기 위한 시뮬레이션 도구이며, 진단이나 처방을 목적으로 하지 않습니다.
- 모든 결과물은 PoC를 위해 구축된 샘플 임상 데이터(CKD 중심)를 바탕으로 생성됩니다.

---
© 2024 CKD AI Clinical Structuring Platform Project.
