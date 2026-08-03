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
  Key
} from 'lucide-react';
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
    exportActiveResumeJSON,
    setIsKeyboardHelpOpen,
    setIsBYOKModalOpen
  } = useResume();

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(activeResume.metadata?.title || 'My Resume');
  const [showExportMenu, setShowExportMenu] = useState(false);

  const handleTitleSubmit = (e) => {
    e.preventDefault();
    if (titleInput.trim()) {
      renameResume(activeResumeId, titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  const handleDownloadPDF = () => {
    window.print();
  };

  return (
    <div className="bg-[#0B0D14]/90 backdrop-blur-md border-b border-slate-800 px-4 py-2 sticky top-0 z-30 flex items-center justify-between gap-4">
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
                className="bg-slate-900 border border-orange-500/50 rounded-lg px-2.5 py-1 text-sm font-semibold text-white focus:outline-none"
              />
              <button
                type="submit"
                className="p-1 rounded-md bg-orange-500 text-black hover:bg-orange-400 transition-colors"
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
              className="flex items-center gap-1.5 text-sm font-bold text-white hover:text-orange-400 transition-colors truncate max-w-xs group"
            >
              <span className="truncate">{activeResume.metadata?.title}</span>
              <Edit3 className="w-3.5 h-3.5 text-slate-500 group-hover:text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
            </button>
          )}
        </div>

        {/* Real-time Save Status Badge */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 border-l border-slate-800 pl-3">
          <Save className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="font-medium text-slate-300">{saveStatus}</span>
          <span className="text-[10px] text-slate-500">({lastSavedTimeStr})</span>
        </div>
      </div>

      {/* Center/Right Toolbar Actions */}
      <div className="flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-900/80 border border-slate-800 rounded-lg p-0.5">
          <button
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-md text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-md text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        {/* Keyboard Shortcuts Help */}
        <button
          onClick={() => setIsKeyboardHelpOpen(true)}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
          title="Keyboard Shortcuts (Ctrl+/)"
        >
          <Keyboard className="w-4 h-4 text-orange-400" />
        </button>

        {/* BYOK Settings Key */}
        <button
          onClick={() => setIsBYOKModalOpen(true)}
          className="p-1.5 text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-lg hover:border-slate-700 transition-colors"
          title="Bring Your Own API Key"
        >
          <Key className="w-4 h-4 text-amber-400" />
        </button>

        {/* Duplicate Current Resume */}
        <button
          onClick={() => duplicateResume(activeResumeId)}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg transition-colors"
          title="Duplicate Resume (Ctrl+D)"
        >
          <Copy className="w-3.5 h-3.5 text-slate-400" />
          <span>Duplicate</span>
        </button>

        {/* Version History */}
        <button
          onClick={onOpenVersionHistory}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 hover:text-white rounded-lg transition-colors"
        >
          <History className="w-3.5 h-3.5 text-orange-400" />
          <span>History</span>
        </button>

        {/* Try Demo Resume Button */}
        <button
          onClick={loadDemoResume}
          className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-orange-400 bg-orange-500/10 border border-orange-500/30 hover:bg-orange-500/20 rounded-lg transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Sample Resume</span>
        </button>

        {/* Mobile Toggle Preview Button */}
        <button
          onClick={onTogglePreview}
          className="lg:hidden px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg flex items-center gap-1"
        >
          <Eye className="w-3.5 h-3.5 text-orange-400" />
          <span>{isMobilePreviewActive ? 'Edit Form' : 'Preview'}</span>
        </button>

        {/* Download PDF & Export Dropdown */}
        <div className="relative">
          <button
            onClick={handleDownloadPDF}
            className="px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.3)] transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Download PDF</span>
          </button>
        </div>
      </div>
    </div>
  );
};
