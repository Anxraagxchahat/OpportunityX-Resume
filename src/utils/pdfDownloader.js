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
  // Handle case where elementId is passed as activeResume object
  const targetId = typeof elementId === 'string' ? elementId : 'resume-a4-preview';
  const nameStr = typeof candidateName === 'string'
    ? candidateName
    : (typeof elementId === 'object' && elementId?.personal?.fullName ? elementId.personal.fullName : 'Resume');

  let element = document.getElementById(targetId);

  // Robust Fallback: search for .a4-paper-container if target ID is not directly matched
  if (!element) {
    element = document.querySelector('.a4-paper-container');
  }

  if (!element) {
    console.error(`Target resume element #${targetId} or .a4-paper-container not found for PDF download.`);
    window.print();
    return false;
  }

  // Clean filename: e.g. "Anurag_Verma_Resume.pdf"
  const safeName = nameStr && nameStr.trim()
    ? nameStr.trim().replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_')
    : 'OpportunityX';
  const filename = `${safeName}_Resume.pdf`;

  // Temporarily store original styles
  const origPosition = element.style.position;
  const origLeft = element.style.left;
  const origTop = element.style.top;
  const origVisibility = element.style.visibility;
  const origOpacity = element.style.opacity;
  const origZIndex = element.style.zIndex;
  const origTransform = element.style.transform;

  // Bring target element into 0,0 viewport coordinates with full visibility for html2canvas
  element.style.position = 'absolute';
  element.style.left = '0px';
  element.style.top = '0px';
  element.style.visibility = 'visible';
  element.style.opacity = '1';
  element.style.zIndex = '-999';
  element.style.transform = 'none';

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
      x: 0,
      y: 0,
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
      after: '.pdf-page-break-after',
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
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (err) {
    console.warn('Direct PDF download fallback triggered:', err);
    window.print();
    return true;
  } finally {
    // Restore original inline styles
    element.style.position = origPosition;
    element.style.left = origLeft;
    element.style.top = origTop;
    element.style.visibility = origVisibility;
    element.style.opacity = origOpacity;
    element.style.zIndex = origZIndex;
    element.style.transform = origTransform;
  }
};
