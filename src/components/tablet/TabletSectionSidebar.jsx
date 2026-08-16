import React from 'react';
import {
  User, Camera, FileText, Briefcase, GraduationCap, FolderGit2, Cpu, Award,
  Trophy, Languages, Share2, Layers, CheckCircle2, AlertCircle, Eye, EyeOff
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { isPhotoTemplate } from '../../utils/photoDefaults';

const ALL_SECTIONS = [
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
  { id: 'customSections', label: 'Custom Sections', icon: Layers }
];

export const TabletSectionSidebar = ({ activeSection, onSelectSection }) => {
  const { activeResume, toggleSectionVisibility } = useResume();

  const hiddenSections = activeResume?.metadata?.hiddenSections || [];
  const visibleSections = ALL_SECTIONS;

  // Determine section completion status dynamically
  const isSectionComplete = (secId) => {
    if (!activeResume) return false;
    const p = activeResume.personal || {};
    if (secId === 'personal') return Boolean(p.fullName && p.email);
    if (secId === 'photo') return Boolean(activeResume.assets?.profilePhoto);
    if (secId === 'summary') return Boolean(p.summary && p.summary.trim().length >= 20);
    if (secId === 'experience') return Array.isArray(activeResume.experience) && activeResume.experience.length > 0;
    if (secId === 'education') return Array.isArray(activeResume.education) && activeResume.education.length > 0;
    if (secId === 'projects') return Array.isArray(activeResume.projects) && activeResume.projects.length > 0;
    if (secId === 'skills') {
      const s = activeResume.skills || {};
      return Boolean(s.languages?.length || s.frameworks?.length || s.tools?.length || (Array.isArray(s) && s.length > 0));
    }
    if (secId === 'certificates') return Array.isArray(activeResume.certificates) && activeResume.certificates.length > 0;
    if (secId === 'achievements') return Array.isArray(activeResume.achievements) && activeResume.achievements.length > 0;
    if (secId === 'languages') return Array.isArray(activeResume.languages) && activeResume.languages.length > 0;
    if (secId === 'socialLinks') return Boolean(activeResume.socialLinks && Object.values(activeResume.socialLinks).some(Boolean));
    if (secId === 'customSections') return Array.isArray(activeResume.customSections) && activeResume.customSections.length > 0;
    return false;
  };

  return (
    <aside className="w-[185px] sm:w-[200px] min-w-[185px] max-w-[210px] bg-[var(--ox-surface-primary)] border-r border-[var(--ox-border)] py-3 px-2 flex flex-col justify-between select-none h-full overflow-y-auto custom-scrollbar no-print transition-colors duration-300">
      <div className="space-y-1">
        <div className="px-2 pb-2 text-[10px] font-extrabold uppercase tracking-widest text-[var(--ox-text-secondary)]">
          Sections
        </div>

        {visibleSections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          const complete = isSectionComplete(sec.id);
          const isHidden = hiddenSections.includes(sec.id);

          return (
            <div
              key={sec.id}
              className={`group flex items-center justify-between px-3 min-h-[44px] rounded-xl text-xs font-semibold cursor-pointer transition-all duration-200 ${
                isActive
                  ? 'bg-[#F97316]/15 text-[#F97316] font-bold border border-[#F97316]/30 shadow-sm'
                  : 'text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)] border border-transparent'
              }`}
              onClick={() => onSelectSection(sec.id)}
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#F97316]' : 'text-slate-400'}`} />
                <span className="truncate">{sec.label}</span>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-1.5">
                {/* Completion Indicator */}
                {complete ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400/60 shrink-0" />
                )}

                {/* Visibility Toggle Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSectionVisibility(sec.id);
                  }}
                  className="p-1 rounded opacity-50 group-hover:opacity-100 hover:text-orange-400 transition-opacity no-touch-enforce"
                  title={isHidden ? 'Hidden in PDF' : 'Visible in PDF'}
                >
                  {isHidden ? (
                    <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                  ) : (
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
};

export default TabletSectionSidebar;
