import React from 'react';
import './styles.css';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';

export const BREMaterialDarkTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, assets = {} } = resumeData || {};

  const accentColor = accentHex || '#bb86fc';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  return (
    <div className="bre-material-dark-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Header Card */}
      <div className="bre-material-card flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-white">{personal.fullName || 'Your Name'}</h1>
          <p className="text-xs font-bold mt-0.5" style={{ color: accentColor }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
          <div className="mt-2 text-[11px] text-gray-400 flex flex-wrap gap-x-3 gap-y-0.5">
            {personal.email && <span>{personal.email}</span>}
            {personal.phone && <span>• {personal.phone}</span>}
            {personal.location && <span>• {personal.location}</span>}
            {personal.github && <span>• {personal.github}</span>}
          </div>
        </div>
        <img src={photoSrc} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 shadow-md flex-shrink-0" style={{ borderColor: accentColor }} />
      </div>

      {personal.summary && (
        <div className="bre-material-card">
          <div className="bre-material-heading" style={{ color: accentColor }}>About</div>
          <p className="text-[11px] leading-relaxed text-gray-300">{personal.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="bre-material-card">
          <div className="bre-material-heading" style={{ color: accentColor }}>Work Experience</div>
          {experience.map((exp) => (
            <div key={exp.id} className="mb-3 last:mb-0">
              <div className="flex justify-between items-baseline text-xs font-bold text-white">
                <span>{exp.role} @ <span style={{ color: accentColor }}>{exp.company}</span></span>
                <span className="text-[10px] text-gray-400 font-normal">{exp.startDate} – {exp.endDate || 'Present'}</span>
              </div>
              {exp.bullets && (
                <ul className="list-disc pl-4 text-[11px] text-gray-300 mt-1 space-y-0.5">
                  {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
        <div className="bre-material-card">
          <div className="bre-material-heading" style={{ color: accentColor }}>Technical Skills</div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {[...(skills.languages || []), ...(skills.frameworks || []), ...(skills.tools || []), ...(skills.softSkills || [])].map((s, i) => (
              <span
                key={i}
                className="inline-block pt-0 pb-[3.5px] px-2 text-[9px] font-semibold leading-tight rounded bg-gray-800 text-gray-200 border border-gray-700 whitespace-nowrap box-border max-w-full text-center"
                style={{ breakInside: 'avoid', wordBreak: 'keep-all' }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="bre-material-card">
          <div className="bre-material-heading" style={{ color: accentColor }}>Education</div>
          {education.map((edu) => (
            <div key={edu.id} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline text-xs font-bold text-white">
                <span>{edu.degree} — <span className="font-normal text-gray-300">{edu.institution}</span></span>
                <span className="text-[10px] text-gray-400">{edu.startDate} – {edu.endDate || 'Present'}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
