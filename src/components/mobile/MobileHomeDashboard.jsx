import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus, Edit3, Upload, Grid, CheckCircle2, Eye, ShieldCheck,
  FileText, Copy, Trash2, ArrowRight, Sparkles, Clock
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';

export const MobileHomeDashboard = () => {
  const navigate = useNavigate();
  const {
    resumesList,
    activeResumeId,
    activeResume,
    resumeHealth,
    createNewResume,
    switchActiveResume,
    duplicateResume,
    deleteResume
  } = useResume();

  const { setActiveTab, setActiveSection, addToast } = useMobileNavigation();
  const { percentage, completedCount, totalCount } = resumeHealth;

  const handleCreateNew = () => {
    const newId = createNewResume('My New Resume');
    if (newId) {
      switchActiveResume(newId);
      setActiveTab('edit');
      setActiveSection('personal');
      addToast('New resume draft created', 'success');
    }
  };

  return (
    <div className="w-full min-h-dvh bg-[var(--ox-bg)] p-4 space-y-5 pb-28 select-none no-print">
      
      {/* Hero Card: Active Resume & Health Progress */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-[var(--ox-surface-primary)] to-[var(--ox-surface-secondary)] border border-orange-500/30 space-y-4 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-black tracking-wider text-orange-400">Current Resume</span>
            <h2 className="text-lg font-black text-[var(--ox-text-primary)] truncate max-w-[200px]">
              {activeResume.metadata?.title || 'My Resume'}
            </h2>
          </div>

          <div className="px-3 py-1.5 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-extrabold text-xs flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Health {percentage}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2 bg-[var(--ox-border)] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 rounded-full"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <p className="text-[10px] text-[var(--ox-text-muted)] font-medium">
            {completedCount} of {totalCount} sections populated
          </p>
        </div>

        {/* Primary Hero CTA */}
        <button
          onClick={() => setActiveTab('edit')}
          className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-xs shadow-lg flex items-center justify-center gap-2 min-h-[48px] active:scale-95 transition-transform"
        >
          <Edit3 className="w-4 h-4" />
          <span>Continue Editing Resume</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Action Cards Grid */}
      <div className="space-y-2">
        <h3 className="text-xs uppercase font-black text-[var(--ox-text-muted)] tracking-wider">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={handleCreateNew}
            className="p-3.5 rounded-2xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-left space-y-2 cursor-pointer min-h-[72px]"
          >
            <Plus className="w-5 h-5 text-orange-400" />
            <div>
              <span className="text-xs font-extrabold text-[var(--ox-text-primary)] block">New Resume</span>
              <span className="text-[10px] text-[var(--ox-text-muted)] block">Create blank draft</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/import')}
            className="p-3.5 rounded-2xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-left space-y-2 cursor-pointer min-h-[72px]"
          >
            <Upload className="w-5 h-5 text-purple-400" />
            <div>
              <span className="text-xs font-extrabold text-[var(--ox-text-primary)] block">Import Resume</span>
              <span className="text-[10px] text-[var(--ox-text-muted)] block">PDF / DOCX AI parser</span>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className="p-3.5 rounded-2xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-left space-y-2 cursor-pointer min-h-[72px]"
          >
            <Grid className="w-5 h-5 text-amber-400" />
            <div>
              <span className="text-xs font-extrabold text-[var(--ox-text-primary)] block">Templates</span>
              <span className="text-[10px] text-[var(--ox-text-muted)] block">ATS design gallery</span>
            </div>
          </button>

          <button
            onClick={() => navigate('/ats-checker')}
            className="p-3.5 rounded-2xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-left space-y-2 cursor-pointer min-h-[72px]"
          >
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <div>
              <span className="text-xs font-extrabold text-[var(--ox-text-primary)] block">ATS Check</span>
              <span className="text-[10px] text-[var(--ox-text-muted)] block">Score & keywords</span>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Resumes Cards List */}
      <div className="space-y-2.5">
        <h3 className="text-xs uppercase font-black text-[var(--ox-text-muted)] tracking-wider">Recent Resumes</h3>
        
        {resumesList && resumesList.length > 0 ? (
          <div className="space-y-2">
            {resumesList.map((res) => {
              const isCurrent = res.id === activeResumeId;
              const dateStr = res.updatedAt ? new Date(res.updatedAt).toLocaleDateString() : 'Recent';

              return (
                <div
                  key={res.id}
                  className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-2 ${
                    isCurrent
                      ? 'bg-orange-500/10 border-orange-500/40 text-[var(--ox-text-primary)]'
                      : 'bg-[var(--ox-surface-primary)] border-[var(--ox-border)] text-[var(--ox-text-primary)]'
                  }`}
                >
                  <button
                    onClick={() => {
                      switchActiveResume(res.id);
                      setActiveTab('edit');
                    }}
                    className="flex items-center gap-3 text-left flex-1 min-w-0"
                  >
                    <div className={`p-2.5 rounded-xl ${isCurrent ? 'bg-orange-500 text-white' : 'bg-[var(--ox-surface-secondary)] text-orange-400'}`}>
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <span className="text-xs font-bold block truncate">{res.title || 'Untitled Resume'}</span>
                      <span className="text-[10px] text-[var(--ox-text-muted)] flex items-center gap-1">
                        <Clock className="w-3 h-3" /> Updated {dateStr}
                      </span>
                    </div>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        duplicateResume(res.id);
                        addToast('Resume duplicated', 'success');
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-white min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    {resumesList.length > 1 && (
                      <button
                        onClick={() => {
                          deleteResume(res.id);
                          addToast('Resume deleted', 'info');
                        }}
                        className="p-2 rounded-xl text-rose-400 hover:text-rose-300 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-[var(--ox-text-secondary)] italic">No recent resumes found.</p>
        )}
      </div>

    </div>
  );
};

export default MobileHomeDashboard;
