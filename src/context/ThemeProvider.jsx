import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import THEME_TOKENS from '../theme/themeTokens';

const THEME_STORAGE_KEY = 'opportunityx_theme_v2';
const VALID_THEMES = ['dark', 'light', 'monochromatic'];

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) || localStorage.getItem('opportunityx_theme_v1') || localStorage.getItem('opportunityx-theme');
      if (saved && VALID_THEMES.includes(saved)) return saved;
    } catch (e) {}
    return 'dark'; // Dark Mode default
  });

  const isDark = theme === 'dark';
  const isLight = theme === 'light';
  const isMono = theme === 'monochromatic';

  const tokens = useMemo(() => THEME_TOKENS[theme] || THEME_TOKENS.dark, [theme]);

  // Apply theme to DOM and CSS custom properties on <html>
  useEffect(() => {
    const root = document.documentElement;

    // Toggle theme attributes
    root.setAttribute('data-theme', theme);
    
    // Clear and set theme classes
    root.classList.remove('dark', 'light', 'monochromatic');
    root.classList.add(theme);

    // Set Semantic CSS Custom Properties
    const currentTokens = THEME_TOKENS[theme] || THEME_TOKENS.dark;
    root.style.setProperty('--ox-bg', currentTokens.background);
    root.style.setProperty('--ox-surface-primary', currentTokens.surfacePrimary);
    root.style.setProperty('--ox-surface-secondary', currentTokens.surfaceSecondary);
    root.style.setProperty('--ox-card-bg', currentTokens.cardBg);
    root.style.setProperty('--ox-card-hover', currentTokens.cardHover);
    root.style.setProperty('--ox-border', currentTokens.border);
    root.style.setProperty('--ox-border-highlight', currentTokens.borderHighlight);
    root.style.setProperty('--ox-text-primary', currentTokens.textPrimary);
    root.style.setProperty('--ox-text-secondary', currentTokens.textSecondary);
    root.style.setProperty('--ox-text-muted', currentTokens.textMuted);
    root.style.setProperty('--ox-accent', currentTokens.accent);

    // Sync browser chrome meta theme-color
    try {
      const metaThemeColor = document.querySelector('meta[name="theme-color"]');
      if (metaThemeColor) {
        metaThemeColor.setAttribute(
          'content',
          theme === 'dark' ? '#0A0A0A' : '#FFFFFF'
        );
      }
    } catch (e) {}

    // Save to LocalStorage
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
      localStorage.setItem('opportunityx-theme', theme);
    } catch (e) {}
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    if (VALID_THEMES.includes(newTheme)) {
      setThemeState(newTheme);
    }
  }, []);

  const cycleTheme = useCallback(() => {
    setThemeState((prev) => {
      const nextIndex = (VALID_THEMES.indexOf(prev) + 1) % VALID_THEMES.length;
      return VALID_THEMES[nextIndex];
    });
  }, []);

  const toggleTheme = cycleTheme;

  const value = useMemo(() => ({
    theme,
    isDark,
    isLight,
    isMono,
    setTheme,
    cycleTheme,
    toggleTheme,
    tokens
  }), [theme, isDark, isLight, isMono, setTheme, cycleTheme, toggleTheme, tokens]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeProvider;
