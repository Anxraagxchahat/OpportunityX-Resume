from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.logging import logger, StructuredLoggingMiddleware
from app.core.database import SessionLocal
from app.db.init_db import init_db
from app.api.v1.api import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.APP_NAME} in environment '{settings.APP_ENV}'...")
    try:
        db = SessionLocal()
        try:
            init_db(db)
        finally:
            db.close()
    except Exception as e:
        logger.error(f"Database initialization deferred/failed on startup: {e}")
    yield
    logger.info(f"Shutting down {settings.APP_NAME}...")

app = FastAPI(
    title=settings.APP_NAME,
    description="OpportunityX Resume Production Backend — Cashfree Payment Gateway & OpenRouter AI Infrastructure",
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/docs" if settings.is_dev else None,
    redoc_url="/redoc" if settings.is_dev else None
)

# 1. Structured JSON Logging Middleware
app.add_middleware(StructuredLoggingMiddleware)

# 2. CORS Middleware (Added last to be the outermost wrapper for all HTTP responses)
cors_origins = [o for o in (settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else []) if o != "*"]
default_origins = [
    "https://resume.opportunityx.co.in",
    "https://opportunityx.co.in",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
for o in default_origins:
    if o not in cors_origins:
        cors_origins.append(o)

if settings.FRONTEND_URL and settings.FRONTEND_URL not in cors_origins and settings.FRONTEND_URL != "*":
    cors_origins.append(settings.FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.opportunityx\.co\.in|http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# 3. Include Central Router
app.include_router(api_router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs" if settings.is_dev else None,
        "health": "/api/v1/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=settings.is_dev)
