from datetime import datetime, timezone, date
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Integer, Float, ForeignKey, DateTime, Date, CheckConstraint, UniqueConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

if TYPE_CHECKING:
    from app.models.product import Product

class ProductBatch(Base):
    __tablename__ = "product_batches"
    __table_args__ = (
        CheckConstraint("quantity >= 0", name="check_batch_quantity_non_negative"),
        UniqueConstraint("product_id", "batch_number", name="uq_product_batch_number"),
        Index("idx_batch_expiry_date", "expiry_date"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    batch_number: Mapped[str] = mapped_column(String(100), nullable=False)
    manufacturing_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    expiry_date: Mapped[date] = mapped_column(Date, nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    
    expiry_source: Mapped[str] = mapped_column(String(20), nullable=False, default="manual") # manual | ocr | import
    expiry_confidence: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    product: Mapped["Product"] = relationship("Product", back_populates="batches")
