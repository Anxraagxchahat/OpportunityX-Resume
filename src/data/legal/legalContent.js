/**
 * OpportunityX Ecosystem — Central Legal, Compliance & Shared Support Store
 * Reusable legal & company definitions for OpportunityX Resume, Career OS,
 * Freelance Hub, Portfolio Engine, and Verification platform.
 * Reuses official company branding & contact details from main OpportunityX project.
 */

export const COMPANY_INFO = {
  name: 'OpportunityX',
  tagline: 'AI-Powered Enterprise Career Operating System',
  supportEmail: 'support@opportunityx.co.in',
  businessEmail: 'hello@opportunityx.co.in',
  dmcaEmail: 'dmca@opportunityx.co.in',
  privacyEmail: 'privacy@opportunityx.co.in',
  website: 'https://opportunityx.co.in',
  founders: [
    {
      name: 'Anurag Verma',
      role: 'Founder & CEO (Full-Stack & AI Architecture)',
      linkedin: 'https://www.linkedin.com/in/anurag-verma-388238246/',
      github: 'https://github.com/Anxraagxchahat'
    },
    {
      name: 'Naman Mishra',
      role: 'Co-Founder & CTO (Platform Engineering)',
      linkedin: 'https://www.linkedin.com/in/namanmishracse/',
      x: 'https://x.com/Namanrock09'
    }
  ],
  socials: [
    { label: 'LinkedIn (Anurag Verma)', handle: 'Anurag Verma', url: 'https://www.linkedin.com/in/anurag-verma-388238246/' },
    { label: 'GitHub', handle: '@Anxraagxchahat', url: 'https://github.com/Anxraagxchahat' },
    { label: 'Instagram', handle: '@theopportunityx', url: 'https://www.instagram.com/theopportunityx/' },
    { label: 'LinkedIn (Naman Mishra)', handle: 'Naman Mishra', url: 'https://www.linkedin.com/in/namanmishracse/' },
    { label: 'X', handle: '@Namanrock09', url: 'https://x.com/Namanrock09' }
  ]
};

