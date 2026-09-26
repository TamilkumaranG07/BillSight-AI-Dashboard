from typing import List, TYPE_CHECKING
from sqlalchemy import String, Text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.session import Base

if TYPE_CHECKING:
    from app.models.product import Product

class Category(Base):
    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True, nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True, default="")

    products: Mapped[List["Product"]] = relationship("Product", back_populates="category")
