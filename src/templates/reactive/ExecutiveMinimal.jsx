import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock, LanguagesBlock } from './shared/MiscBlocks';

/**
 * Executive Minimal (inspired by Glalie)
 * Two-column, minimal with light gray sidebar and subtle icons.
 * Professional and understated for legal, finance, or executive roles.
 */
export const ExecutiveMinimalTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [] } = resumeData || {};

  return (
    <div className="flex min-h-full" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Light Gray Left Sidebar */}
      <div className="w-[32%] p-5 space-y-4 bg-slate-50 border-r border-slate-200">
        <div>
          <SectionHeading title="Contact" accentHex={accentHex} variant="minimal" />
          <ContactInfo personal={personal} variant="stacked" />
        </div>

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
          <div>
            <SectionHeading title="Skills" accentHex={accentHex} variant="minimal" />
            <SkillsBlock skills={skills} variant="inline" />
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

      {/* Main Content */}
      <div className="flex-1 p-5 space-y-4 text-slate-800">
        <div className="pb-3">
          <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm font-semibold text-slate-500 mt-0.5">{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
          <div className="h-[2px] mt-2 rounded-full" style={{ backgroundColor: accentHex }} />
        </div>

        {personal.summary && (
          <div>
            <SectionHeading title="Summary" accentHex={accentHex} />
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div>
            <SectionHeading title="Experience" accentHex={accentHex} />
            <ExperienceBlock experience={experience} accentHex={accentHex} />
          </div>
        )}

        {projects.length > 0 && (
          <div>
            <SectionHeading title="Projects" accentHex={accentHex} />
            <ProjectBlock projects={projects} accentHex={accentHex} />
          </div>
        )}

        {achievements.length > 0 && (
          <div>
            <SectionHeading title="Achievements" accentHex={accentHex} />
            <AchievementsBlock achievements={achievements} />
          </div>
        )}
      </div>
    </div>
  );
};
