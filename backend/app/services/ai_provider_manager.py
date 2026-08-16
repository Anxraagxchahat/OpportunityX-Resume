import os
import httpx
import asyncio
import time
from typing import Dict, Any, List, Optional
from app.core.config import settings
from app.core.logging import logger

class AIProviderManager:
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = "https://openrouter.ai/api/v1/chat/completions"
        # Waterfall Priority Array (Fast & High Quality -> Cost-Effective -> Fallback)
        self.models_waterfall = [
            settings.LOW_COST_AI_MODEL or "google/gemini-2.5-flash",
            settings.FREE_AI_MODEL or "google/gemini-2.5-flash",
            settings.PREMIUM_AI_MODEL or "openai/gpt-4o-mini",
            settings.FALLBACK_AI_MODEL or "anthropic/claude-3.5-haiku",
            "openrouter/auto"
        ]
        self.stats = {
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "retries_count": 0
        }

    async def generate_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = 0.7,
        max_tokens: int = 2500,
        preferred_model: Optional[str] = None,
        byok_key: Optional[str] = None
    ) -> Dict[str, Any]:
        self.stats["total_requests"] += 1
        model_queue = self.models_waterfall.copy()
        if preferred_model and preferred_model.strip():
            target_model = preferred_model.strip()
            if target_model in model_queue:
                model_queue.remove(target_model)
            model_queue.insert(0, target_model)

        last_error = None
        for model in model_queue:
            for attempt in range(2):  # Retry up to 2 times per model
                try:
                    logger.info(f"Executing AI generation via model '{model}' (Attempt {attempt + 1})")
                    result = await self._call_openrouter(
                        model=model,
                        messages=messages,
                        temperature=temperature,
                        max_tokens=max_tokens,
                        byok_key=byok_key
                    )
                    self.stats["successful_requests"] += 1
                    return {
                        "content": result,
                        "model_used": model,
                        "attempts": attempt + 1
                    }
                except Exception as e:
                    last_error = e
                    self.stats["retries_count"] += 1
                    logger.warning(f"AI Model '{model}' attempt {attempt + 1} failed: {str(e)}")
                    # If it's an invalid user BYOK key, do not retry other models pointlessly
                    if "401" in str(e) or "Unauthorized" in str(e):
                        raise ValueError("OpenRouter API key authentication failed. Please verify the API key.")
                    await asyncio.sleep(0.5 * (attempt + 1))

        self.stats["failed_requests"] += 1
        logger.error(f"All AI models failed in waterfall execution. Last error: {str(last_error)}")
        raise RuntimeError(f"AI Generation Failed: {str(last_error)}")

    async def _call_openrouter(
        self,
        model: str,
        messages: List[Dict[str, str]],
        temperature: float,
        max_tokens: int,
        byok_key: Optional[str] = None
    ) -> str:
        # If user supplied BYOK key, use it; otherwise use backend server secret
        active_key = (
            byok_key
            or self.api_key
            or settings.OPENROUTER_API_KEY
            or os.getenv("OPENROUTER_API_KEY")
            or os.getenv("VITE_OPENROUTER_API_KEY")
            or os.getenv("VITE_OPENROUTER_KEY")
            or ""
        ).strip()
        if not active_key or "your_" in active_key:
            raise ValueError("OpenRouter API key is not configured on the backend server. Please configure OPENROUTER_API_KEY in backend/.env.")

        headers = {
            "Authorization": f"Bearer {active_key}",
            "HTTP-Referer": "https://resume.opportunityx.co.in",
            "X-Title": "OpportunityX Resume AI Engine",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        async with httpx.AsyncClient(timeout=45.0) as client:
            response = await client.post(self.base_url, json=payload, headers=headers)
            if response.status_code != 200:
                err_text = response.text
                if response.status_code == 401:
                    raise ValueError("Authentication error (401): OpenRouter API key is invalid.")
                elif response.status_code == 402:
                    raise ValueError("Insufficient balance (402): OpenRouter account has run out of credits.")
                elif response.status_code == 429:
                    raise ValueError("Rate limit reached (429): OpenRouter received too many requests.")
                else:
                    raise ValueError(f"OpenRouter HTTP {response.status_code}: {err_text[:200]}")

            data = response.json()
            choices = data.get("choices", [])
            if not choices:
                raise ValueError("No completion choices returned from OpenRouter.")
            
            message_obj = choices[0].get("message", {})
            content = message_obj.get("content") or message_obj.get("reasoning") or choices[0].get("text") or ""
            if not content or not str(content).strip():
                raise ValueError("Empty response received from AI model.")
            return str(content).strip()

ai_provider_manager = AIProviderManager()
