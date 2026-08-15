import React, { useState } from 'react';
import {
  User, FileText, Briefcase, GraduationCap, FolderGit2, Cpu, Award,
  Trophy, Languages, Share2, Layers, Plus, Trash2, ChevronDown, ChevronUp,
  MoveUp, MoveDown, Camera, Sparkles, Eye, EyeOff, Upload, Crop, Globe, Link as LinkIcon
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { InlineAIBadge } from '../InlineAIBadge';
import { getTemplateCapabilities } from '../../templates';
import { isPhotoTemplate, DEFAULT_PROFILE_PHOTO, SAMPLE_AVATARS } from '../../utils/photoDefaults';

export const TabletEditor = ({ activeSection, onSelectSection, orientation = 'portrait', isLandscape = false, onOpenPhotoCrop }) => {
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
    checkAIAccess,
    toggleSectionVisibility
  } = useResume();

  const [collapsedItems, setCollapsedItems] = useState({});
  const [newSkillInput, setNewSkillInput] = useState('');
  const [activeSkillCategory, setActiveSkillCategory] = useState('frameworks');

  const toggleItemCollapse = (id) => {
    setCollapsedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const {
    personal = {},
    experience = [],
    education = [],
    projects = [],
    skills = {},
    certificates = [],
    achievements = [],
    languages = [],
    socialLinks = {},
    customSections = [],
    metadata = {},
    assets = {}
  } = activeResume || {};

  const hiddenSections = metadata.hiddenSections || [];

  // Two-column layout grid class helper for landscape
  const formGridClass = isLandscape ? 'grid grid-cols-2 gap-3.5 sm:gap-4' : 'grid grid-cols-1 gap-3.5 sm:gap-4';

  const isEmailValid = !personal.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email);

  // ================= EXPERIENCE HANDLERS =================
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

  const removeExperienceItem = (id, targetIdx) =>
    updateExperience(experience.filter((e, idx) => (e.id && id ? e.id !== id : idx !== targetIdx)));

  const updateExperienceField = (id, targetIdx, field, value) =>
    updateExperience(
      experience.map((e, idx) =>
        (e.id && id ? e.id === id : idx === targetIdx) ? { ...e, [field]: value } : e
      )
    );

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
    updateExperience(
      experience.map((e, idx) =>
        (e.id && expId && e.id === expId) || idx === targetIdx
          ? { ...e, bullets: [...(e.bullets || []), ''] }
          : e
      )
    );
  };

  const removeBulletPoint = (expId, targetIdx, bIdx) => {
    updateExperience(
      experience.map((e, idx) =>
        (e.id && expId && e.id === expId) || idx === targetIdx
          ? { ...e, bullets: (e.bullets || []).filter((_, bI) => bI !== bIdx) }
          : e
      )
    );
  };

  // ================= EDUCATION HANDLERS =================
  const addEducationItem = () => {
    const newItem = {
      id: `edu-${Date.now()}`,
      degree: '',
      institution: '',
      location: '',
      startDate: '',
      endDate: ''
    };
    updateEducation([...education, newItem]);
  };

  const removeEducationItem = (id, targetIdx) =>
    updateEducation(education.filter((e, idx) => (e.id && id ? e.id !== id : idx !== targetIdx)));

  const updateEducationField = (id, targetIdx, field, value) =>
    updateEducation(
      education.map((e, idx) =>
        (e.id && id ? e.id === id : idx === targetIdx) ? { ...e, [field]: value } : e
      )
    );

  // ================= PROJECTS HANDLERS =================
  const addProjectItem = () => {
    const newItem = {
      id: `proj-${Date.now()}`,
      name: '',
      description: '',
      techStack: '',
      link: '',
      bullets: ['']
    };
    updateProjects([...projects, newItem]);
  };

  const removeProjectItem = (id, targetIdx) =>
    updateProjects(projects.filter((p, idx) => (p.id && id ? p.id !== id : idx !== targetIdx)));

  const updateProjectField = (id, targetIdx, field, value) =>
    updateProjects(
      projects.map((p, idx) =>
        (p.id && id ? p.id === id : idx === targetIdx) ? { ...p, [field]: value } : p
      )
    );

  // ================= SKILLS HANDLERS =================
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

  // ================= OTHER SECTIONS HANDLERS =================
  const addCertificateItem = () =>
    updateCertificates([...certificates, { id: `cert-${Date.now()}`, name: '', issuer: '', date: '' }]);
  const removeCertificateItem = (id, targetIdx) =>
    updateCertificates(certificates.filter((c, idx) => (c.id && id ? c.id !== id : idx !== targetIdx)));

  const addAchievementItem = () =>
    updateAchievements([...achievements, { id: `ach-${Date.now()}`, title: '', description: '' }]);
  const removeAchievementItem = (id, targetIdx) =>
    updateAchievements(achievements.filter((a, idx) => (a.id && id ? a.id !== id : idx !== targetIdx)));

  const addLanguageItem = () =>
    updateLanguages([...languages, { id: `lang-${Date.now()}`, name: '', proficiency: 'Professional Working' }]);
  const removeLanguageItem = (id, targetIdx) =>
    updateLanguages(languages.filter((l, idx) => (l.id && id ? l.id !== id : idx !== targetIdx)));

  const addCustomSection = () =>
    updateCustomSections([
      ...customSections,
      {
        id: `cust-${Date.now()}`,
        title: 'Volunteering & Leadership',
        items: [{ id: `citem-${Date.now()}`, name: 'Community Leader', description: 'Organized local tech workshops.' }]
      }
    ]);
  const removeCustomSection = (id, targetIdx) =>
    updateCustomSections(customSections.filter((cs, idx) => (cs.id && id ? cs.id !== id : idx !== targetIdx)));

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-6 custom-scrollbar bg-[var(--ox-surface-primary)] text-[var(--ox-text-primary)] transition-colors duration-300">
      <div className="max-w-3xl mx-auto w-full space-y-6">

        {/* 1. PERSONAL INFORMATION */}
        {activeSection === 'personal' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <User className="w-4 h-4 text-orange-400" /> Personal Information
              </h2>
              <button
                type="button"
                onClick={() => toggleSectionVisibility('personal')}
                className="text-xs font-semibold text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] flex items-center gap-1 min-h-[44px]"
              >
                {hiddenSections.includes('personal') ? (
                  <EyeOff className="w-3.5 h-3.5 text-amber-400" />
                ) : (
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                )}
                <span>{hiddenSections.includes('personal') ? 'Hidden in PDF' : 'Visible in PDF'}</span>
              </button>
            </div>

            {/* Profile Photo Quick Card (Only for photo templates) */}
            {isPhotoTemplate(metadata?.template) && (
              <div className="p-3.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-orange-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 bg-[var(--ox-surface-primary)] border-2 border-orange-500/40 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md"
                    style={{
                      borderRadius: assets?.photoShape === 'square' ? '8px' : assets?.photoShape === 'rounded' ? '14px' : '9999px'
                    }}
                  >
                    {assets?.profilePhoto ? (
                      <img src={assets.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[var(--ox-text-primary)]">Profile Photo</div>
                    <div className="text-[10px] text-[var(--ox-text-secondary)]">
                      {assets?.profilePhoto ? 'Photo is active on photo templates' : 'No photo uploaded yet'}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <label className="px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (evt) => {
                            updateAssets('profilePhoto', evt.target?.result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                    <Upload className="w-3.5 h-3.5" />
                    <span>{assets?.profilePhoto ? 'Change' : 'Upload'}</span>
                  </label>

                  {assets?.profilePhoto && (
                    <button
                      type="button"
                      onClick={() => updateAssets('profilePhoto', null)}
                      className="px-2.5 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-lg text-xs font-bold transition-all cursor-pointer"
                    >
                      Remove
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => onSelectSection && onSelectSection('photo')}
                    className="px-3 py-1.5 bg-[var(--ox-surface-primary)] hover:bg-orange-500/10 text-[var(--ox-text-secondary)] hover:text-orange-400 border border-[var(--ox-border)] rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5" /> Manage
                  </button>
                </div>
              </div>
            )}

            <div className={formGridClass}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Full Name *</label>
                <input
                  type="text"
                  value={personal.fullName || ''}
                  onChange={(e) => updatePersonal('fullName', e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full min-h-[44px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Job Title / Target Role</label>
                <input
                  type="text"
                  value={personal.jobTitle || ''}
                  onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full min-h-[44px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Email Address *</label>
                <input
                  type="email"
                  value={personal.email || ''}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                  placeholder="e.g. alex.rivera@opportunityx.dev"
                  className="w-full min-h-[44px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Phone Number</label>
                <input
                  type="text"
                  value={personal.phone || ''}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full min-h-[44px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Location</label>
                <input
                  type="text"
                  value={personal.location || ''}
                  onChange={(e) => updatePersonal('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="w-full min-h-[44px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={personal.linkedin || ''}
                  onChange={(e) => updatePersonal('linkedin', e.target.value)}
                  placeholder="e.g. https://linkedin.com/in/alexrivera"
                  className="w-full min-h-[44px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">GitHub Profile URL</label>
                <input
                  type="url"
                  value={personal.github || ''}
                  onChange={(e) => updatePersonal('github', e.target.value)}
                  placeholder="e.g. https://github.com/alexrivera"
                  className="w-full min-h-[44px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className={`space-y-1 ${isLandscape ? 'col-span-2' : ''}`}>
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Portfolio / Website URL</label>
                <input
                  type="url"
                  value={personal.website || ''}
                  onChange={(e) => updatePersonal('website', e.target.value)}
                  placeholder="e.g. https://alexrivera.dev"
                  className="w-full min-h-[44px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2 text-xs font-medium text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* 1.5 PROFILE PHOTO */}
        {isPhotoTemplate(metadata?.template) && activeSection === 'photo' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <div>
                <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                  <Camera className="w-4 h-4 text-orange-400" /> Profile Photo & Avatar
                </h2>
                <p className="text-xs text-[var(--ox-text-secondary)] mt-0.5">
                  Upload or customize your profile photo for photo-enabled resume templates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => toggleSectionVisibility('photo')}
                className="text-xs font-semibold text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] flex items-center gap-1 min-h-[44px]"
              >
                {hiddenSections.includes('photo') ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                <span>{hiddenSections.includes('photo') ? 'Hidden in PDF' : 'Visible in PDF'}</span>
              </button>
            </div>

            {/* Photo Upload & Preview Card */}
            <div className="p-5 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-5 shadow-lg">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="relative group">
                  <div className={`w-24 h-24 overflow-hidden border-2 border-orange-500/60 bg-[var(--ox-surface-primary)] shadow-2xl flex items-center justify-center ${
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

                <div className="flex-1 space-y-3 w-full text-center sm:text-left">
                  <div className="text-xs font-bold text-[var(--ox-text-primary)]">Upload & Position Photo</div>
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <label className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer flex items-center gap-2 shadow-sm min-h-[44px]">
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
                                if (onOpenPhotoCrop) onOpenPhotoCrop();
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>

                    {assets?.profilePhoto && onOpenPhotoCrop && (
                      <button
                        type="button"
                        onClick={onOpenPhotoCrop}
                        className="px-3.5 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
                      >
                        <Crop className="w-3.5 h-3.5" /> Crop & Adjust
                      </button>
                    )}

                    {assets?.profilePhoto && (
                      <button
                        type="button"
                        onClick={() => updateAssets('profilePhoto', null)}
                        className="px-3.5 py-2 bg-[var(--ox-surface-primary)] hover:bg-red-500/10 text-[var(--ox-text-secondary)] hover:text-red-500 border border-[var(--ox-border)] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer min-h-[44px]"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    )}
                  </div>
                  <p className="text-[10px] text-[var(--ox-text-muted)] font-medium">Supports JPG, PNG, WEBP on-device Base64.</p>
                </div>
              </div>

              {/* Vertical Shift & Layout Controls */}
              <div className="pt-4 border-t border-[var(--ox-border)] space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)]">
                    <span>Vertical Alignment (Up / Down Shift)</span>
                    <span className="text-orange-500">{assets?.photoOffsetY ?? 50}%</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={assets?.photoOffsetY ?? 50}
                    onChange={(e) => updateAssets('photoOffsetY', Number(e.target.value))}
                    className="w-full accent-orange-500 cursor-pointer h-2 bg-[var(--ox-surface-primary)] rounded-lg"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--ox-text-primary)]">Display Size</label>
                    <div className="flex items-center gap-2">
                      {[
                        { id: 'sm', label: 'Small' },
                        { id: 'md', label: 'Medium' },
                        { id: 'lg', label: 'Large' }
                      ].map((sz) => (
                        <button
                          key={sz.id}
                          type="button"
                          onClick={() => updateAssets('photoSize', sz.id)}
                          className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
                            (assets?.photoSize || 'md') === sz.id
                              ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                              : 'bg-[var(--ox-surface-primary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)]'
                          }`}
                        >
                          {sz.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-[var(--ox-text-primary)]">Display Shape</label>
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
                          className={`flex-1 py-1.5 rounded-xl border text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
                            (assets?.photoShape || 'circle') === shp.id
                              ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                              : 'bg-[var(--ox-surface-primary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)]'
                          }`}
                        >
                          {shp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Layout Position Selector */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ox-text-primary)]">Photo Layout Position</label>
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
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all min-h-[40px] cursor-pointer ${
                            (assets?.photoPosition || 'top-left') === pos.id
                              ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                              : 'bg-[var(--ox-surface-primary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)]'
                          }`}
                        >
                          {pos.label}
                        </button>
                      ))}
                  </div>
                </div>
              </div>

              {/* Preset Sample Avatars */}
              <div className="pt-4 border-t border-[var(--ox-border)] space-y-3">
                <div className="text-xs font-bold text-[var(--ox-text-primary)]">Or Choose Sample Headshot</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {SAMPLE_AVATARS.map((av) => (
                    <button
                      key={av.id}
                      type="button"
                      onClick={() => updateAssets('profilePhoto', av.url)}
                      className={`p-2 rounded-xl border flex items-center gap-2 transition-all text-left cursor-pointer ${
                        assets?.profilePhoto === av.url
                          ? 'bg-orange-500/10 border-orange-500 text-orange-400'
                          : 'bg-[var(--ox-surface-primary)] border-[var(--ox-border)] text-[var(--ox-text-secondary)]'
                      }`}
                    >
                      <img src={av.url} alt={av.label} className="w-8 h-8 rounded-full object-cover border border-[var(--ox-border)] flex-shrink-0" />
                      <span className="text-[11px] font-bold truncate">{av.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. EXECUTIVE SUMMARY */}
        {activeSection === 'summary' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-400" /> Executive Summary
              </h2>
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-semibold text-[var(--ox-text-secondary)]">
                <span>Professional Summary</span>
                <span className="text-[10px] opacity-60">{(personal.summary || '').length} chars</span>
              </div>
              <textarea
                rows={6}
                value={personal.summary || ''}
                onChange={(e) => updatePersonal('summary', e.target.value)}
                placeholder="e.g. Versatile Full Stack Software Engineer with 5+ years of experience engineering high-throughput SaaS applications..."
                className="w-full bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl p-3.5 text-xs font-medium text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* 3. WORK EXPERIENCE */}
        {activeSection === 'experience' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-orange-400" /> Work Experience ({experience.length})
              </h2>
              <button
                type="button"
                onClick={addExperienceItem}
                className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Role
              </button>
            </div>

            <div className="space-y-3">
              {experience.map((exp, idx) => {
                const itemKey = exp.id || `exp-${idx}`;
                const isCollapsed = collapsedItems[itemKey];

                return (
                  <div key={itemKey} className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3 shadow-md">
                    {/* Horizontal Card Header */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleItemCollapse(itemKey)}
                        className="flex items-center gap-2 text-xs font-bold text-orange-400 text-left hover:underline min-h-[44px] min-w-[44px]"
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4 text-[var(--ox-text-secondary)]" /> : <ChevronUp className="w-4 h-4 text-[var(--ox-text-secondary)]" />}
                        <span>{exp.role || `Position #${idx + 1}`} {exp.company ? `@ ${exp.company}` : ''}</span>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveExperience(idx, -1)}
                          disabled={idx === 0}
                          className="min-h-[44px] min-w-[44px] p-2 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] disabled:opacity-20 flex items-center justify-center cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveExperience(idx, 1)}
                          disabled={idx === experience.length - 1}
                          className="min-h-[44px] min-w-[44px] p-2 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] disabled:opacity-20 flex items-center justify-center cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExperienceItem(exp.id, idx)}
                          className="min-h-[44px] min-w-[44px] p-2 text-[var(--ox-text-secondary)] hover:text-red-400 flex items-center justify-center cursor-pointer ml-1"
                          title="Delete Role"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {!isCollapsed && (
                      <div className="space-y-3 pt-2">
                        <div className={formGridClass}>
                          <input
                            type="text"
                            value={exp.role || exp.title || ''}
                            onChange={(e) => updateExperienceField(exp.id, idx, 'role', e.target.value)}
                            placeholder="Role / Title"
                            className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                          />
                          <input
                            type="text"
                            value={exp.company || ''}
                            onChange={(e) => updateExperienceField(exp.id, idx, 'company', e.target.value)}
                            placeholder="Company Name"
                            className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                          />
                          <input
                            type="text"
                            value={exp.startDate || ''}
                            onChange={(e) => updateExperienceField(exp.id, idx, 'startDate', e.target.value)}
                            placeholder="Start Date (e.g. Jan 2022)"
                            className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                          />
                          <input
                            type="text"
                            value={exp.endDate ?? (Boolean(exp.current || exp.isCurrent) ? 'Present' : '')}
                            onChange={(e) => {
                              const val = e.target.value;
                              const isNowPresent = /^(present|current|now|till date|ongoing)$/i.test(val.trim());
                              updateExperience(
                                experience.map((item, i) => {
                                  if ((item.id && exp.id && item.id === exp.id) || i === idx) {
                                    return {
                                      ...item,
                                      endDate: val,
                                      current: isNowPresent,
                                      isCurrent: isNowPresent
                                    };
                                  }
                                  return item;
                                })
                              );
                            }}
                            placeholder="End Date (e.g. Dec 2024 or Present)"
                            className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] placeholder:text-[var(--ox-text-secondary)] focus:outline-none focus:border-orange-500"
                          />
                        </div>

                        {/* Present Toggle Checkbox */}
                        <div className="flex items-center gap-2 pt-1">
                          <label className="flex items-center gap-2 text-xs font-semibold text-[var(--ox-text-primary)] cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={Boolean(exp.current || exp.isCurrent || (typeof exp.endDate === 'string' && /^(present|current|now|till date|ongoing)$/i.test(exp.endDate.trim())))}
                              onChange={(e) => {
                                const isChecked = e.target.checked;
                                updateExperience(
                                  experience.map((item, i) => {
                                    if ((item.id && exp.id && item.id === exp.id) || i === idx) {
                                      return {
                                        ...item,
                                        current: isChecked,
                                        isCurrent: isChecked,
                                        endDate: isChecked ? 'Present' : (item.endDate && !/^(present|current|now|till date|ongoing)$/i.test(item.endDate.trim()) ? item.endDate : '')
                                      };
                                    }
                                    return item;
                                  })
                                );
                              }}
                              className="w-4 h-4 rounded border-[var(--ox-border)] text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
                            />
                            <span>Currently working in this role</span>
                          </label>
                        </div>

                        {/* Bullets */}
                        <div className="space-y-2 pt-2 border-t border-[var(--ox-border)]">
                          <label className="text-[11px] font-bold text-[var(--ox-text-secondary)]">Bullet Points</label>
                          {(exp.bullets || []).map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => updateBulletPoint(exp.id, idx, bIdx, e.target.value)}
                                placeholder="Describe key achievement or responsibility..."
                                className="flex-1 min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                              />
                              <button
                                type="button"
                                onClick={() => removeBulletPoint(exp.id, idx, bIdx)}
                                className="min-h-[44px] min-w-[44px] p-2 text-[var(--ox-text-secondary)] hover:text-red-400 flex items-center justify-center cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addBulletPoint(exp.id, idx)}
                            className="text-xs font-semibold text-orange-400 hover:underline flex items-center gap-1 min-h-[44px] pt-1 cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" /> Add Bullet Point
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
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-orange-400" /> Education ({education.length})
              </h2>
              <button
                type="button"
                onClick={addEducationItem}
                className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Education
              </button>
            </div>

            <div className="space-y-3">
              {education.map((edu, idx) => (
                <div key={edu.id || idx} className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">
                      {edu.degree || `Education #${idx + 1}`} {edu.institution ? `@ ${edu.institution}` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEducationItem(edu.id, idx)}
                      className="min-h-[44px] min-w-[44px] p-2 text-[var(--ox-text-secondary)] hover:text-red-400 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className={formGridClass}>
                    <input
                      type="text"
                      value={edu.degree || ''}
                      onChange={(e) => updateEducationField(edu.id, idx, 'degree', e.target.value)}
                      placeholder="Degree (e.g. B.S. Computer Science)"
                      className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => updateEducationField(edu.id, idx, 'institution', e.target.value)}
                      placeholder="Institution / University"
                      className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="text"
                      value={edu.startDate || ''}
                      onChange={(e) => updateEducationField(edu.id, idx, 'startDate', e.target.value)}
                      placeholder="Start Year (e.g. 2020)"
                      className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="text"
                      value={edu.endDate || ''}
                      onChange={(e) => updateEducationField(edu.id, idx, 'endDate', e.target.value)}
                      placeholder="End Year (e.g. 2024)"
                      className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. PROJECTS */}
        {activeSection === 'projects' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-orange-400" /> Projects ({projects.length})
              </h2>
              <button
                type="button"
                onClick={addProjectItem}
                className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>

            <div className="space-y-3">
              {projects.map((proj, idx) => (
                <div key={proj.id || idx} className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">{proj.name || `Project #${idx + 1}`}</span>
                    <button
                      type="button"
                      onClick={() => removeProjectItem(proj.id, idx)}
                      className="min-h-[44px] min-w-[44px] p-2 text-[var(--ox-text-secondary)] hover:text-red-400 flex items-center justify-center cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className={formGridClass}>
                    <input
                      type="text"
                      value={proj.name || ''}
                      onChange={(e) => updateProjectField(proj.id, idx, 'name', e.target.value)}
                      placeholder="Project Name"
                      className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                    />
                    <input
                      type="text"
                      value={proj.techStack || ''}
                      onChange={(e) => updateProjectField(proj.id, idx, 'techStack', e.target.value)}
                      placeholder="Technologies (e.g. React, Node.js, PostgreSQL)"
                      className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={proj.description || ''}
                    onChange={(e) => updateProjectField(proj.id, idx, 'description', e.target.value)}
                    placeholder="Project overview and impact..."
                    className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg p-3 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. SKILLS CHIPS */}
        {activeSection === 'skills' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Cpu className="w-4 h-4 text-orange-400" /> Categorized Skills
              </h2>
            </div>

            {/* Category selection & Input */}
            <div className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1 custom-scrollbar">
                {['frameworks', 'languages', 'tools', 'databases'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveSkillCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all min-h-[44px] cursor-pointer ${
                      activeSkillCategory === cat
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40 shadow-sm'
                        : 'bg-[var(--ox-surface-primary)] text-[var(--ox-text-secondary)] border border-[var(--ox-border)] hover:text-[var(--ox-text-primary)]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSkillInput}
                  onChange={(e) => setNewSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkillChip(activeSkillCategory, newSkillInput);
                    }
                  }}
                  placeholder={`Add a skill under ${activeSkillCategory}...`}
                  className="flex-1 min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => addSkillChip(activeSkillCategory, newSkillInput)}
                  className="min-h-[44px] px-4 bg-orange-500 text-black font-bold text-xs rounded-xl hover:bg-orange-400 transition-colors cursor-pointer"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Categorized Wrapping Chips Display */}
            {['frameworks', 'languages', 'tools', 'databases'].map((cat) => {
              const chipList = skills[cat] || [];
              if (chipList.length === 0) return null;

              return (
                <div key={cat} className="space-y-2">
                  <div className="text-xs font-bold uppercase tracking-wider text-[var(--ox-text-secondary)] capitalize">
                    {cat} ({chipList.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {chipList.map((skillName) => (
                      <span
                        key={skillName}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs font-semibold text-[var(--ox-text-primary)] group shadow-sm"
                      >
                        <span>{skillName}</span>
                        <button
                          type="button"
                          onClick={() => removeSkillChip(cat, skillName)}
                          className="text-[var(--ox-text-secondary)] hover:text-red-400 ml-1 cursor-pointer font-bold"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 7. CERTIFICATES */}
        {activeSection === 'certificates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-400" /> Certificates ({certificates.length})
              </h2>
              <button
                type="button"
                onClick={addCertificateItem}
                className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Certificate
              </button>
            </div>

            <div className="space-y-3">
              {certificates.map((cert, idx) => (
                <div key={cert.id || idx} className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">{cert.name || `Certificate #${idx + 1}`}</span>
                    <button type="button" onClick={() => removeCertificateItem(cert.id, idx)} className="min-h-[44px] min-w-[44px] p-2 text-[var(--ox-text-secondary)] hover:text-red-400 flex items-center justify-center cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={formGridClass}>
                    <input type="text" value={cert.name || ''} onChange={(e) => updateCertificates(certificates.map((c, i) => i === idx ? { ...c, name: e.target.value } : c))} placeholder="Certificate Name" className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500" />
                    <input type="text" value={cert.issuer || ''} onChange={(e) => updateCertificates(certificates.map((c, i) => i === idx ? { ...c, issuer: e.target.value } : c))} placeholder="Issuing Organization" className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. ACHIEVEMENTS */}
        {activeSection === 'achievements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-400" /> Key Achievements ({achievements.length})
              </h2>
              <button type="button" onClick={addAchievementItem} className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5 cursor-pointer">
                <Plus className="w-4 h-4" /> Add Achievement
              </button>
            </div>

            <div className="space-y-3">
              {achievements.map((ach, idx) => (
                <div key={ach.id || idx} className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">{ach.title || `Achievement #${idx + 1}`}</span>
                    <button type="button" onClick={() => removeAchievementItem(ach.id, idx)} className="min-h-[44px] min-w-[44px] p-2 text-[var(--ox-text-secondary)] hover:text-red-400 flex items-center justify-center cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input type="text" value={ach.title || ''} onChange={(e) => updateAchievements(achievements.map((a, i) => i === idx ? { ...a, title: e.target.value } : a))} placeholder="Achievement Title" className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. LANGUAGES */}
        {activeSection === 'languages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Languages className="w-4 h-4 text-orange-400" /> Languages ({languages.length})
              </h2>
              <button type="button" onClick={addLanguageItem} className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5 cursor-pointer">
                <Plus className="w-4 h-4" /> Add Language
              </button>
            </div>

            <div className="space-y-3">
              {languages.map((lang, idx) => (
                <div key={lang.id || idx} className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">{lang.name || `Language #${idx + 1}`}</span>
                    <button type="button" onClick={() => removeLanguageItem(lang.id, idx)} className="min-h-[44px] min-w-[44px] p-2 text-[var(--ox-text-secondary)] hover:text-red-400 flex items-center justify-center cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={formGridClass}>
                    <input type="text" value={lang.name || ''} onChange={(e) => updateLanguages(languages.map((l, i) => i === idx ? { ...l, name: e.target.value } : l))} placeholder="Language (e.g. English)" className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500" />
                    <input type="text" value={lang.proficiency || ''} onChange={(e) => updateLanguages(languages.map((l, i) => i === idx ? { ...l, proficiency: e.target.value } : l))} placeholder="Proficiency (e.g. Native / Professional)" className="w-full min-h-[44px] bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. SOCIAL LINKS */}
        {activeSection === 'socialLinks' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Share2 className="w-4 h-4 text-orange-400" /> Social & Web Links
              </h2>
            </div>

            <div className={formGridClass}>
              {['linkedin', 'github', 'portfolio', 'twitter', 'leetcode'].map((key) => (
                <div key={key} className="space-y-1">
                  <label className="text-xs font-bold text-[var(--ox-text-secondary)] capitalize">{key}</label>
                  <input
                    type="text"
                    value={socialLinks[key] || ''}
                    onChange={(e) => updateSocialLinks({ ...socialLinks, [key]: e.target.value })}
                    placeholder={`https://${key}.com/in/username`}
                    className="w-full min-h-[44px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl px-3.5 py-2 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. CUSTOM SECTIONS */}
        {activeSection === 'customSections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" /> Custom Sections ({customSections.length})
              </h2>
              <button type="button" onClick={addCustomSection} className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5 cursor-pointer">
                <Plus className="w-4 h-4" /> Add Custom Section
              </button>
            </div>

            <div className="space-y-3">
              {customSections.map((cs, idx) => (
                <div key={cs.id || idx} className="p-4 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={cs.title || ''}
                      onChange={(e) => updateCustomSections(customSections.map((c, i) => i === idx ? { ...c, title: e.target.value } : c))}
                      placeholder="Section Title"
                      className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-lg px-3 py-1.5 text-xs font-bold text-[var(--ox-text-primary)] min-h-[44px] focus:outline-none focus:border-orange-500"
                    />
                    <button type="button" onClick={() => removeCustomSection(cs.id, idx)} className="min-h-[44px] min-w-[44px] p-2 text-[var(--ox-text-secondary)] hover:text-red-400 flex items-center justify-center cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default TabletEditor;
