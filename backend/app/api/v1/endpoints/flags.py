from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.feature_flag_service import FeatureFlagService
from typing import Dict

router = APIRouter(prefix="/flags", tags=["Feature Flags System"])

@router.get("/all", response_model=Dict[str, bool])
async def get_feature_flags(db: Session = Depends(get_db)):
    service = FeatureFlagService(db)
    return service.get_all_flags()
