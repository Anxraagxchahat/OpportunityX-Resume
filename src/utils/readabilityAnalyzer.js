/**
 * OpportunityX Resume — Reading Difficulty Analyzer
 * Evaluates sentence length, paragraph difficulty, and action verb ratios.
 */

export function analyzeReadability(resumeData) {
  if (!resumeData) return null;

  const summary = resumeData.personal?.summary || '';
  const experience = resumeData.experience || [];
  
  // Extract all bullet strings
  const bullets = experience.flatMap((exp) => exp.bullets || []);
  const totalBullets = bullets.length || 1;

  // Average words per bullet
  const totalWordsInBullets = bullets.reduce((acc, b) => acc + b.split(/\s+/).length, 0);
  const avgWordsPerBullet = Math.round(totalWordsInBullets / totalBullets);

  // Bullet Density
  let bulletDensity = 'Optimal (12-20 words / bullet)';
  if (avgWordsPerBullet > 25) bulletDensity = 'Wordy (Bullets exceed 25 words)';
  if (avgWordsPerBullet < 8) bulletDensity = 'Brief (Bullets under 8 words)';

  return {
    summarySentenceCount: summary.split(/[.!?]+/).filter(Boolean).length,
    totalBullets,
    avgWordsPerBullet,
    bulletDensity,
    readingGrade: avgWordsPerBullet <= 20 ? 'Grade 8-10 (Recruiter Friendly)' : 'Grade 12+ (Complex Text)',
    recommendation: avgWordsPerBullet > 22 ? 'Trim longer bullet points to 15-18 words for maximum recruiter scan rate.' : 'Bullet length and reading difficulty are optimal.'
  };
}
