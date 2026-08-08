import { apiService } from '../api';

/**
 * OpportunityX Resume — Production AI Resume Extraction Engine
 * Connects to OpenRouter / LLM infrastructure to convert cleaned resume text into strict candidate JSON.
 */

const RESUME_EXTRACTION_SYSTEM_PROMPT = `You are the OpportunityX Production Resume Extraction AI Engine.
Your sole task is to analyze the provided resume text and extract all candidate information into a STRICT JSON object.

Target JSON Schema Structure:
{
  "personal": {
    "fullName": "Candidate Full Name",
    "name": "Candidate Full Name",
    "jobTitle": "Target or Current Job Title",
    "email": "candidate.email@domain.com",
    "phone": "+1 555-019-2834",
    "location": "City, State, Country",
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username",
    "website": "https://portfolio.dev",
    "summary": "Professional overview paragraph"
  },
  "education": [
    {
      "degree": "Degree / Qualification Name",
      "institution": "University / College Name",
      "location": "City, State",
      "period": "Start Year - End Year",
      "gpa": "CGPA or Percentage"
    }
  ],
  "experience": [
    {
      "role": "Job Title / Role",
      "company": "Company Name",
      "location": "Location / Remote",
      "period": "Start Date - End Date",
      "bullets": ["Key accomplishment or responsibility bullet"]
    }
  ],
  "projects": [
    {
      "title": "Project Name",
      "description": "Brief description of what was built",
      "technologies": ["Technology 1", "Technology 2"],
      "link": "Project URL or GitHub Link"
    }
  ],
  "skills": [
    {
      "category": "Technical & Core Skills",
      "items": ["Skill 1", "Skill 2"]
    }
  ],
  "certifications": [
    {
      "name": "Certification Name",
      "issuer": "Issuing Organization",
      "date": "Year or Date"
    }
  ],
  "languages": ["Language 1", "Language 2"]
}

STRICT INSTRUCTIONS:
1. Return STRICT VALID JSON ONLY. Do NOT wrap output in markdown fences (\`\`\`json). No explanation, no prefix, no postfix.
2. Ignore all PDF metadata, version tags (%PDF-1.4), page numbers, headers, footers, and encoding noise.
3. NEVER generate fake data. If a field (e.g. phone, github, or website) is absent from the resume text, return empty string "".
4. Understand Indian resumes, ATS formats, freshers, students, and senior professionals.
5. Provide both "fullName" and "name" fields with the same value.`;

const IS_DEV = import.meta.env.DEV;

export async function extractResumeWithAI(cleanedText, apiKey = null) {
  if (!cleanedText || cleanedText.trim().length < 20) {
    return { success: false, error: 'Resume text is empty or unreadable.' };
  }

  const activeApiKey = apiKey || import.meta.env.VITE_OPENROUTER_API_KEY;

  if (IS_DEV) {
    console.log('[AI Parser] Starting extraction', {
      textLength: cleanedText.length,
      hasApiKey: !!activeApiKey,
      textPreview: cleanedText.slice(0, 200)
    });
  }

  // Try AI Extraction with 1 Automatic Retry
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      let rawJsonText = '';
      let responseStatus = '';

      // Direct OpenRouter REST Call
      if (activeApiKey) {
        if (IS_DEV) console.log(`[AI Parser] Attempt ${attempt}: Calling OpenRouter (google/gemini-2.5-flash)...`);

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${activeApiKey}`,
            'HTTP-Referer': 'https://resume.opportunityx.co.in',
            'X-Title': 'OpportunityX Resume Parser'
          },
          body: JSON.stringify({
            model: 'google/gemini-2.5-flash',
            messages: [
              { role: 'system', content: RESUME_EXTRACTION_SYSTEM_PROMPT },
              { role: 'user', content: `Extract candidate JSON from this resume text:\n\n${cleanedText.slice(0, 12000)}` }
            ],
            temperature: 0.1,
            max_tokens: 4000
          })
        });

        responseStatus = `HTTP ${response.status}`;

        if (response.ok) {
          const resData = await response.json();
          rawJsonText = resData.choices?.[0]?.message?.content || '';

          if (IS_DEV) {
            console.log(`[AI Parser] Response received`, {
              status: responseStatus,
              rawLength: rawJsonText.length,
              rawPreview: rawJsonText.slice(0, 300),
              usage: resData.usage
            });
          }
        } else {
          const errBody = await response.text();
          if (IS_DEV) console.warn(`[AI Parser] OpenRouter error:`, responseStatus, errBody.slice(0, 500));
        }
      }

      // Fallback to Backend AI Service if direct call not active
      if (!rawJsonText) {
        if (IS_DEV) console.log(`[AI Parser] Attempt ${attempt}: Trying backend API fallback...`);
        try {
          const apiRes = await apiService.generateAI('resume_parse', RESUME_EXTRACTION_SYSTEM_PROMPT, cleanedText.slice(0, 12000));
          rawJsonText = apiRes.result || apiRes.content || '';
        } catch (backendErr) {
          if (IS_DEV) console.warn(`[AI Parser] Backend fallback also failed:`, backendErr.message);
        }
      }

      if (rawJsonText) {
        // Clean JSON response (strip markdown fences if model included them)
        let jsonStr = rawJsonText
          .replace(/```json\s*/gi, '')
          .replace(/```\s*/g, '')
          .trim();

        // Also handle cases where model prefixes with text
        const jsonStart = jsonStr.indexOf('{');
        const jsonEnd = jsonStr.lastIndexOf('}');
        if (jsonStart !== -1 && jsonEnd !== -1 && jsonStart < jsonEnd) {
          jsonStr = jsonStr.slice(jsonStart, jsonEnd + 1);
        }

        try {
          const parsedJson = JSON.parse(jsonStr);
          if (parsedJson && (parsedJson.personal || parsedJson.experience || parsedJson.education)) {
            if (IS_DEV) {
              console.log(`[AI Parser] ✅ Successfully parsed JSON`, {
                keys: Object.keys(parsedJson),
                personalName: parsedJson.personal?.fullName || parsedJson.personal?.name || '(none)',
                experienceCount: parsedJson.experience?.length || 0,
                educationCount: parsedJson.education?.length || 0
              });
            }
            return { success: true, data: parsedJson, rawResponse: rawJsonText };
          }
        } catch (parseErr) {
          if (IS_DEV) {
            console.error(`[AI Parser] ❌ JSON parse error:`, parseErr.message);
            console.error(`[AI Parser] Raw response that failed to parse:`, jsonStr.slice(0, 500));
          }
        }
      }
    } catch (e) {
      if (IS_DEV) console.warn(`[AI Parser] Attempt ${attempt} exception:`, e.message);
    }
  }

  return {
    success: false,
    error: "AI extraction failed after 2 attempts. Please check your API key or try again."
  };
}
