import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertTriangle, Lock, ShieldAlert, Server, Wrench, Home, ArrowLeft } from 'lucide-react';

export const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 text-center text-white">
      <div className="max-w-md space-y-6 cyber-glass-card p-8 rounded-3xl border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(249,115,22,0.2)]">
          <AlertTriangle className="w-8 h-8 animate-bounce" />
        </div>
        <div className="space-y-2">
          <span className="text-4xl font-black text-orange-400">404</span>
          <h1 className="text-2xl font-black">Page Not Found</h1>
          <p className="text-xs text-slate-400 leading-relaxed">
            The page or resume route you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex gap-3 justify-center pt-2">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2.5 text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 rounded-xl hover:text-white flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Go Back
          </button>
          <Link
            to="/dashboard"
            className="px-5 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export const UnauthorizedPage = () => (
  <div className="min-h-[85vh] flex items-center justify-center p-6 text-center text-white">
    <div className="max-w-md space-y-6 cyber-glass-card p-8 rounded-3xl border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(245,158,11,0.2)]">
        <Lock className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <span className="text-4xl font-black text-amber-400">401</span>
        <h1 className="text-2xl font-black">Authentication Required</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Please log in to access your OpportunityX Resume workspace, cloud drafts, and AI tools.
        </p>
      </div>
      <div className="flex gap-3 justify-center pt-2">
        <Link
          to="/dashboard"
          className="px-6 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md"
        >
          Sign In to Continue
        </Link>
      </div>
    </div>
  </div>
);

export const ForbiddenPage = () => (
  <div className="min-h-[85vh] flex items-center justify-center p-6 text-center text-white">
    <div className="max-w-md space-y-6 cyber-glass-card p-8 rounded-3xl border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
        <ShieldAlert className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <span className="text-4xl font-black text-rose-400">403</span>
        <h1 className="text-2xl font-black">Access Denied</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          You do not have permission to view or modify this resource.
        </p>
      </div>
      <div className="flex gap-3 justify-center pt-2">
        <Link
          to="/dashboard"
          className="px-6 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

export const ServerErrorPage = () => (
  <div className="min-h-[85vh] flex items-center justify-center p-6 text-center text-white">
    <div className="max-w-md space-y-6 cyber-glass-card p-8 rounded-3xl border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center mx-auto">
        <Server className="w-8 h-8" />
      </div>
      <div className="space-y-2">
        <span className="text-4xl font-black text-red-400">500</span>
        <h1 className="text-2xl font-black">Internal Server Error</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          Something went wrong on our end. Our engineering team has been notified.
        </p>
      </div>
      <div className="flex gap-3 justify-center pt-2">
        <Link
          to="/dashboard"
          className="px-6 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl shadow-md"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  </div>
);

export const MaintenancePage = () => (
  <div className="min-h-[85vh] flex items-center justify-center p-6 text-center text-white">
    <div className="max-w-md space-y-6 cyber-glass-card p-8 rounded-3xl border-slate-800">
      <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 flex items-center justify-center mx-auto">
        <Wrench className="w-8 h-8 animate-spin" />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-black text-orange-400">System Upgrades in Progress</h1>
        <p className="text-xs text-slate-400 leading-relaxed">
          OpportunityX Resume is undergoing scheduled maintenance to improve performance. Please check back shortly.
        </p>
      </div>
    </div>
  </div>
);
