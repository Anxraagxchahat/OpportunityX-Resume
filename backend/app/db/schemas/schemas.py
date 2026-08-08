from pydantic import BaseModel, Field, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    email: str
    display_name: Optional[str] = None
    photo_url: Optional[str] = None
    provider: Optional[str] = "google"

class UserCreate(UserBase):
    id: str

class UserResponse(UserBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# User Session Schemas
class UserSessionResponse(BaseModel):
    id: str
    user_id: str
    login_time: datetime
    logout_time: Optional[datetime] = None
    last_activity: datetime
    browser: Optional[str] = None
    device: Optional[str] = None
    operating_system: Optional[str] = None
    ip_address: Optional[str] = None
    status: str

    class Config:
        from_attributes = True

# User Asset Schemas
class UserAssetCreate(BaseModel):
    asset_type: str = "profile_photo"
    file_url: str
    storage_path: Optional[str] = None
    metadata_info: Optional[Dict[str, Any]] = {}

class UserAssetResponse(BaseModel):
    id: str
    user_id: str
    asset_type: str
    file_url: str
    storage_path: Optional[str] = None
    metadata_info: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

# Credit Wallet Schemas
class CreditWalletResponse(BaseModel):
    user_id: str
    remaining_credits: int
    total_purchased: int
    has_claimed_welcome: bool
    updated_at: datetime

    class Config:
        from_attributes = True

class CreditTransactionResponse(BaseModel):
    id: str
    user_id: str
    action_type: str
    credits_changed: int
    resulting_balance: int
    metadata_info: Optional[Dict[str, Any]] = {}
    created_at: datetime

    class Config:
        from_attributes = True

# Cashfree & Payment Schemas
class CashfreeCreateRequest(BaseModel):
    pack_id: str = Field(..., description="Credit pack: pack-starter, pack-popular, pack-best, pack-pro")
    customer_phone: Optional[str] = Field(default="9999999999", description="Customer phone number")

class CashfreeOrderResponse(BaseModel):
    order_id: str
    payment_session_id: str
    cf_order_id: Optional[str] = None
    amount: float
    credits: int
    is_mock: bool = False
    environment: str = "sandbox"

class CashfreeVerifyRequest(BaseModel):
    order_id: str

class CashfreeVerifyResponse(BaseModel):
    ok: bool
    order_id: str
    status: str
    message: str
    credits_added: int = 0
    new_balance: int = 0

# Feature Flag Schemas
class FeatureFlagResponse(BaseModel):
    key: str
    name: str
    description: Optional[str] = None
    is_enabled: bool
    rules: Dict[str, Any]

    class Config:
        from_attributes = True

# Notification Schemas
class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    message: str
    is_read: bool
    metadata_info: Dict[str, Any]
    created_at: datetime

    class Config:
        from_attributes = True

# Resume Schemas
class ResumeCreateRequest(BaseModel):
    title: str = "Untitled Resume"
    content: Dict[str, Any]
    template_id: Optional[str] = "modern"
    font_family: Optional[str] = "Inter"
    accent_color: Optional[str] = "#F97316"

class ResumeUpdateRequest(BaseModel):
    title: Optional[str] = None
    content: Optional[Dict[str, Any]] = None
    template_id: Optional[str] = None
    font_family: Optional[str] = None
    accent_color: Optional[str] = None
    is_archived: Optional[bool] = None
    is_favorite: Optional[bool] = None

class ResumeResponse(BaseModel):
    id: str
    user_id: str
    title: str
    slug: Optional[str] = None
    content: Dict[str, Any]
    template_id: str
    font_family: str
    accent_color: str
    is_archived: bool
    is_favorite: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# AI Service Schemas
class AIRequest(BaseModel):
    feature: str  # 'summary', 'review', 'rewrite', 'cover_letter', 'ats_analysis'
    prompt: Optional[str] = None
    content: Dict[str, Any]
    target_job_description: Optional[str] = None

class AIResponse(BaseModel):
    success: bool
    result: Any
    credits_deducted: int = 1
    remaining_credits: int
    model_used: str

# Health & Metrics Schemas
class HealthStatusResponse(BaseModel):
    status: str
    database: str = "connected"
    service: str
    version: str
    environment: str

class MetricsResponse(BaseModel):
    uptime_seconds: float
    total_users_cached: int
    total_active_sessions: int
    total_resumes_saved: int
    database_status: str
