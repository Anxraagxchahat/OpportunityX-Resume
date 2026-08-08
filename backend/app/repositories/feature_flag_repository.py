from typing import Optional, List, Dict
from sqlalchemy.orm import Session
from app.db.models.models import FeatureFlag
from app.repositories.base_repository import BaseRepository

class FeatureFlagRepository(BaseRepository[FeatureFlag]):
    def __init__(self, db: Session):
        super().__init__(FeatureFlag, db)

    def get_all_flags(self) -> List[FeatureFlag]:
        return self.db.query(FeatureFlag).all()

    def is_flag_enabled(self, key: str, default: bool = True) -> bool:
        flag = self.db.query(FeatureFlag).filter(FeatureFlag.key == key).first()
        if flag:
            return flag.is_enabled
        return default

    def set_flag(self, key: str, is_enabled: bool) -> Optional[FeatureFlag]:
        flag = self.db.query(FeatureFlag).filter(FeatureFlag.key == key).first()
        if flag:
            flag.is_enabled = is_enabled
            self.db.commit()
            self.db.refresh(flag)
        return flag
