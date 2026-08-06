import React from 'react';

export const ExperienceBlock = ({ experience, accentHex, variant = 'default' }) => {
  if (!experience || experience.length === 0) return null;

  if (variant === 'compact') {
    return experience.map((exp) => (
      <div key={exp.id} className="mb-2 last:mb-0">
        <div className="flex justify-between items-baseline text-xs">
          <span className="font-bold text-slate-900">{exp.role}</span>
          <span className="text-[10px] text-slate-500">{exp.startDate} – {exp.endDate || 'Present'}</span>
        </div>
        <div className="text-[10px] text-slate-600 font-medium">{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
        {exp.bullets && (
          <ul className="list-disc pl-3.5 text-[10px] text-slate-700 mt-0.5 space-y-0.5">
            {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        )}
      </div>
    ));
  }

  if (variant === 'inline-header') {
    return experience.map((exp) => (
      <div key={exp.id} className="mb-2.5 last:mb-0">
        <div className="flex items-baseline gap-2 text-xs text-slate-800">
          <span className="font-bold">{exp.role}</span>
          <span className="text-slate-400">·</span>
          <span className="font-medium text-slate-600">{exp.company}</span>
          <span className="text-slate-400">·</span>
          <span className="text-[10px] text-slate-500">{exp.startDate} – {exp.endDate || 'Present'}</span>
        </div>
        {exp.bullets && (
          <ul className="list-disc pl-3.5 text-[10px] text-slate-700 mt-0.5 space-y-0.5">
            {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        )}
      </div>
    ));
  }

  if (variant === 'sidebar') {
    return experience.map((exp) => (
      <div key={exp.id} className="mb-2 last:mb-0">
        <div className="text-[10px] font-bold text-white">{exp.role}</div>
        <div className="text-[9px] text-white/70">{exp.company}</div>
        <div className="text-[9px] text-white/50">{exp.startDate} – {exp.endDate || 'Present'}</div>
      </div>
    ));
  }

  // default
  return experience.map((exp) => (
    <div key={exp.id} className="mb-3 last:mb-0">
      <div className="flex justify-between items-baseline text-xs">
        <span className="font-bold text-slate-900">{exp.role} — <span className="font-medium text-slate-600">{exp.company}</span></span>
        <span className="text-[10px] text-slate-500 font-normal">{exp.startDate} {exp.endDate ? `– ${exp.endDate}` : ''}</span>
      </div>
      {exp.location && <div className="text-[10px] text-slate-500">{exp.location}</div>}
      {exp.bullets && (
        <ul className="list-disc pl-4 text-[10px] text-slate-700 mt-1 space-y-0.5">
          {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </div>
  ));
};
