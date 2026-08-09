import React from 'react';

export const ContactInfo = ({ personal, variant = 'inline', accentHex }) => {
  const websiteLink = personal?.website || personal?.portfolio;
  const customLinks = Array.isArray(personal?.customLinks) ? personal.customLinks.map(c => c.url ? (c.label ? `${c.label}: ${c.url}` : c.url) : null).filter(Boolean) : [];

  const items = [
    personal?.email,
    personal?.phone,
    personal?.location,
    websiteLink,
    personal?.linkedin,
    personal?.github,
    personal?.twitter,
    ...customLinks
  ].filter(Boolean);

  if (variant === 'sidebar') {
    return (
      <div className="space-y-1.5 text-[10px] text-white/80">
        {personal?.email && <div className="break-all">{personal.email}</div>}
        {personal?.phone && <div>{personal.phone}</div>}
        {personal?.location && <div>{personal.location}</div>}
        {websiteLink && <div className="break-all">{websiteLink}</div>}
        {personal?.linkedin && <div className="break-all">{personal.linkedin}</div>}
        {personal?.github && <div className="break-all">{personal.github}</div>}
        {personal?.twitter && <div className="break-all">{personal.twitter}</div>}
        {customLinks.map((linkStr, i) => <div key={i} className="break-all">{linkStr}</div>)}
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
