import { TECH_DICTIONARY, TECH_CATEGORIES } from './technologyKnowledgeBase';

/**
 * Escapes regex special characters in alias strings (e.g., C++, C#, .NET, Node.js)
 */
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Stage 1 & 2: Multi-Stage Technology Extraction Engine
 * Scans resume text, matches canonical tech dictionary entries, calculates confidence scores,
 * normalizes duplicates, and outputs categorized skills lists.
 */
export function extractTechnologiesFromText(resumeText = '', rawSkillsList = [], options = {}) {
  const { minConfidence = 'MEDIUM', includeRawSkills = true } = options;

  if (!resumeText && (!Array.isArray(rawSkillsList) || rawSkillsList.length === 0)) {
    return { categorizedSkills: [], flatSkills: [], metrics: { totalDetected: 0 } };
  }

  const textLower = (resumeText || '').toLowerCase();
  const detectedTechMap = new Map(); // canonicalName -> { canonical, category, score, mentions, confidence }

  // ── Helper: Record Technology Match ─────────────────────────────────────────
  const recordMatch = (canonical, category, weight = 10, source = 'text') => {
    if (!detectedTechMap.has(canonical)) {
      detectedTechMap.set(canonical, {
        canonical,
        category,
        score: 0,
        mentions: 0,
        sources: new Set()
      });
    }
    const item = detectedTechMap.get(canonical);
    item.score += weight;
    item.mentions += 1;
    item.sources.add(source);
  };

  // ── Stage 1: Parse Raw Skills List (Highest Weight: +50) ───────────────────
  if (includeRawSkills && Array.isArray(rawSkillsList)) {
    rawSkillsList.forEach(rawItem => {
      let itemsToProcess = [];
      if (typeof rawItem === 'string') {
        itemsToProcess = rawItem.split(/[,•|;\n]/);
      } else if (rawItem && typeof rawItem === 'object') {
        if (Array.isArray(rawItem.items)) {
          itemsToProcess = rawItem.items;
        } else if (rawItem.name) {
          itemsToProcess = [rawItem.name];
        }
      }

      itemsToProcess.forEach(str => {
        const cleanStr = String(str).trim().toLowerCase();
        if (!cleanStr) return;

        // Try exact match against dictionary aliases
        let matched = false;
        for (const entry of TECH_DICTIONARY) {
          for (const alias of entry.aliases) {
            if (cleanStr === alias.toLowerCase()) {
              recordMatch(entry.canonical, entry.category, 50, 'skills_section');
              matched = true;
              break;
            }
          }
          if (matched) break;
        }

        // If not matched, add as custom skill under 'Technical Skills'
        if (!matched && cleanStr.length > 1 && cleanStr.length < 35) {
          const capitalized = str.trim().charAt(0).toUpperCase() + str.trim().slice(1);
          recordMatch(capitalized, TECH_CATEGORIES.TOOLS, 40, 'skills_section_custom');
        }
      });
    });
  }

  // ── Stage 2: Section-Weighted Text Scanner ────────────────────────────────
  // Identify Skills Section in Text for Extra Weight
  const skillsHeaderRegex = /(?:skills|technical skills|tech stack|technologies|expertise|tools)\s*[\n:]/i;
  const skillsMatch = textLower.match(skillsHeaderRegex);
  let skillsTextChunk = '';
  if (skillsMatch && skillsMatch.index !== undefined) {
    skillsTextChunk = textLower.slice(skillsMatch.index, skillsMatch.index + 1000);
  }

  TECH_DICTIONARY.forEach(entry => {
    const { canonical, category, aliases, boundaryStrict } = entry;

    aliases.forEach(alias => {
      const escaped = escapeRegExp(alias);
      
      let regex;
      if (boundaryStrict) {
        // Strict boundary matching for single char terms like C, R, Go
        regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+.])${escaped}(?:$|[^a-zA-Z0-9_#+.])`, 'gi');
      } else {
        regex = new RegExp(`(?:^|[^a-zA-Z0-9_#+.])${escaped}(?:$|[^a-zA-Z0-9_#+.])`, 'gi');
      }

      // Check occurrences in dedicated skills text chunk (+30 score)
      if (skillsTextChunk) {
        const chunkMatches = skillsTextChunk.match(regex);
        if (chunkMatches && chunkMatches.length > 0) {
          recordMatch(canonical, category, chunkMatches.length * 30, 'skills_chunk');
        }
      }

      // Check occurrences in entire resume text (+15 score per occurrence)
      const fullMatches = textLower.match(regex);
      if (fullMatches && fullMatches.length > 0) {
        recordMatch(canonical, category, fullMatches.length * 15, 'full_text');
      }
    });
  });

  // ── Stage 3: Score Calculation & Confidence Assignment ───────────────────
  const confidenceRank = { HIGH: 3, MEDIUM: 2, LOW: 1 };
  const minRank = confidenceRank[minConfidence] || 2;

  const processedList = [];

  detectedTechMap.forEach((data) => {
    let confidence = 'LOW';
    if (data.score >= 35 || data.sources.has('skills_section') || data.sources.has('skills_chunk')) {
      confidence = 'HIGH';
    } else if (data.score >= 15 || data.mentions >= 2) {
      confidence = 'MEDIUM';
    }

    if (confidenceRank[confidence] >= minRank) {
      processedList.push({
        name: data.canonical,
        category: data.category,
        confidence,
        score: data.score,
        mentions: data.mentions
      });
    }
  });

  // ── Stage 4: Deduplication & Categorization ────────────────────────────────
  const categoryGroupMap = new Map();

  processedList.forEach(item => {
    if (!categoryGroupMap.has(item.category)) {
      categoryGroupMap.set(item.category, new Set());
    }
    categoryGroupMap.get(item.category).add(item.name);
  });

  const categorizedSkills = [];
  categoryGroupMap.forEach((itemsSet, categoryName) => {
    categorizedSkills.push({
      category: categoryName,
      items: Array.from(itemsSet)
    });
  });

  // Sort categories logically according to TECH_CATEGORIES order
  const categoryOrder = Object.values(TECH_CATEGORIES);
  categorizedSkills.sort((a, b) => {
    const idxA = categoryOrder.indexOf(a.category);
    const idxB = categoryOrder.indexOf(b.category);
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  const flatSkills = processedList.map(p => p.name);

  return {
    categorizedSkills,
    flatSkills,
    allDetected: processedList,
    metrics: {
      totalDetected: processedList.length,
      categoryCount: categorizedSkills.length
    }
  };
}
