import { createResumeMetadata, createEcosystemSchema, createCloudSchema, createSecuritySchema, createStyleSchema } from './metadata';
import { extractTechnologiesFromText } from '../services/ai/techExtractionEngine';

/**
 * OpportunityX Resume — Production Validation Engine & Confidence System
 * Validates LLM extracted candidate fields and calculates field-level confidence scores.
 * Rejects metadata artifacts, fake data, and corrupted values.
 */

const REJECTED_NAME_KEYWORDS = [
  'pdf', 'page 1', 'page 2', 'page 3', 'resume', 'cv', 'curriculum vitae',
  'document', 'microsoft word', 'adobe', 'untitled', 'unknown', 'candidate',
  'user', 'profile', 'file', 'endobj', 'stream'
];

/**
 * Validates raw extracted AI candidate JSON and computes confidence scores.
 */
export function validateAndScoreCandidateData(extractedJson, rawResumeText = '') {
  if (!extractedJson) {
    return createEmptyValidationResult();
  }

  const personal = extractedJson.personal || {};

  // 1. Validate & Score Full Name
  const nameVal = validateFullName(personal.fullName || personal.name);

  // 2. Validate & Score Email
  const emailVal = validateEmail(personal.email);

  // 3. Validate & Score Phone
  const phoneVal = validatePhone(personal.phone);

  // 4. Validate & Score Social Links
  const linkedin = personal.linkedin && personal.linkedin.includes('linkedin.com') ? personal.linkedin : '';
  const github = personal.github && personal.github.includes('github.com') ? personal.github : '';
  const website = personal.website || '';

  // 5. Experience List Sanitization
  const cleanExperience = sanitizeExperienceList(extractedJson.experience);

  // 6. Education List Sanitization
  const cleanEducation = sanitizeEducationList(extractedJson.education);

  // 7. Skills Sanitization (using multi-stage tech detection)
  const cleanSkills = sanitizeSkillsList(extractedJson.skills, rawResumeText);

  // 8. Projects Sanitization
  const cleanProjects = sanitizeProjectsList(extractedJson.projects);

  // Overall Confidence Score
  const overallConfidence = calculateOverallConfidence(nameVal.confidence, emailVal.confidence, phoneVal.confidence, cleanExperience.length, cleanEducation.length);

  return {
    confidence: {
      fullName: nameVal.confidence,
      email: emailVal.confidence,
      phone: phoneVal.confidence,
      overall: overallConfidence
    },
    schema: {
      metadata: {
        id: `ox-parsed-${Date.now()}`,
        uuid: `ox-parsed-${Date.now()}`,
        title: nameVal.value ? `${nameVal.value}'s Resume` : 'Imported Resume',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lastSaved: new Date().toISOString(),
        template: 'modern',
        fontFamily: 'Inter',
        accentColor: '#F97316',
        version: 1
      },
      personal: {
        fullName: nameVal.value, // Empty if low confidence or invalid
        jobTitle: personal.jobTitle || '',
        email: emailVal.value,   // Empty if low confidence or invalid
        phone: phoneVal.value,   // Empty if low confidence or invalid
        location: personal.location || '',
        website: website,
        linkedin: linkedin,
        github: github,
        summary: personal.summary || ''
      },
      experience: cleanExperience,
      education: cleanEducation,
      skills: cleanSkills,
      projects: cleanProjects,
      certifications: Array.isArray(extractedJson.certifications) ? extractedJson.certifications : [],
      languages: Array.isArray(extractedJson.languages) ? extractedJson.languages : [],
      customSections: []
    }
  };
}

function validateFullName(name = '') {
  if (!name || typeof name !== 'string') return { value: '', confidence: 'LOW' };

  const trimmed = name.trim();
  if (trimmed.length < 3 || trimmed.length > 45) return { value: '', confidence: 'LOW' };
  if (trimmed.includes('@') || /\d/.test(trimmed)) return { value: '', confidence: 'LOW' };

  const lower = trimmed.toLowerCase();
  for (const keyword of REJECTED_NAME_KEYWORDS) {
    if (lower.includes(keyword)) return { value: '', confidence: 'LOW' };
  }

  const words = trimmed.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 4) return { value: trimmed, confidence: 'MEDIUM' };

  if (words.every((w) => /^[a-zA-Z'.-]+$/.test(w))) {
    return { value: trimmed, confidence: 'HIGH' };
  }

  return { value: trimmed, confidence: 'MEDIUM' };
}

function validateEmail(email = '') {
  if (!email || typeof email !== 'string') return { value: '', confidence: 'LOW' };
  const trimmed = email.trim().toLowerCase();

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (emailRegex.test(trimmed)) {
    return { value: trimmed, confidence: 'HIGH' };
  }

  return { value: '', confidence: 'LOW' };
}

function validatePhone(phone = '') {
  if (!phone || typeof phone !== 'string') return { value: '', confidence: 'LOW' };
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length >= 10 && digitsOnly.length <= 15) {
    return { value: phone.trim(), confidence: 'HIGH' };
  }

  return { value: '', confidence: 'LOW' };
}

