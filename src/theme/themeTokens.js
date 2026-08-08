/**
 * OpportunityX Resume — Semantic Theme Tokens
 * Centralized color definitions for AMOLED Black (Dark) & Pure White (Light) modes.
 */

export const THEME_TOKENS = {
  dark: {
    name: 'AMOLED Black',
    background: '#000000',
    surfacePrimary: '#0A0A0A',
    surfaceSecondary: '#111111',
    cardBg: '#0A0A0A',
    cardHover: '#141414',
    border: '#1F1F1F',
    borderHighlight: 'rgba(249, 115, 22, 0.35)',
    textPrimary: '#FFFFFF',
    textSecondary: '#B3B3B3',
    textMuted: '#737373',
    accent: '#F97316',
    accentHover: '#EA580C',
    accentGlow: 'rgba(249, 115, 22, 0.25)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  light: {
    name: 'Pure White',
    background: '#FFFFFF',
    surfacePrimary: '#FAFAFA',
    surfaceSecondary: '#F3F4F6',
    cardBg: '#FFFFFF',
    cardHover: '#F9FAFB',
    border: '#E5E7EB',
    borderHighlight: 'rgba(249, 115, 22, 0.35)',
    textPrimary: '#111111',
    textSecondary: '#4B5563',
    textMuted: '#6B7280',
    accent: '#F97316',
    accentHover: '#EA580C',
    accentGlow: 'rgba(249, 115, 22, 0.2)',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  }
};

export default THEME_TOKENS;
