import React, { useState, useEffect, useRef } from 'react';
import { useResume } from '../context/ResumeContext';
import { BuilderToolbar } from '../components/BuilderToolbar';
import { BuilderSidebarNav } from '../components/BuilderSidebarNav';
import { A4ResumePreview } from '../components/A4ResumePreview';
import { InlineAIBadge } from '../components/InlineAIBadge';
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
import { DEFAULT_PROFILE_PHOTO, SAMPLE_AVATARS, isPhotoTemplate } from '../utils/photoDefaults';
import { getTemplateCapabilities } from '../templates';

import {
  Plus, Trash2, ChevronDown, ChevronUp, MoveUp, MoveDown, User, FileText,
  Briefcase, GraduationCap, FolderGit2, Cpu, Award, Trophy, Languages, Share2,
  Layers, X, Eye, EyeOff, Camera, Upload, Image as ImageIcon, Sparkles, Crop, MoveVertical
} from 'lucide-react';

export const ResumeBuilderPage = () => {
  const {
    activeResume,
    updatePersonal,
    updateExperience,
    updateEducation,
    updateProjects,
    updateSkills,
    updateCertificates,
    updateAchievements,
    updateLanguages,
    updateSocialLinks,
    updateCustomSections,
    updateAssets,
    versions,
    restoreVersionSnapshot,
    createVersionSnapshot,
    checkAIAccess,
    toggleSectionVisibility
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

  // 2. Auto-Focus First Incomplete Section
  useEffect(() => {
    if (!activeResume) return;

    const p = activeResume.personal || {};
    const exp = activeResume.experience || [];
    const proj = activeResume.projects || [];
    const sk = activeResume.skills || {};
    const edu = activeResume.education || [];

    if (!p.fullName || !p.email) {
      setActiveSection('personal');
    } else if (!p.summary || p.summary.trim().length < 20) {
      setActiveSection('summary');
    } else if (!Array.isArray(exp) || exp.length === 0) {
      setActiveSection('experience');
    } else if (!Array.isArray(proj) || proj.length === 0) {
      setActiveSection('projects');
    } else if (!sk || (Array.isArray(sk) ? sk.length === 0 : (!sk.languages?.length && !sk.frameworks?.length && !sk.tools?.length))) {
      setActiveSection('skills');
    } else if (!Array.isArray(edu) || edu.length === 0) {
      setActiveSection('education');
    }
  }, [activeResume?.metadata?.id]);

  // Auto-enable photo & visible position when active template supports photo
  useEffect(() => {
    const currentTemplate = activeResume?.metadata?.template;
    const caps = getTemplateCapabilities(currentTemplate);

    if (caps.supportsPhoto) {
      if (!activeResume?.assets?.photoPosition || activeResume?.assets?.photoPosition === 'hidden') {
        const defaultPos = caps.supportedPhotoPositions?.find(p => p !== 'hidden') || 'sidebar';
        updateAssets('photoPosition', defaultPos);
      }
      if (!activeResume?.assets?.profilePhoto) {
        updateAssets('profilePhoto', DEFAULT_PROFILE_PHOTO);
      }
    } else {
      if (activeSection === 'photo') {
        setActiveSection('personal');
      }
    }
  }, [activeResume?.metadata?.template, activeSection]);
  const [isVersionHistoryOpen, setIsVersionHistoryOpen] = useState(false);
  const [isMobilePreviewActive, setIsMobilePreviewActive] = useState(false);

  const [collapsedItems, setCollapsedItems] = useState({});

  const toggleItemCollapse = (id) => {
    setCollapsedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const [newSkillInput, setNewSkillInput] = useState('');
  const [skillCategory, setSkillCategory] = useState('frameworks');

  const [aiModalConfig, setAiModalConfig] = useState({
    isOpen: false,
    targetField: '',
    initialText: '',
    onApply: () => {}
  });

  const openAiModal = (targetField, initialText, onApply) => {
    if (!checkAIAccess(targetField)) return;

    setAiModalConfig({
      isOpen: true,
      targetField,
      initialText,
      onApply
    });
  };


  const closeAiModal = () => {
    setAiModalConfig((prev) => ({ ...prev, isOpen: false }));
  };

  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [], socialLinks = {}, customSections = [], metadata = {}, assets = {} } = activeResume;
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

  const removeExperienceItem = (id) => updateExperience(experience.filter((e) => e.id !== id));
  const updateExperienceField = (id, field, value) => updateExperience(experience.map((e) => (e.id === id ? { ...e, [field]: value } : e)));

  const moveExperience = (index, direction) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= experience.length) return;
    const items = [...experience];
    const temp = items[index];
    items[index] = items[nextIndex];
    items[nextIndex] = temp;
    updateExperience(items);
  };

  const updateBulletPoint = (expId, index, text) => {
    updateExperience(
      experience.map((e) => {
        if (e.id === expId) {
          const newBullets = [...(e.bullets || [])];
          newBullets[index] = text;
          return { ...e, bullets: newBullets };
        }
        return e;
      })
    );
  };

  const addBulletPoint = (expId) => {
    updateExperience(experience.map((e) => (e.id === expId ? { ...e, bullets: [...(e.bullets || []), 'Optimized core workflow logic.'] } : e)));
  };

  const removeBulletPoint = (expId, bIdx) => {
    updateExperience(experience.map((e) => (e.id === expId ? { ...e, bullets: (e.bullets || []).filter((_, idx) => idx !== bIdx) } : e)));
  };

  // ================= EDUCATION =================
  const addEducationItem = () => {
    const newItem = { id: `edu-${Date.now()}`, institution: '', degree: '', location: '', startDate: '', endDate: '2025', gpa: '', description: '' };
    updateEducation([...education, newItem]);
  };
  const removeEducationItem = (id) => updateEducation(education.filter((e) => e.id !== id));

  // ================= PROJECTS =================
  const addProjectItem = () => {
    const newItem = { id: `proj-${Date.now()}`, name: '', description: '', techStack: '', link: '', bullets: ['Built full stack web service using modern cloud APIs.'] };
    updateProjects([...projects, newItem]);
  };
  const removeProjectItem = (id) => updateProjects(projects.filter((p) => p.id !== id));

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
  const removeCertificateItem = (id) => updateCertificates(certificates.filter((c) => c.id !== id));

  const addAchievementItem = () => updateAchievements([...achievements, { id: `ach-${Date.now()}`, title: '', description: '' }]);
  const removeAchievementItem = (id) => updateAchievements(achievements.filter((a) => a.id !== id));

  const addLanguageItem = () => updateLanguages([...languages, { id: `lang-${Date.now()}`, name: '', proficiency: 'Professional Working' }]);
  const removeLanguageItem = (id) => updateLanguages(languages.filter((l) => l.id !== id));

  const addCustomSection = () => updateCustomSections([...customSections, { id: `cust-${Date.now()}`, title: 'Volunteering & Leadership', items: [{ id: `citem-${Date.now()}`, name: 'Community Leader', description: 'Organized local tech workshops.' }] }]);
  const removeCustomSection = (id) => updateCustomSections(customSections.filter((cs) => cs.id !== id));

  const isEmailValid = !personal.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email);

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
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <User className="w-4 h-4 text-orange-400" /> Personal Information
                  </h2>
                  <button
                    onClick={() => toggleSectionVisibility('personal')}
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {hiddenSections.includes('personal') ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{hiddenSections.includes('personal') ? 'Hidden in PDF' : 'Visible in PDF'}</span>
                  </button>
                </div>

                {/* Profile Photo Quick Card (Only for photo templates) */}
                {isPhotoTemplate(metadata.template) && (
                  <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-full bg-slate-900 border border-orange-500/40 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
                        {assets?.profilePhoto ? (
                          <img src={assets.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                        ) : (
                          <Camera className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white">Profile Photo</div>
                        <div className="text-[10px] text-slate-400">
                          {assets?.profilePhoto ? 'Photo is active on photo templates' : 'No photo uploaded yet'}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setActiveSection('photo')}
                      className="px-3.5 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Camera className="w-3.5 h-3.5" /> Manage Photo
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      value={personal.fullName || ''}
                      onChange={(e) => updatePersonal('fullName', e.target.value)}
                      placeholder="e.g. Alex Rivera"
                      className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Job Title / Target Role</label>
                    <input
                      type="text"
                      value={personal.jobTitle || ''}
                      onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                      placeholder="e.g. Senior Full Stack Software Engineer"
                      className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300 flex justify-between">
                      <span>Email Address *</span>
                      {!isEmailValid && <span className="text-red-400 text-[10px]">Invalid Format</span>}
                    </label>
                    <input
                      type="email"
                      value={personal.email || ''}
                      onChange={(e) => updatePersonal('email', e.target.value)}
                      placeholder="e.g. alex.rivera@opportunityx.dev"
                      className={`w-full min-h-[44px] bg-[#10131D] border rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:outline-none ${
                        !isEmailValid ? 'border-red-500/80 text-red-200' : 'border-slate-800 focus:border-orange-500'
                      }`}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Phone Number</label>
                    <input
                      type="text"
                      value={personal.phone || ''}
                      onChange={(e) => updatePersonal('phone', e.target.value)}
                      placeholder="e.g. +1 (555) 234-5678"
                      className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 lg:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">Location</label>
                    <input
                      type="text"
                      value={personal.location || ''}
                      onChange={(e) => updatePersonal('location', e.target.value)}
                      placeholder="e.g. San Francisco, CA / Remote"
                      className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 1.5 PROFILE PHOTO */}
            {isPhotoTemplate(metadata.template) && activeSection === 'photo' && (
              <div className="space-y-6 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Camera className="w-4 h-4 text-orange-400" /> Profile Photo & Avatar
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Upload or customize your profile photo for photo-enabled resume templates.
                    </p>
                  </div>
                  <button
                    onClick={() => toggleSectionVisibility('photo')}
                    className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {hiddenSections.includes('photo') ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{hiddenSections.includes('photo') ? 'Hidden in PDF' : 'Visible in PDF'}</span>
                  </button>
                </div>

                {/* Active Template Status Badge */}
                <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
                  isPhotoTemplate(metadata.template)
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                    : 'bg-orange-500/10 border-orange-500/30 text-orange-300'
                }`}>
                  <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">
                      {isPhotoTemplate(metadata.template)
                        ? `Active Template (${metadata.template}) Features Profile Photo!`
                        : `Current Template (${metadata.template || 'Modern ATS'}) does not display photos.`}
                    </div>
                    <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
                      {isPhotoTemplate(metadata.template)
                        ? 'Your photo will be rendered cleanly on the header or sidebar of your resume.'
                        : 'Switch to a photo template (such as Marketing Accent, Creative Sidebar, Accent Column, Healthcare Calm, or Best Resume Ever series) in Templates page to display your photo.'}
                    </div>
                  </div>
                </div>

                {/* Photo Upload & Preview Card */}
                <div className="p-5 rounded-2xl bg-[#10131D] border border-slate-800 space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    {/* Current Photo Preview Circle */}
                    <div className="relative group">
                      <div className={`w-24 h-24 overflow-hidden border-2 border-orange-500/60 bg-slate-900 shadow-2xl flex items-center justify-center ${
                        assets?.photoShape === 'square' ? 'rounded-md' : assets?.photoShape === 'rounded' ? 'rounded-2xl' : 'rounded-full'
                      }`}>
                        {assets?.profilePhoto ? (
                          <img
                            src={assets.profilePhoto}
                            alt="Profile Preview"
                            className="w-full h-full object-cover transition-transform duration-100 ease-out"
                            style={{
                              transform: `translateY(${((50 - (assets?.photoOffsetY ?? 50)) / 50) * (96 * 0.45 * ((assets?.photoZoom || 100) / 100))}px) scale(${(assets?.photoZoom || 100) / 100})`,
                              transformOrigin: 'center center'
                            }}
                          />
                        ) : (
                          <div className="text-center p-2">
                            <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                            <span className="text-[9px] text-slate-500 font-semibold block mt-1">No Photo</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Controls */}
                    <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                      <div className="text-xs font-bold text-[var(--ox-text-primary)]">Upload & Position Photo</div>
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <label className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                          <Upload className="w-3.5 h-3.5 stroke-[2.5]" />
                          <span>Choose Photo File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onload = (evt) => {
                                  if (evt.target?.result) {
                                    updateAssets('profilePhoto', evt.target.result);
                                    setIsPhotoCropOpen(true);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                        </label>

                        {assets?.profilePhoto && (
                          <button
                            type="button"
                            onClick={() => setIsPhotoCropOpen(true)}
                            className="px-3.5 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Crop className="w-3.5 h-3.5" /> Crop & Adjust Position
                          </button>
                        )}

                        {assets?.profilePhoto && (
                          <button
                            type="button"
                            onClick={() => updateAssets('profilePhoto', null)}
                            className="px-3.5 py-2 bg-[var(--ox-surface-secondary)] hover:bg-red-500/10 text-[var(--ox-text-secondary)] hover:text-red-500 border border-[var(--ox-border)] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Remove
                          </button>
                        )}
                      </div>
                      <p className="text-[10px] text-[var(--ox-text-muted)] font-medium">Supports JPG, PNG, WEBP. Transformed on-device into Base64 format.</p>
                    </div>
                  </div>

                  {/* Vertical Shift (Up / Down Offset Y) & Zoom Sliders */}
                  <div className="pt-4 border-t border-[var(--ox-border)] space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)]">
                        <span className="flex items-center gap-1">
                          <MoveVertical className="w-3.5 h-3.5 text-orange-500" /> Vertical Photo Alignment (Up / Down Shift)
                        </span>
                        <span className="text-orange-500">{assets?.photoOffsetY ?? 50}%</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1 text-[11px] font-bold">
                          {[
                            { label: 'Top (10%)', val: 10 },
                            { label: 'Center (50%)', val: 50 },
                            { label: 'Bottom (90%)', val: 90 }
                          ].map((item) => (
                            <button
                              key={item.val}
                              type="button"
                              onClick={() => updateAssets('photoOffsetY', item.val)}
                              className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                                (assets?.photoOffsetY ?? 50) === item.val
                                  ? 'bg-orange-500/20 text-orange-500 border-orange-500/50'
                                  : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)]'
                              }`}
                            >
                              {item.label}
                            </button>
                          ))}
                        </div>
                        <input
                          type="range"
                          min={0}
                          max={100}
                          value={assets?.photoOffsetY ?? 50}
                          onChange={(e) => updateAssets('photoOffsetY', Number(e.target.value))}
                          className="flex-1 accent-orange-500 cursor-pointer h-2 bg-[var(--ox-surface-secondary)] rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">Photo Display Size</label>
                        <div className="flex items-center gap-2">
                          {[
                            { id: 'sm', label: 'Small (64px)' },
                            { id: 'md', label: 'Medium (80px)' },
                            { id: 'lg', label: 'Large (96px)' }
                          ].map((sz) => (
                            <button
                              key={sz.id}
                              type="button"
                              onClick={() => updateAssets('photoSize', sz.id)}
                              className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                (assets?.photoSize || 'md') === sz.id
                                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {sz.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">Photo Display Shape</label>
                        <div className="flex items-center gap-2">
                          {[
                            { id: 'circle', label: 'Circle' },
                            { id: 'rounded', label: 'Rounded' },
                            { id: 'square', label: 'Square' }
                          ].map((shp) => (
                            <button
                              key={shp.id}
                              type="button"
                              onClick={() => updateAssets('photoShape', shp.id)}
                              className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                (assets?.photoShape || 'circle') === shp.id
                                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {shp.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Capability-Driven Photo Position Selector */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                        <span>Photo Layout Position</span>
                        <span className="text-[10px] text-slate-500 font-normal">Controlled by Template Capabilities</span>
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {[
                          { id: 'top-left', label: 'Top Left' },
                          { id: 'top-right', label: 'Top Right' },
                          { id: 'center', label: 'Center' },
                          { id: 'sidebar', label: 'Sidebar' },
                          { id: 'hidden', label: 'Hidden' }
                        ]
                          .filter((pos) => {
                            const caps = getTemplateCapabilities(metadata?.template);
                            return caps.supportedPhotoPositions?.includes(pos.id);
                          })
                          .map((pos) => (
                            <button
                              key={pos.id}
                              type="button"
                              onClick={() => updateAssets('photoPosition', pos.id)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                                (assets?.photoPosition || 'top-left') === pos.id
                                  ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-sm'
                                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                              }`}
                            >
                              {pos.label}
                            </button>
                          ))}
                      </div>
                    </div>
                  </div>

                  {/* Preset Sample Avatars */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-3">
                    <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <ImageIcon className="w-3.5 h-3.5 text-orange-400" /> Or Choose Preset Professional Headshot
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {SAMPLE_AVATARS.map((av) => (
                        <button
                          key={av.id}
                          onClick={() => updateAssets('profilePhoto', av.url)}
                          className={`p-2 rounded-xl border flex items-center gap-2.5 transition-all text-left group ${
                            assets?.profilePhoto === av.url
                              ? 'bg-orange-500/10 border-orange-500 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.15)]'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                          }`}
                        >
                          <img src={av.url} alt={av.label} className="w-9 h-9 rounded-full object-cover border border-slate-700 flex-shrink-0" />
                          <span className="text-[11px] font-semibold truncate leading-snug">{av.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. SUMMARY */}
            {activeSection === 'summary' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-400" /> Executive Summary
                  </h2>
                  <InlineAIBadge
                    label="Improve with AI"
                    onClick={() => openAiModal('summary', personal.summary, (improved) => updatePersonal('summary', improved))}
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
                    <span>Summary Text</span>
                    <span className="text-[10px] text-slate-500">{(personal.summary || '').length} chars</span>
                  </div>
                  <textarea
                    rows={6}
                    value={personal.summary || ''}
                    onChange={(e) => updatePersonal('summary', e.target.value)}
                    placeholder="e.g. Versatile Full Stack Software Engineer with 5+ years of experience engineering high-throughput SaaS applications, cloud-native microservices, and AI-assisted web interfaces..."
                    className="w-full bg-[#10131D] border border-slate-800 rounded-xl p-3.5 text-xs font-medium text-white focus:border-orange-500 focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            )}

            {/* 3. WORK EXPERIENCE */}
            {activeSection === 'experience' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-orange-400" /> Work Experience ({experience.length})
                  </h2>
                  <button
                    onClick={addExperienceItem}
                    className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Role
                  </button>
                </div>

                <div className="space-y-4">
                  {experience.map((exp, idx) => {
                    const isCollapsed = collapsedItems[exp.id];
                    return (
                      <div key={exp.id} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleItemCollapse(exp.id)}
                            className="flex items-center gap-2 text-xs font-bold text-orange-400 text-left hover:underline"
                          >
                            {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                            <span>{exp.role || `Position #${idx + 1}`} {exp.company ? `@ ${exp.company}` : ''}</span>
                          </button>
                          <div className="flex items-center gap-1">
                            <button onClick={() => moveExperience(idx, -1)} disabled={idx === 0} className="p-1 text-slate-400 disabled:opacity-20"><MoveUp className="w-3.5 h-3.5" /></button>
                            <button onClick={() => moveExperience(idx, 1)} disabled={idx === experience.length - 1} className="p-1 text-slate-400 disabled:opacity-20"><MoveDown className="w-3.5 h-3.5" /></button>
                            <button onClick={() => removeExperienceItem(exp.id)} className="p-1 text-slate-500 hover:text-red-400 ml-2"><Trash2 className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>

                        {!isCollapsed && (
                          <div className="space-y-3 pt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <input
                                type="text"
                                value={exp.role || ''}
                                onChange={(e) => updateExperienceField(exp.id, 'role', e.target.value)}
                                placeholder="e.g. Senior Full Stack Engineer"
                                className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={exp.company || ''}
                                onChange={(e) => updateExperienceField(exp.id, 'company', e.target.value)}
                                placeholder="e.g. Nexus Technologies"
                                className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={exp.startDate || ''}
                                onChange={(e) => updateExperienceField(exp.id, 'startDate', e.target.value)}
                                placeholder="e.g. 2023-01"
                                className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                              <input
                                type="text"
                                disabled={exp.current}
                                value={exp.current ? 'Present' : exp.endDate || ''}
                                onChange={(e) => updateExperienceField(exp.id, 'endDate', e.target.value)}
                                placeholder="e.g. Present or 2024-12"
                                className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white disabled:opacity-60"
                              />
                            </div>

                            <div className="space-y-2 pt-2 border-t border-slate-800/80">
                              <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                                <span>Key Achievements & Bullet Points</span>
                                <InlineAIBadge
                                  size="sm"
                                  label="Rewrite with AI"
                                  onClick={() => openAiModal('bullet', exp.bullets?.[0], (improved) => updateBulletPoint(exp.id, 0, improved))}
                                />
                              </div>
                              {(exp.bullets || []).map((bullet, bIdx) => (
                                <div key={bIdx} className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={bullet}
                                    onChange={(e) => updateBulletPoint(exp.id, bIdx, e.target.value)}
                                    placeholder="e.g. Architected distributed React & Node.js web services processing 15M+ daily requests..."
                                    className="flex-1 bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                                  />
                                  <button onClick={() => removeBulletPoint(exp.id, bIdx)} className="text-slate-500 hover:text-red-400 p-1">
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                              <button onClick={() => addBulletPoint(exp.id)} className="text-[11px] font-semibold text-orange-400 hover:underline flex items-center gap-1 pt-1">
                                + Add Bullet Point
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 4. EDUCATION */}
            {activeSection === 'education' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-orange-400" /> Education ({education.length})
                  </h2>
                  <button onClick={addEducationItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Education
                  </button>
                </div>

                <div className="space-y-4">
                  {education.map((edu, idx) => (
                    <div key={edu.id} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-orange-400">{edu.degree || `Education #${idx + 1}`}</span>
                        <button onClick={() => removeEducationItem(edu.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">Degree / Major</label>
                          <input type="text" value={edu.degree || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, degree: e.target.value } : ed)))} placeholder="e.g. B.S. in Computer Science" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">University / School</label>
                          <input type="text" value={edu.institution || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, institution: e.target.value } : ed)))} placeholder="e.g. University of California, Berkeley" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">Start Date</label>
                          <input type="text" value={edu.startDate || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, startDate: e.target.value } : ed)))} placeholder="e.g. 2017-08" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">End Date</label>
                          <input type="text" value={edu.endDate || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, endDate: e.target.value } : ed)))} placeholder="e.g. 2021-05 or Present" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">GPA / Score</label>
                          <input type="text" value={edu.gpa || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, gpa: e.target.value } : ed)))} placeholder="e.g. 3.88 / 4.0" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <label className="text-[11px] font-semibold text-slate-400">Relevant Coursework</label>
                        <input type="text" value={edu.relevantCoursework || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, relevantCoursework: e.target.value } : ed)))} placeholder="e.g. Algorithms & Data Structures, Operating Systems, Machine Learning" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 5. PROJECTS */}
            {activeSection === 'projects' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <FolderGit2 className="w-4 h-4 text-orange-400" /> Technical Projects ({projects.length})
                  </h2>
                  <button onClick={addProjectItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>

                <div className="space-y-4">
                  {projects.map((proj, idx) => (
                    <div key={proj.id} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-orange-400">{proj.name || `Project #${idx + 1}`}</span>
                        <button onClick={() => removeProjectItem(proj.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <input type="text" value={proj.name || ''} onChange={(e) => updateProjects(projects.map((p) => (p.id === proj.id ? { ...p, name: e.target.value } : p)))} placeholder="e.g. OpportunityX Pulse Dashboard" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                      <textarea rows={2} value={proj.description || ''} onChange={(e) => updateProjects(projects.map((p) => (p.id === proj.id ? { ...p, description: e.target.value } : p)))} placeholder="e.g. Open-source analytics dashboard monitor designed for high-scale student tech hubs..." className="w-full bg-[#080B12] border border-slate-800 rounded-lg p-2 text-xs text-white" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 6. SKILLS */}
            {activeSection === 'skills' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-orange-400" /> Skills Tag Chips
                  </h2>
                </div>

                <div className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
                  <div className="flex gap-2">
                    <select value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} className="bg-[#080B12] border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs">
                      <option value="languages">Languages</option>
                      <option value="frameworks">Frameworks</option>
                      <option value="tools">Tools</option>
                    </select>
                    <input type="text" value={newSkillInput} onChange={(e) => setNewSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkillChip(skillCategory, newSkillInput); } }} placeholder="e.g. TypeScript, React, Node.js (Press Enter)" className="flex-1 bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                    <button onClick={() => addSkillChip(skillCategory, newSkillInput)} className="px-3 py-1.5 bg-orange-500 text-black font-bold text-xs rounded-lg">Add</button>
                  </div>
                </div>

                {['languages', 'frameworks', 'tools'].map((cat) => (
                  <div key={cat} className="space-y-2">
                    <div className="text-xs font-bold text-slate-300 capitalize">{cat}</div>
                    <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#10131D] border border-slate-800">
                      {(skills[cat] || []).map((sk) => (
                        <span key={sk} className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/30 text-xs font-semibold flex items-center gap-1.5">
                          <span>{sk}</span>
                          <button onClick={() => removeSkillChip(cat, sk)} className="text-orange-400 hover:text-red-400"><X className="w-3 h-3" /></button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 7. CERTIFICATES */}
            {activeSection === 'certificates' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><Award className="w-4 h-4 text-orange-400" /> Certifications ({certificates.length})</h2>
                  <button onClick={addCertificateItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Certification</button>
                </div>
                {certificates.map((cert, idx) => (
                  <div key={cert.id || idx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-orange-400">{cert.name || `Certification #${idx + 1}`}</span>
                      <button onClick={() => removeCertificateItem(cert.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Certification Name</label>
                        <input type="text" value={cert.name || ''} onChange={(e) => updateCertificates(certificates.map((c) => (c.id === cert.id ? { ...c, name: e.target.value } : c)))} placeholder="e.g. AWS Certified Solutions Architect" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Issuing Organization</label>
                        <input type="text" value={cert.issuer || ''} onChange={(e) => updateCertificates(certificates.map((c) => (c.id === cert.id ? { ...c, issuer: e.target.value } : c)))} placeholder="e.g. Amazon Web Services" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Issue Date / Year</label>
                        <input type="text" value={cert.date || ''} onChange={(e) => updateCertificates(certificates.map((c) => (c.id === cert.id ? { ...c, date: e.target.value } : c)))} placeholder="e.g. 2023" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 8. ACHIEVEMENTS */}
            {activeSection === 'achievements' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><Trophy className="w-4 h-4 text-orange-400" /> Achievements ({achievements.length})</h2>
                  <button onClick={addAchievementItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Achievement</button>
                </div>
                {achievements.map((ach, idx) => (
                  <div key={ach.id || idx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-orange-400">{ach.title || `Achievement #${idx + 1}`}</span>
                      <button onClick={() => removeAchievementItem(ach.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="space-y-2">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Title / Award Name</label>
                        <input type="text" value={ach.title || ''} onChange={(e) => updateAchievements(achievements.map((a) => (a.id === ach.id ? { ...a, title: e.target.value } : a)))} placeholder="e.g. 1st Place Winner - OpportunityX Global Hackathon" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400">Description / Details</label>
                        <input type="text" value={ach.description || ''} onChange={(e) => updateAchievements(achievements.map((a) => (a.id === ach.id ? { ...a, description: e.target.value } : a)))} placeholder="e.g. Awarded top honor among 400+ international teams for building an accessible tech portal." className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 9. LANGUAGES */}
            {activeSection === 'languages' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><Languages className="w-4 h-4 text-orange-400" /> Languages ({languages.length})</h2>
                  <button onClick={addLanguageItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-1.5"><Plus className="w-3.5 h-3.5" /> Add Language</button>
                </div>
                {languages.map((lang, idx) => {
                  const nameVal = typeof lang === 'string' ? lang : (lang.name || lang.language || '');
                  const profVal = typeof lang === 'string' ? 'Professional Working' : (lang.proficiency || 'Professional Working');
                  return (
                    <div key={lang.id || idx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-orange-400">{nameVal || `Language #${idx + 1}`}</span>
                        <button onClick={() => removeLanguageItem(lang.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">Language Name</label>
                          <input
                            type="text"
                            value={nameVal}
                            onChange={(e) => updateLanguages(languages.map((l, i) => (i === idx || l.id === lang.id ? { id: lang.id || `lang-${i}`, name: e.target.value, language: e.target.value, proficiency: profVal } : l)))}
                            placeholder="e.g. English, Hindi, Spanish"
                            className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">Proficiency Level</label>
                          <select
                            value={profVal}
                            onChange={(e) => updateLanguages(languages.map((l, i) => (i === idx || l.id === lang.id ? { id: lang.id || `lang-${i}`, name: nameVal, language: nameVal, proficiency: e.target.value } : l)))}
                            className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
                          >
                            <option value="Native / Full Professional">Native / Full Professional</option>
                            <option value="Professional Working">Professional Working</option>
                            <option value="Limited Working">Limited Working</option>
                            <option value="Elementary">Elementary</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 10. SOCIAL & PORTFOLIO LINKS */}
            {activeSection === 'socialLinks' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Share2 className="w-4 h-4 text-orange-400" /> Social & Portfolio Links
                  </h2>
                  <button
                    type="button"
                    onClick={() => {
                      const currentCustom = Array.isArray(personal.customLinks) ? personal.customLinks : [];
                      updatePersonal('customLinks', [...currentCustom, { id: `link-${Date.now()}`, label: '', url: '' }]);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Link
                  </button>
                </div>

                {/* Primary Link Fields */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-300">Standard Profiles & Websites</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-orange-400" /> Personal Portfolio / Website
                      </label>
                      <input
                        type="text"
                        value={personal.website || personal.portfolio || ''}
                        onChange={(e) => {
                          updatePersonal('website', e.target.value);
                          updatePersonal('portfolio', e.target.value);
                        }}
                        placeholder="e.g. alexrivera.dev or myportfolio.com"
                        className="w-full min-h-[42px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                        <GithubIcon className="w-3.5 h-3.5 text-orange-400" /> GitHub Profile
                      </label>
                      <input
                        type="text"
                        value={personal.github || ''}
                        onChange={(e) => updatePersonal('github', e.target.value)}
                        placeholder="e.g. github.com/alexrivera"
                        className="w-full min-h-[42px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                        <LinkedinIcon className="w-3.5 h-3.5 text-orange-400" /> LinkedIn Profile
                      </label>
                      <input
                        type="text"
                        value={personal.linkedin || ''}
                        onChange={(e) => updatePersonal('linkedin', e.target.value)}
                        placeholder="e.g. linkedin.com/in/alexrivera-dev"
                        className="w-full min-h-[42px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-orange-400" /> Twitter / X Profile
                      </label>
                      <input
                        type="text"
                        value={personal.twitter || ''}
                        onChange={(e) => updatePersonal('twitter', e.target.value)}
                        placeholder="e.g. x.com/alexrivera"
                        className="w-full min-h-[42px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Custom Links List */}
                {Array.isArray(personal.customLinks) && personal.customLinks.length > 0 && (
                  <div className="space-y-3 pt-3 border-t border-slate-800">
                    <div className="text-xs font-bold text-slate-300">Custom Social & Platform Links</div>
                    <div className="space-y-3">
                      {personal.customLinks.map((link, idx) => (
                        <div key={link.id || idx} className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-orange-400">{link.label || `Custom Link #${idx + 1}`}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const filtered = personal.customLinks.filter((_, i) => i !== idx);
                                updatePersonal('customLinks', filtered);
                              }}
                              className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={link.label || ''}
                              onChange={(e) => {
                                const updated = personal.customLinks.map((cl, i) => (i === idx ? { ...cl, label: e.target.value } : cl));
                                updatePersonal('customLinks', updated);
                              }}
                              placeholder="e.g. LeetCode / Kaggle / Dribbble"
                              className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                            />
                            <input
                              type="text"
                              value={link.url || ''}
                              onChange={(e) => {
                                const updated = personal.customLinks.map((cl, i) => (i === idx ? { ...cl, url: e.target.value } : cl));
                                updatePersonal('customLinks', updated);
                              }}
                              placeholder="e.g. leetcode.com/u/alexrivera"
                              className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 11. CUSTOM SECTIONS */}
            {activeSection === 'customSections' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><Layers className="w-4 h-4 text-orange-400" /> Custom Sections ({customSections.length})</h2>
                  <button onClick={addCustomSection} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg"><Plus className="w-3.5 h-3.5" /> Add Custom Section</button>
                </div>
                {customSections.map((cs) => (
                  <div key={cs.id} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-2">
                    <input type="text" value={cs.title} onChange={(e) => updateCustomSections(customSections.map((s) => (s.id === cs.id ? { ...s, title: e.target.value } : s)))} placeholder="e.g. Leadership & Volunteer" className="w-full bg-[#080B12] border border-slate-800 rounded px-3 py-1 text-xs font-bold text-orange-400" />
                  </div>
                ))}
              </div>
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
