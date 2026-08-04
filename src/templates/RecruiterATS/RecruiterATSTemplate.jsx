import React from 'react';

export const RecruiterATSTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {} } = resumeData || {};

  return (
    <div className="space-y-4 text-slate-800" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      <div className="p-3 bg-slate-100 rounded border-l-4" style={{ borderColor: accentHex }}>
        <h1 className="text-2xl font-black text-slate-900">{personal.fullName || 'Candidate Name'}</h1>
        <p className="text-xs font-bold text-slate-700">{personal.jobTitle || 'Role'}</p>
        <p className="text-[11px] text-slate-500 font-mono mt-1">
          {[personal.email, personal.phone, personal.location].filter(Boolean).join(' | ')}
        </p>
      </div>

      {experience.length > 0 && (
        <div className="space-y-2 text-xs">
          <h2 className="font-extrabold uppercase tracking-wider text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>Career History</h2>
          {experience.map((exp) => (
            <div key={exp.id} className="space-y-0.5">
              <div className="flex justify-between font-bold text-slate-900">
                <span>{exp.role} ({exp.company})</span>
                <span className="text-slate-500 font-normal">{exp.startDate} – {exp.endDate}</span>
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
