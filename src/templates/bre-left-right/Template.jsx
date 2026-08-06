import React from 'react';
import './styles.css';

export const BRELeftRightTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {} } = resumeData || {};

  const accentColor = accentHex || '#2563eb';

  return (
    <div className="bre-left-right-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Left 50% Column */}
      <div className="bre-left-right-col">
        <div className="pb-3 border-b-2" style={{ borderColor: accentColor }}>
          <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
          <p className="text-xs font-bold mt-0.5" style={{ color: accentColor }}>{personal.jobTitle || 'Job Title'}</p>
        </div>

        {personal.summary && (
          <div>
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>About Me</div>
            <p className="text-[11px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        <div>
          <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>Contact</div>
          <div className="space-y-1 text-[11px] text-slate-600">
            {personal.email && <div>Email: {personal.email}</div>}
            {personal.phone && <div>Phone: {personal.phone}</div>}
            {personal.location && <div>Location: {personal.location}</div>}
            {personal.linkedin && <div>LinkedIn: {personal.linkedin}</div>}
            {personal.website && <div>Website: {personal.website}</div>}
          </div>
        </div>

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div>
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>Skills & Expertise</div>
            <div className="text-xs space-y-1 text-slate-700">
              {skills.languages?.length > 0 && <div><strong>Languages:</strong> {skills.languages.join(', ')}</div>}
              {skills.frameworks?.length > 0 && <div><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
              {skills.tools?.length > 0 && <div><strong>Tools:</strong> {skills.tools.join(', ')}</div>}
            </div>
          </div>
        )}

        {education.length > 0 && (
          <div>
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>Education</div>
            {education.map((edu) => (
              <div key={edu.id} className="mb-2 text-xs">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution}</div>
                <div className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate || 'Present'}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right 50% Column */}
      <div className="bre-left-right-col">
        {experience.length > 0 && (
          <div>
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>Experience</div>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-3">
                <div className="font-bold text-xs text-slate-900">{exp.role}</div>
                <div className="text-xs text-slate-600 font-medium">{exp.company} ({exp.startDate} – {exp.endDate || 'Present'})</div>
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
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>Projects</div>
            {projects.map((p) => (
              <div key={p.id} className="mb-2.5">
                <div className="font-bold text-xs text-slate-900">{p.name}</div>
                {p.techStack && <div className="text-[10px] text-slate-500 italic">{p.techStack}</div>}
                {p.description && <div className="text-[11px] text-slate-700 mt-0.5">{p.description}</div>}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
