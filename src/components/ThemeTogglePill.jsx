import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeProvider';

export const ThemeTogglePill = ({ className = '', compact = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center gap-1.5 ${
        compact ? 'w-11 h-11 min-h-[44px] min-w-[44px] p-0' : 'px-3 py-1.5 min-h-[44px]'
      } rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
        isDark
          ? 'bg-[#0A0A0A] border-[#1F1F1F] text-slate-200 hover:border-orange-500/50 hover:bg-[#141414]'
          : 'bg-white border-slate-200 text-slate-800 hover:border-orange-500/50 hover:bg-slate-50 shadow-sm'
      } ${className}`}
      title={`Current Theme: ${isDark ? 'Dark / AMOLED' : 'Light Mode'}. Click to toggle.`}
      aria-label="Toggle Theme"
    >
      <motion.div
        key={theme}
        initial={{ scale: 0.7, rotate: isDark ? -90 : 90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="flex items-center justify-center gap-1.5"
      >
        {isDark ? (
          <>
            <Moon className="w-4 h-4 text-amber-400 fill-amber-400/20" />
            {!compact && <span className="text-[11px] font-bold text-slate-300">AMOLED</span>}
          </>
        ) : (
          <>
            <Sun className="w-4 h-4 text-orange-500 fill-orange-500/20" />
            {!compact && <span className="text-[11px] font-bold text-slate-800">Light</span>}
          </>
        )}
      </motion.div>
    </button>
  );
};


export default ThemeTogglePill;
