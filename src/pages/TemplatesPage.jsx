import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid, Search, Star, Sparkles, ArrowRight, Sliders, X, Layers, Filter,
  Eye, CheckCircle2, ShieldCheck, Camera, Maximize2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { TEMPLATE_CATEGORIES, getTemplateCapabilities, OPPORTUNITYX_TEMPLATES_METADATA } from '../templates';
import { RealTemplateThumbnail } from '../components/template/RealTemplateThumbnail';
import { motion, AnimatePresence } from 'framer-motion';
import { useDeviceType } from '../hooks/useDeviceType';
import { TabletTemplateGallery } from '../components/tablet/TabletTemplateGallery';

const FAVORITES_KEY = 'opportunityx_favorite_templates_v1';
const RECENT_KEY = 'opportunityx_recent_templates_v1';

export const TemplatesPage = () => {
  const { isTablet, orientation } = useDeviceType();

  if (isTablet) {
    return <TabletTemplateGallery orientation={orientation} />;
  }

  const navigate = useNavigate();
  const { setTemplate, setAccentColor, activeResume } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filters State
  const [filterAtsOnly, setFilterAtsOnly] = useState(false);
  const [filterPhotoOnly, setFilterPhotoOnly] = useState(false);
  const [filterFavoritesOnly, setFilterFavoritesOnly] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState('all');

  // LocalStorage Persistence
  const [favorites, setFavorites] = useState(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['modern', 'creative-sidebar', 'fullstack'];
  });

  const [recentTemplates, setRecentTemplates] = useState(() => {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return ['modern', 'creative-sidebar'];
  });

  const [compareTemplate, setCompareTemplate] = useState(null);
  const [galleryTemplate, setGalleryTemplate] = useState(null);
  const [galleryZoom, setGalleryZoom] = useState(100);

  const currentTemplate = activeResume.metadata?.template || 'modern';
  const currentAccent = activeResume.metadata?.accentColor || '#F97316';

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (e) {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentTemplates));
    } catch (e) {}
  }, [recentTemplates]);

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
  };

  const handleUseTemplate = (templateId) => {
    setTemplate(templateId);
    setRecentTemplates((prev) => [templateId, ...prev.filter((id) => id !== templateId)].slice(0, 5));
    navigate('/builder');
  };

  const handleSelectAccent = (colorHex) => {
    setAccentColor(colorHex);
  };

  // Filter templates list dynamically
  const filterTemplateItem = (t) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = t.name.toLowerCase().includes(q);
      const matchTags = t.tags?.some((tg) => tg.toLowerCase().includes(q));
      const matchRec = t.recommendedFor?.some((rf) => rf.toLowerCase().includes(q));
      if (!matchName && !matchTags && !matchRec) return false;
    }
    if (filterAtsOnly && !t.atsFriendly) return false;
    if (filterPhotoOnly && !t.supportsPhoto) return false;
    if (filterFavoritesOnly && !favorites.includes(t.id)) return false;
    if (selectedExperience !== 'all' && t.recommendedExperienceLevel !== selectedExperience) return false;
    return true;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/30">
          <Grid className="w-3.5 h-3.5" /> OpportunityX Original Template Engine
        </div>
        <h1 className="text-3xl font-black text-white">Production Template Marketplace</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Instantly switches presentation, column structure, typography hierarchy, and dynamic capabilities without altering your Resume JSON data.
        </p>
      </div>

      {/* Recently Used Bar */}
      {recentTemplates.length > 0 && (
        <div className="p-3.5 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] flex items-center justify-between gap-4 transition-colors duration-300">
          <div className="text-xs font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-orange-500" /> Recently Used Layouts:
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {recentTemplates.map((recId) => {
              const recMeta = getTemplateCapabilities(recId);
              return (
                <button
                  key={recId}
                  onClick={() => handleUseTemplate(recId)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                    currentTemplate === recId
                      ? 'bg-orange-500/20 text-orange-500 border-orange-500/50 shadow-sm'
                      : 'bg-[var(--ox-card-bg)] text-[var(--ox-text-secondary)] border-[var(--ox-border)] hover:text-[var(--ox-text-primary)]'
                  }`}
                >
                  <span>{recMeta.name}</span>
                  {recMeta.supportsPhoto && <Camera className="w-3 h-3 text-emerald-500" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Advanced Filter & Search Bar */}
      <div className="space-y-4 pb-4 border-b border-slate-800">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Category Chips Container */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar flex-1 min-w-0 py-1 text-xs font-semibold">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-sm'
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              All Templates
            </button>

            {TEMPLATE_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl border transition-all whitespace-nowrap cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-sm'
                    : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {cat.shortName || cat.categoryName}
              </button>
            ))}
          </div>

          {/* Search Input Box */}
          <div className="relative shrink-0 w-full md:w-64">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search layout, role, tag..."
              className="w-full bg-[#0B0D14] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-orange-500"
            />
          </div>
        </div>

        {/* Multi-Select Toggle Filters */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium pt-1">
          <span className="text-slate-500 text-[11px] font-bold flex items-center gap-1">
            <Filter className="w-3 h-3 text-orange-400" /> Filters:
          </span>

          <button
            onClick={() => setFilterAtsOnly(!filterAtsOnly)}
            className={`px-3 py-1 rounded-xl border transition-all ${
              filterAtsOnly ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
          >
            🧾 ATS 100% Only
          </button>

          <button
            onClick={() => setFilterPhotoOnly(!filterPhotoOnly)}
            className={`px-3 py-1 rounded-xl border transition-all ${
              filterPhotoOnly ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
          >
            📷 Supports Profile Photo
          </button>

          <button
            onClick={() => setFilterFavoritesOnly(!filterFavoritesOnly)}
            className={`px-3 py-1 rounded-xl border transition-all ${
              filterFavoritesOnly ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-slate-900/60 text-slate-400 border-slate-800'
            }`}
          >
            ⭐ Favorites ({favorites.length})
          </button>

          {/* Experience Selector */}
          <select
            value={selectedExperience}
            onChange={(e) => setSelectedExperience(e.target.value)}
            className="bg-slate-900 text-slate-300 border border-slate-800 rounded-xl px-3 py-1 text-xs focus:outline-none"
          >
            <option value="all">All Experience Levels</option>
            <option value="Student">Student / Fresher</option>
            <option value="0–2 Years">0–2 Years</option>
            <option value="2–5 Years">2–5 Years</option>
            <option value="Senior Professional">Senior Professional</option>
          </select>
        </div>
      </div>

      {/* Categorized Templates Grid */}
      <div className="space-y-10">
        {TEMPLATE_CATEGORIES.filter((c) => selectedCategory === 'all' || selectedCategory === c.id).map((cat) => {
          const visibleTemplates = cat.templates.filter(filterTemplateItem);
          if (visibleTemplates.length === 0) return null;

          return (
            <div key={cat.id} className="space-y-4">
              <h2 className="text-base font-extrabold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
                <Layers className="w-4 h-4 text-orange-400" /> {cat.categoryName} ({visibleTemplates.length})
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleTemplates.map((t) => {
                  const isFav = favorites.includes(t.id);
                  const isCurrent = currentTemplate === t.id;
                  const caps = getTemplateCapabilities(t.id);

                  return (
                    <div
                      key={t.id}
                      className={`cyber-glass-card p-5 space-y-4 transition-all flex flex-col justify-between group border ${
                        isCurrent ? 'border-orange-500/60 bg-[var(--ox-surface-secondary)]' : 'hover:border-orange-500/50'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Real Miniature Thumbnail Component */}
                        <div className="h-44 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] p-2.5 relative overflow-hidden flex flex-col justify-between group-hover:scale-[1.01] transition-transform">
                          <div className="flex items-center justify-between z-10 mb-1">
                            <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[var(--ox-card-bg)] text-[var(--ox-text-primary)] border border-[var(--ox-border)] flex items-center gap-1 shadow-sm">
                              {caps.atsFriendly ? <ShieldCheck className="w-3 h-3 text-emerald-500" /> : <Sparkles className="w-3 h-3 text-amber-500" />}
                              {caps.atsFriendly ? 'ATS Friendly' : 'Creative Layout'}
                            </span>
                            
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => setGalleryTemplate(t)}
                                className="p-1.5 rounded-lg bg-[var(--ox-card-bg)] border border-[var(--ox-border)] hover:border-orange-500 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] cursor-pointer"
                                title="Inspect Full Screen Preview"
                              >
                                <Maximize2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => toggleFavorite(t.id)}
                                className="p-1.5 rounded-lg bg-[var(--ox-card-bg)] border border-[var(--ox-border)] hover:border-amber-500 cursor-pointer"
                              >
                                <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-500' : 'text-[var(--ox-text-muted)]'}`} />
                              </button>
                            </div>
                          </div>

                          <div className="flex-1 w-full relative">
                            <RealTemplateThumbnail template={t} />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-extrabold text-[var(--ox-text-primary)]">{caps.name}</h3>
                            {isCurrent && <span className="text-[10px] font-black text-orange-500 uppercase tracking-wider">Active</span>}
                          </div>
                          <p className="text-xs text-[var(--ox-text-secondary)] font-medium mt-1 leading-relaxed line-clamp-2">{caps.description}</p>
                        </div>

                        {/* Capability Badges Bar */}
                        <div className="flex flex-wrap gap-1.5 pt-1 text-[10px] font-bold">
                          <span className="px-2.5 py-0.5 rounded-md bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)]">
                            {caps.supportsTwoColumns ? '📐 Two Column' : '📄 Single Column'}
                          </span>

                          {caps.supportsPhoto ? (
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 border border-emerald-500/30">
                              📷 Supports Photo
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-md bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)] border border-[var(--ox-border)]">
                              🚫 Text Only
                            </span>
                          )}

                          {caps.supportsSidebar && (
                            <span className="px-2.5 py-0.5 rounded-md bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] border border-[var(--ox-border)]">
                              ⭐ Sidebar
                            </span>
                          )}

                          <span className="px-2.5 py-0.5 rounded-md bg-orange-500/10 text-orange-600 border border-orange-500/30">
                            🎨 {caps.accentColors?.length || 7} Accent Colors
                          </span>
                        </div>

                        {/* Accent Colors Preview Swatches */}
                        <div className="flex items-center gap-1.5 pt-1">
                          <span className="text-[10px] text-[var(--ox-text-secondary)] font-bold">Accent:</span>
                          {caps.accentColors.slice(0, 6).map((c) => (
                            <button
                              key={c}
                              onClick={() => handleSelectAccent(c)}
                              className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                                currentAccent === c ? 'scale-125 border-orange-500 ring-2 ring-orange-500/40' : 'border-slate-400/40 hover:scale-110'
                              }`}
                              style={{ backgroundColor: c }}
                              title={`Apply Accent Color ${c}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Card Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-[var(--ox-border)]">
                        <button
                          onClick={() => setCompareTemplate(t)}
                          className="text-xs font-bold text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] flex items-center gap-1 cursor-pointer"
                        >
                          <Sliders className="w-3.5 h-3.5 text-amber-500" /> Compare
                        </button>

                        <button
                          onClick={() => handleUseTemplate(t.id)}
                          className="px-4 py-2 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-lg shadow-sm transition-all flex items-center gap-1 cursor-pointer"
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

      {/* Full-Screen Preview Gallery Modal */}
      <AnimatePresence>
        {galleryTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-[#0B0D14] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4 relative max-h-[90vh] flex flex-col"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-white">{galleryTemplate.name} — Full Inspection</h3>
                  <p className="text-xs text-slate-400">Preview layout structure & dynamic capabilities</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setGalleryZoom((z) => Math.max(z - 10, 60))} className="p-1.5 text-slate-400 hover:text-white border border-slate-800 rounded-lg">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-slate-400">{galleryZoom}%</span>
                  <button onClick={() => setGalleryZoom((z) => Math.min(z + 10, 140))} className="p-1.5 text-slate-400 hover:text-white border border-slate-800 rounded-lg">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button onClick={() => setGalleryTemplate(null)} className="p-1.5 text-slate-400 hover:text-white ml-2">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-auto bg-slate-950 p-4 rounded-xl border border-slate-800 flex justify-center items-start">
                <div style={{ transform: `scale(${galleryZoom / 100})`, transformOrigin: 'top center' }} className="transition-transform w-full max-w-2xl">
                  <RealTemplateThumbnail template={galleryTemplate} />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                <div className="text-xs text-slate-400 font-medium">
                  {galleryTemplate.atsFriendly ? '✓ 100% ATS Parser Passed' : '✓ Creative Portfolio Ready'}
                </div>
                <button
                  onClick={() => {
                    handleUseTemplate(galleryTemplate.id);
                    setGalleryTemplate(null);
                  }}
                  className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl flex items-center gap-1.5"
                >
                  Apply & Open Builder <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Enhanced Compare Modal */}
      <AnimatePresence>
        {compareTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0B0D14] border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-5 relative"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-base font-extrabold text-white">Compare Layout Architecture</h3>
                  <p className="text-xs text-slate-400">Comparing current resume template vs selected candidate</p>
                </div>
                <button onClick={() => setCompareTemplate(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                {/* Active Template */}
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="text-[10px] font-bold uppercase text-slate-500 tracking-wider">Current Template</div>
                  <div className="text-sm font-black text-white capitalize">{currentTemplate}</div>
                  <div className="space-y-1 text-slate-400 pt-2 border-t border-slate-800">
                    <div>Photo Supported: <span className="text-white font-semibold">{getTemplateCapabilities(currentTemplate).supportsPhoto ? 'Yes' : 'No'}</span></div>
                    <div>ATS Friendly: <span className="text-white font-semibold">{getTemplateCapabilities(currentTemplate).atsFriendly ? 'Yes' : 'No'}</span></div>
                    <div>Column Format: <span className="text-white font-semibold">{getTemplateCapabilities(currentTemplate).supportsTwoColumns ? 'Two Column' : 'Single Column'}</span></div>
                  </div>
                </div>

                {/* Target Template */}
                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-2">
                  <div className="text-[10px] font-bold uppercase text-orange-400 tracking-wider">Target Template</div>
                  <div className="text-sm font-black text-white">{compareTemplate.name}</div>
                  <div className="space-y-1 text-slate-300 pt-2 border-t border-orange-500/20">
                    <div>Photo Supported: <span className="text-white font-semibold">{compareTemplate.supportsPhoto ? 'Yes' : 'No'}</span></div>
                    <div>ATS Friendly: <span className="text-white font-semibold">{compareTemplate.atsFriendly ? 'Yes' : 'No'}</span></div>
                    <div>Column Format: <span className="text-white font-semibold">{compareTemplate.supportsTwoColumns ? 'Two Column' : 'Single Column'}</span></div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button onClick={() => setCompareTemplate(null)} className="px-4 py-2 text-xs font-semibold text-slate-400">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleUseTemplate(compareTemplate.id);
                    setCompareTemplate(null);
                  }}
                  className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl"
                >
                  Apply & Open Builder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
