from typing import Optional, List, Dict, Any
import string
import secrets
from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.db.models.models import (
    AICreditWallet,
    AICreditTransaction,
    UserReferralProfile,
    Referral,
    UserSocialTask,
    get_utc_now
)
from app.repositories.base_repository import BaseRepository

# Canonical official social task definitions (matching Footer / OpportunityX-Main)
REWARDABLE_SOCIAL_TASKS = [
    {
        "task_id": "instagram_follow",
        "platform": "Instagram",
        "action": "Follow OpportunityX",
        "official_url": "https://www.instagram.com/theopportunityx/",
        "reward_amount": 2,
        "verification_method": "CLIENT_CONFIRMED"
    },
    {
        "task_id": "linkedin_follow",
        "platform": "LinkedIn",
        "action": "Follow OpportunityX",
        "official_url": "https://www.linkedin.com/company/128134073",
        "reward_amount": 1,
        "verification_method": "CLIENT_CONFIRMED"
    },
    {
        "task_id": "x_follow",
        "platform": "X",
        "action": "Follow OpportunityX",
        "official_url": "https://x.com/TheOpportunityX",
        "reward_amount": 1,
        "verification_method": "CLIENT_CONFIRMED"
    },
    {
        "task_id": "youtube_subscribe",
        "platform": "YouTube",
        "action": "Subscribe to OpportunityX",
        "official_url": "https://www.youtube.com/@theopportunityX",
        "reward_amount": 1,
        "verification_method": "CLIENT_CONFIRMED"
    }
]

def generate_referral_code(length: int = 6) -> str:
    """
    Generate exactly 6 uppercase alphanumeric characters (A-Z, 0-9).
    """
    chars = string.ascii_uppercase + string.digits
    return ''.join(secrets.choice(chars) for _ in range(length))

class CreditRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_wallet(self, user_id: str) -> Optional[AICreditWallet]:
        return self.db.query(AICreditWallet).filter(AICreditWallet.user_id == user_id).first()

    def get_or_create_wallet(self, user_id: str, auto_grant_starter: bool = True) -> AICreditWallet:
        """
        Retrieves or creates the user's AICreditWallet.
        If auto_grant_starter is True (default), checks whether the user has received their
        Resume starter credits (5 credits). If not yet claimed (new or existing OpportunityX user),
        automatically grants 5 starter credits and records the transaction.
        """
        wallet = self.get_wallet(user_id)
        if not wallet:
            initial_credits = 5 if auto_grant_starter else 0
            has_claimed = True if auto_grant_starter else False
            wallet = AICreditWallet(
                user_id=user_id,
                remaining_credits=initial_credits,
                total_purchased=0,
                has_claimed_welcome=has_claimed
            )
            self.db.add(wallet)
            self.db.commit()
            self.db.refresh(wallet)

            if auto_grant_starter:
                tx = AICreditTransaction(
                    user_id=user_id,
                    action_type="WELCOME_BONUS",
                    credits_changed=initial_credits,
                    resulting_balance=initial_credits,
                    metadata_info={"source": "resume", "description": "Guaranteed 5 Resume Starter Credits"}
                )
                self.db.add(tx)
                self.db.commit()
                self.db.refresh(wallet)
        elif auto_grant_starter and not wallet.has_claimed_welcome:
            wallet.remaining_credits += 5
            wallet.has_claimed_welcome = True
            tx = AICreditTransaction(
                user_id=user_id,
                action_type="WELCOME_BONUS",
                credits_changed=5,
                resulting_balance=wallet.remaining_credits,
                metadata_info={"source": "resume", "description": "Guaranteed 5 Resume Starter Credits"}
            )
            self.db.add(tx)
            self.db.commit()
            self.db.refresh(wallet)

        return wallet

    def claim_welcome_bonus(self, user_id: str, bonus_credits: int = 5) -> tuple[AICreditWallet, bool]:
        """
        Authoritatively grants Resume starter bonus credits to a user if not already granted.
        Returns (wallet, True) if newly granted, or (wallet, False) if already granted previously.
        """
        wallet = self.get_wallet(user_id)
        if not wallet:
            wallet = AICreditWallet(
                user_id=user_id,
                remaining_credits=bonus_credits,
                total_purchased=0,
                has_claimed_welcome=True
            )
            self.db.add(wallet)
            self.db.commit()
            self.db.refresh(wallet)

            tx = AICreditTransaction(
                user_id=user_id,
                action_type="WELCOME_BONUS",
                credits_changed=bonus_credits,
                resulting_balance=bonus_credits,
                metadata_info={"source": "resume", "description": f"Claimed {bonus_credits} Welcome AI Credits on first login"}
            )
            self.db.add(tx)
            self.db.commit()
            self.db.refresh(wallet)
            return wallet, True

        if wallet.has_claimed_welcome:
            return wallet, False

        wallet.remaining_credits += bonus_credits
        wallet.has_claimed_welcome = True

        tx = AICreditTransaction(
            user_id=user_id,
            action_type="WELCOME_BONUS",
            credits_changed=bonus_credits,
            resulting_balance=wallet.remaining_credits,
            metadata_info={"source": "resume", "description": f"Claimed {bonus_credits} Welcome AI Credits on first login"}
        )
        self.db.add(tx)
        self.db.commit()
        self.db.refresh(wallet)
        return wallet, True

    def add_purchased_credits(self, user_id: str, credits: int, pack_id: str, order_id: str) -> AICreditWallet:
        wallet = self.get_or_create_wallet(user_id, auto_grant_starter=False)
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

    def deduct_credits(
        self,
        user_id: str,
        credits: int,
        feature: str,
        request_id: Optional[str] = None,
        model: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> tuple[AICreditWallet, bool]:
        # Idempotency guard: If this request_id was already billed, do not double deduct
        if request_id:
            existing_tx = (
                self.db.query(AICreditTransaction)
                .filter(AICreditTransaction.user_id == user_id)
                .all()
            )
            for tx in existing_tx:
                if tx.metadata_info and tx.metadata_info.get("request_id") == request_id:
                    wallet = self.get_or_create_wallet(user_id, auto_grant_starter=False)
                    return wallet, True

        wallet = self.get_or_create_wallet(user_id, auto_grant_starter=True)
        if wallet.remaining_credits < credits:
            return wallet, False

        wallet.remaining_credits -= credits
        tx_meta = {
            "feature": feature,
            "request_id": request_id,
            "model": model or "openrouter/auto",
            **(metadata or {})
        }

        tx = AICreditTransaction(
            user_id=user_id,
            action_type="AI_GENERATION",
            credits_changed=-credits,
            resulting_balance=wallet.remaining_credits,
            metadata_info=tx_meta
        )
        self.db.add(tx)
        self.db.commit()
        self.db.refresh(wallet)
        return wallet, True

    def get_user_credit_summary(self, user_id: str) -> Dict[str, Any]:
        wallet = self.get_or_create_wallet(user_id, auto_grant_starter=True)
        transactions = self.get_transactions(user_id, limit=50)
        total_used = sum(abs(t.credits_changed) for t in transactions if t.credits_changed < 0)
        return {
            "user_id": user_id,
            "remaining_credits": wallet.remaining_credits,
            "total_purchased": wallet.total_purchased,
            "total_used": total_used,
            "has_claimed_welcome": bool(wallet.has_claimed_welcome),
            "updated_at": wallet.updated_at
        }

    def get_transactions(self, user_id: str, limit: int = 50) -> List[AICreditTransaction]:
        return (
            self.db.query(AICreditTransaction)
            .filter(AICreditTransaction.user_id == user_id)
            .order_by(AICreditTransaction.created_at.desc(), AICreditTransaction.id.desc())
            .limit(limit)
            .all()
        )

    # ─────────────────────────────────────────────────────────────
    # REFERRAL SYSTEM (6-LETTER A-Z CODE & ATOMIC REWARDS)
    # ─────────────────────────────────────────────────────────────
    def get_or_create_referral_profile(self, user_id: str) -> UserReferralProfile:
        profile = self.db.query(UserReferralProfile).filter(UserReferralProfile.user_id == user_id).first()
        if profile:
            return profile

        # Generate unique 6-character uppercase code (A-Z only)
        max_attempts = 100
        for _ in range(max_attempts):
            candidate_code = generate_referral_code(6)
            existing = self.db.query(UserReferralProfile).filter(UserReferralProfile.referral_code == candidate_code).first()
            if not existing:
                profile = UserReferralProfile(
                    user_id=user_id,
                    referral_code=candidate_code,
                    successful_referrals_count=0,
                    referral_credits_earned=0
                )
                self.db.add(profile)
                self.db.commit()
                self.db.refresh(profile)
                return profile

        raise HTTPException(status_code=500, detail="Failed to generate unique referral code.")

    def redeem_referral_code(self, user_id: str, code: str) -> tuple[AICreditWallet, int, str]:
        clean_code = (code or "").strip().upper()
        if len(clean_code) != 6 or not clean_code.isalnum():
            raise HTTPException(status_code=400, detail="Referral code must be exactly 6 uppercase alphanumeric characters (A-Z, 0-9).")

        user_profile = self.get_or_create_referral_profile(user_id)
        if user_profile.redeemed_referral_code:
            raise HTTPException(
                status_code=400,
                detail=f"You have already redeemed referral code '{user_profile.redeemed_referral_code}'. Only 1 redemption allowed per account."
            )

        referrer_profile = self.db.query(UserReferralProfile).filter(UserReferralProfile.referral_code == clean_code).first()
        if not referrer_profile:
            raise HTTPException(status_code=404, detail="Invalid referral code. Please check the code and try again.")

        if referrer_profile.user_id == user_id:
            raise HTTPException(status_code=400, detail="You cannot redeem your own referral code.")

        existing_referral = self.db.query(Referral).filter(Referral.referred_user_id == user_id).first()
        if existing_referral:
            raise HTTPException(status_code=400, detail="Referral reward already granted for this account.")

        reward_amount = 5
        referral_record = Referral(
            referrer_user_id=referrer_profile.user_id,
            referred_user_id=user_id,
            referral_code=clean_code,
            status="QUALIFIED",
            reward_amount=reward_amount
        )
        self.db.add(referral_record)

        # Mark code redeemed on user profile
        user_profile.redeemed_referral_code = clean_code
        user_profile.redeemed_referrer_id = referrer_profile.user_id
        user_profile.qualified_at = get_utc_now()

        # Update referrer stats
        referrer_profile.successful_referrals_count += 1
        referrer_profile.referral_credits_earned += reward_amount

        # Grant +5 credits to Referred User
        user_wallet = self.get_or_create_wallet(user_id, auto_grant_starter=True)
        user_wallet.remaining_credits += reward_amount
        user_tx = AICreditTransaction(
            user_id=user_id,
            action_type="REFERRAL_REWARD",
            credits_changed=reward_amount,
            resulting_balance=user_wallet.remaining_credits,
            metadata_info={
                "source": "referral_redeemer",
                "referral_code": clean_code,
                "referrer_user_id": referrer_profile.user_id
            }
        )
        self.db.add(user_tx)

        # Grant +5 credits to Referrer
        referrer_wallet = self.get_or_create_wallet(referrer_profile.user_id, auto_grant_starter=True)
        referrer_wallet.remaining_credits += reward_amount
        referrer_tx = AICreditTransaction(
            user_id=referrer_profile.user_id,
            action_type="REFERRAL_REWARD",
            credits_changed=reward_amount,
            resulting_balance=referrer_wallet.remaining_credits,
            metadata_info={
                "source": "referral_referrer",
                "referral_code": clean_code,
                "referred_user_id": user_id
            }
        )
        self.db.add(referrer_tx)

        self.db.commit()
        self.db.refresh(user_wallet)
        return user_wallet, reward_amount, f"Successfully redeemed referral code '{clean_code}'! You earned +{reward_amount} credits."

    # ─────────────────────────────────────────────────────────────
    # SOCIAL TASKS SYSTEM (UP TO 5 BONUS CREDITS)
    # ─────────────────────────────────────────────────────────────
    def claim_social_task_reward(self, user_id: str, task_id: str) -> tuple[AICreditWallet, int, str]:
        task_config = next((t for t in REWARDABLE_SOCIAL_TASKS if t["task_id"] == task_id), None)
        if not task_config:
            raise HTTPException(status_code=400, detail="Invalid or unsupported social task.")

        wallet = self.get_or_create_wallet(user_id, auto_grant_starter=True)

        # Check if already completed
        existing = self.db.query(UserSocialTask).filter(
            UserSocialTask.user_id == user_id,
            UserSocialTask.task_id == task_id
        ).first()
        if existing:
            return wallet, 0, f"Social reward for {task_config['platform']} has already been claimed."

        # Check total social credits earned
        completed_tasks = self.db.query(UserSocialTask).filter(UserSocialTask.user_id == user_id).all()
        total_earned = sum(t.reward_amount for t in completed_tasks)
        if total_earned >= 5:
            return wallet, 0, "Maximum bonus social credits (5) already earned."

        reward_amount = task_config["reward_amount"]
        if total_earned + reward_amount > 5:
            reward_amount = 5 - total_earned

        social_record = UserSocialTask(
            user_id=user_id,
            task_id=task_id,
            platform=task_config["platform"],
            status="COMPLETED",
            verification_status="VERIFIED",
            reward_amount=reward_amount,
            reward_granted=True
        )
        self.db.add(social_record)

        wallet.remaining_credits += reward_amount
        tx = AICreditTransaction(
            user_id=user_id,
            action_type="SOCIAL_REWARD",
            credits_changed=reward_amount,
            resulting_balance=wallet.remaining_credits,
            metadata_info={
                "source": task_id,
                "platform": task_config["platform"],
                "official_url": task_config["official_url"]
            }
        )
        self.db.add(tx)
        self.db.commit()
        self.db.refresh(wallet)
        return wallet, reward_amount, f"Successfully claimed +{reward_amount} credits for {task_config['platform']}!"

    def get_rewards_overview(self, user_id: str) -> Dict[str, Any]:
        wallet = self.get_or_create_wallet(user_id, auto_grant_starter=True)
        referral_profile = self.get_or_create_referral_profile(user_id)
        completed_tasks = self.db.query(UserSocialTask).filter(UserSocialTask.user_id == user_id).all()
        completed_map = {t.task_id: t for t in completed_tasks}

        social_tasks_list = []
        for t in REWARDABLE_SOCIAL_TASKS:
            record = completed_map.get(t["task_id"])
            social_tasks_list.append({
                "task_id": t["task_id"],
                "platform": t["platform"],
                "action": t["action"],
                "official_url": t["official_url"],
                "reward_amount": t["reward_amount"],
                "completed": bool(record and record.reward_granted),
                "completed_at": record.completed_at if record else None
            })

        social_bonus_earned = sum(t["reward_amount"] for t in social_tasks_list if t["completed"])

        return {
            "starter_credits": {
                "amount": 5,
                "claimed": bool(wallet.has_claimed_welcome),
                "type": "GUARANTEED"
            },
            "social_tasks": social_tasks_list,
            "social_bonus_earned": social_bonus_earned,
            "social_bonus_max": 5,
            "referral_profile": {
                "referral_code": referral_profile.referral_code,
                "has_redeemed": bool(referral_profile.redeemed_referral_code),
                "redeemed_code": referral_profile.redeemed_referral_code,
                "successful_referrals": referral_profile.successful_referrals_count,
                "referral_credits_earned": referral_profile.referral_credits_earned
            },
            "remaining_credits": wallet.remaining_credits
        }
