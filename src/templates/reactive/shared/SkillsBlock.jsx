import React from 'react';

export const SkillsBlock = ({ skills, accentHex, variant = 'default' }) => {
  if (!skills) return null;
  const hasSkills = skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0 || skills.softSkills?.length > 0;
  if (!hasSkills) return null;

  if (variant === 'tags') {
    const allSkills = [
      ...(skills.languages || []),
      ...(skills.frameworks || []),
      ...(skills.tools || []),
      ...(skills.softSkills || [])
    ];
    return (
      <div className="flex flex-wrap gap-1.5 items-center">
        {allSkills.map((s, i) => (
          <span
            key={i}
            className="inline-block px-2 py-0.5 text-[9px] font-semibold leading-tight rounded bg-slate-100 text-slate-700 border border-slate-200 whitespace-nowrap box-border max-w-full text-center"
            style={{ breakInside: 'avoid', wordBreak: 'keep-all' }}
          >
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
      ...(skills.tools || []),
      ...(skills.softSkills || [])
    ];
    return (
      <div className="flex flex-wrap gap-1.5 items-center">
        {allSkills.map((s, i) => (
          <span
            key={i}
            className="inline-block px-2 py-0.5 text-[9px] font-semibold leading-tight rounded bg-white/15 text-white/90 border border-white/20 whitespace-nowrap box-border max-w-full text-center"
            style={{ breakInside: 'avoid', wordBreak: 'keep-all' }}
          >
            {s}
          </span>
        ))}
      </div>
    );
  }

  if (variant === 'sidebar') {
    return (
      <div className="space-y-1 text-[10px] text-white/80">
        {skills.languages?.length > 0 && <div className="leading-relaxed"><strong className="text-white">Languages:</strong> {skills.languages.join(', ')}</div>}
        {skills.frameworks?.length > 0 && <div className="leading-relaxed"><strong className="text-white">Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
        {skills.tools?.length > 0 && <div className="leading-relaxed"><strong className="text-white">Tools:</strong> {skills.tools.join(', ')}</div>}
        {skills.softSkills?.length > 0 && <div className="leading-relaxed"><strong className="text-white">Soft Skills:</strong> {skills.softSkills.join(', ')}</div>}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className="text-[10px] text-slate-700 space-y-0.5">
        {skills.languages?.length > 0 && <div className="leading-relaxed"><strong className="text-slate-900 font-bold">Languages:</strong> {skills.languages.join(' · ')}</div>}
        {skills.frameworks?.length > 0 && <div className="leading-relaxed"><strong className="text-slate-900 font-bold">Frameworks:</strong> {skills.frameworks.join(' · ')}</div>}
        {skills.tools?.length > 0 && <div className="leading-relaxed"><strong className="text-slate-900 font-bold">Tools:</strong> {skills.tools.join(' · ')}</div>}
        {skills.softSkills?.length > 0 && <div className="leading-relaxed"><strong className="text-slate-900 font-bold">Soft Skills:</strong> {skills.softSkills.join(' · ')}</div>}
      </div>
    );
  }

  // default — grouped rows
  return (
    <div className="text-xs space-y-1">
      {skills.languages?.length > 0 && <div className="leading-relaxed"><strong className="text-slate-900 font-bold">Languages:</strong> {skills.languages.join(', ')}</div>}
      {skills.frameworks?.length > 0 && <div className="leading-relaxed"><strong className="text-slate-900 font-bold">Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
      {skills.tools?.length > 0 && <div className="leading-relaxed"><strong className="text-slate-900 font-bold">Tools & Technologies:</strong> {skills.tools.join(', ')}</div>}
      {skills.softSkills?.length > 0 && <div className="leading-relaxed"><strong className="text-slate-900 font-bold">Soft Skills:</strong> {skills.softSkills.join(', ')}</div>}
    </div>
  );
};
