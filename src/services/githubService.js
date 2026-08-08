/**
 * OpportunityX Resume — Official GitHub API Service
 * Interacts directly with GitHub REST API v3 (https://api.github.com)
 * 
 * Features:
 * - Public Profile Fetching (/users/{username})
 * - Repositories Fetching (/users/{username}/repos)
 * - Technology & Stack Extraction (Languages, Frameworks, Libraries, Tools)
 * - Session Caching (10 min TTL) to avoid GitHub API Rate Limits
 * - No Personal Access Tokens stored or exposed
 */

import { extractTechnologiesFromText } from './ai/techExtractionEngine';

const GITHUB_API_BASE = 'https://api.github.com';
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes cache TTL

/**
 * Fetch GitHub user profile
 */
export async function fetchGitHubProfile(username, token = null) {
  if (!username || !username.trim()) {
    throw new Error('Please enter a valid GitHub username.');
  }

  const cleanUsername = username.trim().replace(/^@/, '');
  const cacheKey = `ox_gh_profile_${cleanUsername.toLowerCase()}`;

  // Check Session Storage Cache
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res = await fetch(`${GITHUB_API_BASE}/users/${cleanUsername}`, { headers });

  if (res.status === 401 && token) {
    // If token is invalid or unauthorized, retry unauthenticated for public profile
    delete headers['Authorization'];
    res = await fetch(`${GITHUB_API_BASE}/users/${cleanUsername}`, { headers });
  }

  if (res.status === 404) {
    throw new Error(`GitHub user "${cleanUsername}" was not found.`);
  }

  if (res.status === 403) {
    const rateLimitReset = res.headers.get('x-ratelimit-reset');
    const resetTime = rateLimitReset ? new Date(parseInt(rateLimitReset, 10) * 1000).toLocaleTimeString() : 'soon';
    throw new Error(`GitHub API rate limit exceeded. Please try again at ${resetTime} or sign in with GitHub.`);
  }

  if (!res.ok) {
    throw new Error(`GitHub API error (${res.status}): Failed to fetch profile.`);
  }

  const data = await res.json();

  const profileData = {
    username: data.login,
    name: data.name || data.login,
    avatar: data.avatar_url,
    bio: data.bio || '',
    location: data.location || '',
    company: data.company || '',
    blog: formatUrl(data.blog),
    email: data.email || '',
    followers: data.followers || 0,
    following: data.following || 0,
    publicRepos: data.public_repos || 0,
    htmlUrl: data.html_url,
    createdAt: data.created_at
  };

  setCachedData(cacheKey, profileData);
  return profileData;
}

/**
 * Fetch GitHub repositories for a user
 */
export async function fetchGitHubRepos(username, token = null, maxRepos = 100) {
  const cleanUsername = username.trim().replace(/^@/, '');
  const cacheKey = `ox_gh_repos_${cleanUsername.toLowerCase()}`;

  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Fetch up to 100 most recently updated public repos
  const url = `${GITHUB_API_BASE}/users/${cleanUsername}/repos?sort=updated&per_page=${maxRepos}&type=all`;
  let res = await fetch(url, { headers });

  if (res.status === 401 && token) {
    delete headers['Authorization'];
    res = await fetch(url, { headers });
  }

  if (!res.ok) {
    throw new Error(`Failed to fetch repositories for @${cleanUsername}.`);
  }

  const repos = await res.json();

  const parsedRepos = repos.map(repo => ({
    id: repo.id,
    name: repo.name,
    title: formatRepoTitle(repo.name),
    description: repo.description || '',
    htmlUrl: repo.html_url,
    homepage: formatUrl(repo.homepage),
    language: repo.language || 'Other',
    stars: repo.stargazers_count || 0,
    forks: repo.forks_count || 0,
    topics: Array.isArray(repo.topics) ? repo.topics : [],
    isFork: repo.fork || false,
    updatedAt: repo.updated_at,
    createdAt: repo.created_at
  }));

  setCachedData(cacheKey, parsedRepos);
  return parsedRepos;
}

/**
 * Extract and rank technologies across all fetched repositories using Tech Extraction Engine
 */
