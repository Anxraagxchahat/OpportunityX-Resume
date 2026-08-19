import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';

/**
 * Senior Enterprise (inspired by Lapras)
 * Single-column, polished and serious for senior or enterprise-level positions.
 */
export const SeniorEnterpriseTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Polished Header */}
      <div className="text-center pb-4 mb-4 border-b-2" style={{ borderColor: accentHex }}>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{personal.fullName || 'Your Name'}</h1>
        <p className="text-sm font-bold mt-1" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
        <div className="mt-2 flex justify-center">
          <ContactInfo personal={personal} variant="inline" />
        </div>
      </div>

      <div className="space-y-4">
        {personal.summary && (
          <div>
            <SectionHeading title="Executive Summary" accentHex={accentHex} variant="underline" />
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SectionHeading title="Professional Experience" accentHex={accentHex} variant="underline" />
            <ExperienceBlock experience={experience} accentHex={accentHex} />
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <SectionHeading title="Key Projects" accentHex={accentHex} variant="underline" />
            <ProjectBlock projects={projects} accentHex={accentHex} />
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SectionHeading title="Education" accentHex={accentHex} variant="underline" />
            <EducationBlock education={education} />
          </div>
        )}

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div>
            <SectionHeading title="Core Competencies" accentHex={accentHex} variant="underline" />
            <SkillsBlock skills={skills} />
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
  );
};
