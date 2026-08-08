import React, { useState, useEffect } from 'react';
import { Shield, Cookie, Check, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const COOKIE_CONSENT_KEY = 'ox_cookie_consent_v1';

export const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true
    analytics: true,
    performance: true
  });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(COOKIE_CONSENT_KEY);
      if (!saved) {
        // Delay 1 second for smooth entry
        const timer = setTimeout(() => setIsVisible(true), 1000);
        return () => clearTimeout(timer);
      }
    } catch (e) {}
  }, []);

  const handleAcceptAll = () => {
    const consent = { essential: true, analytics: true, performance: true, timestamp: new Date().toISOString() };
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    } catch (e) {}
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    const consent = { essential: true, analytics: false, performance: false, timestamp: new Date().toISOString() };
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    } catch (e) {}
    setIsVisible(false);
  };

  const handleSaveCustom = () => {
    const consent = { ...preferences, essential: true, timestamp: new Date().toISOString() };
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(consent));
    } catch (e) {}
    setShowCustomizeModal(false);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Floating Bottom Cookie Consent Banner */}
      <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-[9990] bg-[var(--ox-surface-primary)] border border-orange-500/40 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl p-5 text-xs space-y-4 animate-fadeIn no-print text-[var(--ox-text-primary)]">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20 shrink-0">
            <Cookie className="w-5 h-5 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="font-extrabold text-[var(--ox-text-primary)] text-sm flex items-center gap-2">
              Cookie & Privacy Choice
            </h4>
            <p className="text-[var(--ox-text-secondary)] text-[11px] leading-relaxed">
              We use essential cookies to maintain your login session and anonymous analytics to improve OpportunityX. Learn more in our{' '}
              <Link to="/legal/cookie-policy" className="text-orange-500 underline font-bold hover:text-orange-400">
                Cookie Policy
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={handleAcceptAll}
            className="flex-1 py-2.5 px-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold rounded-xl shadow-md text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Check className="w-3.5 h-3.5" /> Accept All
          </button>
          <button
            onClick={handleRejectNonEssential}
            className="py-2.5 px-3 bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] text-[var(--ox-text-primary)] border border-[var(--ox-border)] font-bold rounded-xl text-xs transition-colors"
          >
            Essential Only
          </button>
          <button
            onClick={() => setShowCustomizeModal(true)}
            className="p-2.5 bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] border border-[var(--ox-border)] rounded-xl transition-colors flex items-center justify-center"
            title="Customize Preferences"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Customize Preferences Modal */}
      {showCustomizeModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
          <div className="bg-[var(--ox-surface-primary)] border border-orange-500/40 rounded-2xl w-full max-w-md p-6 space-y-5 text-xs relative text-[var(--ox-text-primary)] shadow-2xl">
            <button
              onClick={() => setShowCustomizeModal(false)}
              className="absolute top-4 right-4 text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/20">
                <Settings className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[var(--ox-text-primary)]">Cookie Preferences</h3>
                <p className="text-[var(--ox-text-secondary)] text-[11px]">Customize which cookies you want to enable.</p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[var(--ox-text-primary)]">Essential Cookies</div>
                  <div className="text-[10px] text-[var(--ox-text-muted)]">Required for authentication & active drafts</div>
                </div>
                <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">Always Active</span>
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[var(--ox-text-primary)]">Analytics Cookies</div>
                  <div className="text-[10px] text-[var(--ox-text-muted)]">Helps us understand feature usage anonymously</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.analytics}
                  onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] flex items-center justify-between">
                <div>
                  <div className="font-bold text-[var(--ox-text-primary)]">Performance Cookies</div>
                  <div className="text-[10px] text-[var(--ox-text-muted)]">Optimizes page load speeds & caching</div>
                </div>
                <input
                  type="checkbox"
                  checked={preferences.performance}
                  onChange={(e) => setPreferences({ ...preferences, performance: e.target.checked })}
                  className="w-4 h-4 accent-orange-500 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleSaveCustom}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold rounded-xl text-xs shadow-md transition-all"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </>
  );
};
