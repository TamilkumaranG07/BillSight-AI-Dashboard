from typing import List, Optional, Tuple
from datetime import datetime, date
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, desc
from app.models.product import Product
from app.models.batch import ProductBatch
from app.models.transaction import InventoryTransaction
from app.models.expiry import ExpiryRecord

class InventoryRepository:
    def __init__(self, db: Session):
        self.db = db

    def add_transaction(self, transaction: InventoryTransaction) -> InventoryTransaction:
        self.db.add(transaction)
        self.db.commit()
        self.db.refresh(transaction)
        return transaction

    def list_transactions(
        self,
        product_id: Optional[int] = None,
        transaction_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> Tuple[List[InventoryTransaction], int]:
        stmt = (
            select(InventoryTransaction)
            .options(
                joinedload(InventoryTransaction.product),
                joinedload(InventoryTransaction.batch),
                joinedload(InventoryTransaction.user)
            )
            .order_by(desc(InventoryTransaction.created_at))
        )

        if product_id:
            stmt = stmt.where(InventoryTransaction.product_id == product_id)
        if transaction_type:
            stmt = stmt.where(InventoryTransaction.transaction_type == transaction_type)

        results = self.db.scalars(stmt).unique().all()
        total = len(results)
        return results[skip : skip + limit], total

    def get_expiry_records(self, status: Optional[str] = None) -> List[ExpiryRecord]:
        stmt = select(ExpiryRecord).options(
            joinedload(ExpiryRecord.product),
            joinedload(ExpiryRecord.batch)
        )
        if status:
            stmt = stmt.where(ExpiryRecord.status == status)
        return list(self.db.scalars(stmt).unique().all())

    def refresh_expiry_records(self, near_expiry_days: int) -> int:
        # Clear old records
        self.db.query(ExpiryRecord).delete()
        self.db.commit()

        today = date.today()
        batches = self.db.scalars(
            select(ProductBatch)
            .options(joinedload(ProductBatch.product))
            .where(ProductBatch.quantity > 0)
        ).unique().all()

        count = 0
        for b in batches:
            days_left = (b.expiry_date - today).days
            if days_left < 0:
                rec_status = "expired"
            elif days_left <= near_expiry_days:
                rec_status = "near_expiry"
            else:
                rec_status = "valid"

            if rec_status in ("expired", "near_expiry"):
                record = ExpiryRecord(
                    product_id=b.product_id,
                    batch_id=b.id,
                    expiry_date=b.expiry_date,
                    status=rec_status,
                    days_remaining=days_left,
                    checked_at=datetime.utcnow()
                )
                self.db.add(record)
                count += 1

        self.db.commit()
        return count
