from fastapi import APIRouter, Depends, Request, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, AuthenticatedUser
from app.repositories.user_repository import UserRepository
from app.repositories.credit_repository import CreditRepository
from app.repositories.activity_repository import ActivityRepository
from app.services.session_service import SessionService
from app.services.notification_service import NotificationService
from app.db.schemas.schemas import UserResponse, CreditWalletResponse

router = APIRouter(prefix="/auth", tags=["Authentication & User Identity Cache"])

@router.post("/sync", response_model=UserResponse)
async def sync_user_profile(
    request: Request,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user_repo = UserRepository(db)
    credit_repo = CreditRepository(db)
    session_service = SessionService(db)
    activity_repo = ActivityRepository(db)
    notification_service = NotificationService(db)

    # 1. Sync User Cache (Firebase UID is immutable PK)
    db_user = user_repo.sync_user(
        uid=user.uid,
        email=user.email,
        display_name=user.name,
        photo_url=user.photo_url
    )

    # 2. Track Session
    user_agent = request.headers.get("user-agent")
    client_ip = request.client.host if request.client else None
    session_service.start_user_session(user_id=user.uid, user_agent=user_agent, ip_address=client_ip)

    # 3. Check / Claim 5 Welcome Credits if new user
    wallet, newly_claimed = credit_repo.claim_welcome_bonus(user_id=user.uid, bonus_credits=5)
    if newly_claimed:
        notification_service.send_welcome_credits_notification(user_id=user.uid)
        activity_repo.log_activity(
            user_id=user.uid,
            event_type="WELCOME_CREDITS_CLAIMED",
            details={"credits": 5},
            ip_address=client_ip
        )

    # Log Login Activity
    activity_repo.log_activity(
        user_id=user.uid,
        event_type="USER_LOGIN",
        details={"email": user.email},
        ip_address=client_ip
    )

    return db_user
