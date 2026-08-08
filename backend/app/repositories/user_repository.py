from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.models import User, UserSession, UserAsset
from app.repositories.base_repository import BaseRepository
from datetime import datetime

class UserRepository(BaseRepository[User]):
    def __init__(self, db: Session):
        super().__init__(User, db)

    def get_by_uid(self, uid: str) -> Optional[User]:
        return self.db.query(User).filter(User.id == uid).first()

    def sync_user(self, uid: str, email: str, display_name: str = None, photo_url: str = None, provider: str = "google") -> User:
        user = self.get_by_uid(uid)
        if not user:
            user = User(
                id=uid,
                email=email,
                display_name=display_name,
                photo_url=photo_url,
                provider=provider
            )
            self.db.add(user)
        else:
            if display_name:
                user.display_name = display_name
            if photo_url:
                user.photo_url = photo_url
        self.db.commit()
        self.db.refresh(user)
        return user

class SessionRepository(BaseRepository[UserSession]):
    def __init__(self, db: Session):
        super().__init__(UserSession, db)

    def create_session(self, user_id: str, browser: str = None, device: str = None, os: str = None, ip: str = None) -> UserSession:
        session = UserSession(
            user_id=user_id,
            browser=browser,
            device=device,
            operating_system=os,
            ip_address=ip,
            status="ACTIVE"
        )
        self.db.add(session)
        self.db.commit()
        self.db.refresh(session)
        return session

    def close_session(self, session_id: str):
        session = self.get_by_id(session_id)
        if session:
            session.logout_time = datetime.now()
            session.status = "LOGGED_OUT"
            self.db.commit()

class UserAssetRepository(BaseRepository[UserAsset]):
    def __init__(self, db: Session):
        super().__init__(UserAsset, db)

    def get_user_assets(self, user_id: str, asset_type: Optional[str] = None) -> List[UserAsset]:
        query = self.db.query(UserAsset).filter(UserAsset.user_id == user_id)
        if asset_type:
            query = query.filter(UserAsset.asset_type == asset_type)
        return query.all()
