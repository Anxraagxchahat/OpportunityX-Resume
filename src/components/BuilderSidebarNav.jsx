import React, { useState } from 'react';
import {
  User, Camera, FileText, Briefcase, GraduationCap, FolderGit2,
  Cpu, Award, Trophy, Languages, Share2, Layers, ShieldCheck,
  Eye, EyeOff, Pin, PinOff
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
  const hiddenSections = activeResume?.metadata?.hiddenSections || [];
  const templateId = activeResume?.metadata?.template || 'modern';
  const hasPhotoSupport = isPhotoTemplate(templateId);

  const visibleSections = builderSections.filter((sec) => sec.id !== 'photo' || hasPhotoSupport);

  // Pinned state persisted in localStorage; Hover state triggers Instagram-like expansion
  const [isPinned, setIsPinned] = useState(() => {
    return localStorage.getItem('ox_sidebar_pinned') === 'true';
  });
  const [isHovered, setIsHovered] = useState(false);

  const togglePin = () => {
    setIsPinned(prev => {
      const next = !prev;
      localStorage.setItem('ox_sidebar_pinned', String(next));
      return next;
    });
  };

  // Instagram-style expansion: expanded if pinned or hovered
  const isExpanded = isPinned || isHovered;
  const isCollapsed = !isExpanded;

  return (
    <aside
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-[var(--ox-surface-primary)] border-r border-[var(--ox-border)] flex flex-col justify-between flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] z-20 select-none overflow-x-hidden ${
        isExpanded ? 'w-56 shadow-2xl' : 'w-[72px]'
      }`}
    >
      <div className="p-2 space-y-1 flex-1 flex flex-col overflow-y-auto custom-scrollbar">
        
        {/* Top Header & Pin Toggle */}
        <div className="py-2 flex items-center justify-between px-2 h-11 shrink-0">
          <span className={`text-[10px] uppercase font-black text-[var(--ox-text-muted)] tracking-widest transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap overflow-hidden ${
            isExpanded ? 'max-w-[100px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-2'
          }`}>
            Sections
          </span>
          
          <button
            onClick={togglePin}
            className={`p-2 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-center shrink-0 ${
              isCollapsed ? 'mx-auto' : ''
            } ${
              isPinned
                ? 'text-orange-500 bg-orange-500/10 border border-orange-500/30'
                : 'text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)]'
            }`}
            title={isPinned ? 'Unpin Sidebar (Auto-collapse on mouse leave)' : 'Pin Sidebar (Keep expanded)'}
          >
            {isPinned ? <Pin className="w-4 h-4 text-orange-500" /> : <PinOff className="w-4 h-4" />}
          </button>
        </div>

        {/* Section List */}
        <div className="space-y-1 flex-1">
          {visibleSections.map((sec) => {
            const Icon = sec.icon;
            const isActive = activeSection === sec.id;
            const isHidden = hiddenSections.includes(sec.id);

            return (
              <div key={sec.id} className="relative group flex items-center justify-center">
                <button
                  onClick={() => onSelectSection(sec.id)}
                  className={`flex items-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] cursor-pointer ${
                    isExpanded
                      ? 'w-full pl-3.5 pr-10 justify-start gap-3 rounded-xl min-h-[44px]'
                      : 'w-11 h-11 justify-center rounded-2xl mx-auto'
                  } ${
                    isActive
                      ? 'bg-orange-500/10 text-orange-500 border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                      : isHidden
                      ? 'text-slate-400 line-through'
                      : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)]'
                  }`}
                  title={isCollapsed ? sec.label : ''}
                >
                  <Icon className={`w-4 h-4 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-orange-500' : isHidden ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  
                  {/* Text Label (Visible when expanded) */}
                  <span className={`truncate text-left font-semibold transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] whitespace-nowrap overflow-hidden ${
                    isExpanded ? 'max-w-[120px] opacity-100 translate-x-0' : 'max-w-0 opacity-0 -translate-x-2 hidden'
                  }`}>
                    {sec.label}
                  </span>

                  {/* Active Section Dot (Expanded Mode) */}
                  {isExpanded && isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shadow-[0_0_8px_#F97316] shrink-0 self-center my-auto ml-auto" />
                  )}
                </button>

                {/* Eye Toggle Visibility Button (Expanded Mode) */}
                {isExpanded && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleSectionVisibility(sec.id);
                    }}
                    className={`absolute right-1.5 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:bg-[var(--ox-surface-secondary)] w-7 h-7 flex items-center justify-center cursor-pointer ${
                      isHidden ? 'text-amber-400 opacity-100' : 'text-[var(--ox-text-muted)] opacity-60 group-hover:opacity-100 hover:text-[var(--ox-text-primary)]'
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
      <div className="p-2 border-t border-[var(--ox-border)] shrink-0">
        {/* Collapsed State Health Badge */}
        <div className={`w-11 h-11 mx-auto rounded-2xl bg-[var(--ox-surface-secondary)] text-center flex flex-col items-center justify-center transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isCollapsed ? 'opacity-100 scale-100 block' : 'opacity-0 scale-90 pointer-events-none hidden'
        }`} title={`Health Score: ${percentage}%`}>
          <span className="text-[10px] font-black text-orange-500">{percentage}%</span>
        </div>

        {/* Expanded State Health Progress Card */}
        <div className={`p-3 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-2 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isExpanded ? 'opacity-100 translate-y-0 block' : 'opacity-0 translate-y-2 pointer-events-none hidden'
        }`}>
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
      </div>
    </aside>
  );
};
