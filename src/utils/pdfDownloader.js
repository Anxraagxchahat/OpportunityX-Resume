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
  const element = document.getElementById(elementId);

  if (!element) {
    console.error(`Target resume element #${elementId} not found for PDF download.`);
    return false;
  }

  // Clean filename: e.g. "Anurag_Verma_Resume.pdf"
  const safeName = candidateName && candidateName.trim()
    ? candidateName.trim().replace(/[^a-zA-Z0-9\s_-]/g, '').replace(/\s+/g, '_')
    : 'OpportunityX';
  const filename = `${safeName}_Resume.pdf`;

  const opt = {
    margin: 0,
    filename: filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      windowWidth: 794 // 210mm @ 96 DPI
    },
    jsPDF: {
      unit: 'mm',
      format: 'a4',
      orientation: 'portrait'
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
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
