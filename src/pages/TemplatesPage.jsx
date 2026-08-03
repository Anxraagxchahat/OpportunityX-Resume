import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Search,
  Check,
  Star,
  Eye,
  Sparkles,
  ArrowRight,
  Filter,
  X
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { motion, AnimatePresence } from 'framer-motion';

export const templatesGallery = [
  { id: 'modern', title: 'Modern Full Stack', category: 'Developer', tag: 'Popular', desc: 'Sleek single-page layout optimized for tech companies and modern startups.', color: '#F97316' },
  { id: 'minimal', title: 'Minimalist ATS Standard', category: 'Minimal', tag: 'Recommended', desc: 'High-contrast typography designed for 100% ATS parser compatibility.', color: '#2563EB' },
  { id: 'tech', title: 'Senior Software Engineer', category: 'Developer', tag: 'Popular', desc: 'Emphasizes technical stack, metrics, and architecture contributions.', color: '#059669' },
  { id: 'student', title: 'Student & Intern Entry', category: 'Student', tag: 'Student', desc: 'Highlights coursework, campus projects, and hackathon wins.', color: '#7C3AED' },
  { id: 'executive', title: 'Engineering Director', category: 'Executive', tag: 'Recommended', desc: 'Designed for leadership, team management, and strategic impact.', color: '#EC4899' },
  { id: 'creative', title: 'Product & AI Engineer', category: 'AI Engineer', tag: 'New', desc: 'Clean creative styling with accent highlights and portfolio showcase.', color: '#F59E0B' }
];

export const categoriesList = [
  'All',
  'Developer',
  'Student',
  'Executive',
  'Minimal',
  'AI Engineer'
];

export const TemplatesPage = () => {
  const navigate = useNavigate();
  const { setTemplate } = useResume();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState(['modern']);
  const [previewTemplate, setPreviewTemplate] = useState(null);

  const filteredTemplates = templatesGallery.filter((t) => {
    const matchesCategory = selectedCategory === 'All' || t.category === selectedCategory;
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || t.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFavorite = (id) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((f) => f !== id));
    } else {
      setFavorites([...favorites, id]);
    }
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
          <Grid className="w-3.5 h-3.5" /> Professional Resume Templates
        </div>
        <h1 className="text-3xl font-black text-white">Templates Gallery</h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Curated resume designs built for maximum ATS readability. Choose a template to load into the live editor.
        </p>
      </div>

      {/* Controls: Search & Category Tabs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto custom-scrollbar pb-1 sm:pb-0">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-orange-500/10 text-orange-400 border border-orange-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-900/60'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
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

      {/* Templates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((t) => {
          const isFav = favorites.includes(t.id);
          return (
            <div
              key={t.id}
              className="cyber-glass-card p-5 space-y-4 hover:border-orange-500/50 transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                {/* Mock Card Graphic */}
                <div className="h-48 rounded-xl bg-slate-950 border border-slate-800 p-4 relative overflow-hidden flex flex-col justify-between group-hover:scale-[1.01] transition-transform">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/30">
                      {t.tag}
                    </span>
                    <button
                      onClick={() => toggleFavorite(t.id)}
                      className="p-1 rounded-lg bg-slate-900 border border-slate-800 hover:border-amber-400"
                    >
                      <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : 'text-slate-500'}`} />
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="h-3.5 w-2/3 rounded" style={{ backgroundColor: `${t.color}60` }} />
                    <div className="h-2 w-full rounded bg-slate-800" />
                    <div className="h-2 w-4/5 rounded bg-slate-800" />
                  </div>

                  <div className="pt-2 flex items-center gap-2">
                    <div className="h-2 w-16 rounded bg-slate-700" />
                    <div className="h-2 w-10 rounded bg-slate-800" />
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white">{t.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{t.desc}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <button
                  onClick={() => setPreviewTemplate(t)}
                  className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" /> Quick Preview
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

      {/* Preview Modal */}
      <AnimatePresence>
        {previewTemplate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#0B0D14] border border-orange-500/30 rounded-2xl p-6 shadow-2xl space-y-4 relative"
            >
              <div className="flex justify-between items-center pb-3 border-b border-slate-800">
                <div>
                  <h3 className="text-lg font-bold text-white">{previewTemplate.title}</h3>
                  <p className="text-xs text-slate-400">{previewTemplate.category} Format • {previewTemplate.tag}</p>
                </div>
                <button onClick={() => setPreviewTemplate(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="h-64 rounded-xl bg-white p-6 text-slate-900 font-sans shadow-inner overflow-hidden space-y-3 text-xs">
                <div className="border-b pb-3">
                  <div className="text-xl font-bold">Alex Rivera</div>
                  <div className="text-orange-600 font-semibold">{previewTemplate.title}</div>
                </div>
                <p className="text-slate-600">
                  Detailed preview representation showing crisp typography, spacing, and layout margins optimized for ATS compliance.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setPreviewTemplate(null)} className="px-4 py-2 text-xs font-semibold text-slate-400">
                  Close
                </button>
                <button
                  onClick={() => {
                    handleUseTemplate(previewTemplate.id);
                    setPreviewTemplate(null);
                  }}
                  className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl"
                >
                  Use Template in Builder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
