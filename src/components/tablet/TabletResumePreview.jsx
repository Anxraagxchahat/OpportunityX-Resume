import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, Download, Sparkles, Maximize2, RotateCcw } from 'lucide-react';
import { A4ResumePreview } from '../A4ResumePreview';
import { useResume } from '../../context/ResumeContext';

export const TabletResumePreview = ({ onBackToEdit, onOpenExportModal, isSplit = false }) => {
  const { activeResume } = useResume();
  const containerRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(isSplit ? 60 : 80);
  const [autoFitScale, setAutoFitScale] = useState(null);

  // Auto-fit calculate on mount and container resize
  useEffect(() => {
    if (!containerRef.current) return;

    const calculateFit = () => {
      if (!containerRef.current) return;
      const containerWidth = containerRef.current.clientWidth - 40; // 20px padding each side
      const containerHeight = containerRef.current.clientHeight - 40;
      // Standard A4 dimensions in px at standard DPI (~794px x 1123px)
      const a4Width = 794;
      const a4Height = 1123;

      const scaleW = containerWidth / a4Width;
      const scaleH = containerHeight / a4Height;
      // Fit to width or height nicely
      const fitScale = Math.max(0.45, Math.min(scaleW, isSplit ? 0.75 : 0.95));
      const pct = Math.round(fitScale * 100);
      setAutoFitScale(pct);
      setZoomLevel(pct);
    };

    calculateFit();

    const resizeObserver = new ResizeObserver(() => {
      calculateFit();
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [isSplit]);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 10, 140));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 10, 40));
  const handleResetFit = () => {
    if (autoFitScale) setZoomLevel(autoFitScale);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[var(--ox-bg)] text-[var(--ox-text-primary)] select-none overflow-hidden no-print transition-colors duration-300">
      {/* ─── PREVIEW TOOLBAR ─── */}
      <div className="h-14 bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] px-3 sm:px-4 flex items-center justify-between gap-2 shrink-0">
        {/* Back to Edit Button (shown when not split view) */}
        {!isSplit && onBackToEdit ? (
          <button
            type="button"
            onClick={onBackToEdit}
            className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] hover:border-orange-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95"
          >
            <ArrowLeft className="w-4 h-4 text-orange-400" />
            <span>Editor</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-400">
              Live Preview
            </span>
          </div>
        )}

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-[var(--ox-surface-secondary)] px-2 py-1 rounded-xl border border-[var(--ox-border)]">
          <button
            type="button"
            onClick={handleZoomOut}
            className="min-h-[38px] min-w-[38px] p-1.5 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] flex items-center justify-center cursor-pointer rounded-lg hover:bg-[var(--ox-surface-primary)]"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleResetFit}
            className="text-xs font-mono font-bold text-[var(--ox-text-primary)] min-w-[44px] text-center px-1.5 py-1 rounded hover:bg-[var(--ox-surface-primary)] cursor-pointer"
            title="Click to reset Auto-Fit"
          >
            {zoomLevel}%
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            className="min-h-[38px] min-w-[38px] p-1.5 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] flex items-center justify-center cursor-pointer rounded-lg hover:bg-[var(--ox-surface-primary)]"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Download PDF */}
        <button
          type="button"
          onClick={onOpenExportModal}
          className="min-h-[44px] px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer active:scale-95 shrink-0"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span className="hidden min-[840px]:inline">Download PDF</span>
          <span className="inline min-[840px]:hidden">PDF</span>
        </button>
      </div>

      {/* ─── A4 CANVAS CONTAINER ─── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start custom-scrollbar bg-[var(--ox-bg)]"
      >
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            width: '794px'
          }}
          className="transition-transform duration-200 shadow-2xl rounded-sm shrink-0"
        >
          <A4ResumePreview />
        </div>
      </div>
    </div>
  );
};

export default TabletResumePreview;
