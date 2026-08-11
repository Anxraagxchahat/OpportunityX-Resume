import React, { useState } from 'react';
import { ArrowLeft, ZoomIn, ZoomOut, Download, Sparkles } from 'lucide-react';
import { A4ResumePreview } from '../A4ResumePreview';
import { useResume } from '../../context/ResumeContext';

export const TabletResumePreview = ({ onBackToEdit, onOpenExportModal }) => {
  const { activeResume } = useResume();
  const [zoomLevel, setZoomLevel] = useState(80);

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 10, 130));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 10, 50));

  return (
    <div className="flex-1 flex flex-col h-full bg-[#080B12] text-[var(--ox-text-primary)] select-none overflow-hidden no-print">
      {/* PREVIEW TOOLBAR */}
      <div className="h-12 bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] px-4 flex items-center justify-between gap-3 shrink-0">
        <button
          type="button"
          onClick={onBackToEdit}
          className="min-h-[44px] px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-orange-400" />
          <span>Edit Mode</span>
        </button>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-[#10131D] px-2.5 py-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={handleZoomOut}
            className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono font-bold text-white min-w-[40px] text-center">
            {zoomLevel}%
          </span>

          <button
            type="button"
            onClick={handleZoomIn}
            className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Download PDF */}
        <button
          type="button"
          onClick={onOpenExportModal}
          className="min-h-[44px] px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* A4 CANVAS CONTAINER */}
      <div className="flex-1 overflow-auto p-4 sm:p-6 flex justify-center items-start custom-scrollbar">
        <div
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center'
          }}
          className="transition-transform duration-200 shadow-2xl rounded-sm"
        >
          <A4ResumePreview />
        </div>
      </div>
    </div>
  );
};

export default TabletResumePreview;
