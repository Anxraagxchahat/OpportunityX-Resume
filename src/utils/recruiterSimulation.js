/**
 * OpportunityX Resume — Recruiter 6-Second Glance Simulator
 * Deterministic recruiter scan simulation based on layout, length, and metrics.
 */

export function simulateRecruiterGlance(resumeData, atsScore = 90, healthScore = 85) {
  if (!resumeData) return null;

  const { personal = {}, experience = [], education = [], projects = [], skills = {} } = resumeData;

  // Calculate total words
  const jsonStr = JSON.stringify(resumeData);
  const wordsCount = jsonStr.split(/\s+/).length;

  const quickScanSeconds = 6;
  const fullReadSeconds = Math.max(15, Math.ceil(wordsCount / 5));

  let firstImpression = 'Solid Tech Applicant';
  if (atsScore >= 90 && healthScore >= 85) {
    firstImpression = 'High Impact Candidate';
  } else if (atsScore < 70) {
    firstImpression = 'Needs Improvement';
  }

  // Find strongest vs weakest section
  const expCount = experience.length;
  const projCount = projects.length;
  const eduCount = education.length;

  let mostAttractiveSection = 'Work Experience';
  let weakestSection = 'Certifications';

  if (projCount > expCount) {
    mostAttractiveSection = 'Technical Projects';
    weakestSection = 'Work Experience';
  } else if (eduCount > 0 && expCount === 0) {
    mostAttractiveSection = 'Education & Honors';
    weakestSection = 'Work Experience';
  }

  const atsPrediction = atsScore >= 85 ? 'High (85%+ ATS Pass)' : atsScore >= 70 ? 'Moderate (70% Pass)' : 'Low';

  return {
    firstImpression,
    quickScanSeconds: `${quickScanSeconds} seconds`,
    fullReadSeconds: `${fullReadSeconds} seconds`,
    mostAttractiveSection,
    weakestSection,
    atsPrediction,
    readabilityRating: wordsCount > 500 ? 'Dense / High Detail' : wordsCount > 250 ? 'Optimal Readability' : 'Sparse',
    visualAppearance: 'Standard A4 Professional'
  };
}
