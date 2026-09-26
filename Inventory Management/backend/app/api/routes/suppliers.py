from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.session import get_db
from app.models.supplier import Supplier
from app.schemas.supplier import SupplierCreate, SupplierResponse

router = APIRouter(prefix="/suppliers", tags=["Suppliers"])

@router.get("", response_model=List[SupplierResponse])
def list_suppliers(db: Session = Depends(get_db)):
    suppliers = db.scalars(select(Supplier)).all()
    return [SupplierResponse.model_validate(s) for s in suppliers]

@router.post("", response_model=SupplierResponse, status_code=status.HTTP_201_CREATED)
def create_supplier(data: SupplierCreate, db: Session = Depends(get_db)):
    supplier = Supplier(
        name=data.name,
        contact_person=data.contact_person,
        phone=data.phone,
        email=data.email,
        address=data.address
    )
    db.add(supplier)
    db.commit()
    db.refresh(supplier)
    return SupplierResponse.model_validate(supplier)
