import React from 'react';
import './styles.css';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';

export const BREObliqueTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, assets = {} } = resumeData || {};

  const accentColor = accentHex || '#4f46e5';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  return (
    <div className="bre-oblique-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Oblique Slanted Header */}
      <div className="bre-oblique-header flex items-center justify-between" style={{ background: `linear-gradient(135deg, ${accentColor} 0%, #1e1b4b 100%)` }}>
        <div>
          <div className="bre-oblique-name">{personal.fullName || 'Your Name'}</div>
          <div className="bre-oblique-title">{personal.jobTitle || personal.targetRole || 'Job Title'}</div>
          <div className="mt-2 text-[11px] text-white/80 flex flex-wrap gap-x-3 gap-y-0.5">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>• {personal.phone}</span>}
            {personal.location && <span>• {personal.location}</span>}
          </div>
        </div>
        <img src={photoSrc} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-lg flex-shrink-0" />
      </div>

      <div className="pt-2">
        {personal.summary && (
          <div>
            <div className="bre-oblique-heading" style={{ color: accentColor, borderColor: accentColor }}>Profile</div>
            <p className="text-[11px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <div className="bre-oblique-heading" style={{ color: accentColor, borderColor: accentColor }}>Experience</div>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>{exp.role} <span className="font-semibold text-slate-600">— {exp.company}</span></span>
                  <span className="text-[10px] text-slate-500 font-normal">{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                {exp.bullets && (
                  <ul className="list-disc pl-4 text-[11px] text-slate-700 mt-1 space-y-0.5">
                    {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <div className="bre-oblique-heading" style={{ color: accentColor, borderColor: accentColor }}>Projects</div>
            {projects.map((p) => (
              <div key={p.id} className="mb-2.5">
                <div className="text-xs font-bold text-slate-900">{p.name} {p.techStack && <span className="text-slate-500 font-normal">({p.techStack})</span>}</div>
                {p.description && <p className="text-[11px] text-slate-700 mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <div className="bre-oblique-heading" style={{ color: accentColor, borderColor: accentColor }}>Education</div>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2">
                <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                  <span>{edu.degree} — <span className="font-normal text-slate-600">{edu.institution}</span></span>
                  <span className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate || 'Present'}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div>
            <div className="bre-oblique-heading" style={{ color: accentColor, borderColor: accentColor }}>Skills</div>
            <div className="text-xs space-y-0.5 text-slate-700">
              {skills.languages?.length > 0 && <div><strong>Languages:</strong> {skills.languages.join(', ')}</div>}
              {skills.frameworks?.length > 0 && <div><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
              {skills.tools?.length > 0 && <div><strong>Tools:</strong> {skills.tools.join(', ')}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
