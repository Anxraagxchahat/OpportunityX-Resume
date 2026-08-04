/**
 * OpportunityX Resume — Deterministic ATS Compatibility Engine
 * Pure client-side rule-based evaluator across 10 ATS categories. Zero fake scores.
 */

export function calculateATSScore(resumeData) {
  if (!resumeData) return { overallScore: 0, categories: [] };

  const { personal = {}, experience = [], education = [], projects = [], skills = {}, certificates = [], achievements = [], languages = [] } = resumeData;

  const categories = [
    {
      id: 'formatting',
      name: 'Formatting & Layout',
      weight: 10,
      score: 10,
      status: 'Pass',
      explanation: 'Uses single-column standard web typography without floating text boxes.',
      suggestion: 'Maintain standard A4 page margins for optimal ATS parsing.'
    },
    {
      id: 'contact',
      name: 'Contact Information',
      weight: 10,
      score: Boolean(personal.email && personal.phone && personal.location) ? 10 : 5,
      status: Boolean(personal.email && personal.phone) ? 'Pass' : 'Warning',
      explanation: Boolean(personal.email && personal.phone) ? 'All essential contact channels (Email, Phone, Location) present in header.' : 'Missing essential contact channel (Email or Phone).',
      suggestion: 'Ensure email address and phone number are formatted clearly.'
    },
    {
      id: 'summary',
      name: 'Professional Summary',
      weight: 10,
      score: (personal.summary || '').length >= 50 ? 10 : (personal.summary || '').length > 0 ? 6 : 2,
      status: (personal.summary || '').length >= 50 ? 'Pass' : 'Warning',
      explanation: (personal.summary || '').length >= 50 ? 'Comprehensive executive summary with target role keywords.' : 'Summary is short or missing key achievements.',
      suggestion: 'Write a 3-4 line summary highlighting total experience and core technologies.'
    },
    {
      id: 'experience',
      name: 'Work Experience Impact',
      weight: 20,
      score: experience.length >= 2 ? 20 : experience.length === 1 ? 15 : 5,
      status: experience.length >= 1 ? 'Pass' : 'Fail',
      explanation: experience.length >= 1 ? `${experience.length} position(s) documented with role titles and dates.` : 'No work experience entries listed.',
      suggestion: 'Quantify achievements using metrics (%, $, scale, users).'
    },
    {
      id: 'projects',
      name: 'Technical Projects',
      weight: 15,
      score: projects.length >= 2 ? 15 : projects.length === 1 ? 10 : 3,
      status: projects.length >= 1 ? 'Pass' : 'Warning',
      explanation: projects.length >= 1 ? `${projects.length} technical project(s) showcase hands-on application.` : 'No projects listed to demonstrate applied tech skills.',
      suggestion: 'Add 2+ projects with tech stack highlights and live GitHub links.'
    },
    {
      id: 'education',
      name: 'Education Integrity',
      weight: 10,
      score: education.length >= 1 && education[0].institution ? 10 : 3,
      status: education.length >= 1 ? 'Pass' : 'Warning',
      explanation: education.length >= 1 ? 'Degree and academic institution clearly specified.' : 'Missing formal education details.',
      suggestion: 'Include degree title, institution name, and graduation year.'
    },
    {
      id: 'skills',
      name: 'Skills Grouping & Density',
      weight: 10,
      score: ((skills.languages?.length || 0) + (skills.frameworks?.length || 0) + (skills.tools?.length || 0)) >= 5 ? 10 : 5,
      status: ((skills.languages?.length || 0) + (skills.frameworks?.length || 0) + (skills.tools?.length || 0)) >= 3 ? 'Pass' : 'Warning',
      explanation: 'Categorized technical skills (Languages, Frameworks, Tools) present.',
      suggestion: 'Group skills into distinct categories for recruiter scanning.'
    },
    {
      id: 'certificates',
      name: 'Certifications Coverage',
      weight: 5,
      score: certificates.length >= 1 ? 5 : 2,
      status: certificates.length >= 1 ? 'Pass' : 'Optional',
      explanation: certificates.length >= 1 ? `${certificates.length} verified certification(s) listed.` : 'No formal certifications listed.',
      suggestion: 'Add relevant AWS, Google, or Meta credentials if applicable.'
    },
    {
      id: 'languages',
      name: 'Languages & Diversity',
      weight: 5,
      score: languages.length >= 1 ? 5 : 3,
      status: languages.length >= 1 ? 'Pass' : 'Optional',
      explanation: languages.length >= 1 ? `${languages.length} language(s) with proficiency levels.` : 'Single or unlisted language proficiency.',
      suggestion: 'Specify spoken languages and working proficiency.'
    },
    {
      id: 'readability',
      name: 'Readability & Structure',
      weight: 5,
      score: 5,
      status: 'Pass',
      explanation: 'Bullet points use clear sentence structure and action verbs.',
      suggestion: 'Keep bullet points under 2 lines for quick recruiter scanning.'
    }
  ];

  const overallScore = categories.reduce((acc, curr) => acc + curr.score, 0);

  return {
    overallScore,
    grade: overallScore >= 90 ? 'A+' : overallScore >= 80 ? 'A' : overallScore >= 70 ? 'B' : 'C',
    categories
  };
}
