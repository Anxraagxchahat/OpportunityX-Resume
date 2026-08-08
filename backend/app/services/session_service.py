from typing import Optional
from sqlalchemy.orm import Session
from app.repositories.user_repository import SessionRepository
from app.db.models.models import UserSession

class SessionService:
    def __init__(self, db: Session):
        self.repo = SessionRepository(db)

    def start_user_session(
        self,
        user_id: str,
        user_agent: Optional[str] = None,
        ip_address: Optional[str] = None
    ) -> UserSession:
        browser = "Browser"
        os = "OS"
        device = "Desktop"
        if user_agent:
            if "Chrome" in user_agent:
                browser = "Chrome"
            elif "Firefox" in user_agent:
                browser = "Firefox"
            elif "Safari" in user_agent:
                browser = "Safari"
            elif "Edge" in user_agent:
                browser = "Edge"

            if "Windows" in user_agent:
                os = "Windows"
            elif "Mac" in user_agent:
                os = "macOS"
            elif "Android" in user_agent:
                os = "Android"
                device = "Mobile"
            elif "iPhone" in user_agent or "iPad" in user_agent:
                os = "iOS"
                device = "Mobile"

        return self.repo.create_session(
            user_id=user_id,
            browser=browser,
            device=device,
            os=os,
            ip=ip_address
        )
