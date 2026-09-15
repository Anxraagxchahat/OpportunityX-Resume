# ==============================================================================
# OpportunityX Resume - Production Backend Dockerfile
# Framework: FastAPI | ASGI Server: Uvicorn | Python: 3.11-slim
# Target: AWS Lightsail Container Services / Production Deployment
# ==============================================================================

FROM python:3.11-slim

# 1. Set environment variables
# - PYTHONDONTWRITEBYTECODE: Prevents Python from writing .pyc files
# - PYTHONUNBUFFERED: Ensures logs are flushed directly to stdout/stderr
# - PORT: Default listening port for the FastAPI service
# - PLAYWRIGHT_BROWSERS_PATH: Shared location for Chromium binaries accessible by non-root user
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PORT=8000 \
    PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

# 2. Install minimal system utilities for health checks & SSL certs
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 3. Create a non-root system user and group for security
RUN groupadd -g 10001 appuser && \
    useradd -u 10001 -g appuser -s /bin/sh -d /app appuser

# 4. Set working directory
WORKDIR /app

# 5. Leverage Docker layer caching: copy requirements first
COPY requirements.txt .

# 6. Install Python dependencies and Playwright Chromium headless engine for PDF export
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    playwright install --with-deps chromium && \
    mkdir -p /ms-playwright && \
    chown -R appuser:appuser /ms-playwright && \
    chmod -R 755 /ms-playwright && \
    rm -rf /var/lib/apt/lists/*

# 7. Copy application source code into the container
COPY . .

# 8. Set correct file ownership for the non-root user
RUN chown -R appuser:appuser /app

# 9. Switch to unprivileged user
USER appuser

# 10. Expose FastAPI port
EXPOSE 8000

# 11. Healthcheck utilizing FastAPI's /health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# 12. Startup command: execute uvicorn via exec for proper POSIX signal propagation
CMD ["sh", "-c", "exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}"]
