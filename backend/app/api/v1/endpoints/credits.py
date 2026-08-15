from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, AuthenticatedUser
from app.repositories.credit_repository import CreditRepository
from app.repositories.user_repository import UserRepository
from app.db.schemas.schemas import (
    CreditWalletResponse,
    CreditTransactionResponse,
    CreditConsumeRequest,
    CreditConsumeResponse
)
from typing import List

router = APIRouter(prefix="/credits", tags=["AI Credit Wallet System"])

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
    wallet = repo.get_or_create_wallet(user.uid)
    return wallet

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
