import os
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    APP_NAME: str = "OpportunityX Resume Backend"
    APP_ENV: str = "development"
    PORT: int = 8000
    SECRET_KEY: str = "opportunityx-resume-super-secret-key-change-in-prod"
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://resume.opportunityx.co.in",
        "https://opportunityx.co.in"
    ]
    
    # Database (Supabase PostgreSQL)
    DATABASE_URL: str = Field(
        default="postgresql://postgres:postgres@localhost:5432/opportunityx_resume",
        description="Supabase PostgreSQL Connection String"
    )
    SUPABASE_URL: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""

    # Firebase Auth & Storage (Central OpportunityX Project)
    FIREBASE_PROJECT_ID: str = "opportunityx-61efd"
    FIREBASE_CLIENT_EMAIL: str = ""
    FIREBASE_PRIVATE_KEY: str = ""
    FIREBASE_STORAGE_BUCKET: str = "opportunityx-61efd.appspot.com"

    # Cashfree Integration Credentials
    CASHFREE_APP_ID: str = ""
    CASHFREE_SECRET_KEY: str = ""
    CASHFREE_ENV: str = "SANDBOX"  # SANDBOX or PRODUCTION
    CASHFREE_API_VERSION: str = "2023-08-01"

    # AI Infrastructure Config (OpenRouter Multi-Model Priority Waterfall)
    OPENROUTER_API_KEY: str = ""
    FREE_AI_MODEL: str = "google/gemini-2.5-flash-lite"
    LOW_COST_AI_MODEL: str = "google/gemini-2.5-flash"
    PREMIUM_AI_MODEL: str = "anthropic/claude-3.5-haiku"
    FALLBACK_AI_MODEL: str = "openai/gpt-4o-mini"

    # Default Feature Flags
    AI_ENABLED: bool = True
    CREDITS_ENABLED: bool = True
    PAYMENTS_ENABLED: bool = True
    RESUME_SHARING_ENABLED: bool = True
    MAINTENANCE_MODE: bool = False

    @property
    def is_dev(self) -> bool:
        return self.APP_ENV.lower() in ("dev", "development", "local")

    @property
    def cashfree_base_url(self) -> str:
        if self.CASHFREE_ENV.upper() == "PRODUCTION":
            return "https://api.cashfree.com/pg"
        return "https://sandbox.cashfree.com/pg"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
