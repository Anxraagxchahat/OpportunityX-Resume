/**
 * OpportunityX Resume — Resume Readiness Levels Evaluator
 * Evaluates readiness badges (Internship, Campus Placement, Entry-Level, Professional, International).
 */

export function evaluateReadinessLevels(resumeData, atsScore = 85, healthScore = 80) {
  if (!resumeData) return [];

  const { personal = {}, experience = [], education = [], projects = [], skills = {} } = resumeData;
  const totalSkills = (skills.languages?.length || 0) + (skills.frameworks?.length || 0) + (skills.tools?.length || 0);

  const badges = [
    {
      id: 'internship',
      title: 'Internship Ready',
      achieved: Boolean(education.length > 0 && (projects.length > 0 || experience.length > 0)),
      reason: 'Contains formal education entries and at least 1 project or internship.'
    },
    {
      id: 'campus',
      title: 'Campus Placement Ready',
      achieved: Boolean(education.length > 0 && projects.length >= 2 && totalSkills >= 4),
      reason: 'Includes 2+ hands-on technical projects and categorized technical skills.'
    },
    {
      id: 'entry',
      title: 'Entry-Level Ready',
      achieved: Boolean(healthScore >= 75 && (experience.length > 0 || projects.length >= 2)),
      reason: 'Achieved 75%+ Resume Health with clear technical project or work experience.'
    },
    {
      id: 'professional',
      title: 'Professional Ready',
      achieved: Boolean(atsScore >= 85 && experience.length >= 2 && totalSkills >= 6),
      reason: 'High ATS pass score (85%+) with multiple documented positions and rich skills.'
    },
    {
      id: 'international',
      title: 'International Applicant Ready',
      achieved: Boolean(personal.email && personal.phone && personal.linkedin && atsScore >= 88),
      reason: 'Complete global contact details, clean single-column ATS layout, and top pass score.'
    }
  ];

  return badges;
}
