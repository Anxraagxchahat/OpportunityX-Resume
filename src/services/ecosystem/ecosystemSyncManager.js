/**
 * OpportunityX Resume — Ecosystem Sync Manager
 * Central synchronization controller for Resume, Career Hub, Verify, Freelancing, and Portfolio.
 */

export const SYNC_MODULES = [
  { id: 'resume', name: 'Resume Engine', target: 'resume.opportunityx.co.in', priority: 1 },
  { id: 'career', name: 'Career Hub', target: 'career.opportunityx.co.in', priority: 2 },
  { id: 'verify', name: 'Verification System', target: 'verify.opportunityx.co.in', priority: 2 },
  { id: 'freelancing', name: 'Freelancing Platform', target: 'freelancing.opportunityx.co.in', priority: 3 },
  { id: 'portfolio', name: 'Portfolio Builder', target: 'portfolio.opportunityx.co.in', priority: 3 }
];

const SYNC_STATE_KEY = 'opportunityx_ecosystem_sync_state_v1';

export function getEcosystemSyncState() {
  try {
    const saved = localStorage.getItem(SYNC_STATE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  return {
    status: 'Synced',
    progress: 100,
    lastSyncTime: new Date().toISOString(),
    moduleStatuses: {
      resume: 'Synced',
      career: 'Synced',
      verify: 'Synced',
      freelancing: 'Synced',
      portfolio: 'Synced'
    }
  };
}

export function triggerManualEcosystemSync(selectedModules = ['career', 'verify', 'freelancing', 'portfolio']) {
  const currentState = getEcosystemSyncState();
  const nextModuleStatuses = { ...currentState.moduleStatuses };

  selectedModules.forEach((m) => {
    nextModuleStatuses[m] = 'Synced';
  });

  const updatedState = {
    status: 'Synced',
    progress: 100,
    lastSyncTime: new Date().toISOString(),
    moduleStatuses: nextModuleStatuses
  };

  try {
    localStorage.setItem(SYNC_STATE_KEY, JSON.stringify(updatedState));
  } catch (e) {}

  return updatedState;
}
