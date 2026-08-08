/**
 * OpportunityX Resume — Authentication Loading Screen
 *
 * Full-screen branded splash shown while Firebase resolves initial auth state.
 * Prevents UI flickering. Theme-aware (AMOLED dark / light mode).
 */
import React from 'react';

export const AuthLoadingScreen = () => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        width: '100vw',
        background: 'var(--ox-bg, #000000)',
        color: 'var(--ox-text-primary, #FFFFFF)',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 99999,
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        transition: 'background-color 0.25s ease',
      }}
    >
      <style>
        {`
          @keyframes ox-auth-spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes ox-auth-pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
          @keyframes ox-auth-fade-in {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>

      {/* Logo Mark */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '28px',
          animation: 'ox-auth-fade-in 0.5s ease-out',
        }}
      >
        {/* Glow */}
        <div
          style={{
            position: 'absolute',
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #F97316, #F59E0B)',
            filter: 'blur(40px)',
            opacity: 0.35,
            borderRadius: '50%',
          }}
        />

        {/* Spinner Ring */}
        <div
          style={{
            width: '48px',
            height: '48px',
            border: '3px solid rgba(249, 115, 22, 0.15)',
            borderTopColor: '#F97316',
            borderRadius: '50%',
            animation: 'ox-auth-spin 0.8s linear infinite',
            position: 'relative',
            zIndex: 2,
          }}
        />
      </div>

      {/* Brand */}
      <h1
        style={{
          fontSize: '1.35rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          margin: '0 0 6px 0',
          animation: 'ox-auth-fade-in 0.5s ease-out 0.1s both',
        }}
      >
        Opportunity
        <span style={{ color: '#F97316' }}>X</span>
        {' '}
        <span style={{ fontWeight: 500, opacity: 0.7 }}>Resume</span>
      </h1>

      <p
        style={{
          color: 'var(--ox-text-secondary, #B3B3B3)',
          fontSize: '0.8rem',
          fontWeight: 500,
          margin: 0,
          animation: 'ox-auth-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        }}
      >
        Authenticating secure session...
      </p>
    </div>
  );
};
