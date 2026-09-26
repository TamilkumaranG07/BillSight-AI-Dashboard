from typing import List, Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.product import ProductResponse
from app.schemas.transaction import StockActionRequest, InventoryTransactionResponse
from app.services.inventory_service import InventoryService
from app.services.product_service import ProductService
from app.realtime.connection_manager import manager

router = APIRouter(prefix="/inventory", tags=["Inventory"])

@router.get("", response_model=List[ProductResponse])
def get_inventory_overview(
    stock_status: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db)
):
    prod_service = ProductService(db)
    products, _ = prod_service.list_products(stock_status=stock_status, skip=skip, limit=limit)
    return [ProductResponse.model_validate(p) for p in products]

@router.put("/{product_id}", response_model=InventoryTransactionResponse)
async def update_stock(
    product_id: int,
    action: StockActionRequest,
    db: Session = Depends(get_db)
):
    inv_service = InventoryService(db)
    tx = inv_service.execute_stock_action(product_id, action)
    tx_resp = InventoryTransactionResponse.model_validate(tx)
    
    await manager.broadcast("inventory_updated", {
        "product_id": product_id,
        "transaction_type": action.transaction_type,
        "new_quantity": tx.new_quantity
    })
    return tx_resp

@router.get("/low-stock", response_model=List[ProductResponse])
def get_low_stock_products(db: Session = Depends(get_db)):
    prod_service = ProductService(db)
    products, _ = prod_service.list_products(stock_status="LOW_STOCK")
    out_of_stock, _ = prod_service.list_products(stock_status="OUT_OF_STOCK")
    combined = products + out_of_stock
    return [ProductResponse.model_validate(p) for p in combined]

@router.get("/transactions", response_model=List[InventoryTransactionResponse])
def list_inventory_transactions(
    product_id: Optional[int] = Query(None),
    type: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1),
    db: Session = Depends(get_db)
):
    inv_service = InventoryService(db)
    transactions, _ = inv_service.list_transactions(
        product_id=product_id,
        transaction_type=type,
        skip=skip,
        limit=limit
    )
    return [InventoryTransactionResponse.model_validate(t) for t in transactions]
