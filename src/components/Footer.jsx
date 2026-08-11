import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Heart,
  Sparkles,
  UserCheck,
  Mail
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

// ─── Official Social SVG Icons ───────────────────────────────────────────────

const LinkedInIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

const GitHubIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const InstagramIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const YoutubeIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

const XIcon = ({ className = "w-3.5 h-3.5" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon = ({ className = "w-4 h-4" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

// Verified Official Social Destinations from OpportunityX Main
const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/128134073',
    icon: LinkedInIcon,
    ariaLabel: 'OpportunityX on LinkedIn',
    colorHover: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40'
  },
  {
    name: 'GitHub',
    url: 'https://github.com/Anxraagxchahat/opportunityx',
    icon: GitHubIcon,
    ariaLabel: 'OpportunityX on GitHub',
    colorHover: 'hover:text-purple-400 hover:border-purple-500/40'
  },
  {
    name: 'Instagram',
    url: 'https://www.instagram.com/theopportunityx/',
    icon: InstagramIcon,
    ariaLabel: 'OpportunityX on Instagram',
    colorHover: 'hover:text-[#E4405F] hover:border-[#E4405F]/40'
  },
  {
    name: 'YouTube',
    url: 'https://www.youtube.com/@theopportunityX',
    icon: YoutubeIcon,
    ariaLabel: 'OpportunityX on YouTube',
    colorHover: 'hover:text-[#FF0000] hover:border-[#FF0000]/40'
  },
  {
    name: 'X (Twitter)',
    url: 'https://x.com/TheOpportunityX',
    icon: XIcon,
    ariaLabel: 'OpportunityX on X',
    colorHover: 'hover:text-amber-400 hover:border-amber-400/40'
  },
  {
    name: 'Facebook',
    url: 'https://www.facebook.com/profile.php?id=61590766896275',
    icon: FacebookIcon,
    ariaLabel: 'OpportunityX on Facebook',
    colorHover: 'hover:text-[#1877F2] hover:border-[#1877F2]/40'
  },
  {
    name: 'Email',
    url: 'mailto:hello@opportunityx.co.in',
    icon: Mail,
    ariaLabel: 'OpportunityX Email',
    colorHover: 'hover:text-emerald-400 hover:border-emerald-500/40'
  }
];

export const Footer = () => {
  const { setIsDonationModalOpen } = useResume();
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Accordion toggle state for mobile viewports (<768px)
  const [openSection, setOpenSection] = useState(null);

  const toggleMobileSection = (sec) => {
    setOpenSection((prev) => (prev === sec ? null : sec));
  };

  const handleEmailClick = (e, url) => {
    if (url.startsWith('mailto:')) {
      if (navigator.clipboard) {
        navigator.clipboard.writeText('hello@opportunityx.co.in');
        setCopiedEmail(true);
        setTimeout(() => setCopiedEmail(false), 2500);
      }
    }
  };

  return (
    <footer className="bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] text-xs text-[var(--ox-text-secondary)] transition-colors duration-300 no-print select-none">

      {/* Email Copied Toast Banner */}
      {copiedEmail && (
        <div className="fixed bottom-20 right-4 z-50 px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-2xl animate-fadeIn flex items-center gap-2">
          <Mail className="w-4 h-4" aria-hidden="true" />
          <span>Email copied! (hello@opportunityx.co.in)</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">

        {/* ═══ MAIN RESPONSIVE CONTAINER ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ─── LEFT COLUMN: Brand Block & Social Icons (lg:col-span-4) ─── */}
          <div className="lg:col-span-4 space-y-4">

            {/* Brand Title + Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group w-max focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl p-1 -m-1"
              aria-label="OpportunityX Resume Home"
            >
              <img
                src="/favicon.png"
                alt="OpportunityX Logo"
                className="w-9 h-9 rounded-full object-cover shrink-0 shadow-[0_0_12px_rgba(249,115,22,0.35)] group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col justify-center text-left">
                <span className="text-base font-black tracking-tight text-[var(--ox-text-primary)] font-sans leading-none">
                  Opportunity<span className="text-[#F97316]">X</span> Resume
                </span>
                <span className="text-[9px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 w-max mt-1 leading-none">
                  OFFICIAL ECOSYSTEM PRODUCT
                </span>
              </div>
            </Link>

            {/* Product Description */}
            <p className="text-xs text-[var(--ox-text-secondary)] leading-relaxed max-w-sm">
              Official Ecosystem Product by OpportunityX. Build professional, ATS-friendly resumes completely free with zero watermark and enterprise-grade privacy.
            </p>

            {/* Icon-Only Social Media Row (All 44x44px Touch Targets) */}
            <div className="pt-1">
              <div className="flex flex-wrap items-center gap-2">
                {SOCIAL_LINKS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <a
                      key={s.name}
                      href={s.url}
                      target={s.url.startsWith('mailto:') ? '_self' : '_blank'}
                      rel="noopener noreferrer"
                      aria-label={s.ariaLabel}
                      title={s.name}
                      onClick={(e) => handleEmailClick(e, s.url)}
                      className={`w-10 h-10 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-secondary)] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${s.colorHover}`}
                      style={{ minWidth: 40, minHeight: 40 }}
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ─── RIGHT COLUMN: 2-ROW CONTAINER (lg:col-span-8) ─── */}
          <div className="lg:col-span-8 space-y-6">

            {/* ── Desktop & Tablet View (>=768px) ── */}
            <div className="hidden md:space-y-6 md:block">

              {/* Row 1: Side-by-Side (Resume Tools | Legal) */}
              <div className="grid grid-cols-2 gap-8 pb-6 border-b border-[var(--ox-border)]">

                {/* Resume Tools */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--ox-text-primary)]">
                    Resume Tools
                  </h3>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/builder" className="hover:text-orange-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1">
                        Resume Editor
                      </Link>
                    </li>
                    <li>
                      <Link to="/templates" className="hover:text-orange-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1">
                        Templates Gallery
                      </Link>
                    </li>
                    <li>
                      <Link to="/ats-checker" className="hover:text-orange-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1">
                        ATS Scanner & Score
                      </Link>
                    </li>
                    <li>
                      <Link to="/ai-assistant" className="hover:text-orange-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1">
                        AI Content Enhancer
                      </Link>
                    </li>
                    <li>
                      <Link to="/import" className="hover:text-orange-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1">
                        Import PDF / JSON
                      </Link>
                    </li>
                  </ul>
                </div>

                {/* Legal */}
                <div className="space-y-3">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--ox-text-primary)]">
                    Legal
                  </h3>
                  <ul className="space-y-2 text-xs">
                    <li>
                      <Link to="/legal/privacy-policy" className="hover:text-orange-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1">
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/legal/terms-and-conditions" className="hover:text-orange-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1">
                        Terms & Conditions
                      </Link>
                    </li>
                    <li>
                      <Link to="/legal/refund-policy" className="hover:text-orange-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1">
                        Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/legal/cookie-policy" className="hover:text-orange-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1">
                        Cookie Policy
                      </Link>
                    </li>
                    <li>
                      <Link to="/legal/ai-policy" className="hover:text-orange-400 transition-colors font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1 -mx-1">
                        AI Usage Policy
                      </Link>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Row 2: Support & Ecosystem Section */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[var(--ox-surface-secondary)]/50 border border-[var(--ox-border)] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--ox-text-primary)] flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-orange-500" aria-hidden="true" />
                    <span>Support & Ecosystem</span>
                  </h3>

                  {/* Explore Ecosystem Link */}
                  <a
                    href="https://opportunityx.co.in"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-orange-400 hover:underline flex items-center gap-1 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1"
                    aria-label="Explore OpportunityX Ecosystem (opens in new tab)"
                  >
                    <span>Explore OpportunityX Ecosystem</span>
                    <ExternalLink className="w-3 h-3" aria-hidden="true" />
                  </a>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">

                  {/* Meet the Founder Card */}
                  <div className="p-3.5 rounded-xl bg-[var(--ox-card-bg)] border border-[var(--ox-border)] space-y-1.5 flex flex-col justify-between">
                    <div>
                      <Link
                        to="/meet-the-founder"
                        className="text-xs font-bold text-[var(--ox-text-primary)] hover:text-orange-400 flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded"
                        aria-label="Meet the Founder page"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" aria-hidden="true" />
                        <span>Meet the Founder</span>
                        <ChevronDown className="w-3 h-3 text-orange-500 -rotate-90 shrink-0" aria-hidden="true" />
                      </Link>
                      <p className="text-[11px] text-[var(--ox-text-muted)] leading-relaxed mt-1">
                        Meet the founder, explore the vision behind OpportunityX, and follow the journey of building the ecosystem.
                      </p>
                    </div>
                  </div>

                  {/* Support OpportunityX Card */}
                  <div className="p-3.5 rounded-xl bg-[var(--ox-card-bg)] border border-[var(--ox-border)] space-y-2 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-[var(--ox-text-primary)] flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 shrink-0" aria-hidden="true" />
                        <span>Support OpportunityX</span>
                      </div>
                      <p className="text-[11px] text-[var(--ox-text-muted)] leading-relaxed mt-1">
                        Help us continue building free tools and opportunities for students.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsDonationModalOpen(true)}
                      className="w-full py-1.5 px-3 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 text-xs font-bold transition-all cursor-pointer text-center active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                      aria-label="Support or Donate to OpportunityX"
                    >
                      Support / Donate
                    </button>
                  </div>

                </div>
              </div>

            </div>

            {/* ── Mobile View (<768px): Collapsible Accordion Sections ── */}
            <div className="space-y-2.5 md:hidden">

              {/* Accordion 1: Resume Tools */}
              <div className="rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] overflow-hidden">
                <button
                  id="mobile-footer-tools-trigger"
                  onClick={() => toggleMobileSection('tools')}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)] min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  aria-expanded={openSection === 'tools'}
                  aria-controls="mobile-footer-tools-content"
                >
                  <span>Resume Tools</span>
                  {openSection === 'tools' ? (
                    <ChevronUp className="w-4 h-4 text-orange-500" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--ox-text-muted)]" aria-hidden="true" />
                  )}
                </button>
                {openSection === 'tools' && (
                  <div
                    id="mobile-footer-tools-content"
                    role="region"
                    aria-labelledby="mobile-footer-tools-trigger"
                    className="p-3.5 pt-0 border-t border-[var(--ox-border)]/50 space-y-1 text-xs animate-fadeIn"
                  >
                    <Link to="/builder" className="py-2 text-[var(--ox-text-secondary)] hover:text-orange-400 min-h-[44px] flex items-center">
                      Resume Editor
                    </Link>
                    <Link to="/templates" className="py-2 text-[var(--ox-text-secondary)] hover:text-orange-400 min-h-[44px] flex items-center">
                      Templates Gallery
                    </Link>
                    <Link to="/ats-checker" className="py-2 text-[var(--ox-text-secondary)] hover:text-orange-400 min-h-[44px] flex items-center">
                      ATS Scanner & Score
                    </Link>
                    <Link to="/ai-assistant" className="py-2 text-[var(--ox-text-secondary)] hover:text-orange-400 min-h-[44px] flex items-center">
                      AI Content Enhancer
                    </Link>
                    <Link to="/import" className="py-2 text-[var(--ox-text-secondary)] hover:text-orange-400 min-h-[44px] flex items-center">
                      Import PDF / JSON
                    </Link>
                  </div>
                )}
              </div>

              {/* Accordion 2: Legal */}
              <div className="rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] overflow-hidden">
                <button
                  id="mobile-footer-legal-trigger"
                  onClick={() => toggleMobileSection('legal')}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)] min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  aria-expanded={openSection === 'legal'}
                  aria-controls="mobile-footer-legal-content"
                >
                  <span>Legal</span>
                  {openSection === 'legal' ? (
                    <ChevronUp className="w-4 h-4 text-orange-500" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--ox-text-muted)]" aria-hidden="true" />
                  )}
                </button>
                {openSection === 'legal' && (
                  <div
                    id="mobile-footer-legal-content"
                    role="region"
                    aria-labelledby="mobile-footer-legal-trigger"
                    className="p-3.5 pt-0 border-t border-[var(--ox-border)]/50 space-y-1 text-xs animate-fadeIn"
                  >
                    <Link to="/legal/privacy-policy" className="py-2 text-[var(--ox-text-secondary)] hover:text-orange-400 min-h-[44px] flex items-center">
                      Privacy Policy
                    </Link>
                    <Link to="/legal/terms-and-conditions" className="py-2 text-[var(--ox-text-secondary)] hover:text-orange-400 min-h-[44px] flex items-center">
                      Terms & Conditions
                    </Link>
                    <Link to="/legal/refund-policy" className="py-2 text-[var(--ox-text-secondary)] hover:text-orange-400 min-h-[44px] flex items-center">
                      Refund Policy
                    </Link>
                    <Link to="/legal/cookie-policy" className="py-2 text-[var(--ox-text-secondary)] hover:text-orange-400 min-h-[44px] flex items-center">
                      Cookie Policy
                    </Link>
                    <Link to="/legal/ai-policy" className="py-2 text-[var(--ox-text-secondary)] hover:text-orange-400 min-h-[44px] flex items-center">
                      AI Usage Policy
                    </Link>
                  </div>
                )}
              </div>

              {/* Accordion 3: Support & Ecosystem */}
              <div className="rounded-2xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] overflow-hidden">
                <button
                  id="mobile-footer-support-trigger"
                  onClick={() => toggleMobileSection('support')}
                  className="w-full p-3.5 flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)] min-h-[44px] cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  aria-expanded={openSection === 'support'}
                  aria-controls="mobile-footer-support-content"
                >
                  <span>Support & Ecosystem</span>
                  {openSection === 'support' ? (
                    <ChevronUp className="w-4 h-4 text-orange-500" aria-hidden="true" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--ox-text-muted)]" aria-hidden="true" />
                  )}
                </button>
                {openSection === 'support' && (
                  <div
                    id="mobile-footer-support-content"
                    role="region"
                    aria-labelledby="mobile-footer-support-trigger"
                    className="p-3.5 border-t border-[var(--ox-border)]/50 space-y-3 text-xs animate-fadeIn"
                  >
                    <div className="space-y-1">
                      <Link
                        to="/meet-the-founder"
                        className="font-bold text-[var(--ox-text-primary)] hover:text-orange-400 flex items-center gap-1.5 py-1"
                        aria-label="Meet the Founder page"
                      >
                        <UserCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" aria-hidden="true" />
                        <span>Meet the Founder</span>
                        <ChevronDown className="w-3 h-3 text-orange-500 -rotate-90 shrink-0" aria-hidden="true" />
                      </Link>
                      <p className="text-[11px] text-[var(--ox-text-muted)] leading-relaxed">
                        Meet the founder, explore the vision behind OpportunityX, and follow the journey of building the ecosystem.
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[var(--ox-border)]/50 space-y-2">
                      <div className="font-bold text-[var(--ox-text-primary)] flex items-center gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 shrink-0" aria-hidden="true" />
                        <span>Support OpportunityX</span>
                      </div>
                      <p className="text-[11px] text-[var(--ox-text-muted)] leading-relaxed">
                        Help us continue building free tools and opportunities for students.
                      </p>
                      <button
                        onClick={() => setIsDonationModalOpen(true)}
                        className="w-full py-2.5 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold cursor-pointer text-center min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                        aria-label="Support or Donate to OpportunityX"
                      >
                        Support / Donate
                      </button>
                    </div>

                    <div className="pt-2 border-t border-[var(--ox-border)]/50">
                      <a
                        href="https://opportunityx.co.in"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-orange-400 hover:underline flex items-center gap-1.5 py-2 min-h-[44px]"
                        aria-label="Explore OpportunityX Ecosystem (opens in new tab)"
                      >
                        <span>Explore OpportunityX Ecosystem</span>
                        <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
                      </a>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>

        {/* ═══ BOTTOM COPYRIGHT & LEGAL BAR ═══ */}
        <div className="pt-6 border-t border-[var(--ox-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--ox-text-muted)] text-center sm:text-left">
          <div className="font-medium">
            © {new Date().getFullYear()} OpportunityX. Operated by <span className="text-[var(--ox-text-secondary)] font-semibold">Anurag Kumar Verma</span>.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
            <Link to="/legal/privacy-policy" className="hover:text-[var(--ox-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">Privacy</Link>
            <span>•</span>
            <Link to="/legal/terms-and-conditions" className="hover:text-[var(--ox-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">Terms</Link>
            <span>•</span>
            <Link to="/legal/refund-policy" className="hover:text-[var(--ox-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">Refunds</Link>
            <span>•</span>
            <Link to="/legal/contact" className="hover:text-[var(--ox-text-primary)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded px-1">Contact Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
