import React, { useState, useRef, useEffect, Suspense } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Palette,
  Type,
  Layout,
  Download,
  Sliders,
  Activity,
  Image as ImageIcon,
  FileText,
  Layers,
  Scissors,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { trackEvent, AnalyticsEvents } from '../utils/analytics';
import { TEMPLATE_REGISTRY, TEMPLATE_CATEGORIES } from '../templates';
import { downloadDirectPDF } from '../utils/pdfDownloader';

export const fontOptions = [
  { id: 'Inter', name: 'Inter' },
  { id: 'Outfit', name: 'Outfit' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta' },
  { id: 'JetBrains Mono', name: 'Mono Code' }
];

export const colorOptions = [
  { id: '#F97316', name: 'OpportunityX Orange' },
  { id: '#2563EB', name: 'Royal Blue' },
  { id: '#059669', name: 'Emerald Green' },
  { id: '#7C3AED', name: 'Purple Accent' },
  { id: '#DC2626', name: 'Crimson Red' },
  { id: '#0D9488', name: 'Teal Accent' },
  { id: '#1E293B', name: 'Classic Slate' }
];

export const A4ResumePreview = () => {
  const {
    activeResume,
    setTemplate,
    setFontFamily,
    setAccentColor,
    updateStyle,
    activeResumeId,
    setIsInspectorOpen,
    setIsThemeCustomizerOpen,
    setIsAssetManagerOpen,
    setIsDonationModalOpen
  } = useResume();

  const [zoomLevel, setZoomLevel] = useState(85);
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'continuous'
  const [totalPages, setTotalPages] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPageBreakMenuOpen, setIsPageBreakMenuOpen] = useState(false);
  const [isDraggingLine, setIsDraggingLine] = useState(false);

  const measureRef = useRef(null);
  const dragStartYRef = useRef(0);
  const dragStartOffsetRef = useRef(0);

  const { personal, experience, education, projects, skills, certificates, achievements, languages, customSections, metadata, assets, style } = activeResume;
  const accentHex = metadata?.accentColor || '#F97316';
  const fontFamily = metadata?.fontFamily || 'Inter';
  const template = metadata?.template || 'modern';

  const paperBg = style?.paperBackground || 'white';
  const paperBgColor = paperBg === 'warm' ? '#fdfbf7' : paperBg === 'light-gray' ? '#f8fafc' : paperBg === 'minimal-accent' ? '#f0fdf4' : '#ffffff';

  const pageMargin = style?.pageMargin || 'normal';
  const sectionSpacing = style?.sectionSpacing || 'normal';
  const lineSpacing = style?.lineSpacing || 'normal';
  const pageBreakOffset = Number(style?.pageBreakOffset) || 0;

  // Base margin values in mm
  const topPadMm = pageMargin === 'compact' ? 6 : pageMargin === 'spacious' ? 14 : 10;
  const sidePadMm = pageMargin === 'compact' ? 8 : pageMargin === 'spacious' ? 16 : 12;

  // Dynamic Mouse Drag Handler for Page Break Line
  const handleLineDragStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingLine(true);
    dragStartYRef.current = e.clientY;
    dragStartOffsetRef.current = pageBreakOffset;

    const handleMouseMove = (moveEvent) => {
      const deltaYPx = moveEvent.clientY - dragStartYRef.current;
      // 1mm ~ 3.7795px at 96 DPI, adjusted by zoom scale
      const scale = zoomLevel / 100;
      const deltaYMm = deltaYPx / (3.7795 * scale);
      let newOffset = Math.round(dragStartOffsetRef.current + deltaYMm);

      // Clamp offset between -60mm and +40mm
      newOffset = Math.max(-60, Math.min(40, newOffset));
      updateStyle('pageBreakOffset', newOffset);
    };

    const handleMouseUp = () => {
      setIsDraggingLine(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 10, 130));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 10, 50));

  const handleFitToOnePage = () => {
    updateStyle('pageMargin', 'compact');
    updateStyle('sectionSpacing', 'compact');
    updateStyle('lineSpacing', 'compact');
    updateStyle('pageBreakOffset', 0);
  };

  const handlePushToPageTwo = () => {
    updateStyle('sectionSpacing', 'spacious');
    updateStyle('pageMargin', 'spacious');
    updateStyle('pageBreakOffset', -20);
  };

  const handleDownloadPDF = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    trackEvent(AnalyticsEvents.PDF_DOWNLOAD, { resumeId: activeResumeId, template });

    const candidateName = personal?.fullName || 'OpportunityX';

    // Direct Client PDF Download (Zero print dialogs)
    await downloadDirectPDF('resume-a4-preview', candidateName);

    setIsDownloading(false);

    // Trigger Post-Download Support & Donation Pop-up
    setTimeout(() => {
      setIsDonationModalOpen(true);
    }, 400);
  };

  // Dynamic Selected Template Component
  const SelectedTemplateComponent = TEMPLATE_REGISTRY[template] || TEMPLATE_REGISTRY.modern;

  // Measure content height and calculate total A4 pages
  useEffect(() => {
    const calculatePages = () => {
      if (measureRef.current) {
        const heightPx = measureRef.current.scrollHeight;
        const A4_HEIGHT_PX = 1100;
        const computedPages = Math.max(1, Math.ceil(heightPx / A4_HEIGHT_PX));
        setTotalPages(computedPages);
      }
    };

    calculatePages();
    const timer = setTimeout(calculatePages, 200);
    return () => clearTimeout(timer);
  }, [activeResume, template, fontFamily, accentHex, style]);

  return (
    <div className={`flex-1 flex flex-col h-full bg-[var(--ox-bg)] overflow-hidden relative transition-colors duration-300 ${isDraggingLine ? 'select-none cursor-ns-resize' : ''}`}>
      {/* Top Toolbar (Non-printable) */}
      <div className="bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] px-4 py-2 flex items-center justify-between gap-3 text-xs z-10 flex-wrap no-print transition-colors duration-300">
        {/* Template Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--ox-text-muted)] font-medium flex items-center gap-1">
            <Layout className="w-3.5 h-3.5 text-orange-500" /> Template:
          </span>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="bg-[var(--ox-card-bg)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-orange-500 font-semibold max-w-xs truncate"
          >
            {TEMPLATE_CATEGORIES.map((cat) => (
              <optgroup key={cat.id} label={cat.categoryName}>
                {cat.templates.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.tag || 'Standard'})
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* Font Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-[var(--ox-text-muted)] font-medium flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-amber-500" /> Font:
          </span>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="bg-[var(--ox-card-bg)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-orange-500 font-semibold"
          >
            {fontOptions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Color Palette */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-orange-500 mr-1" />
          {colorOptions.map((c) => (
            <button
              key={c.id}
              onClick={() => setAccentColor(c.id)}
              style={{ backgroundColor: c.id }}
              className={`w-4 h-4 rounded-full transition-transform cursor-pointer ${
                accentHex === c.id ? 'scale-125 ring-2 ring-orange-500 ring-offset-2 ring-offset-[var(--ox-bg)]' : 'hover:scale-110'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Page 2 & Spacing Quick Control Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPageBreakMenuOpen(!isPageBreakMenuOpen)}
            className="px-2.5 py-1 rounded-lg bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] hover:border-orange-500/50 font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Fix Page Break & Section Spacing"
          >
            <Scissors className="w-3.5 h-3.5 text-orange-500" />
            <span>Page 2 Fix & Spacing</span>
          </button>

          {isPageBreakMenuOpen && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-[var(--ox-card-bg,#0B0D14)] border border-[var(--ox-border)] rounded-2xl shadow-2xl p-4 space-y-3 z-50 animate-fadeIn text-xs text-[var(--ox-text-primary)]">
              <div className="flex items-center justify-between border-b border-[var(--ox-border)] pb-2 font-bold">
                <span>Page Break & Spacing Fixer</span>
                <button onClick={() => setIsPageBreakMenuOpen(false)} className="text-[var(--ox-text-muted)] hover:text-white">✕</button>
              </div>

              {/* Quick Presets */}
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => { handleFitToOnePage(); setIsPageBreakMenuOpen(false); }}
                  className="py-1.5 px-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-500 font-bold text-[11px] hover:bg-orange-500/20 cursor-pointer"
                >
                  ⚡ Fit 1 Page
                </button>
                <button
                  onClick={() => { handlePushToPageTwo(); setIsPageBreakMenuOpen(false); }}
                  className="py-1.5 px-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[11px] hover:bg-amber-500/20 cursor-pointer"
                >
                  ✂️ Clean Page 2 Break
                </button>
              </div>

              {/* Section Spacing */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-[var(--ox-text-secondary)]">Section Spacing</label>
                <div className="grid grid-cols-3 gap-1">
                  {['compact', 'normal', 'spacious'].map((s) => (
                    <button
                      key={s}
                      onClick={() => updateStyle('sectionSpacing', s)}
                      className={`py-1 rounded-lg border text-[10px] font-bold capitalize cursor-pointer ${
                        sectionSpacing === s ? 'bg-orange-500 text-white border-orange-500' : 'bg-[var(--ox-surface-secondary)] border-[var(--ox-border)] text-[var(--ox-text-secondary)]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Page Break Line Shift Offset */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-[var(--ox-text-secondary)]">Page Line Shift Offset</span>
                  <span className="text-orange-500 font-mono font-bold">{pageBreakOffset}mm</span>
                </div>
                <div className="grid grid-cols-5 gap-1">
                  {[-20, -10, 0, 10, 20].map((off) => (
                    <button
                      key={off}
                      onClick={() => updateStyle('pageBreakOffset', off)}
                      className={`py-1 rounded-lg border text-center font-mono font-bold text-[10px] cursor-pointer ${
                        pageBreakOffset === off ? 'bg-orange-500 text-white border-orange-500' : 'bg-[var(--ox-surface-secondary)] border-[var(--ox-border)] text-[var(--ox-text-secondary)]'
                      }`}
                    >
                      {off > 0 ? `+${off}` : off}mm
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* View Mode Toggle (Multi-Page A4 Cards vs Continuous) */}
        <div className="flex items-center bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-lg p-0.5 text-[11px] font-semibold">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-2 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'cards' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)]'
            }`}
            title="View as Multi-Page A4 Cards"
          >
            <Layers className="w-3 h-3" />
            <span>A4 Cards ({totalPages})</span>
          </button>
          <button
            onClick={() => setViewMode('continuous')}
            className={`px-2 py-1 rounded-md flex items-center gap-1 transition-colors cursor-pointer ${
              viewMode === 'continuous' ? 'bg-orange-500/20 text-orange-500 border border-orange-500/30' : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)]'
            }`}
            title="Continuous Canvas with A4 Page Breaks"
          >
            <Scissors className="w-3 h-3" />
            <span>Guide Lines</span>
          </button>
        </div>

        {/* Customizer & Tools */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsThemeCustomizerOpen(true)}
            className="p-1.5 rounded-lg text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] cursor-pointer"
            title="Theme Customizer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-500" />
          </button>
          <button
            onClick={() => setIsAssetManagerOpen(true)}
            className="p-1.5 rounded-lg text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] cursor-pointer"
            title="Asset Manager"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-500" />
          </button>
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="p-1.5 rounded-lg text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] cursor-pointer"
            title="Resume Inspector"
          >
            <Activity className="w-3.5 h-3.5 text-orange-500" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-lg p-1">
          <button onClick={handleZoomOut} className="p-1 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] cursor-pointer" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-semibold text-[var(--ox-text-primary)] w-9 text-center">{zoomLevel}%</span>
          <button onClick={handleZoomIn} className="p-1 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] cursor-pointer" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-75 cursor-pointer"
        >
          <Download className={`w-3.5 h-3.5 stroke-[2.5] ${isDownloading ? 'animate-bounce' : ''}`} />
          <span>{isDownloading ? 'Downloading...' : 'Download PDF'}</span>
        </button>
      </div>

      {/* Off-screen Measurement Node (hidden) */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="fixed left-[-9999px] top-0 pointer-events-none opacity-0 z-[-100] no-print"
        style={{
          width: '210mm',
          padding: `${topPadMm}mm ${sidePadMm}mm`,
          fontFamily: `'${fontFamily}', sans-serif`
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

      {/* Screen Interactive Workspace Viewport (Non-printable) */}
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center bg-[var(--ox-surface-secondary)] transition-colors duration-300 custom-scrollbar no-print">
        {/* Document Page Status Pill */}
        <div className="mb-4 flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-slate-900/90 border border-slate-800 text-slate-300 shadow-md">
          {totalPages === 1 ? (
            <span className="flex items-center gap-1.5 text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" /> Single Page A4 Resume (100% Ideal)
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-amber-400">
              <AlertCircle className="w-3.5 h-3.5" /> {totalPages} Pages (A4 Multi-Page Layout Active)
            </span>
          )}
        </div>

        {/* View Mode A: Multi-Page A4 Sheet Cards */}
        {viewMode === 'cards' ? (
          <div
            className="flex flex-col items-center gap-8 transition-transform duration-200"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center'
            }}
          >
            {Array.from({ length: totalPages }).map((_, pageIdx) => {
              // Bottom padding addition when negative pageBreakOffset is active on Page 1
              const extraBottomPad = pageIdx === 0 && pageBreakOffset < 0 ? Math.abs(pageBreakOffset) : 0;
              const bottomPadMm = topPadMm + extraBottomPad;

              // Effective top offset for template viewport on Page 2+
              const effectiveTopOffsetMm = pageIdx === 0 ? 0 : -(pageIdx * 297 + pageBreakOffset);

              return (
                <div key={`a4-page-sheet-${pageIdx}`} className="flex flex-col items-center">
                  {/* Page Number Badge */}
                  <div className="w-[210mm] flex items-center justify-between text-[11px] font-bold text-slate-400 mb-1.5 px-1">
                    <span className="flex items-center gap-1 text-orange-400">
                      <FileText className="w-3.5 h-3.5" /> PAGE {pageIdx + 1} OF {totalPages}
                      {pageIdx > 0 && <span className="text-[10px] text-amber-400 ml-1">(Overflow)</span>}
                    </span>
                    <span className="text-slate-500 font-mono">210 × 297 mm (A4)</span>
                  </div>

                  {/* Physical A4 Paper Sheet Frame */}
                  <div
                    className="a4-paper-container shadow-2xl rounded-sm overflow-hidden relative border border-slate-300/10"
                    style={{
                      width: '210mm',
                      height: '297mm',
                      backgroundColor: paperBgColor,
                      fontFamily: `'${fontFamily}', sans-serif`
                    }}
                  >
                    {/* Active Printable Viewport Frame (Clips Page 1 cleanly at break line leaving bottom space blank) */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '210mm',
                        height: pageIdx === 0 ? `${297 + Math.min(0, pageBreakOffset)}mm` : '297mm',
                        overflow: 'hidden'
                      }}
                    >
                      {/* Clipped Offset View of Resume Template */}
                      <div
                        style={{
                          position: 'absolute',
                          top: `${effectiveTopOffsetMm}mm`,
                          left: 0,
                          width: '210mm',
                          paddingTop: `${topPadMm}mm`,
                          paddingLeft: `${sidePadMm}mm`,
                          paddingRight: `${sidePadMm}mm`,
                          paddingBottom: `${topPadMm}mm`
                        }}
                      >
                        <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading Template Engine...</div>}>
                          <SelectedTemplateComponent
                            resumeData={activeResume}
                            accentHex={accentHex}
                            fontFamily={fontFamily}
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

                  {/* Section-Aware A4 Page Cutoff Marker with Mouse Drag Handle */}
                  {pageIdx < totalPages - 1 && (
                    <div className="w-[210mm] mt-2 flex items-center justify-between gap-2 bg-orange-500/10 border border-dashed border-orange-500/40 p-2.5 rounded-xl text-xs">
                      <span className="text-[11px] font-bold text-orange-400 flex items-center gap-1.5">
                        <Scissors className="w-3.5 h-3.5" /> A4 PAGE BREAK AT {297 + pageBreakOffset}mm (Page {pageIdx + 1})
                      </span>
                      <div className="flex items-center gap-2">
                        {/* Mouse Drag Handle Button */}
                        <div
                          onMouseDown={handleLineDragStart}
                          className="bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-[10px] px-3 py-1 rounded-lg shadow-md flex items-center gap-1.5 cursor-ns-resize select-none active:scale-95 transition-all"
                          title="Click & Drag vertically (↕) to shift Page Break position"
                        >
                          <ArrowUpDown className="w-3.5 h-3.5" />
                          <span>DRAG LINE ↕ ({pageBreakOffset > 0 ? `+${pageBreakOffset}` : pageBreakOffset}mm)</span>
                        </div>
                        <button
                          onClick={handleFitToOnePage}
                          className="px-2.5 py-1 rounded-lg bg-orange-500 text-white font-extrabold text-[10px] shadow-sm hover:bg-orange-600 cursor-pointer"
                        >
                          ⚡ Fit 1 Page
                        </button>
                        <button
                          onClick={handlePushToPageTwo}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-amber-300 font-extrabold text-[10px] border border-amber-500/40 hover:bg-slate-800 cursor-pointer"
                        >
                          ⬇️ Push to Page 2
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          /* View Mode B: Continuous Canvas with Glowing Interactive & Mouse-Draggable Page Break Guide Lines */
          <div
            className="transition-transform duration-200 flex flex-col items-center"
            style={{
              transform: `scale(${zoomLevel / 100})`,
              transformOrigin: 'top center'
            }}
          >
            <div
              className="a4-paper-container shadow-2xl rounded-sm p-10 relative"
              style={{
                backgroundColor: paperBgColor,
                fontFamily: `'${fontFamily}', sans-serif`,
                paddingTop: `${topPadMm}mm`,
                paddingLeft: `${sidePadMm}mm`,
                paddingRight: `${sidePadMm}mm`,
                paddingBottom: pageBreakOffset < 0 ? `${topPadMm + Math.abs(pageBreakOffset)}mm` : `${topPadMm}mm`
              }}
            >
              {/* Dynamic Page Break Indicators with Interactive Actions & Mouse Dragging */}
              {Array.from({ length: totalPages - 1 }).map((_, breakIdx) => {
                const lineTopMm = (breakIdx + 1) * 297 + pageBreakOffset;
                return (
                  <div
                    key={`page-break-line-${breakIdx}`}
                    className="absolute left-0 right-0 flex items-center justify-center z-30 group"
                    style={{ top: `${lineTopMm}mm` }}
                  >
                    <div
                      onMouseDown={handleLineDragStart}
                      className="w-full border-t-2 border-dashed border-orange-500 hover:border-orange-400 cursor-ns-resize shadow-md transition-colors"
                    />
                    <div
                      onMouseDown={handleLineDragStart}
                      className="absolute bg-orange-600 hover:bg-orange-500 text-white font-black text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-2xl border-2 border-amber-300 flex items-center gap-2 cursor-ns-resize select-none pointer-events-auto active:scale-105 transition-all"
                      title="Click & Drag vertically (↕) to adjust Page Break position"
                    >
                      <ArrowUpDown className="w-3.5 h-3.5" />
                      <span>DRAG LINE ↕ ({lineTopMm}mm)</span>
                      <span className="bg-black/60 px-1.5 py-0.5 rounded text-[9px] text-amber-300 font-mono font-bold">
                        {pageBreakOffset > 0 ? `+${pageBreakOffset}` : pageBreakOffset}mm
                      </span>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleFitToOnePage(); }}
                        className="bg-black text-orange-300 px-2 py-0.5 rounded-full hover:bg-slate-900 text-[9px] cursor-pointer"
                      >
                        ⚡ Fit 1 Page
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handlePushToPageTwo(); }}
                        className="bg-black text-amber-300 px-2 py-0.5 rounded-full hover:bg-slate-900 text-[9px] cursor-pointer"
                      >
                        ⬇️ Push to Page 2
                      </button>
                    </div>
                  </div>
                );
              })}

              <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400 animate-pulse">Loading Template Engine...</div>}>
                <SelectedTemplateComponent
                  resumeData={activeResume}
                  accentHex={accentHex}
                  fontFamily={fontFamily}
                />
              </Suspense>

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
            </div>
          </div>
        )}
      </div>

      {/* PRINT-ONLY RESUME CONTAINER (Active ONLY during window.print()) */}
      <div id="resume-a4-preview" className="printable-resume-page hidden print:block">
        <Suspense fallback={null}>
          <SelectedTemplateComponent
            resumeData={activeResume}
            accentHex={accentHex}
            fontFamily={fontFamily}
          />
        </Suspense>

        {assets?.digitalSignature && (
          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-end break-inside-avoid">
            <div className="text-center">
              <img src={assets.digitalSignature} alt="Digital Signature" className="h-10 object-contain mx-auto" />
              <div className="text-[10px] text-slate-500 font-semibold pt-1">Signed via OpportunityX Engine</div>
            </div>
          </div>
        )}

        <div className="mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400 break-inside-avoid">
          <span>OpportunityX Resume Engine</span>
          <span>resume.opportunityx.co.in</span>
        </div>
      </div>
    </div>
  );
};
