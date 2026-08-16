import React, { useState } from 'react';
import {
  User, FileText, Briefcase, GraduationCap, FolderGit2, Cpu, Award, Trophy,
  Languages, Share2, Layers, Plus, Trash2, Edit3, Eye, EyeOff, Sparkles,
  ChevronLeft, ChevronRight, Check, X, Globe, Link, Camera, Upload, RefreshCw
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';
import { builderSections, getBuilderSections } from './MobileSectionNav';
import { isPhotoTemplate, DEFAULT_PROFILE_PHOTO, SAMPLE_AVATARS, optimizeProfileImage } from '../../utils/photoDefaults';
import { executeOpenRouterRequest } from '../../services/ai/providerManager';

export const MobileSectionEditor = () => {
  const {
    activeResume,
    updatePersonal,
    updateAssets,
    updateExperience,
    updateEducation,
    updateProjects,
    updateSkills,
    updateCertificates,
    updateAchievements,
    updateLanguages,
    updateSocialLinks,
    toggleSectionVisibility,
    executeAIGeneration
  } = useResume();

  const { activeSection, setActiveSection, openCardEditor, setAiModalConfig, addToast } = useMobileNavigation();

  const hiddenSections = activeResume.metadata?.hiddenSections || [];
  const isHidden = hiddenSections.includes(activeSection);

  const personal = activeResume.personal || {};
  const assets = activeResume.assets || {};
  const hasPhotoSupport = isPhotoTemplate(activeResume.metadata?.template);
  const activeSectionsList = getBuilderSections(hasPhotoSupport);
  const experience = Array.isArray(activeResume.experience) ? activeResume.experience : [];
  const education = Array.isArray(activeResume.education) ? activeResume.education : [];
  const projects = Array.isArray(activeResume.projects) ? activeResume.projects : [];
  const skills = activeResume.skills || {};
  const certificates = Array.isArray(activeResume.certificates) ? activeResume.certificates : [];
  const achievements = Array.isArray(activeResume.achievements) ? activeResume.achievements : [];
  const languages = Array.isArray(activeResume.languages) ? activeResume.languages : [];
  const socialLinks = activeResume.socialLinks || {};

  // Form Field Change Helper
  const handlePersonalChange = (field, value) => {
    updatePersonal({ ...personal, [field]: value });
  };

  // Section Stepper Previous/Next
  const currentSectionIdx = activeSectionsList.findIndex((s) => s.id === activeSection);
  const handlePrevSection = () => {
    if (currentSectionIdx > 0) {
      setActiveSection(activeSectionsList[currentSectionIdx - 1].id);
    }
  };
  const handleNextSection = () => {
    if (currentSectionIdx < activeSectionsList.length - 1) {
      setActiveSection(activeSectionsList[currentSectionIdx + 1].id);
    }
  };

  // Delete confirmation state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: null, index: -1, title: '' });

  const confirmDelete = (type, idx, title) => {
    setDeleteConfirm({ isOpen: true, type, index: idx, title });
  };

  const handleExecuteDelete = () => {
    const { type, index } = deleteConfirm;
    if (type === 'experience') {
      const updated = experience.filter((_, i) => i !== index);
      updateExperience(updated);
      addToast('Experience entry deleted', 'info');
    } else if (type === 'education') {
      const updated = education.filter((_, i) => i !== index);
      updateEducation(updated);
      addToast('Education entry deleted', 'info');
    } else if (type === 'projects') {
      const updated = projects.filter((_, i) => i !== index);
      updateProjects(updated);
      addToast('Project deleted', 'info');
    }
    setDeleteConfirm({ isOpen: false, type: null, index: -1, title: '' });
  };

  // Skill Add / Remove
  const [newSkillInput, setNewSkillInput] = useState('');
  const [skillCategory, setSkillCategory] = useState('languages');

  const handleAddSkill = () => {
    if (!newSkillInput.trim()) return;
    const skillList = Array.isArray(skills[skillCategory]) ? [...skills[skillCategory]] : [];
    if (!skillList.includes(newSkillInput.trim())) {
      skillList.push(newSkillInput.trim());
      updateSkills({ ...skills, [skillCategory]: skillList });
      addToast(`Added skill to ${skillCategory}`, 'success');
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (category, skillToRemove) => {
    const skillList = Array.isArray(skills[category]) ? skills[category].filter((s) => s !== skillToRemove) : [];
    updateSkills({ ...skills, [category]: skillList });
  };

  return (
    <div className="w-full bg-[var(--ox-bg)] p-4 space-y-4 pb-[calc(180px+env(safe-area-inset-bottom,24px))] select-none no-print">
      
      {/* Mobile Section Header */}
      <div className="p-3 rounded-2xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSection}
              disabled={currentSectionIdx === 0}
              className="p-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] disabled:opacity-30 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              aria-label="Previous section"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h2 className="text-sm font-black text-[var(--ox-text-primary)] capitalize">
              {builderSections.find((s) => s.id === activeSection)?.label || activeSection}
            </h2>
            <button
              onClick={handleNextSection}
              disabled={currentSectionIdx === builderSections.length - 1}
              className="p-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] disabled:opacity-30 min-h-[36px] min-w-[36px] flex items-center justify-center cursor-pointer"
              aria-label="Next section"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            onClick={() => toggleSectionVisibility(activeSection)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 min-h-[36px] cursor-pointer transition-colors ${
              isHidden
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}
          >
            {isHidden ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            <span>{isHidden ? 'Hidden' : 'Visible'}</span>
          </button>
        </div>
      </div>

      {/* 1-COLUMN FORM EDITORS BY SECTION */}

      {/* 1. PERSONAL INFO */}
      {activeSection === 'personal' && (
        <div className="space-y-4">
          {/* Profile Photo Control Card (When selected template supports photos) */}
          {hasPhotoSupport && (
            <div className="p-4 rounded-2xl bg-[var(--ox-card-bg)] border border-orange-500/30 space-y-3.5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-400">
                    <Camera className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-[var(--ox-text-primary)]">Profile Photo</h3>
                    <p className="text-[10px] text-[var(--ox-text-secondary)]">Supported by current template</p>
                  </div>
                </div>
                {assets?.profilePhoto && (
                  <button
                    type="button"
                    onClick={() => {
                      updateAssets('profilePhoto', null);
                      addToast('Profile photo removed', 'info');
                    }}
                    className="text-[10px] font-bold text-red-400 hover:text-red-300 px-2 py-1 rounded-lg bg-red-500/10 border border-red-500/20 cursor-pointer"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3.5">
                {/* Photo Preview Thumbnail */}
                <div
                  className="relative w-16 h-16 shrink-0 bg-[var(--ox-surface-secondary)] border-2 border-orange-500/30 overflow-hidden flex items-center justify-center shadow-inner"
                  style={{
                    borderRadius: assets?.photoShape === 'square' ? '8px' : assets?.photoShape === 'rounded' ? '16px' : '9999px'
                  }}
                >
                  {assets?.profilePhoto ? (
                    <img
                      src={assets.profilePhoto}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-[var(--ox-text-muted)]" />
                  )}
                </div>

                {/* Upload & Choose Controls */}
                <div className="flex-1 space-y-2">
                  <label className="block w-full text-center py-2.5 px-3 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md active:scale-95 transition-transform cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const opt = await optimizeProfileImage(file);
                            updateAssets('profilePhoto', opt);
                            addToast('Profile photo updated', 'success');
                          } catch (err) {
                            addToast('Failed to optimize image', 'error');
                          }
                        }
                      }}
                    />
                    <span>{assets?.profilePhoto ? 'Change Photo' : 'Upload Photo'}</span>
                  </label>

                  {/* Shape Selector */}
                  <div className="flex items-center gap-1.5">
                    {[
                      { id: 'circle', label: 'Circle' },
                      { id: 'rounded', label: 'Rounded' },
                      { id: 'square', label: 'Square' }
                    ].map((shp) => (
                      <button
                        key={shp.id}
                        type="button"
                        onClick={() => updateAssets('photoShape', shp.id)}
                        className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all cursor-pointer ${
                          (assets?.photoShape || 'circle') === shp.id
                            ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                            : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)]'
                        }`}
                      >
                        {shp.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Sample Avatar Presets */}
              <div className="pt-2 border-t border-[var(--ox-border)]/60">
                <div className="text-[10px] font-bold text-[var(--ox-text-secondary)] mb-1.5">Sample Headshots:</div>
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-0.5">
                  {SAMPLE_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => {
                        updateAssets('profilePhoto', av.url);
                        addToast(`Applied ${av.label}`, 'success');
                      }}
                      className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-[var(--ox-border)] hover:border-orange-500 active:scale-95 transition-all cursor-pointer"
                      title={av.label}
                    >
                      <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Full Name *</label>
            <input
              type="text"
              placeholder="e.g. Alex Morgan"
              value={personal.fullName || ''}
              onChange={(e) => handlePersonalChange('fullName', e.target.value)}
              className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3.5 text-sm font-semibold text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Target Job Role *</label>
            <input
              type="text"
              placeholder="e.g. Senior Full Stack Engineer"
              value={personal.targetRole || ''}
              onChange={(e) => handlePersonalChange('targetRole', e.target.value)}
              className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3.5 text-sm font-semibold text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Email Address *</label>
            <input
              type="email"
              placeholder="e.g. alex.morgan@example.com"
              value={personal.email || ''}
              onChange={(e) => handlePersonalChange('email', e.target.value)}
              className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3.5 text-sm font-semibold text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. +1 (555) 019-2834"
              value={personal.phone || ''}
              onChange={(e) => handlePersonalChange('phone', e.target.value)}
              className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3.5 text-sm font-semibold text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Location</label>
            <input
              type="text"
              placeholder="e.g. San Francisco, CA"
              value={personal.location || ''}
              onChange={(e) => handlePersonalChange('location', e.target.value)}
              className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3.5 text-sm font-semibold text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ox-text-secondary)]">LinkedIn Profile URL</label>
            <input
              type="url"
              placeholder="e.g. https://linkedin.com/in/alexmorgan"
              value={personal.linkedin || ''}
              onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
              className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3.5 text-xs font-semibold text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ox-text-secondary)]">GitHub Profile URL</label>
            <input
              type="url"
              placeholder="e.g. https://github.com/alexmorgan"
              value={personal.github || ''}
              onChange={(e) => handlePersonalChange('github', e.target.value)}
              className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3.5 text-xs font-semibold text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Portfolio / Website URL</label>
            <input
              type="url"
              placeholder="e.g. https://alexmorgan.dev"
              value={personal.website || ''}
              onChange={(e) => handlePersonalChange('website', e.target.value)}
              className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3.5 text-xs font-semibold text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
            />
          </div>
        </div>
      )}

      {/* 1.5 DEDICATED PHOTO SECTION */}
      {activeSection === 'photo' && (
        <div className="space-y-4">
          {/* Active Template Status Badge */}
          <div className={`p-3.5 rounded-2xl border text-xs flex items-start gap-2.5 ${
            hasPhotoSupport
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-orange-500/10 border-orange-500/30 text-orange-300'
          }`}>
            <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-bold">
                {hasPhotoSupport
                  ? `Active Template (${activeResume.metadata?.template}) Features Profile Photo!`
                  : `Current Template (${activeResume.metadata?.template || 'Modern ATS'}) does not display photos.`}
              </div>
              <div className="text-[11px] text-[var(--ox-text-secondary)] mt-0.5 leading-relaxed">
                {hasPhotoSupport
                  ? 'Your photo is rendered cleanly on your resume.'
                  : 'Switch to a photo template (e.g. Marketing Accent, Creative Sidebar) in Templates page to display your photo.'}
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[var(--ox-card-bg)] border border-orange-500/30 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-400">
                  <Camera className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[var(--ox-text-primary)]">Profile Photo & Headshot</h3>
                  <p className="text-xs text-[var(--ox-text-secondary)]">Visible on photo-enabled resume templates</p>
                </div>
              </div>
              {assets?.profilePhoto && (
                <button
                  type="button"
                  onClick={() => {
                    updateAssets('profilePhoto', null);
                    addToast('Profile photo removed', 'info');
                  }}
                  className="text-xs font-bold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-xl bg-red-500/10 border border-red-500/20 cursor-pointer"
                >
                  Remove Photo
                </button>
              )}
            </div>

            {/* Photo Large Preview */}
            <div className="flex flex-col items-center justify-center p-4 bg-[var(--ox-surface-secondary)]/50 rounded-2xl border border-[var(--ox-border)] gap-3">
              <div
                className="relative w-24 h-24 bg-[var(--ox-surface-primary)] border-2 border-orange-500/40 overflow-hidden flex items-center justify-center shadow-md"
                style={{
                  borderRadius: assets?.photoShape === 'square' ? '12px' : assets?.photoShape === 'rounded' ? '24px' : '9999px'
                }}
              >
                {assets?.profilePhoto ? (
                  <img
                    src={assets.profilePhoto}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-[var(--ox-text-muted)]" />
                )}
              </div>
              <span className="text-[11px] text-[var(--ox-text-secondary)] font-medium">
                {assets?.profilePhoto ? 'Photo is active on photo templates' : 'No photo uploaded yet'}
              </span>
            </div>

            {/* Upload Button */}
            <label className="block w-full text-center py-3 px-4 rounded-2xl bg-orange-500 text-white font-bold text-xs shadow-md active:scale-95 transition-transform cursor-pointer">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    try {
                      const opt = await optimizeProfileImage(file);
                      updateAssets('profilePhoto', opt);
                      addToast('Profile photo updated', 'success');
                    } catch (err) {
                      addToast('Failed to optimize image', 'error');
                    }
                  }
                }}
              />
              <span className="flex items-center justify-center gap-2">
                <Upload className="w-4 h-4" />
                {assets?.profilePhoto ? 'Choose Different Photo File' : 'Upload Profile Photo'}
              </span>
            </label>

            {/* Shape Selector */}
            <div className="space-y-1.5 pt-1">
              <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Photo Shape</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'circle', label: 'Circle' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'square', label: 'Square' }
                ].map((shp) => (
                  <button
                    key={shp.id}
                    type="button"
                    onClick={() => updateAssets('photoShape', shp.id)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      (assets?.photoShape || 'circle') === shp.id
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-sm'
                        : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)]'
                    }`}
                  >
                    {shp.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sample Avatar Headshots */}
            <div className="space-y-2 pt-2 border-t border-[var(--ox-border)]">
              <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Instant Sample Avatars</label>
              <div className="grid grid-cols-3 gap-2">
                {SAMPLE_AVATARS.map((av) => (
                  <button
                    key={av.id}
                    type="button"
                    onClick={() => {
                      updateAssets('profilePhoto', av.url);
                      addToast(`Selected ${av.label}`, 'success');
                    }}
                    className="flex items-center gap-2 p-2 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] hover:border-orange-500 text-left active:scale-95 transition-all cursor-pointer"
                  >
                    <img src={av.url} alt={av.label} className="w-7 h-7 rounded-full object-cover shrink-0" />
                    <span className="text-[10px] font-bold text-[var(--ox-text-primary)] truncate">{av.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. SUMMARY SECTION */}
      {activeSection === 'summary' && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Executive Summary</label>
              <span className="text-[10px] text-[var(--ox-text-muted)] font-mono font-bold">
                {(personal.summary || '').length} / 1000
              </span>
            </div>

            <textarea
              rows={7}
              placeholder="Write a concise professional intro emphasizing your key achievements, strengths, and career focus..."
              value={personal.summary || ''}
              onChange={(e) => handlePersonalChange('summary', e.target.value)}
              className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl p-4 text-xs font-medium text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* AI Assistance Button placed safely below textarea */}
          <button
            onClick={() => {
              setAiModalConfig({
                isOpen: true,
                title: 'Improve Summary with AI',
                initialPrompt: personal.summary || `Professional summary for a ${personal.targetRole || 'Software Engineer'} with strong background and measurable results.`,
                onGenerate: async () => {
                  const res = await executeAIGeneration({
                    feature: 'summary',
                    prompt: personal.summary || undefined,
                    content: {
                      jobTitle: personal.targetRole || personal.jobTitle || 'Professional',
                      existingSummary: personal.summary || '',
                      skills: activeResume?.skills || {}
                    },
                    targetRole: personal.targetRole || personal.jobTitle
                  });
                  return typeof res?.result === 'string' ? res.result : JSON.stringify(res?.result, null, 2);
                },
                onApply: (newSummary) => handlePersonalChange('summary', newSummary)
              });
            }}
            className="w-full py-3.5 rounded-2xl bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 text-orange-400 font-bold text-xs flex items-center justify-center gap-2 min-h-[48px] active:scale-95 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-amber-400" />
            <span>Improve Summary with AI</span>
          </button>
        </div>
      )}

      {/* 3. WORK EXPERIENCE SECTION */}
      {activeSection === 'experience' && (
        <div className="space-y-4">
          <button
            onClick={() => openCardEditor('experience', null, -1)}
            className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[48px] shadow-md active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Work Experience</span>
          </button>

          <div className="space-y-3">
            {experience.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] space-y-2 relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[var(--ox-text-primary)]">{item.role || item.title || 'Untitled Role'}</h3>
                    <p className="text-xs text-orange-400 font-semibold">{item.company || 'Company Name'}</p>
                    <p className="text-[10px] text-[var(--ox-text-muted)] pt-0.5">{item.startDate} – {item.endDate || 'Present'}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openCardEditor('experience', item, idx)}
                      className="p-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] min-h-[38px] min-w-[38px] flex items-center justify-center cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => confirmDelete('experience', idx, item.role || item.title || 'Experience')}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EDUCATION SECTION */}
      {activeSection === 'education' && (
        <div className="space-y-4">
          <button
            onClick={() => openCardEditor('education', null, -1)}
            className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[48px] shadow-md active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Education</span>
          </button>

          <div className="space-y-3">
            {education.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[var(--ox-text-primary)]">{item.degree || 'Degree Program'}</h3>
                    <p className="text-xs text-orange-400 font-semibold">{item.institution || item.school || 'University'}</p>
                    <p className="text-[10px] text-[var(--ox-text-muted)] pt-0.5">{item.startDate} – {item.endDate}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openCardEditor('education', item, idx)}
                      className="p-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete('education', idx, item.degree || 'Education')}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. PROJECTS SECTION */}
      {activeSection === 'projects' && (
        <div className="space-y-4">
          <button
            onClick={() => openCardEditor('projects', null, -1)}
            className="w-full py-3.5 rounded-2xl bg-orange-500 text-white font-bold text-xs flex items-center justify-center gap-2 min-h-[48px] shadow-md active:scale-95 transition-transform"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Project</span>
          </button>

          <div className="space-y-3">
            {projects.map((item, idx) => (
              <div
                key={item.id || idx}
                className="p-4 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] space-y-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-extrabold text-[var(--ox-text-primary)]">{item.name || item.title || 'Project Name'}</h3>
                    <p className="text-xs text-[var(--ox-text-secondary)] line-clamp-2">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openCardEditor('projects', item, idx)}
                      className="p-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => confirmDelete('projects', idx, item.name || item.title || 'Project')}
                      className="p-2 rounded-xl bg-rose-500/10 text-rose-400 min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. SKILLS SECTION */}
      {activeSection === 'skills' && (
        <div className="space-y-5">
          <div className="p-4 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] space-y-3">
            <h3 className="text-xs font-bold text-[var(--ox-text-secondary)] uppercase tracking-wider">Add Skill Tag</h3>
            
            <div className="flex items-center gap-2">
              <select
                value={skillCategory}
                onChange={(e) => setSkillCategory(e.target.value)}
                className="bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs font-bold text-[var(--ox-text-primary)] rounded-xl px-3 py-3 min-h-[44px]"
              >
                <option value="languages">Languages</option>
                <option value="frameworks">Frameworks</option>
                <option value="tools">Tools / DB</option>
              </select>

              <input
                type="text"
                placeholder="e.g. React, Python..."
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                className="flex-1 bg-[var(--ox-card-bg)] border border-[var(--ox-border)] text-xs text-[var(--ox-text-primary)] rounded-xl px-3 py-3 min-h-[44px]"
              />

              <button
                onClick={handleAddSkill}
                className="p-3 rounded-xl bg-orange-500 text-white font-bold min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categorized Skills Chips */}
          {['languages', 'frameworks', 'tools'].map((cat) => {
            const skillItems = Array.isArray(skills[cat]) ? skills[cat] : [];
            if (skillItems.length === 0) return null;

            return (
              <div key={cat} className="space-y-2">
                <h4 className="text-xs font-bold text-orange-400 capitalize">{cat}</h4>
                <div className="flex flex-wrap gap-2">
                  {skillItems.map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs font-semibold text-[var(--ox-text-primary)] flex items-center gap-1.5 min-h-[38px]"
                    >
                      {sk}
                      <button
                        onClick={() => handleRemoveSkill(cat, sk)}
                        className="p-1 rounded-full text-slate-400 hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky Bottom Stepper Footer */}
      <div className="fixed bottom-14 left-0 right-0 p-3 bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] flex items-center justify-between gap-3 pb-safe z-10 shadow-lg">
        <button
          onClick={handlePrevSection}
          disabled={currentSectionIdx === 0}
          className="px-4 py-2.5 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] font-bold text-xs disabled:opacity-30 min-h-[44px] cursor-pointer"
        >
          Previous
        </button>

        <button
          onClick={handleNextSection}
          disabled={currentSectionIdx === builderSections.length - 1}
          className="px-6 py-2.5 rounded-xl bg-orange-500 text-white font-bold text-xs shadow-md min-h-[44px] cursor-pointer active:scale-95 transition-transform"
        >
          {currentSectionIdx === builderSections.length - 1 ? 'Finish & Review' : 'Save & Next'}
        </button>
      </div>

      {/* Lightweight Delete Confirmation Dialog */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-3xl p-5 w-full max-w-xs space-y-4 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-[var(--ox-text-primary)]">
                Delete this {deleteConfirm.type}?
              </h4>
              <p className="text-xs text-[var(--ox-text-secondary)]">
                "{deleteConfirm.title}" will be permanently removed.
              </p>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, type: null, index: -1, title: '' })}
                className="flex-1 py-2.5 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] font-bold text-xs min-h-[44px]"
              >
                Cancel
              </button>
              <button
                onClick={handleExecuteDelete}
                className="flex-1 py-2.5 rounded-xl bg-rose-500 text-white font-bold text-xs min-h-[44px] shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MobileSectionEditor;
