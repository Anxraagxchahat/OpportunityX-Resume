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
 * Executive Minimal (inspired by Glalie)
 * Two-column, minimal with light gray sidebar and subtle icons.
 * Professional and understated for legal, finance, or executive roles.
 */
export const ExecutiveMinimalTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [] } = resumeData || {};

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  const hasSidebarContent =
    isVisible('contact') ||
    (skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0)) ||
    (education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`))) ||
    (certificates.length > 0 && certificates.some((_, i) => isVisible(`cert-${i}`))) ||
    (languages.length > 0 && isVisible('languages'));

  const hasMainContent =
    isVisible('header') ||
    (personal.summary && isVisible('summary')) ||
    (experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`))) ||
    (projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`))) ||
    (achievements.length > 0 && achievements.some((_, i) => isVisible(`achieve-${i}`))) ||
    isVisible('profiles');

  return (
    <div className="flex min-h-full" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Light Gray Left Sidebar */}
      {hasSidebarContent && (
        <div className="w-[32%] p-5 space-y-4 bg-slate-50 border-r border-slate-200">
          {isVisible('contact') && (
            <div data-block-id="contact">
              <SectionHeading title="Contact" accentHex={accentHex} variant="minimal" />
              <ContactInfo personal={personal} variant="stacked" />
            </div>
          )}

          {skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
            <div>
              <SectionHeading title="Skills" accentHex={accentHex} variant="minimal" />
              <SkillsBlock skills={skills} variant="inline" visibleBlockIds={visibleBlockIds} />
            </div>
          )}

          {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
            <div>
              <SectionHeading title="Education" accentHex={accentHex} variant="minimal" />
              <EducationBlock education={education} variant="compact" visibleBlockIds={visibleBlockIds} />
            </div>
          )}

          {certificates.length > 0 && certificates.some((_, i) => isVisible(`cert-${i}`)) && (
            <div>
              <SectionHeading title="Certifications" accentHex={accentHex} variant="minimal" />
              <CertificatesBlock certificates={certificates} visibleBlockIds={visibleBlockIds} />
            </div>
          )}

          {languages.length > 0 && isVisible('languages') && (
            <div data-block-id="languages">
              <SectionHeading title="Languages" accentHex={accentHex} variant="minimal" />
              <LanguagesBlock languages={languages} visibleBlockIds={visibleBlockIds} />
            </div>
          )}
        </div>
      )}

      {/* Main Content */}
      {hasMainContent && (
        <div className="flex-1 p-5 space-y-4 text-slate-800">
          {isVisible('header') && (
            <div data-block-id="header" className="pb-3">
              <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
              <p className="text-sm font-semibold text-slate-500 mt-0.5">{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
              <div className="h-[2px] mt-2 rounded-full" style={{ backgroundColor: accentHex }} />
            </div>
          )}

          {personal.summary && isVisible('summary') && (
            <div data-block-id="summary" className="pdf-block pdf-keep-together">
              <SectionHeading title="Summary" accentHex={accentHex} />
              <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
            </div>
          )}

          {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
            <div>
              <SectionHeading title="Experience" accentHex={accentHex} />
              <ExperienceBlock experience={experience} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
            </div>
          )}

          {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
            <div>
              <SectionHeading title="Projects" accentHex={accentHex} />
              <ProjectBlock projects={projects} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
            </div>
          )}

          {achievements.length > 0 && achievements.some((_, i) => isVisible(`achieve-${i}`)) && (
            <div>
              <SectionHeading title="Achievements" accentHex={accentHex} />
              <AchievementsBlock achievements={achievements} visibleBlockIds={visibleBlockIds} />
            </div>
          )}

          {isVisible('profiles') && (
            <SocialLinksBlock personal={personal} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
          )}
        </div>
      )}
    </div>
  );
};
