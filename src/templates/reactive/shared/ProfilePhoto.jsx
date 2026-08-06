import React from 'react';

export const ProfilePhoto = ({ src, size = 64, borderRadius = '50%', borderColor, borderWidth = 2 }) => {
  if (!src) return null;
  return (
    <img
      src={src}
      alt="Profile"
      className="object-cover flex-shrink-0"
      style={{
        width: size,
        height: size,
        borderRadius,
        border: borderColor ? `${borderWidth}px solid ${borderColor}` : 'none'
      }}
    />
  );
};
