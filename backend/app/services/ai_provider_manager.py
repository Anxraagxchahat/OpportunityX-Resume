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
        # Waterfall Priority Array (Fast / Free -> High Quality -> Alternative)
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
        max_tokens: int = 1500,
        preferred_model: Optional[str] = None
    ) -> Dict[str, Any]:
        self.stats["total_requests"] += 1
        model_queue = self.models_waterfall.copy()
        if preferred_model and preferred_model in model_queue:
            model_queue.remove(preferred_model)
            model_queue.insert(0, preferred_model)

        last_error = None
        for model in model_queue:
            for attempt in range(2):  # Retry up to 2 times per model
                try:
                    logger.info(f"Executing AI generation via model '{model}' (Attempt {attempt + 1})")
                    result = await self._call_openrouter(model, messages, temperature, max_tokens)
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
                    await asyncio.sleep(0.5 * (attempt + 1))

        self.stats["failed_requests"] += 1
        logger.error(f"All AI models failed in waterfall execution. Last error: {str(last_error)}")
        raise RuntimeError(f"AI Generation Failed: {str(last_error)}")

    async def _call_openrouter(
        self,
        model: str,
        messages: List[Dict[str, str]],
        temperature: float,
        max_tokens: int
    ) -> str:
        # Dynamically reload key from settings if initialized earlier
        active_key = self.api_key or settings.OPENROUTER_API_KEY
        if not active_key or "your_" in active_key:
            raise ValueError("OpenRouter API key is not configured on the backend server. Please configure OPENROUTER_API_KEY in backend/.env.")

        headers = {
            "Authorization": f"Bearer {active_key.strip()}",
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

        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(self.base_url, json=payload, headers=headers)
            if response.status_code != 200:
                raise ValueError(f"OpenRouter HTTP {response.status_code}: {response.text}")
            data = response.json()
            choices = data.get("choices", [])
            if not choices:
                raise ValueError("No completion choices returned from OpenRouter.")
            content = choices[0].get("message", {}).get("content", "")
            if not content:
                raise ValueError("Empty response received from AI model.")
            return content

ai_provider_manager = AIProviderManager()
