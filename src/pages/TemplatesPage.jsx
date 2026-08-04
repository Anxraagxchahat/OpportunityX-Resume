import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Search,
  Check,
  Star,
  Sparkles,
  ArrowRight,
  Sliders,
  X,
  Layers
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { TEMPLATE_CATEGORIES } from '../templates';
import { RealTemplateThumbnail } from '../components/template/RealTemplateThumbnail';
import { motion, AnimatePresence } from 'framer-motion';

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const { setTemplate, activeResume } = useResume();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState(['modern', 'creative', 'fullstack']);
  const [compareTemplate, setCompareTemplate] = useState(null);

  const currentTemplate = activeResume.metadata?.template || 'modern';

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) setFavorites(favorites.filter((f) => f !== id));
    else setFavorites([...favorites, id]);
  };

  const handleUseTemplate = (templateId) => {
    setTemplate(templateId);
    navigate('/builder');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/30">
          <Grid className="w-3.5 h-3.5" /> Native OpportunityX Template Engine
        </div>
        <h1 className="text-3xl font-black text-white">Professional Template Marketplace</h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Switches presentation, layout, and typography instantly without mutating or losing your resume data.
        </p>
      </div>

      {/* Controls: Search Bar & Categories */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0 text-xs font-semibold">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl border transition-all ${
              selectedCategory === 'all' ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-slate-900 text-slate-400 border-slate-800'
            }`}
          >
            All Templates
          </button>

          {TEMPLATE_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-xl border transition-all whitespace-nowrap ${
                selectedCategory === cat.id ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-slate-900 text-slate-400 border-slate-800'
              }`}
            >
              {cat.categoryName}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full bg-[#0B0D14] border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Categorized Templates Grid */}
      <div className="space-y-10">
        {TEMPLATE_CATEGORIES.filter((c) => selectedCategory === 'all' || selectedCategory === c.id).map((cat) => (
          <div key={cat.id} className="space-y-4">
            <h2 className="text-base font-extrabold text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <Layers className="w-4 h-4 text-orange-400" /> {cat.categoryName} ({cat.templates.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cat.templates
                .filter((t) => !searchQuery.trim() || t.name.toLowerCase().includes(searchQuery.toLowerCase()))
                .map((t) => {
                  const isFav = favorites.includes(t.id);
                  const isCurrent = currentTemplate === t.id;
                  return (
                    <div
                      key={t.id}
                      className={`cyber-glass-card p-5 space-y-4 transition-all flex flex-col justify-between group border ${
                        isCurrent ? 'border-orange-500/60 bg-[#0E111B]' : 'hover:border-orange-500/50'
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Real Miniature Thumbnail Component */}
                        <div className="h-44 rounded-xl bg-slate-950 border border-slate-800 p-2.5 relative overflow-hidden flex flex-col justify-between group-hover:scale-[1.01] transition-transform">
                          <div className="flex items-center justify-between z-10 mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40">
                              {t.atsFriendly ? 'ATS 100%' : 'Creative'}
                            </span>
                            <button
                              onClick={() => toggleFavorite(t.id)}
                              className="p-1 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-400"
                            >
                              <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                            </button>
                          </div>

                          <div className="flex-1 w-full relative">
                            <RealTemplateThumbnail template={t} />
                          </div>
                        </div>

                        <div>
                          <div className="flex items-center justify-between">
                            <h3 className="text-base font-bold text-white">{t.name}</h3>
                            {isCurrent && <span className="text-[10px] font-extrabold text-orange-400">Active</span>}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.description}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                        <button
                          onClick={() => setCompareTemplate(t)}
                          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                        >
                          <Sliders className="w-3.5 h-3.5 text-amber-400" /> Compare
                        </button>

                        <button
                          onClick={() => handleUseTemplate(t.id)}
                          className="px-3.5 py-1.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-lg shadow-sm transition-all flex items-center gap-1"
                        >
                          Use Template <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* Compare Modal */}
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
                  <h3 className="text-base font-extrabold text-white">Compare Templates</h3>
                  <p className="text-xs text-slate-400">Comparing current layout vs selected template</p>
                </div>
                <button onClick={() => setCompareTemplate(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <div className="text-xs font-bold text-slate-400">Current Template</div>
                  <div className="text-sm font-black text-white capitalize">{currentTemplate}</div>
                </div>

                <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30 space-y-1">
                  <div className="text-xs font-bold text-orange-400">Target Template</div>
                  <div className="text-sm font-black text-white">{compareTemplate.name}</div>
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
