from datetime import date, datetime
from typing import Optional
from pydantic import BaseModel, ConfigDict

class ExpiryRecordResponse(BaseModel):
    id: int
    product_id: int
    batch_id: int
    product_name: str
    batch_number: str
    expiry_date: date
    status: str # valid, near_expiry, expired
    days_remaining: int
    quantity: int
    checked_at: datetime
    action_taken: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)
