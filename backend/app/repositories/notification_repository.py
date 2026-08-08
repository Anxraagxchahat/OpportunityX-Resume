from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from app.db.models.models import Notification
from app.repositories.base_repository import BaseRepository

class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, db: Session):
        super().__init__(Notification, db)

    def create_notification(
        self,
        user_id: str,
        type_: str,
        title: str,
        message: str,
        metadata_info: Optional[Dict[str, Any]] = None
    ) -> Notification:
        notification = Notification(
            user_id=user_id,
            type=type_,
            title=title,
            message=message,
            metadata_info=metadata_info or {}
        )
        self.db.add(notification)
        self.db.commit()
        self.db.refresh(notification)
        return notification

    def get_user_notifications(self, user_id: str, limit: int = 50) -> List[Notification]:
        return (
            self.db.query(Notification)
            .filter(Notification.user_id == user_id)
            .order_by(Notification.created_at.desc())
            .limit(limit)
            .all()
        )

    def mark_as_read(self, notification_id: str) -> bool:
        notification = self.get_by_id(notification_id)
        if notification:
            notification.is_read = True
            self.db.commit()
            return True
        return False
