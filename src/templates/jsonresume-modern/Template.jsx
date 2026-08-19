import React from 'react';
import './styles.css';
import { DEFAULT_PROFILE_PHOTO } from '../../utils/photoDefaults';
import { SocialLinksBlock } from '../reactive/shared/SocialLinksBlock';

export const JSONResumeModernTemplate = ({ resumeData, accentHex, fontFamily }) => {
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, assets = {} } = resumeData || {};

  const accentColor = accentHex || '#2563eb';
  const photoSrc = assets?.profilePhoto || DEFAULT_PROFILE_PHOTO;

  return (
    <div className="jsonresume-modern-container" style={{ fontFamily: `'${fontFamily || 'Inter'}', sans-serif` }}>
      {/* Top Header */}
      <div className="jsonresume-modern-header" style={{ borderColor: accentColor }}>
        <div>
          <div className="jsonresume-modern-name">{personal.fullName || 'Your Name'}</div>
          <div className="jsonresume-modern-location">{personal.location || personal.jobTitle || personal.targetRole}</div>
        </div>
        <img src={photoSrc} alt="Profile" className="w-16 h-16 rounded-full object-cover border-2" style={{ borderColor: accentColor }} />
      </div>

      {/* About Section */}
      {personal.summary && (
        <div className="jsonresume-modern-section">
          <div className="jsonresume-modern-section-label" style={{ color: accentColor }}>About</div>
          <div className="jsonresume-modern-section-content">
            <p className="text-[11px] leading-relaxed text-slate-700 mb-2">{personal.summary}</p>
            <div className="text-[11px] text-slate-600 space-y-0.5">
              {personal.phone && <div><strong>Phone:</strong> {personal.phone}</div>}
              {personal.email && <div><strong>Email:</strong> {personal.email}</div>}
              {personal.linkedin && <div><strong>LinkedIn:</strong> {personal.linkedin}</div>}
            </div>
          </div>
        </div>
      )}

      {/* Work Experience */}
      {experience.length > 0 && (
        <div className="jsonresume-modern-section">
          <div className="jsonresume-modern-section-label" style={{ color: accentColor }}>Work Experience</div>
          <div className="jsonresume-modern-section-content space-y-3">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="font-bold text-xs text-slate-900">{exp.company}</div>
                <div className="text-xs font-semibold text-slate-700">{exp.role}</div>
                <div className="text-[10px] text-slate-500">{exp.startDate} – {exp.endDate || 'Present'}</div>
                {exp.bullets && (
                  <ul className="list-disc pl-4 text-[11px] text-slate-700 mt-1 space-y-0.5">
                    {exp.bullets.map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
                <hr className="my-2 border-slate-200" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education.length > 0 && (
        <div className="jsonresume-modern-section">
          <div className="jsonresume-modern-section-label" style={{ color: accentColor }}>Education</div>
          <div className="jsonresume-modern-section-content space-y-2">
            {education.map((edu) => (
              <div key={edu.id}>
                <div className="font-bold text-xs text-slate-900">{edu.institution}</div>
                <div className="text-xs text-slate-700">{edu.degree}</div>
                <div className="text-[10px] text-slate-500">{edu.startDate} – {edu.endDate || 'Present'}</div>
                {edu.gpa && <div className="text-[10px] text-slate-600 font-semibold">GPA: {edu.gpa}</div>}
                {edu.relevantCoursework && (
                  <div className="text-[10px] text-slate-700 font-medium mt-0.5">
                    <strong>Relevant Coursework: </strong>{edu.relevantCoursework}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && (skills.languages?.length > 0 || skills.frameworks?.length > 0 || skills.tools?.length > 0) && (
        <div className="jsonresume-modern-section">
          <div className="jsonresume-modern-section-label" style={{ color: accentColor }}>Skills</div>
          <div className="jsonresume-modern-section-content text-xs space-y-0.5 text-slate-700">
            {skills.languages?.length > 0 && <div><strong>Languages:</strong> {skills.languages.join(', ')}</div>}
            {skills.frameworks?.length > 0 && <div><strong>Frameworks:</strong> {skills.frameworks.join(', ')}</div>}
            {skills.tools?.length > 0 && <div><strong>Tools:</strong> {skills.tools.join(', ')}</div>}
          </div>
        </div>
      )}

      {/* Social & Portfolio Links */}
      <SocialLinksBlock personal={personal} accentHex={accentColor} />
    </div>
  );
};
