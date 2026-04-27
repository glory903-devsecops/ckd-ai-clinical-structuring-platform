import json
import random
import datetime

keywords = [
  "사구체신염", "CKD 4", "단백뇨", "부종", "고령", "당뇨병", "미세단백뇨", 
  "SGLT2i", "Dapagliflozin", "합병증 예방", "고칼륨혈증", "ACE 억제제", 
  "칼륨 결합제", "식단 조절", "빈혈", "EPO", "철분 요법", "헤모글로빈", 
  "고혈압", "복용 순응도", "복합제", "혈압 조절", "심부전", "합병증", "투석"
]

templates = [
    "환자는 최근 {kw1} 증상을 호소하며, 추가적인 {kw2} 관련 검사가 필요함.",
    "{kw1} 기왕력이 있는 환자로, {kw2} 처방을 고려 중임.",
    "정기 검진 결과 {kw1} 악화 소견이 보이며, {kw2} 동반 위험이 있음.",
    "현재 {kw1} 관리가 잘 되고 있으나, {kw2} 모니터링이 지속적으로 요구됨."
]

records = []
now = datetime.datetime.now()

for i in range(1, 1001):
    kw_sample = random.sample(keywords, 2)
    raw_content = random.choice(templates).format(kw1=kw_sample[0], kw2=kw_sample[1])
    
    # Generate random date within the last year
    random_days = random.randint(0, 365)
    random_date = now - datetime.timedelta(days=random_days)
    
    record = {
        "id": 100000 + i,
        "date": random_date.strftime("%Y-%m-%d %H:%M"),
        "rawContent": raw_content,
        "summary": raw_content[:30] + ("..." if len(raw_content) > 30 else ""),
        "keywords": kw_sample,
        "perspective": "테스트 데이터 1000",
        "isDemo": True
    }
    records.append(record)

# Save to backend
with open('backend/app/data/diagnoses_archive.json', 'w', encoding='utf-8') as f:
    json.dump(records, f, ensure_ascii=False, indent=2)

print("Generated 1000 records for the backend.")
