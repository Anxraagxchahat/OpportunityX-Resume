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
  AlertCircle
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

  const measureRef = useRef(null);

  const { personal, experience, education, projects, skills, certificates, achievements, languages, customSections, metadata, assets, style } = activeResume;
  const accentHex = metadata?.accentColor || '#F97316';
  const fontFamily = metadata?.fontFamily || 'Inter';
  const template = metadata?.template || 'modern';

  const paperBg = style?.paperBackground || 'white';
  const paperBgColor = paperBg === 'warm' ? '#fdfbf7' : paperBg === 'light-gray' ? '#f8fafc' : paperBg === 'minimal-accent' ? '#f0fdf4' : '#ffffff';

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 10, 130));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 10, 50));

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
        // Standard A4 page height at 96 DPI is approx 1122.5px (297mm)
        // Subtract 40px for margin tolerances
        const A4_HEIGHT_PX = 1100;
        const computedPages = Math.max(1, Math.ceil(heightPx / A4_HEIGHT_PX));
        setTotalPages(computedPages);
      }
    };

    calculatePages();
    const timer = setTimeout(calculatePages, 200);
    return () => clearTimeout(timer);
  }, [activeResume, template, fontFamily, accentHex]);

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07090F] overflow-hidden relative">
      {/* Top Toolbar (Non-printable) */}
      <div className="bg-[#0B0D14] border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-3 text-xs z-10 flex-wrap no-print">
        {/* Template Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Layout className="w-3.5 h-3.5 text-orange-400" /> Template:
          </span>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-orange-500 font-semibold max-w-xs truncate"
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
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-amber-400" /> Font:
          </span>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-orange-500 font-semibold"
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
          <Palette className="w-3.5 h-3.5 text-orange-400 mr-1" />
          {colorOptions.map((c) => (
            <button
              key={c.id}
              onClick={() => setAccentColor(c.id)}
              style={{ backgroundColor: c.id }}
              className={`w-4 h-4 rounded-full transition-transform ${
                accentHex === c.id ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0B0D14]' : 'hover:scale-110'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* View Mode Toggle (Multi-Page A4 Cards vs Continuous) */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px] font-semibold">
          <button
            onClick={() => setViewMode('cards')}
            className={`px-2 py-1 rounded-md flex items-center gap-1 transition-colors ${
              viewMode === 'cards' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-400 hover:text-slate-200'
            }`}
            title="View as Multi-Page A4 Cards"
          >
            <Layers className="w-3 h-3" />
            <span>A4 Cards ({totalPages})</span>
          </button>
          <button
            onClick={() => setViewMode('continuous')}
            className={`px-2 py-1 rounded-md flex items-center gap-1 transition-colors ${
              viewMode === 'continuous' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30' : 'text-slate-400 hover:text-slate-200'
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
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            title="Theme Customizer"
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
          </button>
          <button
            onClick={() => setIsAssetManagerOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            title="Asset Manager"
          >
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
          </button>
          <button
            onClick={() => setIsInspectorOpen(true)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800"
            title="Resume Inspector"
          >
            <Activity className="w-3.5 h-3.5 text-orange-400" />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button onClick={handleZoomOut} className="p-1 text-slate-400 hover:text-white" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-semibold text-slate-300 w-9 text-center">{zoomLevel}%</span>
          <button onClick={handleZoomIn} className="p-1 text-slate-400 hover:text-white" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Download PDF Button */}
        <button
          onClick={handleDownloadPDF}
          disabled={isDownloading}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all active:scale-95 disabled:opacity-75 cursor-pointer"
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
          padding: '10mm 12mm',
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
      <div className="flex-1 overflow-auto p-6 flex flex-col items-center bg-[#07090F] custom-scrollbar no-print">
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
            {Array.from({ length: totalPages }).map((_, pageIdx) => (
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
                  {/* Clipped Offset View of Resume Template */}
                  <div
                    style={{
                      position: 'absolute',
                      top: `-${pageIdx * 297}mm`,
                      left: 0,
                      width: '210mm',
                      padding: '10mm 12mm'
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
            ))}
          </div>
        ) : (
          /* View Mode B: Continuous Canvas with Glowing Page Break Guide Lines */
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
                fontFamily: `'${fontFamily}', sans-serif`
              }}
            >
              {/* Dynamic Page Break Indicators */}
              {Array.from({ length: totalPages - 1 }).map((_, breakIdx) => (
                <div
                  key={`page-break-line-${breakIdx}`}
                  className="absolute left-0 right-0 pointer-events-none flex items-center justify-center z-20"
                  style={{ top: `${(breakIdx + 1) * 297}mm` }}
                >
                  <div className="w-full border-t-2 border-dashed border-orange-500/70 shadow-sm" />
                  <div className="absolute bg-orange-600 text-black font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-full shadow-xl border border-amber-300 flex items-center gap-1.5">
                    <Scissors className="w-3.5 h-3.5" />
                    <span>A4 PAGE BREAK • END OF PAGE {breakIdx + 1} ({297 * (breakIdx + 1)}mm)</span>
                  </div>
                </div>
              ))}

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
