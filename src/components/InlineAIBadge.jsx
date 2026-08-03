import React from 'react';
import { Sparkles } from 'lucide-react';

export const InlineAIBadge = ({ label = "Improve with AI", onClick, size = "md" }) => {
  const isSm = size === "sm";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 font-medium transition-all duration-200 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 hover:border-orange-500/60 hover:text-orange-300 shadow-[0_0_12px_rgba(249,115,22,0.15)] hover:shadow-[0_0_18px_rgba(249,115,22,0.3)] ${
        isSm ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs'
      }`}
    >
      <Sparkles className={`animate-pulse ${isSm ? 'w-3 h-3' : 'w-3.5 h-3.5'} text-orange-400`} />
      <span>{label}</span>
    </button>
  );
};
