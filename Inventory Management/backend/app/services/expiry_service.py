from typing import List, Optional
from sqlalchemy.orm import Session
from app.repositories.inventory_repository import InventoryRepository
from app.schemas.expiry import ExpiryRecordResponse
from app.core.config import settings

class ExpiryService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = InventoryRepository(db)

    def get_expiry_records(self, status: Optional[str] = None) -> List[ExpiryRecordResponse]:
        records = self.repo.get_expiry_records(status=status)
        results = []
        for r in records:
            results.append(ExpiryRecordResponse(
                id=r.id,
                product_id=r.product_id,
                batch_id=r.batch_id,
                product_name=r.product.name if r.product else "Unknown",
                batch_number=r.batch.batch_number if r.batch else "N/A",
                expiry_date=r.expiry_date,
                status=r.status,
                days_remaining=r.days_remaining,
                quantity=r.batch.quantity if r.batch else 0,
                checked_at=r.checked_at,
                action_taken=r.action_taken
            ))
        return results

    def run_daily_expiry_check(self) -> int:
        return self.repo.refresh_expiry_records(settings.NEAR_EXPIRY_DAYS)
