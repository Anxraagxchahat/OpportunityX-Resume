import React from 'react';

export const TemplateEducation = ({ education = [], accentHex = '#F97316' }) => {
  if (!education || education.length === 0) return null;

  return (
    <div className="space-y-3">
      {education.map((edu) => (
        <div key={edu.id} className="space-y-0.5 text-xs pdf-block pdf-item pdf-keep-together break-inside-avoid">
          <div className="flex justify-between font-bold text-slate-900">
            <span>{edu.degree} <span className="font-normal text-slate-600">— {edu.institution}</span></span>
            <span className="text-slate-500 font-semibold">{edu.startDate} {edu.endDate ? `– ${edu.endDate}` : ''}</span>
          </div>
          {edu.gpa && <div className="text-[11px] text-slate-600 font-medium">GPA / Score: {edu.gpa}</div>}
          {edu.relevantCoursework && (
            <div className="text-[11px] text-slate-700 pt-0.5">
              <strong className="text-slate-900">Relevant Coursework: </strong>
              <span>{edu.relevantCoursework}</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
