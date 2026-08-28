from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
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
    "https://www.resume.opportunityx.co.in",
    "https://opportunityx.co.in",
    "https://www.opportunityx.co.in",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
]
for o in default_origins:
    if o not in cors_origins:
        cors_origins.append(o)

frontend_url = getattr(settings, "FRONTEND_URL", "https://resume.opportunityx.co.in")
if frontend_url and frontend_url not in cors_origins and frontend_url != "*":
    cors_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_origin_regex=r"https://.*\.vercel\.app|https://.*\.opportunityx\.co\.in|http://localhost:\d+",
    allow_credentials=True,
    allow_methods=["GET", "HEAD", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

from sqlalchemy.exc import SQLAlchemyError
import re

def get_cors_headers(request: Request) -> dict:
    origin = request.headers.get("origin")
    if not origin:
        return {}
    allowed_list = cors_origins
    is_allowed = origin in allowed_list or bool(
        re.match(r"^https://.*\.vercel\.app$|^https://.*\.opportunityx\.co\.in$|^http://localhost:\d+$", origin)
    )
    if is_allowed:
        return {
            "Access-Control-Allow-Origin": origin,
            "Access-Control-Allow-Credentials": "true"
        }
    return {}

# 3. Exception Handlers (Ensures CORS headers are attached & correct status code returned)
@app.exception_handler(SQLAlchemyError)
async def db_exception_handler(request: Request, exc: SQLAlchemyError):
    logger.error(f"Database Exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    headers = get_cors_headers(request)
    detail_msg = f"Database service temporarily unavailable: {str(exc)}" if settings.is_dev else "Database service temporarily unavailable. Please try again later."
    return JSONResponse(
        status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
        content={"detail": detail_msg},
        headers=headers
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled Exception on {request.method} {request.url.path}: {exc}", exc_info=True)
    headers = get_cors_headers(request)
    detail_msg = f"Internal Server Error: {str(exc)}" if settings.is_dev else "An unexpected internal server error occurred. Please try again later."
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": detail_msg},
        headers=headers
    )

# 4. Include Central Router (Both /api and /api/v1 to prevent 404 on any client)
app.include_router(api_router, prefix="/api/v1")
app.include_router(api_router, prefix="/api")

from fastapi import Response

@app.api_route("/health", methods=["GET", "HEAD"], include_in_schema=True)
async def health_check_root(request: Request):
    """Universal lightweight health check endpoint supporting GET and HEAD for monitoring"""
    if request.method == "HEAD":
        return Response(status_code=status.HTTP_200_OK)
    return {"status": "ok"}

@app.get("/")
async def root():
    return {
        "app": settings.APP_NAME,
        "version": "1.0.0",
        "docs": "/docs" if settings.is_dev else None,
        "health": "/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=settings.PORT, reload=settings.is_dev)
