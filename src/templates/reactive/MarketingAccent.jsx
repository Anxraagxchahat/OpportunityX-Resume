import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { ProfilePhoto } from './shared/ProfilePhoto';
import { CertificatesBlock, AchievementsBlock, LanguagesBlock } from './shared/MiscBlocks';
import { SocialLinksBlock } from './shared/SocialLinksBlock';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';
import { shouldRenderBlock } from '../../utils/paginationEngine';

/**
 * Marketing Accent (inspired by Chikorita)
 * Two-column with soft header accent and circular profile photo on right sidebar.
 * Ideal for marketing, HR, or client-facing roles.
 */
export const MarketingAccentTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [], assets = {} } = resumeData || {};
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  const hasSidebarContent =
    (education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`))) ||
    (skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0)) ||
    (certificates.length > 0 && certificates.some((_, i) => isVisible(`cert-${i}`))) ||
    (languages.length > 0 && isVisible('languages'));

  const hasMainContent =
    (personal.summary && isVisible('summary')) ||
    (experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`))) ||
    (projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`))) ||
    (achievements.length > 0 && achievements.some((_, i) => isVisible(`achieve-${i}`))) ||
    isVisible('profiles');

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Header with accent background */}
      {isVisible('header') && (
        <div data-block-id="header" className="p-5 pb-4 rounded-b-lg" style={{ backgroundColor: `${accentHex}10` }}>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
              <p className="text-sm font-bold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
              <div className="mt-2">
                <ContactInfo personal={personal} variant="inline" />
              </div>
            </div>
            <ProfilePhoto
              src={photoSrc}
              size={68}
              photoSize={assets?.photoSize}
              shape={assets?.photoShape}
              position={assets?.photoPosition}
              offsetY={assets?.photoOffsetY}
              zoom={assets?.photoZoom}
              borderColor={accentHex}
              borderWidth={2}
            />
          </div>
        </div>
      )}

      {/* Two Column Body */}
      {(hasMainContent || hasSidebarContent) && (
        <div className="flex gap-5 p-5 pt-4">
          {/* Main Column */}
          {hasMainContent && (
            <div className="flex-1 space-y-4">
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
          )}

          {/* Right Sidebar */}
          {hasSidebarContent && (
            <div className="w-[30%] space-y-4 pl-4 border-l border-slate-200">
              {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
                <div>
                  <SectionHeading title="Education" accentHex={accentHex} variant="minimal" />
                  <EducationBlock education={education} variant="compact" visibleBlockIds={visibleBlockIds} />
                </div>
              )}

              {skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
                <div>
                  <SectionHeading title="Skills" accentHex={accentHex} variant="minimal" />
                  <SkillsBlock skills={skills} variant="tags" visibleBlockIds={visibleBlockIds} />
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
        </div>
      )}
    </div>
  );
};
