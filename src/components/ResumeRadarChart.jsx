import React from 'react';
import { Layers } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ResumeRadarChart = () => {
  const { activeResume } = useResume();
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [] } = activeResume;

  const axes = [
    { label: 'Summary', score: (personal.summary || '').length > 40 ? 100 : 40 },
    { label: 'Experience', score: experience.length >= 2 ? 100 : experience.length === 1 ? 60 : 20 },
    { label: 'Projects', score: projects.length >= 2 ? 100 : projects.length === 1 ? 65 : 25 },
    { label: 'Skills', score: ((skills.languages?.length || 0) + (skills.frameworks?.length || 0)) >= 5 ? 100 : 50 },
    { label: 'Education', score: education.length >= 1 ? 100 : 30 },
    { label: 'Certificates', score: certificates.length >= 1 ? 100 : 30 },
    { label: 'Achievements', score: achievements.length >= 1 ? 100 : 30 },
    { label: 'Languages', score: languages.length >= 1 ? 100 : 40 }
  ];

  return (
    <div className="cyber-glass-card p-4 sm:p-6 space-y-4 w-full max-w-full min-w-0 box-border">
      <div className="flex flex-wrap items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
            <span className="break-words">Resume Completeness Breakdown</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 break-words">8-axis section completeness evaluation</p>
        </div>
      </div>

      <div className="space-y-3 w-full min-w-0">
        {axes.map((axis) => (
          <div key={axis.label} className="space-y-1 w-full min-w-0">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
              <span className="truncate">{axis.label}</span>
              <span className="text-orange-400 font-bold ml-2 shrink-0">{axis.score}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-orange-500 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${axis.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResumeRadarChart;
