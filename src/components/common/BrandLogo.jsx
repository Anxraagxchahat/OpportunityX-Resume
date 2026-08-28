import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeProvider';

/**
 * BrandLogo — Official OpportunityX Canonical Brand Logo Component
 * Automatically resolves the authoritative logo asset based on active theme
 * (Dark Mode, Light Mode, or Monochromatic Mode).
 */
export const BrandLogo = ({
  variant = 'icon', // 'icon' | 'logo' | 'favicon'
  size = 'md',      // 'xs' | 'sm' | 'md' | 'lg' | 'xl' | custom class
  className = '',
  theme: explicitTheme = null,
  alt = 'OpportunityX Logo',
  showGlow = true
}) => {
  const { theme: activeTheme } = useTheme();
  const currentTheme = explicitTheme || activeTheme || 'dark';
  const [hasError, setHasError] = useState(false);

  // Asset Path Resolution based on Canonical Registry
  const getAssetSrc = () => {
    const mode = currentTheme === 'monochromatic' ? 'monochrome' : currentTheme === 'light' ? 'light' : 'dark';
    
    if (variant === 'favicon') {
      return `/brand/favicon/favicon-${mode}.png`;
    }
    if (variant === 'logo') {
      return `/brand/logo/${mode}/opportunityx-logo-${mode}.png`;
    }
    // Default: 'icon'
    return `/brand/icon/${mode}/opportunityx-icon-${mode}.png`;
  };

  // Pre-configured sizes
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-7 h-7',
    md: 'w-8 h-8',
    lg: 'w-10 h-10',
    xl: 'w-12 h-12'
  };

  const resolvedSize = sizeClasses[size] || size;

  // Glow styling per theme
  const glowClass = showGlow
    ? currentTheme === 'monochromatic'
      ? 'shadow-[0_0_10px_rgba(0,0,0,0.15)]'
      : currentTheme === 'light'
      ? 'shadow-[0_0_12px_rgba(249,115,22,0.2)]'
      : 'shadow-[0_0_15px_rgba(249,115,22,0.35)]'
    : '';

  if (hasError) {
    return (
      <div
        className={`${resolvedSize} rounded-full bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-xs shadow-md select-none shrink-0 ${className}`}
      >
        OX
      </div>
    );
  }

  return (
    <img
      src={getAssetSrc()}
      alt={alt}
      className={`${resolvedSize} rounded-full object-cover shrink-0 select-none transition-transform duration-200 ${glowClass} ${className}`}
      onError={() => {
        // Try fallback to root favicon.png first before error state
        setHasError(true);
      }}
      loading="eager"
      decoding="async"
    />
  );
};

export default BrandLogo;
