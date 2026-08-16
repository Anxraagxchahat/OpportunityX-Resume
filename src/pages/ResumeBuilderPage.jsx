import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '../context/ResumeContext';
import { BuilderToolbar } from '../components/BuilderToolbar';
import { BuilderSidebarNav } from '../components/BuilderSidebarNav';
import { A4ResumePreview } from '../components/A4ResumePreview';
import { AIFloatingAssistModal } from '../components/AIFloatingAssistModal';
import { VersionHistoryModal } from '../components/VersionHistoryModal';
import { KeyboardShortcutsModal } from '../components/KeyboardShortcutsModal';
import { BYOKSettingsModal } from '../components/BYOKSettingsModal';
import { AIUpgradePromptModal } from '../components/AIUpgradePromptModal';
import { ResumeRecoveryBanner } from '../components/ResumeRecoveryBanner';
import { ResumeInspector } from '../components/ResumeInspector';
import { AssetManagerModal } from '../components/AssetManagerModal';
import { ExportCenterModal } from '../components/ExportCenterModal';
import { ProfilePresetsModal } from '../components/ProfilePresetsModal';
import { ThemeCustomizerModal } from '../components/ThemeCustomizerModal';
import { PhotoCropModal } from '../components/PhotoCropModal';
import { DEFAULT_PROFILE_PHOTO, isPhotoTemplate } from '../utils/photoDefaults';
import { useDeviceType } from '../hooks/useDeviceType';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { downloadDirectPDF } from '../utils/pdfDownloader';
import { MobileResumeBuilder } from '../components/mobile/MobileResumeBuilder';
import { TabletAppShell } from '../components/tablet/TabletAppShell';

// Modular Builder Section Components
import { PersonalInfoSection } from '../components/builder/sections/PersonalInfoSection';
import { PhotoSection } from '../components/builder/sections/PhotoSection';
import { SummarySection } from '../components/builder/sections/SummarySection';
import { ExperienceSection } from '../components/builder/sections/ExperienceSection';
import { EducationSection } from '../components/builder/sections/EducationSection';
import { ProjectsSection } from '../components/builder/sections/ProjectsSection';
import { SkillsSection } from '../components/builder/sections/SkillsSection';
import { CertificatesSection } from '../components/builder/sections/CertificatesSection';
import { AchievementsSection } from '../components/builder/sections/AchievementsSection';
import { LanguagesSection } from '../components/builder/sections/LanguagesSection';
import { SocialLinksSection } from '../components/builder/sections/SocialLinksSection';
import { CustomSectionsSection } from '../components/builder/sections/CustomSectionsSection';

import { Sparkles, X } from 'lucide-react';

