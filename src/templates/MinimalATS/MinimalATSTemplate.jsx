import React from 'react';
import { TemplateSkills } from '../../components/template/TemplateSkills';
import { CustomSectionsBlock } from '../reactive/shared/MiscBlocks';
import { SocialLinksBlock } from '../reactive/shared/SocialLinksBlock';
import { shouldRenderBlock } from '../../utils/paginationEngine';

export const MinimalATSTemplate = ({ resumeData, accentHex = '#000000', fontFamily = 'Inter', visibleBlockIds = null }) => {
  const {
    personal = {},
    experience = [],
    projects = [],
    skills = {},
    education = [],
    certificates = [],
    achievements = [],
    languages = [],
    customSections = []
  } = resumeData || {};

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="space-y-4 text-slate-800 leading-normal" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      
      {/* 1. HEADER */}
      {isVisible('header') && (
        <div data-block-id="header" className="text-center pb-2 border-b border-slate-300">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">{personal.fullName || 'Your Name'}</h1>
          {personal.jobTitle && <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide my-0.5">{personal.jobTitle}</p>}
          <p className="text-[11px] text-slate-600 font-mono flex flex-wrap justify-center gap-2">
            {[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(' | ')}
          </p>
        </div>
      )}

      {/* 2. SUMMARY */}
      {personal.summary && isVisible('summary') && (
        <div data-block-id="summary" className="text-xs leading-relaxed text-slate-700 font-medium pdf-block pdf-keep-together">
          <p>{personal.summary}</p>
        </div>
      )}

      {/* 3. EXPERIENCE */}
      {experience.length > 0 && (
        <div className="space-y-2.5">
          {experience.some((_, i) => isVisible(`exp-${i}`)) && (
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5 pdf-section-header" style={{ borderColor: accentHex }}>
              Experience
            </h2>
          )}
          {experience.map((exp, i) => isVisible(`exp-${i}`) && (
            <div key={exp.id || i} data-block-id={`exp-${i}`} className="text-xs space-y-1 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.role}, {exp.company}</span>
                <span className="font-normal text-slate-500 text-[11px]">{exp.period || `${exp.startDate || ''} ${exp.endDate ? `– ${exp.endDate}` : ''}`}</span>
              </div>
              {Array.isArray(exp.bullets) && exp.bullets.length > 0 ? (
                <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                  {exp.bullets.map((b, idx) => <li key={idx} className="leading-relaxed">{b}</li>)}
                </ul>
              ) : exp.description ? (
                <p className="text-slate-700 leading-relaxed">{exp.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* 4. PROJECTS */}
      {projects.length > 0 && (
        <div className="space-y-2 text-xs">
          {projects.some((_, i) => isVisible(`proj-${i}`)) && (
            <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5 pdf-section-header" style={{ borderColor: accentHex }}>
              Projects
            </h2>
          )}
          {projects.map((p, i) => isVisible(`proj-${i}`) && (
            <div key={p.id || i} data-block-id={`proj-${i}`} className="space-y-0.5 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between font-bold text-slate-900">
                <span>
                  {p.title || p.name}
                  {(() => {
                    const techStr = p.techStack || (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '';
                    return techStr ? <span className="text-slate-500 font-normal font-mono text-[10px] ml-1">({techStr})</span> : null;
                  })()}
                </span>
                {p.link && <span className="font-mono text-slate-500 text-[10px]">{p.link}</span>}
              </div>
              {Array.isArray(p.bullets) && p.bullets.length > 0 ? (
                <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                  {p.bullets.map((b, idx) => <li key={idx}>{b}</li>)}
                </ul>
              ) : p.description ? (
                <p className="text-slate-700">{p.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* 5. SKILLS */}
      {skills && isVisible('skills') && (
        <div data-block-id="skills" className="space-y-1 text-xs pdf-block pdf-skills-group pdf-keep-together">
          <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5 pdf-section-header" style={{ borderColor: accentHex }}>
            Technical Skills
          </h2>
          <TemplateSkills skills={skills} accentHex={accentHex} />
        </div>
      )}

      {/* 6. EDUCATION */}
      {education.length > 0 && (
        <div className="space-y-2 text-xs">
          {education.some((_, i) => isVisible(`edu-${i}`)) && (
            <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
              Education
            </h2>
          )}
          {education.map((edu, i) => isVisible(`edu-${i}`) && (
            <div key={edu.id || i} data-block-id={`edu-${i}`} className="space-y-0.5">
              <div className="flex justify-between">
                <div><strong className="text-slate-900">{edu.degree}</strong> — {edu.institution || edu.college}</div>
                <span className="text-slate-500 text-[11px]">{edu.period || `${edu.startDate || ''} ${edu.endDate ? `– ${edu.endDate}` : ''}`}</span>
              </div>
              {edu.gpa && <div className="text-[11px] text-slate-600 font-medium">GPA: {edu.gpa}</div>}
              {edu.relevantCoursework && (
                <div className="text-[11px] text-slate-700 font-medium">
                  <strong className="text-slate-900">Relevant Coursework: </strong>{edu.relevantCoursework}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 7. CERTIFICATES */}
      {certificates.length > 0 && (
        <div className="space-y-1 text-xs">
          {certificates.some((_, i) => isVisible(`cert-${i}`)) && (
            <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
              Certifications
            </h2>
          )}
          {certificates.map((cert, i) => isVisible(`cert-${i}`) && (
            <div key={cert.id || i} data-block-id={`cert-${i}`} className="flex justify-between text-slate-700 font-medium">
              <span><strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}</span>
              <span className="text-slate-500 text-[11px]">{cert.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* 8. ACHIEVEMENTS */}
      {achievements.length > 0 && isVisible('achievements') && (
        <div data-block-id="achievements" className="space-y-1 text-xs">
          <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
            Achievements
          </h2>
          <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
            {achievements.map((a, i) => (
              <li key={a.id || i}><strong>{a.title}: </strong><span>{a.description}</span></li>
            ))}
          </ul>
        </div>
      )}

      {/* 9. LANGUAGES */}
      {languages.length > 0 && isVisible('languages') && (
        <div data-block-id="languages" className="space-y-1 text-xs">
          <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
            Languages
          </h2>
          <p className="text-slate-700 font-medium">
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
