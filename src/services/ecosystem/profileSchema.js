/**
 * OpportunityX Resume — Universal Profile Schema
 * Shared profile schema read by all OpportunityX ecosystem products.
 */

export const universalProfileSchema = {
  oxId: 'OX-USER-2026-X89A2F1D',
  personalInformation: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    github: '',
    linkedin: '',
    website: '',
    summary: ''
  },
  skills: {
    languages: [],
    frameworks: [],
    tools: []
  },
  projects: [],
  experience: [],
  education: [],
  certificates: [],
  achievements: [],
  socialLinks: {},
  preferences: {
    visibility: 'Public',
    defaultTheme: 'dark',
    autoSync: true
  }
};

export function exportUniversalProfile(resumeData, oxId) {
  if (!resumeData) return universalProfileSchema;

  return {
    oxId: oxId || 'OX-USER-2026-X89A2F1D',
    personalInformation: resumeData.personal || {},
    skills: resumeData.skills || {},
    projects: resumeData.projects || [],
    experience: resumeData.experience || [],
    education: resumeData.education || [],
    certificates: resumeData.certificates || [],
    achievements: resumeData.achievements || [],
    socialLinks: { github: resumeData.personal?.github, linkedin: resumeData.personal?.linkedin },
    exportedAt: new Date().toISOString()
  };
}
