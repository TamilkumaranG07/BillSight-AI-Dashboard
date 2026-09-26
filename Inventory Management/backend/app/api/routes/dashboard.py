from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.dashboard import DashboardAnalyticsResponse
from app.services.dashboard_service import DashboardService

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/analytics", response_model=DashboardAnalyticsResponse)
def get_dashboard_analytics(db: Session = Depends(get_db)):
    service = DashboardService(db)
    return service.get_analytics()
