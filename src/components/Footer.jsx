import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ShieldCheck, Heart, Mail, Globe } from 'lucide-react';
import { COMPANY_INFO } from '../data/legal/legalContent';

export const Footer = () => {
  return (
    <footer className="bg-[var(--ox-surface-primary)] border-t border-[var(--ox-border)] pt-12 pb-8 text-xs text-[var(--ox-text-secondary)] transition-colors duration-300 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.png" alt="OpportunityX Logo" className="w-8 h-8 rounded-full" />
              <span className="text-base font-extrabold text-[var(--ox-text-primary)]">
                Opportunity<span className="text-orange-500">X</span> Resume
              </span>
            </div>
            <p className="text-xs text-[var(--ox-text-secondary)] leading-relaxed max-w-sm">
              Official Ecosystem Product by OpportunityX. Build professional, ATS-friendly resumes completely free with zero watermark and enterprise-grade privacy.
            </p>
            <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
              <a
                href={COMPANY_INFO.socials[0].url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-current text-sky-400" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
                LinkedIn
              </a>
              <a
                href={COMPANY_INFO.socials[1].url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-current text-purple-400" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a
                href={COMPANY_INFO.socials[2].url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800 transition-colors flex items-center gap-1.5"
              >
                <svg className="w-3.5 h-3.5 fill-current text-pink-400" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>

          {/* Col 2: Products */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[var(--ox-text-primary)] uppercase tracking-wider">Resume Tools</h4>
            <ul className="space-y-2">
              <li><Link to="/builder" className="hover:text-orange-400 transition-colors">Resume Editor</Link></li>
              <li><Link to="/templates" className="hover:text-orange-400 transition-colors">Templates Gallery</Link></li>
              <li><Link to="/ats-checker" className="hover:text-orange-400 transition-colors">ATS Scanner & Score</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-orange-400 transition-colors">AI Content Enhancer</Link></li>
              <li><Link to="/import" className="hover:text-orange-400 transition-colors">Import PDF / JSON</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal Section */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[var(--ox-text-primary)] uppercase tracking-wider">Legal Section</h4>
            <ul className="space-y-2">
              <li><Link to="/legal/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/legal/terms-and-conditions" className="hover:text-orange-400 transition-colors">Terms & Conditions</Link></li>
              <li><Link to="/legal/refund-policy" className="hover:text-orange-400 transition-colors">Refund Policy</Link></li>
              <li><Link to="/legal/cookie-policy" className="hover:text-orange-400 transition-colors">Cookie Policy</Link></li>
              <li><Link to="/legal/ai-policy" className="hover:text-orange-400 transition-colors">AI Usage Policy</Link></li>
            </ul>
          </div>

          {/* Col 4: Support Section (Reused from OpportunityX) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-[var(--ox-text-primary)] uppercase tracking-wider">Support Section</h4>
            <ul className="space-y-2">
              <li><Link to="/legal/about" className="hover:text-orange-400 transition-colors">About OpportunityX</Link></li>
              <li><Link to="/legal/contact" className="hover:text-orange-400 transition-colors">Contact Support</Link></li>
              <li><Link to="/legal/disclaimer" className="hover:text-orange-400 transition-colors">Disclaimer</Link></li>
              <li><Link to="/legal/community-guidelines" className="hover:text-orange-400 transition-colors">Community Guidelines</Link></li>
              <li><Link to="/legal/dmca-policy" className="hover:text-orange-400 transition-colors">DMCA Policy</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright Strip */}
        <div className="pt-6 border-t border-[var(--ox-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[var(--ox-text-muted)]">
          <div className="font-semibold">
            © {new Date().getFullYear()} OpportunityX. All Rights Reserved.
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Link to="/legal/privacy-policy" className="hover:text-[var(--ox-text-primary)]">Privacy</Link>
            <Link to="/legal/terms-and-conditions" className="hover:text-[var(--ox-text-primary)]">Terms</Link>
            <Link to="/legal/refund-policy" className="hover:text-[var(--ox-text-primary)]">Refunds</Link>
            <Link to="/legal/contact" className="hover:text-[var(--ox-text-primary)]">Contact Support</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
