from typing import Optional, List
from sqlalchemy.orm import Session
from app.db.models.models import AICreditWallet, AICreditTransaction
from app.repositories.base_repository import BaseRepository

class CreditRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_wallet(self, user_id: str) -> Optional[AICreditWallet]:
        return self.db.query(AICreditWallet).filter(AICreditWallet.user_id == user_id).first()

    def get_or_create_wallet(self, user_id: str) -> AICreditWallet:
        wallet = self.get_wallet(user_id)
        if not wallet:
            wallet = AICreditWallet(
                user_id=user_id,
                remaining_credits=0,
                total_purchased=0,
                has_claimed_welcome=False
            )
            self.db.add(wallet)
            self.db.commit()
            self.db.refresh(wallet)
        return wallet

    def claim_welcome_bonus(self, user_id: str, bonus_credits: int = 5) -> tuple[AICreditWallet, bool]:
        wallet = self.get_or_create_wallet(user_id)
        if wallet.has_claimed_welcome:
            return wallet, False

        wallet.remaining_credits += bonus_credits
        wallet.has_claimed_welcome = True

        tx = AICreditTransaction(
            user_id=user_id,
            action_type="WELCOME_BONUS",
            credits_changed=bonus_credits,
            resulting_balance=wallet.remaining_credits,
            metadata_info={"description": "Claimed 5 Welcome AI Credits on first login"}
        )
        self.db.add(tx)
        self.db.commit()
        self.db.refresh(wallet)
        return wallet, True

    def add_purchased_credits(self, user_id: str, credits: int, pack_id: str, order_id: str) -> AICreditWallet:
        wallet = self.get_or_create_wallet(user_id)
        wallet.remaining_credits += credits
        wallet.total_purchased += credits

        tx = AICreditTransaction(
            user_id=user_id,
            action_type="PURCHASE",
            credits_changed=credits,
            resulting_balance=wallet.remaining_credits,
            metadata_info={"pack_id": pack_id, "order_id": order_id}
        )
        self.db.add(tx)
        self.db.commit()
        self.db.refresh(wallet)
        return wallet

    def deduct_credits(self, user_id: str, credits: int, feature: str) -> tuple[AICreditWallet, bool]:
        wallet = self.get_or_create_wallet(user_id)
        if wallet.remaining_credits < credits:
            return wallet, False

        wallet.remaining_credits -= credits
        tx = AICreditTransaction(
            user_id=user_id,
            action_type="AI_GENERATION",
            credits_changed=-credits,
            resulting_balance=wallet.remaining_credits,
            metadata_info={"feature": feature}
        )
        self.db.add(tx)
        self.db.commit()
        self.db.refresh(wallet)
        return wallet, True

    def get_transactions(self, user_id: str, limit: int = 50) -> List[AICreditTransaction]:
        return (
            self.db.query(AICreditTransaction)
            .filter(AICreditTransaction.user_id == user_id)
            .order_by(AICreditTransaction.created_at.desc())
            .limit(limit)
            .all()
        )
