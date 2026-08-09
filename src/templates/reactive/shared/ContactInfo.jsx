import React from 'react';

export const ContactInfo = ({ personal, variant = 'inline', accentHex }) => {
  // Top header strictly displays primary contact items: Email, Phone, Location, and LinkedIn
  const items = [
    personal?.email,
    personal?.phone,
    personal?.location,
    personal?.linkedin
  ].filter(Boolean);

  if (variant === 'sidebar') {
    return (
      <div className="space-y-1.5 text-[10px] text-white/80">
        {personal?.email && <div className="break-all">{personal.email}</div>}
        {personal?.phone && <div>{personal.phone}</div>}
        {personal?.location && <div>{personal.location}</div>}
        {personal?.linkedin && <div className="break-all">{personal.linkedin}</div>}
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className="space-y-0.5 text-[10px] text-slate-600">
        {items.map((item, i) => <div key={i}>{item}</div>)}
      </div>
    );
  }

  if (variant === 'columns') {
    return (
      <div className="grid grid-cols-3 gap-x-4 gap-y-0.5 text-[10px] text-slate-600">
        {items.map((item, i) => <div key={i}>{item}</div>)}
      </div>
    );
  }

  // inline (default)
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-slate-600 font-medium">
      {items.map((item, i) => (
        <span key={i}>{i > 0 && '• '}{item}</span>
      ))}
    </div>
  );
};
