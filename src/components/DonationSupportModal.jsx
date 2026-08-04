import React, { useState } from 'react';
import { X, Heart, Check, Copy, Sparkles, Coffee, ShieldCheck, ExternalLink, Download } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const PRESET_AMOUNTS = [
  { id: '10', label: '₹10', desc: 'Chai Support ☕' },
  { id: '50', label: '₹50', desc: 'Snack Support 🥪' },
  { id: '100', label: '₹100', desc: 'Server Supporter 🚀' },
  { id: '250', label: '₹250', desc: 'Ecosystem Backer ⭐' },
  { id: '500', label: '$5 / ₹500', desc: 'Hero Supporter 💎' }
];

export const DonationSupportModal = () => {
  const { isDonationModalOpen, setIsDonationModalOpen, activeResume } = useResume();
  const [selectedAmount, setSelectedAmount] = useState('50');
  const [copiedUPI, setCopiedUPI] = useState(false);
  const [hasContributed, setHasContributed] = useState(false);

  if (!isDonationModalOpen) return null;

  const candidateName = activeResume?.personal?.fullName || 'Candidate';
  const upiId = 'opportunityx@upi';

  const handleCopyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUPI(true);
    setTimeout(() => setCopiedUPI(false), 2000);
  };

  const handleSupportClick = () => {
    setHasContributed(true);
    // Open UPI or BuyMeACoffee payment URL
    window.open(`https://upiqr.in/pay?pa=${upiId}&pn=OpportunityX&am=${selectedAmount}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn no-print">
      <div className="bg-[#0B0D14] border border-orange-500/30 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={() => setIsDonationModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Success Header Badge */}
        <div className="flex flex-col items-center text-center space-y-2 pt-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center shadow-lg shadow-orange-500/20 text-black">
            <Sparkles className="w-6 h-6 stroke-[2.5]" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white flex items-center justify-center gap-1.5">
              🎉 Resume Downloaded!
            </h3>
            <p className="text-xs text-orange-400 font-semibold pt-0.5">
              Saved for {candidateName} (A4 PDF Standard)
            </p>
          </div>
        </div>

        {/* Free Ecosystem Mission Banner */}
        <div className="p-3.5 rounded-xl bg-orange-500/10 border border-orange-500/20 text-xs text-slate-300 leading-relaxed text-center space-y-1">
          <div className="font-bold text-white flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            100% Free Forever • Zero Watermark
          </div>
          <p className="text-[11px] text-slate-400">
            OpportunityX keeps all resume templates & ATS tools completely free for students and job seekers. If our builder saved you time, consider supporting our mission!
          </p>
        </div>

        {/* Preset Donation Amounts */}
        <div className="space-y-2">
          <div className="text-xs font-bold text-slate-300 flex items-center justify-between">
            <span>Select Support Amount (Optional)</span>
            <span className="text-[10px] text-orange-400 font-normal">Every rupee counts ❤️</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {PRESET_AMOUNTS.map((amt) => (
              <button
                key={amt.id}
                onClick={() => setSelectedAmount(amt.id)}
                className={`p-2.5 rounded-xl text-center border transition-all ${
                  selectedAmount === amt.id
                    ? 'bg-orange-500/20 border-orange-500 text-white font-extrabold shadow-md scale-[1.02]'
                    : 'bg-[#10131D] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="text-xs font-black">{amt.label}</div>
                <div className="text-[9px] text-slate-400 truncate">{amt.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* UPI Copy Block */}
        <div className="p-3 rounded-xl bg-[#10131D] border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <Coffee className="w-4 h-4 text-amber-400" />
            <div>
              <div className="text-[10px] text-slate-400">Direct UPI Support</div>
              <div className="font-mono font-bold text-slate-200">{upiId}</div>
            </div>
          </div>

          <button
            onClick={handleCopyUPI}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-[11px] font-semibold flex items-center gap-1 transition-colors"
          >
            {copiedUPI ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedUPI ? 'Copied!' : 'Copy UPI'}</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handleSupportClick}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg transition-all active:scale-95"
          >
            <Heart className="w-4 h-4 fill-black" />
            <span>Support OpportunityX Ecosystem</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setIsDonationModalOpen(false)}
            className="w-full py-2.5 rounded-xl bg-[#10131D] hover:bg-slate-900 text-slate-400 hover:text-slate-200 text-xs font-semibold transition-colors"
          >
            Continue Editing Resume
          </button>
        </div>
      </div>
    </div>
  );
};
