import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  LayoutDashboard,
  FileText,
  Grid,
  CheckCircle2,
  Upload,
  Wand2,
  Menu,
  X,
  PlayCircle,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../context/ResumeContext';

export const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { loadDemoResume } = useResume();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Builder', to: '/builder', icon: FileText },
    { label: 'Templates', to: '/templates', icon: Grid },
    { label: 'ATS Checker', to: '/ats-checker', icon: CheckCircle2 },
    { label: 'AI Assistant', to: '/ai-assistant', icon: Wand2, hideOnTablet: true },
    { label: 'Import', to: '/import', icon: Upload },
  ];

  const handleDemoClick = () => {
    loadDemoResume();
    navigate('/builder');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#05070D]/90 backdrop-blur-md border-b border-white/[0.06]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-[72px] flex items-center justify-between gap-4">

        {/* 1. BRAND AREA (DESKTOP & TABLET: LEFT ALIGNED; MOBILE: CENTERED WITH HAMBURGER ON LEFT) */}

        {/* Mobile Left Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white bg-[#0B0D14] border border-white/[0.06] flex-shrink-0"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Brand Area: Circular Logo + OpportunityX Text + RESUME Badge Below */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0 mx-auto md:mx-0">
          {/* Circular Logo Badge */}
          <img
            src="/favicon.png"
            alt="OpportunityX Logo"
            className="w-9 h-9 rounded-full object-cover flex-shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.25)] group-hover:scale-105 transition-transform"
          />

          {/* Vertical Text Column: OpportunityX Top, RESUME Pill Badge Underneath */}
          <div className="flex flex-col justify-center text-left">
            <span className="text-lg font-black tracking-tight text-[#E5E7EB] font-sans leading-none">
              Opportunity<span className="text-[#F97316]">X</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 w-max mt-1 leading-none shadow-[0_0_8px_rgba(249,115,22,0.12)]">
              RESUME
            </span>
          </div>
        </Link>

        {/* 2. NAVIGATION ITEMS (DESKTOP & TABLET CAPSULE CONTAINER WITH SUBTLE ORANGE DOT INDICATOR) */}
        <nav className="hidden md:flex items-center gap-1 bg-[#0B0D14] p-1.5 rounded-[16px] border border-white/[0.06] relative">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            if (item.hideOnTablet) {
              // Hide AI Assistant on tablet viewports if space is constrained
            }
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`relative flex flex-col items-center justify-center px-3 py-1.5 xl:px-4 xl:py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                  item.hideOnTablet ? 'hidden xl:flex' : 'flex'
                } ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-[#E5E7EB]/70 hover:text-white hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-1.5 relative z-10">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#F97316]' : 'text-slate-400'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </div>

                {/* Subtle Orange Active Dot Indicator underneath (Matching image spec) */}
                {isActive && (
                  <motion.div
                    layoutId="activeDot"
                    className="w-1.5 h-1.5 rounded-full bg-[#F97316] shadow-[0_0_8px_#F97316] mt-1"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. RIGHT ACTIONS (TRY DEMO RESUME + CREATE RESUME PRIMARY CTA) */}
        <div className="flex items-center gap-2.5 flex-shrink-0">
          <button
            onClick={handleDemoClick}
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-[#F97316] bg-[#F97316]/10 hover:bg-[#F97316]/20 border border-[#F97316]/30 rounded-[12px] transition-all shadow-[0_0_12px_rgba(249,115,22,0.1)] whitespace-nowrap"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>Try Demo Resume</span>
          </button>

          {/* Primary Create Resume Button */}
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              to="/builder"
              className="px-4 py-2 sm:px-5 sm:py-2.5 text-xs font-bold text-black bg-gradient-to-r from-[#F97316] to-[#F59E0B] hover:from-[#EA580C] hover:to-[#D97706] rounded-[12px] shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:shadow-[0_0_28px_rgba(249,115,22,0.5)] transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Create Resume</span>
            </Link>
          </motion.div>
        </div>
      </div>

      {/* 5. RESPONSIVE MOBILE DRAWER */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#0B0D14] border-b border-white/[0.06] px-4 py-4 space-y-2"
          >
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-colors ${
                  location.pathname === item.to
                    ? 'bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30'
                    : 'text-[#E5E7EB] hover:bg-slate-900'
                }`}
              >
                <item.icon className="w-4 h-4 text-[#F97316]" />
                <span>{item.label}</span>
              </Link>
            ))}
            <div className="pt-2 border-t border-white/[0.06] flex flex-col gap-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleDemoClick();
                }}
                className="w-full py-2.5 text-xs font-semibold text-[#F97316] bg-[#F97316]/10 border border-[#F97316]/30 rounded-xl flex items-center justify-center gap-2"
              >
                <PlayCircle className="w-4 h-4" /> Try Demo Resume
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
