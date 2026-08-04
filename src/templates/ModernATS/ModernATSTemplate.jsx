import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

export const ModernATSTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {} } = resumeData || {};

  return (
    <div className="space-y-5 text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      <div className="pb-4 border-b-2" style={{ borderColor: accentHex }}>
        <h1 className="text-3xl font-black text-slate-900 mb-1">{personal.fullName || 'Your Name'}</h1>
        <p className="text-base font-bold mb-2" style={{ color: accentHex }}>{personal.jobTitle || 'Job Title'}</p>
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.location && <span>• {personal.location}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
        </div>
      </div>

      {personal.summary && (
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider mb-1" style={{ color: accentHex }}>Professional Summary</h2>
          <p className="text-xs leading-relaxed text-slate-700">{personal.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b" style={{ color: accentHex, borderColor: accentHex }}>Work Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-900">
                <span>{exp.role} — {exp.company}</span>
                <span className="text-slate-500 font-normal">{exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}</span>
              </div>
              {exp.bullets && (
                <ul className="list-disc pl-4 text-xs text-slate-700 space-y-0.5">
                  {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {projects.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b" style={{ color: accentHex, borderColor: accentHex }}>Technical Projects</h2>
          {projects.map((p) => (
            <div key={p.id} className="text-xs space-y-0.5">
              <div className="font-bold text-slate-900">{p.name} {p.techStack && <span className="text-slate-500 font-normal">({p.techStack})</span>}</div>
              <p className="text-slate-700">{p.description}</p>
            </div>
          ))}
        </div>
      )}

      {education.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b" style={{ color: accentHex, borderColor: accentHex }}>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="text-xs space-y-0.5">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{edu.degree} — <span className="font-normal text-slate-600">{edu.institution}</span></span>
                <span className="text-slate-500 font-semibold">{edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}</span>
              </div>
              {edu.gpa && <div className="text-[11px] font-semibold text-slate-600">GPA / Score: {edu.gpa}</div>}
              {edu.relevantCoursework && (
                <div className="text-[11px] text-slate-700">
                  <strong className="text-slate-900">Relevant Coursework: </strong>
                  <span>{edu.relevantCoursework}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
        <div>
          <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b mb-1.5" style={{ color: accentHex, borderColor: accentHex }}>Skills</h2>
          <div className="text-xs space-y-1">
            {skills.languages?.length > 0 && <div><strong className="text-slate-900">Languages:</strong> {skills.languages.join(', ')}</div>}
            {skills.frameworks?.length > 0 && <div><strong className="text-slate-900">Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
            {skills.tools?.length > 0 && <div><strong className="text-slate-900">Tools & Technologies:</strong> {skills.tools.join(', ')}</div>}
          </div>
        </div>
      )}
    </div>
  );
};
