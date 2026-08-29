import React from 'react';
import './styles.css';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';

export const BRESidebarTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, assets = {} } = resumeData || {};

  const headerBg = accentHex || '#0f172a';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  return (
    <div className="bre-sidebar-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Top Title Bar */}
      <div className="bre-sidebar-top" style={{ backgroundColor: headerBg }}>
        <div className="bre-sidebar-name">{personal.fullName || 'Your Name'}</div>
        <div className="bre-sidebar-title">{personal.jobTitle || personal.targetRole || 'Job Title'}</div>
      </div>

      {/* Body with Left Photo Column & Right Main Body */}
      <div className="bre-sidebar-body">
        {/* Left Column */}
        <div className="bre-sidebar-left">
          <div className="flex justify-center mb-4">
            <img src={photoSrc} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 shadow-sm" style={{ borderColor: accentHex }} />
          </div>

          <div className="mb-4">
            <div className="bre-sidebar-heading" style={{ borderColor: accentHex }}>Contact</div>
            <div className="space-y-1 text-[11px] text-slate-600">
              {personal.email && <div className="break-all">{personal.email}</div>}
              {personal.phone && <div>{personal.phone}</div>}
              {personal.location && <div>{personal.location}</div>}
              {personal.linkedin && <div className="break-all">{personal.linkedin}</div>}
              {personal.website && <div className="break-all">{personal.website}</div>}
            </div>
          </div>

          {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
            <div className="mb-4">
              <div className="bre-sidebar-heading" style={{ borderColor: accentHex }}>Skills</div>
              <div className="flex flex-wrap gap-1.5 items-center">
                {[...(skills.languages || []), ...(skills.frameworks || []), ...(skills.tools || []), ...(skills.softSkills || [])].map((s, i) => (
                  <span
                    key={i}
                    className="inline-block h-[18px] leading-[18px] px-2 text-[9px] font-medium rounded bg-slate-200 text-slate-800 whitespace-nowrap box-border max-w-full text-center align-middle"
                    style={{ breakInside: 'avoid', wordBreak: 'keep-all' }}
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {education.length > 0 && (
            <div>
              <div className="bre-sidebar-heading" style={{ borderColor: accentHex }}>Education</div>
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

        {/* Right Main Content */}
        <div className="bre-sidebar-right">
          {personal.summary && (
            <div className="mb-4">
              <div className="bre-sidebar-heading" style={{ borderColor: accentHex }}>Professional Summary</div>
              <p className="text-[11px] leading-relaxed text-slate-700">{personal.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mb-4">
              <div className="bre-sidebar-heading" style={{ borderColor: accentHex }}>Work Experience</div>
              {experience.map((exp) => (
                <div key={exp.id} className="mb-3">
                  <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                    <span>{exp.company} — <span className="font-medium text-slate-600">{exp.role}</span></span>
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
              <div className="bre-sidebar-heading" style={{ borderColor: accentHex }}>Projects</div>
              {projects.map((p) => (
                <div key={p.id} className="mb-2.5">
                  <div className="text-xs font-bold text-slate-900">{p.name} {p.techStack && <span className="text-slate-500 font-normal">({p.techStack})</span>}</div>
                  {p.description && <p className="text-[11px] text-slate-700 mt-0.5">{p.description}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
