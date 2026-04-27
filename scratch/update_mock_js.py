import json

with open('backend/app/data/diagnoses_archive.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

js_content = """// Clinical Diagnosis Discovery Platform (CDDP) - High-Fidelity Demo Data (1000 items)

export const initialDiagnoses = """ + json.dumps(data, ensure_ascii=False, indent=2) + """;

export const keywordDictionary = [
  // 전문 임상 용어
  "사구체신염", "CKD 4", "단백뇨", "부종", "고령", "당뇨병", "미세단백뇨",
  "SGLT2i", "Dapagliflozin", "합병증 예방", "고칼륨혈증", "ACE 억제제",
  "칼륨 결합제", "식단 조절", "빈혈", "EPO", "철분 요법", "헤모글로빈",
  "고혈압", "복용 순응도", "복합제", "혈압 조절",
  // 일반 진료 및 증상 용어 (추가)
  "감기", "통증", "내과", "처방", "주사", "치료", "허리", "경과", "소견", "검사", "입원", "복용", "심부전", "합병증", "투석"
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
"""

with open('frontend/src/mockData.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print("Updated mockData.js with 1000 records successfully.")
