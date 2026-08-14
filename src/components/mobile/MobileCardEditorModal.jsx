import React, { useState, useEffect } from 'react';
import { X, Check, Trash2, Sparkles, Calendar, MapPin, Building, GraduationCap, FolderGit2, Award, Trophy, Globe, Code } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';

export const MobileCardEditorModal = () => {
  const {
    activeResume,
    updateExperience,
    updateEducation,
    updateProjects,
    updateCertificates,
    updateAchievements,
    updateLanguages,
    updateCustomSections
  } = useResume();

  const { isCardEditorOpen, cardEditorConfig, closeCardEditor, addToast } = useMobileNavigation();
  const { section, item, index } = cardEditorConfig;

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (item) {
      setFormData({ ...item });
    } else {
      setFormData({});
    }
  }, [item, section, isCardEditorOpen]);

  if (!isCardEditorOpen || !section) return null;

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (section === 'experience') {
      const currentList = Array.isArray(activeResume.experience) ? [...activeResume.experience] : [];
      if (index >= 0 && index < currentList.length) {
        currentList[index] = { ...currentList[index], ...formData };
      } else {
        currentList.push({ id: `exp-${Date.now()}`, ...formData });
      }
      updateExperience(currentList);
      addToast('Experience saved', 'success');
    } else if (section === 'education') {
      const currentList = Array.isArray(activeResume.education) ? [...activeResume.education] : [];
      if (index >= 0 && index < currentList.length) {
        currentList[index] = { ...currentList[index], ...formData };
      } else {
        currentList.push({ id: `edu-${Date.now()}`, ...formData });
      }
      updateEducation(currentList);
      addToast('Education saved', 'success');
    } else if (section === 'projects') {
      const currentList = Array.isArray(activeResume.projects) ? [...activeResume.projects] : [];
      if (index >= 0 && index < currentList.length) {
        currentList[index] = { ...currentList[index], ...formData };
      } else {
        currentList.push({ id: `proj-${Date.now()}`, ...formData });
      }
      updateProjects(currentList);
      addToast('Project saved', 'success');
    } else if (section === 'certificates') {
      const currentList = Array.isArray(activeResume.certificates) ? [...activeResume.certificates] : [];
      if (index >= 0 && index < currentList.length) {
        currentList[index] = { ...currentList[index], ...formData };
      } else {
        currentList.push({ id: `cert-${Date.now()}`, ...formData });
      }
      updateCertificates(currentList);
      addToast('Certificate saved', 'success');
    } else if (section === 'achievements') {
      const currentList = Array.isArray(activeResume.achievements) ? [...activeResume.achievements] : [];
      if (index >= 0 && index < currentList.length) {
        currentList[index] = { ...currentList[index], ...formData };
      } else {
        currentList.push({ id: `ach-${Date.now()}`, ...formData });
      }
      updateAchievements(currentList);
      addToast('Achievement saved', 'success');
    } else if (section === 'languages') {
      const currentList = Array.isArray(activeResume.languages) ? [...activeResume.languages] : [];
      if (index >= 0 && index < currentList.length) {
        currentList[index] = { ...currentList[index], ...formData };
      } else {
        currentList.push({ id: `lang-${Date.now()}`, ...formData });
      }
      updateLanguages(currentList);
      addToast('Language saved', 'success');
    }

    closeCardEditor();
  };

  const getSectionTitle = () => {
    switch (section) {
      case 'experience': return index >= 0 ? 'Edit Work Experience' : 'Add Work Experience';
      case 'education': return index >= 0 ? 'Edit Education' : 'Add Education';
      case 'projects': return index >= 0 ? 'Edit Project' : 'Add Project';
      case 'certificates': return index >= 0 ? 'Edit Certificate' : 'Add Certificate';
      case 'achievements': return index >= 0 ? 'Edit Achievement' : 'Add Achievement';
      case 'languages': return index >= 0 ? 'Edit Language' : 'Add Language';
      default: return 'Edit Entry';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/85 backdrop-blur-md animate-fadeIn no-print select-none">
      <div className="bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] rounded-t-3xl w-full h-[92dvh] max-h-[92dvh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Sticky Header */}
        <div className="p-4 border-b border-[var(--ox-border)] flex items-center justify-between bg-[var(--ox-surface-secondary)]/70 shrink-0">
          <h3 className="text-base font-black text-[var(--ox-text-primary)]">{getSectionTitle()}</h3>
          <button
            onClick={closeCardEditor}
            className="p-2 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable 1-Column Form Body */}
        <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar flex-1 pb-24">
          
          {/* Work Experience Form */}
          {section === 'experience' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Job Role / Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full Stack Developer"
                  value={formData.role || formData.title || ''}
                  onChange={(e) => {
                    handleChange('role', e.target.value);
                    handleChange('title', e.target.value);
                  }}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-sm text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Company / Organization *</label>
                <input
                  type="text"
                  placeholder="e.g. OpportunityX Inc."
                  value={formData.company || ''}
                  onChange={(e) => handleChange('company', e.target.value)}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-sm text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. Jan 2024"
                    value={formData.startDate || ''}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-3 py-3 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ox-text-secondary)]">End Date</label>
                  <input
                    type="text"
                    disabled={Boolean(formData.current || formData.isCurrent)}
                    placeholder={Boolean(formData.current || formData.isCurrent) ? 'Present' : 'e.g. Dec 2024'}
                    value={Boolean(formData.current || formData.isCurrent) ? 'Present' : formData.endDate || ''}
                    onChange={(e) => {
                      handleChange('endDate', e.target.value);
                      handleChange('current', false);
                      handleChange('isCurrent', false);
                    }}
                    className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-3 py-3 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px] disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Present Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <label className="flex items-center gap-2 text-xs font-semibold text-[var(--ox-text-primary)] cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={Boolean(formData.current || formData.isCurrent)}
                    onChange={(e) => {
                      const isChecked = e.target.checked;
                      handleChange('current', isChecked);
                      handleChange('isCurrent', isChecked);
                      if (isChecked) {
                        handleChange('endDate', '');
                      }
                    }}
                    className="w-4 h-4 rounded border-slate-700 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
                  />
                  <span>Currently working in this role</span>
                </label>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Location</label>
                <input
                  type="text"
                  placeholder="e.g. San Francisco, CA (Remote)"
                  value={formData.location || ''}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-sm text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Description / Bullet Points</label>
                <textarea
                  rows={5}
                  placeholder="• Spearheaded design and architecture of high-performance frontend architecture..."
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl p-4 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Technologies Used</label>
                <input
                  type="text"
                  placeholder="e.g. React, Node.js, Python, PostgreSQL"
                  value={Array.isArray(formData.technologies) ? formData.technologies.join(', ') : formData.technologies || ''}
                  onChange={(e) => handleChange('technologies', e.target.value.split(',').map(s => s.trim()))}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>
            </>
          )}

          {/* Education Form */}
          {section === 'education' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Degree / Program *</label>
                <input
                  type="text"
                  placeholder="e.g. Bachelor of Science in Computer Science"
                  value={formData.degree || ''}
                  onChange={(e) => handleChange('degree', e.target.value)}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-sm text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Institution / University *</label>
                <input
                  type="text"
                  placeholder="e.g. Stanford University"
                  value={formData.institution || formData.school || ''}
                  onChange={(e) => {
                    handleChange('institution', e.target.value);
                    handleChange('school', e.target.value);
                  }}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-sm text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Start Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2021"
                    value={formData.startDate || ''}
                    onChange={(e) => handleChange('startDate', e.target.value)}
                    className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-3 py-3 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-[var(--ox-text-secondary)]">End Date</label>
                  <input
                    type="text"
                    placeholder="e.g. 2025"
                    value={formData.endDate || ''}
                    onChange={(e) => handleChange('endDate', e.target.value)}
                    className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-3 py-3 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">CGPA / Grade / Score</label>
                <input
                  type="text"
                  placeholder="e.g. 3.9 / 4.0"
                  value={formData.grade || formData.cgpa || ''}
                  onChange={(e) => {
                    handleChange('grade', e.target.value);
                    handleChange('cgpa', e.target.value);
                  }}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-sm text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>
            </>
          )}

          {/* Projects Form */}
          {section === 'projects' && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Project Name *</label>
                <input
                  type="text"
                  placeholder="e.g. OpportunityX SaaS Platform"
                  value={formData.name || formData.title || ''}
                  onChange={(e) => {
                    handleChange('name', e.target.value);
                    handleChange('title', e.target.value);
                  }}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-sm text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Description</label>
                <textarea
                  rows={4}
                  placeholder="Built AI-powered document generation system with realtime WebSocket synchronization..."
                  value={formData.description || ''}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl p-4 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Live URL</label>
                <input
                  type="text"
                  placeholder="e.g. https://opportunityx.org"
                  value={formData.link || formData.url || ''}
                  onChange={(e) => {
                    handleChange('link', e.target.value);
                    handleChange('url', e.target.value);
                  }}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">GitHub Repository</label>
                <input
                  type="text"
                  placeholder="e.g. https://github.com/username/repo"
                  value={formData.github || ''}
                  onChange={(e) => handleChange('github', e.target.value)}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>
            </>
          )}

          {/* Generic fallback for Certificates / Achievements / Languages */}
          {!['experience', 'education', 'projects'].includes(section) && (
            <div className="space-y-3">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Title / Name *</label>
                <input
                  type="text"
                  placeholder="Enter title"
                  value={formData.title || formData.name || ''}
                  onChange={(e) => {
                    handleChange('title', e.target.value);
                    handleChange('name', e.target.value);
                  }}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl px-4 py-3 text-sm text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none min-h-[48px]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[var(--ox-text-secondary)]">Description / Subtitle</label>
                <textarea
                  rows={3}
                  placeholder="Enter details"
                  value={formData.description || formData.issuer || formData.level || ''}
                  onChange={(e) => {
                    handleChange('description', e.target.value);
                    handleChange('issuer', e.target.value);
                  }}
                  className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-2xl p-4 text-xs text-[var(--ox-text-primary)] focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          )}

        </div>

        {/* Sticky Bottom Action Footer */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] flex items-center justify-end gap-3 pb-safe">
          <button
            onClick={closeCardEditor}
            className="px-5 py-3 rounded-2xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] font-bold text-xs min-h-[48px] cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-xs flex items-center gap-2 min-h-[48px] shadow-lg cursor-pointer active:scale-95 transition-transform"
          >
            <Check className="w-4 h-4" />
            <span>Save Entry</span>
          </button>
        </div>

      </div>
    </div>
  );
};

export default MobileCardEditorModal;
