import React from 'react';

/**
 * Universal Skills Component for ATS & Modern Templates
 * Formats skills cleanly into categorized groups with dot separators (•).
 * Supports:
 * 1. Object schema: { languages: [...], frameworks: [...], tools: [...] }
 * 2. Category array schema: [{ category: '...', items: [...] }]
 * 3. Flat string array or single string
 */
export const TemplateSkills = ({ skills, accentHex = '#F97316' }) => {
  if (!skills) return null;

  let categories = [];

  if (Array.isArray(skills)) {
    categories = skills.map(item => {
      if (typeof item === 'string') return { name: 'Technical Skills', items: [item] };
      if (item && typeof item === 'object') {
        return {
          name: item.category || item.name || 'Core Skills',
          items: Array.isArray(item.items) ? item.items : [item.name || ''].filter(Boolean)
        };
      }
      return null;
    }).filter(Boolean);
  } else if (typeof skills === 'object') {
    const { languages = [], frameworks = [], tools = [], programming = [], database = [], cloud = [], backend = [], softSkills = [] } = skills;
    if (programming.length > 0) categories.push({ name: 'Programming Languages', items: programming });
    if (languages.length > 0) categories.push({ name: 'Languages & Core', items: languages });
    if (frameworks.length > 0) categories.push({ name: 'Frameworks & Libraries', items: frameworks });
    if (backend.length > 0) categories.push({ name: 'Backend', items: backend });
    if (database.length > 0) categories.push({ name: 'Databases', items: database });
    if (tools.length > 0) categories.push({ name: 'Tools & Technologies', items: tools });
    if (cloud.length > 0) categories.push({ name: 'Cloud & Infrastructure', items: cloud });
    if (softSkills.length > 0) categories.push({ name: 'Soft Skills', items: softSkills });

    // Fallback if generic keys
    if (categories.length === 0 && Array.isArray(skills.items)) {
      categories.push({ name: 'Skills', items: skills.items });
    }
  } else if (typeof skills === 'string') {
    categories = [{ name: 'Skills', items: skills.split(',').map(s => s.trim()) }];
  }

  if (categories.length === 0) return null;

  return (
    <div className="space-y-1.5 text-xs leading-relaxed">
      {categories.map((cat, idx) => {
        if (!cat.items || cat.items.length === 0) return null;
        return (
          <div key={idx} className="pdf-block pdf-skills-group pdf-keep-together text-xs leading-normal">
            <span className="font-bold text-slate-900 mr-2">{cat.name}:</span>
            <span className="text-slate-700 font-medium leading-relaxed">
              {cat.items.join(' • ')}
            </span>
          </div>
        );
      })}
    </div>
  );
};
