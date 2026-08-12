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

export const TabletEditor = ({ activeSection, orientation = 'portrait', isLandscape = false }) => {
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
  const formGridClass = isLandscape ? 'grid grid-cols-2 gap-4' : 'grid grid-cols-1 gap-4';

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
      institution: '',
      degree: '',
      location: '',
      startDate: '',
      endDate: '2025',
      gpa: '',
      description: ''
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
        (p.id && id ? p.id === id : idx === targetIdx)
          ? field === 'techStack'
            ? { ...p, techStack: value, technologies: typeof value === 'string' ? value.split(',').map(s => s.trim()).filter(Boolean) : value }
            : { ...p, [field]: value }
          : p
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
    <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6 custom-scrollbar bg-[var(--ox-surface-primary)] text-[var(--ox-text-primary)] transition-colors duration-300">
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

            <div className={formGridClass}>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Full Name *</label>
                <input
                  type="text"
                  value={personal.fullName || ''}
                  onChange={(e) => updatePersonal('fullName', e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Job Title / Target Role</label>
                <input
                  type="text"
                  value={personal.jobTitle || ''}
                  onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                  placeholder="e.g. Senior Full Stack Engineer"
                  className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Email Address *</label>
                <input
                  type="email"
                  value={personal.email || ''}
                  onChange={(e) => updatePersonal('email', e.target.value)}
                  placeholder="e.g. alex.rivera@opportunityx.dev"
                  className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Phone Number</label>
                <input
                  type="text"
                  value={personal.phone || ''}
                  onChange={(e) => updatePersonal('phone', e.target.value)}
                  placeholder="e.g. +1 (555) 234-5678"
                  className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className={`space-y-1 ${isLandscape ? 'col-span-2' : ''}`}>
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Location</label>
                <input
                  type="text"
                  value={personal.location || ''}
                  onChange={(e) => updatePersonal('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA / Remote"
                  className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                />
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
                <span>Summary Text</span>
                <span className="text-[10px] opacity-60">{(personal.summary || '').length} chars</span>
              </div>
              <textarea
                rows={6}
                value={personal.summary || ''}
                onChange={(e) => updatePersonal('summary', e.target.value)}
                placeholder="e.g. Versatile Full Stack Software Engineer with 5+ years of experience engineering high-throughput SaaS applications..."
                className="w-full bg-[#10131D] border border-slate-800 rounded-xl p-3.5 text-xs font-medium text-white focus:border-orange-500 focus:outline-none leading-relaxed"
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
                  <div key={itemKey} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3 shadow-md">
                    {/* Horizontal Card Header */}
                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        onClick={() => toggleItemCollapse(itemKey)}
                        className="flex items-center gap-2 text-xs font-bold text-orange-400 text-left hover:underline min-h-[44px] min-w-[44px]"
                      >
                        {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                        <span>{exp.role || `Position #${idx + 1}`} {exp.company ? `@ ${exp.company}` : ''}</span>
                      </button>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => moveExperience(idx, -1)}
                          disabled={idx === 0}
                          className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-white disabled:opacity-20 flex items-center justify-center cursor-pointer"
                          title="Move Up"
                        >
                          <MoveUp className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveExperience(idx, 1)}
                          disabled={idx === experience.length - 1}
                          className="min-h-[44px] min-w-[44px] p-2 text-slate-400 hover:text-white disabled:opacity-20 flex items-center justify-center cursor-pointer"
                          title="Move Down"
                        >
                          <MoveDown className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeExperienceItem(exp.id, idx)}
                          className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-red-400 flex items-center justify-center cursor-pointer ml-1"
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
                            value={exp.role || ''}
                            onChange={(e) => updateExperienceField(exp.id, idx, 'role', e.target.value)}
                            placeholder="Role / Title"
                            className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={exp.company || ''}
                            onChange={(e) => updateExperienceField(exp.id, idx, 'company', e.target.value)}
                            placeholder="Company Name"
                            className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={exp.startDate || ''}
                            onChange={(e) => updateExperienceField(exp.id, idx, 'startDate', e.target.value)}
                            placeholder="Start Date (e.g. Jan 2022)"
                            className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={exp.endDate || ''}
                            onChange={(e) => updateExperienceField(exp.id, idx, 'endDate', e.target.value)}
                            placeholder="End Date (e.g. Present)"
                            className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                          />
                        </div>

                        {/* Bullets */}
                        <div className="space-y-2 pt-2 border-t border-slate-800/80">
                          <label className="text-[11px] font-bold text-slate-300">Bullet Points</label>
                          {(exp.bullets || []).map((bullet, bIdx) => (
                            <div key={bIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={bullet}
                                onChange={(e) => updateBulletPoint(exp.id, idx, bIdx, e.target.value)}
                                placeholder="Describe key achievement or responsibility..."
                                className="flex-1 min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => removeBulletPoint(exp.id, idx, bIdx)}
                                className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-red-400 flex items-center justify-center"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => addBulletPoint(exp.id, idx)}
                            className="text-xs font-semibold text-orange-400 hover:underline flex items-center gap-1 min-h-[44px] pt-1"
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
                <div key={edu.id || idx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">
                      {edu.degree || `Education #${idx + 1}`} {edu.institution ? `@ ${edu.institution}` : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEducationItem(edu.id, idx)}
                      className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-red-400 flex items-center justify-center cursor-pointer"
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
                      className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={edu.institution || ''}
                      onChange={(e) => updateEducationField(edu.id, idx, 'institution', e.target.value)}
                      placeholder="Institution / University"
                      className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={edu.startDate || ''}
                      onChange={(e) => updateEducationField(edu.id, idx, 'startDate', e.target.value)}
                      placeholder="Start Year (e.g. 2020)"
                      className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={edu.endDate || ''}
                      onChange={(e) => updateEducationField(edu.id, idx, 'endDate', e.target.value)}
                      placeholder="End Year (e.g. 2024)"
                      className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
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
                <div key={proj.id || idx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">{proj.name || `Project #${idx + 1}`}</span>
                    <button
                      type="button"
                      onClick={() => removeProjectItem(proj.id, idx)}
                      className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-red-400 flex items-center justify-center cursor-pointer"
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
                      className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      value={proj.techStack || ''}
                      onChange={(e) => updateProjectField(proj.id, idx, 'techStack', e.target.value)}
                      placeholder="Technologies (e.g. React, Node.js, PostgreSQL)"
                      className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                  <textarea
                    rows={3}
                    value={proj.description || ''}
                    onChange={(e) => updateProjectField(proj.id, idx, 'description', e.target.value)}
                    placeholder="Project overview and impact..."
                    className="w-full bg-[#080B12] border border-slate-800 rounded-lg p-3 text-xs text-white"
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
            <div className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 overflow-x-auto pb-1">
                {['frameworks', 'languages', 'tools', 'databases'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setActiveSkillCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all min-h-[44px] ${
                      activeSkillCategory === cat
                        ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800'
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
                  className="flex-1 min-h-[44px] bg-[#080B12] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => addSkillChip(activeSkillCategory, newSkillInput)}
                  className="min-h-[44px] px-4 bg-orange-500 text-black font-bold text-xs rounded-xl hover:bg-orange-400 transition-colors"
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
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 capitalize">
                    {cat} ({chipList.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {chipList.map((skillName) => (
                      <span
                        key={skillName}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-white group"
                      >
                        <span>{skillName}</span>
                        <button
                          type="button"
                          onClick={() => removeSkillChip(cat, skillName)}
                          className="text-slate-500 hover:text-red-400 ml-1"
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

        {/* 7. CERTIFICATES, ACHIEVEMENTS, LANGUAGES, SOCIAL LINKS, CUSTOM */}
        {activeSection === 'certificates' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-400" /> Certificates ({certificates.length})
              </h2>
              <button
                type="button"
                onClick={addCertificateItem}
                className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Certificate
              </button>
            </div>

            <div className="space-y-3">
              {certificates.map((cert, idx) => (
                <div key={cert.id || idx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">{cert.name || `Certificate #${idx + 1}`}</span>
                    <button type="button" onClick={() => removeCertificateItem(cert.id, idx)} className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-red-400 flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={formGridClass}>
                    <input type="text" value={cert.name || ''} onChange={(e) => updateCertificates(certificates.map((c, i) => i === idx ? { ...c, name: e.target.value } : c))} placeholder="Certificate Name" className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                    <input type="text" value={cert.issuer || ''} onChange={(e) => updateCertificates(certificates.map((c, i) => i === idx ? { ...c, issuer: e.target.value } : c))} placeholder="Issuing Organization" className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'achievements' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Trophy className="w-4 h-4 text-orange-400" /> Key Achievements ({achievements.length})
              </h2>
              <button type="button" onClick={addAchievementItem} className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Achievement
              </button>
            </div>

            <div className="space-y-3">
              {achievements.map((ach, idx) => (
                <div key={ach.id || idx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">{ach.title || `Achievement #${idx + 1}`}</span>
                    <button type="button" onClick={() => removeAchievementItem(ach.id, idx)} className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-red-400 flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input type="text" value={ach.title || ''} onChange={(e) => updateAchievements(achievements.map((a, i) => i === idx ? { ...a, title: e.target.value } : a))} placeholder="Achievement Title" className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'languages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Languages className="w-4 h-4 text-orange-400" /> Languages ({languages.length})
              </h2>
              <button type="button" onClick={addLanguageItem} className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Language
              </button>
            </div>

            <div className="space-y-3">
              {languages.map((lang, idx) => (
                <div key={lang.id || idx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-orange-400">{lang.name || `Language #${idx + 1}`}</span>
                    <button type="button" onClick={() => removeLanguageItem(lang.id, idx)} className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-red-400 flex items-center justify-center">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className={formGridClass}>
                    <input type="text" value={lang.name || ''} onChange={(e) => updateLanguages(languages.map((l, i) => i === idx ? { ...l, name: e.target.value } : l))} placeholder="Language (e.g. English)" className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                    <input type="text" value={lang.proficiency || ''} onChange={(e) => updateLanguages(languages.map((l, i) => i === idx ? { ...l, proficiency: e.target.value } : l))} placeholder="Proficiency (e.g. Native / Professional)" className="w-full min-h-[44px] bg-[#080B12] border border-slate-800 rounded-lg px-3 py-2 text-xs text-white" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
                  <label className="text-xs font-bold text-slate-300 capitalize">{key}</label>
                  <input
                    type="text"
                    value={socialLinks[key] || ''}
                    onChange={(e) => updateSocialLinks({ ...socialLinks, [key]: e.target.value })}
                    placeholder={`https://${key}.com/in/username`}
                    className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'customSections' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--ox-border)]">
              <h2 className="text-base font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                <Layers className="w-4 h-4 text-orange-400" /> Custom Sections ({customSections.length})
              </h2>
              <button type="button" onClick={addCustomSection} className="px-3.5 min-h-[44px] text-xs font-bold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-xl flex items-center gap-1.5">
                <Plus className="w-4 h-4" /> Add Custom Section
              </button>
            </div>

            <div className="space-y-3">
              {customSections.map((cs, idx) => (
                <div key={cs.id || idx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3 shadow-md">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={cs.title || ''}
                      onChange={(e) => updateCustomSections(customSections.map((c, i) => i === idx ? { ...c, title: e.target.value } : c))}
                      placeholder="Section Title"
                      className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-white min-h-[44px]"
                    />
                    <button type="button" onClick={() => removeCustomSection(cs.id, idx)} className="min-h-[44px] min-w-[44px] p-2 text-slate-500 hover:text-red-400 flex items-center justify-center">
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
