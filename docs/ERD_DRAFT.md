# 데이터 엔티티 설계 (ERD Draft)

본 플랫폼의 데이터 구조는 RAG 파이프라인과 사용자 개인화 설정을 관리하기 위해 설계되었습니다.

## 1. 핵심 엔티티 (Entities)

### (1) Document (임상 문서)
- `id`: PK
- `title`: 문서 제목 (가이드라인 혹은 논문명)
- `category`: 가이드라인, 임상 데이터, 약물 정보 등
- `raw_content`: 원본 텍스트/파일 경로
- `metadata`: 발행 기관, 년도, 수집 날짜

### (2) Chunk (문서 조각)
- `id`: PK
- `document_id`: FK
- `vector_embedding`: n-dimensional vector
- `text_segment`: 분할된 텍스트 내용
- `page_number`: 출처 페이지 정보

### (3) Perspective (정리 관점)
- `id`: PK (Enum: 치료 단계, 약물 기전 등)
- `name_kr`: 한국어 명칭
- `system_prompt_template`: 해당 관점을 구현하기 위한 고유 프롬프트 템플릿

### (4) StructuringLog (구조화 로그)
- `id`: PK
- `user_id`: 사용자 식별자
- `disease_name`: 입력된 질환명
- `perspective_id`: 사용된 관점 FK
- `generated_output`: AI가 생성한 최종 구조화 데이터 (JSON)
- `created_at`: 생성 일시

## 2. 관계성 (Relationships)
- 하나 혹은 여러 개의 `Document`는 다수의 `Chunk`를 가짐 (1:N)
- `StructuringLog`는 하나의 `Perspective`를 참조함 (N:1)
- `StructuringLog`는 생성에 사용된 특정 `Chunk`들의 ID 리스트를 포함하여 근거를 유지함

## 3. 데이터 흐름 (PoC 특이사항)
- PoC 버전에서는 별도의 RDBMS 없이 `data/sample/` 디렉토리 내의 JSON 형태 정적 데이터를 엔티티로 간주하여 처리합니다.
- 복잡한 정규화보다는 프론트엔드와 LLM 간의 스키마 정합성에 우선순위를 둡니다.
