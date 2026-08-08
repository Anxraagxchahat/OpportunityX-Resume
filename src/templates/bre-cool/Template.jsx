import React from 'react';
import './styles.css';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';

export const BRECoolTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], assets = {} } = resumeData || {};

  const bannerBg = accentHex || '#42b883';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  return (
    <div className="bre-cool-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Top Banner */}
      <div className="bre-cool-banner flex items-center justify-between" style={{ backgroundColor: bannerBg }}>
        <div>
          <div className="bre-cool-fullname">{personal.fullName || 'Your Name'}</div>
          <div className="bre-cool-position">{personal.jobTitle || 'Job Title'}</div>
        </div>
        <img src={photoSrc} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-md flex-shrink-0" />
      </div>

      {/* Main Content (Left Sidebar + Right Body) */}
      <div className="bre-cool-content">
        {/* Left Dark Sidebar */}
        <div className="bre-cool-left">
          {personal.summary && (
            <div className="bre-cool-section">
              <div className="bre-cool-section-headline">About</div>
              <p className="text-[11px] leading-relaxed text-white/80">{personal.summary}</p>
            </div>
          )}

          <div className="bre-cool-section">
            <div className="bre-cool-section-headline">Contact</div>
            <div className="space-y-1 text-[11px] text-white/80">
              {personal.email && <div>{personal.email}</div>}
              {personal.phone && <div>{personal.phone}</div>}
              {personal.location && <div>{personal.location}</div>}
              {personal.linkedin && <div>{personal.linkedin}</div>}
              {personal.website && <div>{personal.website}</div>}
            </div>
          </div>

          {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
            <div className="bre-cool-section">
              <div className="bre-cool-section-headline">Skills</div>
              <div className="flex flex-wrap gap-1">
                {[...(skills.languages || []), ...(skills.frameworks || []), ...(skills.tools || [])].map((s, i) => (
                  <span key={i} className="bre-cool-tag">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Content */}
        <div className="bre-cool-right">
          {experience.length > 0 && (
            <div className="bre-cool-section">
              <div className="bre-cool-section-headline" style={{ borderColor: accentHex }}>Work Experience</div>
              {experience.map((exp) => (
                <div key={exp.id} className="bre-cool-item">
                  <div className="flex justify-between items-baseline">
                    <span className="bre-cool-header">{exp.role}</span>
                    <span className="bre-cool-date">{exp.startDate} – {exp.endDate || 'Present'}</span>
                  </div>
                  <div className="bre-cool-subheader">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
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
            <div className="bre-cool-section">
              <div className="bre-cool-section-headline" style={{ borderColor: accentHex }}>Projects</div>
              {projects.map((p) => (
                <div key={p.id} className="bre-cool-item">
                  <div className="bre-cool-header">{p.name}</div>
                  {p.techStack && <div className="text-[10px] text-slate-500 italic">{p.techStack}</div>}
                  {p.description && <div className="text-[11px] text-slate-700 mt-0.5">{p.description}</div>}
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
            <div className="bre-cool-section">
              <div className="bre-cool-section-headline" style={{ borderColor: accentHex }}>Education</div>
              {education.map((edu) => (
                <div key={edu.id} className="bre-cool-item">
                  <div className="flex justify-between items-baseline">
                    <span className="bre-cool-header">{edu.degree}</span>
                    <span className="bre-cool-date">{edu.startDate} – {edu.endDate || 'Present'}</span>
                  </div>
                  <div className="bre-cool-subheader">{edu.institution}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
