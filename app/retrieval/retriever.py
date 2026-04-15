from typing import List, Dict, Any

class ClinicalRetriever:
    def __init__(self):
        # 실제 환경에서는 벡터 DB 연결 로직이 들어감
        pass

    def retrieve(self, query: str) -> List[Dict[str, Any]]:
        """
        RAG를 위한 관련 임상 문서 조각을 검색합니다.
        (PoC에서는 정규화된 샘플 데이터를 반환)
        """
        return [
            {
                "title": "KDIGO 2024 CKD Clinical Guideline",
                "topic": "Early Management",
                "snippet": "Patients with CKD should be evaluated for complications and historical data to prevent progression..."
            },
            {
                "title": "Journal of Nephrology: SGLT2i Benefits",
                "topic": "Drug Efficacy",
                "snippet": "Recent trials indicate significant reduction in eGFR decline for patients on SGLT2 inhibitors..."
            }
        ]
