import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { chromium } from 'playwright'

function canonicalPdfDevPlugin() {
  let browser = null;
  return {
    name: 'canonical-pdf-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url ? req.url.split('?')[0] : '';
        const isExportRoute = req.method === 'POST' && (
          url === '/api/v1/resumes/export-pdf' ||
          url === '/api/resumes/export-pdf' ||
          url === '/api/export-pdf'
        );

        if (!isExportRoute) {
          return next();
        }

        try {
          const chunks = [];
          for await (const chunk of req) {
            chunks.push(chunk);
          }
          const rawBody = Buffer.concat(chunks).toString('utf-8');
          const { html, filename = 'Resume.pdf' } = JSON.parse(rawBody || '{}');

          if (!html || !html.trim()) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ detail: 'HTML content cannot be empty.' }));
            return;
          }

          if (!browser || !browser.isConnected()) {
            browser = await chromium.launch({
              headless: true,
              args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--font-render-hinting=none'
              ]
            });
          }

          const page = await browser.newPage({
            viewport: { width: 794, height: 1123, deviceScaleFactor: 2 }
          });

          try {
            await page.setContent(html, { waitUntil: 'networkidle', timeout: 12000 }).catch(async () => {
              await page.setContent(html, { waitUntil: 'load', timeout: 8000 });
            });

            try {
              await page.evaluate(() => (document.fonts ? document.fonts.ready : Promise.resolve()));
            } catch (fe) {}

            await new Promise((r) => setTimeout(r, 60));

            const pdfBuffer = await page.pdf({
              format: 'A4',
              printBackground: true,
              preferCSSPageSize: true,
              margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' }
            });

            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
            res.setHeader('Content-Length', pdfBuffer.length);
            res.end(pdfBuffer);
          } finally {
            await page.close();
          }
        } catch (err) {
          console.error('[Vite Canonical PDF Export] Error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ detail: `PDF render failed: ${err.message}` }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), canonicalPdfDevPlugin()],
  server: {
    port: 5173
  }
})

