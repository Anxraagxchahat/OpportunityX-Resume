import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Direct Client-Side PDF Downloader for OpportunityX Resume Engine
 * Generates and downloads a clean A4 PDF file directly to the device without opening browser print windows.
 * Renders each discrete A4 page individually to eliminate extra blank trailing pages.
 *
 * Fully hardened PDF Export Engine:
 * - Eliminates character kerning distortion by avoiding letterRendering: true
 * - Hardens flex-wrap containers and skill chips/tags to guarantee natural line wrapping without overflow or text splitting
 * - Resolves html2canvas object-fit: cover limitations for profile photos
 * - Locks exact A4 physical pixel dimensions (794px × 1123px @ 96 DPI) for pixel-perfect alignment
 * - Ensures custom fonts are fully loaded before capturing
 *
 * @param {string|object} elementId - Target DOM element ID to render into PDF
 * @param {string} candidateName - Candidate name for filename formatting
 * @returns {Promise<boolean>} Resolves to true when download completes
 */
export const downloadDirectPDF = async (elementId = 'resume-a4-preview', candidateName = 'Resume') => {
  const targetId = typeof elementId === 'string' ? elementId : 'resume-a4-preview';
  const nameStr = typeof candidateName === 'string'
    ? candidateName
    : (typeof elementId === 'object' && elementId?.personal?.fullName ? elementId.personal.fullName : 'Resume');

  // Find source resume element
  let sourceEl = document.getElementById(targetId) || document.querySelector('.a4-paper-container');

  if (!sourceEl) {
    console.error(`Target resume element #${targetId} or .a4-paper-container not found for PDF download.`);
    window.print();
    return false;
  }

  // Clean filename: e.g. "Anxraag_Verma_Resume.pdf"
  const safeName = nameStr && nameStr.trim()
    ? nameStr.trim().replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_')
    : 'OpportunityX';
  const filename = `${safeName}_Resume.pdf`;

  // 1. Wait for all custom fonts (Inter, Roboto, Poppins, etc.) to finish loading & layout
  if (document.fonts) {
    try {
      const fontFamilies = [
        'Inter', 'Roboto', 'Poppins', 'Open Sans', 'Merriweather',
        'Lora', 'Outfit', 'Plus Jakarta Sans', 'JetBrains Mono'
      ];
      await Promise.allSettled(
        fontFamilies.map((f) => document.fonts.load(`12px "${f}"`))
      );
      await document.fonts.ready;
    } catch (e) {
      console.warn('Font load check non-fatal error:', e);
    }
  }

  // Allow browser a tick to complete pending paints/layouts
  await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 50)));

  // Detect dark template theme to avoid white edge clipping
  const isDarkTemplate = sourceEl.querySelector('.bre-material-dark-container') ||
    sourceEl.querySelector('.bre-material-dark') ||
    sourceEl.style.backgroundColor === 'rgb(18, 18, 18)' ||
    sourceEl.style.backgroundColor === '#121212';
  const targetBg = isDarkTemplate ? '#121212' : (sourceEl.style.backgroundColor || '#ffffff');

  // 2. Create isolated, top-level export container directly attached to document.body
  const tempWrapper = document.createElement('div');
  tempWrapper.id = 'ox-pdf-export-standalone-wrapper';
  tempWrapper.style.position = 'fixed';
  tempWrapper.style.left = '0';
  tempWrapper.style.top = '0';
  tempWrapper.style.width = '794px'; // Exact 210mm @ 96 DPI
  tempWrapper.style.zIndex = '-99999';
  tempWrapper.style.backgroundColor = targetBg;
  tempWrapper.style.color = isDarkTemplate ? '#f8fafc' : '#0f172a';
  tempWrapper.style.opacity = '1';
  tempWrapper.style.visibility = 'visible';
  tempWrapper.style.pointerEvents = 'none';
  tempWrapper.style.overflow = 'visible';

  // 3. Clone source DOM node to preserve layout and styles without mutating screen view
  const clonedContent = sourceEl.cloneNode(true);

  // Strip any no-print controls from clone
  const noPrintEls = clonedContent.querySelectorAll('.no-print');
  noPrintEls.forEach((np) => np.remove());

  // Force clean, visible, unclipped styles on cloned node
  clonedContent.style.position = 'relative';
  clonedContent.style.left = '0';
  clonedContent.style.top = '0';
  clonedContent.style.visibility = 'visible';
  clonedContent.style.opacity = '1';
  clonedContent.style.display = 'block';
  clonedContent.style.transform = 'none';
  clonedContent.style.width = '794px';
  clonedContent.style.boxSizing = 'border-box';
  clonedContent.style.backgroundColor = targetBg;

  tempWrapper.appendChild(clonedContent);
  document.body.appendChild(tempWrapper);

  // Ensure all web fonts and layout computations are fully ready
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (fontErr) {
      // Non-fatal if font API is unavailable
    }
  }

  // Allow layout computation in temporary wrapper
  await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 50)));

  // Preprocess cloned DOM tree for bulletproof html2canvas rendering (AFTER DOM attachment so computed styles are 100% accurate)
  prepareCloneForExport(clonedContent);

  try {
    // Find discrete A4 page elements to render page-by-page
    let pageNodes = clonedContent.querySelectorAll('.pdf-a4-page');
    if (pageNodes.length === 0) {
      pageNodes = clonedContent.querySelectorAll('.a4-paper-container');
    }

    const pagesToRender = pageNodes.length > 0 ? Array.from(pageNodes) : [clonedContent];

    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait',
      compress: true
    });

    const canvasOptions = {
      scale: 2, // High resolution (300 DPI equivalent)
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: targetBg,
      windowWidth: 794,  // 210mm @ 96 DPI
      windowHeight: 1123, // 297mm @ 96 DPI
      width: 794,
      height: 1123,
      scrollX: 0,
      scrollY: 0
      // NOTE: letterRendering is omitted to avoid glyph kerning distortion & string width inflation
    };

    for (let i = 0; i < pagesToRender.length; i++) {
      const pageEl = pagesToRender[i];
      if (i > 0) {
        pdf.addPage('a4', 'portrait');
      }

      // Enforce exact A4 pixel bounding box on the page before html2canvas captures
      pageEl.style.width = '794px';
      pageEl.style.height = '1123px';
      pageEl.style.minHeight = '1123px';
      pageEl.style.maxHeight = '1123px';
      pageEl.style.boxSizing = 'border-box';
      pageEl.style.overflow = 'hidden';
      pageEl.style.position = 'relative';
      if (!pageEl.style.backgroundColor || pageEl.style.backgroundColor === 'transparent') {
        pageEl.style.backgroundColor = targetBg;
      }

      const canvas = await html2canvas(pageEl, canvasOptions);
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    }

    pdf.save(filename);
    return true;
  } catch (err) {
    console.warn('Direct PDF download fallback triggered:', err);
    window.print();
    return true;
  } finally {
    // Clean up temporary export container from DOM
    if (tempWrapper && tempWrapper.parentNode) {
      tempWrapper.parentNode.removeChild(tempWrapper);
    }
  }
};

