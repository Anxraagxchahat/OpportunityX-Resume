/**
 * OpportunityX Resume — Semantic Theme Tokens
 * Centralized color definitions for:
 * 1. Dark Mode (Default / AMOLED Deep Black)
 * 2. Light Mode (Pure White & High Contrast)
 * 3. Monochromatic Mode (Zero Orange / Binary Black & White)
 */

export const THEME_TOKENS = {
  dark: {
    id: 'dark',
    name: 'Dark Mode',
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
    badgeBg: 'rgba(249, 115, 22, 0.10)',
    badgeText: '#F97316',
    badgeBorder: 'rgba(249, 115, 22, 0.30)',
    logoPath: '/brand/icon/dark/opportunityx-icon-dark.png',
    logoFullPath: '/brand/logo/dark/opportunityx-logo-dark.png',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  light: {
    id: 'light',
    name: 'Light Mode',
    background: '#FFFFFF',
    surfacePrimary: '#FAFAFA',
    surfaceSecondary: '#F3F4F6',
    cardBg: '#FFFFFF',
    cardHover: '#F9FAFB',
    border: '#E5E7EB',
    borderHighlight: 'rgba(249, 115, 22, 0.35)',
    textPrimary: '#0F172A',
    textSecondary: '#334155',
    textMuted: '#64748B',
    accent: '#F97316',
    accentHover: '#EA580C',
    accentGlow: 'rgba(249, 115, 22, 0.20)',
    badgeBg: 'rgba(249, 115, 22, 0.08)',
    badgeText: '#EA580C',
    badgeBorder: 'rgba(249, 115, 22, 0.25)',
    logoPath: '/brand/icon/light/opportunityx-icon-light.png',
    logoFullPath: '/brand/logo/light/opportunityx-logo-light.png',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444'
  },
  monochromatic: {
    id: 'monochromatic',
    name: 'Monochrome Mode',
    background: '#FFFFFF',
    surfacePrimary: '#F4F4F5',
    surfaceSecondary: '#E4E4E7',
    cardBg: '#FFFFFF',
    cardHover: '#F4F4F5',
    border: '#E4E4E7',
    borderHighlight: 'rgba(0, 0, 0, 0.40)',
    textPrimary: '#000000',
    textSecondary: '#52525B',
    textMuted: '#71717A',
    accent: '#000000',
    accentHover: '#27272A',
    accentGlow: 'rgba(0, 0, 0, 0.12)',
    badgeBg: 'rgba(0, 0, 0, 0.06)',
    badgeText: '#000000',
    badgeBorder: 'rgba(0, 0, 0, 0.20)',
    logoPath: '/brand/icon/monochrome/opportunityx-icon-monochrome.png',
    logoFullPath: '/brand/logo/monochrome/opportunityx-logo-monochrome.png',
    success: '#18181B',
    warning: '#27272A',
    error: '#000000'
  }
};

export default THEME_TOKENS;
