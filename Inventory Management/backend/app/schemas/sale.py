from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict

class SaleItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)
    unit_price: Optional[float] = None # Server checks and validates price

class SaleCreate(BaseModel):
    items: List[SaleItemCreate] = Field(min_length=1)
    payment_method: str = "UPI / QR"
    discount_amount: float = Field(default=0.0, ge=0.0)
    tax_amount: float = Field(default=0.0, ge=0.0)
    idempotency_key: Optional[str] = None

class SaleItemResponse(BaseModel):
    id: int
    product_id: int
    batch_id: Optional[int] = None
    quantity: int
    unit_price: float
    line_total: float

    model_config = ConfigDict(from_attributes=True)

class SaleResponse(BaseModel):
    id: int
    invoice_number: str
    total_amount: float
    tax_amount: float
    discount_amount: float
    payment_method: str
    payment_status: str
    cashier_id: Optional[int] = None
    created_at: datetime
    items: List[SaleItemResponse] = []

    model_config = ConfigDict(from_attributes=True)
