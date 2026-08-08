import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  PlayCircle,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Bot,
  FileCheck,
  Download,
  Layout,
  History,
  Lock,
  GraduationCap,
  ChevronDown,
  ArrowRight,
  Heart,
  Check,
  Star,
  Layers,
  Wand2,
  Shield,
  Shuffle,
  Grid,
  Users,
  Wand
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useResume } from '../context/ResumeContext';

export const LandingPage = () => {
  const navigate = useNavigate();
  const { loadDemoResume } = useResume();
  const [openFaq, setOpenFaq] = useState(null);

  const handleDemo = () => {
    loadDemoResume();
    navigate('/builder');
  };

  const trustBadges = [
    { label: "Free Forever Builder", icon: ShieldCheck },
    { label: "No Watermark", icon: Shield },
    { label: "No Ads & No Forced Login", icon: Lock },
    { label: "Unlimited PDF Exports", icon: Download }
  ];

  const campusLogos = [
    { name: "IIT Bombay" },
    { name: "IIT Delhi" },
    { name: "BITS Pilani" },
    { name: "NSIT" },
    { name: "DTU" },
    { name: "NIT Trichy" },
    { name: "VIT" },
    { name: "IIIT Bangalore" }
  ];

  const featuresList = [
    { title: "Professional Templates", desc: "Curated ATS-friendly templates designed by top tech recruiters.", icon: Layout },
    { title: "AI Resume Assistant", desc: "Instant AI rewrites, metric enhancers, and action verb suggestions.", icon: Wand2 },
    { title: "ATS Score Scanner", desc: "Real-time circular score breakdown with actionable optimization hints.", icon: CheckCircle2 },
    { title: "Free PDF Download", desc: "Pixel-perfect browser print engine with clean A4 page breaks.", icon: Download },
    { title: "Version History", desc: "Restore snapshots and maintain multiple resume variations.", icon: History },
    { title: "JSON Schema Architecture", desc: "Future-proof structured data model compatible across OpportunityX OS.", icon: Layers },
    { title: "Modern Dark SaaS Theme", desc: "Sleek, minimal aesthetic inspired by Apple, Linear, and Raycast.", icon: Sparkles },
    { title: "Ecosystem Integration", desc: "Connects seamlessly with verify.opportunityx.co.in & Career OS.", icon: Star }
  ];

  const templatesGallery = [
    { name: "Modern Tech Lead", category: "Developer", tag: "Popular", color: "#F97316" },
    { name: "Minimalist ATS", category: "Minimal", tag: "Recommended", color: "#2563EB" },
    { name: "Software Engineer", category: "Developer", tag: "Popular", color: "#059669" },
    { name: "Student Intern", category: "Student", tag: "Student", color: "#7C3AED" },
    { name: "Data Scientist", category: "AI Engineer", tag: "New", color: "#F59E0B" },
    { name: "Executive Director", category: "Executive", tag: "Recommended", color: "#EC4899" }
  ];

  const faqs = [
    { q: "Is OpportunityX Resume really 100% free?", a: "Yes. There are zero subscriptions, locked features, or watermarks. It is completely free as part of the OpportunityX ecosystem." },
    { q: "Will my resume pass ATS scanners?", a: "Absolutly. Our templates follow strict single and clean multi-column layouts using standard web typography, making them easily parsable by Workday, Greenhouse, and Lever." },
    { q: "Where is my resume data saved?", a: "Your resume data is stored locally inside your browser using structured JSON. We do not track or sell your personal information." },
    { q: "Can I import an existing PDF or JSON resume?", a: "Yes! Use our Import page to upload JSON schemas or drag & drop text for auto-formatting." }
  ];

  return (
    <div className="space-y-24 pb-20 overflow-x-hidden bg-[var(--ox-bg)] text-[var(--ox-text-primary)] transition-colors duration-300">
      {/* 1. HERO SECTION */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden">
        {/* Ambient Orange Glow behind Pedestal & Grid Background */}
        <div className="absolute top-1/4 right-10 w-[650px] h-[450px] bg-gradient-to-r from-[#F97316]/15 via-amber-500/10 to-transparent rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_20%,#000_70%,transparent_100%)] pointer-events-none opacity-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT COLUMN: Headline, Badges, CTAs, Social Proof */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Top Pill Badge: 100% FREE FOREVER */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-xs font-semibold shadow-[0_0_15px_rgba(249,115,22,0.15)]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#F97316]" />
              <span>100% FREE FOREVER</span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black text-[var(--ox-text-primary)] tracking-tight leading-[1.1]"
            >
              Build a Professional <br className="hidden sm:inline" />
              Resume That <span className="text-gradient-primary">Gets <br className="hidden sm:inline" />Interviews.</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="text-base sm:text-lg text-[var(--ox-text-secondary)] max-w-xl leading-relaxed font-normal"
            >
              Create ATS-friendly resumes in minutes with beautiful templates, AI writing assistant, and smart optimization — completely free.
            </motion.p>

            {/* Trust Badges (4 Glass Pills) */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap gap-3 pt-1"
            >
              {trustBadges.map((badge, idx) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-xs text-[var(--ox-text-primary)] font-medium shadow-sm hover:border-[#F97316]/40 transition-colors"
                  >
                    <Icon className="w-3.5 h-3.5 text-[#F97316]" />
                    <span>{badge.label}</span>
                  </div>
                );
              })}
            </motion.div>

            {/* CTA Buttons Row */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="flex flex-wrap items-center gap-3 pt-2"
            >
              {/* Primary Create Resume Button */}
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/builder"
                  className="px-6 py-3.5 text-sm font-bold text-white bg-gradient-to-r from-[#F97316] to-[#F59E0B] hover:from-[#EA580C] hover:to-[#D97706] rounded-xl shadow-[0_0_25px_rgba(249,115,22,0.4)] hover:shadow-[0_0_35px_rgba(249,115,22,0.6)] transition-all flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4 stroke-[2.5]" /> Create Resume
                </Link>
              </motion.div>

              {/* Try Demo Resume Button */}
              <button
                onClick={handleDemo}
                className="px-5 py-3.5 text-xs sm:text-sm font-semibold text-[#F97316] bg-[#F97316]/10 hover:bg-[#F97316]/20 border border-[#F97316]/30 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <PlayCircle className="w-4 h-4" /> Try Demo Resume
              </button>

              {/* Import Resume Button */}
              <Link
                to="/import"
                className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Upload className="w-4 h-4 text-[#F97316]" /> Import Resume
              </Link>

              {/* Check ATS Score Button */}
              <Link
                to="/ats-checker"
                className="px-4 py-3.5 text-xs sm:text-sm font-semibold text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] rounded-xl transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Check ATS Score
              </Link>
            </motion.div>

            {/* Social Proof Row with User Avatars */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="pt-4 flex items-center gap-3"
            >
              {/* Stacked Avatar Circles */}
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--ox-bg)] object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" alt="User 1" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--ox-bg)] object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="User 2" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--ox-bg)] object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="User 3" />
                <img className="inline-block h-8 w-8 rounded-full ring-2 ring-[var(--ox-bg)] object-cover" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="User 4" />
              </div>
              <p className="text-xs text-[var(--ox-text-secondary)]">
                Loved by <strong className="text-[var(--ox-text-primary)]">10,000+ students & professionals</strong> across 50+ colleges & companies
              </p>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: REFINED LUXURY STATIONERY RESUME SHOWCASE CARD (#F7F6F2) WITH FLOATING COMPACT WIDGETS */}
          <div className="lg:col-span-5 relative flex justify-center w-full min-h-[460px]">
            {/* Soft Ambient Radial Orange Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] bg-[#F97316]/10 rounded-full blur-[80px] pointer-events-none" />

            {/* Glowing 3D Pedestal Base */}
            <div className="absolute -bottom-4 w-96 h-24 rounded-full bg-gradient-to-b from-[var(--ox-card-bg)] to-[var(--ox-bg)] border-2 border-[var(--ox-border-highlight)] shadow-[0_0_45px_rgba(249,115,22,0.2)] transform rotate-X-60 pointer-events-none flex items-center justify-center">
              <div className="w-80 h-16 rounded-full border border-[#F97316]/50 shadow-[inset_0_0_25px_rgba(249,115,22,0.4)]" />
            </div>

            {/* Main Floating Resume Showcase Card: #F7F6F2 Surface, Soft Depth, Elegant Spacing */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative z-10 w-full max-w-[460px] bg-[#F7F6F2] rounded-2xl border border-[#E2DFD8] p-6 text-[#374151] font-sans shadow-[0_20px_50px_rgba(0,0,0,0.18),0_0_25px_rgba(249,115,22,0.12)] space-y-3 text-xs transform rotate-2 hover:rotate-0 transition-transform duration-500 select-none overflow-hidden"
            >
              {/* Thin Accent Bar */}
              <div className="h-[3px] w-full bg-gradient-to-r from-[#F97316] to-amber-500 rounded-t-2xl -mt-6 -mx-6 mb-4 px-6" />

              {/* Header: Name, Title, Contact & Avatar */}
              <div className="flex items-start justify-between border-b pb-3 border-[#E2DFD8]">
                <div className="space-y-0.5">
                  <h3 className="text-2xl font-bold text-[#1F2937] tracking-tight">Alex Rivera</h3>
                  <p className="text-xs font-bold text-[#F97316]">Senior Full Stack Software Engineer</p>
                  <div className="text-[10px] text-[#6B7280] font-medium">San Francisco, CA • alex.rivera@dev • linkedin.com/in/alexrivera</div>
                </div>
                {/* Profile Photo Avatar */}
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt="Profile Avatar"
                  className="w-11 h-11 rounded-full border-2 border-[#F97316]/50 object-cover shadow-sm flex-shrink-0"
                />
              </div>

              {/* Professional Summary */}
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#F97316]">
                  Professional Summary
                </div>
                <p className="text-[11px] text-[#374151] leading-relaxed font-normal">
                  Versatile Software Engineer with 5+ years experience building high-throughput microservices and AI-assisted search indexing serving 2M+ active users.
                </p>
              </div>

              {/* Skills Badges */}
              <div className="space-y-0.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#F97316]">
                  Key Skills
                </div>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  <span className="px-2 py-0.5 rounded bg-white border border-[#E2DFD8] text-[10px] font-semibold text-[#1F2937] shadow-2xs">TypeScript</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#E2DFD8] text-[10px] font-semibold text-[#1F2937] shadow-2xs">React & Vite</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#E2DFD8] text-[10px] font-semibold text-[#1F2937] shadow-2xs">Node.js</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#E2DFD8] text-[10px] font-semibold text-[#1F2937] shadow-2xs">GraphQL</span>
                  <span className="px-2 py-0.5 rounded bg-white border border-[#E2DFD8] text-[10px] font-semibold text-[#1F2937] shadow-2xs">AWS</span>
                </div>
              </div>

              {/* Work Experience (Clean single experience) */}
              <div className="space-y-1 pt-0.5 border-t border-[#E2DFD8]">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#F97316]">
                  Experience
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between font-bold text-[#1F2937] text-[11px]">
                    <span>Senior Software Engineer — TechFlow Inc.</span>
                    <span className="text-[#6B7280] font-normal">2022–Present</span>
                  </div>
                  <ul className="list-disc list-inside text-[10px] text-[#4B5563] space-y-0.5">
                    <li>Architected scalable microservices handling 2M+ daily requests with 99.9% uptime.</li>
                    <li>Pioneered AI vector search, boosting user search engagement by 65%.</li>
                  </ul>
                </div>
              </div>

              {/* Education (Clean single education) */}
              <div className="space-y-0.5 pt-0.5 border-t border-[#E2DFD8]">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#F97316]">
                  Education
                </div>
                <div className="flex justify-between text-[10px] font-bold text-[#1F2937]">
                  <span>B.Tech in Computer Science — UC Berkeley</span>
                  <span className="text-[#6B7280] font-normal">GPA 3.88 / 4.0</span>
                </div>
              </div>
            </motion.div>

            {/* COMPACT FLOATING GLASS WIDGETS AROUND THE RESUME CARD */}
            {/* Widget 1: Top Right - ATS Score */}
            <motion.div
              animate={{ y: [-4, 4, -4] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-3 -right-2 z-20 hidden xl:flex items-center gap-2 px-3.5 py-1.5 bg-[var(--ox-card-bg)] backdrop-blur-md border border-emerald-500/40 rounded-full shadow-lg transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] font-bold text-[var(--ox-text-primary)]">ATS Score: 94/100</span>
            </motion.div>

            {/* Widget 2: Top Left - AI Optimized */}
            <motion.div
              animate={{ y: [4, -4, 4] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-12 -left-4 z-20 hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--ox-card-bg)] backdrop-blur-md border border-[#F97316]/40 rounded-full shadow-lg transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#F97316]" />
              <span className="text-[10px] font-bold text-[#F97316]">AI Optimized</span>
            </motion.div>

            {/* Widget 3: Bottom Left - No Watermark */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-12 -left-2 z-20 hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--ox-card-bg)] backdrop-blur-md border border-[var(--ox-border)] rounded-full shadow-lg transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-semibold text-[var(--ox-text-primary)]">No Watermark</span>
            </motion.div>

            {/* Widget 4: Bottom Right - Modern Template */}
            <motion.div
              animate={{ y: [5, -5, 5] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-2 -right-2 z-20 hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--ox-card-bg)] backdrop-blur-md border border-[var(--ox-border)] rounded-full shadow-lg transition-colors"
            >
              <Layout className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] font-semibold text-[var(--ox-text-primary)]">Modern Template</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. TRUSTED BY STUDENTS CAMPUS LOGOS BANNER */}
      <section className="border-y border-[var(--ox-border)] bg-[var(--ox-surface-primary)] py-8 px-4 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-4 text-center">
          <h3 className="text-xs font-bold uppercase tracking-widest text-[var(--ox-text-secondary)]">
            TRUSTED BY STUDENTS FROM
          </h3>
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 text-sm font-bold text-[var(--ox-text-secondary)]">
            {campusLogos.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 hover:text-[var(--ox-text-primary)] transition-colors cursor-pointer">
                <GraduationCap className="w-4 h-4 text-[#F97316]" />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. POWERFUL FEATURES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 pt-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F97316] uppercase tracking-wider">
            <span>⚡ POWERFUL FEATURES</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[var(--ox-text-primary)]">
            Everything You Need to Build the Perfect Resume
          </h2>
          <p className="text-sm text-[var(--ox-text-secondary)] max-w-xl mx-auto">
            Powerful tools to help you create, optimize, and land your dream job.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featuresList.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="cyber-glass-card p-6 space-y-3 hover:border-[#F97316]/50 transition-all duration-300 group"
              >
                <div className="p-3 w-max rounded-xl bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-[var(--ox-text-primary)]">{feat.title}</h4>
                <p className="text-xs text-[var(--ox-text-secondary)] leading-relaxed">{feat.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. TEMPLATES PREVIEW GALLERY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-[var(--ox-text-primary)]">Professional Templates</h2>
            <p className="text-sm text-[var(--ox-text-secondary)]">Clean, ATS-ready formats tagged for every career level.</p>
          </div>
          <Link
            to="/templates"
            className="text-xs font-semibold text-[#F97316] hover:text-orange-400 flex items-center gap-1 hover:underline"
          >
            View All Templates <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {templatesGallery.map((tmpl, idx) => (
            <div key={idx} className="cyber-glass-card p-5 space-y-4 hover:border-[#F97316]/50 transition-all group">
              <div className="h-44 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] p-4 relative overflow-hidden flex flex-col justify-between transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#F97316]/10 text-[#F97316] border border-[#F97316]/30">
                    {tmpl.tag}
                  </span>
                  <span className="text-[10px] text-[var(--ox-text-secondary)] font-semibold">{tmpl.category}</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-1/2 rounded bg-[#F97316]/30" />
                  <div className="h-2 w-3/4 rounded bg-[var(--ox-border)]" />
                  <div className="h-2 w-full rounded bg-[var(--ox-border)]" />
                </div>
                <div className="pt-2 flex gap-1">
                  <div className="h-2 w-12 rounded bg-[#F97316]/50" />
                  <div className="h-2 w-8 rounded bg-[var(--ox-border)]" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[var(--ox-text-primary)]">{tmpl.name}</h4>
                  <p className="text-[11px] text-[var(--ox-text-secondary)]">{tmpl.category} Format</p>
                </div>
                <button
                  onClick={() => navigate('/builder')}
                  className="px-3 py-1.5 text-xs font-semibold text-white bg-[#F97316] hover:bg-orange-600 rounded-lg transition-colors cursor-pointer"
                >
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. COMMUNITY DRIVEN OPEN SOURCE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="cyber-glass-card p-8 rounded-3xl border-[#F97316]/30 text-center space-y-4 relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F97316]/10 border border-[#F97316]/30 text-[#F97316] text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 fill-[#F97316]" /> Community Driven Open Source
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--ox-text-primary)] max-w-2xl mx-auto">
            Built for Students & Professionals by OpportunityX
          </h2>
          <p className="text-xs sm:text-sm text-[var(--ox-text-secondary)] max-w-xl mx-auto leading-relaxed">
            We believe career tools should be accessible to everyone. No hidden fees, subscription traps, or forced paywalls. Join thousands using OpportunityX ecosystem tools.
          </p>
        </div>
      </section>
    </div>
  );
};
