import React from 'react';

export const TemplateSection = ({ title, accentHex = '#F97316', children }) => {
  if (!children) return null;

  return (
    <div className="space-y-2 break-inside-avoid">
      <h2 className="text-xs font-black uppercase tracking-wider pb-1 border-b" style={{ color: accentHex, borderColor: accentHex }}>
        {title}
      </h2>
      <div className="text-xs leading-relaxed text-slate-700">{children}</div>
    </div>
  );
};
