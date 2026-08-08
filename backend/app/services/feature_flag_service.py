from typing import Dict, Any, List
from sqlalchemy.orm import Session
from app.repositories.feature_flag_repository import FeatureFlagRepository

class FeatureFlagService:
    def __init__(self, db: Session):
        self.repo = FeatureFlagRepository(db)

    def is_enabled(self, key: str, default: bool = True) -> bool:
        return self.repo.is_flag_enabled(key, default)

    def get_all_flags(self) -> Dict[str, bool]:
        flags = self.repo.get_all_flags()
        return {flag.key: flag.is_enabled for flag in flags}
