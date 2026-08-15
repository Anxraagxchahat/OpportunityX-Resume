import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { registerServiceWorker } from './utils/pwaRegister'

// ─── Handle Dynamic Import & Chunk Loading Failures After Deployments ───
if (typeof window !== 'undefined') {
  const triggerReloadOnChunkError = (reason) => {
    const lastReload = parseInt(sessionStorage.getItem('ox_chunk_reload_ts') || '0', 10);
    const now = Date.now();
    // Guard against reload loops with a 10s cooldown
    if (now - lastReload > 10000) {
      sessionStorage.setItem('ox_chunk_reload_ts', String(now));
      console.warn('[ChunkLoader] Stale bundle detected (' + reason + '). Reloading application...');
      window.location.reload();
    }
  };

  // Vite's official event for dynamic import preload failures
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    triggerReloadOnChunkError('vite:preloadError');
  });

  // Global window error listener for module fetch failures
  window.addEventListener('error', (event) => {
    const msg = event?.message || '';
    if (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Expected a JavaScript-or-Wasm module script')
    ) {
      triggerReloadOnChunkError(msg);
    }
  });

  // Unhandled promise rejection listener for lazy import errors
  window.addEventListener('unhandledrejection', (event) => {
    const msg = event?.reason?.message || String(event?.reason || '');
    if (
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Expected a JavaScript-or-Wasm module script')
    ) {
      triggerReloadOnChunkError(msg);
    }
  });
}

// Register PWA Service Worker
registerServiceWorker();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
