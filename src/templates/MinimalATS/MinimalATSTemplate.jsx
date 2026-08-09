import React from 'react';
import { TemplateSkills } from '../../components/template/TemplateSkills';
import { CustomSectionsBlock } from '../reactive/shared/MiscBlocks';

export const MinimalATSTemplate = ({ resumeData, accentHex = '#000000', fontFamily = 'Inter' }) => {
  const {
    personal = {},
    experience = [],
    projects = [],
    skills = {},
    education = [],
    certificates = [],
    achievements = [],
    languages = []
  } = resumeData || {};

  return (
    <div className="space-y-4 text-slate-800 leading-normal" style={{ fontFamily: `'${fontFamily}', sans-serif` }}>
      
      {/* 1. HEADER */}
      <div className="text-center pb-2 border-b border-slate-300">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{personal.fullName || 'Your Name'}</h1>
        {personal.jobTitle && <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide my-0.5">{personal.jobTitle}</p>}
        <p className="text-[11px] text-slate-600 font-mono flex flex-wrap justify-center gap-2">
          {[personal.email, personal.phone, personal.location, personal.website, personal.github, personal.linkedin].filter(Boolean).join(' | ')}
        </p>
      </div>

      {/* 2. SUMMARY */}
      {personal.summary && (
        <div className="text-xs leading-relaxed text-slate-700 font-medium pdf-block pdf-keep-together">
          <p>{personal.summary}</p>
        </div>
      )}

      {/* 3. EXPERIENCE */}
      {experience.length > 0 && (
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5 pdf-section-header" style={{ borderColor: accentHex }}>
            Experience
          </h2>
          {experience.map((exp) => (
            <div key={exp.id || exp.role} className="text-xs space-y-1 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.role}, {exp.company}</span>
                <span className="font-normal text-slate-500 text-[11px]">{exp.period || `${exp.startDate || ''} ${exp.endDate ? `– ${exp.endDate}` : ''}`}</span>
              </div>
              {Array.isArray(exp.bullets) && exp.bullets.length > 0 ? (
                <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                  {exp.bullets.map((b, i) => <li key={i} className="leading-relaxed">{b}</li>)}
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
          <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5 pdf-section-header" style={{ borderColor: accentHex }}>
            Projects
          </h2>
          {projects.map((p) => (
            <div key={p.id || p.title} className="space-y-0.5 pdf-block pdf-item pdf-keep-together break-inside-avoid">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{p.title || p.name}</span>
                {p.link && <span className="font-mono text-slate-500 text-[10px]">{p.link}</span>}
              </div>
              {Array.isArray(p.bullets) && p.bullets.length > 0 ? (
                <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                  {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              ) : p.description ? (
                <p className="text-slate-700">{p.description}</p>
              ) : null}
            </div>
          ))}
        </div>
      )}

      {/* 5. SKILLS */}
      {skills && (
        <div className="space-y-1 text-xs pdf-block pdf-skills-group pdf-keep-together">
          <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5 pdf-section-header" style={{ borderColor: accentHex }}>
            Technical Skills
          </h2>
          <TemplateSkills skills={skills} accentHex={accentHex} />
        </div>
      )}

      {/* 6. EDUCATION */}
      {education.length > 0 && (
        <div className="space-y-2 text-xs">
          <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
            Education
          </h2>
          {education.map((edu) => (
            <div key={edu.id || edu.degree} className="space-y-0.5">
              <div className="flex justify-between">
                <div><strong className="text-slate-900">{edu.degree}</strong> — {edu.institution || edu.college}</div>
                <span className="text-slate-500 text-[11px]">{edu.period || `${edu.startDate || ''} ${edu.endDate ? `– ${edu.endDate}` : ''}`}</span>
              </div>
              {edu.gpa && <div className="text-[11px] text-slate-600 font-medium">GPA: {edu.gpa}</div>}
            </div>
          ))}
        </div>
      )}

      {/* 7. CERTIFICATES */}
      {certificates.length > 0 && (
        <div className="space-y-1 text-xs">
          <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
            Certifications
          </h2>
          {certificates.map((cert) => (
            <div key={cert.id || cert.name} className="flex justify-between text-slate-700 font-medium">
              <span><strong className="text-slate-900">{cert.name}</strong> — {cert.issuer}</span>
              <span className="text-slate-500 text-[11px]">{cert.date}</span>
            </div>
          ))}
        </div>
      )}

      {/* 8. ACHIEVEMENTS */}
      {achievements.length > 0 && (
        <div className="space-y-1 text-xs">
          <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
            Achievements
          </h2>
          <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
            {achievements.map((a) => (
              <li key={a.id || a.title}><strong>{a.title}: </strong><span>{a.description}</span></li>
            ))}
          </ul>
        </div>
      )}

      {/* 9. LANGUAGES */}
      {languages.length > 0 && (
        <div className="space-y-1 text-xs">
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
        <CustomSectionsBlock customSections={customSections} accentHex={accentHex} />
      )}
    </div>
  );
};
