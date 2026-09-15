import React from 'react';
import { FolderGit2, Plus, Trash2, X } from 'lucide-react';
import { InlineAIBadge } from '../../InlineAIBadge';

export const ProjectsSection = ({
  projects = [],
  updateProjects,
  addProjectItem,
  removeProjectItem,
  openAiModal
}) => {
  const getBullets = (proj) => {
    if (Array.isArray(proj.bullets) && proj.bullets.length > 0) {
      return proj.bullets;
    }
    if (proj.description && typeof proj.description === 'string' && proj.description.trim()) {
      const parts = proj.description
        .split(/\r?\n|•/)
        .map((s) => s.trim().replace(/^[-*]\s*/, ''))
        .filter(Boolean);
      if (parts.length > 0) return parts;
      return [proj.description.trim()];
    }
    return [''];
  };

  const updateBullets = (proj, projIdx, newBullets) => {
    const validBullets = newBullets;
    const combinedDesc = validBullets.filter(Boolean).join(' ');
    updateProjects(
      projects.map((p, i) => {
        if ((p.id && proj.id && p.id === proj.id) || i === projIdx) {
          return {
            ...p,
            bullets: validBullets,
            description: combinedDesc
          };
        }
        return p;
      })
    );
  };

  const handleAddBullet = (proj, projIdx) => {
    const current = getBullets(proj);
    updateBullets(proj, projIdx, [...current, '']);
  };

  const handleUpdateBullet = (proj, projIdx, bIdx, value) => {
    const current = [...getBullets(proj)];
    current[bIdx] = value;
    updateBullets(proj, projIdx, current);
  };

  const handleRemoveBullet = (proj, projIdx, bIdx) => {
    const current = getBullets(proj).filter((_, i) => i !== bIdx);
    updateBullets(proj, projIdx, current.length > 0 ? current : ['']);
  };

  const handlePasteMultiLine = (e, proj, projIdx, bIdx) => {
    const pasteText = e.clipboardData.getData('text');
    if (pasteText && (pasteText.includes('\n') || pasteText.includes('•'))) {
      const lines = pasteText
        .split(/\r?\n|•/)
        .map((s) => s.trim().replace(/^[-*]\s*/, ''))
        .filter(Boolean);
      if (lines.length > 1) {
        e.preventDefault();
        const current = [...getBullets(proj)];
        current.splice(bIdx, 1, ...lines);
        updateBullets(proj, projIdx, current);
      }
    }
  };

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-orange-400" /> Technical Projects ({projects.length})
        </h2>
        <button
          type="button"
          onClick={addProjectItem}
          className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1.5 transition-all"
        >
          <Plus className="w-3.5 h-3.5" /> Add Project
        </button>
      </div>

      <div className="space-y-4">
        {projects.map((proj, idx) => {
          const itemKey = proj.id || `proj-${idx}`;
          const currentBullets = getBullets(proj);

          return (
            <div key={itemKey} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-orange-400">{proj.name || proj.title || `Project #${idx + 1}`}</span>
                <button
                  type="button"
                  onClick={() => removeProjectItem(proj.id, idx)}
                  className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                  title="Delete Project"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Project Title / Name *</label>
                  <input
                    type="text"
                    value={proj.name || proj.title || ''}
                    onChange={(e) =>
                      updateProjects(
                        projects.map((p, i) =>
                          i === idx || (p.id && p.id === proj.id) ? { ...p, name: e.target.value, title: e.target.value } : p
                        )
                      )
                    }
                    placeholder="e.g. OpportunityX AI Career Platform"
                    className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] font-semibold text-slate-400">Project Link / GitHub URL</label>
                  <input
                    type="text"
                    value={proj.link || proj.url || proj.htmlUrl || ''}
                    onChange={(e) =>
                      updateProjects(
                        projects.map((p, i) =>
                          i === idx || (p.id && p.id === proj.id)
                            ? { ...p, link: e.target.value, url: e.target.value, htmlUrl: e.target.value }
                            : p
                        )
                      )
                    }
                    placeholder="e.g. https://github.com/user/project"
                    className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-400">Technologies Used (Tech Stack)</label>
                <input
                  type="text"
                  value={proj.techStack || (Array.isArray(proj.technologies) ? proj.technologies.join(', ') : proj.technologies) || ''}
                  onChange={(e) =>
                    updateProjects(
                      projects.map((p, i) =>
                        i === idx || (p.id && p.id === proj.id)
                          ? { ...p, techStack: e.target.value, technologies: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) }
                          : p
                      )
                    )
                  }
                  placeholder="e.g. React.js, Node.js, PostgreSQL, Tailwind CSS, AWS"
                  className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500"
                />
              </div>

              {/* Point-wise Project Details */}
              <div className="space-y-2 pt-2 border-t border-slate-800/80">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-semibold text-slate-400">
                    Project Bullet Points / Details
                  </label>
                  <div className="flex items-center gap-2">
                    {openAiModal && (
                      <InlineAIBadge
                        size="sm"
                        label="Rewrite with AI"
                        onClick={() =>
                          openAiModal('bullet', currentBullets[0] || '', (improved) =>
                            handleUpdateBullet(proj, idx, 0, improved)
                          )
                        }
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => handleAddBullet(proj, idx)}
                      className="px-2.5 py-1 text-[11px] font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1 transition-all"
                      title="Add bullet point"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Point</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  {currentBullets.map((bullet, bIdx) => (
                    <div key={bIdx} className="flex items-center gap-2">
                      <span className="text-orange-400 font-bold text-sm leading-none select-none pl-1">•</span>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => handleUpdateBullet(proj, idx, bIdx, e.target.value)}
                        onPaste={(e) => handlePasteMultiLine(e, proj, idx, bIdx)}
                        placeholder={`Point ${bIdx + 1} (e.g. Architected and developed AI solutions...)`}
                        className="flex-1 bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBullet(proj, idx, bIdx)}
                        className="p-1 text-slate-500 hover:text-red-400 rounded transition-colors"
                        title="Remove point"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddBullet(proj, idx)}
                  className="text-[11px] font-semibold text-orange-400 hover:underline flex items-center gap-1 pt-0.5"
                >
                  <Plus className="w-3 h-3" /> Add Point
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
