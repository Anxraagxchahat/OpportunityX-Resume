import React from 'react';

/**
 * OpportunityX Resume — Unified Skeleton Primitive
 * Provides customizable width, height, radius, variants and shimmer animations.
 */
export const Skeleton = ({
  className = '',
  variant = 'rectangular', // 'text' | 'circular' | 'rectangular' | 'card'
  width,
  height,
  style = {},
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'text':
        return 'h-3.5 w-full rounded-md';
      case 'circular':
        return 'rounded-full flex-shrink-0';
      case 'card':
        return 'rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)]';
      case 'rectangular':
      default:
        return 'rounded-lg';
    }
  };

  const customStyle = {
    ...(width ? { width } : {}),
    ...(height ? { height } : {}),
    ...style,
  };

  return (
    <div
      className={`ox-skeleton ${getVariantStyles()} ${className}`}
      style={customStyle}
      aria-hidden="true"
      {...props}
    />
  );
};

export const SkeletonText = ({ lines = 3, className = '', lastLineWidth = '70%' }) => {
  return (
    <div className={`space-y-2.5 ${className}`}>
      {Array.from({ length: lines }).map((_, idx) => (
        <Skeleton
          key={idx}
          variant="text"
          className="h-3"
          style={idx === lines - 1 ? { width: lastLineWidth } : undefined}
        />
      ))}
    </div>
  );
};

export const SkeletonAvatar = ({ size = 44, className = '' }) => {
  return (
    <Skeleton
      variant="circular"
      width={size}
      height={size}
      className={className}
    />
  );
};

export const SkeletonButton = ({ width = 110, height = 38, className = '' }) => {
  return (
    <Skeleton
      variant="rectangular"
      width={width}
      height={height}
      className={`rounded-xl ${className}`}
    />
  );
};

export default Skeleton;
