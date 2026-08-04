import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Heart, ExternalLink } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-[#05070D] border-t border-slate-800/80 pt-12 pb-8 text-xs text-slate-400 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src="/favicon.png" alt="OpportunityX Logo" className="w-8 h-8 rounded-full" />
              <span className="text-base font-extrabold text-white">
                Opportunity<span className="text-orange-500">X</span> Resume
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Official Ecosystem Product by OpportunityX. Build professional, ATS-friendly resumes completely free with zero watermark.
            </p>
            <div className="flex items-center gap-2 pt-1 text-[11px]">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                All Systems Operational
              </span>
            </div>
          </div>

          {/* Col 2: Resume Products */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Resume Builder</h4>
            <ul className="space-y-2">
              <li><Link to="/builder" className="hover:text-orange-400 transition-colors">Resume Editor</Link></li>
              <li><Link to="/templates" className="hover:text-orange-400 transition-colors">Templates Gallery</Link></li>
              <li><Link to="/ats-checker" className="hover:text-orange-400 transition-colors">ATS Scanner & Score</Link></li>
              <li><Link to="/ai-assistant" className="hover:text-orange-400 transition-colors">AI Content Enhancer</Link></li>
              <li><Link to="/import" className="hover:text-orange-400 transition-colors">Import PDF / JSON</Link></li>
            </ul>
          </div>

          {/* Col 3: OpportunityX Ecosystem Links */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">OpportunityX Ecosystem</h4>
            <ul className="space-y-2">
              <li><a href="https://opportunityx.co.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">OpportunityX Main <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
              <li><a href="https://verify.opportunityx.co.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">Verify Certification <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
              <li><a href="https://career.opportunityx.co.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">Career OS <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
              <li><a href="https://freelancing.opportunityx.co.in" target="_blank" rel="noreferrer" className="hover:text-orange-400 transition-colors flex items-center gap-1">Freelance Hub <ExternalLink className="w-3 h-3 text-slate-500" /></a></li>
            </ul>
          </div>

          {/* Col 4: Community & Support */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Community & Open Source</h4>
            <p className="text-xs text-slate-400">
              Built for students, software engineers, and professionals worldwide. 100% Free Forever with no hidden subscriptions.
            </p>
            <div className="pt-2">
              <a
                href="#donation"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 rounded-lg hover:bg-amber-500/20 transition-all"
              >
                <Heart className="w-3.5 h-3.5 fill-amber-400" /> Support OpportunityX
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} OpportunityX Ecosystem. All rights reserved. Your resume is private. OpportunityX does not sell your personal data.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> Privacy First — Free Forever Resume Builder
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
};
