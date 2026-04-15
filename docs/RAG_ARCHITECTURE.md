# RAG 아키텍처 설계 (RAG Architecture)

본 플랫폼은 데이터의 최신성과 정확성을 확보하기 위해 RAG(Retrieval-Augmented Generation) 기반의 지식 추출 파이프라인을 사용합니다.

## 1. 아키텍처 개요
의료진이 입력한 "질환명"과 선택한 "정리 관점"은 Query Rewrite 과정을 거쳐 벡터 검색에 최적화된 형태로 변환됩니다. 검색된 컨텐츠는 관점 기반 프롬프트와 결합되어 구조화된 결과를 생성합니다.

## 2. 주요 컴포넌트

### (1) Retrieval Layer (검색 계층)
- **Vector Store**: 임상 가이드라인(PDF), 학술 자료(Journal)를 Chunk 단위로 분할하여 임베딩 저장
- **Hybrid Search**: 키워드 기반 BM25 검색과 시맨틱 임베딩 검색을 병행하여 의학 용어의 정확도 보장

### (2) Chain/Orchestration Layer (오케스트레이션 계층)
- **Perspective Transformer**: 사용자가 선택한 '관점(치료 단계, 기전 등)'에 따라 검색된 정보를 재분류하고 요약하는 체인
- **Refinement Step**: 생성된 결과가 원본 문서의 데이터와 어긋나지 않는지 검증하는 단계 포함

### (3) Prompt Strategy (프롬프트 전략)
- **System Prompt**: 시니어 임상 분석가(Medical Analyst) 페르소나 부여
- **Structuring Frame**: JSON 형태로 구조를 사전 정의하여 UI 컴포넌트와 연동성 강화

## 3. 정보 구조화 흐름 (Data Flow)
1. **Input**: `Disease = "CKD"`, `Perspective = "Mechanism"`
2. **Retrieve**: "CKD Guidelines", "Drug MOA Papers"에서 관련 텍스트 추출
3. **Analyze**: 추출된 텍스트 중 MOA와 관련된 항목(RAASi, SGLT2i 등) 식별
4. **Reshape**: '기전 중심' 템플릿에 맞춰 헤더와 리스트 형태로 재구성
5. **Output**: UI 상의 '구조화 결과' 탭으로 전송

## 4. PoC 구현의 특이사항
- 현재 PoC 버전은 서버 부하 방지 및 즉각적인 시연을 위해 정제된 임상 데이터셋 기반의 **Mock Retrieval** 과정을 포함합니다.
- 실제 배포 시 LangChain의 `ChromaDB` 혹은 `Pinecone`과 연동 가능하도록 모듈화되어 있습니다.
