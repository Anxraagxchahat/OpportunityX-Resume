import React from 'react';
import { TemplateSkills } from '../../components/template/TemplateSkills';
import { CustomSectionsBlock } from '../reactive/shared/MiscBlocks';
import { ProfilePhoto } from '../reactive/shared/ProfilePhoto';
import { SocialLinksBlock } from '../reactive/shared/SocialLinksBlock';

export const ModernATSTemplate = ({ resumeData, accentHex = '#F97316', fontFamily = 'Inter' }) => {
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

  const showPhoto = assets?.profilePhoto && assets?.photoPosition !== 'hidden';

  const headerContactItems = [
    personal.email,
    personal.phone,
    personal.location,
    personal.linkedin
  ].filter(Boolean);

  return (
    <div className="space-y-4 text-slate-800 leading-normal text-xs" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      
      {/* 1. HEADER */}
      <div className="pb-3 border-b-2 flex justify-between items-start gap-4" style={{ borderColor: accentHex }}>
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{personal.fullName || 'Your Name'}</h1>
          {personal.jobTitle && <p className="text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: accentHex }}>{personal.jobTitle}</p>}
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

      {/* 2. SUMMARY */}
      {personal.summary && (
        <div className="space-y-1 pdf-block pdf-keep-together">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b pdf-section-header" style={{ borderColor: `${accentHex}40` }}>
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed text-slate-700 font-medium">{personal.summary}</p>
        </div>
      )}

      {/* 3. EXPERIENCE */}
      {experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b pdf-section-header" style={{ borderColor: accentHex }}>
            Work Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id || exp.role} className="space-y-1 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
                <span>{exp.role} <span className="font-semibold text-slate-600">— {exp.company}</span></span>
                <span className="text-slate-500 font-medium text-[11px]">{exp.period || `${exp.startDate || ''} ${exp.endDate ? `– ${exp.endDate}` : ''}`}</span>
              </div>
              {Array.isArray(exp.bullets) && exp.bullets.length > 0 ? (
                <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
                  {exp.bullets.map((b, i) => <li key={i} className="leading-relaxed">{b}</li>)}
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
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b pdf-section-header" style={{ borderColor: accentHex }}>
            Technical Projects
          </h2>
          {projects.map((p) => (
            <div key={p.id || p.title} className="text-xs space-y-1 pdf-block pdf-item pdf-keep-together break-inside-avoid">
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
      {skills && (
        <div className="space-y-1 pdf-block pdf-skills-group pdf-keep-together">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b mb-1.5 pdf-section-header" style={{ borderColor: accentHex }}>
            Skills & Competencies
          </h2>
          <TemplateSkills skills={skills} accentHex={accentHex} />
        </div>
      )}

      {/* 6. EDUCATION */}
      {education.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b pdf-section-header" style={{ borderColor: accentHex }}>
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id || edu.degree} className="text-xs space-y-0.5 pdf-block pdf-item pdf-keep-together break-inside-avoid">
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
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b" style={{ borderColor: accentHex }}>
            Certifications
          </h2>
          <div className="space-y-1 text-xs">
            {certificates.map((cert) => (
              <div key={cert.id || cert.name} className="flex justify-between text-slate-700 font-medium">
                <span><strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}</span>
                <span className="text-slate-500 text-[11px]">{cert.date}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 8. ACHIEVEMENTS */}
      {achievements.length > 0 && (
        <div className="space-y-1.5">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b" style={{ borderColor: accentHex }}>
            Honors & Achievements
          </h2>
          <ul className="list-disc pl-4 text-xs text-slate-700 space-y-1">
            {achievements.map((ach) => (
              <li key={ach.id || ach.title}>
                <strong className="text-slate-900">{ach.title}: </strong>
                <span>{ach.description}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 9. LANGUAGES */}
      {languages.length > 0 && (
        <div className="space-y-1">
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
        <CustomSectionsBlock customSections={customSections} accentHex={accentHex} />
      )}

      {/* 11. SOCIAL & PORTFOLIO LINKS */}
      <SocialLinksBlock personal={personal} accentHex={accentHex} />
    </div>
  );
};
