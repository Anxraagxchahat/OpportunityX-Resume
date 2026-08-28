import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PlayCircle,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Download,
  Layout,
  History,
  Lock,
  GraduationCap,
  ChevronDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Layers,
  Wand2,
  Shield,
  Grid,
  Compass,
  FileText,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useResume } from '../context/ResumeContext';
import { useTheme } from '../context/ThemeProvider';
import { RealTemplateThumbnail } from '../components/template/RealTemplateThumbnail';
import { getTemplateCapabilities } from '../templates';
import { BrandLogo } from '../components/common/BrandLogo';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { isMono, isDark } = useTheme();
  const { loadDemoResume, setTemplate } = useResume();
  const [openFaq, setOpenFaq] = useState(null);

  const handleDemo = () => {
    loadDemoResume();
    navigate('/builder');
  };

  const handleUseTemplate = (templateId) => {
    setTemplate(templateId);
    navigate('/builder');
  };

  const campusLogos = [
    "IIT Bombay",
    "IIT Delhi",
    "BITS Pilani",
    "NIT Trichy",
    "IIIT Bangalore",
    "DTU",
    "NSIT",
    "VIT"
  ];

  const pillars = [
    {
      id: 'ats',
      badge: 'Parser Compliance',
      title: 'ATS Scanner Precision',
      desc: 'Built to score 90+ on Workday, Greenhouse, and Lever. Follows strict single and multi-column semantic hierarchies with standardized typography.',
      icon: CheckCircle2,
      highlights: ['Zero parsing errors', 'Recruiter-tested layout', 'Real-time circular score']
    },
    {
      id: 'ai',
      badge: 'Writing Engine',
      title: 'AI Action & Metric Enhancer',
      desc: 'Transform passive job descriptions into quantified impact statements with instant AI bullet rewrites, metric quantifiers, and role-specific action verbs.',
      icon: Wand2,
      highlights: ['Quantified bullet points', 'Role-tailored keywords', 'Instant tone rewrites']
    },
    {
      id: 'privacy',
      badge: 'Data Integrity',
      title: 'Client-Side Privacy & PDF Engine',
      desc: 'Your resume data is stored locally in your browser as a structured JSON schema. Instant pixel-perfect A4 PDF generation with zero watermarks or ads.',
      icon: ShieldCheck,
      highlights: ['100% Client-side storage', 'Clean A4 print breaks', 'JSON schema portability']
    }
  ];

  const templatesGallery = [
    { id: 'modern', name: "Modern Tech Lead", category: "Developer", tag: "Popular" },
    { id: 'minimal', name: "Minimalist ATS", category: "Clean", tag: "Top Rated" },
    { id: 'fullstack', name: "Software Engineer", category: "Full-Stack", tag: "Recommended" },
    { id: 'compact-entry', name: "Student Intern", category: "Early Career", tag: "Standard" },
    { id: 'developer-dark', name: "Data Scientist", category: "AI & ML", tag: "Featured" },
    { id: 'executive', name: "Executive Director", category: "Leadership", tag: "Executive" }
  ];

  const faqs = [
    {
      q: "Is OpportunityX Resume really 100% free with no watermarks?",
      a: "Yes, completely. There are zero subscriptions, paywalls, or hidden watermarks. OpportunityX Resume is built as an open-access product within the parent OpportunityX ecosystem."
    },
    {
      q: "How does it guarantee ATS scanner compliance?",
      a: "Our templates follow strict single and multi-column layouts using standard web typography without confusing tables or graphical headers, allowing systems like Workday, Greenhouse, and Lever to parse every section accurately."
    },
    {
      q: "Where is my personal resume data stored?",
      a: "All resume data is saved locally inside your browser's local storage using a portable JSON schema. We do not sell, track, or lock your personal data behind accounts."
    },
    {
      q: "Can I import an existing PDF or JSON resume?",
      a: "Yes. Use our dedicated Import tool to upload JSON schemas or paste existing resume text for instant automated structuring."
    }
  ];

  return (
    <div className="space-y-20 sm:space-y-28 pb-24 overflow-x-hidden bg-[var(--ox-bg)] text-[var(--ox-text-primary)] transition-colors duration-300">

      {/* ─────────────────────────────────────────────────────────────
          1. HERO SECTION: Clean, High-Impact & Premium Human Design
         ───────────────────────────────────────────────────────────── */}
      <section className="relative pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* LEFT COLUMN: Headline, Value Proposition, Action Buttons & Guarantees */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-7 text-left">
            
            {/* Top Eyebrow Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs font-mono font-semibold tracking-tight shadow-sm select-none">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isMono ? 'bg-black' : 'bg-[#F97316]'}`} />
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isMono ? 'bg-black' : 'bg-[#F97316]'}`} />
              </span>
              <span className="text-[var(--ox-text-secondary)]">OpportunityX Resume</span>
              <span className="text-[var(--ox-text-muted)]">•</span>
              <span className={isMono ? 'text-black font-bold' : 'text-[#F97316] font-bold'}>Ecosystem Builder</span>
            </div>

            {/* Main Primary Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--ox-text-primary)] tracking-tight leading-[1.08] font-sans">
              Build a career-defining resume. <br className="hidden sm:inline" />
              <span className={isMono ? "text-black underline decoration-2 underline-offset-4" : "text-gradient-primary"}>
                Engineered for modern ATS.
              </span>
            </h1>

            {/* Crisp Value Proposition Copy */}
            <p className="text-base sm:text-lg text-[var(--ox-text-secondary)] max-w-xl leading-relaxed font-normal">
              Create high-scoring, recruiter-approved resumes with intelligent formatting, instant AI enhancements, and pixel-perfect PDF export — completely free with zero watermarks.
            </p>

            {/* Primary Action Button Cluster */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              {/* Primary CTA */}
              <Link
                to="/builder"
                className={`px-6 py-3.5 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 select-none ${
                  isMono
                    ? 'bg-black text-white hover:bg-zinc-800'
                    : 'bg-gradient-to-r from-[#F97316] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.35)] hover:shadow-[0_0_28px_rgba(249,115,22,0.5)]'
                }`}
              >
                <span>Create Resume</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              {/* Secondary CTA */}
              <button
                onClick={handleDemo}
                className="px-5 py-3.5 text-sm font-bold text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] hover:border-[var(--ox-border-highlight)] rounded-xl transition-all flex items-center gap-2 cursor-pointer active:scale-95 shadow-sm select-none"
              >
                <PlayCircle className={`w-4 h-4 ${isMono ? 'text-black' : 'text-[#F97316]'}`} />
                <span>Try Demo Resume</span>
              </button>

              {/* Tertiary Import Link */}
              <Link
                to="/import"
                className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)]/50 hover:bg-[var(--ox-surface-secondary)] border border-transparent hover:border-[var(--ox-border)] rounded-xl transition-all flex items-center gap-1.5 active:scale-95"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Import JSON/PDF</span>
              </Link>
            </div>

            {/* Core Trust & Guarantee Signals */}
            <div className="pt-4 border-t border-[var(--ox-border)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-[var(--ox-text-secondary)] font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isMono ? 'text-black' : 'text-[#F97316]'}`} />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isMono ? 'text-black' : 'text-[#F97316]'}`} />
                <span>No Watermarks or Ads</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className={`w-4 h-4 shrink-0 ${isMono ? 'text-black' : 'text-[#F97316]'}`} />
                <span>Pixel-Perfect A4 PDF</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Realistic High-Fidelity Product Preview Canvas */}
          <div className="lg:col-span-5 relative w-full flex justify-center">
            
            {/* Window Container */}
            <div className="w-full max-w-[480px] rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-card-bg)] shadow-2xl overflow-hidden transition-all duration-300">
              
              {/* Window Header / Tab Bar */}
              <div className="px-4 py-3 border-b border-[var(--ox-border)] bg-[var(--ox-surface-secondary)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                  </div>
                  <span className="text-xs font-mono text-[var(--ox-text-secondary)] font-semibold ml-2 truncate">
                    alex_rivera_resume.pdf
                  </span>
                </div>

                {/* Live ATS Pill */}
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-[11px] font-mono font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>ATS Score: 94</span>
                </div>
              </div>

              {/* Window Content: Clean Typeset Resume Preview */}
              <div className="p-5 sm:p-6 bg-[var(--ox-surface-primary)] space-y-4 text-left select-none">
                
                {/* Resume Header Area */}
                <div className="flex items-start justify-between border-b border-[var(--ox-border)] pb-3.5">
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-[var(--ox-text-primary)] tracking-tight">
                      Alex Rivera
                    </h3>
                    <p className={`text-xs font-bold ${isMono ? 'text-black' : 'text-[#F97316]'}`}>
                      Senior Full Stack Engineer
                    </p>
                    <div className="text-[10px] text-[var(--ox-text-muted)] font-mono">
                      San Francisco, CA • alex.rivera@dev • github.com/alexrivera
                    </div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-secondary)]">
                    ATS Clean v2
                  </span>
                </div>

                {/* Section 1: Experience */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] uppercase font-bold tracking-wider ${isMono ? 'text-black' : 'text-[#F97316]'}`}>
                      Work Experience
                    </span>
                    <span className="text-[10px] font-mono text-[var(--ox-text-muted)]">2022 — Present</span>
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-[var(--ox-text-primary)]">
                      Senior Software Engineer — TechFlow Systems
                    </div>
                    <p className="text-[11px] text-[var(--ox-text-secondary)] leading-relaxed">
                      • Architected scalable microservices handling 2M+ daily requests with 99.9% uptime.
                    </p>
                    <p className="text-[11px] text-[var(--ox-text-secondary)] leading-relaxed">
                      • Optimized database indexing queries, cutting latency by 42% across core endpoints.
                    </p>
                  </div>
                </div>

                {/* Section 2: Technical Skills */}
                <div className="space-y-1.5 pt-1 border-t border-[var(--ox-border)]">
                  <span className={`text-[10px] uppercase font-bold tracking-wider block ${isMono ? 'text-black' : 'text-[#F97316]'}`}>
                    Technical Skills
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'].map((skill) => (
                      <span
                        key={skill}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Section 3: Education */}
                <div className="space-y-1 pt-1 border-t border-[var(--ox-border)] flex items-center justify-between text-[11px]">
                  <div>
                    <span className="font-bold text-[var(--ox-text-primary)]">B.Tech in Computer Science</span>
                    <span className="text-[var(--ox-text-muted)] block text-[10px]">UC Berkeley • GPA 3.9/4.0</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-semibold">
                    Verified
                  </span>
                </div>

              </div>

              {/* Window Footer Action Bar */}
              <div className="p-3 border-t border-[var(--ox-border)] bg-[var(--ox-surface-secondary)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--ox-text-muted)] font-mono">
                  Live Interactive Engine
                </span>
                <Link
                  to="/builder"
                  className={`text-xs font-bold flex items-center gap-1 hover:underline ${
                    isMono ? 'text-black' : 'text-[#F97316]'
                  }`}
                >
                  <span>Open in Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          2. CAMPUS & DEVELOPER NETWORK STRIP
         ───────────────────────────────────────────────────────────── */}
      <section className="border-y border-[var(--ox-border)] bg-[var(--ox-surface-primary)] py-6 px-4 select-none">
        <div className="max-w-7xl mx-auto space-y-3 text-center">
          <p className="text-[11px] font-mono font-bold uppercase tracking-widest text-[var(--ox-text-muted)]">
            TRUSTED BY STUDENT BUILDERS & ENGINEERS FROM
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-[var(--ox-text-secondary)]">
            {campusLogos.map((campus, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[var(--ox-surface-secondary)]/60 border border-[var(--ox-border)] hover:border-[var(--ox-border-highlight)] hover:text-[var(--ox-text-primary)] transition-all"
              >
                <GraduationCap className={`w-3.5 h-3.5 ${isMono ? 'text-black' : 'text-[#F97316]'}`} />
                <span>{campus}</span>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          3. CORE ARCHITECTURAL PILLARS (3 Structured Value Pillars)
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isMono ? 'text-black' : 'text-[#F97316]'}`}>
            ARCHITECTURAL ADVANTAGES
          </span>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--ox-text-primary)] tracking-tight">
            Designed for Maximum Recruiter Impact
          </h2>
          <p className="text-sm text-[var(--ox-text-secondary)] leading-relaxed">
            Every template and feature is tuned for parser compliance, typographic readability, and instant export speed.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.id}
                className="rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-card-bg)] p-6 sm:p-7 space-y-5 hover:border-[var(--ox-border-highlight)] transition-all duration-200 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`p-2.5 rounded-xl border ${
                      isMono 
                        ? 'bg-black/5 border-black/20 text-black'
                        : 'bg-[#F97316]/10 border-[#F97316]/30 text-[#F97316]'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-muted)] font-semibold">
                      {pillar.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[var(--ox-text-primary)] tracking-tight">
                      {pillar.title}
                    </h3>
                    <p className="text-xs text-[var(--ox-text-secondary)] leading-relaxed">
                      {pillar.desc}
                    </p>
                  </div>
                </div>

                {/* Bullet Highlights */}
                <div className="pt-4 border-t border-[var(--ox-border)] space-y-2">
                  {pillar.highlights.map((h, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[var(--ox-text-primary)] font-medium">
                      <Check className={`w-3.5 h-3.5 shrink-0 ${isMono ? 'text-black' : 'text-[#F97316]'}`} />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          4. RECRUITER-APPROVED TEMPLATES GALLERY
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Gallery Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-[var(--ox-border)] pb-5">
          <div className="space-y-1">
            <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isMono ? 'text-black' : 'text-[#F97316]'}`}>
              CURATED TEMPLATE SUITE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ox-text-primary)] tracking-tight">
              Recruiter-Approved Formats
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ox-text-secondary)]">
              Single-column and clean dual-column layouts designed for maximum ATS parsing rate.
            </p>
          </div>

          <Link
            to="/templates"
            className={`text-xs font-bold flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] hover:border-[var(--ox-border-highlight)] transition-all ${
              isMono ? 'text-black' : 'text-[#F97316]'
            }`}
          >
            <span>View All 10+ Templates</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesGallery.map((tmpl) => (
            <div
              key={tmpl.id}
              className="rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-card-bg)] p-4 space-y-3.5 hover:border-[var(--ox-border-highlight)] transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Thumbnail Container */}
              <div className="h-52 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] p-2 relative overflow-hidden flex flex-col justify-between">
                <div className="flex items-center justify-between z-10 mb-1">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isMono 
                      ? 'bg-black/10 text-black border-black/30'
                      : 'bg-[#F97316]/10 text-[#F97316] border-[#F97316]/30'
                  }`}>
                    {tmpl.tag}
                  </span>
                  <span className="text-[10px] text-[var(--ox-text-secondary)] font-semibold px-2 py-0.5 rounded-full bg-[var(--ox-card-bg)]/90 border border-[var(--ox-border)]">
                    {tmpl.category}
                  </span>
                </div>
                
                {/* Live Template Component Renderer */}
                <div className="flex-1 w-full relative min-h-0 pointer-events-none opacity-90 group-hover:opacity-100 transition-opacity">
                  <RealTemplateThumbnail template={getTemplateCapabilities(tmpl.id)} />
                </div>
              </div>

              {/* Card Footer Info & CTA */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h4 className="text-sm font-bold text-[var(--ox-text-primary)]">
                    {tmpl.name}
                  </h4>
                  <p className="text-[11px] text-[var(--ox-text-muted)] font-mono">
                    {tmpl.category} • ATS Validated
                  </p>
                </div>
                <button
                  onClick={() => handleUseTemplate(tmpl.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer shadow-sm active:scale-95 ${
                    isMono
                      ? 'bg-black text-white hover:bg-zinc-800'
                      : 'bg-[#F97316] text-white hover:bg-orange-600'
                  }`}
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>

      </section>


      {/* ─────────────────────────────────────────────────────────────
          5. TRANSPARENT & HONEST FAQ SECTION
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <span className={`text-xs font-mono font-bold uppercase tracking-wider ${isMono ? 'text-black' : 'text-[#F97316]'}`}>
            QUESTIONS & DETAILS
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ox-text-primary)] tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3 pt-2">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-[var(--ox-border)] bg-[var(--ox-card-bg)] overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left cursor-pointer select-none"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-[var(--ox-text-primary)]">
                    {faq.q}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-[var(--ox-text-secondary)] shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-[var(--ox-text-secondary)] leading-relaxed border-t border-[var(--ox-border)] pt-3">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>


      {/* ─────────────────────────────────────────────────────────────
          6. COMMUNITY & PARENT ECOSYSTEM CTA BANNER
         ───────────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-[var(--ox-border)] bg-[var(--ox-surface-primary)] p-8 sm:p-12 text-center space-y-6 relative overflow-hidden shadow-xl">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs font-semibold">
            <BrandLogo variant="icon" size="xs" />
            <span className="text-[var(--ox-text-secondary)]">OpportunityX Ecosystem</span>
          </div>

          <div className="space-y-3 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--ox-text-primary)] tracking-tight">
              Ready to create your interview-ready resume?
            </h2>
            <p className="text-xs sm:text-sm text-[var(--ox-text-secondary)] leading-relaxed">
              Join thousands of developers, students, and professionals building ATS-compliant resumes with zero hidden subscriptions or paywalls.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              to="/builder"
              className={`px-7 py-3.5 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 active:scale-95 ${
                isMono
                  ? 'bg-black text-white hover:bg-zinc-800'
                  : 'bg-gradient-to-r from-[#F97316] to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-[0_0_20px_rgba(249,115,22,0.35)]'
              }`}
            >
              <span>Launch Resume Builder</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              onClick={handleDemo}
              className="px-5 py-3.5 text-sm font-semibold text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] rounded-xl transition-all cursor-pointer"
            >
              Load Sample Profile
            </button>
          </div>

        </div>
      </section>

    </div>
  );
};

export default LandingPage;
