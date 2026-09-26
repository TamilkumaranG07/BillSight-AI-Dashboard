from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.product import ProductCreate, ProductUpdate, ProductResponse, ProductLookupResponse
from app.services.product_service import ProductService
from app.realtime.connection_manager import manager

router = APIRouter(prefix="/products", tags=["Products"])

@router.get("", response_model=List[ProductResponse])
def list_products(
    search: Optional[str] = Query(None, description="Search by name, product code or barcode"),
    category_id: Optional[int] = Query(None),
    supplier_id: Optional[int] = Query(None),
    stock_status: Optional[str] = Query(None, description="IN_STOCK, LOW_STOCK, OUT_OF_STOCK"),
    status: Optional[str] = Query("active"),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    db: Session = Depends(get_db)
):
    service = ProductService(db)
    products, _ = service.list_products(
        search=search,
        category_id=category_id,
        supplier_id=supplier_id,
        stock_status=stock_status,
        status=status,
        skip=skip,
        limit=limit
    )
    return [ProductResponse.model_validate(p) for p in products]

@router.get("/barcode/{barcode}", response_model=ProductLookupResponse)
def lookup_product_by_barcode(barcode: str, db: Session = Depends(get_db)):
    service = ProductService(db)
    product = service.lookup_barcode(barcode)
    if not product:
        return ProductLookupResponse(
            found=False,
            message="Product Not Found",
            product=None
        )
    return ProductLookupResponse(
        found=True,
        message="Product found successfully",
        product=ProductResponse.model_validate(product)
    )

@router.get("/{product_id}", response_model=ProductResponse)
def get_product_by_id(product_id: int, db: Session = Depends(get_db)):
    service = ProductService(db)
    product = service.get_product(product_id)
    return ProductResponse.model_validate(product)

@router.post("", response_model=ProductResponse, status_code=status.HTTP_201_CREATED)
async def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    service = ProductService(db)
    product = service.create_product(data)
    resp = ProductResponse.model_validate(product)
    await manager.broadcast("product_created", resp.model_dump(mode="json"))
    return resp

@router.put("/{product_id}", response_model=ProductResponse)
async def update_product(product_id: int, data: ProductUpdate, db: Session = Depends(get_db)):
    service = ProductService(db)
    product = service.update_product(product_id, data)
    resp = ProductResponse.model_validate(product)
    await manager.broadcast("product_updated", resp.model_dump(mode="json"))
    return resp

@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_product(product_id: int, db: Session = Depends(get_db)):
    service = ProductService(db)
    service.delete_product(product_id)
    await manager.broadcast("inventory_updated", {"product_id": product_id, "action": "delete"})
    return None
