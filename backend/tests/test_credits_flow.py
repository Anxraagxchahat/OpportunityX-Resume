import unittest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.models.models import Base, AICreditWallet, AICreditTransaction
from app.repositories.credit_repository import CreditRepository

class TestCreditFlow(unittest.TestCase):
    def setUp(self):
        # Use in-memory SQLite for high-speed deterministic testing
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(bind=self.engine)
        Session = sessionmaker(bind=self.engine)
        self.db_session = Session()
        self.repo = CreditRepository(self.db_session)

    def tearDown(self):
        self.db_session.close()

    def test_credit_wallet_creation_and_welcome_bonus(self):
        user_id = "test-user-123"

        # Initial state
        wallet = self.repo.get_or_create_wallet(user_id)
        self.assertEqual(wallet.remaining_credits, 0)
        self.assertFalse(wallet.has_claimed_welcome)

        # Claim welcome bonus
        wallet, claimed = self.repo.claim_welcome_bonus(user_id, bonus_credits=5)
        self.assertTrue(claimed)
        self.assertEqual(wallet.remaining_credits, 5)
        self.assertTrue(wallet.has_claimed_welcome)

        # Duplicate claim attempt must be rejected
        wallet, claimed_again = self.repo.claim_welcome_bonus(user_id, bonus_credits=5)
        self.assertFalse(claimed_again)
        self.assertEqual(wallet.remaining_credits, 5)

        # Check transactions
        txs = self.repo.get_transactions(user_id)
        self.assertEqual(len(txs), 1)
        self.assertEqual(txs[0].action_type, "WELCOME_BONUS")
        self.assertEqual(txs[0].credits_changed, 5)
        self.assertEqual(txs[0].resulting_balance, 5)

    def test_credit_deduction_and_ledger(self):
        user_id = "test-user-456"

        # Setup with 5 credits
        self.repo.claim_welcome_bonus(user_id, bonus_credits=5)

        # 1. Deduct 1 credit for "Improve Summary"
        wallet, success = self.repo.deduct_credits(user_id=user_id, credits=1, feature="Improve Summary with AI")
        self.assertTrue(success)
        self.assertEqual(wallet.remaining_credits, 4)

        # Verify transaction ledger
        txs = self.repo.get_transactions(user_id)
        self.assertEqual(len(txs), 2)  # 1 welcome + 1 deduction
        latest_tx = txs[0]
        self.assertEqual(latest_tx.action_type, "AI_GENERATION")
        self.assertEqual(latest_tx.credits_changed, -1)
        self.assertEqual(latest_tx.resulting_balance, 4)
        self.assertEqual(latest_tx.metadata_info, {"feature": "Improve Summary with AI"})

        # 2. Deduct another credit (4 -> 3)
        wallet, success = self.repo.deduct_credits(user_id=user_id, credits=1, feature="AI ATS Job Match")
        self.assertTrue(success)
        self.assertEqual(wallet.remaining_credits, 3)

        # 3. Deduct remaining 3 credits (3 -> 0)
        wallet, success = self.repo.deduct_credits(user_id=user_id, credits=3, feature="AI Cover Letter")
        self.assertTrue(success)
        self.assertEqual(wallet.remaining_credits, 0)

        # 4. Attempt deduction with 0 balance (Must fail cleanly, never negative)
        wallet, success = self.repo.deduct_credits(user_id=user_id, credits=1, feature="AI Bullet Enhancer")
        self.assertFalse(success)
        self.assertEqual(wallet.remaining_credits, 0)

        # Verify transaction count did not increase on failed attempt
        final_txs = self.repo.get_transactions(user_id)
        self.assertEqual(len(final_txs), 4)  # 1 welcome + 3 successful deductions

if __name__ == "__main__":
    unittest.main()
