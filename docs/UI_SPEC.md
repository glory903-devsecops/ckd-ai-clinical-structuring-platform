# UI 명세서 (UI Specification)

## 1. 디자인 원칙 (Design Principles)
- **Clinical & Professional**: 의료 IT 솔루션의 신뢰성을 위해 Emerald와 Slate 컬러 중심의 차분한 톤 유지
- **Structured Layout**: 정보의 구조화가 목적인 시스템인 만큼 그리드와 경계선을 명확히 하여 시각적 위계 확립
- **Low Noise**: 마케팅 요소보다는 데이터 중심의 미니멀리즘 준수

## 2. 주요 페이지 구성

### (1) Sidebar (Input Area)
- **Top Section**: 로고 및 플랫폼 명칭 (PoC 표시)
- **Disease Input**: 질환명 검색창 (Autocomplete 연동 가능 구조)
- **Perspective Selection**: 4개 핵심 관점 중 하나를 선택하는 Dropdown
- **Note**: 면책 고지 및 버전 정보 표시

### (2) Main Dashboard (Output Area)
- **Header**: 로드된 결과에 대한 메타 데이터 (질환명, 관점) 및 실행 버튼
- **Tab Navigation**: 3단계 탭 (구조화 결과, 참고 정보, 프롬프트 미리보기)

### (3) Tab 1: 구조화 결과
- **Left Panel (Main Result)**: 아코디언 혹은 카드 리스트 형태로 구조화된 치료 지침 표시 (트리 구조)
- **Right Panel (Summary)**: 텍스트 형태의 질환 개요 및 추출된 임상 키워드 칩(Chip)

### (4) Tab 2: 참고 정보
- **Source Grid**: 검색된 원본 문서들의 제목, 주제, 요약 내용을 카드 형태로 나열
- **Detail View**: 클릭 시 원본 문서 링크 혹은 텍스트 조각 팝업 연결

### (5) Tab 3: 프롬프트 미리보기
- **Status Display**: AI 모델에 전송된 시스템 프롬프트 및 컨텍스트 코드 블록 표시 (개발 및 검증용)

## 3. 인터랙션 디테일
- **Loading State**: 정보 구조화 실행 시 회전하는 스피너 아이콘과 함께 "분석 중" 상태 표시
- **Responsive**: 데스크탑 고해상도 환경에 최적화된 2단 그리드 레이아웃 적용
