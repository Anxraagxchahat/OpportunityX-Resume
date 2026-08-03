import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  RefreshCw,
  Clock,
  ArrowRight,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const GithubIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-5 h-5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export const ImportResumePage = () => {
  const navigate = useNavigate();
  const { loadDemoResume } = useResume();
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [parsedSuccess, setParsedSuccess] = useState(false);

  const handleSimulatedUpload = (file) => {
    setIsParsing(true);
    setParsedSuccess(false);
    setTimeout(() => {
      setIsParsing(false);
      setParsedSuccess(true);
      loadDemoResume();
    }, 1200);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleSimulatedUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/30">
          <Upload className="w-3.5 h-3.5" /> Import Resume Data
        </div>
        <h1 className="text-3xl font-black text-white">Import Existing Resume</h1>
        <p className="text-sm text-slate-400">
          Drag & drop your existing PDF, DOCX, or JSON resume. Our schema parser will auto-structure your experience into the builder.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div className="max-w-2xl mx-auto">
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`cyber-glass-card p-10 border-2 border-dashed rounded-3xl text-center space-y-4 transition-all relative ${
            dragActive
              ? 'border-orange-500 bg-orange-500/10 scale-[1.01]'
              : 'border-slate-800 hover:border-orange-500/40'
          }`}
        >
          {isParsing ? (
            <div className="py-8 space-y-3">
              <RefreshCw className="w-10 h-10 text-orange-400 animate-spin mx-auto" />
              <div className="text-base font-bold text-white">Parsing Resume Schema...</div>
              <p className="text-xs text-slate-400">Extracting work experience, skills, and contact details...</p>
            </div>
          ) : parsedSuccess ? (
            <div className="py-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-white">Resume Imported Successfully!</h3>
                <p className="text-xs text-slate-400">All fields mapped into OpportunityX JSON Schema.</p>
              </div>
              <button
                onClick={() => navigate('/builder')}
                className="px-6 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] inline-flex items-center gap-2"
              >
                Open in Resume Builder <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <Upload className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Drag & drop your resume file here</h3>
                <p className="text-xs text-slate-400">Supports PDF, DOCX, and OpportunityX JSON formats (Max 10MB)</p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <label className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 border border-slate-700 hover:border-orange-500 rounded-xl cursor-pointer transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept=".pdf,.docx,.json"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleSimulatedUpload(e.target.files[0]);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => handleSimulatedUpload(null)}
                  className="px-5 py-2.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 rounded-xl transition-colors"
                >
                  Load Sample Resume
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FUTURE INTEGRATIONS (Disabled Cards) */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-white">Ecosystem Import Connectors</h2>
          <p className="text-xs text-slate-400">Integrations ready for upcoming OpportunityX platform releases.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* LinkedIn Connector - Disabled */}
          <div className="cyber-glass-card p-5 opacity-60 relative overflow-hidden space-y-2 border-slate-800">
            <div className="flex items-center justify-between">
              <LinkedinIcon className="w-5 h-5 text-blue-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                Coming Soon
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">LinkedIn Profile</h4>
            <p className="text-xs text-slate-400">Auto-import work experience and skills directly from LinkedIn API.</p>
          </div>

          {/* GitHub Connector - Disabled */}
          <div className="cyber-glass-card p-5 opacity-60 relative overflow-hidden space-y-2 border-slate-800">
            <div className="flex items-center justify-between">
              <GithubIcon className="w-5 h-5 text-purple-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                Coming Soon
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">GitHub Repositories</h4>
            <p className="text-xs text-slate-400">Import pinned repos, commit stats, and tech stacks automatically.</p>
          </div>

          {/* OpportunityX Profile - Disabled */}
          <div className="cyber-glass-card p-5 opacity-60 relative overflow-hidden space-y-2 border-slate-800">
            <div className="flex items-center justify-between">
              <Sparkles className="w-5 h-5 text-orange-400" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                Coming Soon
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">OpportunityX Profile</h4>
            <p className="text-xs text-slate-400">Sync hackathon achievements and verified credentials from Ecosystem OS.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
