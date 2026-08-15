import React from 'react';
import { Briefcase, Plus, ChevronDown, ChevronUp, MoveUp, MoveDown, Trash2, X } from 'lucide-react';
import { InlineAIBadge } from '../../InlineAIBadge';

export const ExperienceSection = ({
  experience = [],
  updateExperience,
  addExperienceItem,
  removeExperienceItem,
  updateExperienceField,
  moveExperience,
  updateBulletPoint,
  addBulletPoint,
  removeBulletPoint,
  collapsedItems = {},
  toggleItemCollapse,
  openAiModal
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-orange-400" /> Work Experience ({experience.length})
        </h2>
        <button
          onClick={addExperienceItem}
          className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Role
        </button>
      </div>

      <div className="space-y-4">
        {experience.map((exp, idx) => {
          const itemKey = exp.id || `exp-${idx}`;
          const isCollapsed = collapsedItems[itemKey];
          return (
            <div key={itemKey} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleItemCollapse(itemKey)}
                  className="flex items-center gap-2 text-xs font-bold text-orange-400 text-left hover:underline"
                >
                  {isCollapsed ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
                  <span>{exp.role || `Position #${idx + 1}`} {exp.company ? `@ ${exp.company}` : ''}</span>
                </button>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveExperience(idx, -1)} disabled={idx === 0} className="p-1 text-slate-400 disabled:opacity-20"><MoveUp className="w-3.5 h-3.5" /></button>
                  <button onClick={() => moveExperience(idx, 1)} disabled={idx === experience.length - 1} className="p-1 text-slate-400 disabled:opacity-20"><MoveDown className="w-3.5 h-3.5" /></button>
                  <button onClick={() => removeExperienceItem(exp.id, idx)} className="p-1 text-slate-500 hover:text-red-400 ml-2"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="space-y-3 pt-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Job Title / Role *</label>
                      <input
                        type="text"
                        value={exp.role || exp.title || ''}
                        onChange={(e) => updateExperienceField(exp.id, idx, 'role', e.target.value)}
                        placeholder="e.g. Senior Full Stack Engineer"
                        className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Company / Organization *</label>
                      <input
                        type="text"
                        value={exp.company || ''}
                        onChange={(e) => updateExperienceField(exp.id, idx, 'company', e.target.value)}
                        placeholder="e.g. Nexus Technologies"
                        className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">Start Date</label>
                      <input
                        type="text"
                        value={exp.startDate || ''}
                        onChange={(e) => updateExperienceField(exp.id, idx, 'startDate', e.target.value)}
                        placeholder="e.g. 2023-01 or Jan 2023"
                        className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-slate-400 block mb-1">End Date</label>
                      <input
                        type="text"
                        value={exp.endDate ?? (Boolean(exp.current || exp.isCurrent) ? 'Present' : '')}
                        onChange={(e) => {
                          const val = e.target.value;
                          const isNowPresent = /^(present|current|now|till date|ongoing)$/i.test(val.trim());
                          updateExperience(
                            experience.map((item, i) => {
                              if ((item.id && exp.id && item.id === exp.id) || i === idx) {
                                return {
                                  ...item,
                                  endDate: val,
                                  current: isNowPresent,
                                  isCurrent: isNowPresent
                                };
                              }
                              return item;
                            })
                          );
                        }}
                        placeholder="e.g. 2024-12, Dec 2024, or Present"
                        className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                      />
                    </div>
                  </div>

                  {/* Present Toggle Checkbox */}
                  <div className="flex items-center gap-2 pt-1">
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={Boolean(exp.current || exp.isCurrent || (typeof exp.endDate === 'string' && /^(present|current|now|till date|ongoing)$/i.test(exp.endDate.trim())))}
                        onChange={(e) => {
                          const isChecked = e.target.checked;
                          updateExperience(
                            experience.map((item, i) => {
                              if ((item.id && exp.id && item.id === exp.id) || i === idx) {
                                return {
                                  ...item,
                                  current: isChecked,
                                  isCurrent: isChecked,
                                  endDate: isChecked ? 'Present' : (item.endDate && !/^(present|current|now|till date|ongoing)$/i.test(item.endDate.trim()) ? item.endDate : '')
                                };
                              }
                              return item;
                            })
                          );
                        }}
                        className="w-4 h-4 rounded border-slate-800 text-orange-500 focus:ring-orange-500 accent-orange-500 cursor-pointer"
                      />
                      <span>Currently working in this role</span>
                    </label>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/80">
                    <div className="flex items-center justify-between text-xs text-slate-300 font-semibold">
                      <span>Key Achievements & Bullet Points</span>
                      <InlineAIBadge
                        size="sm"
                        label="Rewrite with AI"
                        onClick={() => openAiModal('bullet', exp.bullets?.[0], (improved) => updateBulletPoint(exp.id, idx, 0, improved))}
                      />
                    </div>
                    {(exp.bullets || []).map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => updateBulletPoint(exp.id, idx, bIdx, e.target.value)}
                          placeholder="e.g. Architected distributed React & Node.js web services processing 15M+ daily requests..."
                          className="flex-1 bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                        />
                        <button onClick={() => removeBulletPoint(exp.id, idx, bIdx)} className="text-slate-500 hover:text-red-400 p-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addBulletPoint(exp.id, idx)} className="text-[11px] font-semibold text-orange-400 hover:underline flex items-center gap-1 pt-1">
                      + Add Bullet Point
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
