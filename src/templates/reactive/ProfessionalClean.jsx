import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';

/**
 * Professional Clean (inspired by Bronzor)
 * Two-column, clean and professional with subtle section dividers.
 * Suits corporate, finance, or consulting positions.
 */
export const ProfessionalCleanTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  return (
    <div className="space-y-4 text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Header */}
      <div className="pb-3 border-b-2" style={{ borderColor: accentHex }}>
        <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
        <p className="text-sm font-bold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
        <div className="mt-2">
          <ContactInfo personal={personal} variant="inline" />
        </div>
      </div>

      {/* Two Column Body */}
      <div className="flex gap-6">
        {/* Main Column */}
        <div className="flex-1 space-y-4">
          {personal.summary && (
            <div>
              <SectionHeading title="Professional Summary" accentHex={accentHex} variant="underline" />
              <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <SectionHeading title="Work Experience" accentHex={accentHex} variant="underline" />
              <ExperienceBlock experience={experience} accentHex={accentHex} />
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <SectionHeading title="Projects" accentHex={accentHex} variant="underline" />
              <ProjectBlock projects={projects} accentHex={accentHex} />
            </div>
          )}
        </div>

        {/* Right Column */}
        <div className="w-[34%] space-y-4">
          {education.length > 0 && (
            <div>
              <SectionHeading title="Education" accentHex={accentHex} variant="underline" />
              <EducationBlock education={education} variant="compact" />
            </div>
          )}

          {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
            <div>
              <SectionHeading title="Skills" accentHex={accentHex} variant="underline" />
              <SkillsBlock skills={skills} variant="tags" />
            </div>
          )}

          {certificates.length > 0 && (
            <div>
              <SectionHeading title="Certifications" accentHex={accentHex} variant="underline" />
              <CertificatesBlock certificates={certificates} />
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <SectionHeading title="Achievements" accentHex={accentHex} variant="underline" />
              <AchievementsBlock achievements={achievements} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
