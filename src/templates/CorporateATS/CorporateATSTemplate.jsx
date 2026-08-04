import React from 'react';

export const CorporateATSTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {} } = resumeData || {};

  return (
    <div className="space-y-4 text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      <div className="pb-3 border-b-2" style={{ borderColor: accentHex }}>
        <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Candidate Name'}</h1>
        <div className="flex justify-between items-center text-xs mt-1">
          <span className="font-bold" style={{ color: accentHex }}>{personal.jobTitle || 'Target Role'}</span>
          <span className="text-slate-500 font-mono">{personal.location}</span>
        </div>
        <div className="text-[11px] text-slate-600 mt-1 flex gap-3">
          {personal.email && <span>Email: {personal.email}</span>}
          {personal.phone && <span>Phone: {personal.phone}</span>}
          {personal.linkedin && <span>LinkedIn: {personal.linkedin}</span>}
        </div>
      </div>

      {experience.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b pb-1" style={{ borderColor: accentHex }}>Professional Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="text-xs space-y-1">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.company} — {exp.role}</span>
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

      {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
        <div className="text-xs space-y-1">
          <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b pb-1" style={{ borderColor: accentHex }}>Key Skills</h2>
          <div className="space-y-0.5">
            {skills.languages?.length > 0 && <div><strong className="text-slate-900">Technical Languages:</strong> {skills.languages.join(', ')}</div>}
            {skills.frameworks?.length > 0 && <div><strong className="text-slate-900">Frameworks & Libraries:</strong> {skills.frameworks.join(', ')}</div>}
          </div>
        </div>
      )}
    </div>
  );
};
