import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Sparkles, FileText, Upload, Copy, Trash2, Edit3, Clock,
  PlayCircle, ShieldCheck, Check, Zap, Key, Star, Archive, Search,
  ArrowRight, UserCheck, Download, LayoutTemplate, ScanLine, Bot,
  FileJson, ChevronRight, MoreHorizontal, CircleDot, TrendingUp,
  AlertTriangle, CheckCircle2, XCircle, ArrowUpRight, Pencil,
  Palette, ExternalLink, Eye, BarChart3, Timer, Lightbulb, Flame,
  GraduationCap, Briefcase, FolderGit2, Wrench, Award, Globe, User,
  MessageSquareText, Share2
} from 'lucide-react';
import { GithubIcon as Github } from '../components/GithubIcon';
import { useResume } from '../context/ResumeContext';
import { calculateResumeHealth } from '../utils/resumeHealth';
import { calculateATSScore } from '../utils/atsEngine';

// ─── Animation Variants ───────────────────────────────────────────────────────

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: 'spring', stiffness: 400, damping: 30 }
  }
};

const hoverLift = {
  whileHover: { y: -2, transition: { type: 'spring', stiffness: 400, damping: 25 } },
  whileTap: { scale: 0.98 }
};

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedNumber({ value, suffix = '', duration = 800 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);

  useEffect(() => {
    const target = typeof value === 'number' ? value : 0;
    const start = 0;
    const startTime = performance.now();

    function animate(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(start + (target - start) * eased));
      if (progress < 1) ref.current = requestAnimationFrame(animate);
    }

    ref.current = requestAnimationFrame(animate);
    return () => ref.current && cancelAnimationFrame(ref.current);
  }, [value, duration]);

  return <>{display}{suffix}</>;
}

// ─── Relative Time ────────────────────────────────────────────────────────────

