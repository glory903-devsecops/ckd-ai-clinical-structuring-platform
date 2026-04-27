# Clinical Data Discovery Platform (CDDP)

<div align="center">
  <a href="https://glory903-devsecops.github.io/ckd-ai-clinical-structuring-platform/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/Live_Demo-Interactive_Mode-059669?style=for-the-badge&logo=github" alt="Live Demo" />
  </a>
</div>

<br/>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />
  <img src="https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/Playwright-2EAD33?style=for-the-badge&logo=playwright&logoColor=white" alt="Playwright" />
</div>

<br/>

의료 전문가의 실시간 진단 내용을 지능형 아카이브로 통합하고, 키워드 기반의 전방위 탐색을 지원하는 **의료진 간 지식 생태계(Clinical Wiki)** 통합 플랫폼입니다. 이번 업데이트로 1,000건 이상의 대규모 임상 데이터를 원활하게 스크롤 및 필터링할 수 있도록 고도화되었습니다.

---

## 🌟 핵심 가치 (Value Proposition)

단순한 데이터 저장소를 넘어 의료 기입 양식을 규격화하고, 데이터가 모일수록 "나무위키"와 같이 임상 지식 기반으로 성장하는 생태계를 구축합니다.

- **Centered Ingestion**: 첫 화면 집중 모드를 통한 빠른 진단 데이터 인입 및 템플릿 지원.
- **Clinical Wiki (MVP)**: 태그 호버 시 최신 가이드라인 및 관련 케이스를 요약해제공하는 툴팁 기능. 전문의 간의 지식 공유 기반을 제공합니다.
- **Intelligent Discovery**: 자동 추출된 키워드 맵을 통한 합집합(OR)/교집합(AND) 실시간 필터링. 1000건 이상의 데이터도 버벅임 없이 처리.
- **Data Export & Portability**: 필터링된 전체 결과 혹은 선택한 특정 임상 케이스만 CSV 포맷으로 안전하게 추출하여 다른 의사들과 손쉽게 공유.

---

## 📸 주요 기능 시연 (Feature Highlight)

_(※ 데모 시연 이미지는 로컬 구동 혹은 Live Demo에서 직접 확인하실 수 있습니다.)_

### 1. 지식 위키 및 하이브리드 탐색 (Clinical Wiki & Discovery)
> 분석된 임상 키워드를 클릭하거나 마우스 호버(Hover) 시, 해당 키워드와 관련된 지식을 함께 탐색할 수 있습니다. 
> CSV 일괄 등록 가이드 도우미를 통해, 다른 의사의 지식을 표준 양식으로 손쉽게 업로드할 수 있습니다.
(이미지 영역 - 추후 실제 스크린샷 연동 가능)

### 2. CSV 커스텀 익스포트 (Data Portability)
> 1,000건의 데이터 중 특정 키워드(예: `#사구체신염`)로 좁혀진 검색 결과, 혹은 직접 체크박스로 선택한 유의미한 항목들만 즉시 `.csv` 파일로 출력(Export)하여 보고서나 이메일 공유에 활용할 수 있습니다.

---

## 🛠️ 주요 아키텍처

- **대용량 에셋 최적화**: Vite 컴파일러 메모리 터짐 방지를 위해 `mock1000.json`을 정적 에셋(Static Asset)화 하여 런타임에 Lazy Fetching 수행.
- **체크박스 & CSV 스트리밍 블롭(Blob)**: 클라이언트 환경에서 즉석으로 필터링된 Array 객체를 CSV String으로 변환 후 UTF-8 BOM을 삽입하여 엑셀(Excel) 한글 깨짐 방지 구현.

---

## 🚀 시작하기 & 테스트

### 로컬 환경 (Full Architecture)
1. 리포지토리 클론
2. Docker Compose 실행:
   ```bash
   docker-compose -p ckd-platform up -d --build
   ```
3. 접속:
   - **Frontend (Platform)**: `http://localhost:80`
   - **Backend API**: `http://localhost:8000`

### 데이터 무결성 검증 (Automated UI Test)
플랫폼의 기능(체크박스 동작, CSV 익스포트 비활성화 토글 처리, CSV 업로드)을 검증하는 자동화 코드는 `tests/ui_test.py`에 구현되어 있습니다.
```bash
# 가상환경 활성화 후
pip install playwright
playwright install chromium
python tests/ui_test.py
```

### 데모 사이트 체험 (Interactive Mode)
GitHub Pages를 통해 제공되는 **[데모 사이트 (여기를 클릭하세요)](https://glory903-devsecops.github.io/ckd-ai-clinical-structuring-platform/)** 에서는 별도의 API 서버가 없더라도 1,000건의 임상 데이터를 직접 필터링하고 CSV로 출력해보는 전체 과정을 체험할 수 있습니다.

---
Developed by Glory Deepmind CDA Team.
