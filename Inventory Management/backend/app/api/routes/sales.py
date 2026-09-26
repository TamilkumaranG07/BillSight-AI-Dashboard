from typing import List
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.sale import SaleCreate, SaleResponse
from app.services.sale_service import SaleService
from app.realtime.connection_manager import manager

router = APIRouter(prefix="/sales", tags=["Sales / Billing"])

@router.post("", response_model=SaleResponse, status_code=status.HTTP_201_CREATED)
async def create_sale(data: SaleCreate, db: Session = Depends(get_db)):
    service = SaleService(db)
    sale = service.process_sale(data)
    sale_resp = SaleResponse.model_validate(sale)

    await manager.broadcast("sale_completed", {
        "invoice_number": sale.invoice_number,
        "total_amount": sale.total_amount,
        "items_count": len(sale.items)
    })
    await manager.broadcast("inventory_updated", {"action": "sale", "invoice": sale.invoice_number})

    return sale_resp

@router.get("", response_model=List[SaleResponse])
def list_sales(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db)
):
    service = SaleService(db)
    sales, _ = service.sale_repo.list_sales(skip=skip, limit=limit)
    return [SaleResponse.model_validate(s) for s in sales]
