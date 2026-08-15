import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Edit3, Download, ScanLine, Sparkles, ShieldCheck, Zap,
  Plus, Upload, LayoutTemplate, Bot, Search, Star, Archive, Trash2,
  Copy, MoreHorizontal, Check, Lightbulb, MessageSquareText, Briefcase,
  FolderGit2, Globe, CheckCircle2, ArrowRight
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { calculateResumeHealth } from '../../utils/resumeHealth';
import { calculateATSScore } from '../../utils/atsEngine';
import { TabletTopBar } from './TabletTopBar';

export const TabletHomeDashboard = () => {
  const navigate = useNavigate();
  const {
    resumes, activeResume, activeResumeId, setActiveResumeId,
    createNewResume, duplicateResume, deleteResume, renameResume,
    toggleFavorite, toggleArchive, loadDemoResume, importResumeJSON,
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

  const handleEdit = (id) => { setActiveResumeId(id); navigate('/builder'); };
  const handleCreateNew = () => { createNewResume('modern'); navigate('/builder'); };

  return (
    <div className="w-full min-h-dvh bg-[var(--ox-bg)] text-[var(--ox-text-primary)] font-sans flex flex-col transition-colors duration-300">
      {/* ─── Exact One Dedicated Tablet Top Navigation ─── */}
      <TabletTopBar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 space-y-6 overflow-y-auto custom-scrollbar">

        {/* ─── 1. TOP HERO CARD + RESUME METRICS GRID ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {/* Active Resume Hero */}
          <div className="md:col-span-8 p-5 sm:p-6 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-4 relative overflow-hidden shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-orange-400">
                  Active Resume
                </span>
                <h1 className="text-xl sm:text-2xl font-black text-[var(--ox-text-primary)] truncate mt-0.5">
                  {activeResume?.metadata?.title || 'Untitled Resume'}
                </h1>
                <p className="text-xs text-[var(--ox-text-secondary)] mt-0.5 capitalize">
                  Template: {activeResume?.metadata?.template || 'modern'}
                </p>
              </div>

              {/* ATS Badge */}
              <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 shrink-0">
                <span className="text-xl font-black text-emerald-400 leading-none">{activeATS.overallScore}</span>
                <span className="text-[9px] font-bold text-[var(--ox-text-secondary)] mt-1 uppercase">ATS Score</span>
              </div>
            </div>

            {/* Health Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[var(--ox-text-secondary)]">Resume Health</span>
                <span className="text-[var(--ox-text-primary)] font-bold">{activeHealth.percentage}%</span>
              </div>
              <div className="w-full h-2.5 bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                  style={{ width: `${activeHealth.percentage}%` }}
                />
              </div>
            </div>

            {/* Hero Actions (Equal 44px min-height) */}
            <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap pt-1">
              <button
                type="button"
                onClick={() => handleEdit(activeResumeId)}
                className="min-h-[44px] px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Edit3 className="w-4 h-4" /> Continue Editing
              </button>
              <button
                type="button"
                onClick={() => setIsExportCenterOpen(true)}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-[var(--ox-text-primary)] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] hover:border-orange-500/40 rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Download className="w-4 h-4 text-orange-400" /> Export PDF
              </button>
              <button
                type="button"
                onClick={() => navigate('/ats-checker')}
                className="min-h-[44px] px-4 py-2 text-xs font-semibold text-[var(--ox-text-primary)] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] hover:border-orange-500/40 rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ScanLine className="w-4 h-4 text-emerald-400" /> ATS Check
              </button>
            </div>
          </div>

          {/* Quick Metrics (Right Column) */}
          <div className="md:col-span-4 grid grid-cols-2 md:grid-cols-1 gap-3 sm:gap-4">
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] flex items-center gap-3.5 shadow-md">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-400 shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-black text-[var(--ox-text-primary)]">{resumes.length}</div>
                <div className="text-xs text-[var(--ox-text-secondary)] font-medium">Total Resumes</div>
              </div>
            </div>

            <div
              onClick={() => (session?.isAuthenticated ? setIsBuyCreditsModalOpen(true) : setIsUnlockAIModalOpen(true))}
              className="p-4 sm:p-5 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] flex items-center gap-3.5 cursor-pointer hover:border-orange-500/40 transition-all shadow-md active:scale-95"
            >
              <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400 shrink-0">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="text-xl font-black text-[var(--ox-text-primary)]">{aiCredits?.remaining || 5}</div>
                <div className="text-xs text-[var(--ox-text-secondary)] font-medium">AI Credits</div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── 2. MIDDLE: QUICK ACTIONS & RESUME LIBRARY ─── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-5">
          {/* Quick Actions Grid */}
          <div className="md:col-span-5 p-5 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3.5 shadow-md">
            <h3 className="text-xs font-bold text-[var(--ox-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-orange-400" /> Quick Actions
            </h3>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleCreateNew}
                className="p-3.5 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-left hover:border-orange-500/40 transition-all cursor-pointer min-h-[64px]"
              >
                <Plus className="w-4 h-4 text-orange-400 mb-1" />
                <div className="text-xs font-bold text-[var(--ox-text-primary)]">New Resume</div>
              </button>
              <button
                type="button"
                onClick={() => navigate('/import')}
                className="p-3.5 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-left hover:border-orange-500/40 transition-all cursor-pointer min-h-[64px]"
              >
                <Upload className="w-4 h-4 text-blue-400 mb-1" />
                <div className="text-xs font-bold text-[var(--ox-text-primary)]">Import Resume</div>
              </button>
              <button
                type="button"
                onClick={() => navigate('/templates')}
                className="p-3.5 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-left hover:border-orange-500/40 transition-all cursor-pointer min-h-[64px]"
              >
                <LayoutTemplate className="w-4 h-4 text-purple-400 mb-1" />
                <div className="text-xs font-bold text-[var(--ox-text-primary)]">Templates</div>
              </button>
              <button
                type="button"
                onClick={() => navigate('/ats-checker')}
                className="p-3.5 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-left hover:border-orange-500/40 transition-all cursor-pointer min-h-[64px]"
              >
                <ScanLine className="w-4 h-4 text-emerald-400 mb-1" />
                <div className="text-xs font-bold text-[var(--ox-text-primary)]">ATS Check</div>
              </button>
            </div>
          </div>

          {/* Resume Library List */}
          <div className="md:col-span-7 p-5 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3.5 shadow-md">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-xs font-bold text-[var(--ox-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-orange-400" /> Resume Library ({filteredResumes.length})
              </h3>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl px-3 py-1.5 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500 w-36 sm:w-44"
              />
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {filteredResumes.map((res, idx) => {
                const id = res.metadata?.id || res.metadata?.uuid;
                const isActive = id === activeResumeId;
                return (
                  <div
                    key={id}
                    onClick={() => handleEdit(id)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-orange-500/10 border-orange-500/40 shadow-sm'
                        : 'bg-[var(--ox-surface-primary)] border-[var(--ox-border)] hover:border-orange-500/30'
                    }`}
                  >
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-[var(--ox-text-primary)] truncate">{res.metadata?.title || 'Untitled'}</div>
                      <div className="text-[10px] text-[var(--ox-text-secondary)] capitalize">{res.metadata?.template || 'modern'}</div>
                    </div>
                    <div className="flex items-center gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => handleEdit(id)}
                        className="p-2 rounded-lg text-[var(--ox-text-secondary)] hover:text-orange-400 hover:bg-orange-500/10 transition-all cursor-pointer"
                        title="Edit Resume"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      {/* More dropdown menu */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === id ? null : id); }}
                          className="p-2 rounded-lg text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)] transition-all cursor-pointer"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </button>

                        {openMenuId === id && (
                          <div className={`absolute right-0 z-[100] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl shadow-2xl py-1 min-w-[150px] text-[var(--ox-text-primary)] ${
                            idx > 0 || filteredResumes.length > 2 ? 'bottom-full mb-1' : 'top-full mt-1'
                          }`}>
                            <button onClick={() => { duplicateResume(id); setOpenMenuId(null); }} className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--ox-surface-primary)] flex items-center gap-2 cursor-pointer">
                              <Copy className="w-3.5 h-3.5 text-orange-400" /> Duplicate
                            </button>
                            <button onClick={() => { toggleArchive(id); setOpenMenuId(null); }} className="w-full px-3 py-2 text-left text-xs hover:bg-[var(--ox-surface-primary)] flex items-center gap-2 cursor-pointer">
                              <Archive className="w-3.5 h-3.5 text-orange-400" /> {res.metadata?.isArchived ? 'Unarchive' : 'Archive'}
                            </button>
                            <div className="border-t border-[var(--ox-border)] my-1" />
                            <button onClick={() => { deleteResume(id); setOpenMenuId(null); }} className="w-full px-3 py-2 text-left text-xs text-red-400 hover:bg-red-500/10 flex items-center gap-2 cursor-pointer">
                              <Trash2 className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default TabletHomeDashboard;
