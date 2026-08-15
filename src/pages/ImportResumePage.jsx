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
  Lock,
  User,
  Briefcase,
  GraduationCap,
  Wrench,
  AlertCircle
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { parseResumeFile } from '../utils/resumeParserEngine';
import { ResumeImportReviewModal } from '../components/ResumeImportReviewModal';
import { useIsMobile } from '../hooks/useIsMobile';
import { MobileImportWizard } from '../components/mobile/MobileImportWizard';

import { GithubIcon, LinkedinIcon } from '../components/icons/BrandIcons';

export const ImportResumePage = () => {
  const isMobile = useIsMobile(768);

  const navigate = useNavigate();
  const { loadDemoResume, setIsGitHubImportModalOpen, setIsOpportunityXImportModalOpen } = useResume();
  const [isParsing, setIsParsing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [parsedResult, setParsedResult] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorDebug, setErrorDebug] = useState(null);

  if (isMobile) {
    return <MobileImportWizard />;
  }


  const handleFileUpload = async (file) => {
    setIsParsing(true);
    setErrorMessage('');
    setErrorDebug(null);
    try {
      const parsed = await parseResumeFile(file);
      if (parsed.success === false) {
        setIsParsing(false);

        // Build detailed error message with pipeline failure info
        let msg = parsed.error || "We couldn't confidently extract your resume.";
        if (parsed._debug?.failedStep) {
          msg += ` (Failed at: ${parsed._debug.failedStep.name})`;
        }
        setErrorMessage(msg);
        setErrorDebug(parsed._debug || null);

        if (import.meta.env.DEV && parsed._debug) {
          console.error('[Resume Import] Pipeline failed:', parsed._debug.failedStep);
          console.table(parsed._debug.pipelineSteps);
        }
        return;
      }
      setParsedResult(parsed);
      setTimeout(() => {
        setIsParsing(false);
        setShowReviewModal(true);
      }, 500);
    } catch (err) {
      console.error("Resume parse error:", err);
      setIsParsing(false);
      setErrorMessage("We couldn't confidently extract your resume. Please upload another resume or fill missing fields manually.");
    }
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
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="space-y-2 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/30">
          <Upload className="w-3.5 h-3.5" /> Intelligent Resume Parser Engine
        </div>
        <h1 className="text-3xl font-black text-white">Import Existing Resume</h1>
        <p className="text-sm text-slate-400">
          Upload your existing PDF, DOCX, or JSON resume. Our schema parser auto-extracts your candidate details, experience, education, and skills with confidence scoring.
        </p>
      </div>

      {errorMessage && (
        <div className="max-w-2xl mx-auto space-y-3">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>

          {/* Dev-only: Show pipeline step log on error */}
          {import.meta.env.DEV && errorDebug?.pipelineSteps && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">🔗 Pipeline Debug Log</div>
              {errorDebug.pipelineSteps.map((step, idx) => (
                <div key={idx} className={`p-2 rounded-lg border text-[10px] ${step.status === 'error' ? 'bg-red-500/5 border-red-500/20' : step.status === 'warn' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                  <div className="flex items-center gap-2">
                    <span>{step.status === 'error' ? '❌' : step.status === 'warn' ? '⚠️' : '✅'}</span>
                    <span className="font-bold text-white">{step.name}</span>
                    <span className="text-slate-500 ml-auto">{step.timestamp}ms</span>
                  </div>
                  {step.reason && <div className="text-red-300 mt-1">{step.reason}</div>}
                  {step.preview && <pre className="text-slate-500 mt-1 whitespace-pre-wrap max-h-20 overflow-auto">{step.preview}</pre>}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

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
              <div className="text-base font-bold text-white">Extracting & Parsing Resume Sections...</div>
              <p className="text-xs text-slate-400">Stripping PDF noise and mapping verified candidate fields...</p>
            </div>
          ) : (
            <>
              <div className="w-14 h-14 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                <Upload className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-white">Drag & drop your resume file here</h3>
                <p className="text-xs text-slate-400">Supports PDF, DOCX, TXT, and OpportunityX JSON formats (Max 10MB)</p>
              </div>

              <div className="pt-2 flex items-center justify-center gap-3">
                <label className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 border border-slate-700 hover:border-orange-500 rounded-xl cursor-pointer transition-colors">
                  Browse Files
                  <input
                    type="file"
                    accept=".pdf,.docx,.txt,.json"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
                    }}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    loadDemoResume();
                    navigate('/builder');
                  }}
                  className="px-5 py-2.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 rounded-xl transition-colors"
                >
                  Load Sample Resume
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Manual Review Screen Modal */}
      {showReviewModal && parsedResult && (
        <ResumeImportReviewModal
          parsedData={parsedResult}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {/* Ecosystem Import Connectors */}
      <div className="space-y-4 max-w-4xl mx-auto">
        <div className="text-center space-y-1">
          <h2 className="text-lg font-bold text-white">Ecosystem Import Connectors</h2>
          <p className="text-xs text-slate-400">Integrations ready for upcoming OpportunityX platform releases.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

          <div
            onClick={() => setIsGitHubImportModalOpen(true)}
            className="cyber-glass-card p-5 relative overflow-hidden space-y-2 border-purple-500/30 hover:border-purple-500/60 cursor-pointer transition-all group bg-gradient-to-br from-purple-950/10 via-[#0A0C12] to-[#0A0C12]"
          >
            <div className="flex items-center justify-between">
              <GithubIcon className="w-5 h-5 text-purple-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40">
                Live API
              </span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">GitHub Repositories</h4>
            <p className="text-xs text-slate-400">Import profile, repos, skills, and bullet points via GitHub REST API.</p>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-purple-400 group-hover:translate-x-1 transition-transform">
              <span>Connect & Import</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          <div
            onClick={() => setIsOpportunityXImportModalOpen(true)}
            className="cyber-glass-card p-5 relative overflow-hidden space-y-2 border-orange-500/30 hover:border-orange-500/60 cursor-pointer transition-all group bg-gradient-to-br from-orange-950/10 via-[#0A0C12] to-[#0A0C12]"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-5 h-5 text-orange-400 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40">
                Ecosystem Sync
              </span>
            </div>
            <h4 className="text-sm font-bold text-white group-hover:text-orange-300 transition-colors">OpportunityX Profile</h4>
            <p className="text-xs text-slate-400">Sync verified experience, hackathon awards, certs, and projects from Ecosystem OS.</p>
            <div className="pt-2 flex items-center gap-1 text-xs font-bold text-orange-400 group-hover:translate-x-1 transition-transform">
              <span>Sync Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
