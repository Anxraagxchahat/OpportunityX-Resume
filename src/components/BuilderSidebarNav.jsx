import React, { useState, useEffect } from 'react';
import {
  User, Camera, FileText, Briefcase, GraduationCap, FolderGit2,
  Cpu, Award, Trophy, Languages, Share2, Layers, ShieldCheck,
  Eye, EyeOff, ChevronLeft, ChevronRight, PanelLeftClose, PanelLeftOpen
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { isPhotoTemplate } from '../utils/photoDefaults';

export const builderSections = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'photo', label: 'Profile Photo', icon: Camera },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'socialLinks', label: 'Social Links', icon: Share2 },
  { id: 'customSections', label: 'Custom Sections', icon: Layers },
];

export const BuilderSidebarNav = ({ activeSection, onSelectSection }) => {
  const { resumeHealth, activeResume, toggleSectionVisibility } = useResume();
  const { percentage, completedCount, totalCount } = resumeHealth;
  const hiddenSections = activeResume.metadata?.hiddenSections || [];

  // Collapsed state persisted in localStorage
  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem('ox_sidebar_collapsed') === 'true';
  });

  const toggleCollapse = () => {
    setIsCollapsed(prev => {
      const next = !prev;
      localStorage.setItem('ox_sidebar_collapsed', String(next));
      return next;
    });
  };

  return (
    <aside
      className={`bg-[var(--ox-surface-primary)] border-r border-[var(--ox-border)] flex flex-col justify-between flex-shrink-0 transition-all duration-300 z-10 ${
        isCollapsed ? 'w-[72px]' : 'w-56'
      }`}
    >
      <div className="p-2 space-y-1 overflow-y-auto custom-scrollbar flex-1">
        
        {/* Top Header & Collapse Toggle */}
        <div className={`py-2 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
          {!isCollapsed && (
            <span className="text-[10px] uppercase font-black text-[var(--ox-text-muted)] tracking-wider">
              Sections
            </span>
          )}
          <button
            onClick={toggleCollapse}
            className="p-2.5 rounded-xl text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <PanelLeftOpen className="w-4 h-4 text-orange-500" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>
        </div>

        {/* Section List */}
        <div className="space-y-1">
          {builderSections.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              const isHidden = hiddenSections.includes(sec.id);

              return (
                <div key={sec.id} className="relative group">
                  <button
                    onClick={() => onSelectSection(sec.id)}
                    className={`w-full flex items-center ${
                      isCollapsed ? 'justify-center px-0' : 'gap-3 px-3'
                    } py-2.5 rounded-xl text-xs font-semibold transition-all min-h-[44px] cursor-pointer ${
                      isActive
                        ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                        : isHidden
                        ? 'text-slate-400 line-through'
                        : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)]'
                    }`}
                    title={isCollapsed ? sec.label : ''}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-orange-500' : isHidden ? 'text-slate-400' : 'text-slate-400'}`} />
                    
                    {!isCollapsed && (
                      <span className="truncate flex-1 text-left">{sec.label}</span>
                    )}

                    {/* Active Section Dot */}
                    {!isCollapsed && isActive && (
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#F97316] shrink-0" />
                    )}
                  </button>

                  {/* Eye Toggle Visibility Button (Expanded Mode) */}
                  {!isCollapsed && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSectionVisibility(sec.id);
                      }}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg opacity-40 group-hover:opacity-100 transition-opacity hover:bg-[var(--ox-surface-secondary)] min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer ${
                        isHidden ? 'text-amber-500 opacity-100' : 'text-[var(--ox-text-muted)]'
                      }`}
                      title={isHidden ? `Show ${sec.label} section in PDF` : `Hide ${sec.label} section in PDF`}
                    >
                      {isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Resume Health Indicator at Bottom */}
      <div className="p-2 border-t border-[var(--ox-border)]">
        {isCollapsed ? (
          <div className="p-2 rounded-xl bg-[var(--ox-surface-secondary)] text-center min-h-[44px] flex flex-col items-center justify-center" title={`Health Score: ${percentage}%`}>
            <span className="text-[10px] font-black text-orange-500">{percentage}%</span>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-bold">
              <span className="text-[var(--ox-text-primary)] flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Health
              </span>
              <span className="text-orange-500">{percentage}%</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-[var(--ox-border)] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-500 rounded-full"
                style={{ width: `${percentage}%` }}
              />
            </div>

            <p className="text-[9px] text-[var(--ox-text-muted)] font-medium">
              {completedCount} of {totalCount} sections complete
            </p>
          </div>
        )}
      </div>
    </aside>
  );
};
