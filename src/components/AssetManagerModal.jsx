import React from 'react';
import { X, Image, Upload, Trash2, ShieldCheck, UserCheck, FileCheck } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const AssetManagerModal = () => {
  const { isAssetManagerOpen, setIsAssetManagerOpen, activeResume, updateAssets } = useResume();

  if (!isAssetManagerOpen) return null;

  const assets = activeResume.assets || { profilePhoto: null, digitalSignature: null, personalLogo: null };

  const handleFileUpload = (assetType, file) => {
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert("File size exceeds 2MB limit for local storage.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      updateAssets(assetType, e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const removeAsset = (assetType) => {
    updateAssets(assetType, null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative">
        <button
          onClick={() => setIsAssetManagerOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Image className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Resume Asset Manager</h3>
            <p className="text-xs text-slate-400">Manage profile photo, signature, and logos locally</p>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-orange-300 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <span>All assets are stored as compressed base64 data URLs in your browser. Zero cloud uploads.</span>
        </div>

        {/* Assets Cards Grid */}
        <div className="space-y-3">
          {/* 1. Profile Photo */}
          <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {assets.profilePhoto ? (
                <img src={assets.profilePhoto} alt="Profile" className="w-12 h-12 rounded-full object-cover border border-orange-500/40" />
              ) : (
                <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <UserCheck className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-white">Profile Photo</div>
                <div className="text-[11px] text-slate-400">Renders on Creative & Modern templates</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload('profilePhoto', e.target.files?.[0])} className="hidden" />
              </label>
              {assets.profilePhoto && (
                <button onClick={() => removeAsset('profilePhoto')} className="p-1.5 text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* 2. Digital Signature */}
          <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              {assets.digitalSignature ? (
                <img src={assets.digitalSignature} alt="Signature" className="h-10 max-w-[100px] object-contain border border-slate-800 rounded bg-white/90 p-1" />
              ) : (
                <div className="w-12 h-10 rounded bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
                  <FileCheck className="w-5 h-5" />
                </div>
              )}
              <div>
                <div className="text-xs font-bold text-white">Digital Signature</div>
                <div className="text-[11px] text-slate-400">Renders at bottom of resume</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <label className="px-3 py-1.5 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-semibold cursor-pointer transition-colors flex items-center gap-1">
                <Upload className="w-3.5 h-3.5" /> Upload
                <input type="file" accept="image/*" onChange={(e) => handleFileUpload('digitalSignature', e.target.files?.[0])} className="hidden" />
              </label>
              {assets.digitalSignature && (
                <button onClick={() => removeAsset('digitalSignature')} className="p-1.5 text-slate-500 hover:text-red-400">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={() => setIsAssetManagerOpen(false)}
            className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
