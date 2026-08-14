import React from 'react';

const renderEduDateStr = (edu) => {
  if (edu.startDate && edu.endDate) {
    return `${edu.startDate} – ${edu.endDate}`;
  }
  if (edu.startDate) return edu.startDate;
  if (edu.endDate) return edu.endDate;
  return edu.period || '';
};

export const EducationBlock = ({ education, accentHex, variant = 'default' }) => {
  if (!education || education.length === 0) return null;

  if (variant === 'compact') {
    return education.map((edu) => (
      <div key={edu.id} className="mb-2 last:mb-0">
        <div className="text-xs font-bold text-slate-900">{edu.degree || edu.title}</div>
        <div className="text-[10px] text-slate-600">{edu.institution || edu.college}{edu.location ? ` · ${edu.location}` : ''}</div>
        <div className="text-[10px] text-slate-500">{renderEduDateStr(edu)}</div>
        {edu.gpa && <div className="text-[10px] text-slate-600 font-semibold">GPA: {edu.gpa}</div>}
        {edu.relevantCoursework && (
          <div className="text-[10px] text-slate-700 mt-0.5">
            <strong className="text-slate-900">Relevant Coursework: </strong>{edu.relevantCoursework}
          </div>
        )}
      </div>
    ));
  }

  if (variant === 'sidebar') {
    return education.map((edu) => (
      <div key={edu.id} className="mb-2 last:mb-0">
        <div className="text-[10px] font-bold text-white">{edu.degree || edu.title}</div>
        <div className="text-[9px] text-white/70">{edu.institution || edu.college}</div>
        <div className="text-[9px] text-white/50">{renderEduDateStr(edu)}</div>
        {edu.relevantCoursework && (
          <div className="text-[9px] text-white/80 mt-0.5">
            <strong>Coursework: </strong>{edu.relevantCoursework}
          </div>
        )}
      </div>
    ));
  }

  if (variant === 'inline') {
    return education.map((edu) => (
      <div key={edu.id} className="mb-2 last:mb-0">
        <div className="flex items-baseline gap-2 text-xs text-slate-800">
          <span className="font-bold">{edu.degree || edu.title}</span>
          <span className="text-slate-400">·</span>
          <span className="font-medium text-slate-600">{edu.institution || edu.college}</span>
          <span className="text-slate-400">·</span>
          <span className="text-[10px] text-slate-500">{renderEduDateStr(edu)}</span>
        </div>
        {edu.gpa && <div className="text-[10px] text-slate-600 font-semibold pl-0.5">GPA / Score: {edu.gpa}</div>}
        {edu.relevantCoursework && (
          <div className="text-[10px] text-slate-600 pl-0.5 mt-0.5"><strong>Relevant Coursework: </strong>{edu.relevantCoursework}</div>
        )}
      </div>
    ));
  }

  // default
  return education.map((edu) => (
    <div key={edu.id} className="mb-2.5 last:mb-0">
      <div className="flex justify-between text-xs">
        <span className="font-bold text-slate-900">{edu.degree || edu.title} — <span className="font-normal text-slate-600">{edu.institution || edu.college}</span></span>
        <span className="text-[10px] text-slate-500 font-semibold">{renderEduDateStr(edu)}</span>
      </div>
      {edu.gpa && <div className="text-[10px] font-semibold text-slate-600">GPA / Score: {edu.gpa}</div>}
      {edu.relevantCoursework && (
        <div className="text-[10px] text-slate-700 mt-0.5">
          <strong className="text-slate-900">Relevant Coursework: </strong>{edu.relevantCoursework}
        </div>
      )}
    </div>
  ));
};
