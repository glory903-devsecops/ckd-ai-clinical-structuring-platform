from typing import Dict, Any, List
from app.chains.structuring_chain import StructuringChain
from app.retrieval.retriever import ClinicalRetriever
from app.domain.models import StructuringResult

class StructuringService:
    def __init__(self):
        self.retriever = ClinicalRetriever()
        self.chain = StructuringChain()

    def run_structuring_workflow(self, disease: str, preference: str) -> Dict[str, Any]:
        """
        임상 정보 구조화 워크플로우를 실행합니다.
        1. 문서 검색 (Retrieval)
        2. 프롬프트 구성 (Prompt Engineering)
        3. 구조화 결과 생성 (Chains)
        """
        # 1. 관련 문맥 검색
        sources = self.retriever.retrieve(disease)
        context = "\n".join([s["snippet"] for s in sources])

        # 2. 구조화 프롬프트 생성 및 실행 (PoC에서는 Mock 결과 반환 가능)
        prompt = self.chain.build_prompt(disease, preference, context)
        
        # 실제 환경에서는 LLM 호출이 여기서 발생함
        # result = self.chain.invoke(prompt)
        
        return {
            "disease": disease,
            "preference": preference,
            "overview": f"{disease}에 대한 최신 임상 가이드라인 및 학술 자료를 '{preference}' 관점에서 통합 정리한 결과입니다.",
            "preference_description": self._get_preference_desc(preference),
            "sections": self._get_mock_sections(disease, preference),
            "keywords": [disease, preference, "AI 구조화", "임상 가이드라인"],
            "sources": sources,
            "prompt_preview": prompt
        }

    def _get_preference_desc(self, preference: str) -> str:
        descriptions = {
            "치료 단계 중심": "초기 진단부터 말기 관리까지, 환자의 병기 진행에 따른 표준 치료 경로를 중심으로 정보를 구성합니다.",
            "약물 기전 중심": "약물의 작용 원리(MOA)와 계열별 특성을 기반으로 분류하여 치료 옵션을 구조화합니다.",
            "부작용 고려 중심": "동반 질환이나 안전성 프로파일, 환자별 주의사항을 우선순위로 하여 정보를 정리합니다.",
            "복용 편의성 중심": "투여 경로, 빈도, 환자 순응도에 영향을 주는 요소를 중심으로 치료 정보를 재구성합니다."
        }
        return descriptions.get(preference, "선택한 관점에 맞춰 정보를 구조화합니다.")

    def _get_mock_sections(self, disease: str, preference: str) -> List[Dict[str, Any]]:
        # 실제 구현에서는 LLM이 생성한 구조가 들어감
        return [
            {
                "title": f"{preference} 기반 핵심 요약",
                "items": [
                    f"{disease} 관리의 주요 패러다임 변화 반영",
                    f"{preference} 관점에서의 우선순위 권고안 도출"
                ]
            },
            {
                "title": "임상적 세부 권고 사항",
                "items": [
                    "최근 업데이트된 KDIGO 가이드라인 반영 (2024)",
                    "환자별 맞춤형 접근 전략 수립 필요성"
                ]
            }
        ]
