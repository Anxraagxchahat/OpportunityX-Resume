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
    setTimeout(() => {
      setIsMatching(false);
      const res = matchJobDescription(activeResume, jobDescription);
      setJdMatchResult(res);
      consumeCredit('AI ATS Job Match');
    }, 400);
  };


  const handleExportAnalysisReport = () => {
    window.print();
  };

  const handleExportAnalysisJSON = () => {
    const report = {
      timestamp: new Date().toISOString(),
      resumeTitle: activeResume.metadata?.title,
      industryFit,
      jdMatchResult
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const anchor = document.createElement('a');
    anchor.setAttribute("href", dataStr);
    anchor.setAttribute("download", `analysis_report_${activeResume.metadata.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.json`);
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Main Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <CheckCircle2 className="w-3.5 h-3.5" /> Deterministic Resume Intelligence Engine
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">Resume Intelligence Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Rule-based ATS audit, recruiter glance simulation, and keyword intelligence. 100% Offline.
          </p>
        </div>

        {/* Quick Toolbar Buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => setIsScanHistoryOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <History className="w-4 h-4 text-orange-400" /> History
          </button>

          <button
            onClick={() => setIsComparisonOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Sliders className="w-4 h-4 text-amber-400" /> Compare
          </button>

          <button
            onClick={() => setIsCompanyMatchOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Building2 className="w-4 h-4 text-blue-400" /> Company Match
          </button>

          <button
            onClick={handleExportAnalysisReport}
            className="px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Download className="w-4 h-4 stroke-[2.5]" /> Export Report
          </button>
        </div>
      </div>

      {/* Top Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ResumeStrengthMeter />

        {/* Industry Profile Selector Card */}
        <div className="cyber-glass-card p-6 space-y-4 md:col-span-2 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-bold text-slate-300">Target Career Industry Profile</span>
              <p className="text-xs text-slate-400">Rule-based evaluation against industry standards</p>
            </div>

            <select
              value={selectedIndustry}
              onChange={(e) => setSelectedIndustry(e.target.value)}
              className="bg-[#10131D] border border-slate-800 text-white rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none focus:border-orange-500"
            >
              {Object.keys(INDUSTRY_PROFILES).map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>
          </div>

          {industryFit && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800/80">
              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-300">Industry Readiness: <strong className="text-emerald-400">{industryFit.readinessPct}%</strong></div>
                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div className="bg-emerald-400 h-full rounded-full transition-all" style={{ width: `${industryFit.readinessPct}%` }} />
                </div>
              </div>

              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-300">Matched Industry Skills:</div>
                <div className="flex flex-wrap gap-1 text-[10px]">
                  {industryFit.matchedKeywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Target Job Description Matcher */}
      <div className="cyber-glass-card p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Search className="w-4 h-4 text-orange-400" /> Target Job Description Matcher
            </h3>
            <p className="text-xs text-slate-400">Paste a target job posting to perform deterministic keyword gap analysis.</p>
          </div>

          <button
            onClick={handleMatchJD}
            disabled={isMatching}
            className="px-4 py-2 text-xs font-bold text-black bg-orange-500 hover:bg-orange-400 rounded-xl transition-all"
          >
            {isMatching ? 'Analyzing Keywords...' : 'Match Job Keywords'}
          </button>
        </div>

        <textarea
          rows={3}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste Job Description text here..."
          className="w-full bg-[#080B12] border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-orange-500"
        />

        {jdMatchResult && (
          <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-3 pt-3 animate-fadeIn">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-white">Overall Keyword Match Score: <strong className="text-orange-400">{jdMatchResult.matchScore}%</strong></span>
              <span className="text-slate-400">{jdMatchResult.matchedKeywordsCount} / {jdMatchResult.totalKeywordsCount} keywords matched</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-emerald-400">Matched Keywords:</div>
                <div className="flex flex-wrap gap-1">
                  {jdMatchResult.matchedKeywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px]">
                      ✓ {kw}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="font-bold text-orange-400">Missing Keywords in Resume:</div>
                <div className="flex flex-wrap gap-1">
                  {jdMatchResult.missingKeywords.map((kw) => (
                    <span key={kw} className="px-2 py-0.5 rounded bg-orange-500/20 text-orange-300 text-[10px]">
                      + {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Tabs */}
      <div className="flex items-center gap-1.5 border-b border-slate-800 overflow-x-auto custom-scrollbar pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Overview & Readiness
        </button>

        <button
          onClick={() => setActiveTab('ats')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'ats' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          ATS Audit (10 Categories)
        </button>

        <button
          onClick={() => setActiveTab('keywords')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'keywords' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Keywords & Density
        </button>

        <button
          onClick={() => setActiveTab('recruiter')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'recruiter' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Recruiter 6s Scan
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'timeline' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Career Timeline
        </button>

        <button
          onClick={() => setActiveTab('fixes')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === 'fixes' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40' : 'text-slate-400 hover:text-white'
          }`}
        >
          Actionable Fixes
        </button>
      </div>

      {/* Tab Views */}
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

      {/* Modals */}
      <ResumeComparisonModal />
      <ScanHistoryModal />
      <CompanyMatchModal />
    </div>
  );
};
