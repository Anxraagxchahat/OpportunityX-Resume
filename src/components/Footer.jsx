import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Heart,
  Sparkles,
  UserCheck,
  Mail,
  ArrowUpRight
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';

import {
  LinkedInIcon,
  GitHubIcon,
  InstagramIcon,
  YoutubeIcon,
  XIcon,
  FacebookIcon
} from './icons/BrandIcons';

const SOCIAL_LINKS = [
  { name: 'LinkedIn', url: 'https://www.linkedin.com/company/128134073', icon: LinkedInIcon, ariaLabel: 'OpportunityX on LinkedIn', colorHover: 'hover:text-[#0A66C2] hover:border-[#0A66C2]/40' },
  { name: 'GitHub', url: 'https://github.com/Anxraagxchahat/opportunityx', icon: GitHubIcon, ariaLabel: 'OpportunityX on GitHub', colorHover: 'hover:text-purple-400 hover:border-purple-500/40' },
  { name: 'Instagram', url: 'https://www.instagram.com/theopportunityx/', icon: InstagramIcon, ariaLabel: 'OpportunityX on Instagram', colorHover: 'hover:text-[#E4405F] hover:border-[#E4405F]/40' },
  { name: 'YouTube', url: 'https://www.youtube.com/@theopportunityX', icon: YoutubeIcon, ariaLabel: 'OpportunityX on YouTube', colorHover: 'hover:text-[#FF0000] hover:border-[#FF0000]/40' },
  { name: 'X', url: 'https://x.com/TheOpportunityX', icon: XIcon, ariaLabel: 'OpportunityX on X', colorHover: 'hover:text-amber-400 hover:border-amber-400/40' },
  { name: 'Facebook', url: 'https://www.facebook.com/profile.php?id=61590766896275', icon: FacebookIcon, ariaLabel: 'OpportunityX on Facebook', colorHover: 'hover:text-[#1877F2] hover:border-[#1877F2]/40' },
  { name: 'Email', url: 'mailto:hello@opportunityx.co.in', icon: Mail, ariaLabel: 'OpportunityX Email', colorHover: 'hover:text-emerald-400 hover:border-emerald-500/40' }
];

