import React from 'react';
import { SectionHeading } from './shared/SectionHeading';
import { ContactInfo } from './shared/ContactInfo';
import { ExperienceBlock } from './shared/ExperienceBlock';
import { EducationBlock } from './shared/EducationBlock';
import { ProjectBlock } from './shared/ProjectBlock';
import { SkillsBlock } from './shared/SkillsBlock';
import { CertificatesBlock, AchievementsBlock } from './shared/MiscBlocks';

import { shouldRenderBlock } from '../../utils/paginationEngine';

/**
 * Executive Bold (inspired by Scizor)
 * Single-column with uppercase section headings and a primary-color top rule on every page.
 * Polished for executive, consulting, or startup resumes.
 */
export const ExecutiveBoldTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData || {};

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Bold Top Rule */}
      {isVisible('header') && (
        <div className="h-[4px] rounded-full mb-4" style={{ backgroundColor: accentHex }} />
      )}

      {/* Header */}
      {isVisible('header') && (
        <div data-block-id="header" className="pb-4 mb-4 border-b border-slate-200 pdf-block pdf-keep-together">
          <h1 className="text-3xl font-black text-slate-900 uppercase tracking-wide">{personal.fullName || 'Your Name'}</h1>
          <p className="text-sm font-extrabold uppercase tracking-wider mt-1" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole || 'Job Title'}</p>
          <div className="mt-2">
            <ContactInfo personal={personal} variant="inline" />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {personal.summary && isVisible('summary') && (
          <div data-block-id="summary" className="pdf-block pdf-keep-together">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Executive Summary
            </h2>
            <p className="text-[10px] leading-relaxed text-slate-700">{personal.summary}</p>
          </div>
        )}

        {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Professional Experience
            </h2>
            <ExperienceBlock experience={experience} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Key Projects
            </h2>
            <ProjectBlock projects={projects} accentHex={accentHex} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Education
            </h2>
            <EducationBlock education={education} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && isVisible('skills') && (
          <div data-block-id="skills" className="pdf-block pdf-skills-group pdf-keep-together">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Core Competencies
            </h2>
            <SkillsBlock skills={skills} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {certificates.length > 0 && certificates.some((_, i) => isVisible(`cert-${i}`)) && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Certifications
            </h2>
            <CertificatesBlock certificates={certificates} visibleBlockIds={visibleBlockIds} />
          </div>
        )}

        {achievements.length > 0 && achievements.some((_, i) => isVisible(`achieve-${i}`)) && (
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] pb-1 mb-2 border-b-2" style={{ color: accentHex, borderColor: accentHex }}>
              Achievements
            </h2>
            <AchievementsBlock achievements={achievements} visibleBlockIds={visibleBlockIds} />
          </div>
        )}
      </div>
    </div>
  );
};