export function extractTechnologiesFromRepos(repos = []) {
  if (!Array.isArray(repos) || repos.length === 0) {
    return { languages: [], frameworks: [], topics: [], all: [] };
  }

  // Combine languages, topics, names, and descriptions from repos
  const repoTexts = repos.map(r => `${r.name} ${r.description || ''} ${r.language || ''} ${(r.topics || []).join(' ')}`).join(' \n ');
  const rawLangs = repos.map(r => r.language).filter(l => l && l !== 'Other');

  const result = extractTechnologiesFromText(repoTexts, rawLangs, { minConfidence: 'MEDIUM' });
  const allDetected = result.allDetected || [];

  const languages = allDetected.filter(d => d.category === 'Programming Languages').map(d => d.name);
  const frameworks = allDetected.filter(d => d.category === 'Frontend Development' || d.category === 'Backend Development').map(d => d.name);
  const tools = allDetected.filter(d => d.category === 'Databases & Storage' || d.category === 'Cloud & Infrastructure' || d.category === 'DevOps & CI/CD' || d.category === 'Developer Tools').map(d => d.name);
  const allNames = Array.from(new Set(allDetected.map(d => d.name)));

  return {
    languages,
    frameworks,
    topics: tools,
    all: allNames,
    categorized: result.categorizedSkills
  };
}

/**
 * Asynchronously deep scans repository manifest files (package.json, requirements.txt, Dockerfile, README.md)
 * across the user's top repositories to detect frameworks, databases, cloud, DevOps & AI tools.
 */
