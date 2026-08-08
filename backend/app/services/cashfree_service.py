import httpx
import hmac
import hashlib
import base64
import time
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger

import re

class CashfreeService:
    def __init__(self):
        self.app_id = settings.CASHFREE_APP_ID or ""
        self.secret_key = settings.CASHFREE_SECRET_KEY or ""
        self.api_version = settings.CASHFREE_API_VERSION or "2023-08-01"

    @property
    def is_sandbox(self) -> bool:
        if self.app_id.startswith("TEST") or self.app_id.startswith("TEST_") or settings.CASHFREE_ENV.upper() == "SANDBOX":
            return True
        return False

    @property
    def base_url(self) -> str:
        if self.is_sandbox:
            return "https://sandbox.cashfree.com/pg"
        return "https://api.cashfree.com/pg"

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
        if not self.app_id or not self.secret_key or "your_" in self.app_id:
            logger.error("Cashfree API credentials missing or unconfigured.")
            raise ValueError("Cashfree Payment Gateway is not configured on the backend server. CASHFREE_APP_ID and CASHFREE_SECRET_KEY environment variables are required.")

        # Sanitize customer_id (Cashfree requires regex ^[a-zA-Z0-9_-]+$, max 50 chars)
        clean_customer_id = re.sub(r'[^a-zA-Z0-9_-]', '_', customer_id or "user_guest")[:50]
        if not clean_customer_id:
            clean_customer_id = "user_guest"

        # Sanitize & Validate customer_phone (Cashfree requires valid 10-digit Indian mobile number)
        phone_digits = re.sub(r'\D', '', customer_phone or "")
        if len(phone_digits) != 10 or not re.match(r'^[6-9]\d{9}$', phone_digits) or re.match(r'^(.)\1{9}$', phone_digits):
            raise ValueError("Please provide a valid 10-digit mobile number (e.g. 9876543210). Repetitive or dummy numbers are not accepted.")

        url = f"{self.base_url}/orders"
        payload = {
            "order_id": order_id,
            "order_amount": float(amount),
            "order_currency": "INR",
            "customer_details": {
                "customer_id": clean_customer_id,
                "customer_email": customer_email or "user@opportunityx.co.in",
                "customer_phone": phone_digits
            },
            "order_meta": {
                "return_url": f"https://resume.opportunityx.co.in/dashboard?order_id={{order_id}}"
            }
        }

        env_name = "sandbox" if self.is_sandbox else "production"
        logger.info(f"Creating Cashfree PG order {order_id} in mode '{env_name}' at {url}")

        async with httpx.AsyncClient(timeout=10.0) as client:
            response = await client.post(url, json=payload, headers=self._get_headers())
            if response.status_code not in (200, 201):
                logger.error(f"Cashfree Create Order Error ({response.status_code}): {response.text}")
                raise ValueError(f"Cashfree Order Creation Failed ({response.status_code}): {response.text}")

            data = response.json()
            session_id = data.get("payment_session_id")
            if not session_id:
                logger.error(f"Cashfree response missing payment_session_id: {data}")
                raise ValueError(f"Cashfree API response missing payment_session_id: {response.text}")

            return {
                "order_id": data.get("order_id", order_id),
                "payment_session_id": session_id,
                "cf_order_id": str(data.get("cf_order_id", "")),
                "amount": amount,
                "is_mock": False,
                "environment": env_name
            }

    async def verify_order(self, order_id: str) -> Dict[str, Any]:
        if not self.app_id or not self.secret_key or "your_" in self.app_id:
            logger.error(f"Cannot verify Cashfree order {order_id}: credentials missing.")
            return {
                "order_id": order_id,
                "order_status": "FAILED",
                "cf_payment_id": "",
                "is_mock": False
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
