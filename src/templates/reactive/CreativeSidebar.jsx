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
 * Creative Sidebar (inspired by Azurill)
 * Two-column layout with bold colored sidebar on the left.
 * Great for creative or tech roles where visual flair is welcome.
 */
export const CreativeSidebarTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [], customSections = [], assets = {} } = resumeData || {};
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="flex min-h-full" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Left Sidebar */}
      <div className="w-[32%] p-5 space-y-4 text-white" style={{ backgroundColor: accentHex }}>
        {isVisible('header') && (
          <div data-block-id="header">
            <div className="flex justify-center mb-3">
              <ProfilePhoto
                src={photoSrc}
                size={72}
                photoSize={assets?.photoSize}
                shape={assets?.photoShape}
                position={assets?.photoPosition}
                offsetY={assets?.photoOffsetY}
                zoom={assets?.photoZoom}
                borderColor="rgba(255,255,255,0.3)"
              />
            </div>
          </div>
        )}

        {isVisible('contact') && (
          <div data-block-id="contact">
            <h2 className="text-xs font-black uppercase tracking-wider text-white/90 pb-1 mb-2 border-b border-white/20">Contact</h2>
            <ContactInfo personal={personal} variant="sidebar" />
          </div>
        )}

        {skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div data-block-id="skills">
            <h2 className="text-xs font-black uppercase tracking-wider text-white/90 pb-1 mb-2 border-b border-white/20">Skills</h2>
            <SkillsBlock skills={skills} variant="sidebar-tags" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-white/90 pb-1 mb-2 border-b border-white/20">Education</h2>
            <EducationBlock education={education} variant="sidebar" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {certificates.length > 0 && certificates.some((_, i) => isVisible(`cert-${i}`)) && (
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-white/90 pb-1 mb-2 border-b border-white/20">Certifications</h2>
            <CertificatesBlock certificates={certificates} variant="sidebar" visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {languages.length > 0 && isVisible('languages') && (
          <div data-block-id="languages">
            <h2 className="text-xs font-black uppercase tracking-wider text-white/90 pb-1 mb-2 border-b border-white/20">Languages</h2>
            <LanguagesBlock languages={languages} variant="sidebar" visibleBlockIds={visibleBlockIds} />
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 p-5 space-y-4 text-slate-800">
        {isVisible('header') && (
          <div data-block-id="header" className="text-center pb-3 border-b border-slate-200">
            <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
            <p className="text-sm font-semibold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
          </div>
        )}

        {personal.summary && isVisible('summary') && (
          <div data-block-id="summary" className="pdf-block pdf-keep-together">
            <SectionHeading title="Professional Summary" accentHex={accentHex} />
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

        {customSections && customSections.length > 0 && (
          <div>
            <CustomSectionsBlock customSections={customSections} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {isVisible('profiles') && (
          <SocialLinksBlock personal={personal} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
        )}
      </div>
    </div>
  );
};
