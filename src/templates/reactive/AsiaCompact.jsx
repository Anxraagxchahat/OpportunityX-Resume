import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';
import { SocialLinksBlock } from './shared/SocialLinksBlock';
import { shouldRenderBlock } from '../../utils/paginationEngine';

/**
 * Asia Compact (inspired by Meowth)
 * Single-column with inline three-column entry header (position · organization · period).
 * Compact and ATS-friendly, well-suited for Asian resume conventions.
 */
export const AsiaCompactTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Compact Header */}
      {isVisible('header') && (
        <div data-block-id="header" className="pb-2 mb-3 pdf-block pdf-keep-together">
          <h1 className="text-xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
          {(personal.jobTitle || personal.targetRole) && (
            <p className="text-xs font-semibold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole}</p>
          )}
          <div className="mt-1">
            <ContactInfo personal={personal} variant="columns" />
          </div>
          <div className="h-px mt-2 bg-slate-300" />
        </div>
      )}

      <div className="space-y-3">
        {personal.summary && isVisible('summary') && (
          <div data-block-id="summary" className="pdf-block pdf-keep-together">
            <SectionHeading title="Summary" accentHex={accentHex} variant="minimal" />
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
          <div className="space-y-1">
            <SectionHeading title="Experience" accentHex={accentHex} variant="minimal" />
            <ExperienceBlock experience={experience} accentHex={accentHex} variant="inline-header" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
          <div className="space-y-1">
            <SectionHeading title="Education" accentHex={accentHex} variant="minimal" />
            <EducationBlock education={education} variant="inline" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
          <div className="space-y-1">
            <SectionHeading title="Projects" accentHex={accentHex} variant="minimal" />
            <ProjectBlock projects={projects} accentHex={accentHex} variant="compact" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && isVisible('skills') && (
          <div data-block-id="skills" className="pdf-block pdf-skills-group pdf-keep-together">
            <SectionHeading title="Skills" accentHex={accentHex} variant="minimal" />
            <SkillsBlock skills={skills} variant="inline" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {certificates.length > 0 && certificates.some((_, i) => isVisible(`cert-${i}`)) && (
          <div className="space-y-1">
            <SectionHeading title="Certifications" accentHex={accentHex} variant="minimal" />
            <CertificatesBlock certificates={certificates} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {achievements.length > 0 && achievements.some((_, i) => isVisible(`achieve-${i}`)) && (
          <div className="space-y-1">
            <SectionHeading title="Achievements" accentHex={accentHex} variant="minimal" />
            <AchievementsBlock achievements={achievements} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {isVisible('social-links') && (
          <div data-block-id="social-links" className="pdf-block pdf-keep-together">
            <SocialLinksBlock personal={personal} accentHex={accentHex} variant="compact" />
          </div>
        )}
      </div>
    </div>
  );
};
