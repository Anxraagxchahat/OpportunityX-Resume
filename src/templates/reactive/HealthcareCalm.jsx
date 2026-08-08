import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { ProfilePhoto } from './shared/ProfilePhoto';
import { CertificatesBlock, AchievementsBlock, LanguagesBlock } from './shared/MiscBlocks';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';

/**
 * Healthcare Calm (inspired by Leafish)
 * Two-column with muted color sidebar on the right.
 * Earthy and calm, suits sustainability, healthcare, or nonprofit sectors.
 */
export const HealthcareCalmTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [], assets = {} } = resumeData || {};
  const sidebarBg = '#e8efe5';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  return (
    <div className="flex min-h-full text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Main Content — Left */}
      <div className="flex-1 p-5 space-y-4">
        <div className="pb-3 border-b" style={{ borderColor: `${accentHex}40` }}>
          <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm font-bold mt-0.5" style={{ color: accentHex }}>{personal.jobTitle || 'Job Title'}</p>
        </div>

        {personal.summary && (
          <div>
            <SectionHeading title="Summary" accentHex={accentHex} variant="underline" />
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SectionHeading title="Experience" accentHex={accentHex} variant="underline" />
            <ExperienceBlock experience={experience} accentHex={accentHex} />
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <SectionHeading title="Projects" accentHex={accentHex} variant="underline" />
            <ProjectBlock projects={projects} accentHex={accentHex} />
          </div>
        )}

        {achievements.length > 0 && (
          <div>
            <SectionHeading title="Achievements" accentHex={accentHex} variant="underline" />
            <AchievementsBlock achievements={achievements} />
          </div>
        )}
      </div>

      {/* Right Sidebar — Muted earthy */}
      <div className="w-[32%] p-5 space-y-4" style={{ backgroundColor: sidebarBg }}>
        <div className="flex justify-center mb-2">
          <ProfilePhoto
            src={photoSrc}
            size={64}
            photoSize={assets?.photoSize}
            shape={assets?.photoShape}
            position={assets?.photoPosition}
            offsetY={assets?.photoOffsetY}
            zoom={assets?.photoZoom}
            borderColor={accentHex}
          />
        </div>

        <div>
          <SectionHeading title="Contact" accentHex={accentHex} variant="minimal" />
          <ContactInfo personal={personal} variant="stacked" />
        </div>

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div>
            <SectionHeading title="Skills" accentHex={accentHex} variant="minimal" />
            <SkillsBlock skills={skills} variant="tags" />
          </div>
        )}

        {education.length > 0 && (
          <div>
            <SectionHeading title="Education" accentHex={accentHex} variant="minimal" />
            <EducationBlock education={education} variant="compact" />
          </div>
        )}

        {certificates.length > 0 && (
          <div>
            <SectionHeading title="Certifications" accentHex={accentHex} variant="minimal" />
            <CertificatesBlock certificates={certificates} />
          </div>
        )}

        {languages.length > 0 && (
          <div>
            <SectionHeading title="Languages" accentHex={accentHex} variant="minimal" />
            <LanguagesBlock languages={languages} />
          </div>
        )}
      </div>
    </div>
  );
};
