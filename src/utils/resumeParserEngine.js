import { extractDocumentText, PipelineLog } from './documentExtractor';
import { extractResumeWithAI } from '../services/ai/aiResumeParser';
import { validateAndScoreCandidateData } from './resumeValidationEngine';
import { parseTextWithConfidence } from './resumeValidationEngine';

/**
 * OpportunityX Production AI Resume Parser Engine
 * 
 * Pipeline:
 * PDF / DOCX / TXT / JSON
 *   ↓
 * Document Text Extraction (pdfjs-dist / XML parser / FileReader)
 *   ↓
 * Cleaning & Normalization
 *   ↓
 * AI Structured Extraction (aiResumeParser.js via OpenRouter LLM)
 *   ↓
 * Validation & Confidence Engine (resumeValidationEngine.js)
 *   ↓
 * Review Screen & Builder Mapping
 * 
 * Every step is logged to a PipelineLog for the debug panel.
 */

const IS_DEV = import.meta.env.DEV;

export async function parseResumeFile(file) {
  const log = new PipelineLog();

  if (!file) {
    log.step('File Upload', { status: 'error', reason: 'No file provided' });
    return {
      success: false,
      error: "No file was provided. Please upload a resume file.",
      _debug: IS_DEV ? { pipelineSteps: log.getSteps(), failedStep: log.getFailedStep() } : undefined
    };
  }

  // ═══ Step 1 & 2: Document Extraction & Cleaning ═══
  const extractionResult = await extractDocumentText(file, log);

  // ── JSON Direct Import ──
  if (extractionResult.format === 'json' && extractionResult.rawJson) {
    log.step('AI Extraction', { status: 'ok', note: 'Skipped — direct JSON import' });
    const validated = validateAndScoreCandidateData(extractionResult.rawJson);
    log.step('Validation', { status: 'ok', confidence: validated.confidence });
    log.step('Mapping', { status: 'ok', schemaKeys: Object.keys(validated.schema || {}) });

    return {
      success: true,
      confidence: validated.confidence,
      schema: validated.schema,
      _debug: IS_DEV ? {
        rawText: extractionResult.rawText || extractionResult.text,
        cleanedText: extractionResult.text,
        aiRawResponse: '(JSON file — direct import, no AI needed)',
        validationResult: validated.confidence,
        pipelineSteps: log.getSteps(),
        failedStep: null
      } : undefined
    };
  }

  // ── Check extracted text quality ──
  const cleanText = extractionResult.text;
  const rawText = extractionResult.rawText || cleanText;

  if (!cleanText || cleanText.trim().length < 20) {
    const reason = !cleanText
      ? 'Text extraction returned empty string'
      : `Text too short after cleaning (${cleanText.trim().length} chars, minimum 20)`;

    log.step('Text Quality Check', {
      status: 'error',
      reason,
      rawLength: rawText?.length || 0,
      cleanedLength: cleanText?.trim().length || 0,
      rawPreview: rawText?.slice(0, 300) || '(empty)'
    });

    return {
      success: false,
      error: "We couldn't read any text from your document. Please ensure the PDF is not password protected or image-only.",
      _debug: IS_DEV ? {
        rawText: rawText,
        cleanedText: cleanText,
        aiRawResponse: '(Not attempted — text extraction failed)',
        validationResult: null,
        pipelineSteps: log.getSteps(),
        failedStep: log.getFailedStep()
      } : undefined
    };
  }

  log.step('Text Quality Check', {
    status: 'ok',
    cleanedChars: cleanText.trim().length,
    preview: cleanText.slice(0, 200)
  });

  // ═══ Step 3 & 4: AI Resume Extraction via OpenRouter LLM ═══
  let aiError = null;
  try {
    const aiStartTime = Date.now();

    log.step('AI Request', {
      status: 'ok',
      model: 'google/gemini-2.5-flash',
      promptLength: cleanText.slice(0, 12000).length,
      resumeTextLength: cleanText.length,
      timestamp: new Date().toISOString(),
      executionPath: 'OpportunityX Server AI Proxy / BYOK'
    });

    const aiResult = await extractResumeWithAI(cleanText);
    const aiDuration = Date.now() - aiStartTime;

    if (aiResult.success && aiResult.data) {
      log.step('AI Response', {
        status: 'ok',
        responseTimeMs: aiDuration,
        rawResponseLength: aiResult.rawResponse?.length || 0,
        parsedKeys: Object.keys(aiResult.data),
        hasPersonal: !!aiResult.data.personal,
        hasExperience: Array.isArray(aiResult.data.experience) ? aiResult.data.experience.length : 0,
        hasEducation: Array.isArray(aiResult.data.education) ? aiResult.data.education.length : 0,
        hasSkills: Array.isArray(aiResult.data.skills) ? aiResult.data.skills.length : 0,
        hasProjects: Array.isArray(aiResult.data.projects) ? aiResult.data.projects.length : 0,
      });

      // ═══ Step 5 & 6: Validation Engine & Confidence Scoring ═══
      const validated = validateAndScoreCandidateData(aiResult.data);

      log.step('Validation', {
        status: 'ok',
        confidence: validated.confidence,
        personalFields: {
          fullName: { value: validated.schema.personal?.fullName || '(empty)', confidence: validated.confidence.fullName },
          email: { value: validated.schema.personal?.email || '(empty)', confidence: validated.confidence.email },
          phone: { value: validated.schema.personal?.phone || '(empty)', confidence: validated.confidence.phone },
        },
        experienceCount: validated.schema.experience?.length || 0,
        educationCount: validated.schema.education?.length || 0,
        skillsCount: validated.schema.skills?.length || 0,
        projectsCount: validated.schema.projects?.length || 0,
      });

      log.step('Mapping', {
        status: 'ok',
        schemaKeys: Object.keys(validated.schema || {}),
        hasMetadata: !!validated.schema.metadata,
        hasPersonal: !!validated.schema.personal
      });

      return {
        success: true,
        confidence: validated.confidence,
        schema: validated.schema,
        _debug: IS_DEV ? {
          rawText,
          cleanedText: cleanText,
          aiRawResponse: aiResult.rawResponse || JSON.stringify(aiResult.data, null, 2),
          aiParsedJson: aiResult.data,
          validationResult: validated.confidence,
          pipelineSteps: log.getSteps(),
          failedStep: null
        } : undefined
      };
    } else {
      aiError = aiResult.error || 'AI returned no data';
      log.step('AI Response', {
        status: 'error',
        responseTimeMs: aiDuration,
        reason: aiError
      });
    }
  } catch (e) {
    aiError = e.message;
    log.step('AI Response', {
      status: 'error',
      reason: `AI extraction exception: ${e.message}`
    });
    console.warn("AI LLM extraction failed, falling back to heuristic parsing:", e);
  }

  // ═══ Step 5 Fallback: Heuristic Parsing if AI unavailable ═══
  log.step('Heuristic Fallback', {
    status: 'warn',
    reason: `AI failed (${aiError}), using regex-based heuristic parser`
  });

  const fallbackResult = parseTextWithConfidence(cleanText, file.name);

  log.step('Validation (Heuristic)', {
    status: 'ok',
    confidence: fallbackResult.confidence,
    personalFields: {
      fullName: fallbackResult.schema.personal?.fullName || '(empty)',
      email: fallbackResult.schema.personal?.email || '(empty)',
      phone: fallbackResult.schema.personal?.phone || '(empty)',
    }
  });

  return {
    success: true,
    confidence: fallbackResult.confidence,
    schema: fallbackResult.schema,
    _debug: IS_DEV ? {
      rawText,
      cleanedText: cleanText,
      aiRawResponse: `(AI failed: ${aiError}) — used heuristic fallback parser`,
      validationResult: fallbackResult.confidence,
      pipelineSteps: log.getSteps(),
      failedStep: log.getFailedStep()
    } : undefined
  };
}
