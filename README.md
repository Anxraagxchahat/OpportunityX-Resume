# OpportunityX Resume

> **A free, privacy-focused, AI-assisted resume builder built for students, developers, and modern job seekers.**

OpportunityX Resume is a production-focused resume platform from the **OpportunityX ecosystem**, designed to help users create ATS-friendly resumes, improve their content, preview A4 layouts, import existing resumes, and export polished PDFs — without forcing a complicated workflow.

<p align="center">
  <a href="https://resume.opportunityx.co.in">Live App</a> •
  <a href="https://opportunityx.co.in">OpportunityX</a> •
  <a href="https://github.com/Anxraagxchahat/OpportunityX-Resume/issues">Issues</a>
</p>

---

## ✨ What is OpportunityX Resume?

OpportunityX Resume is more than a form-based resume generator. It combines a structured resume editor, professional templates, ATS-oriented tooling, AI assistance, import workflows, A4 multi-page previewing, and export capabilities into one focused workspace.

The project is built with a strong emphasis on:

- **Clean, professional resume output**
- **ATS-friendly structure**
- **Fast editing and live preview**
- **Responsive UX across desktop, tablet, and mobile**
- **Import → edit → refine → export workflows**
- **Privacy-conscious architecture**
- **A polished OpportunityX design system**

---

## 🚀 Core Features

### 📝 Resume Builder

- Structured resume editor
- Personal information
- Professional summary
- Work experience
- Technical projects
- Education
- Skills & competencies
- Languages
- Profiles & portfolio links
- Customizable resume sections
- Reordering and section management
- Live resume preview

### 🎨 Professional Templates

- Multiple resume templates
- Typography and visual customization
- Accent/color controls
- Resume preview before export
- A4-oriented layouts
- Multi-page resume support

### 🤖 AI Assistance

- AI-powered content improvement
- Resume writing assistance
- Section-level enhancement workflows
- AI credit system
- Upgrade/credit flows for AI features

### 📊 ATS & Resume Intelligence

- ATS-oriented resume analysis
- Resume strength indicators
- Keyword intelligence
- Job-description matching
- Industry-oriented resume evaluation
- Resume history and comparison workflows
- Company/job matching capabilities
- Exportable intelligence reports

### 📥 Import & Editing

Import existing resume data and continue editing it inside the builder.

Supported project workflows include:

- Resume import
- PDF-based resume workflows
- JSON import
- GitHub import
- OpportunityX ecosystem import

Imported content is treated as editable resume data — the goal is to **populate the builder, not lock the user out of editing**.

### 📄 PDF Export

- A4 resume generation
- Multi-page PDF support
- Live preview before download
- Page-break controls
- Page spacing controls
- Export Center workflow
- Resume output designed to preserve the visual structure of the editor

### 🔐 Authentication & Persistence

- Firebase authentication
- Guest-friendly resume workflow
- Local persistence for resume editing
- Cloud-oriented account workflows
- Saved resume state and recovery flows

### 📱 Responsive Experience

The interface is being purpose-built across three presentation layers:

| Viewport | UI Layer |
|---|---|
| `< 768px` | Mobile |
| `768px – 1023px` | Tablet |
| `>= 1024px` | Desktop |

Mobile and tablet experiences use dedicated layouts instead of simply shrinking the desktop interface.

---

## 🧠 Product Architecture

At a high level, the application is organized around shared business logic with responsive presentation layers.

```text
OpportunityX Resume
│
├── React Application
│   ├── Routing
│   ├── Authentication
│   ├── Resume State
│   ├── Theme System
│   └── Responsive UI Layers
│
├── Resume Workspace
│   ├── Editor
│   ├── Sections
│   ├── Templates
│   ├── Live Preview
│   └── Export
│
├── Intelligence Layer
│   ├── ATS Analysis
│   ├── Keyword Matching
│   ├── AI Assistance
│   ├── History
│   ├── Compare
│   └── Company Match
│
└── Data & Services
    ├── Firebase
    ├── Local Persistence
    ├── Import Services
    └── PDF Generation
```

The presentation layer may change by device size, but the core resume state and business logic are intended to remain shared.

