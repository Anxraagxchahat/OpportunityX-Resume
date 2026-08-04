/**
 * OpportunityX Resume — Cloud Storage & Offline Auto Sync Engine
 * Handles background sync, conflict resolution strategies, and offline queue.
 */

export const CONFLICT_STRATEGIES = [
  { id: 'lww', name: 'Last Write Wins (Default)', desc: 'Automatically keeps the most recently saved version.' },
  { id: 'manual', name: 'Manual Merge', desc: 'Offers side-by-side field resolution on sync conflicts.' },
  { id: 'keep_local', name: 'Keep Local Copy', desc: 'Always prioritizes local browser storage.' },
  { id: 'keep_cloud', name: 'Keep Cloud Copy', desc: 'Overwrites local state with cloud backup.' }
];

export function resolveConflict(localData, cloudData, strategy = 'lww') {
  if (strategy === 'keep_local') return localData;
  if (strategy === 'keep_cloud') return cloudData;

  // LWW Check
  const localTime = new Date(localData.metadata?.lastSaved || 0).getTime();
  const cloudTime = new Date(cloudData.metadata?.lastSaved || 0).getTime();

  return cloudTime > localTime ? cloudData : localData;
}
