import React from 'react';

export const ProjectBlock = ({ projects, accentHex, variant = 'default' }) => {
  if (!projects || projects.length === 0) return null;

  if (variant === 'compact') {
    return projects.map((p) => (
      <div key={p.id} className="mb-2 last:mb-0">
        <div className="text-xs font-bold text-slate-900">{p.name}</div>
        {p.techStack && <div className="text-[10px] text-slate-500 italic">{p.techStack}</div>}
        {p.description && <div className="text-[10px] text-slate-700">{p.description}</div>}
      </div>
    ));
  }

  if (variant === 'sidebar') {
    return projects.map((p) => (
      <div key={p.id} className="mb-2 last:mb-0">
        <div className="text-[10px] font-bold text-white">{p.name}</div>
        {p.techStack && <div className="text-[9px] text-white/60 italic">{p.techStack}</div>}
      </div>
    ));
  }

  // default
  return projects.map((p) => (
    <div key={p.id} className="mb-2.5 last:mb-0">
      <div className="text-xs font-bold text-slate-900">
        {p.name}
        {p.techStack && <span className="text-slate-500 font-normal ml-1">({p.techStack})</span>}
      </div>
      {p.description && <p className="text-[10px] text-slate-700 mt-0.5">{p.description}</p>}
      {p.bullets && (
        <ul className="list-disc pl-4 text-[10px] text-slate-700 mt-0.5 space-y-0.5">
          {p.bullets.map((b, i) => <li key={i}>{b}</li>)}
        </ul>
      )}
    </div>
  ));
};
