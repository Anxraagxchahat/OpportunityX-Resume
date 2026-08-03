/**
 * OpportunityX Resume — Local Resume Health Calculator
 * Evaluates completion % and missing sections pure client-side. No AI/ATS needed.
 */

export function calculateResumeHealth(resumeData) {
  if (!resumeData) {
    return {
      percentage: 0,
      completedCount: 0,
      totalCount: 10,
      completedSections: [],
      missingSections: [
        'Personal Info',
        'Professional Summary',
        'Work Experience',
        'Education',
        'Projects',
        'Skills',
        'Certificates',
        'Achievements',
        'Languages',
        'Social Links'
      ],
      healthStatus: 'Incomplete',
      badgeColor: 'text-red-400 bg-red-500/10 border-red-500/30'
    };
  }

  const { personal, experience, education, projects, skills, certificates, achievements, languages, socialLinks } = resumeData;

  const sectionsEval = [
    {
      id: 'personal',
      name: 'Personal Info',
      isComplete: Boolean(personal?.fullName?.trim() && personal?.email?.trim() && personal?.phone?.trim()),
      weight: 15
    },
    {
      id: 'summary',
      name: 'Professional Summary',
      isComplete: Boolean(personal?.summary?.trim() && personal.summary.trim().length >= 20),
      weight: 10
    },
    {
      id: 'experience',
      name: 'Work Experience',
      isComplete: Array.isArray(experience) && experience.length > 0 && Boolean(experience[0]?.role?.trim() && experience[0]?.company?.trim()),
      weight: 20
    },
    {
      id: 'education',
      name: 'Education',
      isComplete: Array.isArray(education) && education.length > 0 && Boolean(education[0]?.institution?.trim() && education[0]?.degree?.trim()),
      weight: 15
    },
    {
      id: 'projects',
      name: 'Projects',
      isComplete: Array.isArray(projects) && projects.length > 0 && Boolean(projects[0]?.name?.trim()),
      weight: 15
    },
    {
      id: 'skills',
      name: 'Skills',
      isComplete: Boolean(
        (skills?.languages?.length || 0) + (skills?.frameworks?.length || 0) + (skills?.tools?.length || 0) >= 3
      ),
      weight: 10
    },
    {
      id: 'certificates',
      name: 'Certificates',
      isComplete: Array.isArray(certificates) && certificates.length > 0 && Boolean(certificates[0]?.name?.trim()),
      weight: 5
    },
    {
      id: 'achievements',
      name: 'Achievements',
      isComplete: Array.isArray(achievements) && achievements.length > 0 && Boolean(achievements[0]?.title?.trim()),
      weight: 4
    },
    {
      id: 'languages',
      name: 'Languages',
      isComplete: Array.isArray(languages) && languages.length > 0 && Boolean(languages[0]?.name?.trim()),
      weight: 3
    },
    {
      id: 'socialLinks',
      name: 'Social Links',
      isComplete: Boolean(personal?.github?.trim() || personal?.linkedin?.trim() || personal?.website?.trim()),
      weight: 3
    }
  ];

  const completedSections = sectionsEval.filter((s) => s.isComplete).map((s) => s.name);
  const missingSections = sectionsEval.filter((s) => !s.isComplete).map((s) => s.name);
  const completedCount = completedSections.length;
  const totalCount = sectionsEval.length;

  const percentage = Math.min(
    100,
    sectionsEval.reduce((acc, curr) => (curr.isComplete ? acc + curr.weight : acc), 0)
  );

  let healthStatus = 'Incomplete';
  let badgeColor = 'text-red-400 bg-red-500/10 border-red-500/30';

  if (percentage >= 85) {
    healthStatus = 'Excellent';
    badgeColor = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  } else if (percentage >= 60) {
    healthStatus = 'Good';
    badgeColor = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
  } else if (percentage >= 35) {
    healthStatus = 'Needs Attention';
    badgeColor = 'text-orange-400 bg-orange-500/10 border-orange-500/30';
  }

  return {
    percentage,
    completedCount,
    totalCount,
    completedSections,
    missingSections,
    healthStatus,
    badgeColor
  };
}
