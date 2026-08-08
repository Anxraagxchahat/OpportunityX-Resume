import logging
import json
import time
import uuid
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from app.core.config import settings

class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_obj = {
            "timestamp": self.formatTime(record, self.datefmt),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if hasattr(record, "request_id"):
            log_obj["request_id"] = record.request_id
        if hasattr(record, "uid"):
            log_obj["uid"] = record.uid
        if hasattr(record, "latency_ms"):
            log_obj["latency_ms"] = record.latency_ms
        if hasattr(record, "status_code"):
            log_obj["status_code"] = record.status_code
        if hasattr(record, "path"):
            log_obj["path"] = record.path
        if record.exc_info and settings.is_dev:
            log_obj["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_obj)

def get_logger(name: str = "opportunityx") -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(JSONFormatter())
        logger.addHandler(handler)
        logger.setLevel(logging.INFO if not settings.is_dev else logging.DEBUG)
    return logger

logger = get_logger()

class StructuredLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next) -> Response:
        request_id = request.headers.get("X-Request-ID") or str(uuid.uuid4())
        request.state.request_id = request_id
        start_time = time.time()

        response = await call_next(request)

        latency_ms = round((time.time() - start_time) * 1000, 2)
        response.headers["X-Request-ID"] = request_id

        extra = {
            "request_id": request_id,
            "path": request.url.path,
            "status_code": response.status_code,
            "latency_ms": latency_ms,
            "uid": getattr(request.state, "uid", "anonymous")
        }

        logger.info(
            f"{request.method} {request.url.path} -> {response.status_code} ({latency_ms}ms)",
            extra=extra
        )
        return response
