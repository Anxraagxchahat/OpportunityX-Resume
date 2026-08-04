import React from 'react';

export const RealTemplateThumbnail = ({ template }) => {
  const { supportsSidebar, isDoubleColumn, accentColor = '#F97316' } = template;

  if (supportsSidebar) {
    return (
      <div className="w-full h-full bg-white rounded border border-slate-700 overflow-hidden flex text-[6px]">
        {/* Left Sidebar */}
        <div className="w-[35%] p-1.5 space-y-1 text-white" style={{ backgroundColor: accentColor }}>
          <div className="w-5 h-5 rounded-full bg-white/30 mx-auto" />
          <div className="h-1.5 w-full bg-white/80 rounded" />
          <div className="h-1 w-3/4 bg-white/60 rounded" />
          <div className="pt-1 space-y-0.5">
            <div className="h-1 w-full bg-white/40 rounded" />
            <div className="h-1 w-5/6 bg-white/40 rounded" />
          </div>
        </div>

        {/* Right Main Body */}
        <div className="w-[65%] p-2 space-y-1.5 text-slate-800">
          <div className="h-1.5 w-1/2 rounded" style={{ backgroundColor: accentColor }} />
          <div className="h-1 w-full bg-slate-200 rounded" />
          <div className="h-1 w-5/6 bg-slate-200 rounded" />
          <div className="pt-1 space-y-1">
            <div className="h-1 w-1/3 bg-slate-300 rounded font-bold" />
            <div className="h-1 w-full bg-slate-100 rounded" />
            <div className="h-1 w-4/5 bg-slate-100 rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-white rounded border border-slate-700 p-2 space-y-1.5 text-[6px] text-slate-800">
      {/* Top Header */}
      <div className="border-b pb-1 space-y-0.5" style={{ borderColor: accentColor }}>
        <div className="h-2 w-1/2 rounded" style={{ backgroundColor: accentColor }} />
        <div className="h-1 w-1/3 bg-slate-400 rounded" />
        <div className="h-0.5 w-full bg-slate-200 rounded" />
      </div>

      {/* Body Lines */}
      <div className="space-y-1 pt-0.5">
        <div className="h-1 w-1/4 rounded font-bold" style={{ backgroundColor: `${accentColor}80` }} />
        <div className="h-1 w-full bg-slate-100 rounded" />
        <div className="h-1 w-5/6 bg-slate-100 rounded" />
        <div className="h-1 w-4/5 bg-slate-100 rounded" />
      </div>

      <div className="space-y-1 pt-0.5">
        <div className="h-1 w-1/4 rounded font-bold" style={{ backgroundColor: `${accentColor}80` }} />
        <div className="h-1 w-full bg-slate-100 rounded" />
        <div className="h-1 w-3/4 bg-slate-100 rounded" />
      </div>
    </div>
  );
};
