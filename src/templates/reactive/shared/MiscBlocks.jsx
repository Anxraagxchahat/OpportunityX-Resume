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

  const formatted = languages.map((l) => {
    if (typeof l === 'string') return { name: l, proficiency: '' };
    return {
      name: l.name || l.language || '',
      proficiency: l.proficiency || ''
    };
  }).filter((l) => l.name);

  if (formatted.length === 0) return null;

  if (variant === 'sidebar') {
    return (
      <div className="flex flex-wrap gap-1">
        {formatted.map((l, idx) => (
          <span key={idx} className="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-white/15 text-white/90 border border-white/20">
            {l.name}{l.proficiency ? ` (${l.proficiency})` : ''}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-1.5 text-[10px]">
      {formatted.map((l, idx) => (
        <span key={idx} className="text-slate-700">
          <strong>{l.name}</strong>{l.proficiency ? ` (${l.proficiency})` : ''}
        </span>
      ))}
    </div>
  );
};

export const CustomSectionsBlock = ({ customSections, accentHex = '#F97316' }) => {
  if (!customSections || customSections.length === 0) return null;

  return (
    <div className="space-y-3">
      {customSections.map((cs, sIdx) => {
        if (!cs.title && (!cs.items || cs.items.length === 0)) return null;
        const validItems = Array.isArray(cs.items) ? cs.items.filter((item) => item.name || item.description) : [];

        return (
          <div key={cs.id || sIdx} className="space-y-1 pdf-block pdf-keep-together">
            {cs.title && (
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b pdf-section-header mb-1" style={{ borderColor: accentHex }}>
                {cs.title}
              </h2>
            )}
            {validItems.length > 0 ? (
              <div className="space-y-1 text-xs">
                {validItems.map((item, idx) => (
                  <div key={item.id || idx} className="text-slate-700">
                    {item.name && <strong className="text-slate-900">{item.name}</strong>}
                    {item.name && item.description && <span className="mx-1">—</span>}
                    {item.description && <span>{item.description}</span>}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};
