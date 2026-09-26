from typing import Dict, Any, List
from datetime import date, timedelta
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import select, func, desc
from app.models.product import Product
from app.models.batch import ProductBatch
from app.models.category import Category
from app.models.sale import Sale, SaleItem
from app.models.transaction import InventoryTransaction
from app.core.config import settings

class DashboardRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_kpi_cards(self) -> Dict[str, Any]:
        products = self.db.scalars(select(Product).options(joinedload(Product.batches))).unique().all()
        
        total_products = len(products)
        total_quantity = sum(p.current_quantity for p in products)
        total_inventory_value = round(sum(p.current_quantity * p.purchase_price for p in products), 2)
        
        low_stock_count = sum(1 for p in products if p.stock_status == "LOW_STOCK")
        out_of_stock_count = sum(1 for p in products if p.stock_status == "OUT_OF_STOCK")
        
        today = date.today()
        near_expiry_cutoff = today + timedelta(days=settings.NEAR_EXPIRY_DAYS)
        
        batches = self.db.scalars(select(ProductBatch).where(ProductBatch.quantity > 0)).all()
        expired_count = sum(1 for b in batches if b.expiry_date < today)
        near_expiry_count = sum(1 for b in batches if today <= b.expiry_date <= near_expiry_cutoff)

        return {
            "total_products": total_products,
            "total_quantity": total_quantity,
            "total_inventory_value": total_inventory_value,
            "low_stock_count": low_stock_count,
            "near_expiry_count": near_expiry_count,
            "expired_count": expired_count,
            "out_of_stock_count": out_of_stock_count
        }

    def get_stock_by_category(self) -> Dict[str, Any]:
        categories = self.db.scalars(select(Category).options(joinedload(Category.products).joinedload(Product.batches))).unique().all()
        labels = []
        quantities = []
        values = []

        for c in categories:
            labels.append(c.name)
            cat_qty = sum(p.current_quantity for p in c.products)
            cat_val = sum(p.current_quantity * p.purchase_price for p in c.products)
            quantities.append(cat_qty)
            values.append(round(cat_val, 2))

        return {
            "labels": labels,
            "datasets": [
                {"label": "Total Units", "data": quantities},
                {"label": "Stock Value (₹)", "data": values}
            ]
        }

    def get_expiry_distribution(self) -> Dict[str, Any]:
        today = date.today()
        near_cutoff = today + timedelta(days=settings.NEAR_EXPIRY_DAYS)
        batches = self.db.scalars(select(ProductBatch).where(ProductBatch.quantity > 0)).all()

        valid = sum(1 for b in batches if b.expiry_date > near_cutoff)
        near_expiry = sum(1 for b in batches if today <= b.expiry_date <= near_cutoff)
        expired = sum(1 for b in batches if b.expiry_date < today)

        return {
            "labels": ["Valid", "Near Expiry", "Expired"],
            "datasets": [
                {
                    "label": "Batches Count",
                    "data": [valid, near_expiry, expired]
                }
            ]
        }

    def get_top_selling_products(self, limit: int = 5) -> List[Dict[str, Any]]:
        # Query total quantity sold from sale_items
        stmt = (
            select(
                SaleItem.product_id,
                Product.name,
                func.sum(SaleItem.quantity).label("units_sold"),
                func.sum(SaleItem.line_total).label("total_revenue")
            )
            .join(Product, SaleItem.product_id == Product.id)
            .group_by(SaleItem.product_id, Product.name)
            .order_by(desc("units_sold"))
            .limit(limit)
        )
        results = self.db.execute(stmt).all()
        return [
            {
                "product_id": r[0],
                "product_name": r[1],
                "units_sold": int(r[2] or 0),
                "total_revenue": float(r[3] or 0.0)
            }
            for r in results
        ]

    def get_low_stock_alerts(self) -> List[Dict[str, Any]]:
        products = self.db.scalars(select(Product).options(joinedload(Product.batches))).unique().all()
        alerts = []
        for p in products:
            qty = p.current_quantity
            if qty == 0:
                alerts.append({
                    "id": p.id,
                    "name": p.name,
                    "product_code": p.product_code,
                    "barcode": p.barcode,
                    "current_quantity": qty,
                    "minimum_stock_level": p.minimum_stock_level,
                    "reorder_status": "REORDER_NOW"
                })
            elif qty <= p.minimum_stock_level:
                alerts.append({
                    "id": p.id,
                    "name": p.name,
                    "product_code": p.product_code,
                    "barcode": p.barcode,
                    "current_quantity": qty,
                    "minimum_stock_level": p.minimum_stock_level,
                    "reorder_status": "REORDER_SOON"
                })
        return alerts

    def get_expiry_alerts(self) -> List[Dict[str, Any]]:
        today = date.today()
        near_cutoff = today + timedelta(days=settings.NEAR_EXPIRY_DAYS)
        batches = self.db.scalars(
            select(ProductBatch)
            .options(joinedload(ProductBatch.product))
            .where(ProductBatch.quantity > 0, ProductBatch.expiry_date <= near_cutoff)
            .order_by(ProductBatch.expiry_date)
        ).unique().all()

        alerts = []
        for b in batches:
            days_left = (b.expiry_date - today).days
            status_str = "expired" if days_left < 0 else "near_expiry"
            alerts.append({
                "id": b.id,
                "product_name": b.product.name if b.product else "Unknown",
                "batch_number": b.batch_number,
                "expiry_date": str(b.expiry_date),
                "quantity": b.quantity,
                "status": status_str,
                "days_remaining": days_left
            })
        return alerts
