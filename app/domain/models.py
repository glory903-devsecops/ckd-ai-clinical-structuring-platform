from pydantic import BaseModel
from typing import List, Optional

class SourceCard(BaseModel):
    title: str
    topic: str
    snippet: str

class StructuredSection(BaseModel):
    title: str
    items: List[str]

class StructuringResult(BaseModel):
    disease: str
    perspective: str
    overview: str
    sections: List[StructuredSection]
    keywords: List[str]
    sources: List[SourceCard]
    prompt: Optional[str] = None
