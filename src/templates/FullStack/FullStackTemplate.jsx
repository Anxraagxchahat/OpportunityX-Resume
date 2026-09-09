import React from 'react';
import { SocialLinksBlock } from '../reactive/shared/SocialLinksBlock';
import { shouldRenderBlock } from '../../utils/paginationEngine';

export const FullStackTemplate = ({ resumeData, accentHex = '#0ea5e9', fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], projects = [], skills = {}, education = [] } = resumeData || {};

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="space-y-4 text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {isVisible('header') && (
        <div data-block-id="header" className="pb-3 border-b-2" style={{ borderColor: accentHex }}>
          <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Full Stack Engineer'}</h1>
          <p className="text-xs font-mono font-bold" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Full Stack Developer'}</p>
          <p className="text-[11px] text-slate-500 font-mono mt-1">
            {[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(' | ')}
          </p>
        </div>
      )}

      {personal.summary && isVisible('summary') && (
        <div data-block-id="summary" className="space-y-1">
          <p className="text-xs text-slate-700 leading-relaxed">{personal.summary}</p>
        </div>
      )}

      {skills && isVisible('skills') && (
        <div data-block-id="skills" className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
          <h2 className="font-bold text-slate-900 uppercase text-[11px]">Stack Profile</h2>
          {skills.languages?.length > 0 && <div><strong className="text-slate-900">Frontend / Backend Languages:</strong> {skills.languages.join(', ')}</div>}
          {skills.frameworks?.length > 0 && <div><strong className="text-slate-900">Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
          {skills.tools?.length > 0 && <div><strong className="text-slate-900">Tools:</strong> {skills.tools.join(', ')}</div>}
        </div>
      )}

      {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
        <div className="space-y-3 text-xs">
          <h2 className="font-bold uppercase text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>Engineering Experience</h2>
          {experience.map((exp, i) => isVisible(`exp-${i}`) && (
            <div key={exp.id || i} data-block-id={`exp-${i}`} className="space-y-1 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.role} @ {exp.company}</span>
                <span className="font-normal text-slate-500">{exp.startDate ? `${exp.startDate} – ` : ''}{exp.endDate || (exp.current || exp.isCurrent ? 'Present' : '')}</span>
              </div>
              {exp.bullets && (
                <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                  {exp.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
        <div className="space-y-2.5 text-xs">
          <h2 className="font-bold uppercase text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>Technical Projects</h2>
          {projects.map((p, i) => isVisible(`proj-${i}`) && (
            <div key={p.id || i} data-block-id={`proj-${i}`} className="space-y-1 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between font-bold text-slate-900">
                <span>
                  {p.name || p.title}
                  {p.techStack && <span className="text-slate-500 font-normal ml-1">({p.techStack})</span>}
                </span>
                {(p.link || p.url) && <span className="font-mono text-slate-500 text-[10px]">{p.link || p.url}</span>}
              </div>
              {p.description && <p className="text-slate-700 leading-relaxed">{p.description}</p>}
              {p.bullets && (
                <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                  {p.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
        <div className="space-y-2 text-xs">
          <h2 className="font-bold uppercase text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>Education</h2>
          {education.map((edu, i) => isVisible(`edu-${i}`) && (
            <div key={edu.id || edu.degree || i} data-block-id={`edu-${i}`} className="space-y-0.5 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{edu.degree} — <span className="font-normal text-slate-600">{edu.institution || edu.college}</span></span>
                <span className="font-normal text-slate-500">{edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}</span>
              </div>
              {edu.gpa && <div className="text-[11px] text-slate-600 font-medium">GPA: {edu.gpa}</div>}
              {edu.relevantCoursework && (
                <div className="text-[11px] text-slate-700 font-medium">
                  <strong className="text-slate-900">Relevant Coursework: </strong>{edu.relevantCoursework}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Social & Portfolio Links */}
      {isVisible('profiles') && (
        <SocialLinksBlock personal={personal} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
      )}
    </div>
  );
};
