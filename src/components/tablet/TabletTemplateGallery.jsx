import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Search, Star, Sparkles, ArrowRight, Camera, ShieldCheck, Layers
} from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { TEMPLATE_CATEGORIES, getTemplateCapabilities } from '../../templates';
import { RealTemplateThumbnail } from '../template/RealTemplateThumbnail';
import { TabletTopBar } from './TabletTopBar';

export const TabletTemplateGallery = ({ orientation = 'portrait' }) => {
  const navigate = useNavigate();
  const { setTemplate, setAccentColor, activeResume } = useResume();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const currentTemplate = activeResume?.metadata?.template || 'modern';
  const currentAccent = activeResume?.metadata?.accentColor || '#F97316';

  const handleUseTemplate = (templateId) => {
    setTemplate(templateId);
    navigate('/builder');
  };

  const filterTemplateItem = (t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchTags = t.tags?.some((tg) => tg.toLowerCase().includes(q));
      if (!matchName && !matchTags) return false;
    }
    return true;
  };

  const isLandscape = orientation === 'landscape';
  const gridClass = isLandscape
    ? 'grid grid-cols-2 min-[900px]:grid-cols-3 gap-4'
    : 'grid grid-cols-2 gap-4';

  return (
    <div className="w-full min-h-dvh bg-[var(--ox-bg)] text-[var(--ox-text-primary)] font-sans flex flex-col transition-colors duration-300">
      {/* Exact One Top Navigation */}
      <TabletTopBar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-6 space-y-6 overflow-y-auto custom-scrollbar">

        {/* Header Banner */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/30">
            <Grid className="w-3.5 h-3.5" /> OpportunityX Template Gallery
          </div>
          <h1 className="text-2xl font-black text-[var(--ox-text-primary)]">Resume Templates for Tablet</h1>
          <p className="text-xs text-[var(--ox-text-secondary)]">
            Switch presentation layout instantly without losing your resume data.
          </p>
        </div>

        {/* Search & Category Chips */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pb-4 border-b border-[var(--ox-border)]">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 text-xs">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl border font-bold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                  : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              All
            </button>
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl border font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                    : 'bg-slate-900 text-slate-400 border-slate-800'
                }`}
              >
                {cat.categoryName}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search template..."
              className="w-full bg-[#080B12] border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Categorized Grid */}
        <div className="space-y-8">
          {TEMPLATE_CATEGORIES.filter((c) => selectedCategory === 'all' || selectedCategory === c.id).map((cat) => {
            const visibleTemplates = cat.templates.filter(filterTemplateItem);
            if (visibleTemplates.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-3">
                <h2 className="text-sm font-extrabold text-[var(--ox-text-primary)] flex items-center gap-2 pb-1 border-b border-slate-800/80">
                  <Layers className="w-4 h-4 text-orange-400" /> {cat.categoryName} ({visibleTemplates.length})
                </h2>

                <div className={gridClass}>
                  {visibleTemplates.map((t) => {
                    const isCurrent = currentTemplate === t.id;
                    const caps = getTemplateCapabilities(t.id);

                    return (
                      <div
                        key={t.id}
                        className={`p-4 rounded-2xl bg-[var(--ox-surface-secondary)] border space-y-3 flex flex-col justify-between transition-all ${
                          isCurrent ? 'border-orange-500/60 shadow-md' : 'border-[var(--ox-border)] hover:border-orange-500/40'
                        }`}
                      >
                        <div className="space-y-2.5">
                          {/* Thumbnail */}
                          <div className="h-36 rounded-xl bg-slate-950 border border-slate-800 p-2 relative overflow-hidden flex flex-col justify-between">
                            <div className="flex items-center justify-between z-10">
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-900 text-white border border-slate-800 flex items-center gap-1">
                                {caps.atsFriendly ? <ShieldCheck className="w-3 h-3 text-emerald-400" /> : <Sparkles className="w-3 h-3 text-amber-400" />}
                                {caps.atsFriendly ? 'ATS Friendly' : 'Creative'}
                              </span>
                            </div>

                            <div className="flex-1 w-full relative">
                              <RealTemplateThumbnail template={t} />
                            </div>
                          </div>

                          <div>
                            <div className="flex items-center justify-between">
                              <h3 className="text-sm font-bold text-[var(--ox-text-primary)]">{caps.name}</h3>
                              {isCurrent && <span className="text-[9px] font-black text-orange-400 uppercase">Active</span>}
                            </div>
                            <p className="text-[11px] text-[var(--ox-text-secondary)] line-clamp-2 mt-0.5">{caps.description}</p>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[var(--ox-border)] flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-slate-400">
                            {caps.supportsPhoto ? '📷 Photo' : '📄 Text Only'}
                          </span>
                          <button
                            onClick={() => handleUseTemplate(t.id)}
                            className="px-3.5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl transition-all flex items-center gap-1 cursor-pointer"
                          >
                            Use Template <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

      </main>
    </div>
  );
};

export default TabletTemplateGallery;
