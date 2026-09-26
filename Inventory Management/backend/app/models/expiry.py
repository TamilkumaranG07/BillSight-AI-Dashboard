from datetime import datetime, timezone, date
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, ForeignKey, DateTime, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.batch import ProductBatch

class ExpiryRecord(Base):
    __tablename__ = "expiry_records"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    batch_id: Mapped[int] = mapped_column(Integer, ForeignKey("product_batches.id", ondelete="CASCADE"), nullable=False)
    
    expiry_date: Mapped[date] = mapped_column(Date, nullable=False)
    status: Mapped[str] = mapped_column(String(20), nullable=False) # valid, near_expiry, expired
    days_remaining: Mapped[int] = mapped_column(Integer, nullable=False)
    checked_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    action_taken: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    product: Mapped["Product"] = relationship("Product", back_populates="expiry_records")
    batch: Mapped["ProductBatch"] = relationship("ProductBatch")
