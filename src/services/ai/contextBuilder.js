/**
 * OpportunityX Resume — Minimal AI Context Builder
 * Constructs minimal required resume payload per feature. Excludes metadata & keys.
 */

export function buildMinimalContext(featureId, resumeData, extraParams = {}) {
  if (!resumeData) return {};

  const { personal = {}, experience = [], education = [], projects = [], skills = {} } = resumeData;

  switch (featureId) {
    case 'summary_generator':
      return {
        fullName: personal.fullName || '',
        jobTitle: personal.jobTitle || '',
        existingSummary: personal.summary || '',
        skills: [
          ...(skills.languages || []),
          ...(skills.frameworks || []),
          ...(skills.tools || [])
        ],
        topRoles: experience.slice(0, 2).map((e) => ({ role: e.role, company: e.company }))
      };

    case 'experience_rewrite':
      return {
        selectedRole: extraParams.selectedItem || (experience[0] ? experience[0] : {}),
        jobTarget: personal.jobTitle || 'Software Engineer'
      };

    case 'project_generator':
      return {
        selectedProject: extraParams.selectedItem || (projects[0] ? projects[0] : {}),
        jobTarget: personal.jobTitle || 'Software Engineer'
      };

    case 'grammar_fix':
      return {
        textToFix: extraParams.textToFix || personal.summary || ''
      };

    case 'cover_letter':
      return {
        applicantName: personal.fullName || '',
        applicantEmail: personal.email || '',
        jobTitle: personal.jobTitle || '',
        targetCompany: extraParams.company || 'Tech Target Inc.',
        targetRole: extraParams.role || personal.jobTitle || 'Senior Software Engineer',
        jobDescription: extraParams.jobDescription || '',
        topExperience: experience.slice(0, 2),
        topSkills: (skills.languages || []).concat(skills.frameworks || [])
      };

    case 'linkedin_generator':
      return {
        fullName: personal.fullName || '',
        jobTitle: personal.jobTitle || '',
        summary: personal.summary || '',
        skills: [
          ...(skills.languages || []),
          ...(skills.frameworks || []),
          ...(skills.tools || [])
        ]
      };

    case 'resume_review':
    default:
      return {
        personal: { fullName: personal.fullName, jobTitle: personal.jobTitle, summary: personal.summary },
        experience: experience.map((e) => ({ role: e.role, company: e.company, bullets: e.bullets })),
        projects: projects.map((p) => ({ name: p.name, techStack: p.techStack, description: p.description })),
        skills
      };
  }
}
