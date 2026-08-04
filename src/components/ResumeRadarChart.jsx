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
    <div className="cyber-glass-card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-orange-400" /> Resume Completeness Breakdown
          </h3>
          <p className="text-xs text-slate-400">8-axis section completeness evaluation</p>
        </div>
      </div>

      <div className="space-y-3">
        {axes.map((axis) => (
          <div key={axis.label} className="space-y-1">
            <div className="flex justify-between text-xs font-semibold text-slate-300">
              <span>{axis.label}</span>
              <span className="text-orange-400 font-bold">{axis.score}%</span>
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
