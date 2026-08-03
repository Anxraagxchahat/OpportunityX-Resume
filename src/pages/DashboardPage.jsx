import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus,
  Sparkles,
  FileText,
  Upload,
  Copy,
  Trash2,
  Edit3,
  Clock,
  PlayCircle,
  ShieldCheck,
  Check,
  Zap,
  Key
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { ResumeHealthCard } from '../components/ResumeHealthCard';
import { AICreditsCard } from '../components/AICreditsCard';
import { FreeForeverBadge } from '../components/FreeForeverBadge';
import { calculateResumeHealth } from '../utils/resumeHealth';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const {
    resumes,
    activeResumeId,
    setActiveResumeId,
    createNewResume,
    duplicateResume,
    deleteResume,
    renameResume,
    loadDemoResume,
    importResumeJSON,
    setIsBYOKModalOpen
  } = useResume();

  const [editingTitleId, setEditingTitleId] = useState(null);
  const [titleInput, setTitleInput] = useState('');

  const handleEdit = (id) => {
    setActiveResumeId(id);
    navigate('/builder');
  };

  const handleCreateNew = () => {
    const newId = createNewResume('modern');
    navigate('/builder');
  };

  const handleLoadSample = () => {
    loadDemoResume();
    navigate('/builder');
  };

  const handleRenameSubmit = (e, id) => {
    e.preventDefault();
    if (titleInput.trim()) {
      renameResume(id, titleInput.trim());
    }
    setEditingTitleId(null);
  };

  const handleImportFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result;
      if (content && importResumeJSON(content)) {
        navigate('/builder');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Dashboard Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            <span>Resume Dashboard</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
              100% Free Forever
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Create, edit, and manage your local JSON resumes for OpportunityX Career OS.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <button
            onClick={handleLoadSample}
            className="px-4 py-2 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl transition-all flex items-center gap-1.5"
          >
            <PlayCircle className="w-4 h-4" /> Try Sample Resume
          </button>
          <button
            onClick={handleCreateNew}
            className="px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Create New Resume
          </button>
        </div>
      </div>

      {/* Top Widgets Grid: Health + AI Credits + Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Saved Resumes Card */}
        <div className="cyber-glass-card p-5 space-y-3 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>Local Resume Drafts</span>
            <FileText className="w-4 h-4 text-orange-400" />
          </div>
          <div>
            <div className="text-3xl font-black text-white">{resumes.length}</div>
            <p className="text-[11px] text-slate-500 pt-1">Stored safely in browser LocalStorage</p>
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">JSON Schema v1.0</span>
            <span className="text-emerald-400 font-semibold">Zero Server Upload</span>
          </div>
        </div>

        {/* AI Credits Card Widget */}
        <AICreditsCard />

        {/* Active Resume Health Widget */}
        <ResumeHealthCard resumeData={resumes.find((r) => r.metadata?.id === activeResumeId) || resumes[0]} />
      </div>

      {/* Main Content Grid: Resume Collection Grid + Quick Tools */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Resume Collection Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-orange-400" /> Saved Resumes Collection ({resumes.length})
            </h2>
            <span className="text-xs text-slate-400">Click card to edit in builder</span>
          </div>

          {/* Resumes List Cards */}
          <div className="space-y-4">
            {resumes.map((res) => {
              const health = calculateResumeHealth(res);
              const isActive = res.metadata?.id === activeResumeId;
              const formattedDate = res.metadata?.lastSaved
                ? new Date(res.metadata.lastSaved).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : 'Recently';

              return (
                <div
                  key={res.metadata?.id}
                  className={`cyber-glass-card p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border ${
                    isActive ? 'border-orange-500/60 shadow-[0_0_20px_rgba(249,115,22,0.15)] bg-[#0E111B]' : 'hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      {editingTitleId === res.metadata?.id ? (
                        <form onSubmit={(e) => handleRenameSubmit(e, res.metadata.id)} className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={titleInput}
                            onChange={(e) => setTitleInput(e.target.value)}
                            autoFocus
                            className="bg-slate-900 border border-orange-500/50 rounded-lg px-2.5 py-1 text-xs font-bold text-white focus:outline-none"
                          />
                          <button type="submit" className="p-1 rounded-md bg-orange-500 text-black">
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      ) : (
                        <button
                          onClick={() => {
                            setEditingTitleId(res.metadata.id);
                            setTitleInput(res.metadata.title);
                          }}
                          className="text-base font-bold text-white hover:text-orange-400 transition-colors truncate max-w-sm text-left flex items-center gap-1.5 group"
                        >
                          <span className="truncate">{res.metadata?.title || 'Untitled Resume'}</span>
                          <Edit3 className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </button>
                      )}

                      {isActive && (
                        <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40">
                          Active Draft
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-400 flex-wrap">
                      <span>Template: <strong className="text-slate-300 capitalize">{res.metadata?.template || 'modern'}</strong></span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" /> {formattedDate}
                      </span>
                      <span>•</span>
                      <span className={`font-bold ${health.badgeColor.split(' ')[0]}`}>
                        Health: {health.percentage}%
                      </span>
                    </div>

                    {/* Missing Sections tags preview */}
                    {health.missingSections.length > 0 && (
                      <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5 flex-wrap">
                        <span className="text-amber-400 font-semibold">Missing:</span>
                        {health.missingSections.slice(0, 3).map((m) => (
                          <span key={m} className="px-2 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800 text-[10px]">
                            {m}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800/80">
                    <button
                      onClick={() => handleEdit(res.metadata.id)}
                      className="px-4 py-2 text-xs font-extrabold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>

                    <button
                      onClick={() => duplicateResume(res.metadata.id)}
                      className="p-2 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                      title="Duplicate Resume"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteResume(res.metadata.id)}
                      className="p-2 text-slate-400 hover:text-red-400 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors"
                      title="Delete Resume"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Quick Tools & OpportunityX Free Guarantee */}
        <div className="space-y-6">
          {/* Quick Actions Panel */}
          <div className="cyber-glass-card p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-orange-400" /> Quick Actions
            </h3>
            <div className="space-y-2">
              <button
                onClick={handleLoadSample}
                className="w-full p-2.5 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-semibold text-orange-400 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <PlayCircle className="w-4 h-4" /> Load Sample Resume
                </span>
                <span>→</span>
              </button>

              <label className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between cursor-pointer transition-colors">
                <span className="flex items-center gap-2">
                  <Upload className="w-4 h-4 text-slate-400" /> Import JSON File
                </span>
                <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
                <span>→</span>
              </label>

              <button
                onClick={() => setIsBYOKModalOpen(true)}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-amber-400" /> API Keys Settings (BYOK)
                </span>
                <span>→</span>
              </button>
            </div>
          </div>

          {/* OpportunityX Free Forever Guarantee Banner */}
          <FreeForeverBadge />
        </div>
      </div>
    </div>
  );
};
