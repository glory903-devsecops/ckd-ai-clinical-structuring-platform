from pathlib import Path

def load_structuring_prompt() -> str:
    prompt_path = Path(__file__).parent / "prompts" / "structuring_prompt.txt"
    return prompt_path.read_text(encoding="utf-8")
