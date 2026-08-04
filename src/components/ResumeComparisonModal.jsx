import React, { useState } from 'react';
import { X, Sliders, ArrowRight, Check, Minus, Plus } from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { calculateATSScore } from '../utils/atsEngine';
import { calculateResumeHealth } from '../utils/resumeHealth';

export const ResumeComparisonModal = () => {
  const { isComparisonOpen, setIsComparisonOpen, resumes, activeResume } = useResume();

  const [compareIdA, setCompareIdA] = useState(resumes[0]?.metadata?.id);
  const [compareIdB, setCompareIdB] = useState(resumes[1]?.metadata?.id || resumes[0]?.metadata?.id);

  if (!isComparisonOpen) return null;

  const resumeA = resumes.find((r) => r.metadata?.id === compareIdA) || resumes[0];
  const resumeB = resumes.find((r) => r.metadata?.id === compareIdB) || resumes[0];

  const scoreA = calculateATSScore(resumeA).overallScore;
  const scoreB = calculateATSScore(resumeB).overallScore;

  const healthA = calculateResumeHealth(resumeA).percentage;
  const healthB = calculateResumeHealth(resumeB).percentage;

  const scoreDiff = scoreB - scoreA;
  const healthDiff = healthB - healthA;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-3xl shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={() => setIsComparisonOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Side-by-Side Resume Comparison</h3>
            <p className="text-xs text-slate-400">Compare ATS scores, health metrics, and section count across drafts</p>
          </div>
        </div>

        {/* Resume Selectors */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Baseline Resume (A)</label>
            <select
              value={compareIdA}
              onChange={(e) => setCompareIdA(e.target.value)}
              className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {resumes.map((r) => (
                <option key={r.metadata.id} value={r.metadata.id}>
                  {r.metadata.title} ({r.metadata.template})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Target Resume (B)</label>
            <select
              value={compareIdB}
              onChange={(e) => setCompareIdB(e.target.value)}
              className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              {resumes.map((r) => (
                <option key={r.metadata.id} value={r.metadata.id}>
                  {r.metadata.title} ({r.metadata.template})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Score Comparison Display */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {/* Card A */}
          <div className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-2">
            <div className="text-xs font-bold text-slate-400 truncate">{resumeA.metadata?.title}</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{scoreA}% <span className="text-xs font-normal text-slate-500">ATS</span></span>
              <span className="text-sm font-bold text-orange-400">{healthA}% Health</span>
            </div>
          </div>

          {/* Card B */}
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-2">
            <div className="text-xs font-bold text-orange-300 truncate">{resumeB.metadata?.title}</div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-white">{scoreB}% <span className="text-xs font-normal text-slate-500">ATS</span></span>
              <span className="text-sm font-bold text-orange-400">{healthB}% Health</span>
            </div>
          </div>
        </div>

        {/* Delta Summary */}
        <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
          <span className="font-bold text-slate-300">Score Delta (B vs A):</span>
          <span className={`font-black ${scoreDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {scoreDiff >= 0 ? `+${scoreDiff}% ATS Score Improvement` : `${scoreDiff}% Score Decrease`}
          </span>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsComparisonOpen(false)}
            className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
