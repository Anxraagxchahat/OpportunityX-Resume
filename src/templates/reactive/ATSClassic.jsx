import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';

/**
 * ATS Classic (inspired by Ditto)
 * Two-column, minimal and text-dense with no decorative elements.
 * Perfect for traditional industries or ATS-heavy applications.
 */
export const ATSClassicTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Minimal Header */}
      <div className="pb-2 mb-3 border-b border-slate-300">
        <h1 className="text-xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
        <p className="text-xs font-medium text-slate-600 mt-0.5">{personal.jobTitle || 'Job Title'}</p>
        <div className="mt-1.5">
          <ContactInfo personal={personal} variant="inline" />
        </div>
      </div>

      {/* Two Column */}
      <div className="flex gap-5">
        {/* Left Narrow Column */}
        <div className="w-[30%] space-y-3">
          {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
            <div>
              <SectionHeading title="Skills" accentHex={accentHex} variant="minimal" />
              <SkillsBlock skills={skills} variant="inline" />
            </div>
          )}

          {education.length > 0 && (
            <div>
              <SectionHeading title="Education" accentHex={accentHex} variant="minimal" />
              <EducationBlock education={education} variant="compact" />
            </div>
          )}

          {certificates.length > 0 && (
            <div>
              <SectionHeading title="Certifications" accentHex={accentHex} variant="minimal" />
              <CertificatesBlock certificates={certificates} />
            </div>
          )}
        </div>

        {/* Right Main Column */}
        <div className="flex-1 space-y-3">
          {personal.summary && (
            <div>
              <SectionHeading title="Summary" accentHex={accentHex} variant="minimal" />
              <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <SectionHeading title="Experience" accentHex={accentHex} variant="minimal" />
              <ExperienceBlock experience={experience} accentHex={accentHex} variant="compact" />
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <SectionHeading title="Projects" accentHex={accentHex} variant="minimal" />
              <ProjectBlock projects={projects} accentHex={accentHex} variant="compact" />
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <SectionHeading title="Achievements" accentHex={accentHex} variant="minimal" />
              <AchievementsBlock achievements={achievements} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
