from datetime import datetime, date, timezone
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.batch import ProductBatch
from app.models.transaction import InventoryTransaction
from app.schemas.product import ProductCreate, ProductUpdate
from app.repositories.product_repository import ProductRepository
from app.core.exceptions import ItemNotFoundException, DuplicateEntryException

class ProductService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = ProductRepository(db)

    def get_product(self, product_id: int) -> Product:
        product = self.repo.get_by_id(product_id)
        if not product:
            raise ItemNotFoundException(f"Product with ID '{product_id}' not found.")
        return product

    def lookup_barcode(self, barcode: str) -> Optional[Product]:
        return self.repo.get_by_barcode(barcode)

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
        return self.repo.list_products(
            search=search,
            category_id=category_id,
            supplier_id=supplier_id,
            stock_status=stock_status,
            status=status,
            skip=skip,
            limit=limit
        )

    def create_product(self, data: ProductCreate, user_id: Optional[int] = None) -> Product:
        if self.repo.get_by_barcode(data.barcode):
            raise DuplicateEntryException(f"Product with barcode '{data.barcode}' already exists.")
        if self.repo.get_by_code(data.product_code):
            raise DuplicateEntryException(f"Product code '{data.product_code}' already exists.")

        product = Product(
            product_code=data.product_code,
            name=data.name,
            category_id=data.category_id,
            barcode=data.barcode.strip(),
            supplier_id=data.supplier_id,
            selling_price=data.selling_price,
            purchase_price=data.purchase_price,
            minimum_stock_level=data.minimum_stock_level,
            status=data.status
        )
        created_product = self.repo.create(product)

        # Create initial batch if quantity > 0 or batch details provided
        if data.initial_batch_number:
            exp_date = datetime.strptime(data.initial_expiry_date, "%Y-%m-%d").date() if data.initial_expiry_date else date(2026, 12, 31)
            batch = ProductBatch(
                product_id=created_product.id,
                batch_number=data.initial_batch_number,
                expiry_date=exp_date,
                quantity=data.initial_quantity or 0,
                expiry_source="manual"
            )
            self.repo.create_batch(batch)

            if data.initial_quantity and data.initial_quantity > 0:
                tx = InventoryTransaction(
                    product_id=created_product.id,
                    batch_id=batch.id,
                    transaction_type="STOCK_IN",
                    quantity_changed=data.initial_quantity,
                    previous_quantity=0,
                    new_quantity=data.initial_quantity,
                    reason="Initial product creation stock",
                    performed_by=user_id
                )
                self.db.add(tx)
                self.db.commit()

        return self.get_product(created_product.id)

    def update_product(self, product_id: int, data: ProductUpdate) -> Product:
        product = self.get_product(product_id)

        if data.barcode and data.barcode != product.barcode:
            existing = self.repo.get_by_barcode(data.barcode)
            if existing and existing.id != product_id:
                raise DuplicateEntryException(f"Barcode '{data.barcode}' is already in use.")
            product.barcode = data.barcode.strip()

        if data.name is not None:
            product.name = data.name
        if data.category_id is not None:
            product.category_id = data.category_id
        if data.supplier_id is not None:
            product.supplier_id = data.supplier_id
        if data.selling_price is not None:
            product.selling_price = data.selling_price
        if data.purchase_price is not None:
            product.purchase_price = data.purchase_price
        if data.minimum_stock_level is not None:
            product.minimum_stock_level = data.minimum_stock_level
        if data.status is not None:
            product.status = data.status

        return self.repo.update(product)

    def delete_product(self, product_id: int) -> None:
        product = self.get_product(product_id)
        if product.transactions or product.sale_items:
            # Soft delete if product has transaction history
            self.repo.soft_delete(product)
        else:
            # Hard delete if unused
            self.repo.hard_delete(product)
