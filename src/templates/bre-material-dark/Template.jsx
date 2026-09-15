import React from 'react';
import './styles.css';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';
import { SocialLinksBlock } from '../reactive/shared/SocialLinksBlock';
import { shouldRenderBlock } from '../../utils/paginationEngine';

export const BREMaterialDarkTemplate = ({ resumeData, accentHex, fontFamily, visibleBlockIds = null }) => {
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

  const accentColor = accentHex || '#10b981';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;
  const showPhoto = Boolean(assets?.profilePhoto && assets?.photoPosition !== 'hidden');

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  return (
    <div className="bre-material-dark-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif`, color: '#e0e0e0', backgroundColor: '#121212' }}>
      {/* 1. Header Card */}
      {isVisible('header') && (
        <div data-block-id="header" className="bre-material-card flex items-center justify-between" style={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d' }}>
          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight" style={{ color: '#ffffff' }}>{personal.fullName || 'Your Name'}</h1>
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: accentColor }}>
              {personal.jobTitle || personal.targetRole || 'Job Title'}
            </p>
            <div className="mt-2 text-[11px] flex flex-wrap gap-x-3 gap-y-1" style={{ color: '#9ca3af' }}>
              {personal.email && <span style={{ color: '#cbd5e1' }}>{personal.email}</span>}
              {personal.phone && <span style={{ color: '#cbd5e1' }}>• {personal.phone}</span>}
              {personal.location && <span style={{ color: '#cbd5e1' }}>• {personal.location}</span>}
              {personal.github && (
                <span style={{ color: '#38bdf8' }}>• {personal.github}</span>
              )}
              {personal.linkedin && (
                <span style={{ color: '#38bdf8' }}>• {personal.linkedin}</span>
              )}
              {personal.website && (
                <span style={{ color: '#38bdf8' }}>• {personal.website}</span>
              )}
            </div>
          </div>
          {showPhoto && (
            <img
              src={photoSrc}
              alt="Profile"
              className="w-16 h-16 rounded-full object-cover border-2 shadow-md flex-shrink-0 ml-4"
              style={{ borderColor: accentColor }}
            />
          )}
        </div>
      )}

      {/* 2. About / Summary */}
      {personal.summary && isVisible('summary') && (
        <div data-block-id="summary" className="bre-material-card pdf-block pdf-keep-together" style={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d' }}>
          <div className="bre-material-heading" style={{ color: accentColor, borderColor: '#333333' }}>About</div>
          <p className="text-[11px] leading-relaxed" style={{ color: '#d1d5db' }}>{personal.summary}</p>
        </div>
      )}

      {/* 3. Work Experience */}
      {experience.length > 0 && experience.some((_, i) => isVisible(`exp-${i}`)) && (
        <div className="bre-material-card" style={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d' }}>
          <div className="bre-material-heading" style={{ color: accentColor, borderColor: '#333333' }}>Work Experience</div>
          {experience.map((exp, i) => isVisible(`exp-${i}`) && (
            <div key={exp.id || i} data-block-id={`exp-${i}`} className="mb-3 last:mb-0 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between items-baseline text-xs font-bold">
                <span style={{ color: '#ffffff' }}>
                  {exp.role || exp.title} <span style={{ color: accentColor }}>@ {exp.company}</span>
                </span>
                <span className="text-[10px] font-normal" style={{ color: '#9ca3af' }}>
                  {exp.startDate} – {exp.endDate || (exp.current || exp.isCurrent ? 'Present' : '')}
                </span>
              </div>
              {Array.isArray(exp.bullets) && exp.bullets.length > 0 ? (
                <ul className="list-disc pl-4 text-[11px] mt-1 space-y-0.5" style={{ color: '#d1d5db' }}>
                  {exp.bullets.map((b, idx) => <li key={idx} className="leading-relaxed">{b}</li>)}
                </ul>
              ) : exp.description ? (
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: '#d1d5db' }}>{exp.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* 4. Key Projects */}
      {projects.length > 0 && projects.some((_, i) => isVisible(`proj-${i}`)) && (
        <div className="bre-material-card" style={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d' }}>
          <div className="bre-material-heading" style={{ color: accentColor, borderColor: '#333333' }}>Key Projects</div>
          {projects.map((p, i) => isVisible(`proj-${i}`) && (
            <div key={p.id || i} data-block-id={`proj-${i}`} className="mb-3 last:mb-0 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="text-xs font-bold" style={{ color: '#ffffff' }}>
                {p.name || p.title}{' '}
                {(() => {
                  const tech = p.techStack || (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '';
                  return tech ? <span className="font-normal text-[11px]" style={{ color: '#9ca3af' }}>({tech})</span> : null;
                })()}
              </div>
              {(p.link || p.url) && (
                <div className="text-[10px] font-mono mt-0.5" style={{ color: '#38bdf8' }}>
                  {p.link || p.url}
                </div>
              )}
              {Array.isArray(p.bullets) && p.bullets.filter(Boolean).length > 0 ? (
                <ul className="list-disc pl-4 text-[11px] mt-1 space-y-0.5" style={{ color: '#d1d5db' }}>
                  {p.bullets.filter(Boolean).map((b, idx) => <li key={idx} className="leading-relaxed">{b}</li>)}
                </ul>
              ) : p.description ? (
                <p className="text-[11px] mt-1 leading-relaxed" style={{ color: '#d1d5db' }}>{p.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* 5. Technical Skills */}
      {skills && isVisible('skills') && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0 || skills.softSkills?.length > 0) && (
        <div data-block-id="skills" className="bre-material-card pdf-block pdf-keep-together" style={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d' }}>
          <div className="bre-material-heading" style={{ color: accentColor, borderColor: '#333333' }}>Technical Skills</div>
          <div className="flex flex-wrap gap-1.5 items-center">
            {[...(skills.languages || []), ...(skills.frameworks || []), ...(skills.tools || []), ...(skills.softSkills || [])].map((s, i) => (
              <span
                key={i}
                className="inline-block pt-0 pb-[3.5px] px-2 text-[9px] font-semibold leading-tight rounded whitespace-nowrap"
                style={{
                  backgroundColor: '#262626',
                  color: '#f3f4f6',
                  border: '1px solid #404040'
                }}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 6. Education */}
      {education.length > 0 && education.some((_, i) => isVisible(`edu-${i}`)) && (
        <div className="bre-material-card" style={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d' }}>
          <div className="bre-material-heading" style={{ color: accentColor, borderColor: '#333333' }}>Education</div>
          {education.map((edu, i) => isVisible(`edu-${i}`) && (
            <div key={edu.id || i} data-block-id={`edu-${i}`} className="mb-2 last:mb-0 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between items-baseline text-xs font-bold">
                <span style={{ color: '#ffffff' }}>
                  {edu.degree || edu.title} — <span className="font-normal" style={{ color: '#d1d5db' }}>{edu.institution || edu.college}</span>
                </span>
                <span className="text-[10px] font-normal" style={{ color: '#9ca3af' }}>
                  {edu.startDate} – {edu.endDate || (edu.current ? 'Present' : '')}
                </span>
              </div>
              {edu.gpa && <div className="text-[10px] font-medium mt-0.5" style={{ color: '#9ca3af' }}>CGPA / Score: {edu.gpa}</div>}
              {edu.relevantCoursework && (
                <div className="text-[10px] mt-0.5" style={{ color: '#d1d5db' }}>
                  <strong style={{ color: '#ffffff' }}>Relevant Coursework: </strong>{edu.relevantCoursework}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 7. Certifications */}
      {certificates.length > 0 && certificates.some((_, i) => isVisible(`cert-${i}`)) && (
        <div className="bre-material-card" style={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d' }}>
          <div className="bre-material-heading" style={{ color: accentColor, borderColor: '#333333' }}>Certifications</div>
          {certificates.map((cert, i) => isVisible(`cert-${i}`) && (
            <div key={cert.id || i} data-block-id={`cert-${i}`} className="mb-2 last:mb-0 text-xs pdf-block pdf-item">
              <span className="font-bold" style={{ color: '#ffffff' }}>{cert.name}</span>
              {cert.issuer && <span style={{ color: '#9ca3af' }}> — {cert.issuer}</span>}
              {cert.date && <span className="text-[10px] ml-2" style={{ color: '#6b7280' }}>({cert.date})</span>}
            </div>
          ))}
        </div>
      )}

      {/* 8. Achievements */}
      {achievements.length > 0 && achievements.some((_, i) => isVisible(`achieve-${i}`)) && (
        <div className="bre-material-card" style={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d' }}>
          <div className="bre-material-heading" style={{ color: accentColor, borderColor: '#333333' }}>Achievements</div>
          {achievements.map((ach, i) => isVisible(`achieve-${i}`) && (
            <div key={ach.id || i} data-block-id={`achieve-${i}`} className="mb-2 last:mb-0 text-xs pdf-block pdf-item">
              <div className="font-bold" style={{ color: '#ffffff' }}>{ach.title}</div>
              {ach.description && <p className="text-[11px] mt-0.5" style={{ color: '#d1d5db' }}>{ach.description}</p>}
            </div>
          ))}
        </div>
      )}

      {/* 9. Languages */}
      {languages.length > 0 && isVisible('languages') && (
        <div data-block-id="languages" className="bre-material-card pdf-block pdf-keep-together" style={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d' }}>
          <div className="bre-material-heading" style={{ color: accentColor, borderColor: '#333333' }}>Languages</div>
          <div className="flex flex-wrap gap-3 text-xs">
            {languages.map((l, i) => (
              <span key={i} style={{ color: '#d1d5db' }}>
                <strong style={{ color: '#ffffff' }}>{l.name}</strong> {l.proficiency ? `(${l.proficiency})` : ''}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 10. Custom Sections */}
      {customSections.length > 0 && customSections.map((sec, secIdx) => {
        const secId = `custom-sec-${secIdx}`;
        if (!isVisible(secId)) return null;
        return (
          <div key={sec.id || secIdx} data-block-id={secId} className="bre-material-card pdf-block pdf-item" style={{ backgroundColor: '#1e1e1e', borderColor: '#2d2d2d' }}>
            <div className="bre-material-heading" style={{ color: accentColor, borderColor: '#333333' }}>{sec.title}</div>
            {Array.isArray(sec.items) && sec.items.map((item, itemIdx) => (
              <div key={item.id || itemIdx} className="mb-2 last:mb-0 text-xs">
                {item.name && <div className="font-bold" style={{ color: '#ffffff' }}>{item.name}</div>}
                {item.description && <p className="text-[11px] mt-0.5" style={{ color: '#d1d5db' }}>{item.description}</p>}
              </div>
            ))}
          </div>
        );
      })}

      {/* 11. Social / Profiles */}
      {isVisible('profiles') && (
        <SocialLinksBlock personal={personal} accentHex={accentColor} visibleBlockIds={visibleBlockIds} />
      )}
    </div>
  );
};

