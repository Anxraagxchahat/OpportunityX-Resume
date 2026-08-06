import React from 'react';

export const CertificatesBlock = ({ certificates, accentHex, variant = 'default' }) => {
  if (!certificates || certificates.length === 0) return null;

  if (variant === 'sidebar') {
    return certificates.map((c) => (
      <div key={c.id} className="mb-1.5 last:mb-0">
        <div className="text-[10px] font-bold text-white">{c.name}</div>
        <div className="text-[9px] text-white/60">{c.issuer}{c.date ? ` · ${c.date}` : ''}</div>
      </div>
    ));
  }

  return certificates.map((c) => (
    <div key={c.id} className="mb-1.5 last:mb-0 text-[10px]">
      <span className="font-bold text-slate-900">{c.name}</span>
      <span className="text-slate-500 ml-1">— {c.issuer}{c.date ? `, ${c.date}` : ''}</span>
    </div>
  ));
};

export const AchievementsBlock = ({ achievements, accentHex, variant = 'default' }) => {
  if (!achievements || achievements.length === 0) return null;

  if (variant === 'sidebar') {
    return achievements.map((a) => (
      <div key={a.id} className="mb-1 last:mb-0 text-[10px] text-white/80">• {a.title}</div>
    ));
  }

  return achievements.map((a) => (
    <div key={a.id} className="mb-1 last:mb-0 text-[10px] text-slate-700">
      <span className="font-bold text-slate-900">{a.title}</span>
      {a.description && <span className="ml-1 text-slate-600">— {a.description}</span>}
    </div>
  ));
};

export const LanguagesBlock = ({ languages, variant = 'default' }) => {
  if (!languages || languages.length === 0) return null;

  if (variant === 'sidebar') {
    return (
      <div className="flex flex-wrap gap-1">
        {languages.map((l) => (
          <span key={l.id} className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-white/15 text-white/90 border border-white/20">
            {l.language}{l.proficiency ? ` (${l.proficiency})` : ''}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5 text-[10px]">
      {languages.map((l) => (
        <span key={l.id} className="text-slate-700">
          <strong>{l.language}</strong>{l.proficiency ? ` (${l.proficiency})` : ''}
        </span>
      ))}
    </div>
  );
};
