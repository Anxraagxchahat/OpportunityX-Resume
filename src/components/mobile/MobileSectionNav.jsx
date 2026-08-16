import React, { useRef, useEffect } from 'react';
import { Layers, User, Camera, FileText, Briefcase, GraduationCap, FolderGit2, Cpu, Award, Trophy, Languages, Share2 } from 'lucide-react';
import { useMobileNavigation } from '../../context/MobileNavigationContext';
import { useResume } from '../../context/ResumeContext';
import { isPhotoTemplate } from '../../utils/photoDefaults';

export const ALL_BUILDER_SECTIONS = [
  { id: 'personal', label: 'Personal', icon: User },
  { id: 'photo', label: 'Photo', icon: Camera },
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

export const getBuilderSections = () => {
  return ALL_BUILDER_SECTIONS;
};

export const builderSections = ALL_BUILDER_SECTIONS;

export const MobileSectionNav = () => {
  const { activeSection, setActiveSection, setIsSectionDrawerOpen } = useMobileNavigation();
  const { activeResume } = useResume();
  const scrollRef = useRef(null);

  const hasPhotoSupport = isPhotoTemplate(activeResume?.metadata?.template);
  const sections = getBuilderSections(hasPhotoSupport);

  // Auto-scroll active section chip into view when changed
  useEffect(() => {
    if (!scrollRef.current) return;
    const activeEl = scrollRef.current.querySelector('[data-active="true"]');
    if (activeEl) {
      activeEl.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [activeSection]);

  return (
    <div className="w-full bg-[var(--ox-surface-primary)] border-b border-[var(--ox-border)] px-2 py-2 sticky top-0 z-30 select-none no-print shadow-sm">
      <div
        ref={scrollRef}
        className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scroll-smooth px-1"
      >
        {/* Sections Sheet Trigger Button */}
        <button
          onClick={() => setIsSectionDrawerOpen(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/30 text-xs font-bold shrink-0 min-h-[38px] cursor-pointer active:scale-95 transition-all"
        >
          <Layers className="w-4 h-4" />
          <span>Sections</span>
        </button>

        <div className="h-4 w-[1px] bg-[var(--ox-border)] shrink-0 my-auto mx-0.5" />

        {/* Section Chips */}
        {sections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;

          return (
            <button
              key={sec.id}
              data-active={isActive ? 'true' : 'false'}
              onClick={() => setActiveSection(sec.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold shrink-0 transition-all min-h-[38px] cursor-pointer active:scale-95 ${
                isActive
                  ? 'bg-orange-500 text-white shadow-md font-bold'
                  : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border border-[var(--ox-border)] hover:text-[var(--ox-text-primary)]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-orange-400'}`} />
              <span className="whitespace-nowrap">{sec.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MobileSectionNav;
