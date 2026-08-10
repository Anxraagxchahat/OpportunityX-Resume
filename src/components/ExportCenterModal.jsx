import React, { useState } from 'react';
import { X, Download, FileText, Printer, Copy, ShieldCheck, FileCheck, Sparkles, Layers } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { downloadDirectPDF } from '../utils/pdfDownloader';

export const exportPresetsList = [
  { id: 'Corporate', label: 'Corporate & Tech', desc: 'Standard A4 PDF with normal margins & clean JSON export' },
  { id: 'Campus', label: 'Campus Placement', desc: 'Optimized for high-density academic & project layout' },
  { id: 'Internship', label: 'Internship Application', desc: 'Highlights coursework & project sections' },
  { id: 'International', label: 'International Applicant', desc: 'Minimalist layout with global contact formatting' }
];

export const ExportCenterModal = () => {
  const {
    isExportCenterOpen,
    setIsExportCenterOpen,
    activeResume,
    exportActiveResumeJSON,
    duplicateResume,
    activeResumeId,
    updateUserPreferences,
    setIsDonationModalOpen
  } = useResume();

  const [selectedPreset, setSelectedPreset] = useState('Corporate');

  if (!isExportCenterOpen) return null;

  const handleDownloadPDF = async () => {
    setIsExportCenterOpen(false);
    const candidateName = activeResume?.personal?.fullName || 'OpportunityX';

    // Direct Client PDF Download (No print window)
    await downloadDirectPDF('resume-a4-preview', candidateName);

    // Trigger Post-Download Support & Donation Pop-up
    setTimeout(() => {
      setIsDonationModalOpen(true);
    }, 400);
  };

  const handleExportCleanJSON = () => {
    exportActiveResumeJSON(true);
    setIsExportCenterOpen(false);
  };

  const handleExportFullJSON = () => {
    exportActiveResumeJSON(false);
    setIsExportCenterOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print select-none">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-t-3xl sm:rounded-2xl w-full max-w-lg shadow-2xl p-5 sm:p-6 space-y-5 relative max-h-[90dvh] overflow-y-auto pb-safe">

        <button
          onClick={() => setIsExportCenterOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Download className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Export & Download Center</h3>
            <p className="text-xs text-slate-400">Export high-resolution PDF or standard JSON schemas</p>
          </div>
        </div>

        {/* Export Presets Selection */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300">Target Export Preset</div>
          <div className="grid grid-cols-2 gap-2">
            {exportPresetsList.map((preset) => (
              <button
                key={preset.id}
                onClick={() => {
                  setSelectedPreset(preset.id);
                  updateUserPreferences({ exportPreset: preset.id });
                }}
                className={`p-2.5 rounded-xl text-left border transition-all ${
                  selectedPreset === preset.id
                    ? 'bg-orange-500/10 border-orange-500/40 text-white'
                    : 'bg-[#10131D] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-bold">{preset.label}</div>
                <div className="text-[10px] text-slate-500 truncate">{preset.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Primary Export Actions */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <button
            onClick={handleDownloadPDF}
            className="w-full p-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs flex items-center justify-between shadow-lg transition-all"
          >
            <span className="flex items-center gap-2">
              <Download className="w-4 h-4 stroke-[2.5]" /> Download A4 PDF
            </span>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-black/20 text-black">High Res</span>
          </button>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportCleanJSON}
              className="p-2.5 rounded-xl bg-[#10131D] hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
            >
              <FileText className="w-4 h-4 text-amber-400" />
              <span>Export Clean JSON</span>
            </button>

            <button
              onClick={handleExportFullJSON}
              className="p-2.5 rounded-xl bg-[#10131D] hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200 flex items-center gap-2 transition-colors"
            >
              <FileCheck className="w-4 h-4 text-emerald-400" />
              <span>Export Ecosystem JSON</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                duplicateResume(activeResumeId);
                setIsExportCenterOpen(false);
              }}
              className="p-2.5 rounded-xl bg-[#10131D] hover:bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center gap-2 transition-colors"
            >
              <Copy className="w-4 h-4 text-slate-400" />
              <span>Duplicate Draft</span>
            </button>

            <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs font-medium text-slate-500 flex items-center justify-between opacity-60">
              <span className="flex items-center gap-2">
                <FileText className="w-4 h-4" /> DOCX Export
              </span>
              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-slate-800">Phase 3</span>
            </div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>100% Free Forever • Zero Watermark Downloads</span>
        </div>
      </div>
    </div>
  );
};
