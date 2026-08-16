import React, { useState } from 'react';
import { Camera, Sparkles, Upload, Crop, Trash2, MoveVertical, Image as ImageIcon, Eye, EyeOff, Loader2 } from 'lucide-react';
import { SAMPLE_AVATARS, isPhotoTemplate, optimizeProfileImage } from '../../../utils/photoDefaults';
import { getTemplateCapabilities } from '../../../templates';

export const PhotoSection = ({
  metadata = {},
  assets = {},
  updateAssets,
  hiddenSections = [],
  toggleSectionVisibility,
  setIsPhotoCropOpen
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePhotoUpload = async (file) => {
    if (!file) return;
    try {
      setIsProcessing(true);
      const optimized = await optimizeProfileImage(file, 500, 500, 0.88);
      updateAssets('profilePhoto', optimized);
      setIsPhotoCropOpen(true);
    } catch (err) {
      console.error('[PhotoSection] Photo upload failed:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Camera className="w-4 h-4 text-orange-400" /> Profile Photo & Avatar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Upload or customize your profile photo for photo-enabled resume templates.
          </p>
        </div>
        <button
          onClick={() => toggleSectionVisibility('photo')}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
        >
          {hiddenSections.includes('photo') ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
          <span>{hiddenSections.includes('photo') ? 'Hidden in PDF' : 'Visible in PDF'}</span>
        </button>
      </div>

      {/* Active Template Status Badge */}
      <div className={`p-3.5 rounded-xl border text-xs flex items-start gap-3 ${
        isPhotoTemplate(metadata.template)
          ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
          : 'bg-orange-500/10 border-orange-500/30 text-orange-300'
      }`}>
        <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <div className="font-bold">
            {isPhotoTemplate(metadata.template)
              ? `Active Template (${metadata.template}) Features Profile Photo!`
              : `Current Template (${metadata.template || 'Modern ATS'}) does not display photos.`}
          </div>
          <div className="text-[11px] text-slate-300 mt-0.5 leading-relaxed">
            {isPhotoTemplate(metadata.template)
              ? 'Your photo will be rendered cleanly on the header or sidebar of your resume.'
              : 'Switch to a photo template (such as Marketing Accent, Creative Sidebar, Accent Column, Healthcare Calm, or Best Resume Ever series) in Templates page to display your photo.'}
          </div>
        </div>
      </div>

      {/* Photo Upload & Preview Card */}
      <div className="p-5 rounded-2xl bg-[#10131D] border border-slate-800 space-y-5 shadow-xl">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Current Photo Preview Circle */}
          <div className="relative group">
            <div className={`w-24 h-24 overflow-hidden border-2 border-orange-500/60 bg-slate-900 shadow-2xl flex items-center justify-center ${
              assets?.photoShape === 'square' ? 'rounded-md' : assets?.photoShape === 'rounded' ? 'rounded-2xl' : 'rounded-full'
            }`}>
              {assets?.profilePhoto ? (
                <img
                  src={assets.profilePhoto}
                  alt="Profile Preview"
                  className="w-full h-full object-cover transition-transform duration-100 ease-out"
                  style={{
                    transform: `translateY(${((50 - (assets?.photoOffsetY ?? 50)) / 50) * (96 * 0.45 * ((assets?.photoZoom || 100) / 100))}px) scale(${(assets?.photoZoom || 100) / 100})`,
                    transformOrigin: 'center center'
                  }}
                />
              ) : (
                <div className="text-center p-2">
                  <Camera className="w-8 h-8 text-slate-500 mx-auto" />
                  <span className="text-[9px] text-slate-500 font-semibold block mt-1">No Photo</span>
                </div>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex-1 space-y-3 w-full text-center sm:text-left">
            <div className="text-xs font-bold text-[var(--ox-text-primary)]">Upload & Position Photo</div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <label className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all cursor-pointer flex items-center gap-2 shadow-sm">
                {isProcessing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5 stroke-[2.5]" />}
                <span>{isProcessing ? 'Optimizing Image...' : 'Choose Photo File'}</span>
                <input
                  type="file"
                  accept="image/*"
                  disabled={isProcessing}
                  className="hidden"
                  onChange={(e) => handlePhotoUpload(e.target.files?.[0])}
                />
              </label>

              {assets?.profilePhoto && (
                <button
                  type="button"
                  onClick={() => setIsPhotoCropOpen(true)}
                  className="px-3.5 py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-500 border border-orange-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Crop className="w-3.5 h-3.5" /> Crop & Adjust Position
                </button>
              )}

              {assets?.profilePhoto && (
                <button
                  type="button"
                  onClick={() => updateAssets('profilePhoto', null)}
                  className="px-3.5 py-2 bg-[var(--ox-surface-secondary)] hover:bg-red-500/10 text-[var(--ox-text-secondary)] hover:text-red-500 border border-[var(--ox-border)] rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Remove
                </button>
              )}
            </div>
            <p className="text-[10px] text-[var(--ox-text-muted)] font-medium">Supports JPG, PNG, WEBP. Transformed on-device into Base64 format.</p>
          </div>
        </div>

        {/* Vertical Shift (Up / Down Offset Y) & Zoom Sliders */}
        <div className="pt-4 border-t border-[var(--ox-border)] space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)]">
              <span className="flex items-center gap-1">
                <MoveVertical className="w-3.5 h-3.5 text-orange-500" /> Vertical Photo Alignment (Up / Down Shift)
              </span>
              <span className="text-orange-500">{assets?.photoOffsetY ?? 50}%</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[11px] font-bold">
                {[
                  { label: 'Top (10%)', val: 10 },
                  { label: 'Center (50%)', val: 50 },
                  { label: 'Bottom (90%)', val: 90 }
                ].map((item) => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => updateAssets('photoOffsetY', item.val)}
                    className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all cursor-pointer ${
                      (assets?.photoOffsetY ?? 50) === item.val
                        ? 'bg-orange-500/20 text-orange-500 border-orange-500/50'
                        : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] border-[var(--ox-border)]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={assets?.photoOffsetY ?? 50}
                onChange={(e) => updateAssets('photoOffsetY', Number(e.target.value))}
                className="flex-1 accent-orange-500 cursor-pointer h-2 bg-[var(--ox-surface-secondary)] rounded-lg"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Photo Display Size</label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'sm', label: 'Small (64px)' },
                  { id: 'md', label: 'Medium (80px)' },
                  { id: 'lg', label: 'Large (96px)' }
                ].map((sz) => (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => updateAssets('photoSize', sz.id)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      (assets?.photoSize || 'md') === sz.id
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {sz.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-300">Photo Display Shape</label>
              <div className="flex items-center gap-2">
                {[
                  { id: 'circle', label: 'Circle' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'square', label: 'Square' }
                ].map((shp) => (
                  <button
                    key={shp.id}
                    type="button"
                    onClick={() => updateAssets('photoShape', shp.id)}
                    className={`flex-1 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      (assets?.photoShape || 'circle') === shp.id
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/50'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {shp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Capability-Driven Photo Position Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>Photo Layout Position</span>
              <span className="text-[10px] text-slate-500 font-normal">Controlled by Template Capabilities</span>
            </label>
            <div className="flex flex-wrap items-center gap-2">
              {[
                { id: 'top-left', label: 'Top Left' },
                { id: 'top-right', label: 'Top Right' },
                { id: 'center', label: 'Center' },
                { id: 'sidebar', label: 'Sidebar' },
                { id: 'hidden', label: 'Hidden' }
              ]
                .filter((pos) => {
                  const caps = getTemplateCapabilities(metadata?.template);
                  return caps.supportedPhotoPositions?.includes(pos.id);
                })
                .map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => updateAssets('photoPosition', pos.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
                      (assets?.photoPosition || 'top-left') === pos.id
                        ? 'bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-sm'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {/* Preset Sample Avatars */}
        <div className="pt-4 border-t border-slate-800/80 space-y-3">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-orange-400" /> Or Choose Preset Professional Headshot
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SAMPLE_AVATARS.map((av) => (
              <button
                key={av.id}
                onClick={() => updateAssets('profilePhoto', av.url)}
                className={`p-2 rounded-xl border flex items-center gap-2.5 transition-all text-left group ${
                  assets?.profilePhoto === av.url
                    ? 'bg-orange-500/10 border-orange-500 text-orange-300 shadow-[0_0_10px_rgba(249,115,22,0.15)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                }`}
              >
                <img src={av.url} alt={av.label} className="w-9 h-9 rounded-full object-cover border border-slate-700 flex-shrink-0" />
                <span className="text-[11px] font-semibold truncate leading-snug">{av.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
