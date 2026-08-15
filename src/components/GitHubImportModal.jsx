import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, Check, AlertCircle, Sparkles, RefreshCw, X,
  ArrowRight, ArrowLeft, Star, GitFork, User, MapPin, Building,
  Globe, Code, CheckCircle2, ShieldCheck, Edit3, Trash2, Sliders,
  Layers, Database, Terminal, FileText, Merge, RefreshCw as ReplaceIcon, SkipForward
} from 'lucide-react';
import { GithubIcon as Github } from './GithubIcon';
import { signInWithPopup, GithubAuthProvider } from 'firebase/auth';
import { auth, githubProvider } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useResume } from '../context/ResumeContext';
import {
  fetchGitHubProfile,
  fetchGitHubRepos,
  extractTechnologiesFromRepos,
  deepScanGitHubRepos,
  detectDuplicateProjects
} from '../services/githubService';
import {
  enhanceProjectsWithAI,
  generateSummaryFromGitHub
} from '../services/ai/aiGitHubEnhancer';

export const GitHubImportModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { activeResume, importGitHubData, isGitHubImportModalOpen, setIsGitHubImportModalOpen } = useResume();

  const active = isOpen !== undefined ? isOpen : isGitHubImportModalOpen;
  const handleClose = onClose || (() => setIsGitHubImportModalOpen(false));

  // Wizard state
  const [step, setStep] = useState(1); // 1: Connect, 2: Profile, 3: Projects, 4: Skills, 5: AI, 6: Review
  const [usernameInput, setUsernameInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetched data
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [extractedTech, setExtractedTech] = useState({ languages: [], frameworks: [], topics: [], all: [] });

  // Selections
  const [selectedRepoIds, setSelectedRepoIds] = useState([]);
  const [repoSearch, setRepoSearch] = useState('');
  const [repoFilter, setRepoFilter] = useState('all'); // all, source, starred
  const [editingRepoId, setEditingRepoId] = useState(null);
  const [repoEditForm, setRepoEditForm] = useState({ title: '', description: '', technologies: [] });

  // Selected Skills
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [customSkillInput, setCustomSkillInput] = useState('');

  // AI & Summary
  const [isAiProcessing, setIsAiProcessing] = useState(false);
  const [summarySuggestion, setSummarySuggestion] = useState('');
  const [useSummary, setUseSummary] = useState(true);
  const [enhancedProjects, setEnhancedProjects] = useState([]);

  // Duplicate resolutions: { [repoId]: 'skip' | 'replace' | 'merge' }
  const [duplicateResolutions, setDuplicateResolutions] = useState({});

  // Auto-detect GitHub username if logged in via GitHub
  useEffect(() => {
    if (active && user) {
      const ghData = user.providerData?.find(p => p.providerId === 'github.com');
      const detectedUser = ghData?.displayName || user.reloadUserInfo?.screenName || '';
      if (detectedUser) {
        setUsernameInput(detectedUser);
      }
    }
  }, [active, user]);

  if (!active) return null;

  // ── Step 1: Connect & Fetch ────────────────────────────────────────────────
  const handleFetchUser = async (targetUsername, token = null) => {
    if (!targetUsername || !targetUsername.trim()) {
      setErrorMsg('Please enter a valid GitHub username.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    try {
      const userProfile = await fetchGitHubProfile(targetUsername, token);
      const userRepos = await fetchGitHubRepos(targetUsername, token);
      
      // Perform deep scan of package.json, requirements.txt, Dockerfile, and README files
      const techStack = await deepScanGitHubRepos(targetUsername, userRepos, token);

      setProfile(userProfile);
      setRepos(userRepos);
      setExtractedTech(techStack);

      // Pre-select non-forked repos up to top 6
      const defaultSelected = userRepos
        .filter(r => !r.isFork)
        .slice(0, 6)
        .map(r => r.id);
      setSelectedRepoIds(defaultSelected);

      // Pre-select skills
      const initialSkills = techStack.all.map(tech => ({
        name: tech,
        type: techStack.languages.includes(tech) ? 'language' : techStack.frameworks.includes(tech) ? 'framework' : 'tool',
        selected: true
      }));
      setSelectedSkills(initialSkills);

      setIsLoading(false);
      setStep(2);
    } catch (err) {
      setIsLoading(false);
      setErrorMsg(err.message || 'Failed to fetch GitHub profile.');
    }
  };

  const handleOAuthConnect = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const credential = GithubAuthProvider.credentialFromResult(result);
      const ghUser = result.user?.reloadUserInfo?.screenName || result.user?.displayName || '';
      const accessToken = credential?.accessToken || null;

      if (ghUser) {
        setUsernameInput(ghUser);
        await handleFetchUser(ghUser, accessToken);
      } else {
        throw new Error('Could not retrieve GitHub username from login.');
      }
    } catch (err) {
      setIsLoading(false);
      const code = err?.code || '';
      const msg = err.message || '';
      if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
        setErrorMsg('');
      } else if (msg.includes('redirect_uri') || msg.includes('auth/operation-not-allowed')) {
        setErrorMsg('GitHub OAuth is misconfigured. Please enter your GitHub username below to fetch profile instantly without OAuth!');
      } else {
        setErrorMsg(err.message || 'GitHub OAuth login failed. You can enter your GitHub username below to fetch public profile.');
      }
    }
  };

  // ── Project Selection Helpers ──────────────────────────────────────────────
  const toggleRepoSelection = (repoId) => {
    setSelectedRepoIds(prev =>
      prev.includes(repoId) ? prev.filter(id => id !== repoId) : [...prev, repoId]
    );
  };

  const handleSelectAllRepos = () => {
    setSelectedRepoIds(filteredRepos.map(r => r.id));
  };

  const handleDeselectAllRepos = () => {
    setSelectedRepoIds([]);
  };

  const handleSelectNonForks = () => {
    setSelectedRepoIds(repos.filter(r => !r.isFork).map(r => r.id));
  };

  const startEditRepo = (repo) => {
    setEditingRepoId(repo.id);
    setRepoEditForm({
      title: repo.title || repo.name,
      description: repo.description || '',
      technologies: Array.isArray(repo.technologies) ? repo.technologies : [repo.language].filter(Boolean)
    });
  };

  const saveEditRepo = (repoId) => {
    setRepos(prev => prev.map(r => r.id === repoId ? { ...r, ...repoEditForm } : r));
    setEditingRepoId(null);
  };

  // ── Skill Selection Helpers ────────────────────────────────────────────────
  const toggleSkill = (skillName) => {
    setSelectedSkills(prev => prev.map(s => s.name === skillName ? { ...s, selected: !s.selected } : s));
  };

  const handleAddCustomSkill = () => {
    if (!customSkillInput.trim()) return;
    const name = customSkillInput.trim();
    if (!selectedSkills.some(s => s.name.toLowerCase() === name.toLowerCase())) {
      setSelectedSkills(prev => [...prev, { name, type: 'tool', selected: true }]);
    }
    setCustomSkillInput('');
  };

  // ── Step 5: AI Enhancements ────────────────────────────────────────────────
  const handleRunAiEnhancement = async () => {
    setIsAiProcessing(true);
    try {
      const selectedRepos = repos.filter(r => selectedRepoIds.includes(r.id));
      const enhanced = await enhanceProjectsWithAI(selectedRepos);
      const summaryText = await generateSummaryFromGitHub(profile, extractedTech.languages, selectedRepos);

      setEnhancedProjects(enhanced);
      setSummarySuggestion(summaryText);
      setIsAiProcessing(false);
      setStep(6);
    } catch (err) {
      setIsAiProcessing(false);
      setStep(6);
    }
  };

  // ── Step 6: Review & Merge ──────────────────────────────────────────────────
  const filteredRepos = repos.filter(r => {
    const q = repoSearch.toLowerCase();
    const matchSearch = r.name.toLowerCase().includes(q) || (r.description || '').toLowerCase().includes(q);
    if (repoFilter === 'source') return matchSearch && !r.isFork;
    if (repoFilter === 'starred') return matchSearch && r.stars > 0;
    return matchSearch;
  });

  const selectedRepoObjects = repos.filter(r => selectedRepoIds.includes(r.id));
  const duplicateCheckedRepos = detectDuplicateProjects(selectedRepoObjects, activeResume?.projects || []);

  const handleFinalImport = () => {
    const finalProjects = duplicateCheckedRepos.map(repo => {
      const enhanced = enhancedProjects.find(ep => ep.id === repo.id);
      const resolution = duplicateResolutions[repo.id] || (repo.isDuplicate ? 'replace' : 'add');

      return {
        id: repo.id,
        title: repo.title || repo.name,
        name: repo.name,
        description: repo.description,
        bullets: enhanced?.bullets || (repo.description ? [repo.description] : []),
        technologies: Array.isArray(repo.technologies) ? repo.technologies : [repo.language].filter(Boolean),
        htmlUrl: repo.htmlUrl,
        action: resolution
      };
    }).filter(p => p.action !== 'skip');

    const activeSkillsToImport = selectedSkills
      .filter(s => s.selected)
      .map(s => ({ name: s.name, type: s.type }));

    const payload = {
      personal: {
        fullName: profile?.name || '',
        location: profile?.location || '',
        website: profile?.blog || '',
        github: profile?.htmlUrl || `https://github.com/${profile?.username}`,
        summary: summarySuggestion
      },
      projects: finalProjects,
      skills: activeSkillsToImport,
      updateSummary: useSummary && Boolean(summarySuggestion)
    };

    importGitHubData(payload);
    sessionStorage.setItem('ox_import_success_toast', 'GitHub profile & projects imported successfully.');
    handleClose();
    navigate('/builder');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[var(--ox-card-bg)] w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--ox-border)] rounded-3xl shadow-2xl relative text-[var(--ox-text-primary)] transition-colors duration-300">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--ox-border)] bg-[var(--ox-surface-primary)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500 border border-purple-500/30">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-[var(--ox-text-primary)]">GitHub Profile & Projects Import</h2>
              <p className="text-[11px] text-[var(--ox-text-muted)]">Step {step} of 6 — Official GitHub REST API</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl text-[var(--ox-text-secondary)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Wizard Progress Bar */}
        <div className="w-full bg-[var(--ox-surface-secondary)] h-1">
          <div
            className="bg-gradient-to-r from-purple-500 via-orange-500 to-amber-500 h-full transition-all duration-300"
            style={{ width: `${(step / 6) * 100}%` }}
          />
        </div>

        {/* Modal Body Scroll Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[var(--ox-card-bg)]">

          {/* ════ STEP 1: CONNECT GITHUB ════ */}
          {step === 1 && (
            <div className="space-y-6 py-4">
              <div className="text-center space-y-2 max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-500 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(168,85,247,0.15)]">
                  <Github className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-[var(--ox-text-primary)]">Connect GitHub Profile</h3>
                <p className="text-xs text-[var(--ox-text-secondary)] leading-relaxed">
                  Automatically import your public repositories, top technical skills, bio, and portfolio link straight into your resume.
                </p>
              </div>

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-xs flex items-center gap-2 max-w-md mx-auto">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="max-w-md mx-auto space-y-4">
                {/* GitHub Username Input Form */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (usernameInput.trim()) {
                      handleFetchUser(usernameInput.trim());
                    }
                  }}
                  className="space-y-3"
                >
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-[var(--ox-text-secondary)]">GitHub Username</label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-3 text-xs text-[var(--ox-text-muted)] font-mono">@</span>
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        placeholder="e.g. torvalds or your-username"
                        className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] rounded-xl pl-8 pr-4 py-2.5 text-xs placeholder-[var(--ox-text-muted)] focus:outline-none focus:border-purple-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !usernameInput.trim()}
                    className="w-full py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    <span>{isLoading ? 'Fetching GitHub Profile...' : 'Fetch GitHub Profile'}</span>
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* ════ STEP 2: PROFILE OVERVIEW ════ */}
          {step === 2 && profile && (
            <div className="space-y-6">
              <div className="bg-[var(--ox-surface-primary)] p-5 border border-[var(--ox-border)] rounded-2xl flex items-start gap-4">
                <img
                  src={profile.avatar}
                  alt={profile.name}
                  className="w-16 h-16 rounded-2xl border border-[var(--ox-border)] shadow-md object-cover"
                />
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[var(--ox-text-primary)] truncate">{profile.name}</h3>
                    <span className="text-xs text-[var(--ox-text-muted)] font-mono">@{profile.username}</span>
                  </div>
                  {profile.bio && <p className="text-xs text-[var(--ox-text-secondary)] leading-relaxed line-clamp-2">{profile.bio}</p>}
                  <div className="flex items-center gap-4 text-[11px] text-[var(--ox-text-muted)] pt-1 flex-wrap">
                    {profile.company && <span className="flex items-center gap-1"><Building className="w-3 h-3" /> {profile.company}</span>}
                    {profile.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {profile.location}</span>}
                    <span className="flex items-center gap-1"><Code className="w-3 h-3 text-purple-500" /> {profile.publicRepos} Public Repos</span>
                  </div>
                </div>
              </div>

              {/* Extracted Tech Stack Summary */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--ox-text-primary)] uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-purple-500" /> Detected Technology Stack ({extractedTech.all.length})
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {extractedTech.all.map(tech => (
                    <span key={tech} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/30">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ════ STEP 3: CHOOSE PROJECTS ════ */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-2 border-b border-[var(--ox-border)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                    <Code className="w-4 h-4 text-purple-500" /> Select Repositories ({selectedRepoIds.length} / {repos.length} selected)
                  </h3>
                  <p className="text-[11px] text-[var(--ox-text-muted)]">Choose which GitHub projects to import as resume projects.</p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleSelectAllRepos} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--ox-surface-secondary)] text-[var(--ox-text-primary)] border border-[var(--ox-border)] hover:border-purple-500/50">Select All</button>
                  <button onClick={handleSelectNonForks} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--ox-surface-secondary)] text-purple-600 dark:text-purple-300 border border-[var(--ox-border)] hover:border-purple-500/50">Source Repos</button>
                  <button onClick={handleDeselectAllRepos} className="px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)] border border-[var(--ox-border)] hover:border-purple-500/50">Clear</button>
                </div>
              </div>

              {/* Filter & Search */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-[var(--ox-text-muted)] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={repoSearch}
                    onChange={(e) => setRepoSearch(e.target.value)}
                    placeholder="Search repositories..."
                    className="w-full bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] rounded-xl pl-8 pr-3 py-1.5 text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <select
                  value={repoFilter}
                  onChange={(e) => setRepoFilter(e.target.value)}
                  className="bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] rounded-xl px-3 py-1.5 text-xs font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all">All Repositories</option>
                  <option value="source">Source (No Forks)</option>
                  <option value="starred">Has Stars</option>
                </select>
              </div>

              {/* Repos Grid */}
              <div className="space-y-2.5 max-h-80 overflow-y-auto custom-scrollbar">
                {filteredRepos.map(repo => {
                  const isSelected = selectedRepoIds.includes(repo.id);
                  const isEditing = editingRepoId === repo.id;

                  return (
                    <div
                      key={repo.id}
                      className={`p-3.5 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-purple-500/10 border-purple-500/40 text-[var(--ox-text-primary)]'
                          : 'bg-[var(--ox-surface-primary)] border-[var(--ox-border)] hover:border-purple-500/30'
                      }`}
                    >
                      {isEditing ? (
                        <div className="space-y-3">
                          <input
                            type="text"
                            value={repoEditForm.title}
                            onChange={(e) => setRepoEditForm({ ...repoEditForm, title: e.target.value })}
                            className="w-full bg-[var(--ox-card-bg)] border border-purple-500/50 rounded-lg px-2.5 py-1 text-xs font-bold text-[var(--ox-text-primary)] focus:outline-none"
                          />
                          <textarea
                            value={repoEditForm.description}
                            onChange={(e) => setRepoEditForm({ ...repoEditForm, description: e.target.value })}
                            rows={2}
                            className="w-full bg-[var(--ox-card-bg)] border border-[var(--ox-border)] rounded-lg p-2 text-xs text-[var(--ox-text-secondary)] focus:outline-none"
                          />
                          <div className="flex justify-end gap-2">
                            <button onClick={() => setEditingRepoId(null)} className="px-3 py-1 text-xs text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)]">Cancel</button>
                            <button onClick={() => saveEditRepo(repo.id)} className="px-3 py-1 text-xs font-bold bg-purple-600 text-white rounded-lg">Save</button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => toggleRepoSelection(repo.id)}
                            className="mt-1 rounded border-[var(--ox-border)] text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <div className="flex-1 min-w-0 space-y-1 cursor-pointer" onClick={() => toggleRepoSelection(repo.id)}>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-xs font-bold text-[var(--ox-text-primary)] hover:text-purple-500 transition-colors truncate">{repo.title || repo.name}</span>
                              {repo.isFork && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)]">Fork</span>}
                              {repo.language && <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 border border-purple-500/20">{repo.language}</span>}
                            </div>
                            {repo.description && <p className="text-[11px] text-[var(--ox-text-secondary)] line-clamp-2">{repo.description}</p>}
                            <div className="flex items-center gap-3 text-[10px] text-[var(--ox-text-muted)] pt-0.5">
                              {repo.stars > 0 && <span className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-500" /> {repo.stars}</span>}
                              {repo.forks > 0 && <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> {repo.forks}</span>}
                            </div>
                          </div>
                          <button
                            onClick={() => startEditRepo(repo)}
                            className="p-1.5 text-[var(--ox-text-muted)] hover:text-[var(--ox-text-primary)] hover:bg-[var(--ox-surface-secondary)] rounded-lg transition-colors"
                            title="Edit project"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ════ STEP 4: CHOOSE SKILLS ════ */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-2 border-b border-[var(--ox-border)]">
                <div>
                  <h3 className="text-sm font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-purple-500" /> Choose Skills to Import
                  </h3>
                  <p className="text-[11px] text-[var(--ox-text-muted)]">Selected technologies will be merged into your resume skills section.</p>
                </div>
              </div>

              {/* Add Custom Skill */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkillInput}
                  onChange={(e) => setCustomSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddCustomSkill()}
                  placeholder="Add additional skill (e.g. Docker, PostgreSQL)..."
                  className="flex-1 bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] text-[var(--ox-text-primary)] rounded-xl px-3 py-1.5 text-xs focus:outline-none focus:border-purple-500"
                />
                <button
                  onClick={handleAddCustomSkill}
                  className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl transition-colors"
                >
                  Add Skill
                </button>
              </div>

              {/* Skills Chips */}
              <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto custom-scrollbar p-1">
                {selectedSkills.map(skill => (
                  <button
                    key={skill.name}
                    onClick={() => toggleSkill(skill.name)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      skill.selected
                        ? 'bg-purple-500/20 text-purple-700 dark:text-purple-300 border border-purple-500/40 shadow-sm'
                        : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)] border border-[var(--ox-border)] opacity-60 hover:opacity-100'
                    }`}
                  >
                    {skill.selected && <Check className="w-3 h-3 text-purple-500" />}
                    <span>{skill.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ════ STEP 5: AI ENHANCEMENT ════ */}
          {step === 5 && (
            <div className="space-y-6 py-4 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-purple-500/20 border border-orange-500/30 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(249,115,22,0.15)]">
                <Sparkles className="w-8 h-8 text-orange-500" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-black text-[var(--ox-text-primary)]">AI Resume Enhancement</h3>
                <p className="text-xs text-[var(--ox-text-secondary)] leading-relaxed">
                  Let AI polish your GitHub repository descriptions into ATS action-oriented bullet points and draft a tailored professional summary.
                </p>
              </div>

              <div className="max-w-md mx-auto space-y-3 text-left bg-[var(--ox-surface-primary)] p-4 rounded-2xl border border-[var(--ox-border)]">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={useSummary}
                    onChange={(e) => setUseSummary(e.target.checked)}
                    className="rounded border-[var(--ox-border)] text-orange-500 focus:ring-orange-500"
                  />
                  <span className="text-xs text-[var(--ox-text-primary)] font-semibold">Generate suggested Professional Summary</span>
                </label>
              </div>

              <div className="max-w-md mx-auto flex flex-col gap-3">
                <button
                  onClick={handleRunAiEnhancement}
                  disabled={isAiProcessing}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-black font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  {isAiProcessing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  <span>Enhance Projects & Summary with AI</span>
                </button>
                <button
                  onClick={() => setStep(6)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[var(--ox-surface-secondary)] hover:bg-[var(--ox-card-hover)] text-[var(--ox-text-secondary)] border border-[var(--ox-border)] font-semibold text-xs transition-colors"
                >
                  Skip AI Enhancement
                </button>
              </div>
            </div>
          )}

          {/* ════ STEP 6: REVIEW & MERGE ════ */}
          {step === 6 && (
            <div className="space-y-6">
              <div className="pb-2 border-b border-[var(--ox-border)]">
                <h3 className="text-sm font-bold text-[var(--ox-text-primary)] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Review Imported Items
                </h3>
                <p className="text-[11px] text-[var(--ox-text-muted)]">Verify what will be merged into your active resume.</p>
              </div>

              {/* Summary suggestion preview */}
              {summarySuggestion && useSummary && (
                <div className="p-4 rounded-2xl bg-orange-500/10 border border-orange-500/30 space-y-2">
                  <h4 className="text-xs font-bold text-orange-500 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Suggested Professional Summary
                  </h4>
                  <p className="text-xs text-[var(--ox-text-primary)] leading-relaxed">{summarySuggestion}</p>
                </div>
              )}

              {/* Selected Projects */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--ox-text-primary)] uppercase tracking-wider">
                  Projects to Add / Merge ({duplicateCheckedRepos.length})
                </h4>
                <div className="space-y-2 max-h-44 overflow-y-auto custom-scrollbar">
                  {duplicateCheckedRepos.map(repo => (
                    <div key={repo.id} className="p-3 rounded-xl bg-[var(--ox-surface-primary)] border border-[var(--ox-border)] flex items-center justify-between text-xs">
                      <div className="min-w-0 flex-1">
                        <span className="font-bold text-[var(--ox-text-primary)] truncate block">{repo.title || repo.name}</span>
                        <span className="text-[10px] text-[var(--ox-text-muted)]">{repo.language}</span>
                      </div>

                      {repo.isDuplicate && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setDuplicateResolutions({ ...duplicateResolutions, [repo.id]: 'replace' })}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${duplicateResolutions[repo.id] === 'replace' ? 'bg-orange-500 text-white' : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)]'}`}
                          >
                            Replace
                          </button>
                          <button
                            onClick={() => setDuplicateResolutions({ ...duplicateResolutions, [repo.id]: 'merge' })}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${duplicateResolutions[repo.id] === 'merge' ? 'bg-purple-600 text-white' : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)]'}`}
                          >
                            Merge
                          </button>
                          <button
                            onClick={() => setDuplicateResolutions({ ...duplicateResolutions, [repo.id]: 'skip' })}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${duplicateResolutions[repo.id] === 'skip' ? 'bg-red-500 text-white' : 'bg-[var(--ox-surface-secondary)] text-[var(--ox-text-muted)]'}`}
                          >
                            Skip
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
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

          {step > 1 && step < 6 && (
            <button
              onClick={() => setStep(prev => prev + 1)}
              className="px-5 py-2 text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 rounded-xl transition-all flex items-center gap-1.5 shadow-md"
            >
              <span>Next</span> <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 6 && (
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
