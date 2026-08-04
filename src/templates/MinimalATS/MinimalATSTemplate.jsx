import React from 'react';

export const MinimalATSTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {} } = resumeData || {};

  return (
    <div className="space-y-4 text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      <div className="text-center pb-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">{personal.fullName || 'Your Name'}</h1>
        <p className="text-xs font-medium text-slate-600 mb-1">{personal.jobTitle || 'Job Title'}</p>
        <p className="text-[11px] text-slate-500 font-mono">
          {[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(' | ')}
        </p>
      </div>

      {personal.summary && (
        <div className="text-xs leading-relaxed text-slate-700">
          <p>{personal.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="space-y-2.5">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="text-xs space-y-0.5">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.role}, {exp.company}</span>
                <span className="font-normal text-slate-500">{exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}</span>
              </div>
              {exp.bullets && (
                <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
                  {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
        <div className="text-xs space-y-1">
          <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>Technical Skills</h2>
          <div className="space-y-0.5">
            {skills.languages?.length > 0 && <div><span className="font-semibold">Languages:</span> {skills.languages.join(', ')}</div>}
            {skills.frameworks?.length > 0 && <div><span className="font-semibold">Frameworks & Libraries:</span> {skills.frameworks.join(', ')}</div>}
            {skills.tools?.length > 0 && <div><span className="font-semibold">Tools & Infrastructure:</span> {skills.tools.join(', ')}</div>}
          </div>
        </div>
      )}

      {education.length > 0 && (
        <div className="space-y-2 text-xs">
          <h2 className="font-bold uppercase tracking-widest text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>Education</h2>
          {education.map((edu) => (
            <div key={edu.id} className="space-y-0.5">
              <div className="flex justify-between">
                <div><strong className="text-slate-900">{edu.degree}</strong> — {edu.institution}</div>
                <span className="text-slate-500">{edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}</span>
              </div>
              {edu.gpa && <div className="text-[11px] text-slate-600 font-medium">GPA: {edu.gpa}</div>}
              {edu.relevantCoursework && (
                <div className="text-[11px] text-slate-700">
                  <strong>Relevant Coursework: </strong>{edu.relevantCoursework}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
