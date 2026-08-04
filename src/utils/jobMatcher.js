/**
 * OpportunityX Resume — Job Description Matcher Engine
 * Deterministic text matching between Job Description text and Resume JSON.
 */

export function matchJobDescription(resumeData, jobDescriptionText = '') {
  if (!resumeData || !jobDescriptionText.trim()) {
    return { matchScore: 0, matchedKeywords: [], missingKeywords: [], matchedSkills: [], missingSkills: [] };
  }

  const jdLower = jobDescriptionText.toLowerCase();
  const resumeJsonLower = JSON.stringify(resumeData).toLowerCase();

  // Extract candidate technical words from JD (words > 3 chars)
  const jdWords = Array.from(new Set(
    jdLower
      .replace(/[^a-z0-9\s#+.]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 3 && !['with', 'that', 'from', 'this', 'have', 'will', 'your', 'about', 'team', 'work'].includes(w))
  ));

  const totalJdKeywords = jdWords.length || 1;
  const matchedKeywords = jdWords.filter((w) => resumeJsonLower.includes(w));
  const missingKeywords = jdWords.filter((w) => !resumeJsonLower.includes(w)).slice(0, 10);

  // Extract skills match
  const allResumeSkills = [
    ...(resumeData.skills?.languages || []),
    ...(resumeData.skills?.frameworks || []),
    ...(resumeData.skills?.tools || [])
  ];

  const matchedSkills = allResumeSkills.filter((sk) => jdLower.includes(sk.toLowerCase()));
  const missingSkills = allResumeSkills.filter((sk) => !jdLower.includes(sk.toLowerCase()));

  const matchScore = Math.min(100, Math.round((matchedKeywords.length / totalJdKeywords) * 100));

  return {
    matchScore,
    matchedKeywordsCount: matchedKeywords.length,
    totalKeywordsCount: totalJdKeywords,
    matchedKeywords: matchedKeywords.slice(0, 12),
    missingKeywords,
    matchedSkills,
    missingSkills
  };
}
