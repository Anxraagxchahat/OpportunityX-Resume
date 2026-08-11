import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ExternalLink,
  Code,
  Flame,
  Server,
  Sparkles,
  ArrowRight,
  Terminal,
  Zap,
  Globe,
  Mail,
  Network,
  Paintbrush,
  Database
} from 'lucide-react';
import './FounderPage.css';
import portraitImg from '../assets/anurag.jpg';

// Custom SVG Icons for Brands
const LinkedInIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GitHubIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

const PortfolioIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const XIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="currentColor" {...props}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const InstagramIcon = (props) => (
  <svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

export const FounderPage = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    // Set Document Title
    document.title = 'Meet the Founder - Anurag Verma | OpportunityX';

    // Set Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    const originalDesc = metaDesc ? metaDesc.getAttribute('content') : '';
    if (metaDesc) {
      metaDesc.setAttribute('content', 'Meet Anurag Verma, Founder of OpportunityX, an AI-powered career platform helping students discover opportunities, apply smarter and grow their careers.');
    } else {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      metaDesc.content = 'Meet Anurag Verma, Founder of OpportunityX, an AI-powered career platform helping students discover opportunities, apply smarter and grow their careers.';
      document.head.appendChild(metaDesc);
    }

    // Scroll to top
    window.scrollTo(0, 0);

    return () => {
      document.title = 'OpportunityX Resume — Official Ecosystem Resume Builder';
      if (metaDesc && originalDesc) {
        metaDesc.setAttribute('content', originalDesc);
      }
    };
  }, []);

  const techStack = [
    { name: 'React', icon: Code, color: '#61DAFB' },
    { name: 'Vite', icon: Zap, color: '#646CFF' },
    { name: 'TypeScript', icon: Terminal, color: '#3178C6' },
    { name: 'FastAPI', icon: Server, color: '#009688' },
    { name: 'Firebase', icon: Flame, color: '#FFCA28' },
    { name: 'Firestore', icon: Database, color: '#FFCA28' },
    { name: 'Tailwind CSS', icon: Paintbrush, color: '#38BDF8' },
    { name: 'AI Integration', icon: Sparkles, color: '#F59E0B' },
    { name: 'REST APIs', icon: Network, color: '#10B981' },
    { name: 'GitHub', icon: Globe, color: '#F8FAFC' }
  ];

  const timeline = [
    { title: 'Started learning programming', desc: 'Began building basic coding foundations, working with Python, algorithms, and web basics.' },
    { title: 'Built first projects', desc: 'Developed interactive command-line scripts, responsive portfolio frontends, and dynamic web modules.' },
    { title: 'Started freelancing journey', desc: 'Delivered customized software solutions, full-stack applications, and automation systems for clients.' },
    { title: 'Founded OpportunityX', desc: 'Envisioned a streamlined repository to consolidate internships, hackathons, and scholarships for students.' },
    { title: 'Launched OpportunityX Version 1', desc: 'Shipped the minimum viable platform, facilitating opportunity discovery for early student circles.' },
    { title: 'Released OpportunityX Version 2', desc: 'Upgraded system capabilities with AI-powered resume match scores, live feeds, and robust filters.' },
    { title: 'Future products', desc: 'Working towards expanding ecosystems to support career planning, collaborative teams, and intelligent developer toolkits.' }
  ];

  const currentProjects = [
    {
      title: 'OpportunityX Resume',
      subtitle: 'Official Ecosystem Resume Builder',
      status: 'Active',
      description: 'AI-powered, zero-watermark resume builder with instant ATS optimization and enterprise privacy.',
      link: '/builder'
    },
    {
      title: 'OpportunityX Main',
      subtitle: 'Career Operating System',
      status: 'Active',
      description: 'AI-powered platform that centralizes hackathons, scholarships, and internships, matching student skills to application criteria.',
      link: 'https://opportunityx.co.in'
    }
  ];

  return (
    <div className="founder-page max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 animate-fadeIn">
      {/* Background ambient glows */}
      <div className="founder-ambient-glows">
        <div className="glow-orange"></div>
        <div className="glow-yellow"></div>
      </div>

      {/* Header with Back Button */}
      <div className="founder-header">
        <button
          className="px-4 py-2 rounded-xl bg-[var(--ox-surface-secondary)] border border-[var(--ox-border)] text-[var(--ox-text-secondary)] hover:text-white hover:border-orange-500 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          onClick={handleGoBack}
        >
          <ArrowLeft size={16} />
          Back
        </button>
      </div>

      {/* Hero Section */}
      <section className="founder-hero-section p-6 sm:p-10 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] shadow-2xl mb-8">
        <div className="founder-hero-grid">
          <div className="founder-hero-content">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30">
              Founder & Full Stack Developer
            </span>
            <h1 className="founder-title text-3xl sm:text-5xl font-black tracking-tight text-[var(--ox-text-primary)]">
              Meet the <span className="text-orange-500">Founder</span>
            </h1>
            <h2 className="founder-name text-xl sm:text-2xl font-extrabold text-amber-400">Anurag Verma</h2>
            <p className="founder-tagline-text text-sm sm:text-base text-[var(--ox-text-secondary)] leading-relaxed">
              Building products that help students discover opportunities, apply smarter, and grow their careers with AI.
            </p>
            <div className="founder-hero-socials">
              <a href="https://github.com/Anxraagxchahat" target="_blank" rel="noopener noreferrer" className="founder-social-icon" title="GitHub">
                <GitHubIcon />
              </a>
              <a href="https://www.linkedin.com/in/anurag-verma-388238246/" target="_blank" rel="noopener noreferrer" className="founder-social-icon" title="LinkedIn">
                <LinkedInIcon />
              </a>
              <a href="https://x.com/TheOpportunityX" target="_blank" rel="noopener noreferrer" className="founder-social-icon" title="X (Twitter)">
                <XIcon />
              </a>
              <a href="https://www.instagram.com/pandaxchahat/" target="_blank" rel="noopener noreferrer" className="founder-social-icon" title="Instagram">
                <InstagramIcon />
              </a>
              <a href="https://anxraag.pages.dev" target="_blank" rel="noopener noreferrer" className="founder-social-icon" title="Portfolio">
                <PortfolioIcon />
              </a>
              <a href="mailto:hello@opportunityx.co.in" className="founder-social-icon" title="Email">
                <Mail size={18} />
              </a>
            </div>
          </div>
          <div className="founder-hero-image-wrapper">
            <div className="founder-portrait-container">
              <img
                src={portraitImg}
                alt="Anurag Verma"
                className="founder-portrait"
                loading="lazy"
              />
              <div className="portrait-glow-overlay"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About & Why I Built Sections */}
      <div className="founder-info-grid">
        {/* About Section */}
        <section className="founder-section-card p-6 sm:p-8 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] shadow-xl">
          <h3>About Me</h3>
          <div className="founder-card-body">
            <p>
              I am Anurag Verma, the founder of OpportunityX and a Full Stack Developer. Driven by curiosity and a love for building, I focus on building technology solutions that solve real-world problems. My interest lies at the intersection of developer tools, SaaS frameworks, and practical AI integrations.
            </p>
            <p>
              As an AI enthusiast, I enjoy exploring how machine learning can be structured into consumer software to make users more productive. I design and program systems targeting career alignment, educational tracking, and modern workflow management.
            </p>
            <p>
              Currently, I am focused on building OpportunityX as a long-term platform. I believe in writing simple, maintainable code, keeping a humble attitude, and delivering direct utility to users.
            </p>
          </div>
        </section>

        {/* Why I Built OpportunityX */}
        <section className="founder-section-card p-6 sm:p-8 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] shadow-xl">
          <h3>Why I Built OpportunityX</h3>
          <div className="founder-card-body">
            <p>
              During my academic and development journey, I observed that many students struggle to discover internships, hackathons, scholarships, and career opportunities. Critical deadlines are often missed simply because the information is scattered across dozens of unorganized channels and mailing lists.
            </p>
            <p>
              I built OpportunityX to simplify that journey by bringing opportunities together in one place while helping students continuously improve their preparedness. By combining clean aggregation, fast filters, and personalized AI score matches, the goal is to give every student a fair opportunity to step forward.
            </p>
            <div className="tagline-highlight-box">
              <p className="highlight-tagline-text">Discover. Apply. Grow.</p>
            </div>
          </div>
        </section>
      </div>

      {/* Vision Section */}
      <section className="founder-vision-section p-6 sm:p-8 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] shadow-xl mb-12">
        <h3>Our Vision</h3>
        <div className="vision-content">
          <p>
            Our long-term mission is to build software ecosystems that help students and professionals grow. We aim to achieve this by constructing intelligent, AI-powered tools and modern interfaces that streamline career discovery, project collaboration, and personalized skill building.
          </p>
          <p>
            We focus on incremental development, user-first design decisions, and genuine platform transparency, ensuring that OpportunityX evolves to support students at every stage of their professional journey.
          </p>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="founder-stack-section">
        <h3 className="section-title-centered text-2xl font-black text-[var(--ox-text-primary)]">Tech Stack</h3>
        <p className="section-desc-centered">Core technologies utilized to build and scale OpportunityX.</p>
        <div className="tech-stack-grid">
          {techStack.map((tech) => {
            const Icon = tech.icon;
            return (
              <div key={tech.name} className="tech-card">
                <div className="tech-icon-wrapper" style={{ '--tech-color': tech.color }}>
                  <Icon size={20} />
                </div>
                <span className="tech-name">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Journey Timeline */}
      <section className="founder-timeline-section">
        <h3 className="section-title-centered text-2xl font-black text-[var(--ox-text-primary)]">Journey Timeline</h3>
        <p className="section-desc-centered">Milestones along the journey of learning and building.</p>

        <div className="timeline-container">
          <div className="timeline-track"></div>
          {timeline.map((milestone, index) => (
            <div key={index} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
              <div className="timeline-bullet">
                <div className="bullet-inner"></div>
              </div>
              <div className="timeline-content-card">
                <span className="timeline-step">Milestone 0{index + 1}</span>
                <h4>{milestone.title}</h4>
                <p>{milestone.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Current Projects */}
      <section className="founder-projects-section">
        <h3 className="section-title-centered text-2xl font-black text-[var(--ox-text-primary)]">Current Projects</h3>
        <p className="section-desc-centered">Projects currently under development and active operation.</p>
        <div className="projects-grid">
          {currentProjects.map((project) => (
            <div key={project.title} className="project-card">
              <div className="project-header">
                <div>
                  <h4>{project.title}</h4>
                  <span className="project-subtitle">{project.subtitle}</span>
                </div>
                <span className={`status-badge-inline ${project.status === 'Active' ? 'status-active' : 'status-dev'}`}>
                  {project.status}
                </span>
              </div>
              <p className="project-desc">{project.description}</p>
              <div className="project-actions">
                {project.link.startsWith('http') ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="px-4 py-2 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-orange-500/20 transition-all">
                    Open Platform <ExternalLink size={14} />
                  </a>
                ) : (
                  <Link to={project.link} className="px-4 py-2 rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold inline-flex items-center gap-1.5 hover:bg-orange-500/20 transition-all">
                    Open Builder <ArrowRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Professional CTA & Contacts */}
      <section className="founder-cta-section p-8 rounded-3xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-center max-w-3xl mx-auto shadow-2xl">
        <div className="cta-content flex flex-col items-center gap-4">
          <Sparkles size={28} className="cta-icon text-orange-500" />
          <h3 className="text-2xl font-black text-[var(--ox-text-primary)]">Let's build something meaningful together.</h3>
          <p className="text-sm text-[var(--ox-text-secondary)] leading-relaxed max-w-xl">
            Whether you want to partner, collaborate on a project, report an issue, or simply exchange ideas, feel free to connect.
          </p>
          <div className="cta-actions flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/legal/contact" className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold inline-flex items-center gap-2 transition-all shadow-md">
              Contact <Mail size={16} />
            </Link>
            <a href="https://www.linkedin.com/in/anurag-verma-388238246/" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl border border-[var(--ox-border)] bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] hover:border-orange-500 text-xs font-bold inline-flex items-center gap-2 transition-all">
              LinkedIn <LinkedInIcon />
            </a>
            <a href="https://github.com/Anxraagxchahat" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl border border-[var(--ox-border)] bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] hover:border-orange-500 text-xs font-bold inline-flex items-center gap-2 transition-all">
              GitHub <GitHubIcon />
            </a>
            <a href="https://x.com/TheOpportunityX" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl border border-[var(--ox-border)] bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] hover:border-orange-500 text-xs font-bold inline-flex items-center gap-2 transition-all">
              X <XIcon />
            </a>
            <a href="https://www.instagram.com/pandaxchahat/" target="_blank" rel="noopener noreferrer" className="px-4 py-2.5 rounded-xl border border-[var(--ox-border)] bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] hover:border-orange-500 text-xs font-bold inline-flex items-center gap-2 transition-all">
              Instagram <InstagramIcon />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FounderPage;
