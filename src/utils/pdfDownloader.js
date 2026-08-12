import html2pdf from 'html2pdf.js';

/**
 * Direct Client-Side PDF Downloader for OpportunityX Resume Engine
 * Generates and downloads a clean A4 PDF file directly to the device without opening browser print windows.
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

  // Clean filename: e.g. "Anurag_Verma_Resume.pdf"
  const safeName = nameStr && nameStr.trim()
    ? nameStr.trim().replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_')
    : 'OpportunityX';
  const filename = `${safeName}_Resume.pdf`;

  // Create isolated, top-level export container directly attached to document.body
  const tempWrapper = document.createElement('div');
  tempWrapper.id = 'ox-pdf-export-standalone-wrapper';
  tempWrapper.style.position = 'fixed';
  tempWrapper.style.left = '0';
  tempWrapper.style.top = '0';
  tempWrapper.style.width = '210mm';
  tempWrapper.style.zIndex = '999999';
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

  const opt = {
    margin: [0, 0, 0, 0], // Precise A4 edge alignment
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      logging: false,
      backgroundColor: '#ffffff',
      windowWidth: 794, // 210mm @ 96 DPI
      scrollX: 0,
      scrollY: 0
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: {
      mode: ['avoid-all', 'css', 'legacy'],
      before: '.pdf-page-break-before',
      after: ['.pdf-page-break-after', '.pdf-a4-page'],
      avoid: [
        '.pdf-block',
        '.pdf-item',
        '.pdf-section-header',
        '.pdf-skills-group',
        '.pdf-keep-together',
        '.break-inside-avoid',
        'h1', 'h2', 'h3', 'h4'
      ]
    }
  };

  try {
    await html2pdf().set(opt).from(clonedContent).save();
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
