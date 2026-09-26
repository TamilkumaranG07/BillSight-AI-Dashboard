from typing import List, Optional, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, or_, func
from app.models.product import Product
from app.models.batch import ProductBatch
from app.models.category import Category
from app.models.supplier import Supplier

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_id(self, product_id: int) -> Optional[Product]:
        stmt = (
            select(Product)
            .options(
                joinedload(Product.category),
                joinedload(Product.supplier),
                joinedload(Product.batches)
            )
            .where(Product.id == product_id)
        )
        return self.db.scalars(stmt).unique().first()

    def get_by_barcode(self, barcode: str) -> Optional[Product]:
        clean_barcode = barcode.strip()
        stmt = (
            select(Product)
            .options(
                joinedload(Product.category),
                joinedload(Product.supplier),
                joinedload(Product.batches)
            )
            .where(Product.barcode == clean_barcode)
        )
        return self.db.scalars(stmt).unique().first()

    def get_by_code(self, product_code: str) -> Optional[Product]:
        stmt = select(Product).where(Product.product_code == product_code)
        return self.db.scalars(stmt).first()

    def list_products(
        self,
        search: Optional[str] = None,
        category_id: Optional[int] = None,
        supplier_id: Optional[int] = None,
        stock_status: Optional[str] = None,
        status: Optional[str] = "active",
        skip: int = 0,
        limit: int = 100
    ) -> Tuple[List[Product], int]:
        stmt = select(Product).options(
            joinedload(Product.category),
            joinedload(Product.supplier),
            joinedload(Product.batches)
        )

        if status:
            stmt = stmt.where(Product.status == status)
            
        if category_id:
            stmt = stmt.where(Product.category_id == category_id)
            
        if supplier_id:
            stmt = stmt.where(Product.supplier_id == supplier_id)

        if search:
            search_pattern = f"%{search.strip()}%"
            stmt = stmt.where(
                or_(
                    Product.name.ilike(search_pattern),
                    Product.product_code.ilike(search_pattern),
                    Product.barcode.ilike(search_pattern)
                )
            )

        products = self.db.scalars(stmt).unique().all()

        # Apply in-memory filtering for computed hybrid properties if requested
        if stock_status:
            products = [p for p in products if p.stock_status == stock_status]

        total = len(products)
        paginated_products = products[skip : skip + limit]
        return paginated_products, total

    def create(self, product: Product) -> Product:
        self.db.add(product)
        self.db.commit()
        self.db.refresh(product)
        return product

    def update(self, product: Product) -> Product:
        self.db.commit()
        self.db.refresh(product)
        return product

    def soft_delete(self, product: Product) -> Product:
        product.status = "inactive"
        self.db.commit()
        self.db.refresh(product)
        return product

    def hard_delete(self, product: Product) -> None:
        self.db.delete(product)
        self.db.commit()

    def get_batch_by_number(self, product_id: int, batch_number: str) -> Optional[ProductBatch]:
        stmt = select(ProductBatch).where(
            ProductBatch.product_id == product_id,
            ProductBatch.batch_number == batch_number
        )
        return self.db.scalars(stmt).first()

    def create_batch(self, batch: ProductBatch) -> ProductBatch:
        self.db.add(batch)
        self.db.commit()
        self.db.refresh(batch)
        return batch