export const LEGAL_PAGES = {
  'privacy-policy': {
    id: 'privacy-policy',
    title: 'Privacy Policy',
    subtitle: 'How OpportunityX collects, handles, stores, and protects your personal data.',
    lastUpdated: 'August 2026',
    seo: {
      title: 'Privacy Policy | OpportunityX',
      description: 'Detailed privacy policy explaining Firebase Auth identity, PostgreSQL data isolation, AI request security, and user rights.',
      canonicalUrl: 'https://resume.opportunityx.co.in/legal/privacy-policy'
    },
    sections: [
      {
        heading: '1. Information We Collect',
        text: 'OpportunityX collects personal information necessary to deliver resume building services, authentication, and credit management:',
        bulletPoints: [
          'Identity Information: Display Name, Email Address, and Profile Photo URL supplied during Firebase OAuth sign-in.',
          'Resume Data: Personal contact info, work history, education, skills, projects, certifications, and formatting preferences stored in your resume JSON drafts.',
          'Technical & Usage Data: Browser type, operating system, IP address, request IDs, and session timestamps for security auditing.',
          'Payment Metadata: Cashfree payment order IDs, transaction amounts, credit counts, and status timestamps. We NEVER store credit card numbers, CVVs, or bank passwords.'
        ]
      },
      {
        heading: '2. Firebase Authentication & Identity Source of Truth',
        text: 'Central OpportunityX Firebase Authentication (Project ID: opportunityx-61efd) is the single source of truth for user identity. The PostgreSQL users table is an isolated read-cache that maps your Firebase UID as an immutable primary key across all ecosystem services.'
      },
      {
        heading: '3. Data Storage & PostgreSQL Isolation Rule',
        text: 'Your business data (resumes, version snapshots, credit wallets, payment history) is stored in an independent PostgreSQL database. OpportunityX Resume NEVER stores business data inside OpportunityX Firestore, maintaining strict database isolation for enhanced security.'
      },
      {
        heading: '4. Firebase Storage for Binary Assets',
        text: 'Profile photos, logos, signatures, and exported resume image assets are uploaded and stored securely in Firebase Storage. Binary files are never stored inside PostgreSQL.'
      },
      {
        heading: '5. AI Processing & OpenRouter Security',
        text: 'When you execute AI resume summaries, ATS reviews, or content rewrites, your input prompt is sent over TLS 1.3 encryption to OpenRouter API model providers. AI model providers do NOT store or use your resume text to train public foundational AI models.'
      },
      {
        heading: '6. Cookies & Analytics',
        text: 'We use essential cookies to maintain secure authentication state and local storage to preserve active drafts. We use aggregate analytics to evaluate feature performance without tracking personal identifiable information.'
      },
      {
        heading: '7. Data Retention & Account Deletion Rights',
        text: 'Your resume data is retained for as long as your OpportunityX account remains active. You can delete individual resumes at any time or request complete account erasure by contacting privacy@opportunityx.co.in.'
      }
    ]
  },

  'terms-and-conditions': {
    id: 'terms-and-conditions',
    title: 'Terms & Conditions',
    subtitle: 'Governance, acceptable use, and terms of service for OpportunityX Resume.',
    lastUpdated: 'August 2026',
    seo: {
      title: 'Terms & Conditions | OpportunityX',
      description: 'Terms of service, user responsibilities, AI usage terms, intellectual property, and account rules.',
      canonicalUrl: 'https://resume.opportunityx.co.in/legal/terms-and-conditions'
    },
    sections: [
      {
        heading: '1. Acceptance of Terms',
        text: 'By accessing or using OpportunityX Resume, you agree to be bound by these Terms & Conditions. If you do not agree, you must discontinue using our services.'
      },
      {
        heading: '2. User Responsibilities & Content Ownership',
        text: 'You retain 100% intellectual property ownership of all resume text, work history, and achievements you upload or generate. You are solely responsible for ensuring the accuracy and truthfulness of the information presented on your resume.'
      },
      {
        heading: '3. Resume Builder Usage & Free Core Promise',
        text: 'The core resume builder (editing, styling, PDF export, ATS scoring, and templates) is 100% Free Forever with no hidden watermarks. AI enhancement features consume AI credits, which are granted free on login or purchasable via credit packs.'
      },
      {
        heading: '4. AI Feature Usage & Credit Terms',
        text: 'AI credits purchased or granted are tied to your Firebase UID. Credits do not expire. Abuse of AI endpoints, reverse engineering API routes, or automated scraping is strictly prohibited and subject to account suspension.'
      },
      {
        heading: '5. Public Resume Links & Sharing',
        text: 'When you generate a public share link, your resume becomes accessible via a unique URL. You can deactivate public links at any time from your dashboard.'
      },
      {
        heading: '6. Intellectual Property of OpportunityX',
        text: 'OpportunityX retains all rights, title, and interest in the OpportunityX codebase, UI design system, logos, software architecture, and template definitions.'
      },
      {
        heading: '7. Limitation of Liability',
        text: 'To the maximum extent permitted by law, OpportunityX is provided "AS IS" without warranties of any kind. OpportunityX is not liable for indirect, incidental, or consequential damages resulting from job application outcomes.'
      }
    ]
  },

  'refund-policy': {
    id: 'refund-policy',
    title: 'Refund & Cancellation Policy',
    subtitle: 'Transparent refund policy for digital AI credit pack purchases.',
    lastUpdated: 'August 2026',
    seo: {
      title: 'Refund & Cancellation Policy | OpportunityX',
      description: 'Refund terms for digital AI credit packs, duplicate payment resolutions, and failed transaction handling.',
      canonicalUrl: 'https://resume.opportunityx.co.in/legal/refund-policy'
    },
    sections: [
      {
        heading: '1. Digital Product Delivery Model',
        text: 'AI Credits are non-physical digital service credits delivered instantly to your account wallet upon payment confirmation by Cashfree Payment Gateway.'
      },
      {
        heading: '2. Non-Refundable Scenarios',
        text: 'Because AI credits are delivered instantly and available immediately for LLM generation, credit packs are non-refundable once successfully added to your wallet, except in cases specified below.'
      },
      {
        heading: '3. Duplicate & Failed Payment Refunds',
        text: 'Refund Eligibility & Execution:',
        bulletPoints: [
          'Duplicate Billing: If a network delay causes duplicate payment deductions for a single credit pack, the duplicate charge will be refunded 100% back to the original source within 3 to 5 business days upon verification.',
          'Failed Delivery: If money is debited but credits fail to deliver due to gateway errors, Cashfree PG automatically reconciles and refunds the debited amount within 24 to 48 hours.',
          'System Malfunctions: Exceptional refunds may be issued if an unresolvable technical fault on our backend prevents credit utilization.'
        ]
      },
      {
        heading: '4. Refund Request Process',
        text: 'To request a refund review, email support@opportunityx.co.in with your Order ID, Payment Transaction ID, Cashfree Reference Number, and registered email address.'
      }
    ]
  },

  'cookie-policy': {
    id: 'cookie-policy',
    title: 'Cookie Policy',
    subtitle: 'Understanding cookies, local storage, and privacy controls.',
    lastUpdated: 'August 2026',
    seo: {
      title: 'Cookie Policy | OpportunityX',
      description: 'Comprehensive breakdown of essential authentication cookies, preference storage, and analytics.',
      canonicalUrl: 'https://resume.opportunityx.co.in/legal/cookie-policy'
    },
    sections: [
      {
        heading: '1. What Are Cookies & Local Storage?',
        text: 'Cookies and Local Storage are small text files stored in your browser to remember preferences, secure login sessions, and optimize web performance.'
      },
      {
        heading: '2. Types of Cookies We Use',
        text: 'We categorize cookies into four functional tiers:',
        bulletPoints: [
          'Essential Authentication Cookies: Required by Firebase Auth to verify identity and maintain secure login state.',
          'Draft & Preference Cookies: Store active resume selections, theme modes (Dark/Light), and editor zoom level in LocalStorage.',
          'Analytics Cookies: Anonymous aggregate telemetry used to evaluate feature usage without tracking individual identities.',
          'Security & Fraud Prevention Cookies: Protect payment checkout sessions against CSRF attacks.'
        ]
      },
      {
        heading: '3. Managing Cookie Consent',
        text: 'You can adjust your cookie settings at any time using our Cookie Consent Banner or by clearing browser site data.'
      }
    ]
  },

  'ai-policy': {
    id: 'ai-policy',
    title: 'AI Usage & Responsible AI Policy',
    subtitle: 'Standards for AI-generated resume summaries, ATS suggestions, and responsible usage.',
    lastUpdated: 'August 2026',
    seo: {
      title: 'AI Usage Policy | OpportunityX',
      description: 'Guidelines on AI resume generation, user review obligations, ATS scoring, and hiring disclaimers.',
      canonicalUrl: 'https://resume.opportunityx.co.in/legal/ai-policy'
    },
    sections: [
      {
        heading: '1. Purpose of AI Assistance',
        text: 'OpportunityX AI is an intelligent career writing copilot designed to help job seekers rephrase bullet points, highlight achievements, generate cover letters, and score resumes against job descriptions.'
      },
      {
        heading: '2. User Verification & Responsibility',
        text: 'AI models can occasionally generate inaccurate phrasing or incorrect technical terms ("hallucinations"). Users are obligated to carefully review, edit, and verify all AI-generated content before submitting resumes to employers.'
      },
      {
        heading: '3. No Guarantee of Employment',
        text: 'AI ATS recommendations and optimization scores are advisory estimates based on industry patterns. OpportunityX makes NO guarantee that AI-optimized resumes will result in job interviews, offers, or employment.'
      },
      {
        heading: '4. Ethical & Fair Usage',
        text: 'Users must not use AI generation to create fraudulent credentials, fake work experience, or deceptive claims intended to misrepresent qualifications.'
      }
    ]
  },

  'disclaimer': {
    id: 'disclaimer',
    title: 'Disclaimer',
    subtitle: 'Career assistance disclaimers, employment guarantees, and third-party services.',
    lastUpdated: 'August 2026',
    seo: {
      title: 'Disclaimer | OpportunityX',
      description: 'Legal disclaimers covering career advice, ATS score estimates, and third-party integrations.',
      canonicalUrl: 'https://resume.opportunityx.co.in/legal/disclaimer'
    },
    sections: [
      {
        heading: '1. Educational & Career Assistance Only',
        text: 'The resume tools, ATS score calculations, and AI suggestions provided by OpportunityX are intended strictly for career assistance and educational purposes.'
      },
      {
        heading: '2. No Employment Warranties',
        text: 'OpportunityX is not an employment agency or recruiter. We do not guarantee job placements, salary outcomes, or response rates from employers.'
      },
      {
        heading: '3. Third-Party Integrations',
        text: 'OpportunityX integrates with third-party providers including Firebase (Google), Cashfree Payment Gateway, and OpenRouter AI. OpportunityX is not responsible for third-party downtime or external network failures.'
      }
    ]
  },

  'community-guidelines': {
    id: 'community-guidelines',
    title: 'Community Guidelines',
    subtitle: 'Standards for public resume sharing, profile hosting, and respectful usage.',
    lastUpdated: 'August 2026',
    seo: {
      title: 'Community Guidelines | OpportunityX',
      description: 'Rules for public sharing, prohibited content, spam prevention, and account action policy.',
      canonicalUrl: 'https://resume.opportunityx.co.in/legal/community-guidelines'
    },
    sections: [
      {
        heading: '1. Respectful & Lawful Conduct',
        text: 'OpportunityX is built for professional growth. Users must not create or publicly share content that includes hate speech, harassment, explicit material, or unlawful text.'
      },
      {
        heading: '2. Prohibition of Impersonation & Malicious Content',
        text: 'Impersonating another individual, uploading malware, scripting automated requests, or attempting to breach platform security is strictly prohibited.'
      },
      {
        heading: '3. Enforcement & Account Actions',
        text: 'OpportunityX reserves the right to deactivate public links or suspend accounts found in violation of community guidelines without prior notice.'
      }
    ]
  },

  'dmca-policy': {
    id: 'dmca-policy',
    title: 'Copyright & DMCA Takedown Policy',
    subtitle: 'Copyright infringement reporting, takedown procedures, and counter-notifications.',
    lastUpdated: 'August 2026',
    seo: {
      title: 'Copyright & DMCA Policy | OpportunityX',
      description: 'Instructions for submitting copyright infringement notices and DMCA counter-claims.',
      canonicalUrl: 'https://resume.opportunityx.co.in/legal/dmca-policy'
    },
    sections: [
      {
        heading: '1. Reporting Copyright Infringement',
        text: 'OpportunityX respects intellectual property rights. If you believe your copyrighted work has been copied or posted on our platform without authorization, send a formal DMCA notice to dmca@opportunityx.co.in.'
      },
      {
        heading: '2. Notice Requirements',
        text: 'Your DMCA notice must include:',
        bulletPoints: [
          'Physical or electronic signature of the copyright owner or authorized representative.',
          'Identification of the copyrighted work claimed to have been infringed.',
          'Exact URL or location of the infringing material on OpportunityX.',
          'Your contact details: Name, Address, Telephone, and Email address.',
          'A statement of good faith belief that the use is unauthorized.',
          'A statement under penalty of perjury that the information in the notice is accurate.'
        ]
      },
      {
        heading: '3. Counter-Notification & Repeat Infringers',
        text: 'Users who receive a takedown notice may file a counter-notification. Accounts identified as repeat infringers will have their access terminated.'
      }
    ]
  },

  'about': {
    id: 'about',
    title: 'About OpportunityX',
    subtitle: 'Building the next-generation AI-powered career operating system for students & professionals.',
    lastUpdated: 'August 2026',
    seo: {
      title: 'About OpportunityX | AI Career OS',
      description: 'Learn about OpportunityX, our mission to democratize career growth, founders Anurag Verma & Naman Mishra, and ecosystem products.',
      canonicalUrl: 'https://resume.opportunityx.co.in/legal/about'
    },
    sections: [
      {
        heading: 'Our Vision & Mission',
        text: 'OpportunityX was founded to solve a fundamental problem faced by job seekers worldwide: fragmented career tools, predatory subscription paywalls, and opaque hiring algorithms. We believe every candidate should have access to enterprise-grade, ATS-compliant resume tools completely free without watermarks.'
      },
      {
        heading: 'Founders & Leadership Team',
        text: 'OpportunityX is built by passionate engineers dedicated to open career infrastructure:',
        bulletPoints: [
          'Anurag Verma — Founder & CEO (Full-Stack Engineer & AI Infrastructure Lead)',
          'Naman Mishra — Co-Founder & CTO (Platform Engineering & Community Lead)'
        ]
      },
      {
        heading: 'The OpportunityX Ecosystem',
        text: 'OpportunityX Resume is part of a unified product suite connected by single Firebase Authentication identity:',
        bulletPoints: [
          'OpportunityX Main Platform (opportunityx.co.in) — Opportunity discovery & career feed',
          'OpportunityX Resume (resume.opportunityx.co.in) — ATS resume builder & AI optimizer',
          'OpportunityX Verify (verify.opportunityx.co.in) — Credentials & certificate verification',
          'OpportunityX Career OS (career.opportunityx.co.in) — End-to-end career management',
          'OpportunityX Freelance Hub (freelancing.opportunityx.co.in) — Freelancer marketplace'
        ]
      }
    ]
  },

  'contact': {
    id: 'contact',
    title: 'Contact Support & Help Center',
    subtitle: 'Direct communication channels for support, bug reports, partnerships, and business inquiries.',
    lastUpdated: 'August 2026',
    seo: {
      title: 'Contact Support | OpportunityX',
      description: 'Official contact support page for OpportunityX. Submit support inquiries, report bugs, or request business partnerships.',
      canonicalUrl: 'https://resume.opportunityx.co.in/legal/contact'
    },
    sections: [
      {
        heading: 'Official Contact Channels',
        text: 'Get in touch directly with our support and engineering teams:',
        bulletPoints: [
          'Customer & Technical Support: support@opportunityx.co.in',
          'Business Partnerships & Media: hello@opportunityx.co.in',
          'Privacy & Data Deletion: privacy@opportunityx.co.in',
          'Copyright & DMCA Notices: dmca@opportunityx.co.in'
        ]
      }
    ]
  }
};
