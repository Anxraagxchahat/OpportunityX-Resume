import React from 'react';
import './styles.css';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';
import { SocialLinksBlock } from '../reactive/shared/SocialLinksBlock';
import { shouldRenderBlock } from '../../utils/paginationEngine';

export const BRECoolTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], assets = {} } = resumeData || {};

  const bannerBg = accentHex || '#42b883';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="bre-cool-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Top Banner */}
      {isVisible('header') && (
        <div data-block-id="header" className="bre-cool-banner flex items-center justify-between" style={{ backgroundColor: bannerBg }}>
          <div>
            <div className="bre-cool-fullname">{personal.fullName || 'Your Name'}</div>
            <div className="bre-cool-position">{personal.jobTitle || personal.targetRole || 'Job Title'}</div>
          </div>
          <img src={photoSrc} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/40 shadow-md flex-shrink-0" />
        </div>
      )}

      {/* Main Content (Left Sidebar + Right Body) */}
      <div className="bre-cool-content">
        {/* Left Dark Sidebar */}
        <div className="bre-cool-left">
          {personal.summary && isVisible('summary') && (
            <div data-block-id="summary" className="bre-cool-section pdf-block pdf-keep-together">
              <div className="bre-cool-section-headline">About</div>
              <p className="text-[11px] leading-relaxed text-white/80">{personal.summary}</p>
            </div>
          )}

          {isVisible('contact') && (
            <div data-block-id="contact" className="bre-cool-section">
              <div className="bre-cool-section-headline">Contact</div>
              <div className="space-y-1 text-[11px] text-white/80">
                {personal.email && <div>{personal.email}</div>}
                {personal.phone && <div>{personal.phone}</div>}
                {personal.location && <div>{personal.location}</div>}
                {personal.linkedin && <div>{personal.linkedin}</div>}
                {personal.website && <div>{personal.website}</div>}
              </div>
            </div>
          )}

          {skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
            <div data-block-id="skills" className="bre-cool-section">
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
          {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
            <div className="bre-cool-section">
              <div className="bre-cool-section-headline" style={{ borderColor: accentHex }}>Work Experience</div>
              {experience.map((exp, i) => isVisible(`exp-${i}`) && (
                <div key={exp.id || i} data-block-id={`exp-${i}`} className="bre-cool-item pdf-block pdf-item pdf-keep-together break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="bre-cool-header">{exp.role}</span>
                    <span className="bre-cool-date">{exp.startDate} – {exp.endDate || (exp.current ? 'Present' : '')}</span>
                  </div>
                  <div className="bre-cool-subheader">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  {exp.bullets && (
                    <ul className="list-disc pl-4 text-[11px] text-slate-700 mt-1 space-y-0.5">
                      {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                    </ul>
                  )}
                  {exp.description && !exp.bullets && (
                    <p className="text-[11px] text-slate-700 mt-1">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
            <div className="bre-cool-section">
              <div className="bre-cool-section-headline" style={{ borderColor: accentHex }}>Projects</div>
              {projects.map((p, i) => isVisible(`proj-${i}`) && (
                <div key={p.id || i} data-block-id={`proj-${i}`} className="bre-cool-item pdf-block pdf-item pdf-keep-together break-inside-avoid">
                  <div className="bre-cool-header">{p.name || p.title}</div>
                  {p.techStack && <div className="text-[10px] text-slate-500 italic">{p.techStack}</div>}
                  {p.description && <div className="text-[11px] text-slate-700 mt-0.5">{p.description}</div>}
                  {p.bullets && (
                    <ul className="list-disc pl-4 text-[11px] text-slate-700 mt-1 space-y-0.5">
                      {p.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
            <div className="bre-cool-section">
              <div className="bre-cool-section-headline" style={{ borderColor: accentHex }}>Education</div>
              {education.map((edu, i) => isVisible(`edu-${i}`) && (
                <div key={edu.id || i} data-block-id={`edu-${i}`} className="bre-cool-item pdf-block pdf-item pdf-keep-together break-inside-avoid">
                  <div className="flex justify-between items-baseline">
                    <span className="bre-cool-header">{edu.degree}</span>
                    <span className="bre-cool-date">{edu.startDate} – {edu.endDate || 'Present'}</span>
                  </div>
                  <div className="bre-cool-subheader">{edu.institution || edu.school}</div>
                  {edu.gpa && <div className="text-[10px] text-slate-600 font-semibold">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {isVisible('profiles') && (
            <SocialLinksBlock personal={personal} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
          )}
        </div>
      </div>
    </div>
  );
};
