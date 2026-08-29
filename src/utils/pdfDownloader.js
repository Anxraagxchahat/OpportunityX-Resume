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

  // 2. Create isolated, top-level export container directly attached to document.body
  const tempWrapper = document.createElement('div');
  tempWrapper.id = 'ox-pdf-export-standalone-wrapper';
  tempWrapper.style.position = 'fixed';
  tempWrapper.style.left = '0';
  tempWrapper.style.top = '0';
  tempWrapper.style.width = '794px'; // Exact 210mm @ 96 DPI
  tempWrapper.style.zIndex = '-99999';
  tempWrapper.style.backgroundColor = '#ffffff';
  tempWrapper.style.color = '#0f172a';
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
  clonedContent.style.backgroundColor = '#ffffff';

  // 4. Preprocess cloned DOM tree for bulletproof html2canvas rendering
  prepareCloneForExport(clonedContent);

  tempWrapper.appendChild(clonedContent);
  document.body.appendChild(tempWrapper);

  // Allow layout computation in temporary wrapper
  await new Promise((resolve) => requestAnimationFrame(() => setTimeout(resolve, 30)));

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
      backgroundColor: '#ffffff',
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
 * 1. Hardens flex-wrap / chips / tags / badges so they wrap naturally and never clip or split long words.
 * 2. Pre-renders profile photos on an offscreen canvas to overcome html2canvas object-fit: cover limitations.
 * 3. Enforces box-sizing and explicit bounding bounds on all sections.
 *
 * @param {HTMLElement} rootEl
 */
function prepareCloneForExport(rootEl) {
  if (!rootEl) return;

  // A. HARDEN ALL FLEX-WRAP CONTAINERS & SKILL CHIPS
  const flexWrapContainers = rootEl.querySelectorAll(
    '.flex-wrap, [class*="flex-wrap"], [class*="gap-"], .bre-sidebar-left, .bre-creative-left, .bre-cool-left'
  );

  flexWrapContainers.forEach((container) => {
    container.style.boxSizing = 'border-box';

    // Get child chips/tags/badges
    const children = Array.from(container.children);
    children.forEach((child) => {
      // If it looks like a tag / chip / badge or span in flex-wrap
      const isTag = child.tagName === 'SPAN' ||
        child.classList.contains('rounded') ||
        child.classList.contains('border') ||
        child.className.includes('tag') ||
        child.className.includes('chip') ||
        child.className.includes('badge');

      if (isTag) {
        child.style.boxSizing = 'border-box';
        child.style.whiteSpace = 'nowrap';
        child.style.wordBreak = 'keep-all';
        child.style.overflowWrap = 'normal';
        child.style.flexShrink = '0';
        child.style.display = 'inline-flex';
        child.style.alignItems = 'center';
        child.style.justifyContent = 'center';
        child.style.textAlign = 'center';
        child.style.lineHeight = '1';
        child.style.paddingTop = '3.5px';
        child.style.paddingBottom = '3.5px';
        child.style.maxWidth = '100%';
        child.style.marginRight = child.style.marginRight || '4px';
        child.style.marginBottom = child.style.marginBottom || '4px';
      }
    });
  });

  // Also query any tags explicitly by selector
  const allTags = rootEl.querySelectorAll(
    '[class*="tag"], [class*="chip"], [class*="badge"], .bre-creative-tag, .bre-cool-tag, .pdf-skills-group span'
  );
  allTags.forEach((tag) => {
    tag.style.boxSizing = 'border-box';
    tag.style.whiteSpace = 'nowrap';
    tag.style.wordBreak = 'keep-all';
    tag.style.overflowWrap = 'normal';
    tag.style.flexShrink = '0';
    tag.style.display = 'inline-flex';
    tag.style.alignItems = 'center';
    tag.style.justifyContent = 'center';
    tag.style.textAlign = 'center';
    tag.style.lineHeight = '1';
    tag.style.paddingTop = '3.5px';
    tag.style.paddingBottom = '3.5px';
    tag.style.maxWidth = '100%';
  });

  // B. HARDEN PROFILE PHOTOS (Pre-render 1:1 aspect ratio with object-fit: cover onto canvas)
  const images = rootEl.querySelectorAll('img');
  images.forEach((img) => {
    try {
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

            img.src = canvas.toDataURL('image/png');
            img.style.objectFit = 'fill';
            img.style.width = `${targetW}px`;
            img.style.height = `${targetH}px`;
          }
        }
      }
    } catch (e) {
      console.warn('Image pre-render error in export preparation:', e);
    }
  });
}
