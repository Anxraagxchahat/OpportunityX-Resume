/**
 * OpportunityX Resume — Analytics Logger (Future Ready)
 * Stubbed analytics event hub for tracking user actions locally.
 */

export const AnalyticsEvents = {
  RESUME_CREATED: 'RESUME_CREATED',
  RESUME_DELETED: 'RESUME_DELETED',
  RESUME_DUPLICATED: 'RESUME_DUPLICATED',
  RESUME_RENAMED: 'RESUME_RENAMED',
  TEMPLATE_SELECTED: 'TEMPLATE_SELECTED',
  PDF_DOWNLOAD: 'PDF_DOWNLOAD',
  IMPORT_RESUME: 'IMPORT_RESUME',
  JSON_EXPORT: 'JSON_EXPORT',
  RESUME_COMPLETION: 'RESUME_COMPLETION',
  AI_BUTTON_CLICK: 'AI_BUTTON_CLICK',
  AI_CREDIT_CONSUMED: 'AI_CREDIT_CONSUMED',
  KEYBOARD_SHORTCUT_USED: 'KEYBOARD_SHORTCUT_USED'
};

export const trackEvent = (eventName, payload = {}) => {
  const timestamp = new Date().toISOString();
  const logData = {
    event: eventName,
    timestamp,
    payload
  };

  if (import.meta.env?.DEV) {
    console.log(`%c[OpportunityX Analytics] %c${eventName}`, 'color: #F97316; font-weight: bold;', 'color: #10B981;', payload);
  }

  // Future SDK dispatch (e.g. PostHog, Segment, Mixpanel, Google Analytics)
  try {
    if (window.opportunityxAnalytics) {
      window.opportunityxAnalytics.track(eventName, logData);
    }
  } catch (err) {
    // Silent fallback
  }
};
