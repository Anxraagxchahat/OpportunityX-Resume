from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, Numeric, Text, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from datetime import datetime, timezone
import uuid
from app.core.database import Base

def generate_uuid():
    return str(uuid.uuid4())

def get_utc_now():
    return datetime.now(timezone.utc)

# 1. Users Identity Cache (Firebase UID Primary Key - Auth is shared, DB is isolated)
class User(Base):
    __tablename__ = "users"

    id = Column(String(128), primary_key=True)  # Immutable Firebase UID
    email = Column(String(255), nullable=False, unique=True)
    display_name = Column(String(255), nullable=True)
    photo_url = Column(Text, nullable=True)
    provider = Column(String(64), default="google")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    credit_wallet = relationship("AICreditWallet", back_populates="user", uselist=False, cascade="all, delete-orphan")
    user_assets = relationship("UserAsset", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")

# 2. User Sessions Tracking Table
class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    login_time = Column(DateTime(timezone=True), server_default=func.now())
    logout_time = Column(DateTime(timezone=True), nullable=True)
    last_activity = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    browser = Column(String(128), nullable=True)
    device = Column(String(128), nullable=True)
    operating_system = Column(String(128), nullable=True)
    ip_address = Column(String(64), nullable=True)
    status = Column(String(32), default="ACTIVE")  # 'ACTIVE', 'EXPIRED', 'LOGGED_OUT'

    user = relationship("User", back_populates="sessions")

# 3. User Assets Table (Renamed from resume_assets for modular cross-product reuse)
class UserAsset(Base):
    __tablename__ = "user_assets"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    asset_type = Column(String(64), nullable=False, default="profile_photo")  # 'profile_photo', 'signature', 'logo', 'icon', 'attachment'
    file_url = Column(Text, nullable=False)  # Firebase Storage URL
    storage_path = Column(Text, nullable=True)  # Firebase Storage Path
    metadata_info = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="user_assets")

# 4. Resumes Table
class Resume(Base):
    __tablename__ = "resumes"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False, default="Untitled Resume")
    slug = Column(String(255), unique=True, nullable=True)
    content = Column(JSON, nullable=False)
    template_id = Column(String(64), default="modern")
    font_family = Column(String(64), default="Inter")
    accent_color = Column(String(32), default="#F97316")
    is_archived = Column(Boolean, default=False)
    is_favorite = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="resumes")
    versions = relationship("ResumeVersion", back_populates="resume", cascade="all, delete-orphan")

# 5. Resume Version History
class ResumeVersion(Base):
    __tablename__ = "resume_versions"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    resume_id = Column(String(128), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    version_number = Column(Integer, nullable=False)
    title = Column(String(255), nullable=True)
    content = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    resume = relationship("Resume", back_populates="versions")

# 6. Resume Settings Table
class ResumeSetting(Base):
    __tablename__ = "resume_settings"

    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    default_template = Column(String(64), default="modern")
    zoom_level = Column(Integer, default=85)
    paper_background = Column(String(32), default="white")
    preferences = Column(JSON, default={})
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# 7. AI Credit Wallet
class AICreditWallet(Base):
    __tablename__ = "ai_credit_wallet"

    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    remaining_credits = Column(Integer, nullable=False, default=0)
    total_purchased = Column(Integer, nullable=False, default=0)
    has_claimed_welcome = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="credit_wallet")

# 8. AI Credit Transactions Audit Ledger
class AICreditTransaction(Base):
    __tablename__ = "ai_credit_transactions"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    action_type = Column(String(64), nullable=False)  # 'WELCOME_BONUS', 'PURCHASE', 'AI_GENERATION'
    credits_changed = Column(Integer, nullable=False)
    resulting_balance = Column(Integer, nullable=False)
    metadata_info = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), default=get_utc_now, server_default=func.now())

