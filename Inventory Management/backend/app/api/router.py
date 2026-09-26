from fastapi import APIRouter
from app.api.routes import (
    auth,
    products,
    inventory,
    sales,
    dashboard,
    suppliers,
    categories,
    reports,
    expiry,
)

api_router = APIRouter(prefix="/api")

api_router.include_router(auth.router)
api_router.include_router(products.router)
api_router.include_router(inventory.router)
api_router.include_router(sales.router)
api_router.include_router(dashboard.router)
api_router.include_router(suppliers.router)
api_router.include_router(categories.router)
api_router.include_router(reports.router)
api_router.include_router(expiry.router)
