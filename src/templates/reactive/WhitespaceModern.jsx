import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';

/**
 * Whitespace Modern (inspired by Rhyhorn)
 * Single-column with a minimal top header and lots of whitespace.
 * Clean and modern for designers or content creators.
 */
export const WhitespaceModernTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Airy Header */}
      <div className="pb-5 mb-5">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">{personal.fullName || 'Your Name'}</h1>
        <p className="text-base font-medium text-slate-500 mt-1">{personal.jobTitle || 'Job Title'}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.website && <span>{personal.website}</span>}
        </div>
        <div className="h-px mt-4 bg-slate-200" />
      </div>

      <div className="space-y-5">
        {personal.summary && (
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Summary</h2>
            <p className="text-xs leading-relaxed text-slate-600">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Experience</h2>
            {experience.map((exp) => (
              <div key={exp.id} className="mb-4 last:mb-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="text-xs font-bold text-slate-900">{exp.role}</h3>
                  <span className="text-[10px] text-slate-400">{exp.startDate} – {exp.endDate || 'Present'}</span>
                </div>
                <p className="text-[10px] text-slate-500 font-medium">{exp.company}{exp.location ? `, ${exp.location}` : ''}</p>
                {exp.bullets && (
                  <ul className="mt-1.5 space-y-1 text-[10px] text-slate-600">
                    {exp.bullets.map((b, i) => <li key={i} className="pl-3 relative before:content-['–'] before:absolute before:left-0 before:text-slate-400">{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Projects</h2>
            {projects.map((p) => (
              <div key={p.id} className="mb-3 last:mb-0">
                <h3 className="text-xs font-bold text-slate-900">{p.name}</h3>
                {p.techStack && <p className="text-[10px] text-slate-400 italic">{p.techStack}</p>}
                {p.description && <p className="text-[10px] text-slate-600 mt-0.5">{p.description}</p>}
              </div>
            ))}
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Education</h2>
            <EducationBlock education={education} />
          </div>
        )}

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Skills</h2>
            <SkillsBlock skills={skills} variant="inline" />
          </div>
        )}

        {certificates.length > 0 && (
          <div>
            <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Certifications</h2>
            <CertificatesBlock certificates={certificates} />
          </div>
        )}
      </div>
    </div>
  );
};
