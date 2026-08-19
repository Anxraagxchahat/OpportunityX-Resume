import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';
import { SocialLinksBlock } from './shared/SocialLinksBlock';

/**
 * Asia Compact (inspired by Meowth)
 * Single-column with inline three-column entry header (position · organization · period).
 * Compact and ATS-friendly, well-suited for Asian resume conventions.
 */
export const AsiaCompactTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Compact Header */}
      <div className="pb-2 mb-3">
        <h1 className="text-xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
        {(personal.jobTitle || personal.targetRole) && (
          <p className="text-xs font-semibold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole}</p>
        )}
        <div className="mt-1">
          <ContactInfo personal={personal} variant="columns" />
        </div>
        <div className="h-px mt-2 bg-slate-300" />
      </div>

      <div className="space-y-3">
        {personal.summary && (
          <div>
            <SectionHeading title="Summary" accentHex={accentHex} variant="minimal" />
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SectionHeading title="Experience" accentHex={accentHex} variant="minimal" />
            <ExperienceBlock experience={experience} accentHex={accentHex} variant="inline-header" />
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SectionHeading title="Education" accentHex={accentHex} variant="minimal" />
            <EducationBlock education={education} variant="inline" />
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <SectionHeading title="Projects" accentHex={accentHex} variant="minimal" />
            <ProjectBlock projects={projects} accentHex={accentHex} variant="compact" />
          </div>
        )}

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div>
            <SectionHeading title="Skills" accentHex={accentHex} variant="minimal" />
            <SkillsBlock skills={skills} variant="inline" />
          </div>
        )}

        {certificates.length > 0 && (
          <div>
            <SectionHeading title="Certifications" accentHex={accentHex} variant="minimal" />
            <CertificatesBlock certificates={certificates} />
          </div>
        )}

        {achievements.length > 0 && (
          <div>
            <SectionHeading title="Achievements" accentHex={accentHex} variant="minimal" />
            <AchievementsBlock achievements={achievements} />
          </div>
        )}

        <SocialLinksBlock personal={personal} accentHex={accentHex} variant="compact" />
      </div>
    </div>
  );
};
