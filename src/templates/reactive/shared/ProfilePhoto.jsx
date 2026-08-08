import React from 'react';

export const ProfilePhoto = ({
  src,
  size = 64,
  photoSize,
  shape,
  position,
  offsetY = 50,
  zoom = 100,
  borderRadius,
  borderColor,
  borderWidth = 2
}) => {
  if (!src || position === 'hidden') return null;

  // Resolve size
  let computedSize = size;
  if (photoSize === 'sm') computedSize = 64;
  else if (photoSize === 'md') computedSize = 80;
  else if (photoSize === 'lg') computedSize = 96;

  // Resolve border radius from shape
  let computedRadius = borderRadius || '50%';
  if (shape === 'square') computedRadius = '8px';
  else if (shape === 'rounded') computedRadius = '18px';
  else if (shape === 'circle') computedRadius = '50%';

  // Calculate physical Y translation (in pixels) relative to frame size so up/down shift works smoothly at any zoom level
  const scale = (zoom || 100) / 100;
  const maxShiftPx = (computedSize * 0.45) * scale;
  const shiftYPx = ((50 - (offsetY ?? 50)) / 50) * maxShiftPx;

  return (
    <div
      className="overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-sm"
      style={{
        width: computedSize,
        height: computedSize,
        borderRadius: computedRadius,
        border: borderColor ? `${borderWidth}px solid ${borderColor}` : 'none'
      }}
    >
      <img
        src={src}
        alt="Profile"
        className="w-full h-full object-cover transition-transform duration-100 ease-out"
        style={{
          transform: `translateY(${shiftYPx}px) scale(${scale})`,
          transformOrigin: 'center center'
        }}
      />
    </div>
  );
};
