import React from 'react';
import { TemplateSkills } from '../../components/template/TemplateSkills';
import { CustomSectionsBlock } from '../reactive/shared/MiscBlocks';
import { SocialLinksBlock } from '../reactive/shared/SocialLinksBlock';
import { shouldRenderBlock } from '../../utils/paginationEngine';

export const RecruiterATSTemplate = ({ resumeData, accentHex = '#2563EB', fontFamily = 'Inter', visibleBlockIds = null }) => {
  const {
    personal = {},
    experience = [],
    education = [],
    projects = [],
    skills = {},
    certificates = [],
    achievements = [],
    languages = [],
    customSections = []
  } = resumeData || {};

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  const contactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin,
    personal.website || personal.portfolio,
    personal.github
  ].filter(Boolean);

  return (
    <div className="space-y-3.5 text-slate-800 leading-normal text-xs" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* 1. HEADER */}
      {isVisible('header') && (
        <div data-block-id="header" className="p-3.5 bg-slate-100/80 rounded-lg border-l-4" style={{ borderColor: accentHex }}>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">{personal.fullName || 'Candidate Name'}</h1>
          <p className="text-xs font-bold text-slate-700 mt-0.5" style={{ color: accentHex }}>
            {personal.jobTitle || personal.targetRole || 'Target Role'}
          </p>
          {contactItems.length > 0 && (
            <p className="text-[11px] text-slate-600 font-mono mt-1.5 flex flex-wrap gap-2">
              {contactItems.map((item, idx) => (
                <span key={idx}>
                  {idx > 0 && <span className="text-slate-400 mr-2">|</span>}
                  {item}
                </span>
              ))}
            </p>
          )}
        </div>
      )}

      {/* 2. SUMMARY */}
      {personal.summary && isVisible('summary') && (
        <div data-block-id="summary" className="space-y-1 pdf-block pdf-keep-together">
          <h2 className="font-extrabold uppercase tracking-wider text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
            Recruiter Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 font-medium">{personal.summary}</p>
        </div>
      )}

      {/* 3. SKILLS */}
      {skills && isVisible('skills') && (
        <div data-block-id="skills" className="space-y-1 pdf-block pdf-keep-together">
          <h2 className="font-extrabold uppercase tracking-wider text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
            Core Skill Matrix
          </h2>
          <TemplateSkills skills={skills} accentHex={accentHex} />
        </div>
      )}

      {/* 4. EXPERIENCE */}
      {experience.length > 0 && (
        <div className="space-y-2.5 text-xs">
          {experience.some((_, i) => isVisible(`exp-${i}`)) && (
            <h2 className="font-extrabold uppercase tracking-wider text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
              Career History & Track Record
            </h2>
          )}
          {experience.map((exp, i) => isVisible(`exp-${i}`) && (
            <div key={exp.id || i} data-block-id={`exp-${i}`} className="space-y-1 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between font-bold text-slate-900">
                <span>
                  {exp.role || exp.title || exp.jobTitle}
                  {exp.company ? ` (${exp.company})` : ''}
                  {exp.location ? <span className="font-normal text-slate-500 text-[11px]"> · {exp.location}</span> : null}
                </span>
                <span className="text-slate-500 font-normal text-[11px]">
                  {exp.current || exp.isCurrent
                    ? (exp.startDate ? `${exp.startDate} – Present` : 'Present')
                    : (exp.startDate && exp.endDate
                        ? `${exp.startDate} – ${exp.endDate}`
                        : (exp.startDate || exp.endDate || exp.period || ''))}
                </span>
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

      {/* 5. PROJECTS */}
      {projects.length > 0 && (
        <div className="space-y-2.5 text-xs">
          {projects.some((_, i) => isVisible(`proj-${i}`)) && (
            <h2 className="font-extrabold uppercase tracking-wider text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
              Key Projects & Impact
            </h2>
          )}
          {projects.map((p, i) => isVisible(`proj-${i}`) && (
            <div key={p.id || i} data-block-id={`proj-${i}`} className="space-y-0.5 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between font-bold text-slate-900">
                <span>
                  {p.title || p.name}
                  {(() => {
                    const techStr = p.techStack || (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '';
                    return techStr ? <span className="text-slate-500 font-normal ml-1">({techStr})</span> : null;
                  })()}
                </span>
                {(p.link || p.url) && (
                  <span className="font-mono text-slate-500 text-[10px]">{p.link || p.url}</span>
                )}
              </div>
              {Array.isArray(p.bullets) && p.bullets.length > 0 ? (
                <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                  {p.bullets.map((b, idx) => <li key={idx} className="leading-relaxed">{b}</li>)}
                </ul>
              ) : p.description ? (
                <p className="text-slate-700 leading-relaxed">{p.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* 6. EDUCATION */}
      {education.length > 0 && (
        <div className="space-y-2 text-xs">
          {education.some((_, i) => isVisible(`edu-${i}`)) && (
            <h2 className="font-extrabold uppercase tracking-wider text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
              Education & Qualifications
            </h2>
          )}
          {education.map((edu, i) => isVisible(`edu-${i}`) && (
            <div key={edu.id || i} data-block-id={`edu-${i}`} className="space-y-0.5 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between">
                <div>
                  <strong className="text-slate-900">{edu.degree || edu.title}</strong>
                  {(edu.institution || edu.college) ? (
                    <span className="text-slate-700"> — {edu.institution || edu.college}</span>
                  ) : null}
                  {edu.location ? (
                    <span className="text-slate-500 text-[11px]"> ({edu.location})</span>
                  ) : null}
                </div>
                <span className="text-slate-500 text-[11px] font-medium">
                  {edu.period || (edu.startDate && edu.endDate ? `${edu.startDate} – ${edu.endDate}` : (edu.startDate || edu.endDate || edu.year || ''))}
                </span>
              </div>
              {edu.gpa && <div className="text-[11px] text-slate-600 font-semibold">GPA / Score: {edu.gpa}</div>}
              {edu.relevantCoursework && (
                <div className="text-[11px] text-slate-700 font-medium">
                  <strong className="text-slate-900">Relevant Coursework: </strong>{edu.relevantCoursework}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 7. CERTIFICATIONS */}
      {certificates.length > 0 && (
        <div className="space-y-1 text-xs">
          {certificates.some((_, i) => isVisible(`cert-${i}`)) && (
            <h2 className="font-extrabold uppercase tracking-wider text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
              Certifications & Accreditations
            </h2>
          )}
          {certificates.map((cert, i) => isVisible(`cert-${i}`) && (
            <div key={cert.id || i} data-block-id={`cert-${i}`} className="flex justify-between text-slate-700 font-medium pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <span><strong className="text-slate-900">{cert.name}</strong>{cert.issuer ? ` — ${cert.issuer}` : ''}</span>
              <span className="text-slate-500 text-[11px]">{cert.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* 8. ACHIEVEMENTS */}
      {achievements.length > 0 && isVisible('achievements') && (
        <div data-block-id="achievements" className="space-y-1 text-xs pdf-block pdf-keep-together">
          <h2 className="font-extrabold uppercase tracking-wider text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
            Key Achievements & Recognition
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
        <div data-block-id="languages" className="space-y-1 text-xs pdf-block pdf-keep-together">
          <h2 className="font-extrabold uppercase tracking-wider text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
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
