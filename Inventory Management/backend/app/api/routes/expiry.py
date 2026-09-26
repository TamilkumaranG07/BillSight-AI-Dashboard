from typing import List, Optional
from fastapi import APIRouter, Depends, Query, File, UploadFile, status, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.expiry import ExpiryRecordResponse
from app.services.expiry_service import ExpiryService

router = APIRouter(prefix="/expiry", tags=["Expiry Management"])

@router.get("", response_model=List[ExpiryRecordResponse])
def get_expiry_records(
    status: Optional[str] = Query(None, description="near_expiry, expired, valid"),
    db: Session = Depends(get_db)
):
    service = ExpiryService(db)
    return service.get_expiry_records(status=status)

@router.post("/detect", status_code=status.HTTP_501_NOT_IMPLEMENTED)
async def detect_expiry_from_image(file: Optional[UploadFile] = File(None)):
    """Extension point for future AI Expiry Date OCR detection (OpenCV + PaddleOCR/Tesseract)."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="AI Expiry OCR detection module is not enabled in current build. See docs/expiry-detection-roadmap.md"
    )
