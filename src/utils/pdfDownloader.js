import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Direct Client-Side PDF Downloader for OpportunityX Resume Engine
 * Generates and downloads a clean A4 PDF file directly to the device without opening browser print windows.
 * Renders each discrete A4 page individually to eliminate extra blank trailing pages.
 *
 * @param {string} elementId - Target DOM element ID to render into PDF
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

  // Wait for all custom fonts (Inter, Roboto, Poppins, etc.) to finish loading
  if (document.fonts && document.fonts.ready) {
    try {
      await document.fonts.ready;
    } catch (e) {}
  }

  // Create isolated, top-level export container directly attached to document.body
  const tempWrapper = document.createElement('div');
  tempWrapper.id = 'ox-pdf-export-standalone-wrapper';
  tempWrapper.style.position = 'fixed';
  tempWrapper.style.left = '0';
  tempWrapper.style.top = '0';
  tempWrapper.style.width = '210mm';
  tempWrapper.style.zIndex = '-99999';
  tempWrapper.style.backgroundColor = '#ffffff';
  tempWrapper.style.color = '#0f172a';
  tempWrapper.style.opacity = '1';
  tempWrapper.style.visibility = 'visible';
  tempWrapper.style.pointerEvents = 'none';
  tempWrapper.style.overflow = 'visible';

  // Clone source DOM node to preserve layout and styles without mutating screen view
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
  clonedContent.style.width = '210mm';
  clonedContent.style.boxSizing = 'border-box';
  clonedContent.style.backgroundColor = '#ffffff';

  tempWrapper.appendChild(clonedContent);
  document.body.appendChild(tempWrapper);

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
      letterRendering: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // 210mm @ 96 DPI
      scrollX: 0,
      scrollY: 0
    };

    for (let i = 0; i < pagesToRender.length; i++) {
      const pageEl = pagesToRender[i];
      if (i > 0) {
        pdf.addPage('a4', 'portrait');
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
