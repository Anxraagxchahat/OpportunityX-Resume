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
 * Professional Clean (inspired by Bronzor)
 * Two-column, clean and professional with subtle section dividers.
 * Suits corporate, finance, or consulting positions.
 */
export const ProfessionalCleanTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  const hasSidebarContent =
    (education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`))) ||
    (skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0)) ||
    (certificates.length > 0 && certificates.some((_, i) => isVisible(`cert-${i}`))) ||
    (achievements.length > 0 && achievements.some((_, i) => isVisible(`achieve-${i}`)));

  const hasMainContent =
    (personal.summary && isVisible('summary')) ||
    (experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`))) ||
    (projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`))) ||
    isVisible('profiles');

  return (
    <div className="space-y-4 text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Header */}
      {isVisible('header') && (
        <div data-block-id="header" className="pb-3 border-b-2" style={{ borderColor: accentHex }}>
          <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm font-bold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
          <div className="mt-2">
            <ContactInfo personal={personal} variant="inline" />
          </div>
        </div>
      )}

      {/* Two Column Body */}
      {(hasMainContent || hasSidebarContent) && (
        <div className="flex gap-6">
          {/* Main Column */}
          {hasMainContent && (
            <div className="flex-1 space-y-4">
              {personal.summary && isVisible('summary') && (
                <div data-block-id="summary" className="pdf-block pdf-keep-together">
                  <SectionHeading title="Professional Summary" accentHex={accentHex} variant="underline" />
                  <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
                </div>
              )}

              {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
                <div>
                  <SectionHeading title="Work Experience" accentHex={accentHex} variant="underline" />
                  <ExperienceBlock experience={experience} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
                </div>
              )}

              {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
                <div>
                  <SectionHeading title="Projects" accentHex={accentHex} variant="underline" />
                  <ProjectBlock projects={projects} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
                </div>
              )}

              {isVisible('profiles') && (
                <SocialLinksBlock personal={personal} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
              )}
            </div>
          )}

          {/* Right Column */}
          {hasSidebarContent && (
            <div className="w-[34%] space-y-4">
              {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
                <div>
                  <SectionHeading title="Education" accentHex={accentHex} variant="underline" />
                  <EducationBlock education={education} variant="compact" visibleBlockIds={visibleBlockIds} />
                </div>
              )}

              {skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
                <div>
                  <SectionHeading title="Skills" accentHex={accentHex} variant="underline" />
                  <SkillsBlock skills={skills} variant="tags" visibleBlockIds={visibleBlockIds} />
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
          )}
        </div>
      )}
    </div>
  );
};
