import os
from pathlib import Path
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
ROOT_DIR = BACKEND_DIR.parent

ENV_FILE_PATHS = [
    str(BACKEND_DIR / ".env"),
    str(ROOT_DIR / ".env"),
    str(ROOT_DIR / ".env.local"),
    ".env"
]

class Settings(BaseSettings):
    APP_NAME: str = "OpportunityX Resume Backend"
    APP_ENV: str = "development"
    PORT: int = 8000
    SECRET_KEY: str = "opportunityx-resume-super-secret-key-change-in-prod"
    FRONTEND_URL: str = "https://resume.opportunityx.co.in"
    
    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "https://resume.opportunityx.co.in",
        "https://www.resume.opportunityx.co.in",
        "https://opportunityx.co.in",
        "https://www.opportunityx.co.in"
    ]

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [i.strip() for i in v.split(",") if i.strip()]
        elif isinstance(v, list):
            return v
        return []
    
    # Database (Supabase PostgreSQL - Pooler Port 6543 for IPv4 Render Compatibility)
    DATABASE_URL: str = Field(
        default="",
        description="Database Connection String loaded from DATABASE_URL"
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
    CASHFREE_SECRET_KEY: str = ""  # Loaded from env variable CASHFREE_SECRET_KEY
    CASHFREE_ENV: str = "PRODUCTION"  # SANDBOX or PRODUCTION
    CASHFREE_API_VERSION: str = "2023-08-01"

    # AI Infrastructure Config (OpenRouter Multi-Model Priority Waterfall)
    OPENROUTER_API_KEY: str = ""
    FREE_AI_MODEL: str = "google/gemini-2.5-flash-lite"
    LOW_COST_AI_MODEL: str = "google/gemini-2.5-flash"
    PREMIUM_AI_MODEL: str = "anthropic/claude-3.5-haiku"
    FALLBACK_AI_MODEL: str = "openai/gpt-4o-mini"

    @field_validator("OPENROUTER_API_KEY", mode="before")
    @classmethod
    def assemble_openrouter_key(cls, v: str) -> str:
        if not v or "your_" in v:
            return (
                os.getenv("OPENROUTER_API_KEY")
                or os.getenv("VITE_OPENROUTER_API_KEY")
                or os.getenv("VITE_OPENROUTER_KEY")
                or ""
            )
        return v

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
        env_file=ENV_FILE_PATHS,
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()

