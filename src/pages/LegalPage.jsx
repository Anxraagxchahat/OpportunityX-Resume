import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Shield,
  FileText,
  RefreshCw,
  Truck,
  Cookie,
  Cpu,
  AlertTriangle,
  Users,
  Copyright,
  Info,
  Mail,
  Search,
  CheckCircle2,
  Send,
  ExternalLink,
  ChevronRight,
  Bug,
  Lightbulb,
  Handshake,
  Lock,
  Code
} from 'lucide-react';
import { LEGAL_PAGES, COMPANY_INFO } from '../data/legal/legalContent';

const NAV_ITEMS = [
  { id: 'privacy-policy', label: 'Privacy Policy', icon: Shield },
  { id: 'terms-and-conditions', label: 'Terms & Conditions', icon: FileText },
  { id: 'refund-policy', label: 'Refund Policy', icon: RefreshCw },
  { id: 'shipping-policy', label: 'Shipping & Delivery', icon: Truck },
  { id: 'cookie-policy', label: 'Cookie Policy', icon: Cookie },
  { id: 'ai-policy', label: 'AI Usage Policy', icon: Cpu },
  { id: 'disclaimer', label: 'Disclaimer', icon: AlertTriangle },
  { id: 'community-guidelines', label: 'Community Guidelines', icon: Users },
  { id: 'dmca-policy', label: 'Copyright & DMCA', icon: Copyright },
  { id: 'about', label: 'About OpportunityX', icon: Info },
  { id: 'contact', label: 'Contact Support', icon: Mail }
];

