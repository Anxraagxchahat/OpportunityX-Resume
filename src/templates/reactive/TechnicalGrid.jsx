import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';

/**
 * Technical Grid (inspired by Onyx)
 * Single-column with a clean grid layout.
 * Versatile for any professional or technical role.
 */
export const TechnicalGridTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Header */}
      <div className="pb-3 mb-4">
        <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
        <p className="text-sm font-bold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || 'Job Title'}</p>
        <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] text-slate-600">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>{personal.phone}</span>}
          {personal.location && <span>{personal.location}</span>}
          {personal.linkedin && <span>{personal.linkedin}</span>}
          {personal.website && <span>{personal.website}</span>}
          {personal.github && <span>{personal.github}</span>}
        </div>
        <div className="h-[2px] mt-2 rounded-full" style={{ backgroundColor: accentHex }} />
      </div>

      {/* Grid Layout Sections */}
      <div className="space-y-4">
        {personal.summary && (
          <div>
            <SectionHeading title="Summary" accentHex={accentHex} variant="bold-rule" />
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SectionHeading title="Experience" accentHex={accentHex} variant="bold-rule" />
            <ExperienceBlock experience={experience} accentHex={accentHex} />
          </div>
        )}

        {/* Two-column grid for Education + Skills */}
        <div className="grid grid-cols-2 gap-5">
          {education.length > 0 && (
            <div>
              <SectionHeading title="Education" accentHex={accentHex} variant="bold-rule" />
              <EducationBlock education={education} variant="compact" />
            </div>
          )}

          {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
            <div>
              <SectionHeading title="Technical Skills" accentHex={accentHex} variant="bold-rule" />
              <SkillsBlock skills={skills} variant="tags" />
            </div>
          )}
        </div>

        {projects.length > 0 && (
          <div>
            <SectionHeading title="Projects" accentHex={accentHex} variant="bold-rule" />
            <ProjectBlock projects={projects} accentHex={accentHex} />
          </div>
        )}

        {/* Two-column grid for Certs + Achievements */}
        <div className="grid grid-cols-2 gap-5">
          {certificates.length > 0 && (
            <div>
              <SectionHeading title="Certifications" accentHex={accentHex} variant="bold-rule" />
              <CertificatesBlock certificates={certificates} />
            </div>
          )}

          {achievements.length > 0 && (
            <div>
              <SectionHeading title="Achievements" accentHex={accentHex} variant="bold-rule" />
              <AchievementsBlock achievements={achievements} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
