/**
 * OpportunityX Resume Schema & Sample Data
 * Fully compliant with OpportunityX Ecosystem Profile Specs (career.opportunityx.co.in, verify.opportunityx.co.in)
 */

export const defaultResumeData = {
  metadata: {
    id: "ox-resume-demo-001",
    title: "Alex Rivera - Software Engineer Resume",
    template: "modern", // modern, minimal, tech, executive, creative, student
    fontFamily: "Inter", // Inter, Outfit, Plus Jakarta Sans, JetBrains Mono
    accentColor: "#F97316", // OpportunityX Orange
    spacing: "normal", // compact, normal, spacious
    lastSaved: new Date().toISOString(),
    version: 1,
  },
  ecosystem: {
    version: "1.0.0",
    verificationHash: "ox_verify_a9f82d4c",
    syncReady: true,
    platform: "OpportunityX Career OS"
  },
  personal: {
    fullName: "Alex Rivera",
    jobTitle: "Senior Full Stack Software Engineer",
    email: "alex.rivera@opportunityx.dev",
    phone: "+1 (555) 234-5678",
    location: "San Francisco, CA / Remote",
    website: "https://alexrivera.dev",
    github: "github.com/alexrivera",
    linkedin: "linkedin.com/in/alexrivera-dev",
    summary: "Versatile Full Stack Software Engineer with 5+ years of experience engineering high-throughput SaaS applications, cloud-native microservices, and AI-assisted web interfaces. Recognized for optimizing backend APIs to achieve 40% lower response latency and scaling distributed architectures serving 2M+ active users.",
  },
  experience: [
    {
      id: "exp-1",
      company: "Nexus Technologies",
      role: "Senior Full Stack Engineer",
      location: "San Francisco, CA",
      startDate: "2023-01",
      endDate: "Present",
      current: true,
      bullets: [
        "Architected distributed React & Node.js web services processing 15M+ daily API requests with 99.99% SLA uptime.",
        "Integrated Framer Motion micro-interactions and optimized bundle sizes, reducing initial page load time by 38%.",
        "Pioneered AI-assisted search functionality using vector databases, boosting user search engagement by 65%.",
        "Mentored a cross-functional team of 6 engineers and instituted automated CI/CD unit testing workflows."
      ]
    },
    {
      id: "exp-2",
      company: "CloudScale Systems",
      role: "Software Engineer",
      location: "Austin, TX",
      startDate: "2021-03",
      endDate: "2022-12",
      current: false,
      bullets: [
        "Engineered real-time collaboration tools using WebSockets, React, and Redis Pub/Sub for 150K concurrent enterprise users.",
        "Refactored legacy REST APIs into GraphQL microservices, eliminating over-fetching and decreasing payload sizes by 45%.",
        "Co-authored automated test suites achieving 92% code coverage, cutting production regressions by 50%."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "University of California, Berkeley",
      degree: "B.S. in Computer Science",
      location: "Berkeley, CA",
      startDate: "2017-08",
      endDate: "2021-05",
      gpa: "3.88 / 4.0",
      description: "Graduated with High Honors. Coursework: Algorithms & Data Structures, Distributed Systems, Database Systems, Artificial Intelligence."
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "OpportunityX Pulse Dashboard",
      description: "Open-source analytics dashboard monitor designed for high-scale student tech hubs.",
      techStack: "React, Vite, Tailwind CSS, TypeScript, Chart.js",
      link: "github.com/opportunityx/pulse",
      bullets: [
        "Built responsive real-time data visualizers tracking system uptime and community contributions across 50+ campus chapters.",
        "Achieved 100/100 Lighthouse performance score with zero external layout shifts."
      ]
    },
    {
      id: "proj-2",
      name: "SmartResume Engine",
      description: "JSON-driven ATS resume parser and template renderer built with modern web technologies.",
      techStack: "React, Framer Motion, Tailwind CSS, Web Workers",
      link: "resume.opportunityx.co.in",
      bullets: [
        "Implemented instant client-side PDF rendering with custom typography and CSS print break optimizations."
      ]
    }
  ],
  skills: {
    languages: ["TypeScript", "JavaScript (ES6+)", "Python", "Go", "SQL", "HTML5/CSS3"],
    frameworks: ["React", "Next.js", "Node.js", "Express", "Tailwind CSS", "GraphQL", "REST APIs"],
    tools: ["Git", "Docker", "AWS", "PostgreSQL", "Redis", "Vite", "Framer Motion", "Jest"],
    softSkills: ["Technical Leadership", "System Architecture", "Agile/Scrum", "Product Thinking"]
  },
  certificates: [
    {
      id: "cert-1",
      name: "AWS Certified Solutions Architect – Associate",
      issuer: "Amazon Web Services",
      date: "2023"
    },
    {
      id: "cert-2",
      name: "Meta Certified Professional Front-End Developer",
      issuer: "Meta",
      date: "2022"
    }
  ],
  achievements: [
    {
      id: "ach-1",
      title: "1st Place Winner - OpportunityX Global Hackathon 2024",
      description: "Awarded top honor among 400+ international teams for building an accessible tech mentorship portal."
    }
  ],
  languages: [
    { id: "lang-1", name: "English", proficiency: "Native / Full Professional" },
    { id: "lang-2", name: "Spanish", proficiency: "Professional Working" }
  ],
  socialLinks: {
    portfolio: "https://alexrivera.dev",
    github: "https://github.com/alexrivera",
    linkedin: "https://linkedin.com/in/alexrivera-dev",
    twitter: "https://x.com/alexrivera_dev"
  },
  customSections: [
    {
      id: "cust-1",
      title: "Leadership & Volunteer",
      items: [
        {
          id: "citem-1",
          name: "OpportunityX Tech Mentor",
          description: "Guided 25+ aspiring developers through open-source software contributions and technical resume reviews."
        }
      ]
    }
  ]
};

export const emptyResumeSchema = {
  metadata: {
    id: `ox-resume-${Date.now()}`,
    title: "Untitled Resume",
    template: "modern",
    fontFamily: "Inter",
    accentColor: "#F97316",
    spacing: "normal",
    lastSaved: new Date().toISOString(),
    version: 1,
  },
  ecosystem: {
    version: "1.0.0",
    verificationHash: `ox_verify_${Math.random().toString(36).substring(2, 10)}`,
    syncReady: true,
    platform: "OpportunityX Career OS"
  },
  personal: {
    fullName: "",
    jobTitle: "",
    email: "",
    phone: "",
    location: "",
    website: "",
    github: "",
    linkedin: "",
    summary: "",
  },
  experience: [],
  education: [],
  projects: [],
  skills: {
    languages: [],
    frameworks: [],
    tools: [],
    softSkills: []
  },
  certificates: [],
  achievements: [],
  languages: [],
  socialLinks: {
    portfolio: "",
    github: "",
    linkedin: "",
    twitter: ""
  },
  customSections: []
};
