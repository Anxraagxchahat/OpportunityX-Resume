import React from 'react';
import { X, Palette, Type, Layout, Sliders, Check } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const paperBackgroundsList = [
  { id: 'white', label: 'Plain White', hex: '#ffffff', desc: 'Standard 100% ATS Safe' },
  { id: 'warm', label: 'Warm Paper', hex: '#fdfbf7', desc: 'Subtle ivory tone' },
  { id: 'light-gray', label: 'Light Gray', hex: '#f8fafc', desc: 'Clean modern slate tint' },
  { id: 'minimal-accent', label: 'Minimal Tint', hex: '#f0fdf4', desc: 'Soft accent background' }
];

export const headerStylesList = [
  { id: 'modern', label: 'Modern Left' },
  { id: 'centered', label: 'Centered Executive' },
  { id: 'classic', label: 'Classic Rules' }
];

export const dividerStylesList = [
  { id: 'solid', label: 'Solid Line' },
  { id: 'double', label: 'Double Rule' },
  { id: 'dotted', label: 'Dotted Line' },
  { id: 'minimal', label: 'Minimal Border' }
];

export const ThemeCustomizerModal = () => {
  const {
    isThemeCustomizerOpen,
    setIsThemeCustomizerOpen,
    activeResume,
    updateStyle,
    setAccentColor,
    setFontFamily
  } = useResume();

  if (!isThemeCustomizerOpen) return null;

  const style = activeResume.style || {
    headerStyle: 'modern',
    dividerStyle: 'solid',
    pageMargin: 'normal',
    lineSpacing: 'normal',
    sectionSpacing: 'normal',
    paperBackground: 'white'
  };

  const metadata = activeResume.metadata || {};
  const accentHex = metadata.accentColor || '#F97316';
  const fontFamily = metadata.fontFamily || 'Inter';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={() => setIsThemeCustomizerOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Theme & ATS Background Customizer</h3>
            <p className="text-xs text-slate-400">Customize styling without modifying resume data</p>
          </div>
        </div>

        {/* 1. Paper Background */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300">ATS-Safe Paper Background</div>
          <div className="grid grid-cols-2 gap-2">
            {paperBackgroundsList.map((bg) => {
              const isSel = style.paperBackground === bg.id;
              return (
                <button
                  key={bg.id}
                  onClick={() => updateStyle('paperBackground', bg.id)}
                  className={`p-2.5 rounded-xl text-left border flex items-center gap-2.5 transition-all ${
                    isSel ? 'bg-orange-500/10 border-orange-500/50 text-white' : 'bg-[#10131D] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="w-5 h-5 rounded-full border border-slate-400/30 flex-shrink-0" style={{ backgroundColor: bg.hex }} />
                  <div>
                    <div className="text-xs font-bold">{bg.label}</div>
                    <div className="text-[10px] text-slate-500">{bg.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Header Style */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300">Header Layout Style</div>
          <div className="grid grid-cols-3 gap-2">
            {headerStylesList.map((h) => {
              const isSel = (style.headerStyle || 'modern') === h.id;
              return (
                <button
                  key={h.id}
                  onClick={() => updateStyle('headerStyle', h.id)}
                  className={`p-2 rounded-xl text-center text-xs font-semibold border transition-all ${
                    isSel ? 'bg-orange-500/10 text-orange-300 border-orange-500/40' : 'bg-[#10131D] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {h.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Section Divider Style */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300">Section Divider Style</div>
          <div className="grid grid-cols-2 gap-2">
            {dividerStylesList.map((d) => {
              const isSel = (style.dividerStyle || 'solid') === d.id;
              return (
                <button
                  key={d.id}
                  onClick={() => updateStyle('dividerStyle', d.id)}
                  className={`p-2 rounded-xl text-xs font-semibold border transition-all ${
                    isSel ? 'bg-orange-500/10 text-orange-300 border-orange-500/40' : 'bg-[#10131D] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Section Spacing & Page Break Fixer */}
        <div className="space-y-3 pt-2 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300">Page Break & Section Spacing</span>
            <span className="text-[10px] text-amber-400 font-semibold">Fix 2nd Page & Cutoffs</span>
          </div>

          {/* Quick Preset Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                updateStyle('pageMargin', 'compact');
                updateStyle('sectionSpacing', 'compact');
                updateStyle('lineSpacing', 'compact');
                updateStyle('pageBreakOffset', 0);
              }}
              className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/40 text-orange-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-orange-500/20 transition-all cursor-pointer"
            >
              ⚡ Fit Everything on 1 Page
            </button>
            <button
              onClick={() => {
                updateStyle('sectionSpacing', 'spacious');
                updateStyle('pageMargin', 'spacious');
                updateStyle('pageBreakOffset', -15);
              }}
              className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-amber-500/20 transition-all cursor-pointer"
            >
              ✂️ Push Cutoff to Page 2
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Page Margins</label>
              <select
                value={style.pageMargin || 'normal'}
                onChange={(e) => updateStyle('pageMargin', e.target.value)}
                className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="compact">Compact (Tight)</option>
                <option value="normal">Normal (Standard)</option>
                <option value="spacious">Spacious (Generous)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Section Gap</label>
              <select
                value={style.sectionSpacing || 'normal'}
                onChange={(e) => updateStyle('sectionSpacing', e.target.value)}
                className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="spacious">Spacious</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Line Spacing</label>
              <select
                value={style.lineSpacing || 'normal'}
                onChange={(e) => updateStyle('lineSpacing', e.target.value)}
                className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-white"
              >
                <option value="compact">Compact</option>
                <option value="normal">Normal</option>
                <option value="relaxed">Relaxed</option>
              </select>
            </div>
          </div>

          {/* Manual Page Break Offset */}
          <div className="space-y-1 pt-1">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-400">Page Break Line Shift Offset</span>
              <span className="text-orange-400 font-mono font-bold">{style.pageBreakOffset || 0}mm</span>
            </div>
            <div className="grid grid-cols-5 gap-1 text-[11px]">
              {[-20, -10, 0, 10, 20].map((offset) => {
                const isSel = (Number(style.pageBreakOffset) || 0) === offset;
                return (
                  <button
                    key={offset}
                    onClick={() => updateStyle('pageBreakOffset', offset)}
                    className={`py-1 rounded-lg border text-center font-mono font-bold transition-all cursor-pointer ${
                      isSel ? 'bg-orange-500 text-white border-orange-500' : 'bg-[#10131D] text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    {offset > 0 ? `+${offset}` : offset}mm
                  </button>
                );
              })}
            </div>
          </div>

          {/* Page 2 Header & Top Push Spacing Controls */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300">Page 2 Header & Top Spacing</span>
              <button
                onClick={() => updateStyle('showPage2Header', style.showPage2Header === false ? true : false)}
                className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                  style.showPage2Header !== false ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                }`}
              >
                Page 2 Header: {style.showPage2Header !== false ? 'ON ✓' : 'OFF ✕'}
              </button>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-slate-400 font-medium">Page 2 Top Push Spacing (Text Offset)</span>
                <span className="text-amber-400 font-mono font-bold">{style.page2TopMargin || 10}mm</span>
              </div>
              <div className="grid grid-cols-6 gap-1 text-[10px]">
                {[0, 5, 10, 15, 20, 25].map((m) => {
                  const isSel = (Number(style.page2TopMargin) ?? 10) === m;
                  return (
                    <button
                      key={m}
                      onClick={() => updateStyle('page2TopMargin', m)}
                      className={`py-1 rounded-lg border text-center font-mono font-bold transition-all cursor-pointer ${
                        isSel ? 'bg-amber-500 text-black border-amber-500' : 'bg-[#10131D] text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {m}mm
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsThemeCustomizerOpen(false)}
            className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl cursor-pointer"
          >
            Apply Styling
          </button>
        </div>
      </div>
    </div>
  );
};
