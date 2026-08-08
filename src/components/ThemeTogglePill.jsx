import React from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeProvider';

export const ThemeTogglePill = ({ className = '' }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer select-none ${
        isDark
          ? 'bg-[#0A0A0A] border-[#1F1F1F] text-slate-200 hover:border-orange-500/50'
          : 'bg-white border-slate-200 text-slate-800 hover:border-orange-500/50 shadow-sm'
      } ${className}`}
      title={`Current Theme: ${isDark ? 'AMOLED Dark Mode' : 'Pure White Light Mode'}. Click to toggle.`}
      aria-label="Toggle Theme"
    >
      <motion.div
        key={theme}
        initial={{ scale: 0.7, rotate: isDark ? -90 : 90, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="flex items-center gap-1.5"
      >
        {isDark ? (
          <>
            <Moon className="w-3.5 h-3.5 text-amber-400 fill-amber-400/20" />
            <span className="text-[11px] font-bold text-slate-300">AMOLED</span>
          </>
        ) : (
          <>
            <Sun className="w-3.5 h-3.5 text-orange-500 fill-orange-500/20 animate-spin-slow" />
            <span className="text-[11px] font-bold text-slate-800">Light</span>
          </>
        )}
      </motion.div>
    </button>
  );
};

export default ThemeTogglePill;
