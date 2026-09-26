from datetime import datetime, timezone, date, timedelta
from typing import List, Optional, TYPE_CHECKING
from sqlalchemy import String, Float, Integer, ForeignKey, DateTime, CheckConstraint, Index
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.ext.hybrid import hybrid_property
from app.db.session import Base
from app.core.config import settings

if TYPE_CHECKING:
    from app.models.category import Category
    from app.models.supplier import Supplier
    from app.models.batch import ProductBatch
    from app.models.transaction import InventoryTransaction
    from app.models.sale import SaleItem
    from app.models.expiry import ExpiryRecord

class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint("selling_price >= 0", name="check_selling_price_positive"),
        CheckConstraint("purchase_price >= 0", name="check_purchase_price_positive"),
        CheckConstraint("minimum_stock_level >= 0", name="check_min_stock_positive"),
        Index("idx_product_barcode", "barcode"),
        Index("idx_product_name", "name"),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    product_code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    category_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("categories.id", ondelete="SET NULL"), nullable=True)
    barcode: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    supplier_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("suppliers.id", ondelete="SET NULL"), nullable=True)
    
    selling_price: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    purchase_price: Mapped[float] = mapped_column(Float, nullable=False, default=0.0)
    minimum_stock_level: Mapped[int] = mapped_column(Integer, nullable=False, default=15)
    status: Mapped[str] = mapped_column(String(20), nullable=False, default="active") # active, inactive, discontinued
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)

    category: Mapped[Optional["Category"]] = relationship("Category", back_populates="products")
    supplier: Mapped[Optional["Supplier"]] = relationship("Supplier", back_populates="products")
    batches: Mapped[List["ProductBatch"]] = relationship("ProductBatch", back_populates="product", cascade="all, delete-orphan")
    transactions: Mapped[List["InventoryTransaction"]] = relationship("InventoryTransaction", back_populates="product")
    sale_items: Mapped[List["SaleItem"]] = relationship("SaleItem", back_populates="product")
    expiry_records: Mapped[List["ExpiryRecord"]] = relationship("ExpiryRecord", back_populates="product", cascade="all, delete-orphan")

    @hybrid_property
    def current_quantity(self) -> int:
        return sum(batch.quantity for batch in self.batches)

    @hybrid_property
    def stock_status(self) -> str:
        qty = self.current_quantity
        if qty <= 0:
            return "OUT_OF_STOCK"
        elif qty <= self.minimum_stock_level:
            return "LOW_STOCK"
        return "IN_STOCK"

    @hybrid_property
    def expiry_status(self) -> str:
        if not self.batches:
            return "VALID"
        today = date.today()
        near_expiry_cutoff = today + timedelta(days=settings.NEAR_EXPIRY_DAYS)
        
        has_expired = any(b.expiry_date < today for b in self.batches if b.quantity > 0)
        if has_expired:
            return "EXPIRED"
        
        has_near_expiry = any(today <= b.expiry_date <= near_expiry_cutoff for b in self.batches if b.quantity > 0)
        if has_near_expiry:
            return "NEAR_EXPIRY"
            
        return "VALID"
