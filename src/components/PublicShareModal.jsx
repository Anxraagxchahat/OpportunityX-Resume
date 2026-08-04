import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Share2, Copy, Check, QrCode, Lock, Globe, Eye } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const PublicShareModal = ({ isOpen, onClose }) => {
  const { activeResume } = useResume();
  const [slug, setSlug] = useState((activeResume.metadata?.title || 'anurag-verma').toLowerCase().replace(/[^a-z0-9]/g, '-'));
  const [copied, setCopied] = useState(false);
  const [visibility, setVisibility] = useState('public');

  if (!isOpen) return null;

  const publicUrl = `https://resume.opportunityx.co.in/u/${slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Public Resume Link & QR Code</h3>
            <p className="text-xs text-slate-400">Generate a live shareable recruiter link and QR code</p>
          </div>
        </div>

        {/* Public URL Box */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-300">Custom Recruiter Public Slug</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 bg-[#10131D] border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={handleCopyLink}
              className="px-4 py-2 bg-orange-500 hover:bg-orange-400 text-black font-bold text-xs rounded-xl flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div className="text-[11px] text-slate-500 font-mono">Live URL: {publicUrl}</div>
        </div>

        {/* SVG QR Code Simulation */}
        <div className="p-4 rounded-xl bg-white/95 border border-slate-300 flex items-center justify-between text-black">
          <div className="space-y-1">
            <div className="text-xs font-black">Scan to View Public Resume</div>
            <div className="text-[10px] text-slate-600 font-mono">resume.opportunityx.co.in/u/{slug}</div>
          </div>
          <div className="w-16 h-16 bg-black p-1 rounded flex items-center justify-center text-white">
            <QrCode className="w-12 h-12" />
          </div>
        </div>

        {/* Visibility Controls */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <label className="text-xs font-bold text-slate-300">Visibility Setting</label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {['public', 'unlisted', 'private'].map((v) => (
              <button
                key={v}
                onClick={() => setVisibility(v)}
                className={`py-1.5 rounded-xl capitalize font-bold border transition-all ${
                  visibility === v ? 'bg-orange-500/20 text-orange-300 border-orange-500/50' : 'bg-[#10131D] text-slate-400 border-slate-800'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-2 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl"
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
