import React from 'react';
import './styles.css';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';
import { SocialLinksBlock } from '../reactive/shared/SocialLinksBlock';
import { shouldRenderBlock } from '../../utils/paginationEngine';

export const BRELeftRightTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, assets = {} } = resumeData || {};

  const accentColor = accentHex || '#2563eb';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="bre-left-right-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Left 50% Column */}
      <div className="bre-left-right-col">
        {isVisible('header') && (
          <div data-block-id="header" className="pb-3 border-b-2 flex items-center justify-between gap-3" style={{ borderColor: accentColor }}>
            <div>
              <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
              <p className="text-xs font-bold mt-0.5" style={{ color: accentColor }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
            </div>
            <img src={photoSrc} alt="Profile" className="w-14 h-14 rounded-full object-cover border-2 shadow-sm flex-shrink-0" style={{ borderColor: accentColor }} />
          </div>
        )}

        {personal.summary && isVisible('summary') && (
          <div data-block-id="summary" className="pdf-block pdf-keep-together">
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>About Me</div>
            <p className="text-[11px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {isVisible('contact') && (
          <div data-block-id="contact">
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>Contact</div>
            <div className="space-y-1 text-[11px] text-slate-600">
              {personal.email && <div>Email: {personal.email}</div>}
              {personal.phone && <div>Phone: {personal.phone}</div>}
              {personal.location && <div>Location: {personal.location}</div>}
              {personal.linkedin && <div>LinkedIn: {personal.linkedin}</div>}
              {personal.website && <div>Website: {personal.website}</div>}
            </div>
          </div>
        )}

        {skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div data-block-id="skills" className="pdf-block pdf-keep-together">
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>Skills & Expertise</div>
            <div className="text-xs space-y-1 text-slate-700">
              {skills.languages?.length > 0 && <div><strong>Languages:</strong> {skills.languages.join(', ')}</div>}
              {skills.frameworks?.length > 0 && <div><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
              {skills.tools?.length > 0 && <div><strong>Tools:</strong> {skills.tools.join(', ')}</div>}
            </div>
          </div>
        )}

        {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
          <div>
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>Education</div>
            {education.map((edu, i) => isVisible(`edu-${i}`) && (
              <div key={edu.id || i} data-block-id={`edu-${i}`} className="mb-2 text-xs pdf-block pdf-item pdf-keep-together break-inside-avoid">
                <div className="font-bold text-slate-900">{edu.degree}</div>
                <div className="text-slate-600">{edu.institution}</div>
                <div className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate || 'Present'}</div>
              </div>
            ))}
          </div>
        )}

        {isVisible('profiles') && (
          <SocialLinksBlock personal={personal} accentHex={accentColor} visibleBlockIds={visibleBlockIds} />
        )}
      </div>

      {/* Right 50% Column */}
      <div className="bre-left-right-col">
        {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
          <div>
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>Experience</div>
            {experience.map((exp, i) => isVisible(`exp-${i}`) && (
              <div key={exp.id || i} data-block-id={`exp-${i}`} className="mb-3 pdf-block pdf-item pdf-keep-together break-inside-avoid">
                <div className="font-bold text-xs text-slate-900">{exp.role}</div>
                <div className="text-xs font-semibold text-slate-600 mb-1">{exp.company} ({exp.startDate} – {exp.endDate || (exp.current ? 'Present' : '')})</div>
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
          <div>
            <div className="bre-left-right-heading" style={{ color: accentColor, borderColor: accentColor }}>Projects</div>
            {projects.map((p, i) => isVisible(`proj-${i}`) && (
              <div key={p.id || i} data-block-id={`proj-${i}`} className="mb-2.5 pdf-block pdf-item pdf-keep-together break-inside-avoid">
                <div className="font-bold text-xs text-slate-900">{p.name || p.title}</div>
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
      </div>
    </div>
  );
};
