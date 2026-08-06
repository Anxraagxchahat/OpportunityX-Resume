import React from 'react';

export const EducationBlock = ({ education, accentHex, variant = 'default' }) => {
  if (!education || education.length === 0) return null;

  if (variant === 'compact') {
    return education.map((edu) => (
      <div key={edu.id} className="mb-2 last:mb-0">
        <div className="text-xs font-bold text-slate-900">{edu.degree}</div>
        <div className="text-[10px] text-slate-600">{edu.institution}{edu.location ? ` · ${edu.location}` : ''}</div>
        <div className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate || 'Present'}</div>
        {edu.gpa && <div className="text-[10px] text-slate-600 font-semibold">GPA: {edu.gpa}</div>}
      </div>
    ));
  }

  if (variant === 'sidebar') {
    return education.map((edu) => (
      <div key={edu.id} className="mb-2 last:mb-0">
        <div className="text-[10px] font-bold text-white">{edu.degree}</div>
        <div className="text-[9px] text-white/70">{edu.institution}</div>
        <div className="text-[9px] text-white/50">{edu.startDate} – {edu.endDate || 'Present'}</div>
      </div>
    ));
  }

  if (variant === 'inline') {
    return education.map((edu) => (
      <div key={edu.id} className="mb-2 last:mb-0">
        <div className="flex items-baseline gap-2 text-xs text-slate-800">
          <span className="font-bold">{edu.degree}</span>
          <span className="text-slate-400">·</span>
          <span className="font-medium text-slate-600">{edu.institution}</span>
          <span className="text-slate-400">·</span>
          <span className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate || 'Present'}</span>
        </div>
        {edu.gpa && <div className="text-[10px] text-slate-600 font-semibold pl-0.5">GPA / Score: {edu.gpa}</div>}
        {edu.relevantCoursework && (
          <div className="text-[10px] text-slate-600 pl-0.5"><strong>Coursework:</strong> {edu.relevantCoursework}</div>
        )}
      </div>
    ));
  }

  // default
  return education.map((edu) => (
    <div key={edu.id} className="mb-2.5 last:mb-0">
      <div className="flex justify-between text-xs">
        <span className="font-bold text-slate-900">{edu.degree} — <span className="font-normal text-slate-600">{edu.institution}</span></span>
        <span className="text-[10px] text-slate-500 font-semibold">{edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}</span>
      </div>
      {edu.gpa && <div className="text-[10px] font-semibold text-slate-600">GPA / Score: {edu.gpa}</div>}
      {edu.relevantCoursework && (
        <div className="text-[10px] text-slate-700">
          <strong className="text-slate-900">Relevant Coursework: </strong>{edu.relevantCoursework}
        </div>
      )}
    </div>
  ));
};
