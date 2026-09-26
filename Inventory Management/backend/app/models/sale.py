from datetime import datetime, timezone
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Float, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

if TYPE_CHECKING:
    from app.models.product import Product
    from app.models.batch import ProductBatch
    from app.models.user import User

class Sale(Base):
    __tablename__ = "sales"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    invoice_number: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    total_amount: Mapped[float] = mapped_column(Float, nullable=False)
    tax_amount: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    discount_amount: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    
    payment_method: Mapped[str] = mapped_column(String(50), nullable=False, default="UPI / QR")
    payment_status: Mapped[str] = mapped_column(String(30), nullable=False, default="paid") # pending, paid, failed, refunded
    cashier_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    cashier: Mapped[Optional["User"]] = relationship("User", back_populates="sales")
    items: Mapped[List["SaleItem"]] = relationship("SaleItem", back_populates="sale", cascade="all, delete-orphan")


class SaleItem(Base):
    __tablename__ = "sale_items"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sale_id: Mapped[int] = mapped_column(Integer, ForeignKey("sales.id", ondelete="CASCADE"), nullable=False)
    product_id: Mapped[int] = mapped_column(Integer, ForeignKey("products.id", ondelete="CASCADE"), nullable=False)
    batch_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("product_batches.id", ondelete="SET NULL"), nullable=True)
    
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[float] = mapped_column(Float, nullable=False)
    line_total: Mapped[float] = mapped_column(Float, nullable=False)

    sale: Mapped["Sale"] = relationship("Sale", back_populates="items")
    product: Mapped["Product"] = relationship("Product", back_populates="sale_items")
    batch: Mapped[Optional["ProductBatch"]] = relationship("ProductBatch")
