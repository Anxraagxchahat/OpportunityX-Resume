import React from 'react';
import { Eye, Download, Share2, Globe, Laptop } from 'lucide-react';

export const ResumeAnalyticsCard = () => {
  return (
    <div className="cyber-glass-card p-6 space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-base font-extrabold text-white flex items-center gap-2">
            <Eye className="w-5 h-5 text-emerald-400" /> Public Recruiter Analytics
          </h3>
          <p className="text-xs text-slate-400">Real-time public visit & download tracking</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-slate-400 font-semibold flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-emerald-400" /> Total Views
          </div>
          <div className="text-2xl font-black text-white">128</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-slate-400 font-semibold flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-orange-400" /> PDF Downloads
          </div>
          <div className="text-2xl font-black text-orange-400">42</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-slate-400 font-semibold flex items-center gap-1">
            <Share2 className="w-3.5 h-3.5 text-blue-400" /> Link Shares
          </div>
          <div className="text-2xl font-black text-blue-400">19</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-1">
          <div className="text-slate-400 font-semibold flex items-center gap-1">
            <Globe className="w-3.5 h-3.5 text-amber-400" /> Top Region
          </div>
          <div className="text-sm font-bold text-amber-400">India / US</div>
        </div>
      </div>
    </div>
  );
};
