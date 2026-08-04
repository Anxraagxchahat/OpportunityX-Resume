import React from 'react';

export const FullStackTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], projects = [], skills = {} } = resumeData || {};

  return (
    <div className="space-y-4 text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      <div className="pb-3 border-b-2" style={{ borderColor: accentHex }}>
        <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Full Stack Engineer'}</h1>
        <p className="text-xs font-mono font-bold" style={{ color: accentHex }}>{personal.jobTitle || 'Full Stack Developer'}</p>
        <p className="text-[11px] text-slate-500 font-mono mt-1">
          {[personal.email, personal.github, personal.linkedin].filter(Boolean).join(' | ')}
        </p>
      </div>

      {skills && (
        <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
          <h2 className="font-bold text-slate-900 uppercase text-[11px]">Stack Profile</h2>
          {skills.languages?.length > 0 && <div><strong className="text-slate-900">Frontend / Backend Languages:</strong> {skills.languages.join(', ')}</div>}
          {skills.frameworks?.length > 0 && <div><strong className="text-slate-900">Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
        </div>
      )}

      {experience.length > 0 && (
        <div className="space-y-3 text-xs">
          <h2 className="font-bold uppercase text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>Engineering Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.role} @ {exp.company}</span>
                <span className="font-normal text-slate-500">{exp.startDate} – {exp.endDate}</span>
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
    </div>
  );
};
