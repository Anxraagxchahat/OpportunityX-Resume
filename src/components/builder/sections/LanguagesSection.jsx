import React from 'react';
import { Languages, Plus, Trash2 } from 'lucide-react';

export const LanguagesSection = ({
  languages = [],
  updateLanguages,
  addLanguageItem,
  removeLanguageItem
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Languages className="w-4 h-4 text-orange-400" /> Languages ({languages.length})
        </h2>
        <button onClick={addLanguageItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Language
        </button>
      </div>
      {languages.map((lang, idx) => {
        const nameVal = typeof lang === 'string' ? lang : (lang.name || lang.language || '');
        const profVal = typeof lang === 'string' ? 'Professional Working' : (lang.proficiency || 'Professional Working');
        return (
          <div key={lang.id || idx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-orange-400">{nameVal || `Language #${idx + 1}`}</span>
              <button onClick={() => removeLanguageItem(lang.id)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Language Name</label>
                <input
                  type="text"
                  value={nameVal}
                  onChange={(e) => updateLanguages(languages.map((l, i) => (i === idx || l.id === lang.id ? { id: lang.id || `lang-${i}`, name: e.target.value, language: e.target.value, proficiency: profVal } : l)))}
                  placeholder="e.g. English, Hindi, Spanish"
                  className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Proficiency Level</label>
                <select
                  value={profVal}
                  onChange={(e) => updateLanguages(languages.map((l, i) => (i === idx || l.id === lang.id ? { id: lang.id || `lang-${i}`, name: nameVal, language: nameVal, proficiency: e.target.value } : l)))}
                  className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:border-orange-500 focus:outline-none"
                >
                  <option value="Native / Full Professional">Native / Full Professional</option>
                  <option value="Professional Working">Professional Working</option>
                  <option value="Limited Working">Limited Working</option>
                  <option value="Elementary">Elementary</option>
                </select>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
