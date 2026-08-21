import React from 'react';
import { Calendar, Briefcase, GraduationCap, FolderGit2, Award, Trophy } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const ResumeTimeline = () => {
  const { activeResume } = useResume();
  const { experience = [], education = [], projects = [], certificates = [], achievements = [] } = activeResume;

  // Combine items into timeline array
  const timelineItems = [
    ...experience.map((e) => ({
      id: e.id,
      title: e.role || 'Position',
      subtitle: e.company,
      date: `${e.startDate || ''} - ${e.endDate || 'Present'}`,
      type: 'Experience',
      icon: Briefcase,
      color: 'text-orange-400'
    })),
    ...education.map((edu) => ({
      id: edu.id,
      title: edu.degree || 'Degree',
      subtitle: edu.institution,
      date: `${edu.startDate || ''} - ${edu.endDate || ''}`,
      type: 'Education',
      icon: GraduationCap,
      color: 'text-amber-400'
    })),
    ...projects.map((p) => ({
      id: p.id,
      title: p.name || 'Project',
      subtitle: p.techStack || 'Technical Project',
      date: 'Project Milestone',
      type: 'Project',
      icon: FolderGit2,
      color: 'text-emerald-400'
    })),
    ...certificates.map((c) => ({
      id: c.id,
      title: c.name || 'Certificate',
      subtitle: c.issuer,
      date: c.date || 'Certification',
      type: 'Certificate',
      icon: Award,
      color: 'text-blue-400'
    }))
  ];

  return (
    <div className="cyber-glass-card p-4 sm:p-6 space-y-4 w-full max-w-full min-w-0 box-border">
      <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between gap-2 pb-3 border-b border-slate-800 w-full min-w-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400 shrink-0" />
            <span className="break-words">Career Progression Timeline</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 break-words">Chronological history of work roles, education, and technical projects</p>
        </div>
        <span className="text-xs font-bold text-slate-400 shrink-0">{timelineItems.length} Milestones</span>
      </div>

      <div className="relative pl-6 sm:pl-7 space-y-5 sm:space-y-6 before:absolute before:left-2 sm:before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800 w-full min-w-0 box-border">
        {timelineItems.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="relative flex items-start gap-3 sm:gap-4 group min-w-0 w-full">
              <div className={`absolute -left-[25px] sm:-left-[27px] top-1 p-1 rounded-full bg-[#0B0D14] border border-slate-700 ${item.color} shrink-0`}>
                <Icon className="w-3.5 h-3.5" />
              </div>

              <div className="p-3 sm:p-3.5 rounded-xl bg-[#10131D] border border-slate-800 flex-1 space-y-1 group-hover:border-slate-700 transition-colors min-w-0 w-full box-border">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5 sm:gap-2 text-xs">
                  <span className="font-bold text-white text-xs sm:text-sm break-words leading-tight">{item.title}</span>
                  <span className="text-[10px] sm:text-[11px] font-semibold text-slate-500 shrink-0">{item.date}</span>
                </div>
                <div className="text-xs text-slate-400 font-medium break-words">{item.subtitle}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider ${item.color}`}>
                  {item.type}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResumeTimeline;
