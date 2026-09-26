from datetime import date, datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

class BatchBase(BaseModel):
    batch_number: str
    manufacturing_date: Optional[date] = None
    expiry_date: date
    quantity: int = Field(default=0, ge=0)
    expiry_source: Literal["manual", "ocr", "import"] = "manual"
    expiry_confidence: Optional[float] = None

class BatchCreate(BatchBase):
    product_id: int

class BatchResponse(BatchBase):
    id: int
    product_id: int
    created_at: datetime
    updated_at: datetime
    model_config = ConfigDict(from_attributes=True)
