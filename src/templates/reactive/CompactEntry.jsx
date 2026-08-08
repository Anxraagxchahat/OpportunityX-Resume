import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';

/**
 * Compact Entry (inspired by Kakuna)
 * Single-column with a magenta/accent left border accent.
 * Compact and efficient for entry-level or internship applications.
 */
export const CompactEntryTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Header with left border accent */}
      <div className="pl-4 border-l-4 mb-4" style={{ borderColor: accentHex }}>
        <h1 className="text-xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
        <p className="text-xs font-bold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || 'Job Title'}</p>
        <div className="mt-1.5">
          <ContactInfo personal={personal} variant="inline" />
        </div>
      </div>

      <div className="space-y-3">
        {personal.summary && (
          <div className="pl-4 border-l-2 border-slate-200">
            <SectionHeading title="Summary" accentHex={accentHex} variant="minimal" />
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div className="pl-4 border-l-2 border-slate-200">
            <SectionHeading title="Experience" accentHex={accentHex} variant="minimal" />
            <ExperienceBlock experience={experience} accentHex={accentHex} variant="compact" />
          </div>
        )}

        {education.length > 0 && (
          <div className="pl-4 border-l-2 border-slate-200">
            <SectionHeading title="Education" accentHex={accentHex} variant="minimal" />
            <EducationBlock education={education} variant="compact" />
          </div>
        )}

        {projects.length > 0 && (
          <div className="pl-4 border-l-2 border-slate-200">
            <SectionHeading title="Projects" accentHex={accentHex} variant="minimal" />
            <ProjectBlock projects={projects} accentHex={accentHex} variant="compact" />
          </div>
        )}

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div className="pl-4 border-l-2 border-slate-200">
            <SectionHeading title="Skills" accentHex={accentHex} variant="minimal" />
            <SkillsBlock skills={skills} variant="tags" />
          </div>
        )}

        {certificates.length > 0 && (
          <div className="pl-4 border-l-2 border-slate-200">
            <SectionHeading title="Certifications" accentHex={accentHex} variant="minimal" />
            <CertificatesBlock certificates={certificates} />
          </div>
        )}
      </div>
    </div>
  );
};
