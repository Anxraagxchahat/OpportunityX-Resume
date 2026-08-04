/**
 * OpportunityX Resume — Industry Profile Analyzer
 * Rule-based evaluation against 8 target career industries. Zero fake AI.
 */

export const INDUSTRY_PROFILES = {
  "Software Engineering": {
    requiredKeywords: ["react", "typescript", "node.js", "git", "api", "testing"],
    prioritySections: ["experience", "projects", "skills"],
    idealBulletMetrics: true
  },
  "Data Science": {
    requiredKeywords: ["python", "sql", "pandas", "machine learning", "statistics", "tableau"],
    prioritySections: ["projects", "experience", "education"],
    idealBulletMetrics: true
  },
  "AI / ML": {
    requiredKeywords: ["python", "pytorch", "tensorflow", "vector", "llm", "transformers"],
    prioritySections: ["projects", "skills", "education"],
    idealBulletMetrics: true
  },
  "Cyber Security": {
    requiredKeywords: ["network", "linux", "security", "encryption", "vulnerability", "cissp"],
    prioritySections: ["certificates", "experience", "skills"],
    idealBulletMetrics: false
  },
  "UI / UX": {
    requiredKeywords: ["figma", "prototype", "user research", "wireframes", "design system", "accessibility"],
    prioritySections: ["projects", "socialLinks", "skills"],
    idealBulletMetrics: false
  },
  "Product Management": {
    requiredKeywords: ["roadmap", "agile", "analytics", "user stories", "stakeholder", "strategy"],
    prioritySections: ["experience", "summary", "achievements"],
    idealBulletMetrics: true
  },
  "Marketing": {
    requiredKeywords: ["seo", "campaign", "analytics", "conversion", "content", "social media"],
    prioritySections: ["experience", "achievements", "summary"],
    idealBulletMetrics: true
  },
  "Finance": {
    requiredKeywords: ["financial modeling", "excel", "valuation", "accounting", "compliance", "analysis"],
    prioritySections: ["education", "experience", "certificates"],
    idealBulletMetrics: true
  }
};

export function analyzeIndustryFit(resumeData, selectedIndustry = "Software Engineering") {
  if (!resumeData) return null;

  const profile = INDUSTRY_PROFILES[selectedIndustry] || INDUSTRY_PROFILES["Software Engineering"];
  const jsonStr = JSON.stringify(resumeData).toLowerCase();

  // Match required keywords
  const matchedKeywords = profile.requiredKeywords.filter((kw) => jsonStr.includes(kw));
  const missingKeywords = profile.requiredKeywords.filter((kw) => !jsonStr.includes(kw));

  const strengths = [];
  const weaknesses = [];

  if (matchedKeywords.length >= 4) {
    strengths.push(`Contains core ${selectedIndustry} keywords: (${matchedKeywords.join(', ')})`);
  } else {
    weaknesses.push(`Missing essential ${selectedIndustry} terms: (${missingKeywords.join(', ')})`);
  }

  if (resumeData.experience?.length >= 2) {
    strengths.push(`Strong work experience history (${resumeData.experience.length} entries)`);
  } else {
    weaknesses.push(`Low experience entry count (${resumeData.experience?.length || 0} entry)`);
  }

  if (resumeData.projects?.length >= 2) {
    strengths.push(`Demonstrates hands-on project portfolio`);
  }

  const keywordMatchPct = Math.round((matchedKeywords.length / profile.requiredKeywords.length) * 100);
  const readinessPct = Math.min(100, Math.round(keywordMatchPct * 0.6 + (resumeData.experience?.length ? 30 : 10) + (resumeData.projects?.length ? 10 : 0)));

  return {
    industry: selectedIndustry,
    readinessPct,
    matchedKeywords,
    missingKeywords,
    strengths,
    weaknesses
  };
}
