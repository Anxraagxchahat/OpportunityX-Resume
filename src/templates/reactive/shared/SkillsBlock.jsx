import React from 'react';

export const SkillsBlock = ({ skills, accentHex, variant = 'default' }) => {
  if (!skills) return null;
  const hasSkills = skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0 || skills.softSkills?.length > 0;
  if (!hasSkills) return null;

  if (variant === 'tags') {
    const allSkills = [
      ...(skills.languages || []),
      ...(skills.frameworks || []),
      ...(skills.tools || [])
    ];
    return (
      <div className="flex flex-wrap gap-1">
        {allSkills.map((s, i) => (
          <span key={i} className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-100 text-slate-700 border border-slate-200">
            {s}
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'sidebar-tags') {
    const allSkills = [
      ...(skills.languages || []),
      ...(skills.frameworks || []),
      ...(skills.tools || [])
    ];
    return (
      <div className="flex flex-wrap gap-1">
        {allSkills.map((s, i) => (
          <span key={i} className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-white/15 text-white/90 border border-white/20">
            {s}
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="space-y-1 text-[10px] text-white/80">
        {skills.languages?.length > 0 && <div><strong className="text-white">Languages:</strong> {skills.languages.join(', ')}</div>}
        {skills.frameworks?.length > 0 && <div><strong className="text-white">Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
        {skills.tools?.length > 0 && <div><strong className="text-white">Tools:</strong> {skills.tools.join(', ')}</div>}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="text-[10px] text-slate-700 space-y-0.5">
        {skills.languages?.length > 0 && <div><strong className="text-slate-900">Languages:</strong> {skills.languages.join(' · ')}</div>}
        {skills.frameworks?.length > 0 && <div><strong className="text-slate-900">Frameworks:</strong> {skills.frameworks.join(' · ')}</div>}
        {skills.tools?.length > 0 && <div><strong className="text-slate-900">Tools:</strong> {skills.tools.join(' · ')}</div>}
        {skills.softSkills?.length > 0 && <div><strong className="text-slate-900">Soft Skills:</strong> {skills.softSkills.join(' · ')}</div>}
      </div>
    );
  }

  // default — grouped rows
  return (
    <div className="text-xs space-y-1">
      {skills.languages?.length > 0 && <div><strong className="text-slate-900">Languages:</strong> {skills.languages.join(', ')}</div>}
      {skills.frameworks?.length > 0 && <div><strong className="text-slate-900">Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
      {skills.tools?.length > 0 && <div><strong className="text-slate-900">Tools & Technologies:</strong> {skills.tools.join(', ')}</div>}
      {skills.softSkills?.length > 0 && <div><strong className="text-slate-900">Soft Skills:</strong> {skills.softSkills.join(', ')}</div>}
    </div>
  );
};
