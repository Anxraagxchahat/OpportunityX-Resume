from typing import Optional, Dict, Any
from sqlalchemy.orm Session
from app.repositories.notification_repository import NotificationRepository
from app.db.models.models import Notification

class NotificationService:
    def __init__(self, db: Session):
        self.repo = NotificationRepository(db)

    def send_welcome_credits_notification(self, user_id: str) -> Notification:
        return self.repo.create_notification(
            user_id=user_id,
            type_="WELCOME_CREDITS",
            title="🎁 5 Welcome AI Credits Added!",
            message="Welcome to OpportunityX Resume! 5 free credits have been added to your wallet."
        )

    def send_payment_success_notification(self, user_id: str, credits: int, amount: float) -> Notification:
        return self.repo.create_notification(
            user_id=user_id,
            type_="PAYMENT_SUCCESS",
            title="✅ Credit Pack Purchased Successfully!",
            message=f"₹{amount} payment confirmed! +{credits} AI Credits added to your account.",
            metadata_info={"credits": credits, "amount": amount}
        )

    def send_ai_completed_notification(self, user_id: str, feature: str) -> Notification:
        return self.repo.create_notification(
            user_id=user_id,
            type_="AI_COMPLETED",
            title="✨ AI Content Generated",
            message=f"AI generation for {feature} completed successfully.",
            metadata_info={"feature": feature}
        )