export const ResumeBuilderPage = () => {
  const { isMobile, isTablet } = useDeviceType();

  const {
    activeResume,
    activeResumeId,
    updatePersonal,
    updateExperience,
    updateEducation,
    updateProjects,
    updateSkills,
    updateCertificates,
    updateAchievements,
    updateLanguages,
    updateCustomSections,
    updateAssets,
    versions,
    restoreVersionSnapshot,
    createVersionSnapshot,
    checkAIAccess,
    toggleSectionVisibility,
    undo,
    redo,
    duplicateResume,
    setIsKeyboardHelpOpen
  } = useResume();

  const [activeSection, setActiveSection] = useState('personal');
  const [isPhotoCropOpen, setIsPhotoCropOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Resizable Split Panel State (Default 42% Preview, persisted in localStorage)
  const [previewWidth, setPreviewWidth] = useState(() => {
    const saved = localStorage.getItem('ox_builder_preview_width');
    return saved ? Math.min(Math.max(parseFloat(saved), 35), 60) : 42;
  });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);

  const handleResizeStart = (e) => {
    e.preventDefault();
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const handleMove = (clientX) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const relativeX = clientX - rect.left;
      const totalWidth = rect.width;
      const editorWidth = relativeX;
      const previewPercent = ((totalWidth - editorWidth) / totalWidth) * 100;
      
      const clamped = Math.min(Math.max(previewPercent, 32), 62);
      setPreviewWidth(clamped);
      localStorage.setItem('ox_builder_preview_width', String(clamped));
    };

    const onMouseMove = (e) => handleMove(e.clientX);
    const onTouchMove = (e) => {
      if (e.touches && e.touches[0]) handleMove(e.touches[0].clientX);
    };

    const onEnd = () => setIsResizing(false);

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onEnd);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isResizing]);

  // 1. Toast Notification Handler
  useEffect(() => {
    const pendingToast = sessionStorage.getItem('ox_import_success_toast');
    if (pendingToast) {
      setToastMessage(pendingToast);
      sessionStorage.removeItem('ox_import_success_toast');
      const timer = setTimeout(() => setToastMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  // 2. Global Keyboard Shortcuts (Strictly guarded against editable inputs)
  useKeyboardShortcuts({
    onSaveSnapshot: () => {
      createVersionSnapshot();
      setToastMessage('Snapshot saved to Version History');
      const timer = setTimeout(() => setToastMessage(''), 4000);
      return () => clearTimeout(timer);
    },
    onUndo: undo,
    onRedo: redo,
    onDuplicate: () => {
      if (activeResumeId) {
        duplicateResume(activeResumeId);
        setToastMessage('Resume duplicated successfully');
        const timer = setTimeout(() => setToastMessage(''), 4000);
        return () => clearTimeout(timer);
      }
    },
    onDownloadPDF: () => {
      if (activeResume) {
        const candidateName = activeResume.personal?.fullName || activeResume.metadata?.title || 'Resume';
        downloadDirectPDF('resume-a4-preview', candidateName);
      }
    },
    onToggleShortcutsModal: () => {
      setIsKeyboardHelpOpen((prev) => !prev);
    }
  });

  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isMobilePreviewActive, setIsMobilePreviewActive] = useState(false);

  // AI Modal Controller State
  const [aiModalConfig, setAiModalConfig] = useState({
    isOpen: false,
    targetField: '',
    initialText: '',
    onApply: () => {}
  });

  const [collapsedItems, setCollapsedItems] = useState({});
  const [skillCategory, setSkillCategory] = useState('languages');
  const [newSkillInput, setNewSkillInput] = useState('');

  const toggleItemCollapse = (id) => {
    setCollapsedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const openAiModal = (targetField, initialText, onApplyCallback) => {
    const allowed = checkAIAccess(targetField === 'summary' ? 'summary' : 'bullet');
    if (!allowed) return;

    setAiModalConfig({
      isOpen: true,
      targetField,
      initialText: initialText || '',
      onApply: (generatedText) => {
        onApplyCallback(generatedText);
        setAiModalConfig((prev) => ({ ...prev, isOpen: false }));
      }
    });
  };

  const closeAiModal = () => {
    setAiModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  if (isMobile) {
    return <MobileResumeBuilder />;
  }

  if (isTablet) {
    return <TabletAppShell />;
  }

  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [], customSections = [], metadata = {}, assets = {} } = activeResume || {};
  const hiddenSections = metadata.hiddenSections || [];

  // ================= EXPERIENCE =================
  const addExperienceItem = () => {
    const newItem = {
      id: `exp-${Date.now()}`,
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: 'Present',
      current: true,
      bullets: ['Architected scalable features to improve overall throughput.']
    };
    updateExperience([...experience, newItem]);
  };

  const removeExperienceItem = (id, targetIdx) => updateExperience(experience.filter((e, idx) => (e.id && id ? e.id !== id : idx !== targetIdx)));
  const updateExperienceField = (id, targetIdx, field, value) => updateExperience(experience.map((e, idx) => ((e.id && id ? e.id === id : idx === targetIdx) ? { ...e, [field]: value } : e)));

  const moveExperience = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= experience.length) return;
    const items = [...experience];
    const temp = items[index];
    items[index] = items[nextIndex];
    items[nextIndex] = temp;
    updateExperience(items);
  };

  const updateBulletPoint = (expId, targetIdx, index, text) => {
    updateExperience(
      experience.map((e, idx) => {
        if ((e.id && expId && e.id === expId) || idx === targetIdx) {
          const newBullets = [...(e.bullets || [])];
          newBullets[index] = text;
          return { ...e, bullets: newBullets };
        }
        return e;
      })
    );
  };

  const addBulletPoint = (expId, targetIdx) => {
    updateExperience(experience.map((e, idx) => ((e.id && expId && e.id === expId) || idx === targetIdx ? { ...e, bullets: [...(e.bullets || []), ''] } : e)));
  };

  const removeBulletPoint = (expId, targetIdx, bIdx) => {
    updateExperience(experience.map((e, idx) => ((e.id && expId && e.id === expId) || idx === targetIdx ? { ...e, bullets: (e.bullets || []).filter((_, bI) => bI !== bIdx) } : e)));
  };

  // ================= EDUCATION =================
  const addEducationItem = () => {
    const newItem = { id: `edu-${Date.now()}`, institution: '', degree: '', location: '', startDate: '', endDate: '2025', gpa: '', description: '' };
    updateEducation([...education, newItem]);
  };
  const removeEducationItem = (id, targetIdx) => updateEducation(education.filter((e, idx) => (e.id && id ? e.id !== id : idx !== targetIdx)));

  // ================= PROJECTS =================
  const addProjectItem = () => {
    const newItem = { id: `proj-${Date.now()}`, name: '', description: '', techStack: '', link: '', bullets: [''] };
    updateProjects([...projects, newItem]);
  };
  const removeProjectItem = (id, targetIdx) => updateProjects(projects.filter((p, idx) => (p.id && id ? p.id !== id : idx !== targetIdx)));

  // ================= SKILLS CHIPS =================
  const addSkillChip = (category, name) => {
    if (!name.trim()) return;
    const currentList = skills[category] || [];
    if (!currentList.includes(name.trim())) {
      updateSkills({ ...skills, [category]: [...currentList, name.trim()] });
    }
    setNewSkillInput('');
  };

  const removeSkillChip = (category, name) => {
    const currentList = skills[category] || [];
    updateSkills({ ...skills, [category]: currentList.filter((s) => s !== name) });
  };

  // ================= OTHER SECTIONS =================
  const addCertificateItem = () => updateCertificates([...certificates, { id: `cert-${Date.now()}`, name: '', issuer: '', date: '' }]);
  const removeCertificateItem = (id, targetIdx) => updateCertificates(certificates.filter((c, idx) => (c.id && id ? c.id !== id : idx !== targetIdx)));

  const addAchievementItem = () => updateAchievements([...achievements, { id: `ach-${Date.now()}`, title: '', description: '' }]);
  const removeAchievementItem = (id, targetIdx) => updateAchievements(achievements.filter((a, idx) => (a.id && id ? a.id !== id : idx !== targetIdx)));

  const addLanguageItem = () => updateLanguages([...languages, { id: `lang-${Date.now()}`, name: '', proficiency: 'Professional Working' }]);
  const removeLanguageItem = (id, targetIdx) => updateLanguages(languages.filter((l, idx) => (l.id && id ? l.id !== id : idx !== targetIdx)));

  const addCustomSection = () => updateCustomSections([...customSections, { id: `cust-${Date.now()}`, title: 'Volunteering & Leadership', items: [{ id: `citem-${Date.now()}`, name: 'Community Leader', description: 'Organized local tech workshops.' }] }]);
  const removeCustomSection = (id, targetIdx) => updateCustomSections(customSections.filter((cs, idx) => (cs.id && id ? cs.id !== id : idx !== targetIdx)));

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[var(--ox-bg)] text-[var(--ox-text-primary)] transition-colors duration-300">
      {/* Recovery Banner */}
      <ResumeRecoveryBanner />

      {/* Top Toolbar */}
      <BuilderToolbar
        onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
        onTogglePreview={() => setIsMobilePreviewActive(!isMobilePreviewActive)}
        isMobilePreviewActive={isMobilePreviewActive}
      />

      {/* Success Toast Banner */}
      {toastMessage && (
        <div className="px-4 py-2 bg-emerald-500/15 border-b border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center justify-between animate-fadeIn z-20">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
          <button onClick={() => setToastMessage('')} className="p-1 text-emerald-400 hover:text-white">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Split Screen Workspace (Tablet & Desktop 3-Panel Resizable Layout) */}
      <div ref={containerRef} className={`flex-1 flex overflow-hidden ${isResizing ? 'select-none cursor-col-resize' : ''}`}>
        {/* Left Persistent Collapsible Sidebar */}
        <BuilderSidebarNav activeSection={activeSection} onSelectSection={(secId) => setActiveSection(secId)} />

        {/* Center Form Editor Panel */}
        <div
          style={{ width: isMobilePreviewActive ? '0%' : `calc(100% - ${previewWidth}%)` }}
          className={`flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar bg-[var(--ox-surface-primary)] transition-colors duration-300 ${
            isMobilePreviewActive ? 'hidden md:flex flex-col' : 'flex flex-col'
          }`}
        >
          <div className="max-w-2xl mx-auto w-full space-y-6">
            {/* 1. PERSONAL INFO */}
            {activeSection === 'personal' && (
              <PersonalInfoSection
                personal={personal}
                updatePersonal={updatePersonal}
                metadata={metadata}
                assets={assets}
                hiddenSections={hiddenSections}
                toggleSectionVisibility={toggleSectionVisibility}
                setActiveSection={setActiveSection}
              />
            )}

            {/* 1.5 PROFILE PHOTO */}
            {isPhotoTemplate(metadata.template) && activeSection === 'photo' && (
              <PhotoSection
                metadata={metadata}
                assets={assets}
                updateAssets={updateAssets}
                hiddenSections={hiddenSections}
                toggleSectionVisibility={toggleSectionVisibility}
                setIsPhotoCropOpen={setIsPhotoCropOpen}
              />
            )}

            {/* 2. SUMMARY */}
            {activeSection === 'summary' && (
              <SummarySection
                summary={personal.summary}
                updatePersonal={updatePersonal}
                openAiModal={openAiModal}
              />
            )}

            {/* 3. WORK EXPERIENCE */}
            {activeSection === 'experience' && (
              <ExperienceSection
                experience={experience}
                updateExperience={updateExperience}
                addExperienceItem={addExperienceItem}
                removeExperienceItem={removeExperienceItem}
                updateExperienceField={updateExperienceField}
                moveExperience={moveExperience}
                updateBulletPoint={updateBulletPoint}
                addBulletPoint={addBulletPoint}
                removeBulletPoint={removeBulletPoint}
                collapsedItems={collapsedItems}
                toggleItemCollapse={toggleItemCollapse}
                openAiModal={openAiModal}
              />
            )}

            {/* 4. EDUCATION */}
            {activeSection === 'education' && (
              <EducationSection
                education={education}
                updateEducation={updateEducation}
                addEducationItem={addEducationItem}
                removeEducationItem={removeEducationItem}
              />
            )}

            {/* 5. PROJECTS */}
            {activeSection === 'projects' && (
              <ProjectsSection
                projects={projects}
                updateProjects={updateProjects}
                addProjectItem={addProjectItem}
                removeProjectItem={removeProjectItem}
              />
            )}

            {/* 6. SKILLS */}
            {activeSection === 'skills' && (
              <SkillsSection
                skills={skills}
                skillCategory={skillCategory}
                setSkillCategory={setSkillCategory}
                newSkillInput={newSkillInput}
                setNewSkillInput={setNewSkillInput}
                addSkillChip={addSkillChip}
                removeSkillChip={removeSkillChip}
              />
            )}

            {/* 7. CERTIFICATES */}
            {activeSection === 'certificates' && (
              <CertificatesSection
                certificates={certificates}
                updateCertificates={updateCertificates}
                addCertificateItem={addCertificateItem}
                removeCertificateItem={removeCertificateItem}
              />
            )}

            {/* 8. ACHIEVEMENTS */}
            {activeSection === 'achievements' && (
              <AchievementsSection
                achievements={achievements}
                updateAchievements={updateAchievements}
                addAchievementItem={addAchievementItem}
                removeAchievementItem={removeAchievementItem}
              />
            )}

            {/* 9. LANGUAGES */}
            {activeSection === 'languages' && (
              <LanguagesSection
                languages={languages}
                updateLanguages={updateLanguages}
                addLanguageItem={addLanguageItem}
                removeLanguageItem={removeLanguageItem}
              />
            )}

            {/* 10. SOCIAL & PORTFOLIO LINKS */}
            {activeSection === 'socialLinks' && (
              <SocialLinksSection
                personal={personal}
                updatePersonal={updatePersonal}
              />
            )}

            {/* 11. CUSTOM SECTIONS */}
            {activeSection === 'customSections' && (
              <CustomSectionsSection
                customSections={customSections}
                updateCustomSections={updateCustomSections}
                addCustomSection={addCustomSection}
                removeCustomSection={removeCustomSection}
              />
            )}
          </div>
        </div>

        {/* Resizable Divider Drag Handle (Hidden on Mobile) */}
        <div
          onMouseDown={handleResizeStart}
          onTouchStart={handleResizeStart}
          className="hidden md:flex w-2.5 hover:w-3 bg-[var(--ox-border)] hover:bg-orange-500/40 cursor-col-resize items-center justify-center shrink-0 z-20 transition-all group"
          title="Drag to resize Editor / Live Preview"
        >
          <div className="w-1 h-10 rounded-full bg-[var(--ox-text-muted)] group-hover:bg-orange-500 transition-colors" />
        </div>

        {/* Right Resizable Live Preview Panel */}
        <div
          style={{ width: isMobilePreviewActive ? '100%' : `${previewWidth}%` }}
          className={`h-full flex flex-col overflow-hidden bg-[var(--ox-bg)] print:w-full print:block print:h-auto print:static ${
            isMobilePreviewActive ? 'flex' : 'hidden md:flex'
          }`}
        >
          <A4ResumePreview />
        </div>
      </div>

      {/* Modals & Drawers */}
      <AIFloatingAssistModal isOpen={aiModalConfig.isOpen} onClose={closeAiModal} targetField={aiModalConfig.targetField} initialText={aiModalConfig.initialText} onApply={aiModalConfig.onApply} />
      <VersionHistoryModal isOpen={isVersionHistoryOpen} onClose={() => setIsVersionHistoryOpen(false)} versions={versions} onRestore={(vId) => restoreVersionSnapshot(vId)} onCreateSnapshot={() => createVersionSnapshot()} />
      <KeyboardShortcutsModal />
      <BYOKSettingsModal />
      <AIUpgradePromptModal />
      <ResumeInspector />
      <AssetManagerModal />
      <ExportCenterModal />
      <ProfilePresetsModal />
      <ThemeCustomizerModal />
      <PhotoCropModal
        isOpen={isPhotoCropOpen}
        onClose={() => setIsPhotoCropOpen(false)}
        photoSrc={assets?.profilePhoto || DEFAULT_PROFILE_PHOTO}
      />
    </div>
  );
};
