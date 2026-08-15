import React from 'react';
import { Trophy, Plus, Trash2 } from 'lucide-react';

export const AchievementsSection = ({
  achievements = [],
  updateAchievements,
  addAchievementItem,
  removeAchievementItem
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-orange-400" /> Achievements ({achievements.length})
        </h2>
        <button onClick={addAchievementItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Achievement
        </button>
      </div>
      {achievements.map((ach, idx) => (
        <div key={ach.id || `ach-${idx}`} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-orange-400">{ach.title || `Achievement #${idx + 1}`}</span>
            <button onClick={() => removeAchievementItem(ach.id, idx)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Title / Award Name</label>
              <input type="text" value={ach.title || ''} onChange={(e) => updateAchievements(achievements.map((a, i) => (i === idx || (a.id && a.id === ach.id) ? { ...a, title: e.target.value } : a)))} placeholder="e.g. 1st Place Winner - OpportunityX Global Hackathon" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Description / Details</label>
              <input type="text" value={ach.description || ''} onChange={(e) => updateAchievements(achievements.map((a, i) => (i === idx || (a.id && a.id === ach.id) ? { ...a, description: e.target.value } : a)))} placeholder="e.g. Awarded top honor among 400+ international teams for building an accessible tech portal." className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
