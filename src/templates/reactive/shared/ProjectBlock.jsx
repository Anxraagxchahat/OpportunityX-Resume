import React from 'react';

export const ProjectBlock = ({ projects, accentHex, variant = 'default' }) => {
  if (!projects || projects.length === 0) return null;

  if (variant === 'compact') {
    return projects.map((p) => {
      const techStr = p.techStack || (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '';
      return (
        <div key={p.id} className="mb-2 last:mb-0">
          <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
            <span>{p.name || p.title}</span>
            {(p.link || p.url) && <span className="font-mono text-slate-500 text-[10px] font-normal">{p.link || p.url}</span>}
          </div>
          {techStr && <div className="text-[10px] text-slate-500 italic">{techStr}</div>}
          {p.description && <div className="text-[10px] text-slate-700 mt-0.5">{p.description}</div>}
        </div>
      );
    });
  }

  if (variant === 'sidebar') {
    return projects.map((p) => {
      const techStr = p.techStack || (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '';
      return (
        <div key={p.id} className="mb-2 last:mb-0">
          <div className="text-[10px] font-bold text-white">{p.name || p.title}</div>
          {(p.link || p.url) && <div className="text-[9px] text-white/70 font-mono truncate">{p.link || p.url}</div>}
          {techStr && <div className="text-[9px] text-white/60 italic">{techStr}</div>}
        </div>
      );
    });
  }

  // default
  return projects.map((p) => {
    const techStr = p.techStack || (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '';
    return (
      <div key={p.id} className="mb-2.5 last:mb-0">
        <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
          <span>
            {p.name || p.title}
            {techStr && <span className="text-slate-500 font-normal ml-1">({techStr})</span>}
          </span>
          {(p.link || p.url) && <span className="font-mono text-slate-500 font-normal text-[10px]">{p.link || p.url}</span>}
        </div>
        {p.description && <p className="text-[10px] text-slate-700 mt-0.5">{p.description}</p>}
        {p.bullets && (
          <ul className="list-disc pl-4 text-[10px] text-slate-700 mt-0.5 space-y-0.5">
            {p.bullets.map((b, i) => b ? <li key={i}>{b}</li> : null)}
          </ul>
        )}
      </div>
    );
  });
};