function relativeTime(dateStr) {
  if (!dateStr) return 'Never';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ─── ATS Score Ring ───────────────────────────────────────────────────────────

function ScoreRing({ score, size = 52, strokeWidth = 4, className = '' }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 85 ? '#10B981' : score >= 60 ? '#F59E0B' : '#EF4444';

  return (
    <svg width={size} height={size} className={className}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth={strokeWidth} />
      <motion.circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
        strokeDasharray={circumference}
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" className="text-[11px] font-black" fill="var(--ox-text-primary)">
        {score}
      </text>
    </svg>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
//  MAIN DASHBOARD
// ═════════════════════════════════════════════════════════════════════════════

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    resumes, activeResume, activeResumeId, setActiveResumeId,
    createNewResume, duplicateResume, deleteResume, renameResume,
    toggleFavorite, toggleArchive, loadDemoResume, importResumeJSON,
    exportActiveResumeJSON,
    aiCredits, session,
    setIsBuyCreditsModalOpen, setIsUnlockAIModalOpen,
    setIsExportCenterOpen, setIsGitHubImportModalOpen,
    setIsOpportunityXImportModalOpen
  } = useResume();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleInput, setTitleInput] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);

  // ─── Derived data ─────────────────────────────────────────────────────────

  const activeHealth = useMemo(() => calculateResumeHealth(activeResume), [activeResume]);
  const activeATS = useMemo(() => calculateATSScore(activeResume), [activeResume]);

  const filteredResumes = useMemo(() => {
    return resumes.filter((r) => {
      const isFav = Boolean(r.metadata?.isFavorite);
      const isArchived = Boolean(r.metadata?.isArchived);
      if (activeTab === 'favorites' && !isFav) return false;
      if (activeTab === 'archived' && !isArchived) return false;
      if (activeTab === 'all' && isArchived) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (r.metadata?.title || '').toLowerCase().includes(q) ||
               (r.metadata?.template || '').toLowerCase().includes(q);
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'name') return (a.metadata?.title || '').localeCompare(b.metadata?.title || '');
      if (sortBy === 'health') return calculateResumeHealth(b).percentage - calculateResumeHealth(a).percentage;
      if (sortBy === 'ats') return calculateATSScore(b).overallScore - calculateATSScore(a).overallScore;
      return new Date(b.metadata?.lastSaved || 0).getTime() - new Date(a.metadata?.lastSaved || 0).getTime();
    });
  }, [resumes, activeTab, sortBy, searchQuery]);

  // ─── AI Insights (proactive suggestions) ──────────────────────────────────

  const aiInsights = useMemo(() => {
    if (!activeResume) return [];
    const suggestions = [];
    const p = activeResume.personal || {};
    if (!p.summary || p.summary.trim().length < 20)
      suggestions.push({ icon: MessageSquareText, label: 'Add Professional Summary', desc: 'A strong summary increases recruiter interest by 40%', severity: 'high' });
    if (!(Array.isArray(activeResume.experience) && activeResume.experience.length > 0))
      suggestions.push({ icon: Briefcase, label: 'Add Work Experience', desc: 'Experience is the #1 section recruiters look for', severity: 'high' });
    if (!(Array.isArray(activeResume.projects) && activeResume.projects.length > 0))
      suggestions.push({ icon: FolderGit2, label: 'Add Projects', desc: 'Projects showcase practical skills to hiring managers', severity: 'medium' });
    if (activeATS.overallScore < 80)
      suggestions.push({ icon: ScanLine, label: 'Improve ATS Score', desc: `Score is ${activeATS.overallScore}/100 — aim for 80+`, severity: 'medium' });
    if (activeHealth.percentage < 60)
      suggestions.push({ icon: ShieldCheck, label: 'Complete Resume Sections', desc: `Only ${activeHealth.percentage}% complete — add missing sections`, severity: 'medium' });
    if (!p.linkedin)
      suggestions.push({ icon: Globe, label: 'Add LinkedIn Profile', desc: '85% of recruiters check LinkedIn before interviews', severity: 'low' });
    return suggestions.slice(0, 4);
  }, [activeResume, activeATS, activeHealth]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleEdit = (id) => { setActiveResumeId(id); navigate('/builder'); };
  const handleCreateNew = () => { createNewResume('modern'); navigate('/builder'); };
  const handleLoadSample = () => { loadDemoResume(); navigate('/builder'); };
  const handleRenameSubmit = (e, id) => {
    e.preventDefault();
    if (titleInput.trim()) renameResume(id, titleInput.trim());
    setEditingTitleId(null);
  };
  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (content && importResumeJSON(content)) navigate('/builder');
    };
    reader.readAsText(file);
  };

  // Close menus on outside click
  useEffect(() => {
    const handler = () => setOpenMenuId(null);
    if (openMenuId) document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [openMenuId]);

  const isLoggedIn = session?.isAuthenticated && !session?.isGuest;
  const hasResumes = resumes.length > 0;

  // ═══════════════════════════════════════════════════════════════════════════
  //  EMPTY STATE (zero resumes)
  // ═══════════════════════════════════════════════════════════════════════════

  if (!hasResumes) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 flex flex-col items-center text-center space-y-8">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 300, damping: 25 }}>
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-orange-500/20 to-amber-500/10 border border-orange-500/30 flex items-center justify-center mx-auto shadow-[0_0_60px_rgba(249,115,22,0.15)]">
            <FileText className="w-12 h-12 text-orange-400" />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-black text-white">Create Your First Resume</h1>
          <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Build a professional, ATS-optimized resume in minutes. Choose a template, fill in your details, and export as PDF — <strong className="text-emerald-400">100% free forever</strong>.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleCreateNew} className="px-8 py-3.5 text-sm font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-2xl shadow-[0_0_30px_rgba(249,115,22,0.3)] transition-all flex items-center gap-2">
            <Plus className="w-5 h-5 stroke-[2.5]" /> Create New Resume
          </button>
          <button onClick={() => navigate('/import')} className="px-8 py-3.5 text-sm font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-2xl transition-all flex items-center gap-2">
            <Upload className="w-5 h-5" /> Import Existing Resume
          </button>
        </motion.div>

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} onClick={handleLoadSample} className="text-xs text-slate-500 hover:text-orange-400 transition-colors flex items-center gap-1.5">
          <PlayCircle className="w-3.5 h-3.5" /> Or try with a sample resume
        </motion.button>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  //  MAIN DASHBOARD RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <motion.div
      variants={containerVariants} initial="hidden" animate="visible"
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 pb-[calc(96px+env(safe-area-inset-bottom,0px))] md:pb-8"
    >
      {/* ─── Top Row: Hero + Metrics ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* ══ HERO RESUME CARD ══ */}
        <motion.div variants={itemVariants} className="lg:col-span-8">
          <div className="cyber-glass-card p-6 sm:p-7 relative overflow-hidden group border-orange-500/20 hover:border-orange-500/40 transition-all">
            {/* Background glow */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-orange-500/[0.07] rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/[0.12] transition-all duration-700" />
            <div className="absolute -bottom-16 -left-16 w-40 h-40 bg-amber-500/[0.05] rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1 min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-orange-400/80">Active Resume</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <h1 className="text-xl sm:text-2xl font-black text-white truncate">{activeResume?.metadata?.title || 'Untitled Resume'}</h1>
                  <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                    {activeResume?.personal?.jobTitle && (
                      <span className="flex items-center gap-1"><Briefcase className="w-3 h-3 text-slate-500" /> {activeResume.personal.jobTitle}</span>
                    )}
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-500" /> {relativeTime(activeResume?.metadata?.lastSaved)}</span>
                    <span className="flex items-center gap-1 capitalize"><LayoutTemplate className="w-3 h-3 text-slate-500" /> {activeResume?.metadata?.template || 'modern'}</span>
                    {activeResume?.metadata?.accentColor && (
                      <span className="flex items-center gap-1">
                        <span className="w-2.5 h-2.5 rounded-full border border-slate-700" style={{ backgroundColor: activeResume.metadata.accentColor }} />
                      </span>
                    )}
                  </div>
                </div>

                {/* ATS Ring */}
                <div className="shrink-0 flex flex-col items-center">
                  <ScoreRing score={activeATS.overallScore} size={60} strokeWidth={5} />
                  <span className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-wider">ATS</span>
                </div>
              </div>

              {/* Health bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">Resume Health</span>
                  <span className="font-bold text-white">{activeHealth.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400"
                    initial={{ width: 0 }}
                    animate={{ width: `${activeHealth.percentage}%` }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <button onClick={() => handleEdit(activeResumeId)} className="px-5 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.25)] transition-all flex items-center gap-1.5">
                  <Edit3 className="w-3.5 h-3.5" /> Continue Editing
                </button>
                <button onClick={() => setIsExportCenterOpen(true)} className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-xl transition-all flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5" /> Export
                </button>
                <button onClick={() => navigate('/ats-checker')} className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-xl transition-all flex items-center gap-1.5">
                  <ScanLine className="w-3.5 h-3.5" /> ATS Analysis
                </button>
                <button onClick={() => navigate('/ai-assistant')} className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-orange-500/40 rounded-xl transition-all flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-orange-400" /> AI Improve
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ══ METRIC TILES (right column) ══ */}
        <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-4">
          {/* Total Resumes */}
          <motion.div variants={itemVariants} {...hoverLift} className="cyber-glass-card p-4 flex items-center gap-3.5 cursor-default">
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xl font-black text-white leading-none"><AnimatedNumber value={resumes.length} /></div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Total Resumes</div>
            </div>
          </motion.div>

          {/* ATS Score */}
          <motion.div variants={itemVariants} {...hoverLift} onClick={() => navigate('/ats-checker')} className="cyber-glass-card p-4 flex items-center gap-3.5 cursor-pointer">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
              <ScanLine className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white leading-none"><AnimatedNumber value={activeATS.overallScore} /></span>
                <span className="text-[10px] text-slate-500">/100</span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">ATS Score</div>
            </div>
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${activeATS.overallScore >= 85 ? 'bg-emerald-500/15 text-emerald-400' : activeATS.overallScore >= 60 ? 'bg-amber-500/15 text-amber-400' : 'bg-red-500/15 text-red-400'}`}>{activeATS.grade}</span>
          </motion.div>

          {/* Resume Health */}
          <motion.div variants={itemVariants} {...hoverLift} onClick={() => handleEdit(activeResumeId)} className="cyber-glass-card p-4 flex items-center gap-3.5 cursor-pointer">
            <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-black text-white leading-none"><AnimatedNumber value={activeHealth.percentage} suffix="%" /></span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">Health Score</div>
            </div>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${activeHealth.badgeColor}`}>{activeHealth.healthStatus}</span>
          </motion.div>

          {/* AI Credits */}
          <motion.div variants={itemVariants} {...hoverLift}
            onClick={() => isLoggedIn ? setIsBuyCreditsModalOpen(true) : setIsUnlockAIModalOpen(true)}
            className="cyber-glass-card p-4 flex items-center gap-3.5 cursor-pointer"
          >
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xl font-black text-white leading-none"><AnimatedNumber value={aiCredits?.remaining || 0} /></div>
              <div className="text-[10px] text-slate-500 font-medium mt-0.5">AI Credits</div>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          </motion.div>
        </div>
      </div>

      {/* ─── Middle Row: Health + Actions + AI Insights ──────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">

        {/* ══ HEALTH CENTER ══ */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <div className="cyber-glass-card p-5 space-y-4 h-full">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> Health Center
              </h3>
              <span className="text-lg font-black text-white">{activeHealth.percentage}%</span>
            </div>

            <div className="space-y-1">
              {[
                { id: 'personal', label: 'Personal Info', icon: User },
                { id: 'summary', label: 'Summary', icon: MessageSquareText },
                { id: 'experience', label: 'Work Experience', icon: Briefcase },
                { id: 'education', label: 'Education', icon: GraduationCap },
                { id: 'projects', label: 'Projects', icon: FolderGit2 },
                { id: 'skills', label: 'Skills', icon: Wrench },
                { id: 'certificates', label: 'Certificates', icon: Award },
                { id: 'achievements', label: 'Achievements', icon: Flame },
                { id: 'languages', label: 'Languages', icon: Globe },
                { id: 'socialLinks', label: 'Social Links', icon: Share2 },
              ].map((section) => {
                const isComplete = activeHealth.completedSections.includes(section.label === 'Summary' ? 'Professional Summary' : section.label === 'Social Links' ? 'Social Links' : section.label);
                const Ico = section.icon;

                return (
                  <button
                    key={section.id}
                    onClick={() => { setActiveResumeId(activeResumeId); navigate('/builder'); }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all group ${
                      isComplete
                        ? 'text-slate-400 hover:bg-slate-900/50'
                        : 'text-amber-400 hover:bg-amber-500/10'
                    }`}
                  >
                    {isComplete
                      ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      : <XCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    }
                    <Ico className="w-3 h-3 shrink-0 opacity-50" />
                    <span className="flex-1 text-left">{section.label}</span>
                    {!isComplete && <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ══ QUICK ACTIONS ══ */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <div className="space-y-4 h-full flex flex-col">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5 px-1">
              <Zap className="w-3.5 h-3.5 text-orange-400" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2.5 flex-1">
              {[
                { label: 'Create Resume', desc: 'Start fresh', icon: Plus, action: handleCreateNew, accent: 'orange' },
                { label: 'Ecosystem Sync', desc: 'Sync OpportunityX', icon: Sparkles, action: () => setIsOpportunityXImportModalOpen(true), accent: 'amber' },
                { label: 'GitHub Import', desc: 'Sync repos & tech', icon: Github, action: () => setIsGitHubImportModalOpen(true), accent: 'indigo' },
                { label: 'Import Resume', desc: 'PDF or DOCX', icon: Upload, action: () => navigate('/import'), accent: 'blue' },
                { label: 'Templates', desc: 'Browse designs', icon: LayoutTemplate, action: () => navigate('/templates'), accent: 'purple' },
                { label: 'ATS Checker', desc: 'Score analysis', icon: ScanLine, action: () => navigate('/ats-checker'), accent: 'emerald' },
                { label: 'AI Assistant', desc: 'Smart improve', icon: Bot, action: () => navigate('/ai-assistant'), accent: 'amber' },
              ].map((action) => {
                const colorMap = {
                  orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400 group-hover:border-orange-500/40 group-hover:bg-orange-500/15',
                  blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400 group-hover:border-blue-500/40 group-hover:bg-blue-500/15',
                  indigo: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400 group-hover:border-indigo-500/40 group-hover:bg-indigo-500/15',
                  purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400 group-hover:border-purple-500/40 group-hover:bg-purple-500/15',
                  emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15',
                  amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400 group-hover:border-amber-500/40 group-hover:bg-amber-500/15',
                  teal: 'bg-teal-500/10 border-teal-500/20 text-teal-400 group-hover:border-teal-500/40 group-hover:bg-teal-500/15',
                };
                const Ico = action.icon;

                return (
                  <motion.button
                    key={action.label}
                    {...hoverLift}
                    onClick={action.action}
                    className="cyber-glass-card p-3.5 flex flex-col items-start gap-2 text-left group cursor-pointer"
                  >
                    <div className={`p-2 rounded-xl border transition-all ${colorMap[action.accent]}`}>
                      <Ico className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[11px] font-bold text-white group-hover:text-orange-300 transition-colors">{action.label}</div>
                      <div className="text-[10px] text-slate-500">{action.desc}</div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ══ AI INSIGHTS ══ */}
        <motion.div variants={itemVariants} className="lg:col-span-4">
          <div className="cyber-glass-card p-5 space-y-4 h-full relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/[0.06] rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> AI Insights
              </h3>
              {aiInsights.length > 0 && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-400">{aiInsights.length}</span>
              )}
            </div>

            <div className="space-y-2 relative z-10">
              {aiInsights.length === 0 ? (
                <div className="text-center py-6 space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto opacity-50" />
                  <p className="text-xs text-slate-500">Your resume looks great!</p>
                </div>
              ) : (
                aiInsights.map((insight, idx) => {
                  const Ico = insight.icon;
                  const severityColor = insight.severity === 'high' ? 'border-l-red-500' : insight.severity === 'medium' ? 'border-l-amber-500' : 'border-l-slate-600';
                  return (
                    <button
                      key={idx}
                      onClick={() => handleEdit(activeResumeId)}
                      className={`w-full text-left p-3 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] border-l-2 ${severityColor} hover:border-orange-500/30 transition-all group`}
                    >
                      <div className="flex items-start gap-2.5">
                        <Ico className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
                        <div className="min-w-0 flex-1">
                          <div className="text-[11px] font-bold text-white group-hover:text-orange-300 transition-colors">{insight.label}</div>
                          <div className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">{insight.desc}</div>
                        </div>
                        <ArrowRight className="w-3 h-3 text-slate-700 group-hover:text-orange-400 transition-colors mt-0.5 shrink-0" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {aiInsights.length > 0 && (
              <button
                onClick={() => navigate('/ai-assistant')}
                className="w-full py-2.5 bg-gradient-to-r from-orange-500/10 to-amber-500/10 hover:from-orange-500/20 hover:to-amber-500/20 border border-orange-500/20 rounded-xl text-xs font-bold text-orange-400 flex items-center justify-center gap-1.5 transition-all relative z-10"
              >
                <Sparkles className="w-3.5 h-3.5" /> Improve with AI
              </button>
            )}
          </div>
        </motion.div>
      </div>

      {/* ─── Resume Library ─────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className="space-y-4">
        {/* Library Header */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-400" /> Resume Library
            </h2>

            {/* Tabs */}
            <div className="flex items-center gap-0.5 bg-[var(--ox-surface-primary)] p-0.5 rounded-lg border border-[var(--ox-border)]">
              {[
                { key: 'all', label: 'All', count: resumes.filter(r => !r.metadata?.isArchived).length },
                { key: 'favorites', label: '★', count: resumes.filter(r => r.metadata?.isFavorite).length },
                { key: 'archived', label: '⊟', count: resumes.filter(r => r.metadata?.isArchived).length },
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                    activeTab === tab.key
                      ? 'bg-orange-500/15 text-orange-400 shadow-sm'
                      : 'text-slate-500 hover:text-slate-300'
                  }`}
                >
                  {tab.label} {tab.count > 0 && <span className="ml-0.5 opacity-60">{tab.count}</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Search + Sort */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-600 absolute left-2.5 top-2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg pl-8 pr-3 py-1.5 text-[11px] text-[var(--ox-text-primary)] placeholder-slate-600 focus:outline-none focus:border-orange-500/40 w-36 sm:w-44 transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-[var(--ox-text-secondary)] rounded-lg px-2.5 py-1.5 text-[11px] font-semibold focus:outline-none cursor-pointer"
            >
              <option value="recent">Recent</option>
              <option value="name">Name</option>
              <option value="health">Health</option>
              <option value="ats">ATS Score</option>
            </select>
          </div>
        </div>

        {/* Resume Cards */}
        <AnimatePresence mode="popLayout">
          <div className="space-y-2">
            {filteredResumes.map((res) => {
              const health = calculateResumeHealth(res);
              const ats = calculateATSScore(res);
              const id = res.metadata?.id || res.metadata?.uuid;
              const isActive = id === activeResumeId;
              const isFav = Boolean(res.metadata?.isFavorite);

              return (
                <motion.div
                  key={id}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  className={`group flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[var(--ox-surface-primary)] border-orange-500/30 shadow-[0_0_25px_rgba(249,115,22,0.08)]'
                      : 'bg-[var(--ox-card-bg)] border-[var(--ox-border)] hover:border-slate-700'
                  }`}
                  onClick={() => handleEdit(id)}
                >
                  {/* Favorite */}
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(id); }}
                    className="p-1 shrink-0"
                  >
                    <Star className={`w-4 h-4 transition-colors ${isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-700 hover:text-amber-400'}`} />
                  </button>

                  {/* Resume info */}
                  <div className="flex-1 min-w-0">
                    {editingTitleId === id ? (
                      <form onSubmit={(e) => handleRenameSubmit(e, id)} onClick={(e) => e.stopPropagation()} className="flex items-center gap-1.5">
                        <input
                          type="text" value={titleInput} onChange={(e) => setTitleInput(e.target.value)} autoFocus
                          className="bg-slate-900 border border-orange-500/50 rounded-lg px-2 py-1 text-xs font-bold text-white focus:outline-none w-48"
                        />
                        <button type="submit" className="p-1 rounded-md bg-orange-500 text-black"><Check className="w-3 h-3" /></button>
                      </form>
                    ) : (
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm font-bold text-white truncate">{res.metadata?.title || 'Untitled'}</span>
                        {isActive && <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-orange-500/15 text-orange-400 shrink-0">Active</span>}
                      </div>
                    )}
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-0.5">
                      <span className="capitalize">{res.metadata?.template || 'modern'}</span>
                      <span>•</span>
                      <span>{relativeTime(res.metadata?.lastSaved)}</span>
                    </div>
                  </div>

                  {/* Mini scores */}
                  <div className="hidden sm:flex items-center gap-3 shrink-0">
                    <div className="text-center">
                      <div className="text-xs font-black text-white">{health.percentage}%</div>
                      <div className="text-[9px] text-slate-600 font-medium">Health</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xs font-black text-white">{ats.overallScore}</div>
                      <div className="text-[9px] text-slate-600 font-medium">ATS</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <button onClick={() => handleEdit(id)} className="p-2 rounded-xl text-slate-500 hover:text-orange-400 hover:bg-orange-500/10 transition-all" title="Edit">
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    {/* More menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === id ? null : id); }}
                        className="p-2 rounded-xl text-slate-600 hover:text-white hover:bg-slate-900 transition-all"
                      >
                        <MoreHorizontal className="w-3.5 h-3.5" />
                      </button>

                      {openMenuId === id && (
                        <div className="absolute right-0 bottom-full sm:bottom-auto sm:top-full mb-1 sm:mt-1 z-50 bg-[var(--ox-card-bg,#0B0D14)] border border-[var(--ox-border,#1F1F1F)] rounded-xl shadow-2xl py-1 min-w-[160px] animate-fadeIn text-[var(--ox-text-primary)]">
                          <button onClick={() => { setEditingTitleId(id); setTitleInput(res.metadata?.title || ''); setOpenMenuId(null); }} className="w-full px-3.5 py-2 text-left text-[11px] text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)] flex items-center gap-2 transition-colors">
                            <Pencil className="w-3 h-3 text-orange-400" /> Rename
                          </button>
                          <button onClick={() => { duplicateResume(id); setOpenMenuId(null); }} className="w-full px-3.5 py-2 text-left text-[11px] text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)] flex items-center gap-2 transition-colors">
                            <Copy className="w-3 h-3 text-orange-400" /> Duplicate
                          </button>
                          <button onClick={() => { toggleArchive(id); setOpenMenuId(null); }} className="w-full px-3.5 py-2 text-left text-[11px] text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)] flex items-center gap-2 transition-colors">
                            <Archive className="w-3 h-3 text-orange-400" /> {res.metadata?.isArchived ? 'Unarchive' : 'Archive'}
                          </button>
                          <div className="border-t border-[var(--ox-border)] my-1" />
                          <button onClick={() => { deleteResume(id); setOpenMenuId(null); }} className="w-full px-3.5 py-2 text-left text-[11px] text-red-400 hover:bg-red-500/10 flex items-center gap-2 transition-colors">
                            <Trash2 className="w-3 h-3" /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {filteredResumes.length === 0 && (
              <div className="py-12 text-center space-y-3">
                <FileText className="w-8 h-8 text-slate-700 mx-auto" />
                <p className="text-xs text-slate-500 font-medium">No resumes match your filter</p>
                <button onClick={handleCreateNew} className="px-4 py-2 bg-orange-500 text-black font-bold text-xs rounded-xl hover:bg-orange-400 transition-colors">
                  Create Resume
                </button>
              </div>
            )}
          </div>
        </AnimatePresence>
      </motion.div>

      {/* ─── Bottom Row: Sample + Import helpers ─────────────────────────── */}
      <motion.div variants={itemVariants} className="flex items-center justify-center gap-4 pt-2 pb-4">
        <button onClick={handleLoadSample} className="text-[11px] text-slate-600 hover:text-orange-400 transition-colors flex items-center gap-1">
          <PlayCircle className="w-3 h-3" /> Load Sample Resume
        </button>
        <span className="text-slate-800">·</span>
        <label className="text-[11px] text-slate-600 hover:text-orange-400 transition-colors flex items-center gap-1 cursor-pointer">
          <Upload className="w-3 h-3" /> Import JSON
          <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
        </label>
        <span className="text-slate-800">·</span>
        <span className="text-[11px] text-slate-700 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-emerald-600" /> 100% Free Forever
        </span>
      </motion.div>
    </motion.div>
  );
};
