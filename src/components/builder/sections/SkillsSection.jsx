import React from 'react';
import { Cpu, X } from 'lucide-react';

export const SkillsSection = ({
  skills = {},
  skillCategory,
  setSkillCategory,
  newSkillInput,
  setNewSkillInput,
  addSkillChip,
  removeSkillChip
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Cpu className="w-4 h-4 text-orange-400" /> Skills Tag Chips
        </h2>
      </div>

      <div className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
        <div className="flex gap-2">
          <select value={skillCategory} onChange={(e) => setSkillCategory(e.target.value)} className="bg-[#080B12] border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 text-xs">
            <option value="languages">Languages</option>
            <option value="frameworks">Frameworks</option>
            <option value="tools">Tools</option>
          </select>
          <input
            type="text"
            value={newSkillInput}
            onChange={(e) => setNewSkillInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addSkillChip(skillCategory, newSkillInput);
              }
            }}
            placeholder="e.g. TypeScript, React, Node.js (Press Enter)"
            className="flex-1 bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
          />
          <button onClick={() => addSkillChip(skillCategory, newSkillInput)} className="px-3 py-1.5 bg-orange-500 text-black font-bold text-xs rounded-lg">Add</button>
        </div>
      </div>

      {['languages', 'frameworks', 'tools'].map((cat) => (
        <div key={cat} className="space-y-2">
          <div className="text-xs font-bold text-slate-300 capitalize">{cat}</div>
          <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-[#10131D] border border-slate-800">
            {(skills[cat] || []).map((sk) => (
              <span key={sk} className="px-2.5 py-1 rounded-lg bg-orange-500/10 text-orange-300 border border-orange-500/30 text-xs font-semibold flex items-center gap-1.5">
                <span>{sk}</span>
                <button onClick={() => removeSkillChip(cat, sk)} className="text-orange-400 hover:text-red-400"><X className="w-3 h-3" /></button>
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
