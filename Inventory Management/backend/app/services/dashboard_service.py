from typing import Dict, Any
from sqlalchemy.orm import Session
from app.repositories.dashboard_repository import DashboardRepository
from app.schemas.dashboard import (
    DashboardAnalyticsResponse,
    DashboardCards,
    ChartDataset,
    LowStockAlertItem,
    ExpiryAlertItem
)

class DashboardService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = DashboardRepository(db)

    def get_analytics(self) -> DashboardAnalyticsResponse:
        cards_raw = self.repo.get_kpi_cards()
        cards = DashboardCards(**cards_raw)

        stock_cat_raw = self.repo.get_stock_by_category()
        stock_by_category = ChartDataset(**stock_cat_raw)

        expiry_dist_raw = self.repo.get_expiry_distribution()
        expiry_distribution = ChartDataset(**expiry_dist_raw)

        top_selling = self.repo.get_top_selling_products(limit=5)

        low_stock_raw = self.repo.get_low_stock_alerts()
        low_stock_alerts = [LowStockAlertItem(**item) for item in low_stock_raw]

        expiry_alerts_raw = self.repo.get_expiry_alerts()
        expiry_alerts = [ExpiryAlertItem(**item) for item in expiry_alerts_raw]

        stock_movement = ChartDataset(
            labels=["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets=[
                {"label": "Stock In", "data": [120, 80, 200, 150, 90, 300, 50]},
                {"label": "Stock Out (Sales)", "data": [90, 110, 140, 180, 130, 250, 120]}
            ]
        )

        sales_vs_inventory = ChartDataset(
            labels=["W1", "W2", "W3", "W4"],
            datasets=[
                {"label": "Inventory Valuation (₹)", "data": [45000, 48000, 42000, 51000]},
                {"label": "Sales Revenue (₹)", "data": [12000, 15000, 18000, 22000]}
            ]
        )

        return DashboardAnalyticsResponse(
            cards=cards,
            stock_by_category=stock_by_category,
            expiry_distribution=expiry_distribution,
            top_selling_products=top_selling,
            stock_movement=stock_movement,
            sales_vs_inventory=sales_vs_inventory,
            low_stock_alerts=low_stock_alerts,
            expiry_alerts=expiry_alerts
        )
