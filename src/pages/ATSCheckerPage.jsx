import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Sparkles,
  ArrowRight,
  Search,
  Layers,
  Lock,
  Download,
  Building2,
  Sliders,
  History,
  Activity,
  Award,
  Calendar,
  Eye,
  FileText
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { ResumeStrengthMeter } from '../components/ResumeStrengthMeter';
import { ATSScoreCard } from '../components/ATSScoreCard';
import { KeywordCard } from '../components/KeywordCard';
import { SuggestionsCard } from '../components/SuggestionsCard';
import { RecruiterCard } from '../components/RecruiterCard';
import { ResumeRadarChart } from '../components/ResumeRadarChart';
import { ReadinessBadgesCard } from '../components/ReadinessBadgesCard';
import { ResumeTimeline } from '../components/ResumeTimeline';
import { ResumeComparisonModal } from '../components/ResumeComparisonModal';
import { ScanHistoryModal } from '../components/ScanHistoryModal';
import { CompanyMatchModal } from '../components/CompanyMatchModal';
import { analyzeIndustryFit, INDUSTRY_PROFILES } from '../utils/industryAnalyzer';
import { matchJobDescription } from '../utils/jobMatcher';

export const ATSCheckerPage = () => {
  const navigate = useNavigate();
  const {
    activeResume,
    runResumeScan,
    checkAIAccess,
    consumeCredit,
    setIsComparisonOpen,
    setIsScanHistoryOpen,
    setIsCompanyMatchOpen
  } = useResume();

  const [activeTab, setActiveTab] = useState('overview'); // overview, ats, keywords, recruiter, timeline, fixes
  const [selectedIndustry, setSelectedIndustry] = useState('Software Engineering');
  const [jobDescription, setJobDescription] = useState('');
  const [isMatching, setIsMatching] = useState(false);
  const [jdMatchResult, setJdMatchResult] = useState(null);

  const industryFit = analyzeIndustryFit(activeResume, selectedIndustry);

  const handleMatchJD = () => {
    if (!jobDescription.trim()) return;

    // Check AI Access (Require Auth + 1 Credit)
    if (!checkAIAccess('AI ATS Job Match')) {
      return;
    }

    setIsMatching(true);
    setTimeout(async () => {
      setIsMatching(false);
      const res = matchJobDescription(activeResume, jobDescription);
      setJdMatchResult(res);
      await consumeCredit('AI ATS Job Match', 1);
    }, 400);
  };

  const handleExportAnalysisReport = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8 transition-colors duration-300">
      {/* ─── HEADER & UNIFIED ACTION GROUP ─── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-6 border-b border-[var(--ox-border)]">
        <div className="space-y-1.5 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Deterministic Resume Intelligence Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--ox-text-primary)]">Resume Intelligence Dashboard</h1>
          <p className="text-xs sm:text-sm text-[var(--ox-text-secondary)]">
            Rule-based ATS audit, recruiter glance simulation, and keyword intelligence. 100% Offline.
          </p>
        </div>

        {/* ─── Unified Tablet/Desktop Action Buttons Group (Equal 44px Height & Visual Hierarchy) ─── */}
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap w-full lg:w-auto shrink-0">
          <button
            type="button"
            onClick={() => setIsScanHistoryOpen(true)}
            className="flex-1 sm:flex-none min-h-[44px] px-3.5 py-2 text-xs font-bold text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] hover:border-orange-500/40 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <History className="w-4 h-4 text-orange-400 shrink-0" />
            <span>History</span>
          </button>

          <button
            type="button"
            onClick={() => setIsComparisonOpen(true)}
            className="flex-1 sm:flex-none min-h-[44px] px-3.5 py-2 text-xs font-bold text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] hover:border-orange-500/40 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Sliders className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Compare</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCompanyMatchOpen(true)}
            className="flex-1 sm:flex-none min-h-[44px] px-3.5 py-2 text-xs font-bold text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] hover:border-orange-500/40 rounded-xl flex items-center justify-center gap-2 transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Company Match</span>
          </button>

          <button
            type="button"
            onClick={handleExportAnalysisReport}
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 text-xs font-extrabold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer shrink-0"
          >
            <Download className="w-4 h-4 stroke-[2.5] shrink-0" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* ─── BALANCED 2-COLUMN TOP BANNER GRID ─── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <ResumeStrengthMeter />

        {/* Industry Profile Selector Card */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-4 flex flex-col justify-between shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[var(--ox-text-primary)]">Target Career Industry Profile</span>
              <p className="text-xs text-[var(--ox-text-secondary)]">Rule-based evaluation against industry standards</p>
            </div>

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-orange-500 min-h-[40px] cursor-pointer"
            >
              {Object.keys(INDUSTRY_PROFILES).map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {industryFit && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-[var(--ox-border)]">
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-[var(--ox-text-secondary)]">
                  Industry Readiness: <strong className="text-emerald-400">{industryFit.readinessPct}%</strong>
                </div>
                <div className="w-full bg-[var(--ox-surface-primary)] h-2.5 rounded-full overflow-hidden border border-[var(--ox-border)]">
                  <div
                    className="bg-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: `${industryFit.readinessPct}%` }}
                  />
                </div>
              </div>

              <div className="text-xs space-y-1.5">
                <div className="font-bold text-[var(--ox-text-secondary)]">Matched Industry Skills:</div>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {industryFit.matchedKeywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-semibold">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ─── FULL-WIDTH TARGET JOB DESCRIPTION MATCHER ─── */}
      <div className="p-5 sm:p-6 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
              <Search className="w-4 h-4 text-orange-400" /> Target Job Description Matcher
            </h3>
            <p className="text-xs text-[var(--ox-text-secondary)]">Paste a target job posting to perform deterministic keyword gap analysis.</p>
          </div>

          <button
            type="button"
            onClick={handleMatchJD}
            disabled={isMatching}
            className="min-h-[44px] px-4 py-2 text-xs font-extrabold text-black bg-orange-500 hover:bg-orange-400 disabled:opacity-50 rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer shrink-0"
          >
            {isMatching ? 'Analyzing Keywords...' : 'Match Job Keywords'}
          </button>
        </div>

        <textarea
          rows={3}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste Job Description text here..."
          className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl p-3 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
        />

        {/* Shimmering ATS Analysis Skeleton Loader */}
        {isMatching && (
          <div className="p-4 rounded-xl bg-[var(--ox-surface-primary)] border border-orange-500/30 space-y-3 pt-3 animate-pulse shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                </span>
                <span className="text-xs font-bold text-orange-400">Parsing Job Posting & Calculating ATS Fit...</span>
              </div>
              <div className="h-4 w-20 rounded-md bg-orange-500/20 ox-skeleton" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <div className="space-y-2">
                <div className="h-3 w-28 rounded ox-skeleton" />
                <div className="flex flex-wrap gap-1.5">
                  <div className="h-5 w-16 rounded-lg ox-skeleton" />
                  <div className="h-5 w-20 rounded-lg ox-skeleton" />
                  <div className="h-5 w-14 rounded-lg ox-skeleton" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 w-32 rounded ox-skeleton" />
                <div className="flex flex-wrap gap-1.5">
                  <div className="h-5 w-18 rounded-lg ox-skeleton" />
                  <div className="h-5 w-16 rounded-lg ox-skeleton" />
                  <div className="h-5 w-22 rounded-lg ox-skeleton" />
                </div>
              </div>
            </div>
          </div>
        )}

        {jdMatchResult && !isMatching && (
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-3 pt-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-[var(--ox-text-primary)]">Overall Keyword Match Score: <strong className="text-orange-400">{jdMatchResult.matchScore}%</strong></span>
              <span className="text-[var(--ox-text-secondary)]">{jdMatchResult.matchedKeywordsCount} / {jdMatchResult.totalKeywordsCount} keywords matched</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-emerald-400">Matched Keywords:</div>
                <div className="flex flex-wrap gap-1">
                  {jdMatchResult.matchedKeywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-orange-400">Missing Keywords in Resume:</div>
                <div className="flex flex-wrap gap-1">
                  {jdMatchResult.missingKeywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded-lg bg-orange-500/20 text-orange-300 text-[10px] font-semibold">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── INTERACTIVE TABS ─── */}
      <div className="flex items-center gap-2 border-b border-[var(--ox-border)] overflow-x-auto custom-scrollbar pb-2">
        {[
          { id: 'overview', label: 'Overview & Readiness' },
          { id: 'ats', label: 'ATS Audit (10 Categories)' },
          { id: 'keywords', label: 'Keywords & Density' },
          { id: 'recruiter', label: 'Recruiter 6s Scan' },
          { id: 'timeline', label: 'Career Timeline' },
          { id: 'fixes', label: 'Actionable Fixes' }
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`min-h-[44px] px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer active:scale-95 ${
              activeTab === tab.id
                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── TAB CONTENT PANELS ─── */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ResumeRadarChart />
            <ReadinessBadgesCard />
          </div>
        )}

        {activeTab === 'ats' && <ATSScoreCard />}
        {activeTab === 'keywords' && <KeywordCard />}
        {activeTab === 'recruiter' && <RecruiterCard />}
        {activeTab === 'timeline' && <ResumeTimeline />}
        {activeTab === 'fixes' && <SuggestionsCard />}
      </div>

      {/* ─── MODALS ─── */}
      <ResumeComparisonModal />
      <ScanHistoryModal />
      <CompanyMatchModal />
    </div>
  );
};

export default ATSCheckerPage;
