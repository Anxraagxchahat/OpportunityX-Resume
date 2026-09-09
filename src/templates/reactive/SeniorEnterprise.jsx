import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';

import { shouldRenderBlock } from '../../utils/paginationEngine';

/**
 * Senior Enterprise (inspired by Lapras)
 * Single-column, polished and serious for senior or enterprise-level positions.
 */
export const SeniorEnterpriseTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Polished Header */}
      {isVisible('header') && (
        <div data-block-id="header" className="text-center pb-4 mb-4 border-b-2 pdf-block pdf-keep-together" style={{ borderColor: accentHex }}>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm font-bold mt-1" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
          <div className="mt-2 flex justify-center">
            <ContactInfo personal={personal} variant="inline" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {personal.summary && isVisible('summary') && (
          <div data-block-id="summary" className="pdf-block pdf-keep-together">
            <SectionHeading title="Executive Summary" accentHex={accentHex} variant="underline" />
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
          <div>
            <SectionHeading title="Professional Experience" accentHex={accentHex} variant="underline" />
            <ExperienceBlock experience={experience} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
          <div>
            <SectionHeading title="Key Projects" accentHex={accentHex} variant="underline" />
            <ProjectBlock projects={projects} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
          <div>
            <SectionHeading title="Education" accentHex={accentHex} variant="underline" />
            <EducationBlock education={education} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && isVisible('skills') && (
          <div data-block-id="skills" className="pdf-block pdf-skills-group pdf-keep-together">
            <SectionHeading title="Core Competencies" accentHex={accentHex} variant="underline" />
            <SkillsBlock skills={skills} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {certificates.length > 0 && certificates.some((_, i) => isVisible(`cert-${i}`)) && (
          <div>
            <SectionHeading title="Certifications" accentHex={accentHex} variant="underline" />
            <CertificatesBlock certificates={certificates} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {achievements.length > 0 && achievements.some((_, i) => isVisible(`achieve-${i}`)) && (
          <div>
            <SectionHeading title="Achievements" accentHex={accentHex} variant="underline" />
            <AchievementsBlock achievements={achievements} visibleBlockIds={visibleBlockIds} />
          </div>
        )}
      </div>
    </div>
  );
};
