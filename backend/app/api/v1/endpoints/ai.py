from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from typing import Optional
from app.core.database import get_db
from app.core.security import get_current_user, get_optional_user, AuthenticatedUser
from app.repositories.credit_repository import CreditRepository
from app.repositories.activity_repository import ActivityRepository
from app.repositories.user_repository import UserRepository
from app.services.ai_provider_manager import ai_provider_manager
from app.services.ai_prompt_engine import AIPromptEngine
from app.services.feature_flag_service import FeatureFlagService
from app.services.notification_service import NotificationService
from app.db.schemas.schemas import AIRequest, AIResponse
from app.core.logging import logger

router = APIRouter(prefix="/ai", tags=["AI Generation Infrastructure"])

FEATURE_CREDIT_COSTS = {
    "summary": 1,
    "summary_generator": 1,
    "bullet_rewrite": 1,
    "experience_rewrite": 1,
    "experience_enhance": 1,
    "project_describe": 1,
    "project_generator": 1,
    "grammar_fix": 1,
    "skills_suggest": 1,
    "ats_optimize": 2,
    "ats_analysis": 2,
    "job_match": 2,
    "cover_letter": 2,
    "interview_prep": 2,
    "review": 1,
    "general": 1
}

@router.post("/generate", response_model=AIResponse)
async def generate_ai_content(
    req: AIRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Sync User in DB Cache
    UserRepository(db).sync_user(
        uid=user.uid,
        email=user.email or f"{user.uid}@opportunityx.co.in",
        display_name=user.name,
        photo_url=user.photo_url
    )

    # 2. Feature Flag Check
    flag_service = FeatureFlagService(db)
    if not flag_service.is_enabled("ai_enabled"):
        raise HTTPException(status_code=503, detail="AI Services are temporarily paused for maintenance.")

    credit_repo = CreditRepository(db)
    is_byok = bool(req.byok_key and len(req.byok_key.strip()) > 10)
    
    # 3. Determine Required Credits
    if is_byok:
        required_credits = 0
    else:
        norm_feat = (req.feature or "summary").lower().strip()
        required_credits = FEATURE_CREDIT_COSTS.get(norm_feat, 1)

    # 4. Pre-Generation Balance Check (Never execute if balance is insufficient)
    wallet = credit_repo.get_or_create_wallet(user.uid, auto_grant_starter=True)
    if required_credits > 0 and wallet.remaining_credits < required_credits:
        raise HTTPException(
            status_code=402,
            detail=f"Insufficient AI Credits. Required: {required_credits}, Available: {wallet.remaining_credits}. Please purchase a credit pack or use your own API key in AI Settings."
        )

    # 5. Compile ATS & Role-Aware Prompt Messages
    messages = AIPromptEngine.build_prompt_messages(
        feature=req.feature,
        content=req.content,
        target_role=req.target_role,
        target_job_description=req.target_job_description,
        custom_prompt=req.prompt
    )

    # 6. Execute AI Generation with Resilient Waterfall
    try:
        ai_res = await ai_provider_manager.generate_completion(
            messages=messages,
            preferred_model=req.model,
            byok_key=req.byok_key.strip() if is_byok else None
        )
        content_result = ai_res["content"]
        model_used = ai_res["model_used"]
    except Exception as e:
        logger.error(f"AI Generation failed for user {user.uid}: {str(e)}")
        # Notice: Zero credits have been deducted on failure
        raise HTTPException(status_code=500, detail=f"AI generation failed: {str(e)}. No credits were deducted.")

    # 7. Authoritative Two-Phase Credit Deduction (COMMITTED ONLY ON SUCCESS)
    if required_credits > 0:
        wallet, success = credit_repo.deduct_credits(
            user_id=user.uid,
            credits=required_credits,
            feature=req.feature,
            request_id=req.request_id,
            model=model_used
        )
        if not success:
            logger.warning(f"Credit deduction race condition for user {user.uid}")

    # 8. Fetch Updated Authoritative Ledger Summary
    summary = credit_repo.get_user_credit_summary(user.uid)

    # 9. Audit Logging & Notification
    ActivityRepository(db).log_activity(
        user_id=user.uid,
        event_type="AI_GENERATION",
        details={
            "feature": req.feature,
            "model": model_used,
            "credits_deducted": required_credits,
            "is_byok": is_byok,
            "request_id": req.request_id
        }
    )

    return AIResponse(
        success=True,
        result=content_result,
        credits_deducted=required_credits,
        remaining_credits=summary["remaining_credits"],
        total_used=summary["total_used"],
        total_purchased=summary["total_purchased"],
        model_used=model_used,
        request_id=req.request_id,
        message="AI content generated successfully."
    )
