import React, { useState } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, RotateCcw, Download, Sparkles, RefreshCw } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';
import { A4ResumePreview } from '../A4ResumePreview';
import { downloadDirectPDF } from '../../utils/pdfDownloader';

export const MobileResumePreview = () => {
  const { activeResume, addToast } = useResume();
  const { setActiveTab } = useMobileNavigation();

  const [scale, setScale] = useState(0.52); // Fit scale default for mobile screen
  const [isDownloading, setIsDownloading] = useState(false);

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.1, 1.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.1, 0.35));
  const handleResetZoom = () => setScale(0.52);

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      await downloadDirectPDF(activeResume, activeResume.metadata?.title || 'Resume');
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full min-h-dvh bg-[var(--ox-bg)] flex flex-col no-print select-none">
      
      {/* Top Controls Header */}
      <div className="sticky top-0 z-30 bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] px-3 py-2 flex items-center justify-between gap-2">
        <button
          onClick={() => setActiveTab('edit')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] font-bold text-xs min-h-[44px] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit</span>
        </button>

        {/* Zoom Control Group */}
        <div className="flex items-center bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl p-1 gap-1">
          <button
            onClick={handleZoomOut}
            className="p-1.5 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={handleResetZoom}
            className="px-2 py-1 text-[10px] font-extrabold text-orange-400 bg-orange-500/10 rounded-md min-h-[32px] cursor-pointer"
            title="Fit Screen"
          >
            {Math.round(scale * 100)}%
          </button>

          <button
            onClick={handleZoomIn}
            className="p-1.5 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Primary Download PDF CTA */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md min-h-[44px] cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
        >
          {isDownloading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Generating...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </>
          )}
        </button>
      </div>

      {/* Main Preview Container with Controlled Transform Zoom */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto p-4 flex flex-col items-center justify-start pb-28">
        <div
          className="transition-transform duration-200 origin-top shadow-2xl rounded-lg overflow-hidden bg-white"
          style={{
            transform: `scale(${scale})`,
            marginBottom: `calc(-1 * (1 - ${scale}) * 1050px)` // Offset bottom whitespace from scale
          }}
        >
          <A4ResumePreview />
        </div>
      </div>

    </div>
  );
};

export default MobileResumePreview;
