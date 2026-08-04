/**
 * OpportunityX Resume — Keyword Intelligence Engine
 * Extracts action verbs, technical terms, soft skills, and computes keyword density.
 */

export const ACTION_VERBS = [
  "architected", "engineered", "pioneered", "optimized", "scaled",
  "integrated", "spearheaded", "accelerated", "deployed", "refactored",
  "instituted", "mentored", "co-authored", "built", "implemented",
  "designed", "reduced", "increased", "developed", "created"
];

export const HIGH_IMPACT_TECH = [
  "TypeScript", "React", "Node.js", "Python", "Docker", "AWS", "GraphQL",
  "PostgreSQL", "Redis", "Microservices", "REST APIs", "CI/CD", "Git"
];

export function analyzeKeywords(resumeData) {
  if (!resumeData) return { verbsUsed: [], techFound: [], missingHighImpact: [], densityMap: {} };

  const jsonStr = JSON.stringify(resumeData).toLowerCase();

  // Find Action Verbs Used
  const verbsUsed = ACTION_VERBS.filter((verb) => jsonStr.includes(verb));

  // Find Tech Stack Keywords Found
  const techFound = HIGH_IMPACT_TECH.filter((tech) => jsonStr.includes(tech.toLowerCase()));

  // Find Missing High Impact Keywords
  const missingHighImpact = HIGH_IMPACT_TECH.filter((tech) => !jsonStr.includes(tech.toLowerCase()));

  // Keyword Density calculation
  const words = jsonStr.replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3);
  const totalWords = words.length || 1;

  const frequencyMap = {};
  words.forEach((w) => {
    frequencyMap[w] = (frequencyMap[w] || 0) + 1;
  });

  // Top 8 dense words
  const sortedDensity = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([word, count]) => ({
      word,
      count,
      densityPct: ((count / totalWords) * 100).toFixed(1)
    }));

  return {
    verbsUsed,
    verbCount: verbsUsed.length,
    techFound,
    missingHighImpact,
    densityList: sortedDensity
  };
}
