import React, { useState } from 'react';

/**
 * OpportunityX User Avatar Component
 *
 * Handles cross-origin referrer policy for Google & GitHub profile photos,
 * fallback initials generation, and broken image URL error recovery.
 */
export const UserAvatar = ({ user, size = "w-8 h-8", className = "" }) => {
  const [hasError, setHasError] = useState(false);

  const name = user?.displayName || user?.name || user?.email || 'User';
  const photoUrl = user?.photoURL || user?.avatarUrl;

  const initials = name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  if (photoUrl && !hasError) {
    return (
      <img
        src={photoUrl}
        alt={name}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`${size} rounded-full object-cover border border-orange-500/40 shadow-sm flex-shrink-0 ${className}`}
      />
    );
  }

  return (
    <div
      className={`${size} rounded-full bg-gradient-to-br from-orange-500 to-amber-600 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 border border-orange-400/40 shadow-sm ${className}`}
      title={name}
    >
      {initials}
    </div>
  );
};

export default UserAvatar;
