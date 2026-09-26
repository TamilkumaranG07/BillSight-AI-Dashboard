from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class DashboardCards(BaseModel):
    total_products: int
    total_quantity: int
    total_inventory_value: float
    low_stock_count: int
    near_expiry_count: int
    expired_count: int
    out_of_stock_count: int

class LowStockAlertItem(BaseModel):
    id: int
    name: str
    product_code: str
    barcode: str
    current_quantity: int
    minimum_stock_level: int
    reorder_status: str # REORDER_NOW, REORDER_SOON, OK

class ExpiryAlertItem(BaseModel):
    id: int
    product_name: str
    batch_number: str
    expiry_date: str
    quantity: int
    status: str # near_expiry, expired
    days_remaining: int

class ChartDataset(BaseModel):
    labels: List[str]
    datasets: List[Dict[str, Any]]

class DashboardAnalyticsResponse(BaseModel):
    cards: DashboardCards
    stock_by_category: ChartDataset
    expiry_distribution: ChartDataset
    top_selling_products: List[Dict[str, Any]]
    stock_movement: ChartDataset
    sales_vs_inventory: ChartDataset
    low_stock_alerts: List[LowStockAlertItem]
    expiry_alerts: List[ExpiryAlertItem]
