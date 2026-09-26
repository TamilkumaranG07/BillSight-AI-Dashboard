import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.db.session import engine
from app.db.base import Base
from app.api.router import api_router
from app.api.routes.ws import router as ws_router
from app.services.expiry_service import ExpiryService
from app.db.session import SessionLocal

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("billsight.inventory")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing Database Tables...")
    Base.metadata.create_all(bind=engine)
    
    # Run initial expiry refresh calculation
    try:
        db = SessionLocal()
        expiry_srv = ExpiryService(db)
        count = expiry_srv.run_daily_expiry_check()
        logger.info(f"Refreshed {count} expiry records on startup.")
        db.close()
    except Exception as e:
        logger.warning(f"Could not refresh expiry records on startup: {e}")
        
    yield
    logger.info("Shutting down Inventory Management API...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS setup
origins = settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev & dashboard integration
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handlers
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Global unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "An unexpected error occurred on the server.",
                "details": str(exc) if os.getenv("DEBUG") else None
            }
        }
    )

# Routers
app.include_router(api_router)
app.include_router(ws_router)

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": settings.PROJECT_NAME, "version": settings.VERSION}
