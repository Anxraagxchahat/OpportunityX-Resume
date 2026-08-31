import httpx
import hmac
import hashlib
import base64
import time
from typing import Dict, Any, Optional
from app.core.config import settings
from app.core.logging import logger

import os
import re

class CashfreeService:
    def __init__(self):
        self._client: Optional[httpx.AsyncClient] = None

    @property
    def app_id(self) -> str:
        val = settings.CASHFREE_APP_ID or os.getenv("CASHFREE_APP_ID", "")
        return str(val).strip().strip('"').strip("'").replace("\n", "").replace("\r", "")

    @property
    def secret_key(self) -> str:
        val = settings.CASHFREE_SECRET_KEY or os.getenv("CASHFREE_SECRET_KEY", "")
        return str(val).strip().strip('"').strip("'").replace("\n", "").replace("\r", "")

    @property
    def api_version(self) -> str:
        val = settings.CASHFREE_API_VERSION or os.getenv("CASHFREE_API_VERSION", "2025-01-01")
        clean = str(val).strip().strip('"').strip("'").replace("\n", "").replace("\r", "")
        return clean or "2025-01-01"

    def _get_client(self) -> httpx.AsyncClient:
        if self._client is None or self._client.is_closed:
            limits = httpx.Limits(max_keepalive_connections=20, max_connections=50, keepalive_expiry=30.0)
            self._client = httpx.AsyncClient(timeout=10.0, limits=limits)
        return self._client

    @property
    def is_sandbox(self) -> bool:
        env_val = (settings.CASHFREE_ENV or os.getenv("CASHFREE_ENV", "")).upper()
        if self.app_id.startswith("TEST") or self.app_id.startswith("TEST_") or env_val == "SANDBOX":
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
        if not self.app_id or not self.secret_key or "your_" in self.app_id or "your_" in self.secret_key:
            logger.error("Cashfree API credentials missing or unconfigured.")
            raise ValueError("Cashfree Payment Gateway is not configured on the backend server. CASHFREE_APP_ID and CASHFREE_SECRET_KEY environment variables are required.")

        # Sanitize customer_id (Cashfree requires regex ^[a-zA-Z0-9_-]+$, max 50 chars)
        clean_customer_id = re.sub(r'[^a-zA-Z0-9_-]', '_', customer_id or "user_guest")[:50]
        if not clean_customer_id:
            clean_customer_id = "user_guest"

        # Sanitize & Validate customer_phone (Supports valid Indian & International phone numbers 7-15 digits)
        phone_digits = re.sub(r'\D', '', customer_phone or "")
        if not (7 <= len(phone_digits) <= 15) or re.match(r'^(.)\1+$', phone_digits):
            raise ValueError("Please provide a valid mobile number. Repetitive or dummy numbers are not accepted.")

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
                "return_url": f"{settings.FRONTEND_URL.rstrip('/')}/dashboard?order_id={{order_id}}"
            }
        }

        env_name = "sandbox" if self.is_sandbox else "production"
        logger.info(f"Creating Cashfree PG order {order_id} in mode '{env_name}' at {url}")

        client = self._get_client()
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
        client = self._get_client()
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
