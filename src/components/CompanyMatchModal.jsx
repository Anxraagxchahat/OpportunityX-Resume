import React from 'react';
import { X, Building2, Lock, Sparkles, Check } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const companyProfilesList = [
  { name: 'Google Match', tag: 'Big Tech', desc: 'Evaluates system architecture, scale metrics, and algorithmic rigor.' },
  { name: 'Microsoft Match', tag: 'Enterprise', desc: 'Focuses on enterprise cloud, Azure, and C#/TypeScript stack.' },
  { name: 'Amazon Match', tag: 'Leadership', desc: 'Evaluates 16 Leadership Principles & high-concurrency AWS metrics.' },
  { name: 'Y-Combinator Startup Match', tag: 'Startup', desc: 'Prioritizes full stack velocity, product ownership, and zero-to-one build experience.' }
];

export const CompanyMatchModal = () => {
  const { isCompanyMatchOpen, setIsCompanyMatchOpen } = useResume();

  if (!isCompanyMatchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-4 sm:p-6 space-y-4 sm:space-y-5 relative max-h-[92vh] overflow-y-auto custom-scrollbar box-border min-w-0">
        <button
          onClick={() => setIsCompanyMatchOpen(false)}
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
          aria-label="Close Company Match Modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 pr-8 min-w-0">
          <div className="p-2 sm:p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm sm:text-base font-extrabold text-white break-words">Target Company-Specific Scoring</h3>
            <p className="text-xs text-slate-400 mt-0.5 break-words">Target score matching against top tech engineering benchmarks</p>
          </div>
        </div>

        <div className="space-y-2.5 w-full min-w-0">
          {companyProfilesList.map((company) => (
            <div key={company.name} className="p-3 sm:p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1 relative min-w-0 w-full box-border">
              <div className="flex items-center justify-between gap-2">
                <div className="text-xs font-bold text-white flex items-center gap-2 min-w-0 flex-1">
                  <span className="truncate">{company.name}</span>
                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 shrink-0">
                    {company.tag}
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/30 flex items-center gap-1 shrink-0 whitespace-nowrap">
                  <Lock className="w-3 h-3" /> Phase 4
                </span>
              </div>
              <p className="text-[11px] text-slate-400 break-words leading-relaxed">{company.desc}</p>
            </div>
          ))}
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsCompanyMatchOpen(false)}
            className="w-full sm:w-auto min-h-[44px] px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl cursor-pointer active:scale-95"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyMatchModal;
