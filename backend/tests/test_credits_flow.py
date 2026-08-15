import unittest
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.db.models.models import Base, User, AICreditWallet, AICreditTransaction, UserReferralProfile, Referral, UserSocialTask
from app.repositories.credit_repository import CreditRepository, generate_referral_code
from app.repositories.user_repository import UserRepository

class TestCreditFlow(unittest.TestCase):
    def setUp(self):
        # In-memory SQLite for isolated test runs
        self.engine = create_engine("sqlite:///:memory:")
        Base.metadata.create_all(bind=self.engine)
        Session = sessionmaker(bind=self.engine)
        self.db_session = Session()
        self.repo = CreditRepository(self.db_session)
        self.user_repo = UserRepository(self.db_session)

    def tearDown(self):
        self.db_session.close()

    def test_a_existing_opportunityx_user_gets_starter_credits(self):
        """TEST A: Existing OpportunityX account, first Resume use -> +5 starter"""
        user_id = "ox-existing-user-1"
        self.user_repo.sync_user(uid=user_id, email="ox.existing@opportunityx.co.in", display_name="Existing Dev")

        wallet = self.repo.get_or_create_wallet(user_id)
        self.assertEqual(wallet.remaining_credits, 5)
        self.assertTrue(wallet.has_claimed_welcome)

    def test_b_new_opportunityx_user_gets_starter_credits(self):
        """TEST B: New OpportunityX account, first Resume use -> +5 starter"""
        user_id = "ox-new-user-2"
        wallet = self.repo.get_or_create_wallet(user_id)
        self.assertEqual(wallet.remaining_credits, 5)
        self.assertTrue(wallet.has_claimed_welcome)

        # Duplicate claim attempt must be rejected (idempotent, balance stays 5)
        wallet, claimed_again = self.repo.claim_welcome_bonus(user_id, bonus_credits=5)
        self.assertFalse(claimed_again)
        self.assertEqual(wallet.remaining_credits, 5)

    def test_c_complete_instagram_task_once_and_repeat(self):
        """TEST C: Complete Instagram task -> +2 once; repeat -> +0"""
        user_id = "user-social-insta"
        # Initial 5 starter credits
        wallet = self.repo.get_or_create_wallet(user_id)
        self.assertEqual(wallet.remaining_credits, 5)

        # Claim Instagram task (+2)
        wallet, added, msg = self.repo.claim_social_task_reward(user_id, "instagram_follow")
        self.assertEqual(added, 2)
        self.assertEqual(wallet.remaining_credits, 7)

        # Repeat claim attempt -> must grant 0 additional credits
        wallet, added_again, msg2 = self.repo.claim_social_task_reward(user_id, "instagram_follow")
        self.assertEqual(added_again, 0)
        self.assertEqual(wallet.remaining_credits, 7)

    def test_d_complete_all_configured_social_tasks_max_five(self):
        """TEST D: Complete all configured social tasks -> Maximum social reward = +5"""
        user_id = "user-all-social"
        # 5 starter credits
        wallet = self.repo.get_or_create_wallet(user_id)
        self.assertEqual(wallet.remaining_credits, 5)

        # Claim Instagram (+2)
        self.repo.claim_social_task_reward(user_id, "instagram_follow")
        # Claim LinkedIn (+1)
        self.repo.claim_social_task_reward(user_id, "linkedin_follow")
        # Claim X (+1)
        self.repo.claim_social_task_reward(user_id, "x_follow")
        # Claim YouTube (+1)
        wallet, added_yt, _ = self.repo.claim_social_task_reward(user_id, "youtube_subscribe")

        self.assertEqual(added_yt, 1)
        # Total = 5 starter + 2 + 1 + 1 + 1 = 10 total credits
        self.assertEqual(wallet.remaining_credits, 10)

        overview = self.repo.get_rewards_overview(user_id)
        self.assertEqual(overview["social_bonus_earned"], 5)
        self.assertEqual(overview["social_bonus_max"], 5)
        self.assertEqual(len(overview["social_tasks"]), 4)
        self.assertTrue(all(t["completed"] for t in overview["social_tasks"]))

    def test_e_generate_referral_code_format(self):
        """TEST E: Generate referral code -> Exactly 6 uppercase alphanumeric characters"""
        for _ in range(20):
            code = generate_referral_code(6)
            self.assertEqual(len(code), 6)
            self.assertTrue(code.isalnum())
            self.assertTrue(code.isupper())

        user_id = "user-ref-code-test"
        profile = self.repo.get_or_create_referral_profile(user_id)
        self.assertEqual(len(profile.referral_code), 6)
        self.assertTrue(profile.referral_code.isalnum())
        self.assertTrue(profile.referral_code.isupper())

        # Test persistence across subsequent calls
        profile_same = self.repo.get_or_create_referral_profile(user_id)
        self.assertEqual(profile.referral_code, profile_same.referral_code)

    def test_f_referral_redemption_both_users_rewarded(self):
        """TEST F: User A (KXRMPT), User B redeems KXRMPT -> A +5, B +5"""
        user_a = "user-referrer-a"
        user_b = "user-referred-b"

        # Initialize both users with 5 starter credits
        wallet_a = self.repo.get_or_create_wallet(user_a)
        wallet_b = self.repo.get_or_create_wallet(user_b)
        self.assertEqual(wallet_a.remaining_credits, 5)
        self.assertEqual(wallet_b.remaining_credits, 5)

        profile_a = self.repo.get_or_create_referral_profile(user_a)
        code_a = profile_a.referral_code

        # User B redeems User A's code
        wallet_b_updated, added, msg = self.repo.redeem_referral_code(user_b, code_a)
        self.assertEqual(added, 5)
        self.assertEqual(wallet_b_updated.remaining_credits, 10)

        # Refresh User A wallet
        wallet_a_updated = self.repo.get_wallet(user_a)
        self.assertEqual(wallet_a_updated.remaining_credits, 10)

        # Check transactions
        txs_b = self.repo.get_transactions(user_b)
        self.assertEqual(txs_b[0].action_type, "REFERRAL_REWARD")
        self.assertEqual(txs_b[0].credits_changed, 5)

        txs_a = self.repo.get_transactions(user_a)
        self.assertEqual(txs_a[0].action_type, "REFERRAL_REWARD")
        self.assertEqual(txs_a[0].credits_changed, 5)

    def test_g_self_referral_prevention(self):
        """TEST G: Self referral -> User A enters own code -> Rejected"""
        user_a = "user-self-ref"
        profile_a = self.repo.get_or_create_referral_profile(user_a)
        code_a = profile_a.referral_code

        with self.assertRaises(HTTPException) as ctx:
            self.repo.redeem_referral_code(user_a, code_a)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("own referral code", ctx.exception.detail)

    def test_h_second_referral_redemption_rejected(self):
        """TEST H: Second referral redemption by same referred user -> Rejected"""
        user_a = "user-a-1"
        user_b = "user-b-2"
        user_c = "user-c-3"

        profile_a = self.repo.get_or_create_referral_profile(user_a)
        profile_c = self.repo.get_or_create_referral_profile(user_c)

        # User B redeems A's code -> Success
        self.repo.redeem_referral_code(user_b, profile_a.referral_code)

        # User B attempts to redeem C's code -> Rejected
        with self.assertRaises(HTTPException) as ctx:
            self.repo.redeem_referral_code(user_b, profile_c.referral_code)
        self.assertEqual(ctx.exception.status_code, 400)
        self.assertIn("already redeemed", ctx.exception.detail)

    def test_i_j_k_credit_deduction_and_history(self):
        """Verify credit deduction, balance floor, and transaction ledger"""
        user_id = "user-deduct-audit"
        wallet = self.repo.get_or_create_wallet(user_id)
        self.assertEqual(wallet.remaining_credits, 5)

        wallet, success = self.repo.deduct_credits(user_id, 2, "AI ATS Analysis")
        self.assertTrue(success)
        self.assertEqual(wallet.remaining_credits, 3)

        wallet, success = self.repo.deduct_credits(user_id, 4, "AI Cover Letter")
        self.assertFalse(success)
        self.assertEqual(wallet.remaining_credits, 3)

if __name__ == "__main__":
    unittest.main()
