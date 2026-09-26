from datetime import datetime, timezone
from typing import Optional, TYPE_CHECKING
from sqlalchemy import String, Text, Integer, ForeignKey, DateTime, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.batch import ProductBatch
    from app.models.user import User

class InventoryTransaction(Base):
    __tablename__ = "inventory_transactions"
    __table_args__ = (
        Index("idx_tx_product_created", "product_id", "created_at"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    batch_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("product_batches.id", ondelete="SET NULL"), nullable=True)
    
    transaction_type: Mapped[str] = mapped_column(String(30), nullable=False) # STOCK_IN, SALE, ADJUSTMENT, DAMAGED, EXPIRED_REMOVAL, RETURN
    quantity_changed: Mapped[int] = mapped_column(Integer, nullable=False)
    previous_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    new_quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    
    reason: Mapped[str] = mapped_column(Text, nullable=True, default="")
    reference_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    performed_by: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    product: Mapped["Product"] = relationship("Product", back_populates="transactions")
    batch: Mapped[Optional["ProductBatch"]] = relationship("ProductBatch")
    user: Mapped[Optional["User"]] = relationship("User", back_populates="transactions")