# 9. Cashfree Payment Orders
class Payment(Base):
    __tablename__ = "payments"

    order_id = Column(String(128), primary_key=True)
    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    pack_id = Column(String(64), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    credits = Column(Integer, nullable=False)
    status = Column(String(32), nullable=False, default="PENDING")  # 'PENDING', 'PAID', 'FAILED'
    cf_order_id = Column(String(128), nullable=True)
    payment_session_id = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# 10. Payment History Ledger
class PaymentHistory(Base):
    __tablename__ = "payment_history"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    order_id = Column(String(128), ForeignKey("payments.order_id"), nullable=False)
    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    provider = Column(String(32), default="cashfree")
    cf_payment_id = Column(String(128), nullable=True)
    status = Column(String(32), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# 11. Feature Flags Infrastructure Table
class FeatureFlag(Base):
    __tablename__ = "feature_flags"

    key = Column(String(64), primary_key=True)
    name = Column(String(128), nullable=False)
    description = Column(Text, nullable=True)
    is_enabled = Column(Boolean, default=True, nullable=False)
    rules = Column(JSON, default={})  # Rollout percentage, user targeting
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

# 12. System Notifications Infrastructure Table
class Notification(Base):
    __tablename__ = "notifications"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    type = Column(String(64), nullable=False)  # 'WELCOME_CREDITS', 'PAYMENT_SUCCESS', 'LOW_CREDITS', 'AI_COMPLETED', 'PUBLIC_PUBLISHED'
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_read = Column(Boolean, default=False)
    metadata_info = Column(JSON, default={})
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="notifications")

# 13. Public Resume Shared Links
class PublicResumeLink(Base):
    __tablename__ = "public_resume_links"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    resume_id = Column(String(128), ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False)
    slug = Column(String(255), nullable=False, unique=True)
    is_active = Column(Boolean, default=True)
    view_count = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# 14. Activity Audit Logs Table (Structured JSON Metadata)
class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    event_type = Column(String(64), nullable=False)  # e.g., 'RESUME_CREATED', 'AI_GENERATION', 'PAYMENT_SUCCESS'
    details = Column(JSON, default={})
    ip_address = Column(String(64), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

# 15. User Referral Profile Table (Permanent 6-Letter A-Z Code)
class UserReferralProfile(Base):
    __tablename__ = "user_referral_profiles"

    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    referral_code = Column(String(6), unique=True, nullable=False, index=True)
    redeemed_referral_code = Column(String(6), nullable=True)
    redeemed_referrer_id = Column(String(128), nullable=True)
    successful_referrals_count = Column(Integer, default=0, nullable=False)
    referral_credits_earned = Column(Integer, default=0, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, server_default=func.now())
    qualified_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", backref="referral_profile")

# 16. Referrals Ledger Table
class Referral(Base):
    __tablename__ = "referrals"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    referrer_user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    referred_user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    referral_code = Column(String(6), nullable=False)
    status = Column(String(32), default="QUALIFIED", nullable=False)  # 'QUALIFIED', 'PENDING'
    reward_amount = Column(Integer, default=5, nullable=False)
    created_at = Column(DateTime(timezone=True), default=get_utc_now, server_default=func.now())
    qualified_at = Column(DateTime(timezone=True), default=get_utc_now, server_default=func.now())

# 17. User Social Tasks Audit & Reward Table
class UserSocialTask(Base):
    __tablename__ = "user_social_tasks"

    id = Column(String(128), primary_key=True, default=generate_uuid)
    user_id = Column(String(128), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    task_id = Column(String(64), nullable=False, index=True)  # 'instagram_follow', 'linkedin_follow', 'x_follow', 'youtube_subscribe'
    platform = Column(String(64), nullable=False)  # 'Instagram', 'LinkedIn', 'X', 'YouTube'
    status = Column(String(32), default="COMPLETED", nullable=False)  # 'COMPLETED', 'PENDING'
    verification_status = Column(String(32), default="VERIFIED", nullable=False)  # 'VERIFIED', 'MANUAL_PENDING'
    reward_amount = Column(Integer, nullable=False)
    reward_granted = Column(Boolean, default=True, nullable=False)
    completed_at = Column(DateTime(timezone=True), default=get_utc_now, server_default=func.now())
    created_at = Column(DateTime(timezone=True), default=get_utc_now, server_default=func.now())

