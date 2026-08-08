import React, { useState } from 'react';
import { Check, X, ShieldAlert, Sparkles, User, Mail, Phone, Briefcase, GraduationCap, Wrench, ArrowRight, Edit2, FolderGit2, Award, Globe, Bug } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useResume } from '../context/ResumeContext';

const IS_DEV = import.meta.env.DEV;

export const ResumeImportReviewModal = ({ parsedData, onClose }) => {
  const navigate = useNavigate();
  const { importResumeData } = useResume();

  const [formData, setFormData] = useState(parsedData?.schema || {});
  const confidence = parsedData?.confidence || {};
  const debugData = parsedData?._debug || null;
  const [showDebug, setShowDebug] = useState(false);

  const handlePersonalChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      personal: { ...(prev.personal || {}), [field]: value }
    }));
  };

  const handleConfirmImport = () => {
    importResumeData(formData);
    sessionStorage.setItem('ox_import_success_toast', 'Resume imported successfully.');
    onClose();
    navigate('/builder');
  };

  const getConfidenceBadge = (level = 'LOW') => {
    if (level === 'HIGH') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">HIGH CONFIDENCE</span>;
    }
    if (level === 'MEDIUM') {
      return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/15 text-amber-400 border border-amber-500/30">MEDIUM CONFIDENCE</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/30">LOW — PLEASE VERIFY</span>;
  };

  // Flatten all skills from multiple categories into a single array for display
  const allSkillItems = (() => {
    const skills = formData.skills;
    if (!skills) return [];
    // Handle array of category objects: [{ category: '...', items: [...] }]
    if (Array.isArray(skills)) {
      return skills.flatMap((s) => (Array.isArray(s?.items) ? s.items : []));
    }
    // Handle object with arrays: { languages: [...], frameworks: [...], tools: [...] }
    if (typeof skills === 'object') {
      return Object.values(skills).flat().filter((s) => typeof s === 'string');
    }
    return [];
  })();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn text-white no-print">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-3xl w-full max-w-3xl shadow-2xl p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="p-3 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-400 shrink-0">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-black text-white">Review & Confirm Extracted Data</h2>
              {getConfidenceBadge(confidence.overall)}
            </div>
            <p className="text-xs text-slate-400 pt-0.5">
              Verify and edit your parsed resume details before loading into OpportunityX Resume Builder.
            </p>
          </div>
          {/* Dev Debug Toggle — only in development */}
          {IS_DEV && debugData && (
            <button
              onClick={() => setShowDebug(!showDebug)}
              className={`p-2 rounded-xl border transition-colors shrink-0 ${showDebug ? 'bg-amber-500/20 border-amber-500/40 text-amber-400' : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-amber-400'}`}
              title="Toggle Developer Debug Panel"
            >
              <Bug className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Developer Debug Panel — DEV ONLY */}
        {IS_DEV && showDebug && debugData && (
          <div className="space-y-3 p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20">
            <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bug className="w-4 h-4" /> Developer Debug Panel (DEV ONLY)
            </h3>

            {/* Failed Step Alert */}
            {debugData.failedStep && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs">
                <div className="font-bold text-red-400 flex items-center gap-1.5">❌ Pipeline Failed at: {debugData.failedStep.name}</div>
                <div className="text-red-300/80 mt-1">{debugData.failedStep.reason || 'Unknown error'}</div>
              </div>
            )}

            {/* Pipeline Step Log */}
            {debugData.pipelineSteps && debugData.pipelineSteps.length > 0 && (
              <details className="group" open>
                <summary className="text-[11px] font-bold text-slate-300 cursor-pointer hover:text-white">🔗 Pipeline Step Log ({debugData.pipelineSteps.length} steps)</summary>
                <div className="mt-1 space-y-1">
                  {debugData.pipelineSteps.map((step, idx) => (
                    <div key={idx} className={`p-2 rounded-lg border text-[10px] ${step.status === 'error' ? 'bg-red-500/5 border-red-500/20' : step.status === 'warn' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-emerald-500/5 border-emerald-500/20'}`}>
                      <div className="flex items-center gap-2">
                        <span>{step.status === 'error' ? '❌' : step.status === 'warn' ? '⚠️' : '✅'}</span>
                        <span className="font-bold text-white">{step.name}</span>
                        <span className="text-slate-500 ml-auto">{step.timestamp}ms</span>
                      </div>
                      <pre className="mt-1 text-slate-400 whitespace-pre-wrap overflow-x-auto">{JSON.stringify(Object.fromEntries(Object.entries(step).filter(([k]) => !['name','timestamp','status'].includes(k))), null, 2)}</pre>
                    </div>
                  ))}
                </div>
              </details>
            )}

            <div className="space-y-2">
              <details className="group">
                <summary className="text-[11px] font-bold text-slate-300 cursor-pointer hover:text-white">📄 Raw Extracted Text ({debugData.rawText?.length || 0} chars)</summary>
                <pre className="mt-1 p-2 rounded-lg bg-[#10131D] border border-slate-800 text-[10px] text-slate-400 overflow-x-auto max-h-40 whitespace-pre-wrap">{debugData.rawText || '(empty)'}</pre>
              </details>

              <details className="group">
                <summary className="text-[11px] font-bold text-slate-300 cursor-pointer hover:text-white">🧹 Cleaned Text ({debugData.cleanedText?.length || 0} chars)</summary>
                <pre className="mt-1 p-2 rounded-lg bg-[#10131D] border border-slate-800 text-[10px] text-slate-400 overflow-x-auto max-h-40 whitespace-pre-wrap">{debugData.cleanedText || '(empty)'}</pre>
              </details>

              <details className="group">
                <summary className="text-[11px] font-bold text-slate-300 cursor-pointer hover:text-white">🤖 AI JSON Response</summary>
                <pre className="mt-1 p-2 rounded-lg bg-[#10131D] border border-slate-800 text-[10px] text-emerald-400 overflow-x-auto max-h-60 whitespace-pre-wrap">{typeof debugData.aiRawResponse === 'string' ? debugData.aiRawResponse : JSON.stringify(debugData.aiRawResponse, null, 2)}</pre>
              </details>

              {debugData.aiParsedJson && (
                <details className="group">
                  <summary className="text-[11px] font-bold text-slate-300 cursor-pointer hover:text-white">🧩 AI Parsed JSON (before validation)</summary>
                  <pre className="mt-1 p-2 rounded-lg bg-[#10131D] border border-slate-800 text-[10px] text-cyan-400 overflow-x-auto max-h-60 whitespace-pre-wrap">{JSON.stringify(debugData.aiParsedJson, null, 2)}</pre>
                </details>
              )}

              <details className="group">
                <summary className="text-[11px] font-bold text-slate-300 cursor-pointer hover:text-white">✅ Validation Confidence Scores</summary>
                <pre className="mt-1 p-2 rounded-lg bg-[#10131D] border border-slate-800 text-[10px] text-sky-400 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(debugData.validationResult, null, 2)}</pre>
              </details>

              <details className="group">
                <summary className="text-[11px] font-bold text-slate-300 cursor-pointer hover:text-white">📋 Final Resume Schema (after mapping)</summary>
                <pre className="mt-1 p-2 rounded-lg bg-[#10131D] border border-slate-800 text-[10px] text-purple-400 overflow-x-auto max-h-60 whitespace-pre-wrap">{JSON.stringify(formData, null, 2)}</pre>
              </details>
            </div>
          </div>
        )}

        {/* Review Form Body */}
        <div className="space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-3">
            <h3 className="text-xs font-extrabold text-orange-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-4 h-4" /> Personal Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Full Name</span>
                  {getConfidenceBadge(confidence.fullName)}
                </div>
                <input
                  type="text"
                  value={formData.personal?.fullName || ''}
                  onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                  placeholder="e.g. Anurag Verma"
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Job Title</span>
                </div>
                <input
                  type="text"
                  value={formData.personal?.jobTitle || ''}
                  onChange={(e) => handlePersonalChange('jobTitle', e.target.value)}
                  placeholder="e.g. Senior Software Engineer"
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Email Address</span>
                  {getConfidenceBadge(confidence.email)}
                </div>
                <input
                  type="email"
                  value={formData.personal?.email || ''}
                  onChange={(e) => handlePersonalChange('email', e.target.value)}
                  placeholder="e.g. candidate@example.com"
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Phone Number</span>
                  {getConfidenceBadge(confidence.phone)}
                </div>
                <input
                  type="text"
                  value={formData.personal?.phone || ''}
                  onChange={(e) => handlePersonalChange('phone', e.target.value)}
                  placeholder="e.g. +1 (555) 019-2834"
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>Location</span>
                </div>
                <input
                  type="text"
                  value={formData.personal?.location || ''}
                  onChange={(e) => handlePersonalChange('location', e.target.value)}
                  placeholder="e.g. San Francisco, CA"
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-slate-300">
                  <span>LinkedIn</span>
                </div>
                <input
                  type="text"
                  value={formData.personal?.linkedin || ''}
                  onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                  placeholder="e.g. linkedin.com/in/username"
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Professional Summary</label>
                <textarea
                  rows="3"
                  value={formData.personal?.summary || ''}
                  onChange={(e) => handlePersonalChange('summary', e.target.value)}
                  placeholder="Brief professional intro..."
                  className="w-full bg-[#10131D] border border-slate-800 rounded-xl p-3 text-xs text-white focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Experience Extracted Summary */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> Extracted Work Experience ({formData.experience?.length || 0})
              </h3>
            </div>
            {(formData.experience?.length || 0) === 0 ? (
              <p className="text-xs text-slate-500 italic px-3 py-2">No work experience extracted. You can add entries in the Resume Builder.</p>
            ) : (
              <div className="space-y-2">
                {(formData.experience || []).map((exp, idx) => (
                  <div key={exp.id || idx} className="p-3 rounded-xl bg-[#10131D] border border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-white flex justify-between">
                      <span>{exp.role || <span className="text-slate-500 italic">Untitled Role</span>}</span>
                      {exp.period && <span className="text-slate-400 text-[11px]">{exp.period}</span>}
                    </div>
                    {exp.company && <div className="text-slate-400">{exp.company}</div>}
                    {exp.location && <div className="text-slate-500 text-[11px]">{exp.location}</div>}
                    {exp.bullets?.length > 0 && (
                      <ul className="list-disc list-inside text-slate-400 text-[11px] pt-1 space-y-0.5">
                        {exp.bullets.slice(0, 3).map((b, bi) => <li key={bi}>{b}</li>)}
                        {exp.bullets.length > 3 && <li className="text-slate-500">+{exp.bullets.length - 3} more...</li>}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Education Extracted Summary */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <h3 className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Extracted Education ({formData.education?.length || 0})
            </h3>
            {(formData.education?.length || 0) === 0 ? (
              <p className="text-xs text-slate-500 italic px-3 py-2">No education entries extracted. You can add entries in the Resume Builder.</p>
            ) : (
              <div className="space-y-2">
                {(formData.education || []).map((edu, idx) => (
                  <div key={edu.id || idx} className="p-3 rounded-xl bg-[#10131D] border border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-white">{edu.degree || <span className="text-slate-500 italic">Untitled Degree</span>}</div>
                    {edu.institution && <div className="text-slate-400">{edu.institution}</div>}
                    <div className="flex gap-3 text-slate-500 text-[11px]">
                      {edu.period && <span>{edu.period}</span>}
                      {edu.gpa && <span>GPA: {edu.gpa}</span>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Projects Extracted Summary */}
          {(formData.projects?.length || 0) > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-extrabold text-sky-400 uppercase tracking-wider flex items-center gap-1.5">
                <FolderGit2 className="w-4 h-4" /> Extracted Projects ({formData.projects.length})
              </h3>
              <div className="space-y-2">
                {formData.projects.map((proj, idx) => (
                  <div key={proj.id || idx} className="p-3 rounded-xl bg-[#10131D] border border-slate-800 text-xs space-y-1">
                    <div className="font-bold text-white">{proj.title || proj.name || <span className="text-slate-500 italic">Untitled Project</span>}</div>
                    {proj.description && <div className="text-slate-400 text-[11px]">{proj.description}</div>}
                    {proj.technologies?.length > 0 && (
                      <div className="flex flex-wrap gap-1 pt-1">
                        {proj.technologies.map((t, ti) => (
                          <span key={ti} className="px-1.5 py-0.5 rounded bg-sky-500/10 border border-sky-500/20 text-sky-300 text-[10px]">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills Extracted Summary */}
          {allSkillItems.length > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-extrabold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                <Wrench className="w-4 h-4" /> Extracted Skills ({allSkillItems.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {allSkillItems.map((skill, sIdx) => (
                  <span key={sIdx} className="px-2.5 py-1 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-bold">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications Extracted Summary */}
          {(formData.certifications?.length || 0) > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-extrabold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4" /> Extracted Certifications ({formData.certifications.length})
              </h3>
              <div className="space-y-2">
                {formData.certifications.map((cert, idx) => (
                  <div key={cert.id || idx} className="p-3 rounded-xl bg-[#10131D] border border-slate-800 text-xs space-y-0.5">
                    <div className="font-bold text-white">{cert.name}</div>
                    <div className="text-slate-400 flex gap-2">
                      {cert.issuer && <span>{cert.issuer}</span>}
                      {cert.date && <span>• {cert.date}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages Extracted Summary */}
          {(formData.languages?.length || 0) > 0 && (
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <h3 className="text-xs font-extrabold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-4 h-4" /> Extracted Languages ({formData.languages.length})
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {formData.languages.map((lang, lIdx) => (
                  <span key={lIdx} className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] font-bold">
                    {typeof lang === 'string' ? lang : `${lang.name}${lang.proficiency ? ` (${lang.proficiency})` : ''}`}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Action Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 rounded-xl"
          >
            Cancel & Upload Different File
          </button>

          <button
            type="button"
            onClick={handleConfirmImport}
            className="px-6 py-2.5 text-xs font-bold text-black bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 rounded-xl shadow-lg flex items-center gap-2 transition-all"
          >
            <Check className="w-4 h-4" /> Confirm & Open in Resume Builder <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
