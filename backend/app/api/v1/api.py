from fastapi import APIRouter
from app.api.v1.endpoints import health, auth, payments, credits, resumes, ai, flags, ecosystem

api_router = APIRouter()

api_router.include_router(health.router)
api_router.include_router(auth.router)
api_router.include_router(payments.router)
api_router.include_router(credits.router)
api_router.include_router(resumes.router)
api_router.include_router(ai.router)
api_router.include_router(flags.router)
api_router.include_router(ecosystem.router)
