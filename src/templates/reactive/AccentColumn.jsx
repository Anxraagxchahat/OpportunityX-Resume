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
 * Accent Column (inspired by Pikachu)
 * Two-column with a left margin color accent strip.
 * Simple and approachable for creative, editorial, or junior roles.
 */
export const AccentColumnTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [], assets = {} } = resumeData || {};
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="flex min-h-full" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Left Accent Strip + Sidebar */}
      <div className="w-[30%] flex">
        {/* Thin accent strip */}
        <div className="w-2 flex-shrink-0" style={{ backgroundColor: accentHex }} />

        {/* Sidebar Content */}
        <div className="flex-1 p-4 space-y-3.5 bg-slate-50">
          {isVisible('header') && (
            <div data-block-id="header" className="flex justify-center mb-2">
              <ProfilePhoto
                src={photoSrc}
                size={56}
                photoSize={assets?.photoSize}
                shape={assets?.photoShape}
                position={assets?.photoPosition}
                offsetY={assets?.photoOffsetY}
                zoom={assets?.photoZoom}
                borderColor={accentHex}
              />
            </div>
          )}

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
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 space-y-4 text-slate-800">
        {isVisible('header') && (
          <div data-block-id="header" className="pb-3">
            <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
            <p className="text-sm font-bold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
          </div>
        )}

        {personal.summary && isVisible('summary') && (
          <div data-block-id="summary" className="pdf-block pdf-keep-together">
            <SectionHeading title="About" accentHex={accentHex} variant="underline" />
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
