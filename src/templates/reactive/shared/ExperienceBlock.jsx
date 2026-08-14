import React from 'react';

const renderDateStr = (exp) => {
  if (exp.current || exp.isCurrent) {
    return exp.startDate ? `${exp.startDate} – Present` : 'Present';
  }
  if (exp.startDate && exp.endDate) {
    return `${exp.startDate} – ${exp.endDate}`;
  }
  if (exp.startDate) return exp.startDate;
  if (exp.endDate) return exp.endDate;
  return exp.period || '';
};

export const ExperienceBlock = ({ experience, accentHex, variant = 'default' }) => {
  if (!experience || experience.length === 0) return null;

  if (variant === 'compact') {
    return experience.map((exp) => (
      <div key={exp.id} className="mb-2 last:mb-0">
        <div className="flex justify-between items-baseline text-xs">
          <span className="font-bold text-slate-900">{exp.role || exp.title}</span>
          <span className="text-[10px] text-slate-500">{renderDateStr(exp)}</span>
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
          <span className="font-bold">{exp.role || exp.title}</span>
          <span className="text-slate-400">·</span>
          <span className="font-medium text-slate-600">{exp.company}</span>
          <span className="text-slate-400">·</span>
          <span className="text-[10px] text-slate-500">{renderDateStr(exp)}</span>
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
        <div className="text-[10px] font-bold text-white">{exp.role || exp.title}</div>
        <div className="text-[9px] text-white/70">{exp.company}</div>
        <div className="text-[9px] text-white/50">{renderDateStr(exp)}</div>
      </div>
    ));
  }

  // default
  return experience.map((exp) => (
    <div key={exp.id} className="mb-3 last:mb-0">
      <div className="flex justify-between items-baseline text-xs">
        <span className="font-bold text-slate-900">{exp.role || exp.title} — <span className="font-medium text-slate-600">{exp.company}</span></span>
        <span className="text-[10px] text-slate-500 font-normal">{renderDateStr(exp)}</span>
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
