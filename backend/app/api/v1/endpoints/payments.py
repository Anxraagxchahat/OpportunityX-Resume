import time
import uuid
from fastapi import APIRouter, Depends, HTTPException, Request, Header
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user, AuthenticatedUser
from app.repositories.user_repository import UserRepository
from app.repositories.payment_repository import PaymentRepository
from app.repositories.credit_repository import CreditRepository
from app.repositories.activity_repository import ActivityRepository
from app.services.cashfree_service import cashfree_service
from app.services.notification_service import NotificationService
from app.db.schemas.schemas import (
    CashfreeCreateRequest,
    CashfreeOrderResponse,
    CashfreeVerifyRequest,
    CashfreeVerifyResponse
)

router = APIRouter(prefix="/payments", tags=["Cashfree Payment Gateway & Credit Top-ups"])

CREDIT_PACK_PRICING = {
    "pack-starter": {"price": 1.00, "credits": 15},
    "pack-popular": {"price": 49.00, "credits": 25},
    "pack-best": {"price": 99.00, "credits": 50},
    "pack-pro": {"price": 199.00, "credits": 100}
}

@router.post("/create-order", response_model=CashfreeOrderResponse)
async def create_payment_order(
    req: CashfreeCreateRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if req.pack_id not in CREDIT_PACK_PRICING:
        raise HTTPException(status_code=400, detail=f"Invalid credit pack identifier: {req.pack_id}")

    # Ensure user identity exists in users table before referencing foreign key
    user_repo = UserRepository(db)
    user_repo.sync_user(
        uid=user.uid,
        email=user.email or f"{user.uid}@opportunityx.co.in",
        display_name=user.name,
        photo_url=user.photo_url
    )

    pack = CREDIT_PACK_PRICING[req.pack_id]
    order_id = f"OX_RESUME_{int(time.time())}_{str(uuid.uuid4())[:6]}"

    # Call Cashfree PG Order Creation
    try:
        cf_res = await cashfree_service.create_order(
            order_id=order_id,
            amount=pack["price"],
            customer_id=user.uid,
            customer_email=user.email,
            customer_phone=req.customer_phone or "9999999999"
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

    # Save PENDING Payment in DB via Repository
    payment_repo = PaymentRepository(db)
    payment_repo.create_order(
        order_id=order_id,
        user_id=user.uid,
        pack_id=req.pack_id,
        amount=pack["price"],
        credits=pack["credits"],
        cf_order_id=cf_res.get("cf_order_id"),
        payment_session_id=cf_res.get("payment_session_id")
    )

    return CashfreeOrderResponse(
        order_id=order_id,
        payment_session_id=cf_res.get("payment_session_id", ""),
        cf_order_id=cf_res.get("cf_order_id"),
        amount=pack["price"],
        credits=pack["credits"],
        is_mock=cf_res.get("is_mock", False),
        environment=cf_res.get("environment", "sandbox")
    )

@router.post("/verify-order", response_model=CashfreeVerifyResponse)
async def verify_payment_order(
    req: CashfreeVerifyRequest,
    user: AuthenticatedUser = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    payment_repo = PaymentRepository(db)
    payment = payment_repo.get_by_order_id(req.order_id)
    if not payment:
        raise HTTPException(status_code=404, detail="Order not found.")

    if payment.user_id != user.uid:
        raise HTTPException(status_code=403, detail="Unauthorized access to order.")

    # Idempotent Check: If already PAID, return success balance immediately
    credit_repo = CreditRepository(db)
    wallet = credit_repo.get_or_create_wallet(user.uid)
    if payment.status == "PAID":
        return CashfreeVerifyResponse(
            ok=True,
            order_id=req.order_id,
            status="PAID",
            message="Payment already verified and credits applied.",
            credits_added=payment.credits,
            new_balance=wallet.remaining_credits
        )

    # Verify with Cashfree Server
    cf_res = await cashfree_service.verify_order(req.order_id)
    cf_status = cf_res.get("order_status", "PENDING")

    if cf_status in ("PAID", "SUCCESS"):
        # Update Payment status to PAID
        payment_repo.update_status(order_id=req.order_id, status="PAID", cf_payment_id=cf_res.get("cf_payment_id"))

        # Add Credits to Wallet in Atomic DB Transaction
        updated_wallet = credit_repo.add_purchased_credits(
            user_id=user.uid,
            credits=payment.credits,
            pack_id=payment.pack_id,
            order_id=req.order_id
        )

        # Notify & Log Activity
        NotificationService(db).send_payment_success_notification(
            user_id=user.uid,
            credits=payment.credits,
            amount=float(payment.amount)
        )
        ActivityRepository(db).log_activity(
            user_id=user.uid,
            event_type="PAYMENT_SUCCESS",
            details={"order_id": req.order_id, "amount": float(payment.amount), "credits": payment.credits}
        )

        return CashfreeVerifyResponse(
            ok=True,
            order_id=req.order_id,
            status="PAID",
            message="Payment verified successfully! AI credits added to your wallet.",
            credits_added=payment.credits,
            new_balance=updated_wallet.remaining_credits
        )
    else:
        payment_repo.update_status(order_id=req.order_id, status=cf_status)
        ActivityRepository(db).log_activity(
            user_id=user.uid,
            event_type="PAYMENT_FAILED",
            details={"order_id": req.order_id, "status": cf_status}
        )
        return CashfreeVerifyResponse(
            ok=False,
            order_id=req.order_id,
            status=cf_status,
            message=f"Payment verification returned status: {cf_status}",
            credits_added=0,
            new_balance=wallet.remaining_credits
        )

@router.post("/cashfree-webhook")
async def cashfree_webhook_handler(
    request: Request,
    db: Session = Depends(get_db),
    x_webhook_signature: str = Header(None),
    x_webhook_timestamp: str = Header(None)
):
    raw_body = await request.body()
    body_str = raw_body.decode("utf-8")

    # Validate HMAC Signature
    is_valid = cashfree_service.verify_webhook_signature(body_str, x_webhook_signature, x_webhook_timestamp)
    if not is_valid and not settings.is_dev:
        raise HTTPException(status_code=400, detail="Invalid webhook signature")

    payload = await request.json()
    data = payload.get("data", {})
    order = data.get("order", {})
    order_id = order.get("order_id")
    order_status = order.get("order_status")

    if order_id and order_status == "PAID":
        payment_repo = PaymentRepository(db)
        payment = payment_repo.get_by_order_id(order_id)
        if payment and payment.status != "PAID":
            payment_repo.update_status(order_id=order_id, status="PAID")
            CreditRepository(db).add_purchased_credits(
                user_id=payment.user_id,
                credits=payment.credits,
                pack_id=payment.pack_id,
                order_id=order_id
            )

    return {"status": "OK"}