function sanitizeExperienceList(expList) {
  if (!Array.isArray(expList)) return [];
  return expList
    .filter((exp) => exp && (exp.role || exp.title || exp.company || exp.organization))
    .map((exp, idx) => {
      const bullets = Array.isArray(exp.bullets)
        ? exp.bullets
        : typeof exp.description === 'string' && exp.description.trim()
        ? exp.description.split(/\n|•|;/).map((b) => b.trim().replace(/^[-•*]\s*/, '')).filter(Boolean)
        : [];
      return {
        id: `exp-${Date.now()}-${idx}`,
        role: exp.role || exp.title || exp.jobTitle || '',
        title: exp.role || exp.title || exp.jobTitle || '',
        company: exp.company || exp.organization || exp.employer || '',
        location: exp.location || '',
        period: exp.period || '',
        startDate: exp.startDate || exp.start_date || '',
        endDate: exp.endDate || exp.end_date || '',
        current: Boolean(exp.current || exp.isCurrent || (exp.period && /present|current/i.test(exp.period))),
        isCurrent: Boolean(exp.current || exp.isCurrent || (exp.period && /present|current/i.test(exp.period))),
        bullets
      };
    });
}

function sanitizeEducationList(eduList) {
  if (!Array.isArray(eduList)) return [];
  return eduList
    .filter((edu) => edu && (edu.degree || edu.institution || edu.college || edu.school))
    .map((edu, idx) => ({
      id: `edu-${Date.now()}-${idx}`,
      degree: edu.degree || edu.title || edu.major || '',
      institution: edu.institution || edu.college || edu.school || edu.university || '',
      college: edu.institution || edu.college || edu.school || edu.university || '',
      location: edu.location || '',
      period: edu.period || '',
      startDate: edu.startDate || edu.start_date || '',
      endDate: edu.endDate || edu.end_date || '',
      gpa: edu.gpa || edu.cgpa || edu.grade || ''
    }));
}

function sanitizeSkillsList(skillsList, fullResumeText = '') {
  const result = extractTechnologiesFromText(fullResumeText, skillsList, { minConfidence: 'MEDIUM' });
  const categorized = result.categorizedSkills || [];

  if (categorized.length > 0) {
    return categorized.map((s, idx) => ({
      id: `cat-skill-${Date.now()}-${idx}`,
      category: s.category || 'Technical Skills',
      items: Array.isArray(s.items) ? s.items : []
    }));
  }

  if (!Array.isArray(skillsList)) return [];
  return skillsList
    .filter((s) => s && (s.category || (Array.isArray(s.items) && s.items.length > 0)))
    .map((s, idx) => ({
      id: `cat-skill-${Date.now()}-${idx}`,
      category: s.category || 'Technical Skills',
      items: Array.isArray(s.items) ? s.items : []
    }));
}

function sanitizeProjectsList(projList) {
  if (!Array.isArray(projList)) return [];
  return projList
    .filter((p) => p && (p.title || p.name))
    .map((p, idx) => ({
      id: `proj-${Date.now()}-${idx}`,
      title: p.title || p.name || '',
      name: p.title || p.name || '',
      description: p.description || '',
      technologies: Array.isArray(p.technologies)
        ? p.technologies
        : typeof p.techStack === 'string'
        ? p.techStack.split(',').map((s) => s.trim()).filter(Boolean)
        : [],
      link: p.link || p.url || p.htmlUrl || ''
    }));
}

function calculateOverallConfidence(nameConf, emailConf, phoneConf, expLen, eduLen) {
  let score = 0;
  if (nameConf === 'HIGH') score += 35;
  if (emailConf === 'HIGH') score += 35;
  if (phoneConf === 'HIGH') score += 15;
  if (expLen > 0) score += 10;
  if (eduLen > 0) score += 5;

  if (score >= 70) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

function createEmptyValidationResult() {
  return {
    confidence: { fullName: 'LOW', email: 'LOW', phone: 'LOW', overall: 'LOW' },
    schema: {
      metadata: {
        ...createResumeMetadata('Imported Resume', 'modern'),
        id: `ox-parsed-empty-${Date.now()}`,
        uuid: `ox-parsed-empty-${Date.now()}`
      },
      ecosystem: createEcosystemSchema(),
      cloud: createCloudSchema(),
      security: createSecuritySchema(),
      style: createStyleSchema(),
      assets: { profilePhoto: null, digitalSignature: null, personalLogo: null },
      personal: {
        fullName: '', jobTitle: '', email: '', phone: '',
        location: '', website: '', github: '', linkedin: '', summary: ''
      },
      experience: [],
      education: [],
      projects: [],
      skills: [],
      certificates: [],
      achievements: [],
      languages: [],
      socialLinks: { portfolio: '', github: '', linkedin: '', twitter: '' },
      customSections: []
    }
  };
}

export function parseTextWithConfidence(rawText = '', filename = '') {
  const lines = (rawText || '').split('\n').map((l) => l.trim()).filter(Boolean);

  const emailMatch = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const emailVal = validateEmail(emailMatch ? emailMatch[0] : '');

  const phoneMatch = rawText.match(/(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
  const phoneVal = validatePhone(phoneMatch ? phoneMatch[0] : '');

  let fullName = '';
  for (let i = 0; i < Math.min(8, lines.length); i++) {
    const val = validateFullName(lines[i]);
    if (val.confidence === 'HIGH') {
      fullName = val.value;
      break;
    }
  }

  return validateAndScoreCandidateData({
    personal: {
      fullName,
      email: emailVal.value,
      phone: phoneVal.value
    }
  });
}

