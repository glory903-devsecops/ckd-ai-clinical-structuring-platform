export const mockResults = {
  "만성 콩팥병": {
    "치료 단계 중심": {
      overview: "만성 콩팥병(CKD)은 사구체 여과율의 저하와 신장 손상의 증거가 3개월 이상 지속되는 상태입니다. 치료의 핵심 목적은 말기 신부전(ESRD)으로의 진행을 늦추고 심혈관계 합병증을 관리하는 것입니다.",
      preference_desc: "신장 기능(eGFR) 단계별 표준 관리 지침(KDIGO 2024 기반)을 중심으로 정보를 재구성하였습니다.",
      sections: [
        {
          title: "초기 단계 (Stage 1-2): 신장 손상 억제",
          items: [
            "원인 질환(고혈압, 당뇨)의 엄격한 조절",
            "RAAS 억제제(ACEI/ARB) 처방 고려",
            "생활 습관 개선: 저염식, 금연, 체중 관리"
          ]
        },
        {
          title: "중기 단계 (Stage 3a-3b): 합병증 모니터링",
          items: [
            "SGLT2 억제제 병용 투여 권고 강화",
            "빈혈 및 골미네랄 대사 이상 스크리닝",
            "심혈관계 위험 인자 집중 관리"
          ]
        },
        {
          title: "말기 단계 (Stage 4-5): 투석 준비 및 관리",
          items: [
            "투석 경로 확보 및 신대체 요법 교육",
            "고칼륨혈증 및 대사성 산증 교정",
            "투여 약물의 용량 조정 및 신독성 약물 금기"
          ]
        }
      ],
      keywords: ["KDIGO 가이드라인", "eGFR 분류", "RAASi", "SGLT2i"],
      prompt: `[System] 시니어 임상 분석가로서 입력된 문서를 '치료 단계' 중심으로 구조화하라.
[Context] KDIGO 2024 가이드라인 및 SGLT2i 임상 데이터...
[User] 질환: 만성 콩팥병, 관점: 치료 단계 중심`
    },
    "약물 기전 중심": {
      overview: "CKD 치료제는 신장 내 압력 저하, 섬유화 억제, 대사 개선 등 다양한 기전을 통해 작용합니다. 최근 'Four Pillars' 요법이 표준으로 자리잡고 있습니다.",
      preference_desc: "약물의 생화학적 작용 원리와 계열별 차별점을 기반으로 정보를 구조화하였습니다.",
      sections: [
        {
          title: "Blood Pressure & RAAS 블로커",
          items: [
            "ACE 억제제 및 ARB: 사구체 내압 감소 및 단백뇨 개선",
            "MRA (Finerenone): 비스테로이드성 무기질코르티코이드 수용체 길항을 통한 염증 및 섬유화 억제"
          ]
        },
        {
          title: "Metabolic & SGLT2 억제제",
          items: [
            "포도당 및 나트륨 재흡수 억제: Tubuloglomerular feedback 회복",
            "심혈관계 및 신장 보호 효과의 독립적 기전 입증"
          ]
        }
      ],
      keywords: ["MOA", "Pillars Therapy", "Finerenone", "Hemodynamics"],
      prompt: `[System] 시니어 임상 분석가로서 입력된 문서를 '약물 기전' 중심으로 구조화하라.
[Context] 약리학 교과서 및 최신 3상 임상 논문...
[User] 질환: 만성 콩팥병, 관점: 약물 기전 중심`
    }
  }
};

export const mockSources = [
  {
    title: "KDIGO 2024 Clinical Practice Guideline",
    topic: "CKD Management",
    snippet: "This guideline provides evidence-based recommendations for all aspects of CKD management, emphasizing early detection and the use of SGLT2 inhibitors."
  },
  {
    title: "EMPA-KIDNEY Trial Results",
    topic: "SGLT2i Clinical Data",
    snippet: "The trial demonstrated that empagliflozin reduced the risk of kidney disease progression or death from cardiovascular causes in a wide range of patients."
  },
  {
    title: "FIDEIO-DKD Study Overview",
    topic: "MRA Action in CKD",
    snippet: "Finerenone significantly reduced the risk of kidney failure and cardiovascular events in patients with CKD and type 2 diabetes."
  }
];