export async function deepScanGitHubRepos(username, repos = [], token = null) {
  if (!username || !Array.isArray(repos) || repos.length === 0) {
    return extractTechnologiesFromRepos(repos);
  }

  const cleanUsername = username.trim().replace(/^@/, '');

  // Sort repos by relevance: non-forks first, then stargazers, then recent update date
  const sortedRepos = [...repos].sort((a, b) => {
    if (a.isFork !== b.isFork) return a.isFork ? 1 : -1;
    if (b.stars !== a.stars) return b.stars - a.stars;
    return new Date(b.updatedAt || 0) - new Date(a.updatedAt || 0);
  });

  // Limit deep scanning to top 8 most relevant repositories
  const targetRepos = sortedRepos.slice(0, 8);
  const manifestScannedTexts = [];

  const headers = { 'Accept': 'application/vnd.github.v3.raw' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const fetchFile = async (repoName, path) => {
    try {
      const url = `${GITHUB_API_BASE}/repos/${cleanUsername}/${repoName}/contents/${path}`;
      const res = await fetch(url, { headers });
      if (!res.ok) return null;
      return await res.text();
    } catch (e) {
      return null;
    }
  };

  // Inspect target repositories in parallel
  await Promise.allSettled(targetRepos.map(async (repo) => {
    const repoWeightPrefix = repo.stars > 0 ? 'skills tech stack ' : 'skills ';

    // 1. Check package.json
    const packageJsonText = await fetchFile(repo.name, 'package.json');
    if (packageJsonText) {
      try {
        const pkg = JSON.parse(packageJsonText);
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        const depNames = Object.keys(deps).join(' ');
        manifestScannedTexts.push(`${repoWeightPrefix} ${depNames}`);
      } catch (e) {
        manifestScannedTexts.push(`${repoWeightPrefix} ${packageJsonText.slice(0, 1000)}`);
      }
    }

    // 2. Check requirements.txt
    const reqText = await fetchFile(repo.name, 'requirements.txt');
    if (reqText) {
      const cleanReqs = reqText
        .split('\n')
        .map(line => line.split(/[=><~#]/)[0].trim())
        .filter(Boolean)
        .join(' ');
      manifestScannedTexts.push(`${repoWeightPrefix} ${cleanReqs}`);
    }

    // 3. Check Dockerfile
    const dockerText = await fetchFile(repo.name, 'Dockerfile');
    if (dockerText) {
      manifestScannedTexts.push(`${repoWeightPrefix} Docker Containerization`);
    }

    // 4. Check README.md
    const readmeText = await fetchFile(repo.name, 'README.md');
    if (readmeText) {
      manifestScannedTexts.push(readmeText.slice(0, 1500));
    }
  }));

  // Combine initial repo metadata + manifest scanned contents
  const initialRepoTexts = repos.map(r => `${r.name} ${r.description || ''} ${r.language || ''} ${(r.topics || []).join(' ')}`).join(' \n ');
  const combinedText = `${initialRepoTexts} \n ${manifestScannedTexts.join(' \n ')}`;
  const rawLangs = repos.map(r => r.language).filter(l => l && l !== 'Other');

  const result = extractTechnologiesFromText(combinedText, rawLangs, { minConfidence: 'MEDIUM' });
  const allDetected = result.allDetected || [];

  const languages = allDetected.filter(d => d.category === 'Programming Languages').map(d => d.name);
  const frameworks = allDetected.filter(d => d.category === 'Frontend Development' || d.category === 'Backend Development').map(d => d.name);
  const tools = allDetected.filter(d => d.category === 'Databases & Storage' || d.category === 'Cloud & Infrastructure' || d.category === 'DevOps & CI/CD' || d.category === 'Developer Tools' || d.category === 'AI, ML & Data Science' || d.category === 'Mobile Development' || d.category === 'Testing & QA').map(d => d.name);
  const allNames = Array.from(new Set(allDetected.map(d => d.name)));

  return {
    languages,
    frameworks,
    topics: tools,
    all: allNames,
    categorized: result.categorizedSkills,
    allDetected
  };
}

/**
 * Check existing resume projects for duplicate titles or URLs
 */
export function detectDuplicateProjects(githubProjects = [], existingProjects = []) {
  if (!Array.isArray(existingProjects) || existingProjects.length === 0) {
    return githubProjects.map(p => ({ ...p, isDuplicate: false }));
  }

  return githubProjects.map(gh => {
    const ghUrl = (gh.htmlUrl || '').toLowerCase().trim();
    const ghTitle = (gh.title || gh.name || '').toLowerCase().trim();

    const existingMatch = existingProjects.find(ex => {
      const exTitle = (ex.title || ex.name || '').toLowerCase().trim();
      const exLink = (ex.link || ex.url || '').toLowerCase().trim();
      return (exTitle && exTitle === ghTitle) || (exLink && ghUrl && exLink === ghUrl);
    });

    return {
      ...gh,
      isDuplicate: Boolean(existingMatch),
      existingProject: existingMatch || null
    };
  });
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatRepoTitle(name = '') {
  return name
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function formatTechName(tech = '') {
  const map = {
    'react': 'React',
    'next.js': 'Next.js',
    'nextjs': 'Next.js',
    'vue': 'Vue.js',
    'angular': 'Angular',
    'svelte': 'Svelte',
    'express': 'Express.js',
    'nestjs': 'NestJS',
    'fastapi': 'FastAPI',
    'django': 'Django',
    'flask': 'Flask',
    'springboot': 'Spring Boot',
    'spring-boot': 'Spring Boot',
    'laravel': 'Laravel',
    'rails': 'Ruby on Rails',
    'react-native': 'React Native',
    'flutter': 'Flutter',
    'tailwind': 'Tailwind CSS',
    'tailwindcss': 'Tailwind CSS',
    'bootstrap': 'Bootstrap',
    'redux': 'Redux',
    'graphql': 'GraphQL',
    'rest-api': 'REST API',
    'node': 'Node.js',
    'nodejs': 'Node.js',
    'deno': 'Deno',
    'bun': 'Bun',
    'docker': 'Docker',
    'kubernetes': 'Kubernetes',
    'postgresql': 'PostgreSQL',
    'postgres': 'PostgreSQL',
    'mysql': 'MySQL',
    'mongodb': 'MongoDB',
    'redis': 'Redis',
    'firebase': 'Firebase',
    'supabase': 'Supabase',
    'aws': 'AWS',
    'gcp': 'Google Cloud',
    'azure': 'Microsoft Azure',
    'git': 'Git',
    'ci-cd': 'CI/CD',
    'github-actions': 'GitHub Actions'
  };

  return map[tech.toLowerCase()] || (tech.charAt(0).toUpperCase() + tech.slice(1));
}

function formatUrl(url = '') {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
}

function getCachedData(key) {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      return parsed.data;
    }
    sessionStorage.removeItem(key);
  } catch (e) {}
  return null;
}

function setCachedData(key, data) {
  try {
    sessionStorage.setItem(key, JSON.stringify({
      timestamp: Date.now(),
      data
    }));
  } catch (e) {}
}
