// Clinical Diagnosis Discovery Platform (CDDP) - High-Fidelity Demo Data

export const initialDiagnoses = [
  {
    id: 101,
    date: "2024-04-16 10:15",
    rawContent: "72세 여성 환자, 사구체신염 기왕력. 최근 사지 부종 및 단백뇨(3+) 관찰됨. 혈청 크레아티닌 수치 2.1mg/dL로 상승하여 CKD Stage 4 진입 의심. 저염식 및 이뇨제 조절이 필요한 상태.",
    summary: "사구체신염 악화 및 CKD 4단계 진입",
    keywords: ["사구체신염", "CKD 4", "단백뇨", "부종", "고령"],
    perspective: "치료 단계 중심"
  },
  {
    id: 102,
    date: "2024-04-15 14:30",
    rawContent: "45세 남성, 제2형 당뇨병 15년차. 미세단백뇨 관찰되어 SGLT2 억제제(Dapagliflozin) 처방 검토 중. 심부전 합병증 예방을 위한 조기 중재 필요.",
    summary: "당뇨병성 신증 초기 SGLT2i 도입",
    keywords: ["당뇨병", "미세단백뇨", "SGLT2i", "Dapagliflozin", "합병증 예방"],
    perspective: "합병증 관리 중심"
  },
  {
    id: 103,
    date: "2024-04-14 09:10",
    rawContent: "만성 신부전 환자, 최근 혈청 칼륨 수치 5.8mEq/L로 상승. ACE 억제제 일시 중단 및 칼륨 결합제 투여 시작. 고칼륨혈증 식단 가이드 제공 완료.",
    summary: "고칼륨혈증 응급 관리",
    keywords: ["고칼륨혈증", "ACE 억제제", "칼륨 결합제", "식단 조절"],
    perspective: "안전성 중심"
  },
  {
    id: 104,
    date: "2024-04-13 16:45",
    rawContent: "투석 대기 중인 55세 여성 환자. 조혈제(EPO) 투여에도 불구하고 헤모글로빈 수치 8.5g/dL로 저하됨. 철분 보충 요법 병행 검토.",
    summary: "신부전성 빈혈 고도화 치료",
    keywords: ["빈혈", "EPO", "철분 요법", "헤모글로빈"],
    perspective: "합병증 관리 중심"
  },
  {
    id: 105,
    date: "2024-04-12 11:30",
    rawContent: "복용 순응도가 낮은 고혈압 및 초기 CKD 환자. 1일 1회 복합제(ARB+CCB)로 전환하여 혈압 조절 최적화 시도.",
    summary: "복약 순응도 개선 처방",
    keywords: ["고혈압", "복용 순응도", "복합제", "혈압 조절"],
    perspective: "복용 편의성 중심"
  }
];

export const keywordDictionary = [
  "사구체신염", "CKD 4", "단백뇨", "부종", "고령", "당뇨병", "미세단백뇨", 
  "SGLT2i", "Dapagliflozin", "합병증 예방", "고칼륨혈증", "ACE 억제제", 
  "칼륨 결합제", "식단 조절", "빈혈", "EPO", "철분 요법", "헤모글로빈", 
  "고혈압", "복용 순응도", "복합제", "혈압 조절"
];

export const mockSources = [
  {
    title: "KDIGO 2024 Clinical Practice Guideline",
    topic: "CKD Management",
    snippet: "This guideline provides evidence-based recommendations for all aspects of CKD management, emphasizing early detection and the use of SGLT2 inhibitors."
  },
  {
    title: "SGLT2i in Kidney Protection: Clinical Evidence",
    topic: "Therapeutic Strategy",
    snippet: "Recent trials demonstrate significant renal risk reduction with SGLT2i across various patient profiles."
  }
];