---

## 🛠️ Tech Stack

### Frontend

- **React 19**
- **Vite**
- **React Router**
- **Tailwind CSS**
- **Framer Motion**
- **Lucide React**
- **React Hook Form**
- **TanStack React Query**

### Backend / Platform Services

- **Firebase**
- Local browser persistence where appropriate

### Resume / PDF Tooling

- **html2pdf.js**
- **PDF.js**
- A4-oriented rendering and export workflows

### Developer Tooling

- **Oxlint**
- PostCSS
- Autoprefixer

---

## 📂 Project Structure

```text
src/
├── assets/       # Application assets
├── components/   # Shared UI and feature components
├── context/      # Authentication, resume, theme and navigation state
├── data/         # Static/configuration data
├── hooks/        # Reusable React hooks
├── pages/        # Route-level application screens
├── services/     # Application/service integrations
├── templates/    # Resume template definitions
├── theme/        # Theme and design-system logic
├── App.jsx       # Application routing and providers
├── firebase.js   # Firebase configuration
└── index.css     # Global styles and design tokens
```

---

## 🎯 Product Philosophy

OpportunityX Resume follows a simple principle:

> **The tool should make building a good resume easier, not become another thing the user has to fight with.**

That means:

- Imported data should remain editable.
- Resume sections should remain under the user's control.
- Preview and exported PDF should stay visually consistent.
- Responsive layouts should be intentionally designed for their device class.
- UI polish should never come at the cost of core functionality.
- Free resume creation should remain genuinely useful.

---

## 🔄 Typical Workflow

```text
Create New Resume
       │
       ▼
Choose Template
       │
       ▼
Fill / Import Resume Data
       │
       ▼
Edit & Improve Content
       │
       ├── AI Assistance
       ├── ATS Analysis
       └── Job Matching
       │
       ▼
Review A4 Preview
       │
       ▼
Fix Sections / Page Layout
       │
       ▼
Export PDF
```

---

## 🧪 Development

### Requirements

- Node.js
- npm
- A Firebase project/configuration for features that require Firebase

### Install

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 🔒 Security & Privacy

OpportunityX Resume is designed with privacy and controlled data handling in mind.

When contributing or deploying your own instance:

- Never commit Firebase secrets or private credentials.
- Keep environment-specific configuration outside source control.
- Review authentication and database rules before production deployment.
- Treat imported resume data as sensitive personal information.
- Avoid logging resume content unnecessarily.

---

## 🌐 OpportunityX Ecosystem

OpportunityX Resume is part of the broader **OpportunityX ecosystem**, focused on helping students and early-career professionals discover opportunities and build stronger career profiles.

Explore the ecosystem:

**https://opportunityx.co.in**

---

## 🤝 Contributing

Contributions, bug reports, UI feedback, and feature ideas are welcome.

Before opening a pull request:

1. Keep changes focused.
2. Avoid breaking existing resume data flows.
3. Test responsive layouts when changing UI.
4. Verify PDF/export behavior when changing resume rendering.
5. Run the production build and lint checks.
6. Clearly describe the problem and the solution.

For larger changes, open an issue first so the implementation can be discussed before significant architectural work begins.

---

## 📌 Current Development Focus

The project is actively evolving toward a polished production experience, with particular attention to:

- Resume editor usability
- Accurate A4 pagination and PDF rendering
- Import/edit reliability
- Mobile UI polish
- Tablet UI redesign
- Desktop consistency
- ATS and resume intelligence
- Responsive navigation
- Theme consistency

---

## 📄 License

This repository does not currently declare an open-source license.

Unless a license is added to the repository, the source code should be treated as **all rights reserved** and should not be assumed to be freely reusable, redistributed, or commercially exploited.

---

## 👨‍💻 Built by OpportunityX

**OpportunityX Resume** is built as part of the OpportunityX ecosystem.

Built with React, curiosity, too many UI iterations, and the occasional battle with CSS. 😄

---

<p align="center">
  <strong>OpportunityX Resume</strong><br/>
  Build better resumes. Build better opportunities.
</p>
