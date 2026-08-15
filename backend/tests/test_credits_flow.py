import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.models.models import Base, AICreditWallet, AICreditTransaction
from app.repositories.credit_repository import CreditRepository

@pytest.fixture
def db_session():
    # Use in-memory SQLite for high-speed deterministic testing
    engine = create_engine("sqlite:///:memory:")
    Base.metadata.create_all(bind=engine)
    Session = sessionmaker(bind=engine)
    session = Session()
    yield session
    session.close()

def test_credit_wallet_creation_and_welcome_bonus(db_session):
    repo = CreditRepository(db_session)
    user_id = "test-user-123"

    # Initial state
    wallet = repo.get_or_create_wallet(user_id)
    assert wallet.remaining_credits == 0
    assert wallet.has_claimed_welcome is False

    # Claim welcome bonus
    wallet, claimed = repo.claim_welcome_bonus(user_id, bonus_credits=5)
    assert claimed is True
    assert wallet.remaining_credits == 5
    assert wallet.has_claimed_welcome is True

    # Duplicate claim attempt must be rejected
    wallet, claimed_again = repo.claim_welcome_bonus(user_id, bonus_credits=5)
    assert claimed_again is False
    assert wallet.remaining_credits == 5

    # Check transactions
    txs = repo.get_transactions(user_id)
    assert len(txs) == 1
    assert txs[0].action_type == "WELCOME_BONUS"
    assert txs[0].credits_changed == 5
    assert txs[0].resulting_balance == 5

def test_credit_deduction_and_ledger(db_session):
    repo = CreditRepository(db_session)
    user_id = "test-user-456"

    # Setup with 5 credits
    repo.claim_welcome_bonus(user_id, bonus_credits=5)

    # 1. Deduct 1 credit for "Improve Summary"
    wallet, success = repo.deduct_credits(user_id=user_id, credits=1, feature="Improve Summary with AI")
    assert success is True
    assert wallet.remaining_credits == 4

    # Verify transaction ledger
    txs = repo.get_transactions(user_id)
    assert len(txs) == 2  # 1 welcome + 1 deduction
    latest_tx = txs[0]
    assert latest_tx.action_type == "AI_GENERATION"
    assert latest_tx.credits_changed == -1
    assert latest_tx.resulting_balance == 4
    assert latest_tx.metadata_info == {"feature": "Improve Summary with AI"}

    # 2. Deduct another credit (4 -> 3)
    wallet, success = repo.deduct_credits(user_id=user_id, credits=1, feature="AI ATS Job Match")
    assert success is True
    assert wallet.remaining_credits == 3

    # 3. Deduct remaining 3 credits (3 -> 0)
    wallet, success = repo.deduct_credits(user_id=user_id, credits=3, feature="AI Cover Letter")
    assert success is True
    assert wallet.remaining_credits == 0

    # 4. Attempt deduction with 0 balance (Must fail cleanly, never negative)
    wallet, success = repo.deduct_credits(user_id=user_id, credits=1, feature="AI Bullet Enhancer")
    assert success is False
    assert wallet.remaining_credits == 0

    # Verify transaction count did not increase on failed attempt
    final_txs = repo.get_transactions(user_id)
    assert len(final_txs) == 4  # 1 welcome + 3 successful deductions
