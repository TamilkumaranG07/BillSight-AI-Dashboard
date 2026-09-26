from datetime import datetime, timezone
from typing import List, TYPE_CHECKING
from sqlalchemy import String, Boolean, DateTime, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

if TYPE_CHECKING:
    from app.models.transaction import InventoryTransaction
    from app.models.sale import Sale

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    email: Mapped[str] = mapped_column(String(150), unique=True, index=True, nullable=False)
    password_hash: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(50), default="cashier", nullable=False) # admin, manager, cashier
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)

    transactions: Mapped[List["InventoryTransaction"]] = relationship("InventoryTransaction", back_populates="user")
    sales: Mapped[List["Sale"]] = relationship("Sale", back_populates="cashier")
