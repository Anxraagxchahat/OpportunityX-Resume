from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from app.db.models.models import ActivityLog

class ActivityRepository:
    def __init__(self, db: Session):
        self.db = db

    def log_activity(
        self,
        user_id: str,
        event_type: str,
        details: Optional[Dict[str, Any]] = None,
        ip_address: Optional[str] = None
    ) -> ActivityLog:
        log = ActivityLog(
            user_id=user_id,
            event_type=event_type,
            details=details or {},
            ip_address=ip_address
        )
        self.db.add(log)
        self.db.commit()
        self.db.refresh(log)
        return log
