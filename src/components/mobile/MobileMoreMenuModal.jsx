import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, User, Upload, Download, Palette, Activity, History,
  Sparkles, FileText, LayoutDashboard, Grid, CheckCircle2,
  Wand2, Shield, HelpCircle, LogOut, ArrowRight, ExternalLink
} from 'lucide-react';
import { GithubIcon as Github } from '../GithubIcon';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';

export const MobileMoreMenuModal = () => {
  const navigate = useNavigate();
  const {
    session,
    logout,
    setIsAuthOpen,
    setIsExportCenterOpen,
    setIsThemeCustomizerOpen,
    setIsInspectorOpen,
    setIsOpportunityXImportModalOpen,
    setIsGitHubImportModalOpen
  } = useResume();

  const { isMoreMenuOpen, setIsMoreMenuOpen, setActiveTab } = useMobileNavigation();

  if (!isMoreMenuOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/85 backdrop-blur-md animate-fadeIn no-print select-none">
      <div className="bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] rounded-t-3xl w-full max-h-[90dvh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-[var(--ox-border)] flex items-center justify-between bg-[var(--ox-surface-secondary)]/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 font-bold">
              OX
            </div>
            <div>
              <h3 className="text-base font-black text-[var(--ox-text-primary)]">OpportunityX Menu</h3>
              <p className="text-xs text-[var(--ox-text-secondary)]">
                {session.isAuthenticated && !session.isGuest ? session.user?.name : 'Guest Session'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsMoreMenuOpen(false)}
            className="p-2.5 rounded-xl bg-[var(--ox-surface-secondary)] text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 space-y-5 overflow-y-auto custom-scrollbar flex-1 pb-safe">
          
          {/* Quick SaaS Tools */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-black text-[var(--ox-text-muted)] tracking-wider">
              Resume Tools & Actions
            </h4>
            
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsExportCenterOpen(true);
                }}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 font-bold text-xs cursor-pointer min-h-[48px]"
              >
                <Download className="w-4 h-4" />
                <span>Export Center</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  navigate('/import');
                }}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] font-bold text-xs cursor-pointer min-h-[48px]"
              >
                <Upload className="w-4 h-4 text-purple-400" />
                <span>Import Resume</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsThemeCustomizerOpen(true);
                }}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] font-bold text-xs cursor-pointer min-h-[48px]"
              >
                <Palette className="w-4 h-4 text-amber-400" />
                <span>Theme & Colors</span>
              </button>

              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsInspectorOpen(true);
                }}
                className="flex items-center gap-2.5 p-3 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] font-bold text-xs cursor-pointer min-h-[48px]"
              >
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Quality Inspector</span>
              </button>
            </div>
          </div>

          {/* Integrations & Profiles */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-black text-[var(--ox-text-muted)] tracking-wider">
              Integrations & Data Sync
            </h4>

            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                setIsOpportunityXImportModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] font-semibold text-xs min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-orange-400" />
                <span>Sync OpportunityX Profile</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>

            <button
              onClick={() => {
                setIsMoreMenuOpen(false);
                setIsGitHubImportModalOpen(true);
              }}
              className="w-full flex items-center justify-between p-3 rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] font-semibold text-xs min-h-[44px]"
            >
              <div className="flex items-center gap-2.5">
                <Github className="w-4 h-4 text-purple-400" />
                <span>Import GitHub Projects</span>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* Ecosystem Pages Navigation */}
          <div className="space-y-2">
            <h4 className="text-[10px] uppercase font-black text-[var(--ox-text-muted)] tracking-wider">
              Application Navigation
            </h4>

            <div className="space-y-1">
              {[
                { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
                { label: 'Builder', to: '/builder', icon: FileText },
                { label: 'Templates Gallery', to: '/templates', icon: Grid },
                { label: 'ATS Intelligence', to: '/ats-checker', icon: CheckCircle2 },
                { label: 'AI Suite', to: '/ai-assistant', icon: Wand2 }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.to}
                    onClick={() => {
                      setIsMoreMenuOpen(false);
                      navigate(item.to);
                    }}
                    className="w-full flex items-center gap-3 p-3 rounded-2xl bg-[var(--ox-surface-secondary)]/50 border border-transparent hover:border-[var(--ox-border)] text-[var(--ox-text-primary)] font-semibold text-xs min-h-[44px] cursor-pointer"
                  >
                    <Icon className="w-4 h-4 text-orange-400" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Legal & Account Actions */}
          <div className="pt-2 border-t border-[var(--ox-border)] space-y-2">
            {session.isAuthenticated && !session.isGuest ? (
              <button
                onClick={() => {
                  logout();
                  setIsMoreMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold text-xs min-h-[44px]"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out ({session.user?.email})</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setIsMoreMenuOpen(false);
                  setIsAuthOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-orange-500 text-white font-bold text-xs min-h-[44px] shadow-md"
              >
                <User className="w-4 h-4" />
                <span>Sign In / Create Account</span>
              </button>
            )}

            <div className="flex items-center justify-center gap-4 text-[11px] text-[var(--ox-text-muted)] pt-2 font-medium">
              <button onClick={() => { setIsMoreMenuOpen(false); navigate('/legal/privacy'); }}>Privacy Policy</button>
              <span>•</span>
              <button onClick={() => { setIsMoreMenuOpen(false); navigate('/legal/terms'); }}>Terms of Service</button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default MobileMoreMenuModal;
