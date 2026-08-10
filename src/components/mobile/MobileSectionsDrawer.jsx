import React from 'react';
import { X, ShieldCheck, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';
import { builderSections } from './MobileSectionNav';

export const MobileSectionsDrawer = () => {
  const { activeResume, resumeHealth, toggleSectionVisibility } = useResume();
  const { isSectionDrawerOpen, setIsSectionDrawerOpen, activeSection, setActiveSection } = useMobileNavigation();
  const { percentage, completedCount, totalCount } = resumeHealth;
  const hiddenSections = activeResume.metadata?.hiddenSections || [];

  if (!isSectionDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-fadeIn no-print">
      <div className="bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] rounded-t-3xl w-full max-h-[85dvh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--ox-border)] flex items-center justify-between bg-[var(--ox-surface-secondary)]/50">
          <div>
            <h3 className="text-base font-black text-[var(--ox-text-primary)]">Resume Sections</h3>
            <p className="text-xs text-[var(--ox-text-secondary)]">Jump to any section or toggle PDF visibility</p>
          </div>
          <button
            onClick={() => setIsSectionDrawerOpen(false)}
            className="p-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Health Score Summary */}
        <div className="p-4 bg-orange-500/5 border-b border-[var(--ox-border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="flex items-center gap-1.5 text-[var(--ox-text-primary)]">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Resume Completion Health
            </span>
            <span className="text-orange-500">{percentage}%</span>
          </div>
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

        {/* Section List */}
        <div className="p-3 space-y-1.5 overflow-y-auto custom-scrollbar flex-1 pb-safe">
          {builderSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            const isHidden = hiddenSections.includes(sec.id);

            return (
              <div
                key={sec.id}
                className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                  isActive
                    ? 'bg-orange-500/10 border-orange-500/40 text-orange-500'
                    : isHidden
                    ? 'bg-[var(--ox-surface-secondary)]/40 border-transparent opacity-60'
                    : 'bg-[var(--ox-surface-secondary)] border-[var(--ox-border)] text-[var(--ox-text-primary)]'
                }`}
              >
                <button
                  onClick={() => {
                    setActiveSection(sec.id);
                    setIsSectionDrawerOpen(false);
                  }}
                  className="flex items-center gap-3 flex-1 text-left min-h-[44px] cursor-pointer"
                >
                  <div className={`p-2 rounded-xl ${isActive ? 'bg-orange-500 text-white' : 'bg-[var(--ox-surface-primary)] text-orange-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold ${isHidden ? 'line-through text-slate-400' : ''}`}>
                      {sec.label}
                    </span>
                    {isActive && <span className="text-[10px] text-orange-400 font-medium">Currently Active</span>}
                  </div>
                </button>

                {/* Eye Visibility Toggle */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionVisibility(sec.id);
                  }}
                  className={`p-2 rounded-xl transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer ${
                    isHidden
                      ? 'text-amber-500 bg-amber-500/10'
                      : 'text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)]'
                  }`}
                  title={isHidden ? `Show ${sec.label} in PDF` : `Hide ${sec.label} in PDF`}
                >
                  {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};

export default MobileSectionsDrawer;
