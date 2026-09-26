import random
from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.sale import Sale, SaleItem
from app.models.transaction import InventoryTransaction
from app.schemas.sale import SaleCreate
from app.repositories.sale_repository import SaleRepository
from app.repositories.product_repository import ProductRepository
from app.core.exceptions import ItemNotFoundException, InsufficientStockException, ExpiredBatchException

class SaleService:
    def __init__(self, db: Session):
        self.db = db
        self.sale_repo = SaleRepository(db)
        self.prod_repo = ProductRepository(db)

    def process_sale(self, data: SaleCreate, cashier_id: Optional[int] = None) -> Sale:
        # Check idempotency key if provided
        if data.idempotency_key:
            existing_sale = self.sale_repo.get_sale_by_invoice(data.idempotency_key)
            if existing_sale:
                return existing_sale

        # Generate unique invoice number
        date_str = datetime.now().strftime("%Y%m%d")
        rand_str = f"{random.randint(1000, 9999)}"
        invoice_number = data.idempotency_key or f"INV-{date_str}-{rand_str}"

        # Single atomic DB transaction context
        try:
            total_amount = 0.0
            sale_items_to_create = []
            transactions_to_create = []

            for item_data in data.items:
                product = self.prod_repo.get_by_id(item_data.product_id)
                if not product or product.status != "active":
                    raise ItemNotFoundException(f"Product ID '{item_data.product_id}' is unavailable or inactive")

                requested_qty = item_data.quantity
                unit_price = product.selling_price
                line_total = round(requested_qty * unit_price, 2)
                total_amount += line_total

                # FEFO Batch Selection
                fefo_batches = self.sale_repo.get_fefo_batches(product.id)
                available_total = sum(b.quantity for b in fefo_batches)

                if available_total < requested_qty:
                    raise InsufficientStockException(
                        f"Insufficient valid stock for '{product.name}'. Required: {requested_qty}, Available non-expired: {available_total}."
                    )

                remaining_to_deduct = requested_qty
                prev_prod_qty = product.current_quantity

                for batch in fefo_batches:
                    if remaining_to_deduct <= 0:
                        break

                    deduct_from_batch = min(batch.quantity, remaining_to_deduct)
                    batch.quantity -= deduct_from_batch
                    remaining_to_deduct -= deduct_from_batch

                    # Register sale item line per batch
                    sale_item = SaleItem(
                        product_id=product.id,
                        batch_id=batch.id,
                        quantity=deduct_from_batch,
                        unit_price=unit_price,
                        line_total=round(deduct_from_batch * unit_price, 2)
                    )
                    sale_items_to_create.append(sale_item)

                    # Create Inventory Transaction
                    tx = InventoryTransaction(
                        product_id=product.id,
                        batch_id=batch.id,
                        transaction_type="SALE",
                        quantity_changed=-deduct_from_batch,
                        previous_quantity=prev_prod_qty,
                        new_quantity=prev_prod_qty - deduct_from_batch,
                        reason=f"Sale Invoice {invoice_number}",
                        reference_id=invoice_number,
                        performed_by=cashier_id
                    )
                    transactions_to_create.append(tx)
                    prev_prod_qty -= deduct_from_batch

            final_grand_total = max(0.0, round(total_amount + data.tax_amount - data.discount_amount, 2))

            sale = Sale(
                invoice_number=invoice_number,
                total_amount=final_grand_total,
                tax_amount=data.tax_amount,
                discount_amount=data.discount_amount,
                payment_method=data.payment_method,
                payment_status="paid",
                cashier_id=cashier_id
            )
            self.db.add(sale)
            self.db.flush() # get sale.id

            for s_item in sale_items_to_create:
                s_item.sale_id = sale.id
                self.db.add(s_item)

            for tx in transactions_to_create:
                tx.reference_id = f"SALE-{sale.id}"
                self.db.add(tx)

            self.db.commit()
            return self.sale_repo.get_sale_by_invoice(invoice_number)

        except Exception as e:
            self.db.rollback()
            raise e
