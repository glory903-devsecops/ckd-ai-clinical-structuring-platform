from typing import Dict, Any, List
from app.chains.structuring_chain import StructuringChain
from app.retrieval.retriever import ClinicalRetriever
from app.domain.models import StructuringResult

class StructuringService:
    def __init__(self):
        self.retriever = ClinicalRetriever()
        self.chain = StructuringChain()
        # 확장된 키워드 사전 (프론트엔드와 동기화)
        self.keyword_dictionary = [
            "사구체신염", "CKD 4", "단백뇨", "부종", "고령", "당뇨병", "미세단백뇨", 
            "SGLT2i", "Dapagliflozin", "합병증 예방", "고칼륨혈증", "ACE 억제제", 
            "칼륨 결합제", "식단 조절", "빈혈", "EPO", "철분 요법", "헤모글로빈", 
            "고혈압", "복용 순응도", "복합제", "혈압 조절",
            "감기", "통증", "내과", "처방", "주사", "치료", "허리", "경과", "소견", "검사", "입원", "복용"
        ]

    def run_structuring_workflow(self, diagnosis_text: str, preference: str) -> Dict[str, Any]:
        """
        임상 정보 구조화 워크플로우를 실행합니다.
        1. 핵심 키워드 추출 (Keyword Extraction)
        2. 문서 검색 (Retrieval)
        3. 구조화 결과 생성 (Mock/LLM)
        """
        # 1. 지능형 키워드 추출
        extracted_keywords = [kw for kw in self.keyword_dictionary if kw in diagnosis_text]
        if not extracted_keywords:
            extracted_keywords = ["일반 진단"]

        # 2. 관련 문맥 검색
        sources = self.retriever.retrieve(diagnosis_text[:50]) # 검색용 숏컷
        context = "\n".join([s["snippet"] for s in sources])

        # 3. 구조화 프롬프트 및 결과 (PoC Mock)
        return {
            "disease": diagnosis_text[:30] + "...",
            "rawContent": diagnosis_text,
            "preference": preference,
            "overview": f"입력하신 '{extracted_keywords[0] if extracted_keywords else '임상'}' 관련 데이터를 '{preference}' 관점에서 분석한 결과입니다.",
            "sections": [
                {
                    "title": f"{preference} 기반 권고 요약",
                    "items": [
                        f"{extracted_keywords[0] if extracted_keywords else '환자'} 상태에 따른 맞춤형 관리 전략 필요",
                        "표준 가이드라인 기반의 단계적 접근 권고"
                    ]
                }
            ],
            "keywords": extracted_keywords,
            "sources": sources
        }

storage_service = None # Placeholder if needed
