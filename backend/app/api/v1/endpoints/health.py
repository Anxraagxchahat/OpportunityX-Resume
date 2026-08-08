import time
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from sqlalchemy import text
from app.core.database import get_db
from app.core.config import settings
from app.db.schemas.schemas import HealthStatusResponse, MetricsResponse
from app.db.models.models import User, UserSession, Resume

router = APIRouter(tags=["Health & Monitoring"])
START_TIME = time.time()

from fastapi.responses import JSONResponse

@router.get("/health", response_model=HealthStatusResponse)
async def health_check(db: Session = Depends(get_db)):
    db_status = "connected"
    try:
        db.execute(text("SELECT 1"))
    except Exception:
        db_status = "disconnected"

    payload = {
        "status": "ok" if db_status == "connected" else "degraded",
        "database": db_status,
        "service": settings.APP_NAME,
        "version": "1.0.0",
        "environment": settings.APP_ENV
    }

    if db_status != "connected":
        return JSONResponse(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, content=payload)

    return HealthStatusResponse(**payload)

@router.get("/health/warmup")
async def health_warmup():
    """Lightweight non-DB background warm-up ping for frontend initial load"""
    return {"status": "ok", "warm": True}

@router.get("/live")
async def liveness():
    return {"status": "alive"}

@router.get("/ready")
async def readiness(db: Session = Depends(get_db)):
    try:
        db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        return {"status": "not_ready", "database": str(e)}

@router.get("/metrics", response_model=MetricsResponse)
async def get_metrics(db: Session = Depends(get_db)):
    uptime = time.time() - START_TIME
    total_users = db.query(User).count()
    active_sessions = db.query(UserSession).filter(UserSession.status == "ACTIVE").count()
    total_resumes = db.query(Resume).count()
    return MetricsResponse(
        uptime_seconds=round(uptime, 2),
        total_users_cached=total_users,
        total_active_sessions=active_sessions,
        total_resumes_saved=total_resumes,
        database_status="healthy"
    )
