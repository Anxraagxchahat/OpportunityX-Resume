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
        # Waterfall Priority Array (Free -> Low Cost -> Premium -> Fallback)
        self.models_waterfall = [
            settings.FREE_AI_MODEL,
            settings.LOW_COST_AI_MODEL,
            settings.PREMIUM_AI_MODEL,
            settings.FALLBACK_AI_MODEL
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
        if not self.api_key or "your_" in self.api_key:
            # Smart Mock Fallback when API key is not configured locally
            logger.info(f"[AI Mock] Mocking completion for model '{model}'")
            return self._generate_mock_response(messages)

        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "HTTP-Referer": "https://resume.opportunityx.co.in",
            "X-Title": "OpportunityX Resume AI",
            "Content-Type": "application/json"
        }
        payload = {
            "model": model,
            "messages": messages,
            "temperature": temperature,
            "max_tokens": max_tokens
        }

        async with httpx.AsyncClient(timeout=20.0) as client:
            response = await client.post(self.base_url, json=payload, headers=headers)
            if response.status_code != 200:
                raise ValueError(f"HTTP {response.status_code}: {response.text}")
            data = response.json()
            choices = data.get("choices", [])
            if not choices:
                raise ValueError("No choices returned from AI model.")
            return choices[0].get("message", {}).get("content", "")

    def _generate_mock_response(self, messages: List[Dict[str, str]]) -> str:
        last_msg = messages[-1].get("content", "") if messages else ""
        if "summary" in last_msg.lower():
            return "Results-driven Software Engineer with expertise in full-stack cloud applications, scalable APIs, and performance optimization."
        elif "review" in last_msg.lower() or "ats" in last_msg.lower():
            return "Your resume scores 88% on ATS compatibility. Consider adding metrics (e.g. 'boosted API speed by 40%') for impact."
        return "Professional resume section optimized for high ATS match and recruiter readability."

ai_provider_manager = AIProviderManager()
