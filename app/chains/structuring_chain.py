from typing import Dict, Any

class StructuringChain:
    def __init__(self, model_name: str = "gpt-4o"):
        self.model_name = model_name

    def build_prompt(self, disease: str, preference: str, context: str) -> str:
        """
        RAG를 위한 구조화 프롬프트를 생성합니다.
        """
        system_msg = f"당신은 시니어 임상 분석가입니다. 아래 문맥(Context)을 바탕으로 '{preference}' 관점에 맞춰 정보를 재구성하세요."
        user_msg = f"질환: {disease}\n관점: {preference}\n\n문맥:\n{context}\n\n결과를 JSON 형식이 아닌 가독성 높은 마크다운 트리 구조로 출력하십시오."
        
        return f"--- [SYSTEM MESSAGE] ---\n{system_msg}\n\n--- [USER MESSAGE] ---\n{user_msg}"

    def invoke(self, prompt: str) -> Dict[str, Any]:
        """
        실제 LLM 호출 로직 (PoC에서는 Mock 데이터로 대체)
        """
        pass
