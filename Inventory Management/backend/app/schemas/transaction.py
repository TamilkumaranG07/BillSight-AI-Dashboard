from datetime import datetime
from typing import Optional, Literal
from pydantic import BaseModel, Field, ConfigDict

TransactionType = Literal["STOCK_IN", "SALE", "ADJUSTMENT", "DAMAGED", "EXPIRED_REMOVAL", "RETURN"]

class StockActionRequest(BaseModel):
    transaction_type: TransactionType
    batch_number: Optional[str] = "BATCH-DEFAULT"
    quantity: int = Field(gt=0, description="Positive quantity magnitude for the action")
    reason: str = Field(min_length=1, description="Reason for inventory action is required")
    expiry_date: Optional[str] = None # Format YYYY-MM-DD for STOCK_IN if new batch
    expiry_override: bool = False

class InventoryTransactionResponse(BaseModel):
    id: int
    product_id: int
    batch_id: Optional[int] = None
    transaction_type: str
    quantity_changed: int
    previous_quantity: int
    new_quantity: int
    reason: Optional[str] = ""
    reference_id: Optional[str] = None
    performed_by: Optional[int] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
