import httpx
import hmac
import hashlib
import base64
import time
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger

class CashfreeService:
    def __init__(self):
        self.app_id = settings.CASHFREE_APP_ID
        self.secret_key = settings.CASHFREE_SECRET_KEY
        self.base_url = settings.cashfree_base_url
        self.api_version = settings.CASHFREE_API_VERSION

    def _get_headers(self) -> Dict[str, str]:
        return {
            "x-client-id": self.app_id,
            "x-client-secret": self.secret_key,
            "x-api-version": self.api_version,
            "Content-Type": "application/json",
            "Accept": "application/json"
        }

    async def create_order(
        self,
        order_id: str,
        amount: float,
        customer_id: str,
        customer_email: str,
        customer_phone: str = "9999999999"
    ) -> Dict[str, Any]:
        # Fallback to Sandbox Mock Mode if credentials are missing in local dev environment
        if not self.app_id or not self.secret_key or "your_" in self.app_id:
            logger.info(f"[Cashfree Mock] Creating mock order session for order {order_id}")
            return {
                "order_id": order_id,
                "payment_session_id": f"session_mock_{order_id}_{int(time.time())}",
                "cf_order_id": f"cf_mock_{order_id}",
                "amount": amount,
                "is_mock": True,
                "environment": settings.CASHFREE_ENV.lower()
            }

        url = f"{self.base_url}/orders"
        payload = {
            "order_id": order_id,
            "order_amount": float(amount),
            "order_currency": "INR",
            "customer_details": {
                "customer_id": customer_id,
                "customer_email": customer_email or "user@opportunityx.co.in",
                "customer_phone": customer_phone or "9999999999"
            },
            "order_meta": {
                "return_url": f"https://resume.opportunityx.co.in/dashboard?order_id={{order_id}}"
            }
        }

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload, headers=self._get_headers())
            if response.status_code not in (200, 201):
                logger.error(f"Cashfree Create Order Error: {response.text}")
                raise ValueError(f"Cashfree Order Creation Failed: {response.text}")
            data = response.json()
            return {
                "order_id": data.get("order_id", order_id),
                "payment_session_id": data.get("payment_session_id"),
                "cf_order_id": str(data.get("cf_order_id", "")),
                "amount": amount,
                "is_mock": False,
                "environment": settings.CASHFREE_ENV.lower()
            }

    async def verify_order(self, order_id: str) -> Dict[str, Any]:
        # Fallback Mock Mode Verification
        if not self.app_id or not self.secret_key or "your_" in self.app_id:
            logger.info(f"[Cashfree Mock] Auto-verifying order {order_id} as PAID")
            return {
                "order_id": order_id,
                "order_status": "PAID",
                "cf_payment_id": f"cf_pay_mock_{int(time.time())}",
                "is_mock": True
            }

        url = f"{self.base_url}/orders/{order_id}"
        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.get(url, headers=self._get_headers())
            if response.status_code != 200:
                logger.error(f"Cashfree Verify Order Error: {response.text}")
                return {"order_id": order_id, "order_status": "FAILED", "is_mock": False}
            data = response.json()
            status = data.get("order_status", "PENDING")
            return {
                "order_id": order_id,
                "order_status": status,
                "cf_payment_id": str(data.get("cf_order_id", "")),
                "is_mock": False
            }

    def verify_webhook_signature(self, raw_body: str, signature: str, timestamp: str) -> bool:
        if not signature or not self.secret_key:
            return False
        try:
            data = f"{timestamp}{raw_body}"
            computed = base64.b64encode(
                hmac.new(
                    self.secret_key.encode("utf-8"),
                    data.encode("utf-8"),
                    hashlib.sha256
                ).digest()
            ).decode("utf-8")
            return hmac.compare_digest(computed, signature)
        except Exception as e:
            logger.error(f"Webhook signature validation error: {str(e)}")
            return False

cashfree_service = CashfreeService()
