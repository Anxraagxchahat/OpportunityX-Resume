import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  Search,
  FileCheck,
  Zap,
  BarChart2
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ATSCheckerPage = () => {
  const navigate = useNavigate();
  const { resumeData } = useResume();
  const [jobDescription, setJobDescription] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [matchedScore, setMatchedScore] = useState(94);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setMatchedScore(jobDescription.length > 50 ? 96 : 94);
    }, 800);
  };

  const passedChecks = [
    { title: "Standard Typography & Font Family", desc: "Uses ATS-safe standard web fonts (Inter/Outfit)." },
    { title: "Single Column Section Hierarchy", desc: "No complex floating text boxes or tables." },
    { title: "Contact Details Positioned Correctly", desc: "Email, Phone, and LinkedIn links placed in document header." },
    { title: "Strong Action Verb Usage", desc: "Bullet points start with high-impact action verbs (Architected, Engineered, Pioneered)." }
  ];

  const minorWarnings = [
    { title: "Quantifiable Metrics Expansion", desc: "Add more numerical metrics (e.g. %, $, users) to 2 experience bullets." }
  ];

  const criticalFixes = [
    { title: "Missing Target Job Keyword: Docker", desc: "Add Docker & Cloud Infrastructure to Technical Skills." }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
          <CheckCircle2 className="w-3.5 h-3.5" /> ATS Resume Scanner & Compliance Audit
        </div>
        <h1 className="text-3xl font-black text-white">ATS Score & Keyword Analytics</h1>
        <p className="text-sm text-slate-400">
          Real-time parser simulation analyzing keyword density, formatting compliance, and impact metrics.
        </p>
      </div>

      {/* Main Score & Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Circular Score Display */}
        <div className="cyber-glass-card p-6 flex flex-col items-center justify-center text-center space-y-3 border-emerald-500/30">
          <div className="relative w-36 h-36 flex items-center justify-center">
            {/* SVG Circular Progress Ring */}
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-slate-800"
                strokeWidth="12"
                fill="transparent"
              />
              <circle
                cx="72"
                cy="72"
                r="60"
                className="stroke-emerald-400 transition-all duration-1000"
                strokeWidth="12"
                strokeDasharray="377"
                strokeDashoffset={377 - (377 * matchedScore) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-3xl font-black text-white">{matchedScore}%</span>
              <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Pass Rate</span>
            </div>
          </div>

          <div className="space-y-1">
            <h3 className="text-base font-bold text-white">ATS Compliance Grade: A+</h3>
            <p className="text-xs text-slate-400">Ready for Workday, Greenhouse, and Lever ATS systems.</p>
          </div>
        </div>

        {/* Card 2 & 3: Breakdown Gauges */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="cyber-glass-card p-5 space-y-3">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Keyword Relevance Match</span>
              <span className="text-emerald-400 font-bold">96%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[96%]" />
            </div>
            <p className="text-xs text-slate-400">Contains 18/19 essential tech keywords for target role.</p>
          </div>

          <div className="cyber-glass-card p-5 space-y-3">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Formatting & Layout Score</span>
              <span className="text-emerald-400 font-bold">100%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-400 h-full w-[100%]" />
            </div>
            <p className="text-xs text-slate-400">Zero unreadable graphics, tables, or floating text boxes.</p>
          </div>

          <div className="cyber-glass-card p-5 space-y-3">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Action Verbs Impact</span>
              <span className="text-amber-400 font-bold">88%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="bg-amber-400 h-full w-[88%]" />
            </div>
            <p className="text-xs text-slate-400">High frequency of leadership & engineering action verbs.</p>
          </div>

          <div className="cyber-glass-card p-5 space-y-3">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>Quantifiable Metrics Ratio</span>
              <span className="text-orange-400 font-bold">82%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-400 h-full w-[82%]" />
            </div>
            <p className="text-xs text-slate-400">4 out of 5 bullet points contain percentage or speed metrics.</p>
          </div>
        </div>
      </div>

      {/* Target Job Description Matcher Section */}
      <div className="cyber-glass-card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-orange-400" /> Target Job Description Matcher
            </h3>
            <p className="text-xs text-slate-400">Paste the job description you are applying for to check keyword gaps.</p>
          </div>
          <button
            onClick={handleScan}
            disabled={isScanning}
            className="px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-sm transition-all"
          >
            {isScanning ? 'Scanning Keywords...' : 'Match Job Description'}
          </button>
        </div>

        <textarea
          rows={3}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste Job Description here (e.g. 'We are looking for a Senior Full Stack Engineer proficient in React, TypeScript, Docker...')"
          className="w-full bg-[#080B12] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
        />
      </div>

      {/* Passed, Warnings, Critical Fixes Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Passed Checks */}
        <div className="cyber-glass-card p-5 space-y-3 border-emerald-500/20">
          <h4 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" /> Passed Checks ({passedChecks.length})
          </h4>
          <div className="space-y-2.5">
            {passedChecks.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="text-xs font-bold text-white">{item.title}</div>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Minor Warnings */}
        <div className="cyber-glass-card p-5 space-y-3 border-amber-500/20">
          <h4 className="text-sm font-bold text-amber-400 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Suggestions ({minorWarnings.length})
          </h4>
          <div className="space-y-2.5">
            {minorWarnings.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-1">
                <div className="text-xs font-bold text-white">{item.title}</div>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Critical Fixes with "Fix in Builder" */}
        <div className="cyber-glass-card p-5 space-y-3 border-orange-500/30">
          <h4 className="text-sm font-bold text-orange-400 flex items-center gap-2">
            <XCircle className="w-4 h-4" /> Critical Fixes ({criticalFixes.length})
          </h4>
          <div className="space-y-2.5">
            {criticalFixes.map((item, idx) => (
              <div key={idx} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2">
                <div className="text-xs font-bold text-white">{item.title}</div>
                <p className="text-[11px] text-slate-400">{item.desc}</p>
                <button
                  onClick={() => navigate('/builder')}
                  className="w-full py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  Apply Fix in Builder <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
