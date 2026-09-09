import React from 'react';
import './styles.css';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';
import { SocialLinksBlock } from '../reactive/shared/SocialLinksBlock';
import { shouldRenderBlock } from '../../utils/paginationEngine';

export const BRECreativeTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, assets = {} } = resumeData || {};

  const leftBg = accentHex || '#2c3e50';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  const hasVisibleLeftContent =
    isVisible('header') ||
    (personal.summary && isVisible('summary')) ||
    isVisible('contact') ||
    (skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0));

  return (
    <div className="bre-creative-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Left Column */}
      <div className="bre-creative-left" style={{ backgroundColor: leftBg }}>
        {isVisible('header') && (
          <div data-block-id="header">
            <div className="flex justify-center mb-3">
              <img src={photoSrc} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2 border-white/30 shadow-md" />
            </div>
            <div className="bre-creative-name">{personal.fullName || 'Your Name'}</div>
            <div className="bre-creative-title">{personal.jobTitle || personal.targetRole || 'Job Title'}</div>
          </div>
        )}

        {personal.summary && isVisible('summary') && (
          <div data-block-id="summary">
            <div className="bre-creative-heading-left">Profile</div>
            <p className="text-[11px] leading-relaxed text-white/80">{personal.summary}</p>
          </div>
        )}

        {isVisible('contact') && (
          <div data-block-id="contact">
            <div className="bre-creative-heading-left">Contact</div>
            <div className="space-y-1 text-[11px] text-white/80">
              {personal.email && <div>{personal.email}</div>}
              {personal.phone && <div>{personal.phone}</div>}
              {personal.location && <div>{personal.location}</div>}
              {personal.linkedin && <div>{personal.linkedin}</div>}
            </div>
          </div>
        )}

        {skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div data-block-id="skills">
            <div className="bre-creative-heading-left">Skills</div>
            <div className="flex flex-wrap gap-1">
              {[...(skills.languages || []), ...(skills.frameworks || []), ...(skills.tools || [])].map((s, i) => (
                <span key={i} className="bre-creative-tag">{s}</span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Column */}
      <div className="bre-creative-right">
        {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
          <div className="mb-4">
            <div className="bre-creative-heading-right" style={{ borderColor: accentHex }}>Experience</div>
            {experience.map((exp, i) => isVisible(`exp-${i}`) && (
              <div key={exp.id || i} data-block-id={`exp-${i}`} className="mb-3 pdf-block pdf-item pdf-keep-together break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold text-slate-900 text-xs">
                  <span>{exp.role}</span>
                  <span className="text-[10px] text-slate-500">{exp.startDate} – {exp.endDate || (exp.current ? 'Present' : '')}</span>
                </div>
                <div className="text-xs font-semibold text-slate-600 mb-1">{exp.company}</div>
                {exp.bullets && (
                  <ul className="list-disc pl-4 text-[11px] text-slate-700 space-y-0.5">
                    {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                  </ul>
                )}
                {exp.description && !exp.bullets && (
                  <p className="text-[11px] text-slate-700 leading-relaxed">{exp.description}</p>
                )}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
          <div className="mb-4">
            <div className="bre-creative-heading-right" style={{ borderColor: accentHex }}>Projects</div>
            {projects.map((p, i) => isVisible(`proj-${i}`) && (
              <div key={p.id || i} data-block-id={`proj-${i}`} className="mb-2.5 pdf-block pdf-item pdf-keep-together break-inside-avoid">
                <div className="font-bold text-xs text-slate-900">{p.name || p.title}</div>
                {p.techStack && <div className="text-[10px] text-slate-500 italic">{p.techStack}</div>}
                {p.description && <div className="text-[11px] text-slate-700 mt-0.5">{p.description}</div>}
                {p.bullets && (
                  <ul className="list-disc pl-4 text-[11px] text-slate-700 space-y-0.5 mt-0.5">
                    {p.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
          <div className="mb-4">
            <div className="bre-creative-heading-right" style={{ borderColor: accentHex }}>Education</div>
            {education.map((edu, i) => isVisible(`edu-${i}`) && (
              <div key={edu.id || i} data-block-id={`edu-${i}`} className="mb-2 pdf-block pdf-item pdf-keep-together break-inside-avoid">
                <div className="flex justify-between items-baseline font-bold text-xs text-slate-900">
                  <span>{edu.degree}</span>
                  <span className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate || 'Present'}</span>
                </div>
                <div className="text-xs text-slate-600">{edu.institution || edu.school}</div>
                {edu.gpa && <div className="text-[10px] text-slate-600 font-semibold">GPA: {edu.gpa}</div>}
                {edu.relevantCoursework && (
                  <div className="text-[10px] text-slate-700 font-medium mt-0.5">
                    <strong>Relevant Coursework: </strong>{edu.relevantCoursework}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {isVisible('profiles') && (
          <SocialLinksBlock personal={personal} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
        )}
      </div>
    </div>
  );
};
