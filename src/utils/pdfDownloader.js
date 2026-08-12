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
      onclone: (clonedDoc) => {
        // Position cloned element at (0, 0) inside cloned document so canvas captures full content!
        const clonedEl = clonedDoc.getElementById(targetId) || clonedDoc.querySelector('.a4-paper-container');
        if (clonedEl) {
          clonedEl.style.position = 'static';
          clonedEl.style.left = '0px';
          clonedEl.style.top = '0px';
          clonedEl.style.transform = 'none';
          clonedEl.style.visibility = 'visible';
          clonedEl.style.opacity = '1';
          clonedEl.style.zIndex = '99999';

          // Remove any no-print controls from cloned PDF
          const noPrintEls = clonedEl.querySelectorAll('.no-print');
          noPrintEls.forEach((np) => np.remove());
        }
      }
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
  }
};
