from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, AuthenticatedUser
from app.repositories.credit_repository import CreditRepository
from app.db.schemas.schemas import CreditWalletResponse, CreditTransactionResponse
from typing import List

router = APIRouter(prefix="/credits", tags=["AI Credit Wallet System"])

@router.get("/balance", response_model=CreditWalletResponse)
async def get_credit_balance(
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
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
    repo = CreditRepository(db)
    wallet, _ = repo.claim_welcome_bonus(user.uid, bonus_credits=5)
    return wallet
