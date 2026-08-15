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

  const totalFilteredCount = TEMPLATE_CATEGORIES
    .filter((c) => selectedCategory === 'all' || selectedCategory === c.id)
    .reduce((acc, c) => acc + c.templates.filter(filterTemplateItem).length, 0);

  const isLandscape = orientation === 'landscape';
  const gridClass = isLandscape
    ? 'grid grid-cols-2 min-[900px]:grid-cols-3 gap-4 sm:gap-5'
    : 'grid grid-cols-2 gap-4';

  return (
    <div className="w-full min-h-dvh bg-[var(--ox-bg)] text-[var(--ox-text-primary)] font-sans flex flex-col transition-colors duration-300">
      {/* ─── Dedicated Tablet Top Navigation ─── */}
      <TabletTopBar />

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 md:px-8 py-6 space-y-6 overflow-y-auto custom-scrollbar">

        {/* Header Banner */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/30">
            <Grid className="w-3.5 h-3.5" /> OpportunityX Template Gallery
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--ox-text-primary)]">Resume Templates for Tablet</h1>
          <p className="text-xs sm:text-sm text-[var(--ox-text-secondary)]">
            Switch presentation layout instantly without losing your resume data.
          </p>
        </div>

        {/* Search & Category Chips */}
        <div className="space-y-3.5 pb-4 border-b border-[var(--ox-border)]">
          {/* Row 1: Search Box & Filter Count */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[var(--ox-text-secondary)] absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search template name or tags..."
                className="w-full min-h-[44px] bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[var(--ox-text-primary)] focus:outline-none focus:border-orange-500"
              />
            </div>
            <div className="text-xs text-[var(--ox-text-secondary)] font-medium">
              Showing <span className="font-bold text-[var(--ox-text-primary)]">{totalFilteredCount}</span> templates
            </div>
          </div>

          {/* Row 2: Wrap-Enabled Category Chips */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`min-h-[40px] px-3.5 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-sm'
                  : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)] hover:text-[var(--ox-text-primary)]'
              }`}
            >
              All Templates
            </button>
            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[40px] px-3.5 py-1.5 rounded-xl border font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-sm'
                    : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)] hover:text-[var(--ox-text-primary)]'
                }`}
              >
                {cat.shortName || cat.categoryName}
              </button>
            ))}
          </div>
        </div>

        {/* Categorized Grid */}
        <div className="space-y-8">
          {TEMPLATE_CATEGORIES.filter((c) => selectedCategory === 'all' || selectedCategory === c.id).map((cat) => {
            const visibleTemplates = cat.templates.filter(filterTemplateItem);
            if (visibleTemplates.length === 0) return null;

            return (
              <div key={cat.id} className="space-y-3.5">
                <h2 className="text-sm font-extrabold text-[var(--ox-text-primary)] flex items-center gap-2 pb-1.5 border-b border-[var(--ox-border)]">
                  <Layers className="w-4 h-4 text-orange-400" /> {cat.categoryName} ({visibleTemplates.length})
                </h2>

                <div className={gridClass}>
                  {visibleTemplates.map((t) => {
                    const isCurrent = currentTemplate === t.id;
                    const caps = getTemplateCapabilities(t.id);

                    return (
                      <div
                        key={t.id}
                        className={`p-4 sm:p-5 rounded-2xl bg-[var(--ox-surface-secondary)] border space-y-3.5 flex flex-col justify-between transition-all shadow-md ${
                          isCurrent ? 'border-orange-500/60 shadow-orange-500/10' : 'border-[var(--ox-border)] hover:border-orange-500/40'
                        }`}
                      >
                        <div className="space-y-3">
                          {/* Thumbnail */}
                          <div className="h-40 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] p-2 relative overflow-hidden flex flex-col justify-between">
                            <div className="flex items-center justify-between z-10">
                              <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] border border-[var(--ox-border)] flex items-center gap-1 shadow-sm">
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

                        <div className="pt-3 border-t border-[var(--ox-border)] flex items-center justify-between">
                          <span className="text-[10px] font-semibold text-[var(--ox-text-secondary)]">
                            {caps.supportsPhoto ? '📷 Photo' : '📄 Text Only'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUseTemplate(t.id)}
                            className="min-h-[44px] px-3.5 sm:px-4 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
                          >
                            <span>Use Template</span>
                            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
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