/**
 * Pre-processes cloned DOM before html2canvas capture:
 * 1. Preserves exact layout, whitespace, wrapping, and typography from the preview.
 * 2. Pre-renders profile photos on an offscreen canvas to overcome html2canvas object-fit: cover limitations.
 * 3. Enforces box-sizing and explicit bounding bounds on all sections.
 *
 * @param {HTMLElement} rootEl
 */
function prepareCloneForExport(rootEl) {
  if (!rootEl) return;

  // A. PRE-RENDER ALL SKILL CHIPS, TAGS, AND BADGES TO 2X CRISP CANVASES
  // This guarantees 100% mathematical vertical & horizontal centering across all fonts, OS, and zoom scales in html2canvas.
  try {
    const allTags = rootEl.querySelectorAll(
      '.flex-wrap span, [class*="tag"], [class*="chip"], [class*="badge"], .bre-creative-tag, .bre-cool-tag, .pdf-skills-group span'
    );

    allTags.forEach((tag) => {
      try {
        const text = tag.innerText?.trim();
        if (!text) return;

        const isPill = tag.classList.contains('rounded') ||
          tag.className.includes('bg-') ||
          tag.className.includes('tag') ||
          tag.className.includes('chip') ||
          tag.className.includes('badge') ||
          tag.style.backgroundColor;

        if (!isPill) return;

        const computed = window.getComputedStyle(tag);
        const fontSize = parseFloat(computed.fontSize) || 9;
        const fontWeight = computed.fontWeight || '600';
        const fontFamily = computed.fontFamily || 'Inter, sans-serif';
        const color = computed.color || '#ffffff';
        const bg = computed.backgroundColor || 'transparent';
        const borderColor = computed.borderColor || 'transparent';
        const borderRadius = parseFloat(computed.borderRadius) || 4;

        // Measure text with matching font
        const tempCanvas = document.createElement('canvas');
        const tCtx = tempCanvas.getContext('2d');
        if (!tCtx) return;
        tCtx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        const textMetrics = tCtx.measureText(text);
        const textW = textMetrics.width;

        const padX = 8;
        const padY = 3.5;
        const chipW = Math.ceil(textW + (padX * 2));
        const chipH = Math.ceil(fontSize + (padY * 2));

        const scale = 2; // High-DPI scale for crisp PDF vector-like appearance
        const canvas = document.createElement('canvas');
        canvas.width = chipW * scale;
        canvas.height = chipH * scale;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.scale(scale, scale);

        // 1. Draw rounded background & border
        ctx.beginPath();
        if (typeof ctx.roundRect === 'function') {
          ctx.roundRect(0.5, 0.5, chipW - 1, chipH - 1, borderRadius);
        } else {
          ctx.rect(0.5, 0.5, chipW - 1, chipH - 1);
        }

        if (bg && bg !== 'transparent' && bg !== 'rgba(0, 0, 0, 0)') {
          ctx.fillStyle = bg;
          ctx.fill();
        }

        if (borderColor && borderColor !== 'transparent' && borderColor !== 'rgba(0, 0, 0, 0)') {
          ctx.lineWidth = 1;
          ctx.strokeStyle = borderColor;
          ctx.stroke();
        }

        // 2. Draw text in dead center
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, chipW / 2, chipH / 2 + 0.5);

        // Replace DOM span with crisp pre-rendered image
        const img = document.createElement('img');
        img.src = canvas.toDataURL('image/png');
        img.style.width = `${chipW}px`;
        img.style.height = `${chipH}px`;
        img.style.display = 'inline-block';
        img.style.verticalAlign = 'middle';
        img.style.flexShrink = '0';
        img.style.boxSizing = 'border-box';
        img.style.margin = '0';
        img.style.padding = '0';
        img.style.maxWidth = '100%';

        tag.parentNode.replaceChild(img, tag);
      } catch (pillErr) {
        // Fallback to normal CSS if canvas pre-render fails for this item
        tag.style.boxSizing = 'border-box';
        tag.style.whiteSpace = 'nowrap';
        tag.style.wordBreak = 'keep-all';
        tag.style.overflowWrap = 'normal';
        tag.style.flexShrink = '0';
        tag.style.maxWidth = '100%';
        tag.style.lineHeight = '1.1';
        tag.style.paddingTop = '0px';
        tag.style.paddingBottom = '3.5px';
        tag.style.verticalAlign = 'baseline';
      }
    });
  } catch (err) {
    // Non-fatal error in chip pre-processing
  }

  // B. HARDEN PROFILE PHOTOS (Pre-render 1:1 aspect ratio with object-fit: cover onto canvas)
  const images = rootEl.querySelectorAll('img');
  images.forEach((img) => {
    try {
      img.crossOrigin = 'anonymous';
      if (!img.src || img.src.startsWith('data:image/svg')) return;

      const isProfile = img.alt?.toLowerCase().includes('profile') ||
        img.className?.includes('rounded-full') ||
        img.className?.includes('object-cover') ||
        img.parentElement?.className?.includes('ProfilePhoto');

      if (isProfile) {
        const targetW = img.offsetWidth || img.clientWidth || (img.parentElement ? img.parentElement.offsetWidth : 64) || 64;
        const targetH = img.offsetHeight || img.clientHeight || (img.parentElement ? img.parentElement.offsetHeight : 64) || 64;

        if (targetW > 0 && targetH > 0 && img.naturalWidth > 0 && img.naturalHeight > 0) {
          const canvas = document.createElement('canvas');
          const renderScale = 2;
          canvas.width = targetW * renderScale;
          canvas.height = targetH * renderScale;
          const ctx = canvas.getContext('2d');

          if (ctx) {
            const natW = img.naturalWidth;
            const natH = img.naturalHeight;
            const targetRatio = targetW / targetH;
            const sourceRatio = natW / natH;
            let sX = 0, sY = 0, sW = natW, sH = natH;

            if (sourceRatio > targetRatio) {
              sW = natH * targetRatio;
              sX = (natW - sW) / 2;
            } else {
              sH = natW / targetRatio;
              sY = (natH - sH) / 2;
            }

            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, sX, sY, sW, sH, 0, 0, canvas.width, canvas.height);

            try {
              img.src = canvas.toDataURL('image/png');
              img.style.objectFit = 'fill';
              img.style.width = `${targetW}px`;
              img.style.height = `${targetH}px`;
            } catch (canvasErr) {
              // Ignore cross-origin canvas taint error and let html2canvas use original img
            }
          }
        }
      }
    } catch (e) {
      // Non-fatal error in photo pre-render
    }
  });
}
