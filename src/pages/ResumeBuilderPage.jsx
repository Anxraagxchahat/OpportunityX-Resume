import React, { useState } from 'react';
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

import {
  Plus, Trash2, ChevronDown, ChevronUp, MoveUp, MoveDown, User, FileText,
  Briefcase, GraduationCap, FolderGit2, Cpu, Award, Trophy, Languages, Share2,
  Layers, X, Eye, EyeOff
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
    versions,
    restoreVersionSnapshot,
    createVersionSnapshot,
    checkAIAccess,
    toggleSectionVisibility
  } = useResume();

  const [activeSection, setActiveSection] = useState('personal');
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

  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [], socialLinks = {}, customSections = [], metadata = {} } = activeResume;
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
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-[#05070D]">
      {/* Recovery Banner */}
      <ResumeRecoveryBanner />

      {/* Top Toolbar */}
      <BuilderToolbar
        onOpenVersionHistory={() => setIsVersionHistoryOpen(true)}
        onTogglePreview={() => setIsMobilePreviewActive(!isMobilePreviewActive)}
        isMobilePreviewActive={isMobilePreviewActive}
      />

      {/* Main Split Screen Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Form Editor & Persistent Sidebar */}
        <div className={`flex-1 lg:flex flex flex-row overflow-hidden no-print ${isMobilePreviewActive ? 'hidden lg:flex' : 'flex'}`}>
          <BuilderSidebarNav activeSection={activeSection} onSelectSection={(secId) => setActiveSection(secId)} />

          <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#080B12]">
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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Full Name *</label>
                    <input
                      type="text"
                      value={personal.fullName || ''}
                      onChange={(e) => updatePersonal('fullName', e.target.value)}
                      placeholder="Alex Rivera"
                      className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-300">Job Title / Target Role</label>
                    <input
                      type="text"
                      value={personal.jobTitle || ''}
                      onChange={(e) => updatePersonal('jobTitle', e.target.value)}
                      placeholder="Senior Full Stack Software Engineer"
                      className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
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
                      placeholder="alex.rivera@opportunityx.dev"
                      className={`w-full bg-[#10131D] border rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:outline-none ${
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
                      placeholder="+1 (555) 234-5678"
                      className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-300">Location</label>
                    <input
                      type="text"
                      value={personal.location || ''}
                      onChange={(e) => updatePersonal('location', e.target.value)}
                      placeholder="San Francisco, CA / Remote"
                      className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
                    />
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
                    placeholder="Write a compelling executive summary..."
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
                                placeholder="Job Title"
                                className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={exp.company || ''}
                                onChange={(e) => updateExperienceField(exp.id, 'company', e.target.value)}
                                placeholder="Company Name"
                                className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                              <input
                                type="text"
                                value={exp.startDate || ''}
                                onChange={(e) => updateExperienceField(exp.id, 'startDate', e.target.value)}
                                placeholder="Start Date"
                                className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                              <input
                                type="text"
                                disabled={exp.current}
                                value={exp.current ? 'Present' : exp.endDate || ''}
                                onChange={(e) => updateExperienceField(exp.id, 'endDate', e.target.value)}
                                placeholder="End Date"
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
                          <input type="text" value={edu.degree || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, degree: e.target.value } : ed)))} placeholder="B.S. in Computer Science" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">University / School</label>
                          <input type="text" value={edu.institution || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, institution: e.target.value } : ed)))} placeholder="University of California, Berkeley" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">Start Date</label>
                          <input type="text" value={edu.startDate || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, startDate: e.target.value } : ed)))} placeholder="2017-08" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">End Date</label>
                          <input type="text" value={edu.endDate || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, endDate: e.target.value } : ed)))} placeholder="2021-05 or Present" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-semibold text-slate-400">GPA / Score</label>
                          <input type="text" value={edu.gpa || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, gpa: e.target.value } : ed)))} placeholder="3.88 / 4.0" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                        </div>
                      </div>

                      <div className="space-y-1 pt-1">
                        <label className="text-[11px] font-semibold text-slate-400">Relevant Coursework</label>
                        <input type="text" value={edu.relevantCoursework || ''} onChange={(e) => updateEducation(education.map((ed) => (ed.id === edu.id ? { ...ed, relevantCoursework: e.target.value } : ed)))} placeholder="Algorithms & Data Structures, Operating Systems, Database Systems, Computer Networks, Machine Learning" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
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
                      <input type="text" value={proj.name || ''} onChange={(e) => updateProjects(projects.map((p) => (p.id === proj.id ? { ...p, name: e.target.value } : p)))} placeholder="Project Name" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
                      <textarea rows={2} value={proj.description || ''} onChange={(e) => updateProjects(projects.map((p) => (p.id === proj.id ? { ...p, description: e.target.value } : p)))} placeholder="Short description..." className="w-full bg-[#080B12] border border-slate-800 rounded-lg p-2 text-xs text-white" />
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
                    <input type="text" value={newSkillInput} onChange={(e) => setNewSkillInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addSkillChip(skillCategory, newSkillInput); } }} placeholder="Type skill & press Enter" className="flex-1 bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
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
                  <button onClick={addCertificateItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg"><Plus className="w-3.5 h-3.5" /> Add</button>
                </div>
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-2">
                    <input type="text" value={cert.name || ''} onChange={(e) => updateCertificates(certificates.map((c) => (c.id === cert.id ? { ...c, name: e.target.value } : c)))} placeholder="Cert Title" className="w-full bg-[#080B12] border border-slate-800 rounded px-3 py-1 text-xs text-white" />
                  </div>
                ))}
              </div>
            )}

            {/* 8. ACHIEVEMENTS */}
            {activeSection === 'achievements' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><Trophy className="w-4 h-4 text-orange-400" /> Achievements ({achievements.length})</h2>
                  <button onClick={addAchievementItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg"><Plus className="w-3.5 h-3.5" /> Add</button>
                </div>
                {achievements.map((ach) => (
                  <div key={ach.id} className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-2">
                    <input type="text" value={ach.title || ''} onChange={(e) => updateAchievements(achievements.map((a) => (a.id === ach.id ? { ...a, title: e.target.value } : a)))} placeholder="Title" className="w-full bg-[#080B12] border border-slate-800 rounded px-3 py-1 text-xs text-white" />
                  </div>
                ))}
              </div>
            )}

            {/* 9. LANGUAGES */}
            {activeSection === 'languages' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><Languages className="w-4 h-4 text-orange-400" /> Languages ({languages.length})</h2>
                  <button onClick={addLanguageItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg"><Plus className="w-3.5 h-3.5" /> Add</button>
                </div>
                {languages.map((lang) => (
                  <div key={lang.id} className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-2">
                    <input type="text" value={lang.name || ''} onChange={(e) => updateLanguages(languages.map((l) => (l.id === lang.id ? { ...l, name: e.target.value } : l)))} placeholder="Language" className="w-full bg-[#080B12] border border-slate-800 rounded px-3 py-1 text-xs text-white" />
                  </div>
                ))}
              </div>
            )}

            {/* 10. SOCIAL LINKS */}
            {activeSection === 'socialLinks' && (
              <div className="space-y-4 max-w-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <h2 className="text-base font-bold text-white flex items-center gap-2"><Share2 className="w-4 h-4 text-orange-400" /> Social Links</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input type="text" value={personal.github || ''} onChange={(e) => updatePersonal('github', e.target.value)} placeholder="github.com/alex" className="bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white" />
                  <input type="text" value={personal.linkedin || ''} onChange={(e) => updatePersonal('linkedin', e.target.value)} placeholder="linkedin.com/in/alex" className="bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white" />
                </div>
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
                    <input type="text" value={cs.title} onChange={(e) => updateCustomSections(customSections.map((s) => (s.id === cs.id ? { ...s, title: e.target.value } : s)))} placeholder="Custom Section Title" className="w-full bg-[#080B12] border border-slate-800 rounded px-3 py-1 text-xs font-bold text-orange-400" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sticky A4 Live Preview */}
        <div className={`w-full lg:w-[48%] h-full flex flex-col print:w-full print:block print:h-auto print:static ${isMobilePreviewActive ? 'flex' : 'hidden lg:flex'}`}>
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
    </div>
  );
};
