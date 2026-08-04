/**
 * OpportunityX Resume — Universal Ecosystem Search Engine Architecture
 * Index architecture for Projects, Skills, Certificates, Resumes, Profiles, Freelancers.
 */

export function searchEcosystem(query = '', resumeData = null) {
  if (!query.trim() || !resumeData) return [];

  const q = query.toLowerCase();
  const results = [];

  // Search Projects
  (resumeData.projects || []).forEach((p) => {
    if ((p.name || '').toLowerCase().includes(q) || (p.description || '').toLowerCase().includes(q)) {
      results.push({ type: 'Project', title: p.name, desc: p.description, source: 'Resume Module' });
    }
  });

  // Search Skills
  const allSkills = [
    ...(resumeData.skills?.languages || []),
    ...(resumeData.skills?.frameworks || []),
    ...(resumeData.skills?.tools || [])
  ];
  allSkills.forEach((s) => {
    if (s.toLowerCase().includes(q)) {
      results.push({ type: 'Skill Tag', title: s, desc: 'Technical Skill Tag', source: 'Ecosystem Profile' });
    }
  });

  return results;
}
