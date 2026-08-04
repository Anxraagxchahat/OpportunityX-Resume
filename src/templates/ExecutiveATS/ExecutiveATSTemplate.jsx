import React from 'react';

export const ExecutiveATSTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {} } = resumeData || {};

  return (
    <div className="space-y-5 text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      <div className="text-center pb-4 border-b-2 border-double" style={{ borderColor: accentHex }}>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{personal.fullName || 'Executive Name'}</h1>
        <p className="text-sm font-bold uppercase tracking-widest mt-1" style={{ color: accentHex }}>{personal.jobTitle || 'Executive Vice President'}</p>
        <p className="text-xs text-slate-600 font-medium mt-1">
          {[personal.email, personal.phone, personal.location, personal.linkedin].filter(Boolean).join(' • ')}
        </p>
      </div>

      {personal.summary && (
        <div className="space-y-1">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b pb-1" style={{ borderColor: accentHex }}>Executive Summary</h2>
          <p className="text-xs leading-relaxed text-slate-700 italic">{personal.summary}</p>
        </div>
      )}

      {experience.length > 0 && (
        <div className="space-y-3.5">
          <h2 className="text-xs font-extrabold uppercase tracking-widest text-slate-900 border-b pb-1" style={{ borderColor: accentHex }}>Leadership & Executive Experience</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-1 text-xs">
              <div className="flex justify-between font-extrabold text-slate-900">
                <span>{exp.role} <span className="font-normal text-slate-600">— {exp.company}</span></span>
                <span className="text-slate-500 font-medium">{exp.startDate} – {exp.endDate}</span>
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
        <div className="space-y-1 text-xs">
          <h2 className="font-extrabold uppercase tracking-widest text-slate-900 border-b pb-1" style={{ borderColor: accentHex }}>Core Competencies</h2>
          <p className="text-slate-700 font-medium">
            {[...(skills.languages || []), ...(skills.frameworks || []), ...(skills.tools || [])].join(' • ')}
          </p>
        </div>
      )}
    </div>
  );
};
