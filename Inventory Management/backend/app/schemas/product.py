from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field, field_validator, ConfigDict
from app.schemas.category import CategoryResponse
from app.schemas.supplier import SupplierResponse
from app.schemas.batch import BatchResponse

def validate_ean_check_digit(barcode: str) -> bool:
    if not barcode.isdigit():
        return False
    if len(barcode) not in (8, 12, 13):
        return True # Allow other standard lengths
    
    digits = [int(d) for d in barcode]
    check_digit = digits[-1]
    main_digits = digits[:-1]
    
    if len(barcode) == 13:
        odd_sum = sum(main_digits[i] for i in range(0, 12, 2))
        even_sum = sum(main_digits[i] for i in range(1, 12, 2))
        total = odd_sum + (even_sum * 3)
    elif len(barcode) == 8:
        odd_sum = sum(main_digits[i] for i in range(0, 7, 2))
        even_sum = sum(main_digits[i] for i in range(1, 7, 2))
        total = (odd_sum * 3) + even_sum
    else: # 12 UPC-A
        odd_sum = sum(main_digits[i] for i in range(0, 11, 2))
        even_sum = sum(main_digits[i] for i in range(1, 11, 2))
        total = (odd_sum * 3) + even_sum
        
    calculated_check = (10 - (total % 10)) % 10
    return calculated_check == check_digit

class ProductBase(BaseModel):
    product_code: str
    name: str
    category_id: Optional[int] = None
    barcode: str
    supplier_id: Optional[int] = None
    selling_price: float = Field(ge=0.0)
    purchase_price: float = Field(ge=0.0)
    minimum_stock_level: int = Field(default=15, ge=0)
    status: str = "active" # active, inactive, discontinued

    @field_validator("barcode")
    @classmethod
    def check_barcode_validity(cls, v: str) -> str:
        v_clean = v.strip()
        if not v_clean:
            raise ValueError("Barcode cannot be empty")
        if v_clean.isdigit() and len(v_clean) in (8, 12, 13):
            if not validate_ean_check_digit(v_clean):
                raise ValueError(f"Invalid barcode check digit for '{v_clean}'")
        return v_clean

class ProductCreate(ProductBase):
    initial_batch_number: Optional[str] = "BATCH-001"
    initial_expiry_date: Optional[str] = "2026-12-31"
    initial_quantity: Optional[int] = Field(default=0, ge=0)

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category_id: Optional[int] = None
    barcode: Optional[str] = None
    supplier_id: Optional[int] = None
    selling_price: Optional[float] = Field(default=None, ge=0.0)
    purchase_price: Optional[float] = Field(default=None, ge=0.0)
    minimum_stock_level: Optional[int] = Field(default=None, ge=0)
    status: Optional[str] = None

class ProductResponse(ProductBase):
    id: int
    current_quantity: int
    stock_status: str
    expiry_status: str
    created_at: datetime
    updated_at: datetime
    category: Optional[CategoryResponse] = None
    supplier: Optional[SupplierResponse] = None
    batches: List[BatchResponse] = []

    model_config = ConfigDict(from_attributes=True)

class ProductLookupResponse(BaseModel):
    found: bool
    message: Optional[str] = None
    product: Optional[ProductResponse] = None
