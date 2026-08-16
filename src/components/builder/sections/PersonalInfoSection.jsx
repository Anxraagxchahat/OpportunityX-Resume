import React from 'react';
import { User, Eye, EyeOff, Camera } from 'lucide-react';
import { isPhotoTemplate } from '../../../utils/photoDefaults';

export const PersonalInfoSection = ({
  personal = {},
  updatePersonal,
  metadata = {},
  assets = {},
  hiddenSections = [],
  toggleSectionVisibility,
  setActiveSection
}) => {
  const isEmailValid = !personal.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personal.email);

  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <User className="w-4 h-4 text-orange-400" /> Personal Information
        </h2>
        <button
          onClick={() => toggleSectionVisibility('personal')}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1"
        >
          {hiddenSections.includes('personal') ? (
            <EyeOff className="w-3.5 h-3.5 text-amber-400" />
          ) : (
            <Eye className="w-3.5 h-3.5 text-slate-400" />
          )}
          <span>{hiddenSections.includes('personal') ? 'Hidden in PDF' : 'Visible in PDF'}</span>
        </button>
      </div>

      {/* Profile Photo Quick Card */}
      <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 flex items-center justify-between gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-slate-900 border border-orange-500/40 overflow-hidden flex items-center justify-center flex-shrink-0 shadow-md">
            {assets?.profilePhoto ? (
              <img src={assets.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <Camera className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Profile Photo</span>
              {isPhotoTemplate(metadata.template) ? (
                <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">Active on Template</span>
              ) : (
                <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded border border-slate-700">Photo Template Feature</span>
              )}
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5">
              {assets?.profilePhoto
                ? (isPhotoTemplate(metadata.template) ? 'Photo is active on this template' : 'Photo saved (displays when photo template is active)')
                : 'Upload your headshot or select a sample avatar'}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setActiveSection('photo')}
          className="px-3.5 py-1.5 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
        >
          <Camera className="w-3.5 h-3.5" /> Manage Photo
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Full Name *</label>
          <input
            type="text"
            value={personal.fullName || ''}
            onChange={(e) => updatePersonal('fullName', e.target.value)}
            placeholder="e.g. Alex Rivera"
            className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Job Title / Target Role</label>
          <input
            type="text"
            value={personal.jobTitle || ''}
            onChange={(e) => updatePersonal('jobTitle', e.target.value)}
            placeholder="e.g. Senior Full Stack Software Engineer"
            className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300 flex justify-between">
            <span>Email Address *</span>
            {!isEmailValid && <span className="text-red-400 text-[10px]">Invalid Format</span>}
          </label>
          <input
            type="email"
            value={personal.email || ''}
            onChange={(e) => updatePersonal('email', e.target.value)}
            placeholder="e.g. alex.rivera@opportunityx.dev"
            className={`w-full min-h-[44px] bg-[#10131D] border rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:outline-none ${
              !isEmailValid ? 'border-red-500/80 text-red-200' : 'border-slate-800 focus:border-orange-500'
            }`}
          />
        </div>
        <div className="space-y-1">
          <label className="text-xs font-semibold text-slate-300">Phone Number</label>
          <input
            type="text"
            value={personal.phone || ''}
            onChange={(e) => updatePersonal('phone', e.target.value)}
            placeholder="e.g. +1 (555) 234-5678"
            className="w-full min-h-[44px] bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
        <div className="space-y-1 lg:col-span-2">
          <label className="text-xs font-semibold text-slate-300">Location</label>
          <input
            type="text"
            value={personal.location || ''}
            onChange={(e) => updatePersonal('location', e.target.value)}
            placeholder="e.g. San Francisco, CA / Remote"
            className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-medium text-white focus:border-orange-500 focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
