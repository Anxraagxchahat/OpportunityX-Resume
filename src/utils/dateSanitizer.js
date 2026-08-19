import { emptyResumeSchema } from '../data/sampleResume';

/**
 * Helper function to sanitize raw or malformed date strings
 */
export const cleanDateString = (str) => {
  if (!str || typeof str !== 'string') return '';
  const trimmed = str.trim();
  if (!trimmed) return '';

  // If it's a huge string of repeated numbers like "44524242424242424", extract year/month or clean it
  if (/^\d{8,}$/.test(trimmed)) {
    const yearMatch = trimmed.match(/(19|20)\d{2}/);
    if (yearMatch) return yearMatch[0];
    return '';
  }

  // If it matches standard Present/Current keywords
  if (/^(present|current|till date|now|today|ongoing)$/i.test(trimmed)) {
    return 'Present';
  }

  return trimmed;
};

/**
 * One-time hydration function run on import / load to parse initial fields and remove stale fallbacks
 */
export const hydrateAndNormalizeResume = (resume) => {
  if (!resume || typeof resume !== 'object') return resume;

  const fixArray = (arr, prefix) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item, idx) => {
      if (typeof item === 'string') {
        return { id: `${prefix}-${idx}-${Date.now()}`, name: item, title: item };
      }
      if (typeof item === 'object' && item !== null) {
        const itemCopy = { ...item };
        if (!itemCopy.id) {
          itemCopy.id = `${prefix}-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        }

        // Normalize Experience items
        if (prefix === 'exp') {
          itemCopy.role = itemCopy.role || itemCopy.title || itemCopy.jobTitle || '';
          itemCopy.title = itemCopy.role;
          itemCopy.company = itemCopy.company || itemCopy.organization || itemCopy.employer || '';
          itemCopy.location = itemCopy.location || '';

          const periodRaw = itemCopy.period || '';
          delete itemCopy.period; // Delete stale period property so runtime editing never re-parses it!

          let sDate = cleanDateString(itemCopy.startDate || itemCopy.start_date || '');
          let eDate = cleanDateString(itemCopy.endDate || itemCopy.end_date || '');
          delete itemCopy.start_date;
          delete itemCopy.end_date;

          const isCurrentMentioned =
            itemCopy.current === true ||
            itemCopy.isCurrent === true ||
            /present|current|till date|now|ongoing/i.test(periodRaw) ||
            /present|current|till date|now|ongoing/i.test(eDate);

          if (periodRaw && (!sDate || (!eDate && !isCurrentMentioned))) {
            const parts = periodRaw.split(/\s*[-–—]| to \s*/i);
            if (parts.length >= 2) {
              if (!sDate) sDate = cleanDateString(parts[0]);
              if (!eDate) eDate = cleanDateString(parts.slice(1).join(' - '));
            } else if (!sDate) {
              sDate = cleanDateString(periodRaw);
            }
          }

          const finalIsCurrent = isCurrentMentioned || eDate === 'Present' || /present|current/i.test(eDate);
          itemCopy.startDate = sDate;
          itemCopy.endDate = finalIsCurrent ? (eDate && !/present|current/i.test(eDate) ? eDate : 'Present') : eDate;
          itemCopy.current = finalIsCurrent;

          if (typeof itemCopy.description === 'string' && itemCopy.description && (!itemCopy.bullets || itemCopy.bullets.length === 0)) {
            const splitLines = itemCopy.description.split(/\r?\n/).map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
            itemCopy.bullets = splitLines.length > 0 ? splitLines : [itemCopy.description.trim()];
          }
          if (!Array.isArray(itemCopy.bullets)) {
            itemCopy.bullets = [];
          }
        }

        // Normalize Education items
        if (prefix === 'edu') {
          itemCopy.institution = itemCopy.institution || itemCopy.school || itemCopy.university || itemCopy.college || '';
          itemCopy.degree = itemCopy.degree || itemCopy.major || itemCopy.fieldOfStudy || '';
          itemCopy.location = itemCopy.location || '';

          const periodRaw = itemCopy.period || '';
          delete itemCopy.period;

          let sDate = cleanDateString(itemCopy.startDate || itemCopy.start_date || '');
          let eDate = cleanDateString(itemCopy.endDate || itemCopy.end_date || itemCopy.year || '');
          delete itemCopy.start_date;
          delete itemCopy.end_date;

          const isCurrentMentioned =
            itemCopy.current === true ||
            itemCopy.isCurrent === true ||
            /present|current|till date|now|ongoing/i.test(periodRaw) ||
            /present|current|till date|now|ongoing/i.test(eDate);

          if (periodRaw && (!sDate || (!eDate && !isCurrentMentioned))) {
            const parts = periodRaw.split(/\s*[-–—]| to \s*/i);
            if (parts.length >= 2) {
              if (!sDate) sDate = cleanDateString(parts[0]);
              if (!eDate) eDate = cleanDateString(parts.slice(1).join(' - '));
            } else if (!sDate) {
              sDate = cleanDateString(periodRaw);
            }
          }

          const finalIsCurrent = isCurrentMentioned || eDate === 'Present' || /present|current/i.test(eDate);
          itemCopy.startDate = sDate;
          itemCopy.endDate = finalIsCurrent ? (eDate && !/present|current/i.test(eDate) ? eDate : 'Present') : eDate;
          itemCopy.current = finalIsCurrent;
        }

        // Normalize Project items
        if (prefix === 'proj') {
          itemCopy.title = itemCopy.title || itemCopy.name || itemCopy.projectName || '';
          itemCopy.description = itemCopy.description || '';
          itemCopy.liveUrl = itemCopy.liveUrl || itemCopy.link || itemCopy.url || '';
          itemCopy.githubUrl = itemCopy.githubUrl || itemCopy.github || '';
          itemCopy.techStack = Array.isArray(itemCopy.techStack) ? itemCopy.techStack : typeof itemCopy.techStack === 'string' ? itemCopy.techStack.split(',').map((s) => s.trim()).filter(Boolean) : [];
          if (typeof itemCopy.description === 'string' && itemCopy.description && (!itemCopy.bullets || itemCopy.bullets.length === 0)) {
            const splitLines = itemCopy.description.split(/\r?\n/).map((l) => l.replace(/^[-•*]\s*/, '').trim()).filter(Boolean);
            itemCopy.bullets = splitLines.length > 0 ? splitLines : [itemCopy.description.trim()];
          }
          if (!Array.isArray(itemCopy.bullets)) {
            itemCopy.bullets = [];
          }
        }

        // Normalize Certificates items
        if (prefix === 'cert') {
          itemCopy.title = itemCopy.title || itemCopy.name || '';
          itemCopy.issuer = itemCopy.issuer || itemCopy.organization || itemCopy.authority || '';
          itemCopy.date = cleanDateString(itemCopy.date || itemCopy.issueDate || '');
          itemCopy.link = itemCopy.link || itemCopy.url || '';
        }

        // Normalize Achievements items
        if (prefix === 'ach') {
          itemCopy.title = itemCopy.title || itemCopy.name || '';
          itemCopy.issuer = itemCopy.issuer || itemCopy.organization || '';
          itemCopy.date = cleanDateString(itemCopy.date || '');
          itemCopy.description = itemCopy.description || '';
        }

        // Normalize Languages items
        if (prefix === 'lang') {
          itemCopy.name = itemCopy.name || itemCopy.language || '';
          itemCopy.proficiency = itemCopy.proficiency || itemCopy.level || 'Fluent';
        }

        // Normalize Custom Sections items
        if (prefix === 'cust') {
          itemCopy.heading = itemCopy.heading || itemCopy.title || 'Custom Section';
          itemCopy.content = itemCopy.content || '';
          itemCopy.bullets = Array.isArray(itemCopy.bullets) ? itemCopy.bullets : [];
        }

        return itemCopy;
      }
      return item;
    });
  };

  return {
    ...resume,
    metadata: {
      ...emptyResumeSchema.metadata,
      ...(resume.metadata || {}),
      template: resume.metadata?.template || 'modern',
      font: resume.metadata?.font || 'Inter',
      accentColor: resume.metadata?.accentColor || '#F97316'
    },
    personal: {
      ...emptyResumeSchema.personal,
      ...(resume.personal || {}),
      jobTitle: resume.personal?.jobTitle || resume.personal?.targetRole || '',
      targetRole: resume.personal?.targetRole || resume.personal?.jobTitle || ''
    },
    socialLinks: {
      ...emptyResumeSchema.socialLinks,
      ...(resume.socialLinks || {})
    },
    assets: {
      ...(emptyResumeSchema.assets || {}),
      ...(resume.assets || {})
    },
    style: {
      ...(emptyResumeSchema.style || {}),
      ...(resume.style || {})
    },
    skills: {
      languages: Array.isArray(resume.skills?.languages) ? resume.skills.languages : [],
      frameworks: Array.isArray(resume.skills?.frameworks) ? resume.skills.frameworks : [],
      tools: Array.isArray(resume.skills?.tools) ? resume.skills.tools : []
    },
    education: fixArray(resume.education, 'edu'),
    experience: fixArray(resume.experience, 'exp'),
    projects: fixArray(resume.projects, 'proj'),
    certificates: fixArray(resume.certificates, 'cert'),
    achievements: fixArray(resume.achievements, 'ach'),
    languages: fixArray(resume.languages, 'lang'),
    customSections: fixArray(resume.customSections, 'cust')
  };
};

export const ensureResumeItemIds = (resume) => {
  if (!resume || typeof resume !== 'object') return resume;

  const fixArray = (arr, prefix) => {
    if (!Array.isArray(arr)) return [];
    return arr.map((item, idx) => {
      if (typeof item === 'object' && item !== null) {
        const itemCopy = { ...item };
        if (!itemCopy.id) {
          itemCopy.id = `${prefix}-${Date.now()}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
        }
        if ((prefix === 'exp' || prefix === 'proj') && !Array.isArray(itemCopy.bullets)) {
          itemCopy.bullets = [];
        }
        return itemCopy;
      }
      return item;
    });
  };

  return {
    ...resume,
    education: fixArray(resume.education, 'edu'),
    experience: fixArray(resume.experience, 'exp'),
    projects: fixArray(resume.projects, 'proj'),
    certificates: fixArray(resume.certificates, 'cert'),
    achievements: fixArray(resume.achievements, 'ach'),
    languages: fixArray(resume.languages, 'lang'),
    customSections: fixArray(resume.customSections, 'cust')
  };
};
