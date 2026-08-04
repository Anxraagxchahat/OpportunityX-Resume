import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, ShieldCheck, Mail, LogIn, LogOut, Check } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

const GithubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

export const AuthModal = ({ isOpen, onClose }) => {
  const { session, handleLogin, handleLogout } = useResume();
  const [email, setEmail] = useState('');

  if (!isOpen) return null;

  const onSubmitEmail = (e) => {
    e.preventDefault();
    if (email.trim()) {
      handleLogin(email.trim(), 'Email');
      onClose();
    }
  };

  const onOAuthLogin = (provider, defaultEmail) => {
    handleLogin(defaultEmail, provider);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Reassurance */}
        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300 font-semibold text-center">
          Resume Builder remains free forever. Login unlocks AI & Cloud sync.
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <LogIn className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">OpportunityX Account</h3>
            <p className="text-xs text-slate-400">Universal ecosystem authentication</p>
          </div>
        </div>

        {/* Current Session Banner */}
        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
          <div>
            <span className="text-slate-400">Session Status: </span>
            <strong className={session.isAuthenticated && !session.isGuest ? "text-emerald-400" : "text-amber-400"}>
              {session.isAuthenticated && !session.isGuest ? `Logged In (${session.user?.email})` : 'Guest Mode'}
            </strong>
          </div>
          {session.isAuthenticated && !session.isGuest && (
            <button
              onClick={() => {
                handleLogout();
                onClose();
              }}
              className="px-2 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/30 rounded-lg text-[10px] font-bold flex items-center gap-1"
            >
              <LogOut className="w-3 h-3" /> Logout
            </button>
          )}
        </div>

        {/* Login Benefits */}
        <div className="p-3.5 rounded-xl bg-[#10131D] border border-slate-800 space-y-2">
          <span className="text-xs font-bold text-slate-300">Login gives you:</span>
          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-semibold text-emerald-400">5 Welcome AI Credits</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Full Access to AI Features</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Cloud Backup & Recovery</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Multi-device Resume Sync</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Purchased Credits Storage</span>
            </div>
          </div>
        </div>

        {/* OAuth Buttons */}
        {(!session.isAuthenticated || session.isGuest) && (
          <>
            <div className="space-y-2">
              <button
                onClick={() => onOAuthLogin('Google', 'google.user@opportunityx.dev')}
                className="w-full py-2.5 rounded-xl bg-[#10131D] hover:bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <span>Continue with Google OAuth</span>
              </button>

              <button
                onClick={() => onOAuthLogin('GitHub', 'github.user@opportunityx.dev')}
                className="w-full py-2.5 rounded-xl bg-[#10131D] hover:bg-slate-900 border border-slate-800 text-xs font-bold text-slate-200 flex items-center justify-center gap-2 transition-colors"
              >
                <GithubIcon className="w-4 h-4" /> Continue with GitHub
              </button>
            </div>

            {/* Email Form */}
            <form onSubmit={onSubmitEmail} className="space-y-3 pt-3 border-t border-slate-800">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300">Or Login via Email</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your.name@opportunityx.dev"
                    className="w-full bg-[#10131D] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-md"
              >
                Authenticate & Claim 5 Credits
              </button>
            </form>
          </>
        )}
      </div>
    </div>,
    document.body
  );
};

