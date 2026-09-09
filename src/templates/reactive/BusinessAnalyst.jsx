import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock, LanguagesBlock } from './shared/MiscBlocks';
import { SocialLinksBlock } from './shared/SocialLinksBlock';
import { shouldRenderBlock } from '../../utils/paginationEngine';

/**
 * Business Analyst (inspired by Gengar)
 * Two-column with accent colors and clean typography.
 * Balanced choice for business analysts or operations roles.
 */
export const BusinessAnalystTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [] } = resumeData || {};

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="flex min-h-full" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Left Sidebar — light tinted */}
      <div className="w-[33%] p-5 space-y-4" style={{ backgroundColor: `${accentHex}08`, borderRight: `2px solid ${accentHex}20` }}>
        {isVisible('contact') && (
          <div data-block-id="contact">
            <SectionHeading title="Contact" accentHex={accentHex} variant="bold-rule" />
            <ContactInfo personal={personal} variant="stacked" />
          </div>
        )}

        {skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div>
            <SectionHeading title="Skills" accentHex={accentHex} variant="bold-rule" />
            <SkillsBlock skills={skills} variant="tags" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
          <div>
            <SectionHeading title="Education" accentHex={accentHex} variant="bold-rule" />
            <EducationBlock education={education} variant="compact" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {certificates.length > 0 && certificates.some((_, i) => isVisible(`cert-${i}`)) && (
          <div>
            <SectionHeading title="Certifications" accentHex={accentHex} variant="bold-rule" />
            <CertificatesBlock certificates={certificates} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {languages.length > 0 && isVisible('languages') && (
          <div data-block-id="languages">
            <SectionHeading title="Languages" accentHex={accentHex} variant="bold-rule" />
            <LanguagesBlock languages={languages} visibleBlockIds={visibleBlockIds} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 space-y-4 text-slate-800">
        {isVisible('header') && (
          <div data-block-id="header" className="pb-3 border-b" style={{ borderColor: `${accentHex}30` }}>
            <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
            <p className="text-sm font-bold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
          </div>
        )}

        {personal.summary && isVisible('summary') && (
          <div data-block-id="summary" className="pdf-block pdf-keep-together">
            <SectionHeading title="Summary" accentHex={accentHex} variant="underline" />
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
          <div>
            <SectionHeading title="Experience" accentHex={accentHex} variant="underline" />
            <ExperienceBlock experience={experience} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
          <div>
            <SectionHeading title="Projects" accentHex={accentHex} variant="underline" />
            <ProjectBlock projects={projects} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {achievements.length > 0 && achievements.some((_, i) => isVisible(`achieve-${i}`)) && (
          <div>
            <SectionHeading title="Achievements" accentHex={accentHex} variant="underline" />
            <AchievementsBlock achievements={achievements} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {isVisible('profiles') && (
          <SocialLinksBlock personal={personal} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
        )}
      </div>
    </div>
  );
};
