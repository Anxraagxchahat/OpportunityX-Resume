import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  Palette,
  Type,
  Layout,
  Mail,
  Phone,
  MapPin,
  Globe,
  Download,
  Award,
  Sparkles,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Cpu,
  Trophy,
  Languages
} from 'lucide-react';
import { useResume } from '../context/ResumeContext';
import { trackEvent, AnalyticsEvents } from '../utils/analytics';

// Custom Brand Icons
const GithubIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
  </svg>
);

const LinkedinIcon = ({ className = "w-3 h-3" }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
  </svg>
);

export const templatesList = [
  { id: 'modern', name: 'Modern', tag: 'Popular' },
  { id: 'minimal', name: 'Minimalist', tag: 'ATS-Friendly' },
  { id: 'tech', name: 'Tech / Developer', tag: 'Developer' },
  { id: 'executive', name: 'Executive', tag: 'Corporate' },
  { id: 'creative', name: 'Creative (2-Column)', tag: 'New' },
  { id: 'student', name: 'Student / Academic', tag: 'Entry' }
];

export const fontOptions = [
  { id: 'Inter', name: 'Inter' },
  { id: 'Outfit', name: 'Outfit' },
  { id: 'Plus Jakarta Sans', name: 'Plus Jakarta' },
  { id: 'JetBrains Mono', name: 'Mono Code' }
];

export const colorOptions = [
  { id: '#F97316', name: 'OpportunityX Orange' },
  { id: '#2563EB', name: 'Royal Blue' },
  { id: '#059669', name: 'Emerald Green' },
  { id: '#7C3AED', name: 'Purple Accent' },
  { id: '#DC2626', name: 'Crimson Red' },
  { id: '#0D9488', name: 'Teal Accent' },
  { id: '#1E293B', name: 'Classic Slate' }
];

