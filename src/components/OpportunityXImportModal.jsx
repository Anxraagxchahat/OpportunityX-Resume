import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles, Check, AlertCircle, RefreshCw, X, ArrowRight, ArrowLeft,
  User, MapPin, Globe, Building, Code, CheckCircle2, ShieldCheck,
  Edit3, Sliders, GraduationCap, Briefcase, Award, Trophy, Terminal,
  ExternalLink, Layers, CheckSquare, Square
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import {
  fetchOpportunityXProfile,
  detectEcosystemDuplicates
} from '../services/opportunityxEcosystemService';

export const OpportunityXImportModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    activeResume,
    importOpportunityXData,
    isOpportunityXImportModalOpen,
    setIsOpportunityXImportModalOpen,
    setIsUnlockAIModalOpen
  } = useResume();

  const active = isOpen !== undefined ? isOpen : isOpportunityXImportModalOpen;
  const handleClose = onClose || (() => setIsOpportunityXImportModalOpen(false));

  // Wizard Step: 1: Auth/Fetch, 2: Sections Overview, 3: Customization, 4: Review & Duplicates, 5: Complete
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Profile Data
  const [profileData, setProfileData] = useState(null);

  // Section Toggles (Step 2)
  const [sectionsToImport, setSectionsToImport] = useState({
    personal: true,
    education: true,
    experience: true,
    skills: true,
    projects: true,
    certificates: true,
    achievements: true,
    openSource: true
  });

  // Selected item IDs (Step 3)
  const [selectedProjectIds, setSelectedProjectIds] = useState([]);
  const [selectedSkillNames, setSelectedSkillNames] = useState([]);
  const [selectedCertIds, setSelectedCertIds] = useState([]);
  const [selectedAchIds, setSelectedAchIds] = useState([]);

  // Duplicate Resolutions (Step 4): { [itemId]: 'skip' | 'replace' | 'merge' }
  const [duplicateResolutions, setDuplicateResolutions] = useState({});

  if (!active) return null;

  // ── Step 1: Fetch Profile ──────────────────────────────────────────────────
  const handleFetchProfile = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const data = await fetchOpportunityXProfile(user);
      setProfileData(data);

      // Pre-select all project, skill, certificate IDs
      if (Array.isArray(data.projects)) {
        setSelectedProjectIds(data.projects.map(p => p.id));
      }
      if (Array.isArray(data.skills)) {
        setSelectedSkillNames(data.skills.map(s => s.name));
      }
      if (Array.isArray(data.certificates)) {
        setSelectedCertIds(data.certificates.map(c => c.id));
      }
      if (Array.isArray(data.achievements)) {
        setSelectedAchIds(data.achievements.map(a => a.id));
      }

      setIsLoading(false);
      setStep(2);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to fetch OpportunityX profile.');
    }
  };

  // ── Duplicate Check (Step 4) ───────────────────────────────────────────────
  const duplicates = profileData ? detectEcosystemDuplicates(profileData, activeResume) : { projects: [], certificates: [] };

  // ── Final Import Action (Step 5) ───────────────────────────────────────────
  const handleFinalImport = () => {
    if (!profileData) return;

    const finalProjects = (profileData.projects || [])
      .filter(p => selectedProjectIds.includes(p.id))
      .map(p => ({
        ...p,
        action: duplicateResolutions[p.id] || (duplicates.projects.find(dup => dup.id === p.id)?.isDuplicate ? 'replace' : 'add')
      }));

    const finalSkills = (profileData.skills || [])
      .filter(s => selectedSkillNames.includes(s.name));

    const finalCerts = (profileData.certificates || [])
      .filter(c => selectedCertIds.includes(c.id))
      .map(c => ({
        ...c,
        action: duplicateResolutions[c.id] || 'add'
      }));

    const finalAch = (profileData.achievements || [])
      .filter(a => selectedAchIds.includes(a.id));

    const payload = {
      personal: sectionsToImport.personal ? profileData.personal : null,
      education: sectionsToImport.education ? profileData.education : [],
      experience: sectionsToImport.experience ? profileData.experience : [],
      projects: sectionsToImport.projects ? finalProjects : [],
      skills: sectionsToImport.skills ? finalSkills : [],
      certificates: sectionsToImport.certificates ? finalCerts : [],
      achievements: sectionsToImport.achievements ? finalAch : [],
      openSource: sectionsToImport.openSource ? profileData.openSource : []
    };

    importOpportunityXData(payload);
    sessionStorage.setItem('ox_import_success_toast', 'OpportunityX profile synced successfully.');
    handleClose();
    navigate('/builder');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[var(--ox-card-bg)] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--ox-border)] rounded-3xl shadow-2xl relative text-[var(--ox-text-primary)] transition-colors duration-300">

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--ox-border)] bg-[var(--ox-surface-primary)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-orange-500/10 text-orange-500 border border-orange-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--ox-text-primary)]">OpportunityX Ecosystem Profile Import</h2>
              <p className="text-[11px] text-[var(--ox-text-muted)]">Step {step} of 5 — Central OpportunityX Auth Sync</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[var(--ox-surface-secondary)] h-1">
          <div
            className="bg-gradient-to-r from-orange-500 via-amber-500 to-purple-500 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[var(--ox-card-bg)]">

          {/* ════ STEP 1: AUTHENTICATION & CONNECT ════ */}
          {step === 1 && (
            <div className="space-y-6 py-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/30 text-orange-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                <Sparkles className="w-8 h-8" />
              </div>

              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-[var(--ox-text-primary)]">OpportunityX Profile Sync</h3>
                <p className="text-xs text-[var(--ox-text-secondary)] leading-relaxed">
                  Import your verified profile, hackathon awards, projects, certificates, and skills directly from your OpportunityX account.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 max-w-md mx-auto">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Logged in User Card */}
              {user ? (
                <div className="max-w-md mx-auto bg-[var(--ox-surface-primary)] p-4 rounded-2xl border border-[var(--ox-border)] space-y-4 text-left">
                  <div className="flex items-center gap-3">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-12 h-12 rounded-xl object-cover border border-[var(--ox-border)]" />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 text-orange-500 flex items-center justify-center font-bold text-lg border border-orange-500/20">
                        {(user.displayName || user.email || 'O')[0].toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-[var(--ox-text-primary)] truncate">{user.displayName || 'OpportunityX Developer'}</span>
                        <ShieldCheck className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                      </div>
                      <div className="text-[11px] text-[var(--ox-text-muted)] truncate">{user.email}</div>
                    </div>
                  </div>

                  <button
                    onClick={handleFetchProfile}
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    <span>Sync & Fetch Profile</span>
                  </button>
                </div>
              ) : (
                <div className="max-w-md mx-auto space-y-3">
                  <p className="text-xs text-[var(--ox-text-muted)]">You are currently in guest mode. Log in with OpportunityX to sync your profile.</p>
                  <button
                    onClick={() => setIsUnlockAIModalOpen(true)}
                    className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    <span>Continue with OpportunityX</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ════ STEP 2: SECTION SELECTION ════ */}
          {step === 2 && profileData && (
            <div className="space-y-5">
              <div className="pb-2 border-b border-[var(--ox-border)]">
                <h3 className="text-sm font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-500" /> Select Sections to Import
                </h3>
                <p className="text-[11px] text-[var(--ox-text-muted)]">Choose which verified OpportunityX data sections to bring into your resume.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'personal', label: 'Personal & Contact Info', count: '1 Profile', icon: User },
                  { key: 'education', label: 'Education Records', count: `${profileData.education?.length || 0} Degree`, icon: GraduationCap },
                  { key: 'experience', label: 'Verified Experience', count: `${profileData.experience?.length || 0} Experience`, icon: Briefcase },
                  { key: 'skills', label: 'Skills & Tools', count: `${profileData.skills?.length || 0} Technologies`, icon: Terminal },
                  { key: 'projects', label: 'OpportunityX Projects', count: `${profileData.projects?.length || 0} Projects`, icon: Code },
                  { key: 'certificates', label: 'Verified Certificates', count: `${profileData.certificates?.length || 0} Certificates`, icon: Award },
                  { key: 'achievements', label: 'Hackathon Achievements', count: `${profileData.achievements?.length || 0} Awards`, icon: Trophy }
                ].map(sec => {
                  const Icon = sec.icon;
                  const isChecked = sectionsToImport[sec.key];

                  return (
                    <div
                      key={sec.key}
                      onClick={() => setSectionsToImport({ ...sectionsToImport, [sec.key]: !isChecked })}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-orange-500/10 border-orange-500/40 text-[var(--ox-text-primary)] shadow-sm'
                          : 'bg-[var(--ox-surface-primary)] border-[var(--ox-border)] opacity-60 hover:opacity-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isChecked ? 'text-orange-500' : 'text-[var(--ox-text-muted)]'}`} />
                        <div>
                          <div className="text-xs font-bold text-[var(--ox-text-primary)]">{sec.label}</div>
                          <div className="text-[10px] text-[var(--ox-text-muted)]">{sec.count}</div>
                        </div>
                      </div>
                      {isChecked ? <CheckSquare className="w-4 h-4 text-orange-500" /> : <Square className="w-4 h-4 text-[var(--ox-text-muted)]" />}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ STEP 3: ITEM CUSTOMIZATION ════ */}
          {step === 3 && profileData && (
            <div className="space-y-6 max-h-96 overflow-y-auto custom-scrollbar p-1">
              {/* Projects */}
              {sectionsToImport.projects && profileData.projects && profileData.projects.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[var(--ox-text-primary)] uppercase tracking-wider flex items-center justify-between">
                    <span>Projects ({selectedProjectIds.length} / {profileData.projects.length})</span>
                    <button
                      onClick={() => setSelectedProjectIds(selectedProjectIds.length === profileData.projects.length ? [] : profileData.projects.map(p => p.id))}
                      className="text-[10px] text-orange-500 font-semibold hover:underline"
                    >
                      {selectedProjectIds.length === profileData.projects.length ? 'Deselect All' : 'Select All'}
                    </button>
                  </h4>
                  <div className="space-y-2">
                    {profileData.projects.map(p => (
                      <div key={p.id} className="p-3 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] flex items-start gap-3">
                        <input
                          type="checkbox"
                          checked={selectedProjectIds.includes(p.id)}
                          onChange={() => setSelectedProjectIds(prev => prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id])}
                          className="mt-1 rounded text-orange-500 focus:ring-orange-500"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-bold text-[var(--ox-text-primary)]">{p.title}</div>
                          <p className="text-[11px] text-[var(--ox-text-secondary)]">{p.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {sectionsToImport.skills && profileData.skills && profileData.skills.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[var(--ox-text-primary)] uppercase tracking-wider flex items-center justify-between">
                    <span>Skills ({selectedSkillNames.length} Selected)</span>
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {profileData.skills.map(s => {
                      const isSel = selectedSkillNames.includes(s.name);
                      return (
                        <button
                          key={s.name}
                          onClick={() => setSelectedSkillNames(prev => isSel ? prev.filter(n => n !== s.name) : [...prev, s.name])}
                          className={`px-3 py-1 rounded-xl text-xs font-semibold border transition-all ${
                            isSel ? 'bg-orange-500/20 text-orange-600 dark:text-orange-300 border-orange-500/40' : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)] border-[var(--ox-border)]'
                          }`}
                        >
                          {s.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ════ STEP 4: REVIEW & DUPLICATES ════ */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-[var(--ox-border)]">
                <h3 className="text-sm font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Review & Duplicate Resolution
                </h3>
                <p className="text-[11px] text-[var(--ox-text-muted)]">Check for matching projects and certificates before merging into your resume.</p>
              </div>

              <div className="space-y-3">
                {duplicates.projects.map(p => (
                  <div key={p.id} className="p-3.5 rounded-2xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-[var(--ox-text-primary)]">{p.title}</div>
                      {p.isDuplicate && <span className="text-[10px] text-amber-500 font-bold">⚠️ Duplicate in Resume</span>}
                    </div>

                    {p.isDuplicate && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setDuplicateResolutions({ ...duplicateResolutions, [p.id]: 'replace' })}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${duplicateResolutions[p.id] === 'replace' ? 'bg-orange-500 text-white' : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)]'}`}
                        >
                          Replace
                        </button>
                        <button
                          onClick={() => setDuplicateResolutions({ ...duplicateResolutions, [p.id]: 'merge' })}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${duplicateResolutions[p.id] === 'merge' ? 'bg-purple-600 text-white' : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)]'}`}
                        >
                          Merge
                        </button>
                        <button
                          onClick={() => setDuplicateResolutions({ ...duplicateResolutions, [p.id]: 'skip' })}
                          className={`px-2 py-1 rounded text-[10px] font-bold ${duplicateResolutions[p.id] === 'skip' ? 'bg-red-500 text-white' : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)]'}`}
                        >
                          Skip
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Navigation */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--ox-border)] bg-[var(--ox-surface-primary)]">
          {step > 1 ? (
            <button
              onClick={() => setStep(prev => prev - 1)}
              className="px-4 py-2 text-xs font-semibold text-[var(--ox-text-primary)] bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] border border-[var(--ox-border)] rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : <div />}

          {step > 1 && step < 4 && (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="px-5 py-2 text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
            >
              <span>Next</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 4 && (
            <button
              onClick={handleFinalImport}
              className="px-6 py-2.5 text-xs font-extrabold text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Import into Resume Builder
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
