import React from 'react';
import { TemplateSkills } from '../../components/template/TemplateSkills';
import { CustomSectionsBlock } from '../reactive/shared/MiscBlocks';
import { ProfilePhoto } from '../reactive/shared/ProfilePhoto';
import { SocialLinksBlock } from '../reactive/shared/SocialLinksBlock';
import { shouldRenderBlock } from '../../utils/paginationEngine';
import { getTemplateCapabilities } from '../../utils/templateCapabilities';

export const ModernATSTemplate = ({ resumeData, accentHex = '#F97316', fontFamily = 'Inter', visibleBlockIds = null }) => {
  const {
    personal = {},
    experience = [],
    projects = [],
    skills = {},
    education = [],
    certificates = [],
    achievements = [],
    languages = [],
    socialLinks = {},
    customSections = [],
    assets = {}
  } = resumeData || {};

  const showPhoto = Boolean(assets?.profilePhoto && assets?.photoPosition !== 'hidden' && getTemplateCapabilities('modern').supportsPhoto);

  const headerContactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin
  ].filter(Boolean);

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="space-y-4 text-slate-800 leading-normal text-xs" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      
      {/* 1. HEADER */}
      {isVisible('header') && (
        <div data-block-id="header" className="pb-3 border-b-2 flex justify-between items-start gap-4" style={{ borderColor: accentHex }}>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{personal.fullName || 'Your Name'}</h1>
            {(personal.jobTitle || personal.targetRole) && <p className="text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: accentHex }}>{personal.jobTitle || personal.targetRole}</p>}
            <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-600 font-medium">
              {headerContactItems.map((item, idx) => (
                <span key={idx}>{idx > 0 && '• '}{item}</span>
              ))}
            </div>
          </div>

          {showPhoto && (
            <div className="flex-shrink-0">
              <ProfilePhoto
                src={assets.profilePhoto}
                size={72}
                photoSize={assets?.photoSize}
                shape={assets?.photoShape || 'rounded'}
                position={assets?.photoPosition}
                offsetY={assets?.photoOffsetY}
                zoom={assets?.photoZoom}
                borderColor={accentHex}
              />
            </div>
          )}
        </div>
      )}

      {/* 2. SUMMARY */}
      {personal.summary && isVisible('summary') && (
        <div data-block-id="summary" className="space-y-1 pdf-block pdf-keep-together">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b pdf-section-header" style={{ borderColor: `${accentHex}40` }}>
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 font-medium">{personal.summary}</p>
        </div>
      )}

      {/* 3. EXPERIENCE */}
      {experience.length > 0 && (
        <div className="space-y-3">
          {experience.some((_, i) => isVisible(`exp-${i}`)) && (
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b pdf-section-header" style={{ borderColor: accentHex }}>
              Work Experience
            </h2>
          )}
          {experience.map((exp, i) => isVisible(`exp-${i}`) && (
            <div key={exp.id || i} data-block-id={`exp-${i}`} className="space-y-1 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                <span>{exp.role || exp.title} <span className="font-semibold text-slate-600">— {exp.company}</span></span>
                <span className="text-slate-500 font-medium text-[11px]">
                  {exp.current || exp.isCurrent
                    ? (exp.startDate ? `${exp.startDate} – Present` : 'Present')
                    : (exp.startDate && exp.endDate
                        ? `${exp.startDate} – ${exp.endDate}`
                        : (exp.startDate || exp.endDate || exp.period || ''))}
                </span>
              </div>
              {Array.isArray(exp.bullets) && exp.bullets.length > 0 ? (
                <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                  {exp.bullets.map((b, idx) => <li key={idx} className="leading-relaxed">{b}</li>)}
                </ul>
              ) : exp.description ? (
                <p className="text-xs text-slate-700 leading-relaxed">{exp.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* 4. PROJECTS */}
      {projects.length > 0 && (
        <div className="space-y-2.5">
          {projects.some((_, i) => isVisible(`proj-${i}`)) && (
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b pdf-section-header" style={{ borderColor: accentHex }}>
              Technical Projects
            </h2>
          )}
          {projects.map((p, i) => isVisible(`proj-${i}`) && (
            <div key={p.id || i} data-block-id={`proj-${i}`} className="text-xs space-y-1 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>
                  {p.title || p.name}
                  {(() => {
                    const techStr = p.techStack || (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '';
                    return techStr ? <span className="text-slate-500 font-normal ml-1">({techStr})</span> : null;
                  })()}
                </span>
                {p.link && <span className="text-[10px] text-slate-500 font-mono">{p.link}</span>}
              </div>
              {Array.isArray(p.bullets) && p.bullets.length > 0 ? (
                <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
                  {p.bullets.map((b, idx) => <li key={idx} className="leading-relaxed">{b}</li>)}
                </ul>
              ) : p.description ? (
                <p className="text-slate-700 leading-relaxed">{p.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* 5. SKILLS */}
      {skills && isVisible('skills') && (
        <div data-block-id="skills" className="space-y-1 pdf-block pdf-skills-group pdf-keep-together">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b mb-1.5 pdf-section-header" style={{ borderColor: accentHex }}>
            Skills & Competencies
          </h2>
          <TemplateSkills skills={skills} accentHex={accentHex} />
        </div>
      )}

      {/* 6. EDUCATION */}
      {education.length > 0 && (
        <div className="space-y-2">
          {education.some((_, i) => isVisible(`edu-${i}`)) && (
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b pdf-section-header" style={{ borderColor: accentHex }}>
              Education
            </h2>
          )}
          {education.map((edu, i) => isVisible(`edu-${i}`) && (
            <div key={edu.id || i} data-block-id={`edu-${i}`} className="text-xs space-y-0.5 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>{edu.degree} — <span className="font-semibold text-slate-600">{edu.institution || edu.college}</span></span>
                <span className="text-slate-500 font-medium text-[11px]">{edu.period || `${edu.startDate || ''} ${edu.endDate ? `– ${edu.endDate}` : ''}`}</span>
              </div>
              {edu.gpa && <div className="text-[11px] font-semibold text-slate-600">CGPA / Score: {edu.gpa}</div>}
              {edu.relevantCoursework && (
                <div className="text-[11px] text-slate-700 font-medium">
                  <strong className="text-slate-900">Relevant Coursework: </strong>{edu.relevantCoursework}
                </div>
              )}
              {edu.description && (
                <div className="text-[11px] text-slate-700 font-medium">
                  {edu.description}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 7. CERTIFICATES */}
      {certificates.length > 0 && (
        <div className="space-y-1.5">
          {certificates.some((_, i) => isVisible(`cert-${i}`)) && (
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b" style={{ borderColor: accentHex }}>
              Certifications
            </h2>
          )}
          {certificates.map((cert, i) => isVisible(`cert-${i}`) && (
            <div key={cert.id || i} data-block-id={`cert-${i}`} className="flex justify-between text-slate-700 font-medium text-xs">
              <span><strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}</span>
              <span className="text-slate-500 text-[11px]">{cert.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* 8. ACHIEVEMENTS */}
      {achievements.length > 0 && isVisible('achievements') && (
        <div data-block-id="achievements" className="space-y-1.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b" style={{ borderColor: accentHex }}>
            Honors & Achievements
          </h2>
          <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
            {achievements.map((ach, i) => (
              <li key={ach.id || i}>
                <strong className="text-slate-900">{ach.title}: </strong>
                <span>{ach.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 9. LANGUAGES */}
      {languages.length > 0 && isVisible('languages') && (
        <div data-block-id="languages" className="space-y-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b mb-1" style={{ borderColor: accentHex }}>
            Languages
          </h2>
          <p className="text-xs text-slate-700 font-medium">
            {languages.map(l => typeof l === 'string' ? l : `${l.name || l.language || ''}${l.proficiency ? ` (${l.proficiency})` : ''}`).filter(Boolean).join(' • ')}
          </p>
        </div>
      )}

      {/* 10. CUSTOM SECTIONS */}
      {Array.isArray(customSections) && customSections.length > 0 && (
        <CustomSectionsBlock customSections={customSections} accentHex={accentHex} isVisible={isVisible} />
      )}

      {/* 11. SOCIAL & PORTFOLIO LINKS */}
      {isVisible('profiles') && (
        <div data-block-id="profiles">
          <SocialLinksBlock personal={personal} accentHex={accentHex} />
        </div>
      )}
    </div>
  );
};
