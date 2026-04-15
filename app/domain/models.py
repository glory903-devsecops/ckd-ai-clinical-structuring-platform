from pydantic import BaseModel
from typing import List

class SourceCard(BaseModel):
    title: str
    topic: str
    snippet: str

class StructuredSection(BaseModel):
    title: str
    items: List[str]