export const LegalPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const activeSlug = slug && LEGAL_PAGES[slug] ? slug : 'privacy-policy';
  const currentPage = LEGAL_PAGES[activeSlug];

  const [searchQuery, setSearchQuery] = useState('');
  const [contactReason, setContactReason] = useState('bug');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Auto Scroll to top when legal page or tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [activeSlug]);

  // Advanced Dynamic SEO Engine (Title, Meta Description, Canonical, Open Graph, Twitter, JSON-LD Schemas)
  useEffect(() => {
    if (!currentPage || !currentPage.seo) return;

    // 1. Title
    document.title = currentPage.seo.title;

    // Helper for Meta Tags
    const setMetaTag = (attr, attrValue, content) => {
      let element = document.querySelector(`meta[${attr}="${attrValue}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attr, attrValue);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Helper for Link Tags
    const setLinkTag = (rel, href) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (!element) {
        element = document.createElement('link');
        element.setAttribute('rel', rel);
        document.head.appendChild(element);
      }
      element.setAttribute('href', href);
    };

    // 2. Meta Description
    setMetaTag('name', 'description', currentPage.seo.description);

    // 3. Canonical URL
    setLinkTag('canonical', currentPage.seo.canonicalUrl);

    // 4. Open Graph Metadata
    setMetaTag('property', 'og:title', currentPage.seo.title);
    setMetaTag('property', 'og:description', currentPage.seo.description);
    setMetaTag('property', 'og:url', currentPage.seo.canonicalUrl);
    setMetaTag('property', 'og:type', 'article');
    setMetaTag('property', 'og:site_name', 'OpportunityX');

    // 5. Twitter Metadata
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', currentPage.seo.title);
    setMetaTag('name', 'twitter:description', currentPage.seo.description);

    // 6. JSON-LD Breadcrumb & Organization Schemas
    const existingSchema = document.getElementById('ox-legal-jsonld');
    if (existingSchema) existingSchema.remove();

    const script = document.createElement('script');
    script.id = 'ox-legal-jsonld';
    script.type = 'application/ld+json';

    const schemaData = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'BreadcrumbList',
          'itemListElement': [
            { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://resume.opportunityx.co.in' },
            { '@type': 'ListItem', 'position': 2, 'name': 'Legal & Governance', 'item': 'https://resume.opportunityx.co.in/legal' },
            { '@type': 'ListItem', 'position': 3, 'name': currentPage.title, 'item': currentPage.seo.canonicalUrl }
          ]
        },
        {
          '@type': 'Organization',
          '@id': 'https://opportunityx.co.in/#organization',
          'name': COMPANY_INFO.name,
          'url': COMPANY_INFO.website,
          'logo': 'https://resume.opportunityx.co.in/favicon.png',
          'email': COMPANY_INFO.supportEmail,
          'sameAs': COMPANY_INFO.socials.map(s => s.url)
        }
      ]
    };
    script.text = JSON.stringify(schemaData);
    document.head.appendChild(script);

  }, [currentPage]);

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
    setTimeout(() => {
      setContactSubmitted(false);
      setContactMessage('');
    }, 4000);
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return currentPage.sections;
    const query = searchQuery.toLowerCase();
    return currentPage.sections.filter(sec =>
      sec.heading.toLowerCase().includes(query) ||
      sec.text.toLowerCase().includes(query)
    );
  }, [currentPage, searchQuery]);

  return (
    <div className="min-h-screen bg-[var(--ox-bg)] text-[var(--ox-text-primary)] transition-colors duration-300 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Breadcrumb Banner */}
        <div className="p-8 rounded-3xl bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 backdrop-blur-xl relative overflow-hidden space-y-3">
          <div className="flex items-center gap-2 text-xs text-orange-400 font-extrabold tracking-wider uppercase">
            <Link to="/" className="hover:underline">OpportunityX</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>Legal & Shared Support Infrastructure</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black text-white">{currentPage.title}</h1>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl">{currentPage.subtitle}</p>
            </div>
            <div className="text-xs text-slate-400 font-mono bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
              Last Updated: <span className="text-orange-400 font-bold">{currentPage.lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* Layout: Sidebar Nav + Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Navigation */}
          <div className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search policies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-orange-500 transition-colors"
              />
            </div>

            <div className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-2xl p-3 space-y-1 shadow-lg">
              <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider px-3 py-1.5">
                Legal & Shared Support Pages
              </div>
              {NAV_ITEMS.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeSlug === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSearchQuery('');
                      navigate(`/legal/${item.id}`);
                    }}
                    className={`w-full px-3 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between transition-all ${
                      isActive
                        ? 'bg-orange-500/15 text-orange-400 border border-orange-500/30 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <IconComponent className={`w-4 h-4 ${isActive ? 'text-orange-400' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-ping" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] rounded-3xl p-6 sm:p-8 space-y-8 shadow-xl">
              
              {/* IF ABOUT PAGE: Render Official OpportunityX Team & Ecosystem Info (Reused from Main OpportunityX) */}
              {activeSlug === 'about' && (
                <div className="space-y-8">
                  {/* Vision Header */}
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <h2 className="text-xl font-black text-white flex items-center gap-2">
                      <Code className="w-5 h-5 text-orange-400" />
                      About OpportunityX Platform
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      OpportunityX is an AI-powered enterprise career operating system created to empower job seekers, software engineers, and students worldwide. We build unified, zero-paywall tools connected by single Firebase Authentication identity.
                    </p>
                  </div>

                  {/* Leadership Team (Anurag Verma & Naman Mishra) */}
                  <div className="space-y-4">
                    <h3 className="text-base font-extrabold text-white">Founders & Leadership Team</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {COMPANY_INFO.founders.map((f, idx) => (
                        <div key={idx} className="p-5 rounded-2xl bg-[#0B0D14] border border-slate-800 space-y-3">
                          <div>
                            <h4 className="text-base font-extrabold text-white">{f.name}</h4>
                            <p className="text-xs text-orange-400 font-semibold">{f.role}</p>
                          </div>
                          <div className="flex items-center gap-2 pt-1">
                            <a
                              href={f.linkedin}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                            >
                              LinkedIn <ExternalLink className="w-3 h-3" />
                            </a>
                            {f.github && (
                              <a
                                href={f.github}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                              >
                                GitHub <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                            {f.x && (
                              <a
                                href={f.x}
                                target="_blank"
                                rel="noreferrer"
                                className="px-3 py-1.5 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                              >
                                X <ExternalLink className="w-3 h-3" />
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Policy Sections */}
                  <div className="space-y-6 pt-4 border-t border-slate-800">
                    {currentPage.sections.map((sec, idx) => (
                      <div key={idx} className="space-y-2">
                        <h3 className="text-base font-extrabold text-white">{sec.heading}</h3>
                        <p className="text-xs text-slate-300 leading-relaxed">{sec.text}</p>
                        {sec.bulletPoints && (
                          <ul className="space-y-1.5 pt-1">
                            {sec.bulletPoints.map((bp, bpIdx) => (
                              <li key={bpIdx} className="flex items-start gap-2 text-xs text-slate-300">
                                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                                <span>{bp}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* IF CONTACT PAGE: Render Official OpportunityX Support Form & Contact Channels (Reused from Main OpportunityX) */}
              {activeSlug === 'contact' && (
                <div className="space-y-8">
                  {/* Official Emails & Handles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-5 rounded-2xl bg-[#0B0D14] border border-slate-800 space-y-2">
                      <Mail className="w-6 h-6 text-orange-400" />
                      <div>
                        <div className="font-extrabold text-white text-sm">Customer & Platform Support</div>
                        <div className="text-xs text-orange-400 font-mono font-bold mt-0.5">{COMPANY_INFO.supportEmail}</div>
                        <div className="text-[11px] text-slate-400 mt-1">For account help, resume builder questions, or credit top-ups.</div>
                      </div>
                    </div>

                    <div className="p-5 rounded-2xl bg-[#0B0D14] border border-slate-800 space-y-2">
                      <Handshake className="w-6 h-6 text-emerald-400" />
                      <div>
                        <div className="font-extrabold text-white text-sm">Business & Partnerships</div>
                        <div className="text-xs text-emerald-400 font-mono font-bold mt-0.5">{COMPANY_INFO.businessEmail}</div>
                        <div className="text-[11px] text-slate-400 mt-1">For college alliances, hiring partners, and community sponsors.</div>
                      </div>
                    </div>
                  </div>

                  {/* Official Social Links (Reused from Main OpportunityX) */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-bold text-slate-300 uppercase tracking-wider">Official OpportunityX Social Links</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                      {COMPANY_INFO.socials.map((s, idx) => (
                        <a
                          key={idx}
                          href={s.url}
                          target="_blank"
                          rel="noreferrer"
                          className="p-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-all flex items-center justify-between text-xs group"
                        >
                          <div>
                            <div className="font-bold text-white group-hover:text-orange-400 transition-colors">{s.label}</div>
                            <div className="text-[10px] text-slate-400">{s.handle}</div>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-white" />
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Support Form */}
                  <form onSubmit={handleContactSubmit} className="space-y-4 pt-6 border-t border-slate-800">
                    <h3 className="text-lg font-black text-white">Send Us a Direct Support Message</h3>

                    {contactSubmitted && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2 animate-fadeIn">
                        <CheckCircle2 className="w-5 h-5 shrink-0" />
                        <span>Thank you! Your support ticket has been received. Our team will respond to {contactEmail} within 24 hours.</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">Reason for Inquiry</label>
                        <select
                          value={contactReason}
                          onChange={(e) => setContactReason(e.target.value)}
                          className="w-full bg-[#0B0D14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        >
                          <option value="bug">Bug Report (Something is broken)</option>
                          <option value="feature">Feature Request or Improvement</option>
                          <option value="partnership">Partnership & Business</option>
                          <option value="billing">Billing & Credit Top-up Issue</option>
                          <option value="abuse">Report Abuse or Security Concern</option>
                          <option value="general">General Support Question</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-300">Your Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full bg-[#0B0D14] border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-orange-500"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300">Detailed Message</label>
                      <textarea
                        required
                        rows={5}
                        placeholder="Please describe your question, feedback, or issue in detail..."
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        className="w-full bg-[#0B0D14] border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-orange-500"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
                    >
                      <Send className="w-4 h-4" /> Submit Support Inquiry
                    </button>
                  </form>
                </div>
              )}

              {/* REGULAR LEGAL POLICY RENDER (Privacy, Terms, Refund, Cookie, AI, Disclaimer, Community, DMCA) */}
              {activeSlug !== 'about' && activeSlug !== 'contact' && (
                <div className="space-y-8">
                  {filteredSections.map((sec, idx) => (
                    <div key={idx} className="space-y-3 pb-6 border-b border-slate-800/80 last:border-none last:pb-0">
                      <h2 className="text-lg font-black text-white">{sec.heading}</h2>
                      <p className="text-xs text-slate-300 leading-relaxed">{sec.text}</p>

                      {sec.bulletPoints && (
                        <ul className="space-y-2 pt-1">
                          {sec.bulletPoints.map((bp, bpIdx) => (
                            <li key={bpIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                              <span>{bp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Universal Ecosystem Legal Footer */}
              <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3">
                  <Shield className="w-6 h-6 text-orange-400 shrink-0" />
                  <div>
                    <div className="font-bold text-white">Shared OpportunityX Legal Infrastructure</div>
                    <div className="text-[11px] text-slate-400">Reusable across Resume, Career OS, Freelance Hub, Portfolio & Verification.</div>
                  </div>
                </div>
                <a
                  href={COMPANY_INFO.website}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-orange-500/10 text-orange-400 border border-orange-500/30 font-bold text-xs hover:bg-orange-500/20 transition-colors flex items-center gap-1.5 shrink-0"
                >
                  OpportunityX Hub <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