export const Footer = () => {
  const { setIsSupportModalOpen } = useResume();
  const [copiedEmail, setCopiedEmail] = useState(false);
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

  const renderBrandBlock = () => (
    <div className="space-y-3">
      <Link
        to="/"
        className="flex items-center gap-2.5 group w-max focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-xl p-1 -m-1"
        aria-label="OpportunityX Resume Home"
      >
        <img
          src="/favicon.png"
          alt="OpportunityX Logo"
          className="w-7 h-7 rounded-full object-cover shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.3)] group-hover:scale-105 transition-transform"
        />
        <div className="flex items-baseline gap-1.5 text-left">
          <span className="text-sm font-black tracking-tight text-[var(--ox-text-primary)] font-sans leading-none">
            Opportunity<span className="text-[#F97316]">X</span> Resume
          </span>
          <span className="text-[8px] uppercase tracking-widest font-extrabold px-1.5 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30 leading-none">
            ECOSYSTEM
          </span>
        </div>
      </Link>

      <p className="text-[11px] text-[var(--ox-text-secondary)] leading-relaxed max-w-xs">
        Official Ecosystem Product by OpportunityX. Build professional, ATS-friendly resumes completely free with zero watermark & privacy.
      </p>

      {/* Compact Social Media Icons */}
      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
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
              className={`w-7.5 h-7.5 p-1.5 rounded-lg bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-secondary)] flex items-center justify-center transition-all duration-200 cursor-pointer active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 ${s.colorHover}`}
            >
              <Icon className="w-3.5 h-3.5" />
            </a>
          );
        })}
      </div>
    </div>
  );

  return (
    <footer className="bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] text-xs text-[var(--ox-text-secondary)] transition-colors duration-300 no-print select-none">

      {/* Toast Notification */}
      {copiedEmail && (
        <div className="fixed bottom-20 right-4 z-50 px-3.5 py-2 rounded-xl bg-emerald-500 text-white font-bold text-xs shadow-2xl animate-fadeIn flex items-center gap-2">
          <Mail className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Email copied! (hello@opportunityx.co.in)</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-7 space-y-6">

        {/* ═══ SLEEK 4-COLUMN HORIZONTAL GRID (Desktop & Tablet >=768px) ═══ */}
        <div className="hidden md:grid md:grid-cols-12 gap-6 lg:gap-8 items-start">

          {/* 1. BRAND BLOCK (col-span-4) */}
          <div className="md:col-span-4">
            {renderBrandBlock()}
          </div>

          {/* 2. RESUME TOOLS (col-span-3) */}
          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[var(--ox-text-primary)]">
              Resume Tools
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/builder" className="hover:text-orange-400 transition-colors font-medium">
                  Resume Editor
                </Link>
              </li>
              <li>
                <Link to="/templates" className="hover:text-orange-400 transition-colors font-medium">
                  Templates Gallery
                </Link>
              </li>
              <li>
                <Link to="/ats-checker" className="hover:text-orange-400 transition-colors font-medium">
                  ATS Scanner & Score
                </Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-orange-400 transition-colors font-medium">
                  AI Content Enhancer
                </Link>
              </li>
              <li>
                <Link to="/import" className="hover:text-orange-400 transition-colors font-medium">
                  Import PDF / JSON
                </Link>
              </li>
            </ul>
          </div>

          {/* 3. LEGAL (col-span-2) */}
          <div className="md:col-span-2 space-y-2.5">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[var(--ox-text-primary)]">
              Legal
            </h3>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <Link to="/legal/privacy-policy" className="hover:text-orange-400 transition-colors font-medium">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/terms-and-conditions" className="hover:text-orange-400 transition-colors font-medium">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/legal/refund-policy" className="hover:text-orange-400 transition-colors font-medium">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/cookie-policy" className="hover:text-orange-400 transition-colors font-medium">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/legal/ai-policy" className="hover:text-orange-400 transition-colors font-medium">
                  AI Usage Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* 4. ECOSYSTEM & SUPPORT (col-span-3) */}
          <div className="md:col-span-3 space-y-2.5">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-[var(--ox-text-primary)] flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-orange-500" aria-hidden="true" />
              <span>Ecosystem & Support</span>
            </h3>

            <div className="space-y-2 text-[11px]">
              {/* Meet the Founder */}
              <Link
                to="/meet-the-founder"
                className="p-2 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] hover:border-orange-500/40 flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <UserCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" aria-hidden="true" />
                  <span className="font-bold text-[var(--ox-text-primary)] group-hover:text-orange-400">Meet the Founder</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[var(--ox-text-muted)] group-hover:text-orange-400 transition-colors" />
              </Link>

              {/* Support / Donate button */}
              <button
                onClick={() => setIsSupportModalOpen(true)}
                className="w-full p-2 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold flex items-center justify-between transition-all cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20 shrink-0" aria-hidden="true" />
                  <span>Support OpportunityX</span>
                </div>
                <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-orange-500/20">Donate</span>
              </button>

              {/* External Ecosystem Link */}
              <a
                href="https://opportunityx.co.in"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-[10px] font-bold text-[var(--ox-text-muted)] hover:text-orange-400 transition-colors pt-0.5"
              >
                <span>Explore Main Ecosystem</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

        </div>

        {/* ═══ MOBILE BRAND & ACCORDIONS (<768px) ═══ */}
        <div className="space-y-4 md:hidden">
          {/* Mobile Brand Block */}
          <div className="pb-3 border-b border-[var(--ox-border)]/50">
            {renderBrandBlock()}
          </div>

          {/* Accordion 1: Resume Tools */}
          <div className="rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] overflow-hidden">
            <button
              onClick={() => toggleMobileSection('tools')}
              className="w-full p-3 flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)] min-h-[44px] cursor-pointer"
            >
              <span>Resume Tools</span>
              {openSection === 'tools' ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-[var(--ox-text-muted)]" />}
            </button>
            {openSection === 'tools' && (
              <div className="p-3 pt-0 border-t border-[var(--ox-border)]/50 space-y-1 text-xs animate-fadeIn">
                <Link to="/builder" className="py-1.5 text-[var(--ox-text-secondary)] hover:text-orange-400 flex items-center">Resume Editor</Link>
                <Link to="/templates" className="py-1.5 text-[var(--ox-text-secondary)] hover:text-orange-400 flex items-center">Templates Gallery</Link>
                <Link to="/ats-checker" className="py-1.5 text-[var(--ox-text-secondary)] hover:text-orange-400 flex items-center">ATS Scanner & Score</Link>
                <Link to="/ai-assistant" className="py-1.5 text-[var(--ox-text-secondary)] hover:text-orange-400 flex items-center">AI Content Enhancer</Link>
                <Link to="/import" className="py-1.5 text-[var(--ox-text-secondary)] hover:text-orange-400 flex items-center">Import PDF / JSON</Link>
              </div>
            )}
          </div>

          {/* Accordion 2: Legal */}
          <div className="rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] overflow-hidden">
            <button
              onClick={() => toggleMobileSection('legal')}
              className="w-full p-3 flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)] min-h-[44px] cursor-pointer"
            >
              <span>Legal</span>
              {openSection === 'legal' ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-[var(--ox-text-muted)]" />}
            </button>
            {openSection === 'legal' && (
              <div className="p-3 pt-0 border-t border-[var(--ox-border)]/50 space-y-1 text-xs animate-fadeIn">
                <Link to="/legal/privacy-policy" className="py-1.5 text-[var(--ox-text-secondary)] hover:text-orange-400 flex items-center">Privacy Policy</Link>
                <Link to="/legal/terms-and-conditions" className="py-1.5 text-[var(--ox-text-secondary)] hover:text-orange-400 flex items-center">Terms & Conditions</Link>
                <Link to="/legal/refund-policy" className="py-1.5 text-[var(--ox-text-secondary)] hover:text-orange-400 flex items-center">Refund Policy</Link>
                <Link to="/legal/cookie-policy" className="py-1.5 text-[var(--ox-text-secondary)] hover:text-orange-400 flex items-center">Cookie Policy</Link>
                <Link to="/legal/ai-policy" className="py-1.5 text-[var(--ox-text-secondary)] hover:text-orange-400 flex items-center">AI Usage Policy</Link>
              </div>
            )}
          </div>

          {/* Accordion 3: Support & Ecosystem */}
          <div className="rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] overflow-hidden">
            <button
              onClick={() => toggleMobileSection('support')}
              className="w-full p-3 flex items-center justify-between text-xs font-bold text-[var(--ox-text-primary)] min-h-[44px] cursor-pointer"
            >
              <span>Ecosystem & Support</span>
              {openSection === 'support' ? <ChevronUp className="w-4 h-4 text-orange-500" /> : <ChevronDown className="w-4 h-4 text-[var(--ox-text-muted)]" />}
            </button>
            {openSection === 'support' && (
              <div className="p-3 border-t border-[var(--ox-border)]/50 space-y-2 text-xs animate-fadeIn">
                <Link to="/meet-the-founder" className="font-bold text-[var(--ox-text-primary)] hover:text-orange-400 flex items-center gap-1.5 py-1">
                  <UserCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                  <span>Meet the Founder</span>
                </Link>
                <button
                  onClick={() => setIsSupportModalOpen(true)}
                  className="w-full py-2 px-3 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/30 text-xs font-bold cursor-pointer text-center min-h-[44px]"
                >
                  Support / Donate
                </button>
                <a href="https://opportunityx.co.in" target="_blank" rel="noopener noreferrer" className="font-bold text-orange-400 hover:underline flex items-center gap-1.5 py-1">
                  <span>Explore Main Ecosystem</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* ═══ BOTTOM COPYRIGHT BAR ═══ */}
        <div className="pt-4 border-t border-[var(--ox-border)] flex flex-col sm:flex-row items-center justify-between gap-3 text-[10px] text-[var(--ox-text-muted)] text-center sm:text-left">
          <div className="font-medium">
            © {new Date().getFullYear()} OpportunityX. Operated by <span className="text-[var(--ox-text-secondary)] font-semibold">Anurag Kumar Verma</span>.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 font-medium">
            <Link to="/legal/privacy-policy" className="hover:text-[var(--ox-text-primary)] transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/legal/terms-and-conditions" className="hover:text-[var(--ox-text-primary)] transition-colors">Terms</Link>
            <span>•</span>
            <Link to="/legal/refund-policy" className="hover:text-[var(--ox-text-primary)] transition-colors">Refunds</Link>
            <span>•</span>
            <Link to="/legal/contact" className="hover:text-[var(--ox-text-primary)] transition-colors">Contact Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
