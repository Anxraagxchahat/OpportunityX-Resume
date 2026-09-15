import React from 'react';
import { shouldRenderBlock } from '../../../utils/paginationEngine';

export const ProjectBlock = ({ projects, accentHex, variant = 'default', visibleBlockIds = null }) => {
  if (!projects || projects.length === 0) return null;

  const isVisible = (id) => shouldRenderBlock(id, visibleBlockIds);

  if (variant === 'compact') {
    return projects.map((p, i) => {
      const blockId = `proj-${i}`;
      if (!isVisible(blockId)) return null;
      const techStr = p.techStack || (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '';
      const hasBullets = Array.isArray(p.bullets) && p.bullets.filter(Boolean).length > 0;
      return (
        <div key={p.id || i} data-block-id={blockId} className="mb-2 last:mb-0 pdf-block pdf-item">
          <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
            <span>{p.name || p.title}</span>
            {(p.link || p.url) && <span className="font-mono text-slate-500 text-[10px] font-normal">{p.link || p.url}</span>}
          </div>
          {techStr && <div className="text-[10px] text-slate-500 italic">{techStr}</div>}
          {hasBullets ? (
            <ul className="list-disc pl-4 text-[10px] text-slate-700 mt-0.5 space-y-0.5">
              {p.bullets.filter(Boolean).map((b, idx) => (
                <li key={idx}>{b}</li>
              ))}
            </ul>
          ) : p.description ? (
            <div className="text-[10px] text-slate-700 mt-0.5">{p.description}</div>
          ) : null}
        </div>
      );
    });
  }

  if (variant === 'sidebar') {
    return projects.map((p, i) => {
      const blockId = `proj-${i}`;
      if (!isVisible(blockId)) return null;
      const techStr = p.techStack || (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '';
      return (
        <div key={p.id || i} data-block-id={blockId} className="mb-2 last:mb-0 pdf-block pdf-item">
          <div className="text-[10px] font-bold text-white">{p.name || p.title}</div>
          {(p.link || p.url) && <div className="text-[9px] text-white/70 font-mono truncate">{p.link || p.url}</div>}
          {techStr && <div className="text-[9px] text-white/60 italic">{techStr}</div>}
        </div>
      );
    });
  }

  // default
  return projects.map((p, i) => {
    const blockId = `proj-${i}`;
    if (!isVisible(blockId)) return null;
    const techStr = p.techStack || (Array.isArray(p.technologies) ? p.technologies.join(', ') : p.technologies) || '';
    const hasBullets = Array.isArray(p.bullets) && p.bullets.filter(Boolean).length > 0;
    return (
      <div key={p.id || i} data-block-id={blockId} className="mb-2.5 last:mb-0 pdf-block pdf-item">
        <div className="flex justify-between items-baseline text-xs font-bold text-slate-900">
          <span>
            {p.name || p.title}
            {techStr && <span className="text-slate-500 font-normal ml-1">({techStr})</span>}
          </span>
          {(p.link || p.url) && <span className="font-mono text-slate-500 font-normal text-[10px]">{p.link || p.url}</span>}
        </div>
        {hasBullets ? (
          <ul className="list-disc pl-4 text-[10px] text-slate-700 mt-0.5 space-y-0.5">
            {p.bullets.filter(Boolean).map((b, idx) => (
              <li key={idx}>{b}</li>
            ))}
          </ul>
        ) : p.description ? (
          <p className="text-[10px] text-slate-700 mt-0.5">{p.description}</p>
        ) : null}
      </div>
    );
  });
};
