import asyncio
from typing import Optional
from playwright.async_api import async_playwright, Browser, Playwright
from app.core.logging import logger

class CanonicalPDFExportService:
    """
    Canonical Chromium-Based PDF Export Engine for OpportunityX Resume Platform.
    Ensures a single source of truth for PDF generation across dev, test, and production.
    Generates genuine vector A4 PDFs preserving real selectable text, CSS fonts, 
    custom colors, flexbox wrapping, and exact multi-page pagination.
    """

    def __init__(self):
        self._playwright: Optional[Playwright] = None
        self._browser: Optional[Browser] = None
        self._lock = asyncio.Lock()

    async def _get_browser(self) -> Browser:
        async with self._lock:
            if self._browser is None or not self._browser.is_connected():
                if self._playwright is None:
                    self._playwright = await async_playwright().start()
                self._browser = await self._playwright.chromium.launch(
                    headless=True,
                    args=[
                        "--no-sandbox",
                        "--disable-setuid-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                        "--font-render-hinting=none"
                    ]
                )
                logger.info("Canonical Chromium PDF Browser instance launched.")
            return self._browser

    async def render_pdf(self, html_content: str, filename: Optional[str] = "Resume.pdf") -> bytes:
        """
        Renders standalone HTML into a high-fidelity vector PDF using Chromium's native print engine.
        Guarantees real selectable text, zero rasterization, and pixel-accurate A4 geometry.
        """
        try:
            browser = await self._get_browser()
            page = await browser.new_page(
                viewport={"width": 794, "height": 1123, "device_scale_factor": 2}
            )
            try:
                try:
                    await page.set_content(html_content, wait_until="networkidle", timeout=12000)
                except Exception as ne:
                    logger.warning(f"Networkidle wait timed out, falling back to load: {ne}")
                    await page.set_content(html_content, wait_until="load", timeout=8000)
                
                try:
                    await page.evaluate("() => document.fonts ? document.fonts.ready : Promise.resolve()")
                except Exception as fe:
                    logger.warning(f"Font ready check non-fatal notice: {fe}")

                await asyncio.sleep(0.06)

                pdf_bytes = await page.pdf(
                    format="A4",
                    print_background=True,
                    prefer_css_page_size=True,
                    margin={"top": "0px", "right": "0px", "bottom": "0px", "left": "0px"}
                )
                return pdf_bytes
            finally:
                await page.close()
        except Exception as e:
            logger.error(f"Render PDF failed: {type(e).__name__}: {e}", exc_info=True)
            raise

    async def close(self):
        async with self._lock:
            if self._browser:
                try:
                    await self._browser.close()
                except Exception:
                    pass
                self._browser = None
            if self._playwright:
                try:
                    await self._playwright.stop()
                except Exception:
                    pass
                self._playwright = None
            logger.info("Canonical Chromium PDF Service shutdown complete.")

pdf_export_service = CanonicalPDFExportService()
