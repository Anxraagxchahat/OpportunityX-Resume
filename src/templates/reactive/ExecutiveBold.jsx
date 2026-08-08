import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';

/**
 * Executive Bold (inspired by Scizor)
 * Single-column with uppercase section headings and a primary-color top rule on every page.
 * Polished for executive, consulting, or startup resumes.
 */
export const ExecutiveBoldTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Bold Top Rule */}
      <div className="h-[4px] rounded-full mb-4" style={{ backgroundColor: accentHex }} />

      {/* Header */}
      <div className="pb-4 mb-4 border-b border-slate-200">
        <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wide">{personal.fullName || 'Your Name'}</h1>
        <p className="text-sm font-extrabold uppercase tracking-wider mt-1" style={{ color: accentHex }}>{personal.jobTitle || 'Job Title'}</p>
        <div className="mt-2">
          <ContactInfo personal={personal} variant="inline" />
        </div>
      </div>

      <div className="space-y-4">
        {personal.summary && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Executive Summary
            </h2>
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Professional Experience
            </h2>
            <ExperienceBlock experience={experience} accentHex={accentHex} />
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Key Projects
            </h2>
            <ProjectBlock projects={projects} accentHex={accentHex} />
          </div>
        )}

        {education.length > 0 && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Education
            </h2>
            <EducationBlock education={education} />
          </div>
        )}

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Core Competencies
            </h2>
            <SkillsBlock skills={skills} />
          </div>
        )}

        {certificates.length > 0 && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Certifications
            </h2>
            <CertificatesBlock certificates={certificates} />
          </div>
        )}

        {achievements.length > 0 && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Achievements
            </h2>
            <AchievementsBlock achievements={achievements} />
          </div>
        )}
      </div>
    </div>
  );
};