export const A4ResumePreview = () => {
  const { activeResume, setTemplate, setFontFamily, setAccentColor, activeResumeId } = useResume();
  const [zoomLevel, setZoomLevel] = useState(85);

  const { personal, experience, education, projects, skills, certificates, achievements, languages, customSections, metadata } = activeResume;
  const accentHex = metadata?.accentColor || '#F97316';
  const fontFamily = metadata?.fontFamily || 'Inter';
  const template = metadata?.template || 'modern';

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 10, 130));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 10, 50));

  const handleDownloadPDF = () => {
    trackEvent(AnalyticsEvents.PDF_DOWNLOAD, { resumeId: activeResumeId, template });
    window.print();
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#07090F] overflow-hidden relative">
      {/* Top Preview Controls Bar */}
      <div className="bg-[#0B0D14] border-b border-slate-800 px-4 py-2 flex items-center justify-between gap-3 text-xs z-10 flex-wrap">
        {/* Template Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Layout className="w-3.5 h-3.5 text-orange-400" /> Template:
          </span>
          <select
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-orange-500 font-semibold"
          >
            {templatesList.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.tag})
              </option>
            ))}
          </select>
        </div>

        {/* Font Selector */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Type className="w-3.5 h-3.5 text-amber-400" /> Font:
          </span>
          <select
            value={fontFamily}
            onChange={(e) => setFontFamily(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:border-orange-500 font-semibold"
          >
            {fontOptions.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>
        </div>

        {/* Accent Color Palette */}
        <div className="flex items-center gap-1.5">
          <Palette className="w-3.5 h-3.5 text-orange-400 mr-1" />
          {colorOptions.map((c) => (
            <button
              key={c.id}
              onClick={() => setAccentColor(c.id)}
              style={{ backgroundColor: c.id }}
              className={`w-4 h-4 rounded-full transition-transform ${
                accentHex === c.id ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-[#0B0D14]' : 'hover:scale-110'
              }`}
              title={c.name}
            />
          ))}
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg p-1">
          <button onClick={handleZoomOut} className="p-1 text-slate-400 hover:text-white" title="Zoom Out">
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-semibold text-slate-300 w-10 text-center">{zoomLevel}%</span>
          <button onClick={handleZoomIn} className="p-1 text-slate-400 hover:text-white" title="Zoom In">
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Download PDF Trigger Button */}
        <button
          onClick={handleDownloadPDF}
          className="px-3 py-1.5 rounded-lg bg-orange-500 hover:bg-orange-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-all"
        >
          <Download className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Download PDF</span>
        </button>
      </div>

      {/* A4 Paper Viewport Canvas */}
      <div className="flex-1 overflow-auto p-6 flex justify-center bg-[#07090F] custom-scrollbar">
        <div
          id="resume-a4-preview"
          className={`a4-paper-container transition-all duration-200 shadow-2xl rounded-sm ${
            template === 'creative' ? 'p-0 flex' : 'p-10'
          }`}
          style={{
            transform: `scale(${zoomLevel / 100})`,
            transformOrigin: 'top center',
            fontFamily: `'${fontFamily}', sans-serif`
          }}
        >
          {/* ==================== 1. CREATIVE 2-COLUMN TEMPLATE ==================== */}
          {template === 'creative' ? (
            <div className="w-full h-full flex min-h-[297mm]">
              {/* Left Column (30% Width) */}
              <div
                className="w-[34%] p-8 text-white space-y-6"
                style={{ backgroundColor: accentHex }}
              >
                <div>
                  <h1 className="text-2xl font-black tracking-tight mb-1 leading-tight text-white">
                    {personal?.fullName || "Your Full Name"}
                  </h1>
                  <p className="text-xs font-bold text-white/90 uppercase tracking-wider">
                    {personal?.jobTitle || "Professional Title"}
                  </p>
                </div>

                {/* Contact List */}
                <div className="space-y-2 text-[11px] text-white/90 pt-3 border-t border-white/20 font-medium">
                  {personal?.email && <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" /><span className="truncate">{personal.email}</span></div>}
                  {personal?.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /><span>{personal.phone}</span></div>}
                  {personal?.location && <div className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /><span>{personal.location}</span></div>}
                  {personal?.github && <div className="flex items-center gap-2"><GithubIcon className="w-3.5 h-3.5" /><span className="truncate">{personal.github}</span></div>}
                  {personal?.linkedin && <div className="flex items-center gap-2"><LinkedinIcon className="w-3.5 h-3.5" /><span className="truncate">{personal.linkedin}</span></div>}
                  {personal?.website && <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /><span className="truncate">{personal.website}</span></div>}
                </div>

                {/* Skills Column */}
                {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
                  <div className="space-y-2 pt-3 border-t border-white/20">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">Skills</h3>
                    <div className="flex flex-wrap gap-1">
                      {[...(skills.languages || []), ...(skills.frameworks || []), ...(skills.tools || [])].map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-semibold text-white">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Languages */}
                {languages && languages.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-white/20">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">Languages</h3>
                    <div className="space-y-1 text-[11px]">
                      {languages.map((l) => (
                        <div key={l.id} className="flex justify-between">
                          <span className="font-bold">{l.name}</span>
                          <span className="text-white/80">{l.proficiency}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {certificates && certificates.length > 0 && (
                  <div className="space-y-2 pt-3 border-t border-white/20">
                    <h3 className="text-xs font-black uppercase tracking-wider text-white">Certifications</h3>
                    <div className="space-y-1 text-[11px]">
                      {certificates.map((c) => (
                        <div key={c.id}>
                          <div className="font-bold">{c.name}</div>
                          <div className="text-white/80">{c.issuer} ({c.date})</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Main Column (66% Width) */}
              <div className="w-[66%] p-8 bg-white text-slate-800 space-y-6">
                {/* Summary */}
                {personal?.summary && (
                  <div>
                    <h2 className="text-xs uppercase font-black tracking-wider pb-1 border-b mb-2" style={{ color: accentHex, borderColor: accentHex }}>
                      Profile Summary
                    </h2>
                    <p className="text-xs leading-relaxed text-slate-700">{personal.summary}</p>
                  </div>
                )}

                {/* Experience */}
                {experience && experience.length > 0 && (
                  <div>
                    <h2 className="text-xs uppercase font-black tracking-wider pb-1 border-b mb-3" style={{ color: accentHex, borderColor: accentHex }}>
                      Work Experience
                    </h2>
                    <div className="space-y-3.5">
                      {experience.map((exp) => (
                        <div key={exp.id}>
                          <div className="flex justify-between text-xs">
                            <span className="font-bold text-slate-900">{exp.role} — <span className="font-normal text-slate-600">{exp.company}</span></span>
                            <span className="text-[11px] font-semibold text-slate-500">{exp.startDate} – {exp.endDate}</span>
                          </div>
                          {exp.bullets && (
                            <ul className="list-disc list-outside pl-4 text-xs text-slate-700 space-y-0.5 mt-1">
                              {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects */}
                {projects && projects.length > 0 && (
                  <div>
                    <h2 className="text-xs uppercase font-black tracking-wider pb-1 border-b mb-3" style={{ color: accentHex, borderColor: accentHex }}>
                      Key Projects
                    </h2>
                    <div className="space-y-3">
                      {projects.map((p) => (
                        <div key={p.id} className="text-xs space-y-0.5">
                          <div className="font-bold text-slate-900">{p.name} {p.techStack && <span className="font-normal text-slate-500">({p.techStack})</span>}</div>
                          {p.description && <p className="text-slate-700">{p.description}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Education */}
                {education && education.length > 0 && (
                  <div>
                    <h2 className="text-xs uppercase font-black tracking-wider pb-1 border-b mb-2" style={{ color: accentHex, borderColor: accentHex }}>
                      Education
                    </h2>
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900">{edu.degree}</div>
                          <div className="text-slate-600">{edu.institution}</div>
                        </div>
                        <span className="text-[11px] text-slate-500 font-semibold">{edu.startDate} – {edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ==================== 2-6. STANDARD SINGLE COLUMN TEMPLATES ==================== */
            <div className="space-y-5 text-slate-800">
              {/* Header Section */}
              <div
                className={`pb-5 border-b ${
                  template === 'executive'
                    ? 'text-center border-b-2 border-double'
                    : template === 'minimal'
                    ? 'border-b-0 pb-2'
                    : template === 'tech'
                    ? 'font-mono'
                    : ''
                }`}
                style={{ borderColor: accentHex }}
              >
                <h1
                  className={`font-black tracking-tight text-slate-900 mb-1 ${
                    template === 'executive' ? 'text-4xl' : template === 'minimal' ? 'text-2xl font-bold' : 'text-3xl'
                  }`}
                >
                  {personal?.fullName || "Your Full Name"}
                </h1>
                <p
                  className={`font-bold mb-2.5 ${template === 'executive' ? 'text-base uppercase tracking-widest' : 'text-lg'}`}
                  style={{ color: accentHex }}
                >
                  {personal?.jobTitle || "Professional Role"}
                </p>

                {/* Contact Links */}
                <div
                  className={`flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 font-medium ${
                    template === 'executive' ? 'justify-center' : ''
                  }`}
                >
                  {personal?.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{personal.email}</span>}
                  {personal?.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{personal.phone}</span>}
                  {personal?.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{personal.location}</span>}
                  {personal?.github && <span className="flex items-center gap-1"><GithubIcon className="w-3 h-3 text-slate-400" />{personal.github}</span>}
                  {personal?.linkedin && <span className="flex items-center gap-1"><LinkedinIcon className="w-3 h-3 text-slate-400" />{personal.linkedin}</span>}
                  {personal?.website && <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-400" />{personal.website}</span>}
                </div>
              </div>

              {/* Summary */}
              {personal?.summary && (
                <div>
                  <h2
                    className="text-xs uppercase font-extrabold tracking-wider pb-1 border-b mb-2"
                    style={{ color: accentHex, borderColor: accentHex }}
                  >
                    Professional Summary
                  </h2>
                  <p className="text-xs leading-relaxed text-slate-700">{personal.summary}</p>
                </div>
              )}

              {/* Student Template: Put Education First */}
              {template === 'student' && education && education.length > 0 && (
                <div>
                  <h2 className="text-xs uppercase font-extrabold tracking-wider pb-1 border-b mb-3" style={{ color: accentHex, borderColor: accentHex }}>
                    Education & Academic Honors
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{edu.degree}</div>
                          <div className="text-slate-600 font-medium">{edu.institution}</div>
                          {edu.gpa && <div className="text-[11px] font-bold text-slate-700 mt-0.5">GPA: {edu.gpa}</div>}
                          {edu.description && <div className="text-[11px] text-slate-500">{edu.description}</div>}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">{edu.startDate} – {edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {experience && experience.length > 0 && (
                <div>
                  <h2
                    className="text-xs uppercase font-extrabold tracking-wider pb-1 border-b mb-3"
                    style={{ color: accentHex, borderColor: accentHex }}
                  >
                    Work Experience
                  </h2>
                  <div className="space-y-4">
                    {experience.map((exp) => (
                      <div key={exp.id} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 text-sm">{exp.role}</span>
                            <span className="text-slate-500 font-medium"> — {exp.company}</span>
                          </div>
                          <span className="text-[11px] font-semibold text-slate-500">
                            {exp.startDate} – {exp.endDate}
                          </span>
                        </div>
                        {exp.bullets && (
                          <ul className="list-disc list-outside pl-4 text-xs text-slate-700 space-y-1 mt-1">
                            {exp.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {projects && projects.length > 0 && (
                <div>
                  <h2
                    className="text-xs uppercase font-extrabold tracking-wider pb-1 border-b mb-3"
                    style={{ color: accentHex, borderColor: accentHex }}
                  >
                    Technical Projects
                  </h2>
                  <div className="space-y-3">
                    {projects.map((proj) => (
                      <div key={proj.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-900 text-sm">{proj.name}</span>
                          {proj.link && <span className="text-[11px] text-slate-500">{proj.link}</span>}
                        </div>
                        {proj.description && <p className="text-xs text-slate-700">{proj.description}</p>}
                        {proj.techStack && (
                          <div className="text-[11px] font-semibold text-slate-600">
                            Technologies: <span className="text-slate-800">{proj.techStack}</span>
                          </div>
                        )}
                        {proj.bullets && (
                          <ul className="list-disc list-outside pl-4 text-xs text-slate-700 space-y-0.5 mt-1">
                            {proj.bullets.map((b, i) => (
                              <li key={i}>{b}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Non-Student Education */}
              {template !== 'student' && education && education.length > 0 && (
                <div>
                  <h2
                    className="text-xs uppercase font-extrabold tracking-wider pb-1 border-b mb-3"
                    style={{ color: accentHex, borderColor: accentHex }}
                  >
                    Education
                  </h2>
                  <div className="space-y-3">
                    {education.map((edu) => (
                      <div key={edu.id} className="flex items-start justify-between text-xs">
                        <div>
                          <div className="font-bold text-slate-900 text-sm">{edu.degree}</div>
                          <div className="text-slate-600 font-medium">{edu.institution}</div>
                          {edu.gpa && <div className="text-[11px] font-bold text-slate-700 mt-0.5">GPA: {edu.gpa}</div>}
                          {edu.description && <div className="text-[11px] text-slate-500 mt-0.5">{edu.description}</div>}
                        </div>
                        <span className="text-[11px] font-semibold text-slate-500">{edu.startDate} – {edu.endDate}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
                <div>
                  <h2
                    className="text-xs uppercase font-extrabold tracking-wider pb-1 border-b mb-2"
                    style={{ color: accentHex, borderColor: accentHex }}
                  >
                    Technical Skills
                  </h2>
                  {template === 'tech' ? (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {[...(skills.languages || []), ...(skills.frameworks || []), ...(skills.tools || [])].map((sk, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono text-[11px] font-semibold text-slate-800">
                          {sk}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-1.5 text-xs">
                      {skills.languages?.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-900">Languages: </span>
                          <span className="text-slate-700">{skills.languages.join(', ')}</span>
                        </div>
                      )}
                      {skills.frameworks?.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-900">Frameworks & Libraries: </span>
                          <span className="text-slate-700">{skills.frameworks.join(', ')}</span>
                        </div>
                      )}
                      {skills.tools?.length > 0 && (
                        <div>
                          <span className="font-bold text-slate-900">Tools & Technologies: </span>
                          <span className="text-slate-700">{skills.tools.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Custom Sections */}
              {customSections && customSections.length > 0 && (
                <div className="space-y-4">
                  {customSections.map((cs) => (
                    <div key={cs.id}>
                      <h2
                        className="text-xs uppercase font-extrabold tracking-wider pb-1 border-b mb-2"
                        style={{ color: accentHex, borderColor: accentHex }}
                      >
                        {cs.title}
                      </h2>
                      <div className="space-y-2">
                        {(cs.items || []).map((ci) => (
                          <div key={ci.id} className="text-xs">
                            <div className="font-bold text-slate-900">{ci.name}</div>
                            {ci.description && <div className="text-slate-700">{ci.description}</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Clean Footer watermark */}
          <div className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-400">
            <span>OpportunityX Resume Engine</span>
            <span>resume.opportunityx.co.in</span>
          </div>
        </div>
      </div>
    </div>
  );
};
