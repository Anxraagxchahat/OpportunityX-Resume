import React from 'react';
import { X, Activity, FileText, Hash, Clock, ShieldCheck, Cpu, Database, Eye } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ResumeInspector = () => {
  const { isInspectorOpen, setIsInspectorOpen, activeResume, resumeHealth } = useResume();

  if (!isInspectorOpen) return null;

  // Calculate metrics dynamically
  const jsonStr = JSON.stringify(activeResume);
  const totalChars = jsonStr.length;
  
  // Text word count from summary, bullets, education, projects
  let words = 0;
  const extractWords = (obj) => {
    if (typeof obj === 'string') {
      words += obj.trim().split(/\s+/).filter(Boolean).length;
    } else if (Array.isArray(obj)) {
      obj.forEach(extractWords);
    } else if (obj && typeof obj === 'object') {
      Object.values(obj).forEach(extractWords);
    }
  };
  extractWords({
    personal: activeResume.personal,
    experience: activeResume.experience,
    education: activeResume.education,
    projects: activeResume.projects,
    customSections: activeResume.customSections
  });

  // Estimated A4 pages calculation
  const estimatedPages = words > 450 ? Math.ceil(words / 450) : 1;

  const { metadata, ecosystem, cloud, security } = activeResume;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-[#0B0D14] border-l border-slate-800 shadow-2xl p-6 flex flex-col justify-between overflow-y-auto custom-scrollbar animate-slideLeft">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Resume Inspector</h3>
              <p className="text-[11px] text-slate-400">Real-time local content analytics</p>
            </div>
          </div>

          <button
            onClick={() => setIsInspectorOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <FileText className="w-3.5 h-3.5 text-orange-400" /> Total Words
            </div>
            <div className="text-2xl font-black text-white">{words}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5 text-amber-400" /> A4 Pages (Est.)
            </div>
            <div className="text-2xl font-black text-amber-400">{estimatedPages} <span className="text-xs text-slate-500 font-normal">Page{estimatedPages > 1 ? 's' : ''}</span></div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-emerald-400" /> Characters
            </div>
            <div className="text-xl font-extrabold text-white">{totalChars.toLocaleString()}</div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> Health Score
            </div>
            <div className="text-xl font-extrabold text-orange-400">{resumeHealth.percentage}%</div>
          </div>
        </div>

        {/* Missing Sections Checklist */}
        <div className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-white flex items-center justify-between">
            <span>Structure Checklist</span>
            <span className="text-[11px] text-slate-400">{resumeHealth.completedCount} / {resumeHealth.totalCount} Done</span>
          </div>

          {resumeHealth.missingSections.length > 0 ? (
            <div className="space-y-1 text-xs">
              <div className="text-[11px] text-amber-400 font-semibold">Missing Recommended Sections:</div>
              <div className="flex flex-wrap gap-1">
                {resumeHealth.missingSections.map((sec) => (
                  <span key={sec} className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px]">
                    + {sec}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
              ✓ All 10 sections present!
            </div>
          )}
        </div>

        {/* Technical Metadata Details */}
        <div className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-2 text-xs">
          <div className="font-bold text-white flex items-center gap-1.5 pb-1 border-b border-slate-800">
            <Database className="w-3.5 h-3.5 text-orange-400" /> Document Metadata
          </div>
          <div className="space-y-1 text-[11px] text-slate-400 font-mono">
            <div><span className="text-slate-500">UUID:</span> <span className="text-slate-300">{metadata?.uuid || metadata?.id}</span></div>
            <div><span className="text-slate-500">Schema Version:</span> <span className="text-slate-300">{metadata?.schemaVersion || "1.0.0"}</span></div>
            <div><span className="text-slate-500">Created:</span> <span className="text-slate-300">{metadata?.createdAt ? new Date(metadata.createdAt).toLocaleDateString() : 'N/A'}</span></div>
            <div><span className="text-slate-500">Last Modified:</span> <span className="text-slate-300">{metadata?.lastModified ? new Date(metadata.lastModified).toLocaleTimeString() : 'Just now'}</span></div>
            <div><span className="text-slate-500">Device ID:</span> <span className="text-slate-300">{metadata?.localDeviceId || 'dev-local'}</span></div>
            <div><span className="text-slate-500">Sync Status:</span> <span className="text-emerald-400">Local Storage Only</span></div>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-slate-800">
        <button
          onClick={() => setIsInspectorOpen(false)}
          className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800"
        >
          Close Inspector
        </button>
      </div>
    </div>
  );
};
