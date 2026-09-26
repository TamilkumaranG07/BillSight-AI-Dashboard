from typing import List, Optional, Tuple
from datetime import date
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, asc, desc
from app.models.product import Product
from app.models.batch import ProductBatch
from app.models.sale import Sale, SaleItem
from app.models.transaction import InventoryTransaction

class SaleRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_sale_by_invoice(self, invoice_number: str) -> Optional[Sale]:
        stmt = (
            select(Sale)
            .options(joinedload(Sale.items).joinedload(SaleItem.product))
            .where(Sale.invoice_number == invoice_number)
        )
        return self.db.scalars(stmt).unique().first()

    def get_fefo_batches(self, product_id: int) -> List[ProductBatch]:
        """Fetch available non-expired batches ordered by earliest expiry date (FEFO)."""
        today = date.today()
        stmt = (
            select(ProductBatch)
            .where(
                ProductBatch.product_id == product_id,
                ProductBatch.quantity > 0,
                ProductBatch.expiry_date >= today
            )
            .order_by(asc(ProductBatch.expiry_date), asc(ProductBatch.id))
        )
        return list(self.db.scalars(stmt).all())

    def list_sales(self, skip: int = 0, limit: int = 100) -> Tuple[List[Sale], int]:
        stmt = (
            select(Sale)
            .options(joinedload(Sale.items).joinedload(SaleItem.product))
            .order_by(desc(Sale.created_at))
        )
        sales = self.db.scalars(stmt).unique().all()
        return sales[skip : skip + limit], len(sales)
