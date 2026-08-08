from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, AuthenticatedUser
from app.repositories.credit_repository import CreditRepository
from app.repositories.activity_repository import ActivityRepository
from app.services.ai_provider_manager import ai_provider_manager
from app.services.feature_flag_service import FeatureFlagService
from app.services.notification_service import NotificationService
from app.db.schemas.schemas import AIRequest, AIResponse

router = APIRouter(prefix="/ai", tags=["AI Generation Infrastructure"])

FEATURE_CREDIT_COSTS = {
    "summary": 1,
    "review": 1,
    "rewrite": 1,
    "cover_letter": 2,
    "ats_analysis": 2,
    "general": 1
}

@router.post("/generate", response_model=AIResponse)
async def generate_ai_content(
    req: AIRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 1. Feature Flag Check
    flag_service = FeatureFlagService(db)
    if not flag_service.is_enabled("ai_enabled"):
        raise HTTPException(status_code=503, detail="AI Services are currently disabled for maintenance.")

    # 2. Determine Required Credits
    required_credits = FEATURE_CREDIT_COSTS.get(req.feature, 1)

    # 3. Credit Check & Deduction (Atomic DB Transaction)
    credit_repo = CreditRepository(db)
    wallet, success = credit_repo.deduct_credits(user_id=user.uid, credits=required_credits, feature=req.feature)
    if not success:
        raise HTTPException(
            status_code=402,
            detail=f"Insufficient AI Credits. Required: {required_credits}, Available: {wallet.remaining_credits}. Please purchase a credit pack."
        )

    # 4. Build Prompt & Call AI Provider Manager
    prompt_text = req.prompt or f"Enhance this resume section for feature '{req.feature}': {req.content}"
    messages = [
        {"role": "system", "content": "You are OpportunityX AI, an expert ATS Resume & Career Advisor."},
        {"role": "user", "content": prompt_text}
    ]

    try:
        ai_res = await ai_provider_manager.generate_completion(messages=messages)
        content_result = ai_res["content"]
        model_used = ai_res["model_used"]

        # Log Activity & Notification
        ActivityRepository(db).log_activity(
            user_id=user.uid,
            event_type="AI_GENERATION",
            details={"feature": req.feature, "model": model_used, "credits_deducted": required_credits}
        )
        NotificationService(db).send_ai_completed_notification(user_id=user.uid, feature=req.feature)

        return AIResponse(
            success=True,
            result=content_result,
            credits_deducted=required_credits,
            remaining_credits=wallet.remaining_credits,
            model_used=model_used
        )
    except Exception as e:
        # Refund credits if generation failed unexpectedly
        credit_repo.add_purchased_credits(user_id=user.uid, credits=required_credits, pack_id="REFUND", order_id="AI_FAILURE_REFUND")
        raise HTTPException(status_code=500, detail=f"AI Generation failed: {str(e)}. Credits refunded.")
