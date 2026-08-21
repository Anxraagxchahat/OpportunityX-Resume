import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Layout,
  Type,
  Palette,
  Sliders,
  Check,
  Scissors,
  Zap
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { TEMPLATE_REGISTRY, getTemplateCapabilities } from '../../templates';
import { RealTemplateThumbnail } from '../template/RealTemplateThumbnail';
import { fontOptions, colorOptions } from '../A4ResumePreview';

const TABS = [
  { id: 'template', label: 'Template', icon: Layout },
  { id: 'font', label: 'Font', icon: Type },
  { id: 'color', label: 'Color', icon: Palette },
  { id: 'spacing', label: 'Spacing', icon: Sliders }
];

// ─── Template Tab ────────────────────────────────────────────
const TemplateTab = () => {
  const { activeResume, setTemplate } = useResume();
  const currentTemplate = activeResume?.metadata?.template || 'modern';
  const scrollRef = useRef(null);

  const templatesList = Object.keys(TEMPLATE_REGISTRY).map((id) => getTemplateCapabilities(id));

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-[var(--ox-text-secondary)] px-1">
        Tap a template to apply it instantly. Your content reformats automatically.
      </p>
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-3 px-1 snap-x snap-mandatory scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {templatesList.map((tpl) => {
          const isActive = currentTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              onClick={() => setTemplate(tpl.id)}
              className={`flex-shrink-0 w-[130px] rounded-2xl border-2 overflow-hidden transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'border-orange-500 shadow-[0_0_16px_rgba(249,115,22,0.25)]'
                  : 'border-[var(--ox-border)] hover:border-slate-600'
              }`}
            >
              <div className="w-full aspect-[1/1.35] bg-white relative">
                <RealTemplateThumbnail template={tpl} type="thumbnail" />
                {isActive && (
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center shadow-md">
                    <Check className="w-3 h-3 text-white stroke-[3]" />
                  </div>
                )}
              </div>
              <div className="px-2 py-2 bg-[var(--ox-surface-primary)]">
                <p className={`text-[10px] font-bold truncate ${isActive ? 'text-orange-400' : 'text-[var(--ox-text-primary)]'}`}>
                  {tpl.name}
                </p>
                <p className="text-[9px] text-[var(--ox-text-muted)] truncate">{tpl.category || 'ATS Ready'}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Font Tab ────────────────────────────────────────────────
const FontTab = () => {
  const { activeResume, setFontFamily } = useResume();
  const currentFont = activeResume?.metadata?.fontFamily || activeResume?.metadata?.font || 'Inter';

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-[var(--ox-text-secondary)] px-1">
        Choose a professional typeface for your resume.
      </p>
      <div className="grid grid-cols-3 gap-2">
        {fontOptions.map((f) => {
          const isActive = currentFont === f.id;
          return (
            <button
              key={f.id}
              onClick={() => setFontFamily(f.id)}
              className={`px-3 py-3 rounded-xl border-2 text-center transition-all active:scale-95 cursor-pointer ${
                isActive
                  ? 'border-orange-500 bg-orange-500/10 text-orange-400 shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                  : 'border-[var(--ox-border)] bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] hover:border-slate-600'
              }`}
            >
              <span
                className="text-xs font-bold block truncate"
                style={{ fontFamily: `'${f.id}', sans-serif` }}
              >
                {f.name}
              </span>
              <span
                className="text-[9px] text-[var(--ox-text-muted)] mt-0.5 block"
                style={{ fontFamily: `'${f.id}', sans-serif` }}
              >
                Aa Bb Cc
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Color Tab ───────────────────────────────────────────────
const ColorTab = () => {
  const { activeResume, setAccentColor } = useResume();
  const currentColor = activeResume?.metadata?.accentColor || '#F97316';

  return (
    <div className="space-y-3">
      <p className="text-[11px] text-[var(--ox-text-secondary)] px-1">
        Set your resume accent color. This applies to headings, borders, and highlights.
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap py-2">
        {colorOptions.map((c) => {
          const isActive = currentColor === c.id;
          return (
            <button
              key={c.id}
              onClick={() => setAccentColor(c.id)}
              className="flex flex-col items-center gap-1.5 cursor-pointer group active:scale-90 transition-transform"
            >
              <div
                className={`w-10 h-10 rounded-full transition-all ${
                  isActive
                    ? 'ring-[3px] ring-orange-500 ring-offset-2 ring-offset-[var(--ox-surface-primary)] scale-110 shadow-lg'
                    : 'group-hover:scale-105'
                }`}
                style={{ backgroundColor: c.id }}
              />
              <span className={`text-[9px] font-semibold ${isActive ? 'text-orange-400' : 'text-[var(--ox-text-muted)]'}`}>
                {c.name.split(' ').pop()}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ─── Spacing Tab ─────────────────────────────────────────────
const SpacingTab = () => {
  const { activeResume, updateStyle } = useResume();
  const style = activeResume?.style || {};

  const sectionSpacing = style.sectionSpacing || 'normal';
  const lineSpacing = style.lineSpacing || 'normal';
  const pageBreakOffset = Number(style.pageBreakOffset) || 0;
  const page2TopMargin = Number(style.page2TopMargin) ?? 10;

  const handleFitOnePage = () => {
    updateStyle('pageMargin', 'compact');
    updateStyle('sectionSpacing', 'compact');
    updateStyle('lineSpacing', 'compact');
    updateStyle('pageBreakOffset', 0);
  };

  return (
    <div className="space-y-4">
      {/* Quick Preset */}
      <button
        onClick={handleFitOnePage}
        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/40 text-orange-400 font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
      >
        <Zap className="w-3.5 h-3.5" />
        <span>Fit Everything on 1 Page</span>
      </button>

      {/* Section Spacing */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-[var(--ox-text-secondary)] flex items-center gap-1.5">
          <Sliders className="w-3 h-3 text-orange-500" /> Section Spacing
        </label>
        <div className="grid grid-cols-3 gap-1.5 bg-[var(--ox-surface-secondary)] p-1 rounded-xl border border-[var(--ox-border)]">
          {['compact', 'normal', 'spacious'].map((s) => (
            <button
              key={s}
              onClick={() => updateStyle('sectionSpacing', s)}
              className={`py-2 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                sectionSpacing === s
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-primary)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Line Spacing */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-[var(--ox-text-secondary)]">Line Spacing</label>
        <div className="grid grid-cols-3 gap-1.5 bg-[var(--ox-surface-secondary)] p-1 rounded-xl border border-[var(--ox-border)]">
          {['compact', 'normal', 'spacious'].map((s) => (
            <button
              key={s}
              onClick={() => updateStyle('lineSpacing', s)}
              className={`py-2 rounded-lg text-[11px] font-bold capitalize transition-all cursor-pointer ${
                lineSpacing === s
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-primary)]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Page Break Offset */}
      <div className="space-y-2 pt-1 border-t border-[var(--ox-border)]">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-[var(--ox-text-secondary)] flex items-center gap-1.5">
            <Scissors className="w-3 h-3 text-orange-500" /> Page Cutoff Shift
          </label>
          <div className="flex items-center gap-1.5">
            <span className="text-orange-400 font-mono font-bold text-[10px] bg-orange-500/10 px-2 py-0.5 rounded-md border border-orange-500/20">
              {pageBreakOffset > 0 ? `+${pageBreakOffset}` : pageBreakOffset}mm
            </span>
            {pageBreakOffset !== 0 && (
              <button
                onClick={() => updateStyle('pageBreakOffset', 0)}
                className="text-[10px] text-[var(--ox-text-muted)] hover:text-orange-400 underline cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>
        <input
          type="range"
          min="-140"
          max="50"
          value={pageBreakOffset}
          onChange={(e) => updateStyle('pageBreakOffset', Number(e.target.value))}
          className="w-full accent-orange-500 cursor-pointer h-1.5 bg-[var(--ox-surface-secondary)] rounded-lg"
        />
      </div>

      {/* Page 2 Top Margin */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-[11px] font-semibold text-[var(--ox-text-secondary)]">Page 2 Top Margin</label>
          <span className="text-amber-400 font-mono font-bold text-[10px] bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
            {page2TopMargin}mm
          </span>
        </div>
        <input
          type="range"
          min="0"
          max="40"
          value={page2TopMargin}
          onChange={(e) => updateStyle('page2TopMargin', Number(e.target.value))}
          className="w-full accent-amber-500 cursor-pointer h-1.5 bg-[var(--ox-surface-secondary)] rounded-lg"
        />
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════
//  BOTTOM SHEET CONTAINER
// ═══════════════════════════════════════════════════════════════
export const MobilePreviewBottomSheet = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('template');
  const sheetRef = useRef(null);
  const dragStartY = useRef(0);
  const currentTranslateY = useRef(0);
  const isDragging = useRef(false);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Touch drag-to-dismiss
  const handleTouchStart = (e) => {
    if (e.target.closest('.sheet-scrollable')) return;
    dragStartY.current = e.touches[0].clientY;
    currentTranslateY.current = 0;
    isDragging.current = true;
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const deltaY = e.touches[0].clientY - dragStartY.current;
    if (deltaY > 0) {
      currentTranslateY.current = deltaY;
      if (sheetRef.current) {
        sheetRef.current.style.transform = `translateY(${deltaY}px)`;
        sheetRef.current.style.transition = 'none';
      }
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    if (currentTranslateY.current > 100) {
      onClose();
    }
    if (sheetRef.current) {
      sheetRef.current.style.transform = '';
      sheetRef.current.style.transition = '';
    }
    currentTranslateY.current = 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn"
        onClick={onClose}
      />

      {/* Sheet */}
      <div
        ref={sheetRef}
        className="relative bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] rounded-t-3xl shadow-[0_-8px_40px_rgba(0,0,0,0.4)] max-h-[65dvh] flex flex-col"
        style={{
          animation: 'slideUpSheet 0.35s cubic-bezier(0.32, 0.72, 0, 1) forwards'
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2 cursor-grab">
          <div className="w-10 h-1 rounded-full bg-[var(--ox-text-muted)]/40" />
        </div>

        {/* Tab Bar */}
        <div className="flex items-center gap-1 px-4 pb-3 border-b border-[var(--ox-border)]">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30'
                    : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] border border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-4 sheet-scrollable custom-scrollbar">
          {activeTab === 'template' && <TemplateTab />}
          {activeTab === 'font' && <FontTab />}
          {activeTab === 'color' && <ColorTab />}
          {activeTab === 'spacing' && <SpacingTab />}
        </div>

        {/* Close Button */}
        <div className="px-4 py-3 border-t border-[var(--ox-border)]">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-all cursor-pointer"
          >
            <X className="w-4 h-4" />
            Done
          </button>
        </div>
      </div>

      {/* Sheet Animation Keyframe */}
      <style>{`
        @keyframes slideUpSheet {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default MobilePreviewBottomSheet;
