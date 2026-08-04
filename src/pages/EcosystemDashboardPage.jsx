import React, { useState } from 'react';
import {
  Layers,
  ShieldCheck,
  Globe,
  Share2,
  RefreshCw,
  CheckCircle2,
  Lock,
  Sparkles,
  Key,
  UserCheck
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { getOrCreateUniversalIdentity } from '../services/ecosystem/identityManager';
import { ConnectedAppsManager } from '../components/ConnectedAppsManager';
import { EcosystemTimeline } from '../components/EcosystemTimeline';
import { ResumeAnalyticsCard } from '../components/ResumeAnalyticsCard';
import { PublicShareModal } from '../components/PublicShareModal';
import { generateVerificationDetails } from '../services/ecosystem/verificationEngine';
import { FEATURE_FLAGS } from '../services/ecosystem/featureFlags';

export const EcosystemDashboardPage = () => {
  const { activeResume } = useResume();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const identity = getOrCreateUniversalIdentity();
  const verification = generateVerificationDetails(activeResume, identity.oxId);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-semibold border border-orange-500/30">
            <Globe className="w-3.5 h-3.5" /> OpportunityX Unified Enterprise Ecosystem
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">OpportunityX Ecosystem Dashboard</h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Single source of truth career identity linked across all OpportunityX products.
          </p>
        </div>

        {/* Universal ID Badge */}
        <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-orange-400" />
          <div>
            <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Universal OpportunityX ID</div>
            <div className="text-sm font-black text-white font-mono">{identity.oxId}</div>
          </div>
        </div>
      </div>

      {/* Grid Row 1: Connected Apps & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ConnectedAppsManager />
          <ResumeAnalyticsCard />
        </div>

        {/* Right Sidebar: Verification Badge & Quick Share */}
        <div className="space-y-6">
          <div className="cyber-glass-card p-5 space-y-3 border-emerald-500/30">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-extrabold text-white">Verification Engine Status</h3>
            </div>
            <div className="space-y-1 text-xs text-slate-300">
              <div>Verification ID: <strong className="text-emerald-400 font-mono">{verification.verificationId}</strong></div>
              <div>Status: <span className="text-emerald-300 font-bold">100% Verified</span></div>
              <div className="text-[11px] text-slate-500 pt-1">Linked to verify.opportunityx.co.in</div>
            </div>
          </div>

          <div className="cyber-glass-card p-5 space-y-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Share2 className="w-4 h-4 text-orange-400" /> Public Share Link
            </h3>
            <p className="text-xs text-slate-400">Generate recruiter link with custom slug and QR code.</p>
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="w-full py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-black font-bold text-xs rounded-xl shadow-md"
            >
              Open Share & QR Settings
            </button>
          </div>
        </div>
      </div>

      {/* Timeline Row */}
      <EcosystemTimeline />

      <PublicShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </div>
  );
};
