from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from app.db.session import get_db
from app.models.category import Category
from app.schemas.category import CategoryCreate, CategoryResponse

router = APIRouter(prefix="/categories", tags=["Categories"])

@router.get("", response_model=List[CategoryResponse])
def list_categories(db: Session = Depends(get_db)):
    categories = db.scalars(select(Category)).all()
    return [CategoryResponse.model_validate(c) for c in categories]

@router.post("", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED)
def create_category(data: CategoryCreate, db: Session = Depends(get_db)):
    category = Category(name=data.name, description=data.description)
    db.add(category)
    db.commit()
    db.refresh(category)
    return CategoryResponse.model_validate(category)
