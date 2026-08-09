import React, { useState } from 'react';
import { X, UserCheck, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const profilesList = [
  'Software Developer',
  'Data Scientist',
  'UI/UX Designer',
  'Product Manager',
  'College Placement',
  'Internship Applicant'
];

export const presetsList = [
  { id: 'Fresher', title: 'Fresher & Entry Level', desc: 'Prioritizes education, academic projects, and core technical skills', template: 'compact-entry' },
  { id: 'Experienced', title: 'Experienced Professional', desc: 'Emphasizes high-impact work experience, achievements, and metrics', template: 'executive' },
  { id: 'Student', title: 'Student & Campus Placement', desc: 'Highlights coursework, honors, GPA, and hackathon wins', template: 'compact-entry' },
  { id: 'International', title: 'International Applicant', desc: 'ATS-friendly minimalist layout with clean global contact info', template: 'minimal' }
];

export const ProfilePresetsModal = () => {
  const { isProfilePresetsOpen, setIsProfilePresetsOpen, activeResume, applyResumePreset, updateActiveResume } = useResume();
  const [selectedProfile, setSelectedProfile] = useState(activeResume.metadata?.targetProfile || 'Software Developer');

  if (!isProfilePresetsOpen) return null;

  const handleProfileSelect = (prof) => {
    setSelectedProfile(prof);
    updateActiveResume((prev) => ({
      ...prev,
      metadata: { ...prev.metadata, targetProfile: prof }
    }));
  };

  const handleApplyPreset = (presetId) => {
    applyResumePreset(presetId);
    setIsProfilePresetsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={() => setIsProfilePresetsOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Career Profiles & Presets</h3>
            <p className="text-xs text-slate-400">Configure section order and target career profile</p>
          </div>
        </div>

        {/* 1. Target Profile Picker */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300">Target Career Profile</div>
          <div className="flex flex-wrap gap-1.5">
            {profilesList.map((prof) => {
              const isSel = selectedProfile === prof;
              return (
                <button
                  key={prof}
                  onClick={() => handleProfileSelect(prof)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isSel
                      ? 'bg-orange-500/20 text-orange-300 border-orange-500/50'
                      : 'bg-[#10131D] text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {prof}
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Ready-to-use Presets */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Apply Ready Presets
          </div>

          <div className="space-y-2">
            {presetsList.map((preset) => (
              <div
                key={preset.id}
                className="p-3 rounded-xl bg-[#10131D] border border-slate-800 hover:border-orange-500/40 transition-colors flex items-center justify-between gap-3"
              >
                <div>
                  <div className="text-xs font-bold text-white">{preset.title}</div>
                  <div className="text-[11px] text-slate-400">{preset.desc}</div>
                </div>

                <button
                  onClick={() => handleApplyPreset(preset.id)}
                  className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold flex items-center gap-1 transition-all whitespace-nowrap"
                >
                  <span>Apply</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsProfilePresetsOpen(false)}
            className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
