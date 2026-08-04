/**
 * OpportunityX Resume — Validation Engine
 * Detects missing links, generic text, overused words, and formatting flaws.
 */

export const OVERUSED_WORDS = [
  "responsible for",
  "hardworking",
  "team player",
  "synergy",
  "think outside the box",
  "detail oriented",
  "self motivated",
  "results driven",
  "go-getter",
  "dynamic professional"
];

export function validateResumeContent(resumeData) {
  if (!resumeData) return { flaws: [], totalFlaws: 0 };

  const flaws = [];
  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [] } = resumeData;

  // 1. Missing Contact Links
  if (!personal.email?.trim()) {
    flaws.push({ id: 'flaw-email', priority: 'Critical', section: 'personal', title: 'Missing Email Address', desc: 'No email address found in personal information.' });
  }
  if (!personal.phone?.trim()) {
    flaws.push({ id: 'flaw-phone', priority: 'Critical', section: 'personal', title: 'Missing Phone Number', desc: 'Recruiters require a direct contact number.' });
  }
  if (!personal.linkedin?.trim()) {
    flaws.push({ id: 'flaw-linkedin', priority: 'Recommended', section: 'socialLinks', title: 'Missing LinkedIn Profile', desc: 'Adding a LinkedIn profile increases candidate response rate by 71%.' });
  }
  if (!personal.github?.trim()) {
    flaws.push({ id: 'flaw-github', priority: 'Recommended', section: 'socialLinks', title: 'Missing GitHub URL', desc: 'Engineering roles strongly benefit from an active GitHub link.' });
  }

  // 2. Summary Validation
  const summaryText = (personal.summary || '').toLowerCase();
  if (!summaryText || summaryText.length < 40) {
    flaws.push({ id: 'flaw-summary-short', priority: 'Critical', section: 'summary', title: 'Summary Too Short or Generic', desc: 'Write a 3-4 line intro highlighting your role and top technical impact.' });
  }

  // 3. Overused Buzzwords Detection
  OVERUSED_WORDS.forEach((word) => {
    if (summaryText.includes(word)) {
      flaws.push({ id: `flaw-buzz-${word}`, priority: 'Recommended', section: 'summary', title: `Overused Word: "${word}"`, desc: `Replace passive buzzword "${word}" with action verbs and quantifiable metrics.` });
    }
  });

  // 4. Experience Bullets & Metrics Check
  if (!experience || experience.length === 0) {
    flaws.push({ id: 'flaw-exp-empty', priority: 'Critical', section: 'experience', title: 'No Work Experience Entries', desc: 'Add at least 1 work role or internship.' });
  } else {
    experience.forEach((exp, idx) => {
      if (!exp.bullets || exp.bullets.length < 2) {
        flaws.push({ id: `flaw-exp-bullets-${idx}`, priority: 'Recommended', section: 'experience', title: `Sparse Experience Bullets (${exp.role || `Role #${idx + 1}`})`, desc: 'Add 3-4 achievement bullet points starting with strong action verbs.' });
      }
      // Check for missing metric numbers (%, $, users, speed)
      const hasNumber = (exp.bullets || []).some((b) => /\d+/.test(b));
      if (!hasNumber) {
        flaws.push({ id: `flaw-exp-metric-${idx}`, priority: 'Optional', section: 'experience', title: `Lacks Quantifiable Metrics (${exp.company || `Role #${idx + 1}`})`, desc: 'Include numerical metrics (e.g. 40% latency reduction, 15M+ API requests).' });
      }
    });
  }

  // 5. Projects Check
  if (!projects || projects.length === 0) {
    flaws.push({ id: 'flaw-proj-empty', priority: 'Recommended', section: 'projects', title: 'No Projects Listed', desc: 'Technical projects demonstrate practical hands-on capability.' });
  }

  // 6. Duplicate Skills Check
  const allSkills = [
    ...(skills.languages || []),
    ...(skills.frameworks || []),
    ...(skills.tools || [])
  ];
  const duplicates = allSkills.filter((item, index) => allSkills.indexOf(item) !== index);
  if (duplicates.length > 0) {
    flaws.push({ id: 'flaw-[#skills-dup]', priority: 'Optional', section: 'skills', title: `Duplicate Skill Tags (${duplicates.join(', ')})`, desc: 'Remove duplicate skill chips across languages, frameworks, and tools.' });
  }

  return {
    flaws,
    totalFlaws: flaws.length,
    criticalCount: flaws.filter((f) => f.priority === 'Critical').length,
    recommendedCount: flaws.filter((f) => f.priority === 'Recommended').length
  };
}
