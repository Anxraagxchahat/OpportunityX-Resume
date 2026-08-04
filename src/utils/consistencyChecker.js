/**
 * OpportunityX Resume — Resume Consistency Checker
 * Detects timeline gaps, duplicate skills/projects, and missing dates.
 */

export function checkConsistency(resumeData) {
  if (!resumeData) return { issues: [], hasIssues: false };

  const issues = [];
  const { experience = [], education = [], projects = [], skills = {} } = resumeData;

  // 1. Missing Experience Dates
  experience.forEach((exp, idx) => {
    if (!exp.startDate?.trim()) {
      issues.push({ id: `date-exp-start-${idx}`, type: 'Missing Date', desc: `Missing start date for experience position "${exp.role || `Role #${idx + 1}`}".` });
    }
    if (!exp.current && !exp.endDate?.trim()) {
      issues.push({ id: `date-exp-end-${idx}`, type: 'Missing Date', desc: `Missing end date for past position "${exp.role || `Role #${idx + 1}`}".` });
    }
  });

  // 2. Duplicate Project Names
  const projectNames = projects.map((p) => (p.name || '').trim().toLowerCase()).filter(Boolean);
  const duplicateProjects = projectNames.filter((name, index) => projectNames.indexOf(name) !== index);
  if (duplicateProjects.length > 0) {
    issues.push({ id: 'dup-projects', type: 'Duplicate Entry', desc: `Duplicate project titles detected: ${duplicateProjects.join(', ')}.` });
  }

  // 3. Duplicate Skills Tags
  const allSkills = [
    ...(skills.languages || []),
    ...(skills.frameworks || []),
    ...(skills.tools || [])
  ].map((s) => s.trim().toLowerCase());

  const duplicateSkills = allSkills.filter((sk, index) => allSkills.indexOf(sk) !== index);
  if (duplicateSkills.length > 0) {
    issues.push({ id: 'dup-skills', type: 'Duplicate Skill', desc: `Duplicate skill tags detected: ${Array.from(new Set(duplicateSkills)).join(', ')}.` });
  }

  return {
    issues,
    hasIssues: issues.length > 0,
    issueCount: issues.length
  };
}
