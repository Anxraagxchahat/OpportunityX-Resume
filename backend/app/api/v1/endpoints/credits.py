from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.core.security import get_current_user, AuthenticatedUser
from app.repositories.credit_repository import CreditRepository
from app.repositories.user_repository import UserRepository
from app.db.schemas.schemas import (
    CreditWalletResponse,
    CreditTransactionResponse,
    CreditConsumeRequest,
    CreditConsumeResponse,
    RewardsOverviewResponse,
    SocialClaimRequest,
    SocialClaimResponse,
    ReferralRedeemRequest,
    ReferralRedeemResponse
)

router = APIRouter(prefix="/credits", tags=["AI Credit Wallet & Reward System"])

@router.get("/balance", response_model=CreditWalletResponse)
async def get_credit_balance(
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    UserRepository(db).sync_user(
        uid=user.uid,
        email=user.email or f"{user.uid}@opportunityx.co.in",
        display_name=user.name,
        photo_url=user.photo_url
    )
    repo = CreditRepository(db)
    summary = repo.get_user_credit_summary(user.uid)
    return summary

@router.get("/rewards-overview", response_model=RewardsOverviewResponse)
async def get_rewards_overview(
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    UserRepository(db).sync_user(
        uid=user.uid,
        email=user.email or f"{user.uid}@opportunityx.co.in",
        display_name=user.name,
        photo_url=user.photo_url
    )
    repo = CreditRepository(db)
    return repo.get_rewards_overview(user.uid)

@router.get("/referral-code")
async def get_user_referral_code(
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    UserRepository(db).sync_user(
        uid=user.uid,
        email=user.email or f"{user.uid}@opportunityx.co.in",
        display_name=user.name,
        photo_url=user.photo_url
    )
    repo = CreditRepository(db)
    profile = repo.get_or_create_referral_profile(user.uid)
    return {
        "referralCode": profile.referral_code,
        "referral_code": profile.referral_code,
        "successful_referrals": profile.successful_referrals_count,
        "referral_credits_earned": profile.referral_credits_earned,
        "has_redeemed": bool(profile.redeemed_referral_code),
        "redeemed_code": profile.redeemed_referral_code
    }

@router.get("/transactions", response_model=List[CreditTransactionResponse])
async def get_credit_transactions(
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    repo = CreditRepository(db)
    return repo.get_transactions(user.uid)

@router.post("/claim-welcome", response_model=CreditWalletResponse)
async def claim_welcome_credits(
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    UserRepository(db).sync_user(
        uid=user.uid,
        email=user.email or f"{user.uid}@opportunityx.co.in",
        display_name=user.name,
        photo_url=user.photo_url
    )
    repo = CreditRepository(db)
    wallet, _ = repo.claim_welcome_bonus(user.uid, bonus_credits=5)
    return wallet

@router.post("/claim-social", response_model=SocialClaimResponse)
async def claim_social_task(
    req: SocialClaimRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    UserRepository(db).sync_user(
        uid=user.uid,
        email=user.email or f"{user.uid}@opportunityx.co.in",
        display_name=user.name,
        photo_url=user.photo_url
    )
    repo = CreditRepository(db)
    wallet, credits_added, message = repo.claim_social_task_reward(user.uid, req.task_id)
    return SocialClaimResponse(
        ok=credits_added > 0,
        task_id=req.task_id,
        credits_added=credits_added,
        remaining_credits=wallet.remaining_credits,
        message=message
    )

@router.post("/redeem-referral", response_model=ReferralRedeemResponse)
async def redeem_referral_code(
    req: ReferralRedeemRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    UserRepository(db).sync_user(
        uid=user.uid,
        email=user.email or f"{user.uid}@opportunityx.co.in",
        display_name=user.name,
        photo_url=user.photo_url
    )
    repo = CreditRepository(db)
    wallet, credits_added, message = repo.redeem_referral_code(user.uid, req.referral_code)
    return ReferralRedeemResponse(
        ok=True,
        referral_code=req.referral_code.strip().upper(),
        credits_added=credits_added,
        remaining_credits=wallet.remaining_credits,
        message=message
    )

@router.post("/consume", response_model=CreditConsumeResponse)
async def consume_credit(
    req: CreditConsumeRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    UserRepository(db).sync_user(
        uid=user.uid,
        email=user.email or f"{user.uid}@opportunityx.co.in",
        display_name=user.name,
        photo_url=user.photo_url
    )
    repo = CreditRepository(db)
    wallet, success = repo.deduct_credits(user.uid, req.credits, req.action_name)
    if not success:
        raise HTTPException(
            status_code=402,
            detail=f"Insufficient AI credits balance ({wallet.remaining_credits} available, {req.credits} required). Please purchase a credit pack to continue."
        )
    return CreditConsumeResponse(
        ok=True,
        remaining_credits=wallet.remaining_credits,
        credits_deducted=req.credits,
        action_name=req.action_name,
        message="Credits deducted successfully."
    )
