import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { ProfilePhoto } from './shared/ProfilePhoto';
import { CertificatesBlock, AchievementsBlock, LanguagesBlock, CustomSectionsBlock } from './shared/MiscBlocks';
import { SocialLinksBlock } from './shared/SocialLinksBlock';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';

import { shouldRenderBlock } from '../../utils/paginationEngine';

/**
 * Compact Entry / Student Format
 * Centered header layout matching template preview with photo support.
 * Compact and efficient for entry-level or student applications.
 */
export const CompactEntryTemplate = ({ resumeData, accentHex = '#F97316', fontFamily, visibleBlockIds = null }) => {
  const {
    personal = {},
    experience = [],
    education = [],
    projects = [],
    skills = {},
    certificates = [],
    achievements = [],
    languages = [],
    customSections = [],
    assets = {}
  } = resumeData || {};

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;
  const showPhoto = assets?.photoPosition && assets?.photoPosition !== 'hidden';

  return (
    <div className="text-slate-800 space-y-4" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Centered Header (matching card preview) */}
      {isVisible('header') && (
        <div data-block-id="header" className="pb-4 border-b-2 flex flex-col items-center text-center space-y-2 pdf-block pdf-keep-together" style={{ borderColor: accentHex }}>
          {showPhoto && (
            <div className="flex justify-center mb-1">
              <ProfilePhoto
                src={photoSrc}
                size={80}
                photoSize={assets?.photoSize}
                shape={assets?.photoShape || 'rounded'}
                position={assets?.photoPosition}
                offsetY={assets?.photoOffsetY}
                zoom={assets?.photoZoom}
                borderColor={accentHex}
              />
            </div>
          )}

          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">{personal.fullName || 'Your Name'}</h1>
            <p className="text-xs font-bold uppercase tracking-wider mt-0.5" style={{ color: accentHex }}>
              {personal.jobTitle || personal.targetRole || 'Job Title / Target Role'}
            </p>
          </div>

          <div className="flex justify-center">
            <ContactInfo personal={personal} variant="inline" accentHex={accentHex} />
          </div>
        </div>
      )}

      <div className="space-y-3">
        {personal.summary && isVisible('summary') && (
          <div data-block-id="summary" className="space-y-1 pdf-block pdf-keep-together">
            <SectionHeading title="Summary" accentHex={accentHex} variant="minimal" />
            <p className="text-xs leading-relaxed text-slate-700 font-medium">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
          <div className="space-y-1">
            <SectionHeading title="Experience" accentHex={accentHex} variant="minimal" />
            <ExperienceBlock experience={experience} accentHex={accentHex} variant="compact" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
          <div className="space-y-1">
            <SectionHeading title="Education" accentHex={accentHex} variant="minimal" />
            <EducationBlock education={education} variant="compact" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
          <div className="space-y-1">
            <SectionHeading title="Projects" accentHex={accentHex} variant="minimal" />
            <ProjectBlock projects={projects} accentHex={accentHex} variant="compact" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && isVisible('skills') && (
          <div data-block-id="skills" className="space-y-1 pdf-block pdf-skills-group pdf-keep-together">
            <SectionHeading title="Skills" accentHex={accentHex} variant="minimal" />
            <SkillsBlock skills={skills} variant="tags" visibleBlockIds={visibleBlockIds} />
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

        {languages.length > 0 && isVisible('languages') && (
          <div className="space-y-1">
            <SectionHeading title="Languages" accentHex={accentHex} variant="minimal" />
            <LanguagesBlock languages={languages} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {customSections && customSections.length > 0 && (
          <div className="space-y-1">
            <CustomSectionsBlock customSections={customSections} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {isVisible('social-links') && (
          <div data-block-id="social-links" className="pdf-block pdf-keep-together">
            <SocialLinksBlock personal={personal} accentHex={accentHex} />
          </div>
        )}
      </div>
    </div>
  );
};
