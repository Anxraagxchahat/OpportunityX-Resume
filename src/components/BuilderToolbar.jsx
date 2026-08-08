import React, { useState } from 'react';
import {
  Undo2,
  Redo2,
  Save,
  Download,
  Upload,
  History,
  Edit3,
  Check,
  Sparkles,
  FileText,
  Copy,
  Eye,
  Keyboard,
  Key,
  Activity,
  UserCheck,
  Palette,
  Image as ImageIcon
} from 'lucide-react';
import { GithubIcon as Github } from './GithubIcon';
import { useResume } from '../context/ResumeContext';

export const BuilderToolbar = ({ onOpenVersionHistory, onTogglePreview, isMobilePreviewActive }) => {
  const {
    activeResume,
    saveStatus,
    lastSavedTimeStr,
    undo,
    redo,
    canUndo,
    canRedo,
    renameResume,
    loadDemoResume,
    duplicateResume,
    activeResumeId,
    setIsKeyboardHelpOpen,
    setIsBYOKModalOpen,
    setIsInspectorOpen,
    setIsAssetManagerOpen,
    setIsExportCenterOpen,
    setIsThemeCustomizerOpen,
    setIsProfilePresetsOpen,
    setIsGitHubImportModalOpen,
    setIsOpportunityXImportModalOpen
  } = useResume();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(activeResume.metadata?.title || 'My Resume');

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (titleInput.trim()) {
      renameResume(activeResumeId, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="bg-[var(--ox-surface-primary)] backdrop-blur-md border-b border-[var(--ox-border)] px-4 py-2 sticky top-0 z-30 flex items-center justify-between gap-4 transition-colors duration-300 no-print">
      {/* Left: Title & Auto Save Status */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <form onSubmit={handleTitleSubmit} className="flex items-center gap-1.5">
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                autoFocus
                className="bg-[var(--ox-card-bg)] border border-orange-500/50 rounded-lg px-2.5 py-1 text-sm font-semibold text-[var(--ox-text-primary)] focus:outline-none"
              />
              <button
                type="submit"
                className="p-1 rounded-md bg-orange-500 text-white hover:bg-orange-600 transition-colors"
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => {
                setTitleInput(activeResume.metadata?.title || '');
                setIsEditingTitle(true);
              }}
              className="flex items-center gap-1.5 text-sm font-bold text-[var(--ox-text-primary)] hover:text-orange-400 transition-colors truncate max-w-xs group"
            >
              <span className="truncate">{activeResume.metadata?.title}</span>
              <Edit3 className="w-3.5 h-3.5 text-[var(--ox-text-muted)] group-hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>

        {/* Real-time Save Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-[var(--ox-text-secondary)] border-l border-[var(--ox-border)] pl-3">
          <Save className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-medium text-[var(--ox-text-primary)]">{saveStatus}</span>
          <span className="text-[10px] text-[var(--ox-text-muted)]">({lastSavedTimeStr})</span>
        </div>

        {/* Core Guarantee Pill */}
        <div className="hidden xl:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
          ✓ Free Forever Builder • Unlimited PDFs • No Watermark
        </div>
      </div>

      {/* Center/Right Toolbar Actions */}
      <div className="flex items-center gap-1.5">
        {/* Undo / Redo */}
        <div className="flex items-center bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-lg p-0.5 mr-1">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="p-1.5 rounded-md text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] disabled:opacity-30 disabled:hover:text-[var(--ox-text-secondary)] transition-all"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="p-1.5 rounded-md text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] disabled:opacity-30 disabled:hover:text-[var(--ox-text-secondary)] transition-all"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* OpportunityX Ecosystem Sync Button */}
        <button
          onClick={() => setIsOpportunityXImportModalOpen(true)}
          className="hidden md:flex px-2.5 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-xs font-semibold text-orange-400 items-center gap-1.5 transition-all"
          title="Sync verified profile & achievements from OpportunityX"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ecosystem</span>
        </button>

        {/* GitHub Import Button */}
        <button
          onClick={() => setIsGitHubImportModalOpen(true)}
          className="hidden md:flex px-2.5 py-1.5 rounded-lg bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-xs font-semibold text-purple-400 items-center gap-1.5 transition-all"
          title="Import profile & repos from GitHub"
        >
          <Github className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </button>

        {/* Profile Presets Modal Button */}
        <button
          onClick={() => setIsProfilePresetsOpen(true)}
          className="hidden md:flex px-2.5 py-1.5 rounded-lg bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-xs font-semibold text-[var(--ox-text-primary)] items-center gap-1.5 transition-all"
          title="Target Profile Presets"
        >
          <UserCheck className="w-3.5 h-3.5 text-orange-400" />
          <span>Presets</span>
        </button>

        {/* Theme & Design Customizer */}
        <button
          onClick={() => setIsThemeCustomizerOpen(true)}
          className="hidden lg:flex px-2.5 py-1.5 rounded-lg bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-xs font-semibold text-[var(--ox-text-primary)] items-center gap-1.5 transition-all"
          title="Resume Styling & Typography"
        >
          <Palette className="w-3.5 h-3.5 text-amber-400" />
          <span>Theme</span>
        </button>

        {/* Asset Manager */}
        <button
          onClick={() => setIsAssetManagerOpen(true)}
          className="p-2 rounded-lg bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] transition-all"
          title="Asset Manager (Photos & Signatures)"
        >
          <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
        </button>

        {/* Resume Inspector */}
        <button
          onClick={() => setIsInspectorOpen(true)}
          className="p-2 rounded-lg bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] transition-all"
          title="Resume Quality Inspector"
        >
          <Activity className="w-3.5 h-3.5 text-orange-400" />
        </button>

        {/* Version History Button */}
        <button
          onClick={onOpenVersionHistory}
          className="hidden sm:flex px-2.5 py-1.5 rounded-lg bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] text-xs font-semibold text-[var(--ox-text-primary)] items-center gap-1.5 transition-all"
          title="Version History Snapshots"
        >
          <History className="w-3.5 h-3.5 text-blue-400" />
          <span className="hidden xl:inline">Versions</span>
        </button>

        {/* Export Center Modal Button */}
        <button
          onClick={() => setIsExportCenterOpen(true)}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
          title="Export Center (PDF, JSON, Text, Share)"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Export Center</span>
        </button>

        {/* Mobile Toggle Preview Button */}
        <button
          onClick={onTogglePreview}
          className="md:hidden p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1"
        >
          <Eye className="w-4 h-4" />
          <span>{isMobilePreviewActive ? 'Edit' : 'Preview'}</span>
        </button>
      </div>
    </div>
  );
};
