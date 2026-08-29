import React, { useState, useRef, useEffect, Suspense } from 'react';
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  Download,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';
import { downloadDirectPDF } from '../../utils/pdfDownloader';
import { computePageAssignments } from '../../utils/paginationEngine';
import { TEMPLATE_REGISTRY } from '../../templates';
import { MobilePreviewBottomSheet } from './MobilePreviewBottomSheet';

export const MobileResumePreview = () => {
  const {
    activeResume,
    addToast,
    setIsDownloadSuccessModalOpen
  } = useResume();
  const { setActiveTab } = useMobileNavigation();

  const [scale, setScale] = useState(0.48);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);

  const measureRef = useRef(null);

  // ─── Resume Data ─────────────────────────────────────────────
  const { personal, experience, education, projects, skills, certificates, achievements, languages, customSections, metadata, assets, style } = activeResume;
  const accentHex = metadata?.accentColor || '#F97316';
  const fontFamily = metadata?.fontFamily || metadata?.font || 'Inter';
  const template = metadata?.template || 'modern';

  const paperBg = style?.paperBackground || 'white';
  const paperBgColor = paperBg === 'warm' ? '#fdfbf7' : paperBg === 'light-gray' ? '#f8fafc' : paperBg === 'minimal-accent' ? '#f0fdf4' : '#ffffff';

  const pageMargin = style?.pageMargin || 'normal';
  const pageBreakOffset = Number(style?.pageBreakOffset) || 0;
  const showPage2Header = style?.showPage2Header !== false;
  const page2TopMargin = Number(style?.page2TopMargin) ?? 10;

  const topPadMm = pageMargin === 'compact' ? 6 : pageMargin === 'spacious' ? 14 : 10;
  const sidePadMm = pageMargin === 'compact' ? 8 : pageMargin === 'spacious' ? 16 : 12;

  const isFullBleedTemplate = ['bre-material-dark', 'bre-sidebar', 'bre-cool', 'bre-creative', 'bre-left-right', 'bre-oblique', 'creative-sidebar', 'developer-dark', 'accent-column'].includes(template);
  const effectivePaperBg = template === 'bre-material-dark' ? '#121212' : paperBgColor;
  const effectiveTopPadMm = isFullBleedTemplate ? 0 : topPadMm;
  const effectiveSidePadMm = isFullBleedTemplate ? 0 : sidePadMm;

  const SelectedTemplateComponent = TEMPLATE_REGISTRY[template] || TEMPLATE_REGISTRY.modern;

  // ─── Pagination Engine ───────────────────────────────────────
  const [pageAssignments, setPageAssignments] = useState([new Set()]);

  useEffect(() => {
    const updatePagination = () => {
      if (measureRef.current) {
        const computedPages = computePageAssignments(measureRef.current, {
          pageMargin,
          pageBreakOffset,
          showPage2Header,
          page2TopMargin
        });
        setPageAssignments(computedPages);
        setTotalPages(Math.max(1, computedPages.length));
      }
    };

    updatePagination();
    const timer = setTimeout(updatePagination, 200);
    return () => clearTimeout(timer);
  }, [activeResume, template, fontFamily, accentHex, style, pageBreakOffset, topPadMm, showPage2Header, page2TopMargin, pageMargin]);

  // ─── Zoom Handlers ──────────────────────────────────────────
  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.05, 1.0));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.05, 0.30));
  const handleResetZoom = () => setScale(0.48);

  // ─── PDF Download ───────────────────────────────────────────
  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    try {
      const candidateName = activeResume?.personal?.fullName || activeResume?.metadata?.title || 'Resume';
      await downloadDirectPDF('resume-a4-preview', candidateName);
      setTimeout(() => {
        setIsDownloadSuccessModalOpen(true);
      }, 400);
    } catch (err) {
      console.error('PDF download error:', err);
      addToast('Failed to download PDF. Please try again.', 'error');
    } finally {
      setIsDownloading(false);
    }
  };

  // ─── Canvas Height Compensation ─────────────────────────────
  // A4 height in px at 96 DPI = 1122px. We offset the bottom margin to eliminate
  // the dead whitespace created by CSS transform scaling.
  const a4HeightPx = 1122 * totalPages + (totalPages - 1) * 32; // gap between pages
  const compensatedMarginBottom = -(1 - scale) * a4HeightPx;

  return (
    <div className="w-full min-h-dvh bg-[var(--ox-bg)] flex flex-col no-print select-none overflow-x-hidden">

      {/* ══════════════════════════════════════════════════════════
          MINIMAL STICKY HEADER
          ═══════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-30 bg-[var(--ox-surface-primary)]/95 backdrop-blur-md border-b border-[var(--ox-border)] px-3 py-2 flex items-center justify-between gap-2">
        {/* Back to Edit */}
        <button
          onClick={() => setActiveTab('edit')}
          className="flex items-center gap-1 px-2.5 py-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] font-bold text-xs min-h-[40px] cursor-pointer active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Edit</span>
        </button>

        {/* Page Status Badge */}
        <div className="flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1.5 rounded-full bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)]">
          {totalPages === 1 ? (
            <span className="flex items-center gap-1 text-emerald-400">
              <CheckCircle2 className="w-3 h-3" /> 1 Page
            </span>
          ) : (
            <span className="flex items-center gap-1 text-amber-400">
              <AlertCircle className="w-3 h-3" /> {totalPages} Pages
            </span>
          )}
        </div>

        {/* Download PDF CTA */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-md min-h-[40px] cursor-pointer disabled:opacity-50 active:scale-95 transition-all"
        >
          {isDownloading ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>...</span>
            </>
          ) : (
            <>
              <Download className="w-3.5 h-3.5" />
              <span>PDF</span>
            </>
          )}
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          HIDDEN MEASUREMENT NODE (for pagination engine)
          ═══════════════════════════════════════════════════════ */}
      <div
        id="resume-measure-node"
        ref={measureRef}
        aria-hidden="true"
        className="absolute left-[-9999px] top-0 pointer-events-none opacity-0 overflow-visible"
        style={{
          width: '210mm',
          padding: `${effectiveTopPadMm}mm ${effectiveSidePadMm}mm`,
          backgroundColor: effectivePaperBg || '#ffffff',
          fontFamily: `'${fontFamily}', sans-serif`,
          boxSizing: 'border-box'
        }}
      >
        <Suspense fallback={null}>
          <SelectedTemplateComponent
            resumeData={activeResume}
            accentHex={accentHex}
            fontFamily={fontFamily}
          />
        </Suspense>
        {assets?.digitalSignature && (
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
            <img src={assets.digitalSignature} alt="Digital Signature" className="h-10 object-contain" />
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════
          HIDDEN PDF EXPORT NODE (for html2canvas PDF)
          ═══════════════════════════════════════════════════════ */}
      <div
        id="resume-a4-preview"
        aria-hidden="true"
        className="absolute left-0 top-0 pointer-events-none z-[-9999] bg-white text-slate-900 opacity-100"
        style={{
          width: '210mm',
          backgroundColor: effectivePaperBg || '#ffffff',
          fontFamily: `'${fontFamily}', sans-serif`,
          boxSizing: 'border-box'
        }}
      >
        {Array.from({ length: totalPages }).map((_, pageIdx) => {
          const page2TextStartYMm = pageIdx > 0
            ? (showPage2Header ? effectiveTopPadMm + 14 + Math.max(0, page2TopMargin - 10) : effectiveTopPadMm + Math.max(0, page2TopMargin - 10))
            : 0;
          const assignedBlocks = pageAssignments[pageIdx] || null;

          return (
            <div
              key={`pdf-export-page-${pageIdx}`}
              className="pdf-a4-page relative overflow-hidden"
              style={{
                width: '210mm',
                height: '297mm',
                backgroundColor: effectivePaperBg || '#ffffff',
                fontFamily: `'${fontFamily}', sans-serif`,
                boxSizing: 'border-box'
              }}
            >
              {pageIdx > 0 && showPage2Header && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${effectiveTopPadMm}mm`,
                    left: `${effectiveSidePadMm}mm`,
                    right: `${effectiveSidePadMm}mm`,
                    zIndex: 20
                  }}
                  className="border-b border-slate-300/80 pb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-700 select-none bg-inherit"
                >
                  <span className="flex items-center gap-1.5 text-orange-600 font-extrabold uppercase tracking-wide text-[10px]">
                    <FileText className="w-3.5 h-3.5 text-orange-500" />
                    {personal?.fullName || 'Candidate Name'} — Resume (Page {pageIdx + 1})
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal font-mono">
                    {personal?.email || personal?.phone || 'OpportunityX Engine'}
                  </span>
                </div>
              )}

              <div
                style={{
                  position: 'absolute',
                  top: pageIdx === 0 ? 0 : `${page2TextStartYMm}mm`,
                  left: 0,
                  width: '210mm',
                  height: pageIdx === 0 ? '297mm' : `${297 - page2TextStartYMm}mm`,
                  overflow: 'hidden',
                  paddingTop: pageIdx === 0 ? `${effectiveTopPadMm}mm` : 0,
                  paddingLeft: `${effectiveSidePadMm}mm`,
                  paddingRight: `${effectiveSidePadMm}mm`,
                  paddingBottom: `${effectiveTopPadMm}mm`,
                  boxSizing: 'border-box'
                }}
              >
                <Suspense fallback={null}>
                  <SelectedTemplateComponent
                    resumeData={activeResume}
                    accentHex={accentHex}
                    fontFamily={fontFamily}
                    visibleBlockIds={assignedBlocks}
                  />
                </Suspense>

                {pageIdx === totalPages - 1 && (
                  <>
                    {assets?.digitalSignature && (
                      <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
                        <div className="text-center">
                          <img src={assets.digitalSignature} alt="Digital Signature" className="h-10 object-contain mx-auto" />
                          <div className="text-[10px] text-slate-500 font-semibold pt-1">Signed via OpportunityX Engine</div>
                        </div>
                      </div>
                    )}
                    <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                      <span>OpportunityX Resume Engine</span>
                      <span>resume.opportunityx.co.in</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════════════════
          MAIN RESUME CANVAS AREA
          ═══════════════════════════════════════════════════════ */}
      <div className="flex-1 overflow-x-hidden overflow-y-auto px-3 pt-4 pb-32 flex flex-col items-center justify-start bg-[var(--ox-surface-secondary)]">
        
        {/* A4 Page Cards */}
        <div
          className="flex flex-col items-center gap-6 transition-transform duration-200 origin-top"
          style={{
            transform: `scale(${scale})`,
            marginBottom: `${compensatedMarginBottom}px`
          }}
        >
          {Array.from({ length: totalPages }).map((_, pageIdx) => {
            const page1CutoffMm = 297 + Math.min(0, pageBreakOffset);
            const page1ContentHeightMm = Math.max(10, page1CutoffMm - topPadMm);
            const page2TextStartYMm = pageIdx > 0
              ? (showPage2Header ? topPadMm + 14 + Math.max(0, page2TopMargin - 10) : topPadMm + Math.max(0, page2TopMargin - 10))
              : 0;

            return (
              <div key={`mobile-a4-page-${pageIdx}`} className="flex flex-col items-center">
                {/* Page Number Label */}
                {totalPages > 1 && (
                  <div className="w-[210mm] flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1.5 px-1">
                    <span className="flex items-center gap-1 text-orange-400">
                      <FileText className="w-3 h-3" /> Page {pageIdx + 1}/{totalPages}
                    </span>
                    <span className="text-slate-600 font-mono text-[9px]">A4</span>
                  </div>
                )}

                {/* A4 Paper Frame */}
                <div
                  className="shadow-2xl rounded-sm overflow-hidden relative border border-slate-300/10"
                  style={{
                    width: '210mm',
                    height: '297mm',
                    backgroundColor: effectivePaperBg,
                    fontFamily: `'${fontFamily}', sans-serif`
                  }}
                >
                  {/* Page 2+ Running Header */}
                  {pageIdx > 0 && showPage2Header && (
                    <div
                      style={{
                        position: 'absolute',
                        top: `${effectiveTopPadMm}mm`,
                        left: `${effectiveSidePadMm}mm`,
                        right: `${effectiveSidePadMm}mm`,
                        zIndex: 20
                      }}
                      className="border-b border-slate-300/80 pb-1.5 flex items-center justify-between text-[11px] font-bold text-slate-700 select-none bg-inherit"
                    >
                      <span className="flex items-center gap-1.5 text-orange-600 font-extrabold uppercase tracking-wide text-[10px]">
                        <FileText className="w-3.5 h-3.5 text-orange-500" />
                        {personal?.fullName || 'Candidate'} — Page {pageIdx + 1}
                      </span>
                    </div>
                  )}

                  {/* Template Content Viewport */}
                  <div
                    style={{
                      position: 'absolute',
                      top: pageIdx === 0 ? 0 : `${page2TextStartYMm}mm`,
                      left: 0,
                      width: '210mm',
                      height: pageIdx === 0 ? '297mm' : `${297 - page2TextStartYMm}mm`,
                      overflow: 'hidden',
                      paddingTop: pageIdx === 0 ? `${effectiveTopPadMm}mm` : 0,
                      paddingLeft: `${effectiveSidePadMm}mm`,
                      paddingRight: `${effectiveSidePadMm}mm`,
                      paddingBottom: `${effectiveTopPadMm}mm`,
                      boxSizing: 'border-box'
                    }}
                  >
                    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading Template...</div>}>
                      <SelectedTemplateComponent
                        resumeData={activeResume}
                        accentHex={accentHex}
                        fontFamily={fontFamily}
                        visibleBlockIds={pageAssignments[pageIdx] || null}
                      />
                    </Suspense>

                    {/* Signature & Watermark on Last Page */}
                    {pageIdx === totalPages - 1 && (
                      <>
                        {assets?.digitalSignature && (
                          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end">
                            <div className="text-center">
                              <img src={assets.digitalSignature} alt="Digital Signature" className="h-10 object-contain mx-auto" />
                              <div className="text-[10px] text-slate-500 font-semibold pt-1">Signed via OpportunityX Engine</div>
                            </div>
                          </div>
                        )}
                        <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
                          <span>OpportunityX Resume Engine</span>
                          <span>resume.opportunityx.co.in</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FLOATING ZOOM CONTROLS (Bottom Right)
          ═══════════════════════════════════════════════════════ */}
      <div className="fixed bottom-[76px] right-3 z-30 flex flex-col items-center bg-[var(--ox-surface-primary)]/90 backdrop-blur-lg border border-[var(--ox-border)] rounded-2xl shadow-[0_4px_24px_rgba(0,0,0,0.3)] overflow-hidden no-print">
        <button
          onClick={handleZoomIn}
          className="p-2.5 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] active:bg-[var(--ox-surface-secondary)] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetZoom}
          className="px-2 py-1.5 text-[10px] font-extrabold text-orange-400 bg-orange-500/10 border-y border-[var(--ox-border)] min-h-[32px] min-w-[40px] flex items-center justify-center cursor-pointer hover:bg-orange-500/20 transition-colors"
          title="Reset Zoom"
        >
          {Math.round(scale * 100)}%
        </button>

        <button
          onClick={handleZoomOut}
          className="p-2.5 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] active:bg-[var(--ox-surface-secondary)] transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════
          CUSTOMIZE FAB (Bottom Left)
          ═══════════════════════════════════════════════════════ */}
      <button
        onClick={() => setIsBottomSheetOpen(true)}
        className="fixed bottom-[76px] left-3 z-30 flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs shadow-[0_4px_24px_rgba(249,115,22,0.3)] active:scale-95 transition-all cursor-pointer no-print min-h-[44px]"
      >
        <Sliders className="w-4 h-4" />
        <span>Customize</span>
      </button>

      {/* ══════════════════════════════════════════════════════════
          BOTTOM SHEET
          ═══════════════════════════════════════════════════════ */}
      <MobilePreviewBottomSheet
        isOpen={isBottomSheetOpen}
        onClose={() => setIsBottomSheetOpen(false)}
      />
    </div>
  );
};

export default MobileResumePreview;
