import React from 'react';
import './styles.css';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';
import { shouldRenderBlock } from '../../utils/paginationEngine';

export const BREPurpleTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, assets = {} } = resumeData || {};

  const accentColor = accentHex || '#7c3aed';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;
  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="bre-purple-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Header */}
      {isVisible('header') && (
        <div data-block-id="header" className="bre-purple-header flex items-center justify-between" style={{ borderColor: accentColor }}>
          <div>
            <div className="bre-purple-name">{personal.fullName || 'Your Name'}</div>
            <div className="bre-purple-title" style={{ color: accentColor }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</div>
            <div className="mt-1 text-[11px] text-slate-500 font-mono">
              {[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(' | ')}
            </div>
          </div>
          <img src={photoSrc} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 shadow-sm flex-shrink-0" style={{ borderColor: accentColor }} />
        </div>
      )}

      {personal.summary && isVisible('summary') && (
        <div data-block-id="summary" className="mb-3">
          <div className="bre-purple-heading" style={{ color: accentColor }}>Summary</div>
          <p className="text-[11px] leading-relaxed text-slate-700">{personal.summary}</p>
        </div>
      )}

      {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
        <div className="mb-3">
          <div className="bre-purple-heading" style={{ color: accentColor }}>Work Experience</div>
          {experience.map((exp, i) => isVisible(`exp-${i}`) && (
            <div key={exp.id || i} data-block-id={`exp-${i}`} className="mb-2.5">
              <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                <span>{exp.role} — <span className="font-semibold text-slate-600">{exp.company}</span></span>
                <span className="text-[10px] text-slate-500 font-normal">{exp.startDate} – {exp.endDate || 'Present'}</span>
              </div>
              {exp.bullets && (
                <ul className="list-disc pl-4 text-[11px] text-slate-700 mt-1 space-y-0.5">
                  {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
        <div className="mb-3">
          <div className="bre-purple-heading" style={{ color: accentColor }}>Projects</div>
          {projects.map((p, i) => isVisible(`proj-${i}`) && (
            <div key={p.id || i} data-block-id={`proj-${i}`} className="mb-2">
              <div className="text-xs font-bold text-slate-900">{p.name} {p.techStack && <span className="text-slate-500 font-normal">({p.techStack})</span>}</div>
              {Array.isArray(p.bullets) && p.bullets.filter(Boolean).length > 0 ? (
                <ul className="list-disc pl-4 text-[11px] text-slate-700 mt-1 space-y-0.5">
                  {p.bullets.filter(Boolean).map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              ) : p.description ? (
                <p className="text-[11px] text-slate-700 mt-0.5">{p.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
        <div className="mb-3">
          <div className="bre-purple-heading" style={{ color: accentColor }}>Education</div>
          {education.map((edu, i) => isVisible(`edu-${i}`) && (
            <div key={edu.id || i} data-block-id={`edu-${i}`} className="mb-1.5">
              <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                <span>{edu.degree} — <span className="font-normal text-slate-600">{edu.institution}</span></span>
                <span className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate || 'Present'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && isVisible('skills') && (
        <div data-block-id="skills">
          <div className="bre-purple-heading" style={{ color: accentColor }}>Skills</div>
          <div className="text-xs space-y-0.5 text-slate-700">
            {skills.languages?.length > 0 && <div><strong>Languages:</strong> {skills.languages.join(', ')}</div>}
            {skills.frameworks?.length > 0 && <div><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
            {skills.tools?.length > 0 && <div><strong>Tools:</strong> {skills.tools.join(', ')}</div>}
          </div>
        </div>
      )}
    </div>
  );
};
