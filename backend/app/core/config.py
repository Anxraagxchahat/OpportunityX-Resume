import os
from typing import List, Union
from pydantic import Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict

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
        "https://opportunityx.co.in"
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
    
    # Database (Supabase PostgreSQL)
    DATABASE_URL: str = Field(
        default="postgresql://postgres:Anurag%401239574680@db.sbjvxgszsxrrrjxdkegb.supabase.co:5432/postgres",
        description="Supabase PostgreSQL Connection String"
    )
    SUPABASE_URL: str = "https://sbjvxgszsxrrrjxdkegb.supabase.co"
    SUPABASE_SERVICE_ROLE_KEY: str = "sb_publishable_U24KE_PDFxqmE06TaBeo5A_ZHgajn1q"

    # Firebase Auth & Storage (Central OpportunityX Project)
    FIREBASE_PROJECT_ID: str = "opportunityx-61efd"
    FIREBASE_CLIENT_EMAIL: str = "firebase-adminsdk-fbsvc@opportunityx-61efd.iam.gserviceaccount.com"
    FIREBASE_PRIVATE_KEY: str = "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDFIfChrCb7AY8y\n1B68HNaU/UWC8FHVbDyubtiCdqQqE5wbO4ZJAo9HGc3j/hbQCl1d2yn6+gPvGsaP\ntvrqlQNzJ/LAS8N+OvkR+5lWJUXLIRgfT9+cpkFKdfN32vVlQfFEGA2pMLTDB+bv\nnQI5UGdeCZRj46h9Fiu1U3Z/sQpMmHDJGc7IrpOckB63AZlKbI8WI3Emsi9rBQtM\nP/l3sOIeVLtezkTwIn9r5gXa8vsd9apzJKHe0ZyX9+N7lQSr5iLYUXyE5676qE98\n9d0jV242FRxeNhKCNpsHTrWzTDsnJuHyl8KKyoDDEIGRIZUkz+tC5kGeuQuT4dA8\nyvi8uRb1AgMBAAECggEAF3PJ+aXuLkL5ewnOzUDeC3QVMrZt+ebKUlM4GU9NiP7z\nva6nc2SlUIdinfri0mXFRU73T9cyJB5KnJrff4xyUF8ii1uIGqqf6pKE48GD695Y\nTRNWzj9eOaJOMIZhVuZRMnFtIKF9g81bHUsP0ms9HOwlVfvl1dnPId+X06mniMSN\ngLpCV0cTk2Oo2nK3SIb+DOcEvJeQQMJYgRgJl7MFlMEwCcQZh/Jy5EJ4bCtaw672\n8mtmJjTJLWZ9mOHSylshe8E6lfThZSZuGku4iB+aO1cvcGiXMlSuTSQz3dNGN3+o\nM/7BjPe0qWFlxfgRux2apzfoShve1oShcNwxgZN3SQKBgQDmLO8yiIBvvH5lf2I8\nCZA9YMW6BFNnAJuPL9lMsGNrCvORo6o9CnopD5C9y76S6g1KtK9+CxAhcRnFhkjS\nV7SwLHeUadbz/7MhwprvYxVfgBPpQSWbzCpJ9Fg52HmPXfxTwoodSPcWuXHiXLLl\neyS/y5tLfRtwpQbH1vok2w6/DQKBgQDbP/ODJ+07VAYPNNy3L7qBb7j0/5r7Mxdm\nHTAOrJJiE85HIJoiRyBkhZPRAZgT0VDGNPYT26vD22akRUjK50r9cMiiBfQ+TtBU\nklPw0WKG6zcYlJaHzcypzEMxQ0Wnrkd3rt5WkiNYRX2mvIbte8WXrUlimTmxR8WJ\nNOFSsdn9iQKBgQCafDomvnsFg4uJ788s4HZQ26yZxuF7VmsR1VmRISn45CbJ7wEJ\nawjGmk3ZNPA5hqFZLKBEhoRTDafwbMpfcsIxJAc2Mzs0FMBTvltipCvqJvo2KaVm\nRcd0T20Plf0wfjImvYEZWqmMNPb8qJ7hap8lozAdoGBUYE6GvgCxz9y72QKBgQCL\nXF3zmxhe4qyrU8WLpwncpmAhUqt3SmVwIdNfMHAnaUFv0phGe4Fqg8GOU34P8rdu\nFVHpE3NdngLjHasEVfpDmEHfQvuZ80zWxOAYLW98JNyzghcgoT6bG1wGXyVSTSPe\nPkfTLTbML/eLWUBGiaryG1KPGqgiOGWmLfefMa9HSQKBgFoHGBX+TMYAgocBuaHS\nlcgypJ9FEZ3SMSCgX8l4w1SlO26u3cD+4KJInGXa+vyyOGomTxJmVP+px2yIiy1N\nqHKxPDTXAOGl6qNjzb43BVP4oQhObiQw3TZl0MLfvz9xp6QJgGGGYxiK7V7CRqOm\nNt99qI/BP9j/MEj4jGUgqjEk\n-----END PRIVATE KEY-----\n"
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
