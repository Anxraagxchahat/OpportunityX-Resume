import React from 'react';

export const TemplateExperience = ({ experience = [] }) => {
  if (!experience || experience.length === 0) return null;

  return (
    <div className="space-y-3">
      {experience.map((exp) => (
        <div key={exp.id} className="space-y-1 text-xs break-inside-avoid">
          <div className="flex justify-between font-bold text-slate-900">
            <span>{exp.role} <span className="font-normal text-slate-600">— {exp.company}</span></span>
            <span className="text-slate-500 font-semibold">{exp.startDate} – {exp.endDate}</span>
          </div>
          {exp.bullets && (
            <ul className="list-disc pl-4 text-slate-700 space-y-0.5">
              {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};
