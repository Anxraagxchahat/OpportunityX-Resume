import React from 'react';
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Cpu,
  Award,
  Trophy,
  Languages,
  Share2,
  Layers,
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const builderSections = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'summary', label: 'Summary', icon: FileText },
  { id: 'experience', label: 'Experience', icon: Briefcase },
  { id: 'education', label: 'Education', icon: GraduationCap },
  { id: 'projects', label: 'Projects', icon: FolderGit2 },
  { id: 'skills', label: 'Skills', icon: Cpu },
  { id: 'certificates', label: 'Certificates', icon: Award },
  { id: 'achievements', label: 'Achievements', icon: Trophy },
  { id: 'languages', label: 'Languages', icon: Languages },
  { id: 'socialLinks', label: 'Social Links', icon: Share2 },
  { id: 'customSections', label: 'Custom Sections', icon: Layers },
];

export const BuilderSidebarNav = ({ activeSection, onSelectSection }) => {
  const { resumeHealth, activeResume, toggleSectionVisibility } = useResume();
  const { percentage, completedCount, totalCount } = resumeHealth;
  const hiddenSections = activeResume.metadata?.hiddenSections || [];

  return (
    <div className="w-56 bg-[#0B0D14]/90 border-r border-slate-800 p-3 flex flex-col justify-between hidden md:flex flex-shrink-0">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] uppercase font-bold text-slate-500 tracking-wider flex justify-between items-center">
          <span>Sections</span>
          <span className="text-[9px] text-slate-400 font-normal">Click Eye to Hide</span>
        </div>

        {builderSections.map((sec) => {
          const Icon = sec.icon;
          const isActive = activeSection === sec.id;
          const isHidden = hiddenSections.includes(sec.id);

          return (
            <div key={sec.id} className="flex items-center group">
              <button
                onClick={() => onSelectSection(sec.id)}
                className={`flex-1 flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.15)]'
                    : isHidden
                    ? 'text-slate-600 line-through'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-orange-400' : isHidden ? 'text-slate-600' : 'text-slate-400'}`} />
                <span className="truncate">{sec.label}</span>
              </button>

              <button
                onClick={() => toggleSectionVisibility(sec.id)}
                className="p-1.5 text-slate-500 hover:text-white opacity-40 group-hover:opacity-100 transition-opacity"
                title={isHidden ? "Show section in resume" : "Hide section without deleting data"}
              >
                {isHidden ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Dynamic Resume Health Metric Widget */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[11px] font-semibold text-slate-300">
          <span className="flex items-center gap-1"><ShieldCheck className="w-3.5 h-3.5 text-orange-400" /> Health</span>
          <span className="text-orange-400 font-bold">{percentage}%</span>
        </div>
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-orange-500 via-amber-500 to-emerald-400 h-full rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <p className="text-[10px] text-slate-500 pt-0.5">{completedCount} of {totalCount} sections complete</p>
      </div>
    </div>
  );
};
