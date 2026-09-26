from datetime import datetime, date
from typing import List, Optional, Tuple
from sqlalchemy.orm import Session
from app.models.product import Product
from app.models.batch import ProductBatch
from app.models.transaction import InventoryTransaction
from app.schemas.transaction import StockActionRequest
from app.repositories.inventory_repository import InventoryRepository
from app.repositories.product_repository import ProductRepository
from app.core.exceptions import ItemNotFoundException, InsufficientStockException, ExpiredBatchException

class InventoryService:
    def __init__(self, db: Session):
        self.db = db
        self.inv_repo = InventoryRepository(db)
        self.prod_repo = ProductRepository(db)

    def execute_stock_action(
        self,
        product_id: int,
        action: StockActionRequest,
        user_id: Optional[int] = None
    ) -> InventoryTransaction:
        product = self.prod_repo.get_by_id(product_id)
        if not product:
            raise ItemNotFoundException(f"Product ID '{product_id}' not found")

        previous_quantity = product.current_quantity
        batch_number = action.batch_number or "BATCH-DEFAULT"
        batch = self.prod_repo.get_batch_by_number(product_id, batch_number)

        today = date.today()

        if action.transaction_type == "STOCK_IN":
            if not batch:
                if not action.expiry_date:
                    exp_date = date(2026, 12, 31)
                else:
                    exp_date = datetime.strptime(action.expiry_date, "%Y-%m-%d").date()
                
                if exp_date < today and not action.expiry_override:
                    raise ExpiredBatchException("Cannot add stock with an expired batch date without override flag")

                batch = ProductBatch(
                    product_id=product_id,
                    batch_number=batch_number,
                    expiry_date=exp_date,
                    quantity=action.quantity,
                    expiry_source="manual"
                )
                batch = self.prod_repo.create_batch(batch)
            else:
                batch.quantity += action.quantity
                self.db.commit()

            quantity_changed = action.quantity

        else: # ADJUSTMENT, DAMAGED, EXPIRED_REMOVAL, RETURN
            if not batch or batch.quantity < action.quantity:
                # If target batch doesn't have enough, try deducting across available batches or error out
                if action.transaction_type != "RETURN" and previous_quantity < action.quantity:
                    raise InsufficientStockException(
                        f"Cannot reduce {action.quantity} units. Current total stock is {previous_quantity}."
                    )

            if action.transaction_type in ("DAMAGED", "EXPIRED_REMOVAL"):
                quantity_changed = -action.quantity
                if batch:
                    if batch.quantity < action.quantity:
                        raise InsufficientStockException(f"Batch '{batch_number}' has only {batch.quantity} units available")
                    batch.quantity -= action.quantity
            elif action.transaction_type == "ADJUSTMENT":
                # Adjustment can be positive or negative based on reason or input
                quantity_changed = action.quantity
                if batch:
                    new_b_qty = batch.quantity + quantity_changed
                    if new_b_qty < 0:
                        raise InsufficientStockException("Adjustment results in negative batch quantity")
                    batch.quantity = new_b_qty
            elif action.transaction_type == "RETURN":
                quantity_changed = action.quantity
                if batch:
                    batch.quantity += action.quantity
                else:
                    batch = ProductBatch(
                        product_id=product_id,
                        batch_number=batch_number,
                        expiry_date=date(2026, 12, 31),
                        quantity=action.quantity,
                        expiry_source="manual"
                    )
                    batch = self.prod_repo.create_batch(batch)

            self.db.commit()

        # Fetch updated product to compute new total stock
        self.db.refresh(product)
        new_quantity = product.current_quantity

        tx = InventoryTransaction(
            product_id=product_id,
            batch_id=batch.id if batch else None,
            transaction_type=action.transaction_type,
            quantity_changed=quantity_changed,
            previous_quantity=previous_quantity,
            new_quantity=new_quantity,
            reason=action.reason,
            performed_by=user_id
        )
        return self.inv_repo.add_transaction(tx)

    def list_transactions(
        self,
        product_id: Optional[int] = None,
        transaction_type: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> Tuple[List[InventoryTransaction], int]:
        return self.inv_repo.list_transactions(
            product_id=product_id,
            transaction_type=transaction_type,
            skip=skip,
            limit=limit
        )
