import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock, LanguagesBlock } from './shared/MiscBlocks';

/**
 * Business Analyst (inspired by Gengar)
 * Two-column with accent colors and clean typography.
 * Balanced choice for business analysts or operations roles.
 */
export const BusinessAnalystTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [] } = resumeData || {};

  return (
    <div className="flex min-h-full" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Left Sidebar — light tinted */}
      <div className="w-[33%] p-5 space-y-4" style={{ backgroundColor: `${accentHex}08`, borderRight: `2px solid ${accentHex}20` }}>
        <div>
          <SectionHeading title="Contact" accentHex={accentHex} variant="bold-rule" />
          <ContactInfo personal={personal} variant="stacked" />
        </div>

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div>
            <SectionHeading title="Skills" accentHex={accentHex} variant="bold-rule" />
            <SkillsBlock skills={skills} variant="tags" />
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SectionHeading title="Education" accentHex={accentHex} variant="bold-rule" />
            <EducationBlock education={education} variant="compact" />
          </div>
        )}

        {certificates.length > 0 && (
          <div>
            <SectionHeading title="Certifications" accentHex={accentHex} variant="bold-rule" />
            <CertificatesBlock certificates={certificates} />
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <SectionHeading title="Languages" accentHex={accentHex} variant="bold-rule" />
            <LanguagesBlock languages={languages} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 space-y-4 text-slate-800">
        <div className="pb-3 border-b" style={{ borderColor: `${accentHex}30` }}>
          <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm font-bold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
        </div>

        {personal.summary && (
          <div>
            <SectionHeading title="Summary" accentHex={accentHex} variant="underline" />
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SectionHeading title="Experience" accentHex={accentHex} variant="underline" />
            <ExperienceBlock experience={experience} accentHex={accentHex} />
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <SectionHeading title="Projects" accentHex={accentHex} variant="underline" />
            <ProjectBlock projects={projects} accentHex={accentHex} />
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
  );
};
