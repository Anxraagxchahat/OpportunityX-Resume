import { apiService } from '../api';

/**
 * AI Enhancement Service for GitHub Import
 * 
 * Functions:
 * 1. enhanceProjectsWithAI — Generates ATS action-oriented bullet points from GitHub repo details.
 * 2. generateSummaryFromGitHub — Generates a professional summary suggestion based on profile bio & GitHub repos.
 * 
 * Rules:
 * - Does NOT invent ungrounded data.
 * - Enhances existing fetched repository and profile context.
 */

const IS_DEV = import.meta.env.DEV;

export async function enhanceProjectsWithAI(projects = []) {
  if (!Array.isArray(projects) || projects.length === 0) return projects;

  const activeApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const prompt = `You are an expert ATS Resume Writer.
Analyze these GitHub project repositories and generate 2 crisp, high-impact bullet points for each project.
Use strong action verbs (e.g. Architected, Implemented, Engineered, Developed, Built) and mention the primary tech stack where appropriate.

Projects to enhance:
${JSON.stringify(projects.map(p => ({
  title: p.title || p.name,
  description: p.description,
  language: p.language,
  topics: p.topics,
  stars: p.stars
})), null, 2)}

Return STRICT JSON ONLY in this format:
[
  {
    "title": "Project Title",
    "bullets": ["Action verb bullet 1", "Action verb bullet 2"]
  }
]`;

  try {
    let rawResult = '';

    if (activeApiKey) {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeApiKey}`,
          'HTTP-Referer': 'https://resume.opportunityx.co.in',
          'X-Title': 'OpportunityX GitHub AI Enhancer'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are an ATS resume bullet writer. Return valid JSON only.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.2,
          max_tokens: 2000
        })
      });

      if (response.ok) {
        const resData = await response.json();
        rawResult = resData.choices?.[0]?.message?.content || '';
      }
    }

    if (!rawResult) {
      const apiRes = await apiService.generateAI('project_bullets', prompt, '');
      rawResult = apiRes.result || apiRes.content || '';
    }

    if (rawResult) {
      const jsonStr = rawResult.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(jsonStr);

      if (Array.isArray(parsed)) {
        return projects.map(p => {
          const match = parsed.find(item => item.title?.toLowerCase() === (p.title || p.name)?.toLowerCase());
          return {
            ...p,
            bullets: (match && Array.isArray(match.bullets) && match.bullets.length > 0)
              ? match.bullets
              : (p.description ? [p.description] : [])
          };
        });
      }
    }
  } catch (err) {
    if (IS_DEV) console.warn('[AI GitHub Enhancer] Bullet enhancement fallback used:', err);
  }

  // Fallback if AI unavailable or fails
  return projects.map(p => ({
    ...p,
    bullets: p.bullets || (p.description ? [p.description] : [])
  }));
}

export async function generateSummaryFromGitHub(profile, topTech = [], topRepos = []) {
  if (!profile) return '';

  const activeApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;

  const context = {
    name: profile.name,
    bio: profile.bio,
    company: profile.company,
    topTechnologies: topTech.slice(0, 8),
    featuredProjects: topRepos.slice(0, 4).map(r => r.title || r.name)
  };

  const prompt = `Write a 3-sentence professional summary for a software developer's resume based on this GitHub profile data:
${JSON.stringify(context, null, 2)}

Requirements:
- First sentence: Highlight target role & experience with core technologies.
- Second sentence: Mention key achievements, project impact, or domain specialization.
- Third sentence: Enthusiastic closing statement about engineering goals.
- Do NOT use buzzwords. Be concise and professional. Return raw summary text only with no quotes or labels.`;

  try {
    if (activeApiKey) {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${activeApiKey}`,
          'HTTP-Referer': 'https://resume.opportunityx.co.in',
          'X-Title': 'OpportunityX GitHub Summary AI'
        },
        body: JSON.stringify({
          model: 'google/gemini-2.5-flash',
          messages: [
            { role: 'system', content: 'You are an executive resume writer.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.3,
          max_tokens: 400
        })
      });

      if (response.ok) {
        const resData = await response.json();
        const summaryText = resData.choices?.[0]?.message?.content?.trim();
        if (summaryText) return summaryText;
      }
    }
  } catch (err) {
    if (IS_DEV) console.warn('[AI GitHub Enhancer] Summary generation fallback used:', err);
  }

  // Fallback heuristic summary
  const techStr = topTech.slice(0, 5).join(', ');
  return profile.bio
    ? `${profile.bio}. Passionate software developer skilled in ${techStr || 'modern web technologies'}.`
    : `Software Developer with expertise in ${techStr || 'software engineering and open-source development'}. Built multiple public repositories showcasing clean code and practical problem solving.`;
}
