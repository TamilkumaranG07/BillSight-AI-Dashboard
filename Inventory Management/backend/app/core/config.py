import os
from typing import List, Union
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "BillSight AI - Inventory Management API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./inventory.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key-billsight-ai-inventory-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    
    # Business Rules Configuration
    NEAR_EXPIRY_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = ["*"]
    
    # Expiry Detector Plugin Selection ("null", "ocr", etc.)
    EXPIRY_DETECTOR_TYPE: str = "null"

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
