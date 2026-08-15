import React from 'react';
import { FolderGit2, Plus, Trash2 } from 'lucide-react';

export const ProjectsSection = ({
  projects = [],
  updateProjects,
  addProjectItem,
  removeProjectItem
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-orange-400" /> Technical Projects ({projects.length})
        </h2>
        <button onClick={addProjectItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((proj, idx) => {
          const itemKey = proj.id || `proj-${idx}`;
          return (
            <div key={itemKey} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-orange-400">{proj.name || proj.title || `Project #${idx + 1}`}</span>
                <button onClick={() => removeProjectItem(proj.id, idx)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Project Title / Name *</label>
                  <input
                    type="text"
                    value={proj.name || proj.title || ''}
                    onChange={(e) => updateProjects(projects.map((p, i) => (i === idx || (p.id && p.id === proj.id) ? { ...p, name: e.target.value, title: e.target.value } : p)))}
                    placeholder="e.g. OpportunityX AI Career Platform"
                    className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Project Link / GitHub URL</label>
                  <input
                    type="text"
                    value={proj.link || proj.url || proj.htmlUrl || ''}
                    onChange={(e) => updateProjects(projects.map((p, i) => (i === idx || (p.id && p.id === proj.id) ? { ...p, link: e.target.value, url: e.target.value, htmlUrl: e.target.value } : p)))}
                    placeholder="e.g. https://github.com/user/project"
                    className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Technologies Used (Tech Stack)</label>
                <input
                  type="text"
                  value={proj.techStack || (Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies) || ''}
                  onChange={(e) => updateProjects(projects.map((p, i) => (i === idx || (p.id && p.id === proj.id) ? { ...p, techStack: e.target.value, technologies: e.target.value.split(',').map(s => s.trim()).filter(Boolean) } : p)))}
                  placeholder="e.g. React.js, Node.js, PostgreSQL, Tailwind CSS, AWS"
                  className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Project Description / Details</label>
                <textarea
                  rows={2}
                  value={proj.description || ''}
                  onChange={(e) => updateProjects(projects.map((p, i) => (i === idx || (p.id && p.id === proj.id) ? { ...p, description: e.target.value } : p)))}
                  placeholder="e.g. Built an AI-powered career platform that helps students discover internships and scholarships with ATS scoring..."
                  className="w-full bg-[#080B12] border border-slate-800 rounded-lg p-2 text-xs text-white"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
