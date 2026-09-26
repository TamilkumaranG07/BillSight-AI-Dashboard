import csv
import io
from typing import Optional
from fastapi import APIRouter, Depends, Query, Response, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.services.product_service import ProductService
from app.services.inventory_service import InventoryService
from app.services.expiry_service import ExpiryService
from app.services.sale_service import SaleService

router = APIRouter(prefix="/reports", tags=["Reports & Export"])

@router.get("/{report_type}")
def generate_report(
    report_type: str,
    format: Optional[str] = Query("json", description="json or csv"),
    db: Session = Depends(get_db)
):
    if report_type not in ("inventory", "sales", "expiry", "low-stock"):
        raise HTTPException(status_code=400, detail="Invalid report type")

    if report_type == "inventory":
        service = ProductService(db)
        products, _ = service.list_products(limit=1000)
        data = [
            {
                "id": p.id,
                "product_code": p.product_code,
                "name": p.name,
                "barcode": p.barcode,
                "category": p.category.name if p.category else "",
                "selling_price": p.selling_price,
                "purchase_price": p.purchase_price,
                "current_quantity": p.current_quantity,
                "stock_status": p.stock_status,
                "expiry_status": p.expiry_status
            }
            for p in products
        ]
    elif report_type == "expiry":
        service = ExpiryService(db)
        records = service.get_expiry_records()
        data = [
            {
                "id": r.id,
                "product_name": r.product_name,
                "batch_number": r.batch_number,
                "expiry_date": str(r.expiry_date),
                "status": r.status,
                "days_remaining": r.days_remaining,
                "quantity": r.quantity
            }
            for r in records
        ]
    elif report_type == "low-stock":
        service = ProductService(db)
        low, _ = service.list_products(stock_status="LOW_STOCK", limit=1000)
        out, _ = service.list_products(stock_status="OUT_OF_STOCK", limit=1000)
        combined = low + out
        data = [
            {
                "id": p.id,
                "product_code": p.product_code,
                "name": p.name,
                "barcode": p.barcode,
                "current_quantity": p.current_quantity,
                "minimum_stock_level": p.minimum_stock_level,
                "stock_status": p.stock_status
            }
            for p in combined
        ]
    else: # sales
        service = SaleService(db)
        sales, _ = service.sale_repo.list_sales(limit=1000)
        data = [
            {
                "id": s.id,
                "invoice_number": s.invoice_number,
                "total_amount": s.total_amount,
                "payment_method": s.payment_method,
                "payment_status": s.payment_status,
                "items_count": len(s.items),
                "created_at": str(s.created_at)
            }
            for s in sales
        ]

    if format == "csv":
        output = io.StringIO()
        if data:
            writer = csv.DictWriter(output, fieldnames=list(data[0].keys()))
            writer.writeheader()
            writer.writerows(data)
        
        return Response(
            content=output.getvalue(),
            media_type="text/csv",
            headers={"Content-Disposition": f"attachment; filename={report_type}_report.csv"}
        )

    return {"report_type": report_type, "total_records": len(data), "data": data}
