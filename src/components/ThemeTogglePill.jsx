import React from 'react';
import { Moon, Sun, CircleDot } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeProvider';

export const ThemeTogglePill = ({ className = '', compact = false, segmented = false }) => {
  const { theme, setTheme, cycleTheme, isDark, isLight, isMono } = useTheme();

  const themes = [
    { id: 'dark', label: 'Dark', icon: Moon },
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'monochromatic', label: 'Mono', icon: CircleDot }
  ];

  if (segmented) {
    return (
      <div
        role="radiogroup"
        aria-label="Color theme switcher"
        className={`inline-flex items-center rounded-xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] p-1 shadow-sm ${className}`}
      >
        {themes.map((t) => {
          const isSelected = theme === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={`${t.label} theme`}
              onClick={() => setTheme(t.id)}
              className={`relative flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all duration-150 active:scale-[0.96] cursor-pointer ${
                isSelected
                  ? 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] shadow-sm border border-[var(--ox-border-highlight)] font-extrabold'
                  : 'text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)]/50 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${
                isSelected
                  ? isMono ? 'text-black' : isDark ? 'text-amber-400' : 'text-orange-500'
                  : 'text-slate-400'
              }`} />
              <span className="hidden sm:inline">{t.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // Pill / Button mode
  const currentThemeObj = themes.find((t) => t.id === theme) || themes[0];
  const Icon = currentThemeObj.icon;

  const getThemeColorClass = () => {
    if (isMono) return 'text-black fill-black/20';
    if (isDark) return 'text-amber-400 fill-amber-400/20';
    return 'text-orange-500 fill-orange-500/20';
  };

  const getThemeNameDisplay = () => {
    if (isMono) return 'Monochrome';
    if (isDark) return 'Dark';
    return 'Light';
  };

  return (
    <button
      onClick={cycleTheme}
      type="button"
      className={`relative inline-flex items-center justify-center gap-1.5 ${
        compact ? 'w-10 h-10 min-h-[40px] min-w-[40px] p-0' : 'px-3 py-1.5 min-h-[40px]'
      } rounded-xl border border-[var(--ox-border)] bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] hover:border-orange-500/50 active:scale-95 transition-all duration-200 cursor-pointer select-none ${className}`}
      title={`Theme: ${getThemeNameDisplay()}. Click to switch theme (Dark / Light / Monochrome)`}
      aria-label={`Current Theme: ${getThemeNameDisplay()}. Click to switch theme.`}
    >
      <motion.div
        key={theme}
        initial={{ scale: 0.7, rotate: -30, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 350, damping: 25 }}
        className="flex items-center justify-center gap-1.5"
      >
        <Icon className={`w-4 h-4 ${getThemeColorClass()}`} />
        {!compact && (
          <span className="text-[11px] font-bold tracking-tight text-[var(--ox-text-primary)]">
            {getThemeNameDisplay()}
          </span>
        )}
      </motion.div>
    </button>
  );
};

export default ThemeTogglePill;
