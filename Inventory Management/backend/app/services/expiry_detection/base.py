from datetime import date
from typing import Optional, Protocol, Literal
from pydantic import BaseModel

class ExpiryDetectionResult(BaseModel):
    expiry_date: Optional[date] = None
    manufacturing_date: Optional[date] = None
    batch_number: Optional[str] = None
    confidence: float = 0.0 # 0..1
    raw_text: Optional[str] = None
    source: Literal["ocr", "manual"] = "manual"
    is_available: bool = True

class ExpiryDetector(Protocol):
    async def detect(self, image_bytes: bytes) -> ExpiryDetectionResult:
        ...
