/**
 * Global Maintenance Mode Configuration
 * OpportunityX Resume Builder
 *
 * When MAINTENANCE_MODE is set to true:
 * - The entire application renders the Server Under Maintenance page.
 * - All routes (/builder, /dashboard, /templates, /ats-checker, etc.) are protected.
 * - Normal application initialization, auth listeners, and backend API requests are halted.
 *
 * To restore normal operation, simply change this to false:
 * export const MAINTENANCE_MODE = false;
 */
export const MAINTENANCE_MODE = false;
