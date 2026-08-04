import React from 'react';

export const TemplateSkills = ({ skills = {}, accentHex = '#F97316' }) => {
  const { languages = [], frameworks = [], tools = [] } = skills || {};
  if (languages.length === 0 && frameworks.length === 0 && tools.length === 0) return null;

  return (
    <div className="space-y-1 text-xs">
      {languages.length > 0 && <div><strong className="text-slate-900">Languages: </strong><span>{languages.join(', ')}</span></div>}
      {frameworks.length > 0 && <div><strong className="text-slate-900">Frameworks: </strong><span>{frameworks.join(', ')}</span></div>}
      {tools.length > 0 && <div><strong className="text-slate-900">Tools: </strong><span>{tools.join(', ')}</span></div>}
    </div>
  );
};
