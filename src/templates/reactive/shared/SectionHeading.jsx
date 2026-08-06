import React from 'react';

export const SectionHeading = ({ title, accentHex, variant = 'default' }) => {
  if (variant === 'underline') {
    return (
      <h2
        className="text-xs font-black uppercase tracking-wider pb-1 mb-2 border-b"
        style={{ color: accentHex, borderColor: accentHex }}
      >
        {title}
      </h2>
    );
  }

  if (variant === 'sidebar') {
    return (
      <h2 className="text-xs font-black uppercase tracking-wider text-white/90 pb-1 mb-2 border-b border-white/20">
        {title}
      </h2>
    );
  }

  if (variant === 'minimal') {
    return (
      <h2
        className="text-[11px] font-extrabold uppercase tracking-widest pb-1.5 mb-2"
        style={{ color: accentHex }}
      >
        {title}
      </h2>
    );
  }

  if (variant === 'bold-rule') {
    return (
      <div className="mb-2">
        <h2
          className="text-xs font-black uppercase tracking-widest"
          style={{ color: accentHex }}
        >
          {title}
        </h2>
        <div className="h-[2px] mt-1 rounded-full" style={{ backgroundColor: accentHex }} />
      </div>
    );
  }

  return (
    <h2
      className="text-xs font-black uppercase tracking-wider mb-2"
      style={{ color: accentHex }}
    >
      {title}
    </h2>
  );
};
