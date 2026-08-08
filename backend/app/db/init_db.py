from sqlalchemy.orm import Session
from app.core.database import engine, Base
from app.db.models.models import FeatureFlag, User, AICreditWallet
from app.core.logging import logger

DEFAULT_FEATURE_FLAGS = [
    {"key": "ai_enabled", "name": "AI Assistant Infrastructure", "description": "Enable OpenRouter multi-model AI features", "is_enabled": True},
    {"key": "credits_enabled", "name": "AI Credit System", "description": "Enable credit wallet balances and credit deductions", "is_enabled": True},
    {"key": "payments_enabled", "name": "Cashfree Payment Gateway", "description": "Enable Cashfree PG for credit pack checkout", "is_enabled": True},
    {"key": "resume_sharing", "name": "Public Resume Link Sharing", "description": "Enable public URL creation for resumes", "is_enabled": True},
    {"key": "maintenance_mode", "name": "Maintenance Mode", "description": "Global maintenance mode toggle", "is_enabled": False},
]

def init_db(db: Session):
    logger.info("Initializing PostgreSQL Database Schema...")
    Base.metadata.create_all(bind=engine)

    # Seed Default Feature Flags
    for flag_data in DEFAULT_FEATURE_FLAGS:
        existing = db.query(FeatureFlag).filter(FeatureFlag.key == flag_data["key"]).first()
        if not existing:
            flag = FeatureFlag(
                key=flag_data["key"],
                name=flag_data["name"],
                description=flag_data["description"],
                is_enabled=flag_data["is_enabled"],
                rules={}
            )
            db.add(flag)
    db.commit()
    logger.info("Database schema & feature flags initialized successfully.")
