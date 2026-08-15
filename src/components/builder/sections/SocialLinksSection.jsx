import React from 'react';
import { Share2, Plus, Globe, Trash2 } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../icons/BrandIcons';

export const SocialLinksSection = ({
  personal = {},
  updatePersonal
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Share2 className="w-4 h-4 text-orange-400" /> Social & Portfolio Links
        </h2>
        <button
          type="button"
          onClick={() => {
            const currentCustom = Array.isArray(personal.customLinks) ? personal.customLinks : [];
            updatePersonal('customLinks', [...currentCustom, { id: `link-${Date.now()}`, label: '', url: '' }]);
          }}
          className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/30 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Add Link
        </button>
      </div>

      {/* Primary Link Fields */}
      <div className="space-y-3">
        <div className="text-xs font-bold text-slate-300">Standard Profiles & Websites</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-400" /> Personal Portfolio / Website
            </label>
            <input
              type="text"
              value={personal.website || personal.portfolio || ''}
              onChange={(e) => {
                updatePersonal('website', e.target.value);
                updatePersonal('portfolio', e.target.value);
              }}
              placeholder="e.g. alexrivera.dev or myportfolio.com"
              className="w-full min-h-[42px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <GithubIcon className="w-3.5 h-3.5 text-orange-400" /> GitHub Profile
            </label>
            <input
              type="text"
              value={personal.github || ''}
              onChange={(e) => updatePersonal('github', e.target.value)}
              placeholder="e.g. github.com/alexrivera"
              className="w-full min-h-[42px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <LinkedinIcon className="w-3.5 h-3.5 text-orange-400" /> LinkedIn Profile
            </label>
            <input
              type="text"
              value={personal.linkedin || ''}
              onChange={(e) => updatePersonal('linkedin', e.target.value)}
              placeholder="e.g. linkedin.com/in/alexrivera-dev"
              className="w-full min-h-[42px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-orange-400" /> Twitter / X Profile
            </label>
            <input
              type="text"
              value={personal.twitter || ''}
              onChange={(e) => updatePersonal('twitter', e.target.value)}
              placeholder="e.g. x.com/alexrivera"
              className="w-full min-h-[42px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Custom Links List */}
      {Array.isArray(personal.customLinks) && personal.customLinks.length > 0 && (
        <div className="space-y-3 pt-3 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300">Custom Social & Platform Links</div>
          <div className="space-y-3">
            {personal.customLinks.map((link, idx) => (
              <div key={link.id || idx} className="p-3 rounded-xl bg-[#10131D] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-orange-400">{link.label || `Custom Link #${idx + 1}`}</span>
                  <button
                    type="button"
                    onClick={() => {
                      const filtered = personal.customLinks.filter((_, i) => i !== idx);
                      updatePersonal('customLinks', filtered);
                    }}
                    className="p-1 text-slate-500 hover:text-red-400 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={link.label || ''}
                    onChange={(e) => {
                      const updated = personal.customLinks.map((cl, i) => (i === idx ? { ...cl, label: e.target.value } : cl));
                      updatePersonal('customLinks', updated);
                    }}
                    placeholder="e.g. LeetCode / Kaggle / Dribbble"
                    className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={link.url || ''}
                    onChange={(e) => {
                      const updated = personal.customLinks.map((cl, i) => (i === idx ? { ...cl, url: e.target.value } : cl));
                      updatePersonal('customLinks', updated);
                    }}
                    placeholder="e.g. leetcode.com/u/alexrivera"
                    className="bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
