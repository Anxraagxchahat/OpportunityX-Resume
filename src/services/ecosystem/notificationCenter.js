/**
 * OpportunityX Resume — Ecosystem Notification Center
 * Centralized notification system logging ecosystem actions.
 */

const NOTIFS_KEY = 'opportunityx_ecosystem_notifications_v1';

export function getNotifications() {
  try {
    const saved = localStorage.getItem(NOTIFS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}

  return [
    { id: 'notif-1', title: 'Ecosystem Identity Active', message: 'Universal OpportunityX ID linked across subdomains.', timestamp: new Date().toISOString(), read: false },
    { id: 'notif-2', title: 'Cloud Sync Complete', message: 'Resume draft backed up to browser storage.', timestamp: new Date().toISOString(), read: false }
  ];
}

export function addNotification(title, message) {
  const notifs = getNotifications();
  const newNotif = {
    id: `notif-${Date.now()}`,
    title,
    message,
    timestamp: new Date().toISOString(),
    read: false
  };

  try {
    localStorage.setItem(NOTIFS_KEY, JSON.stringify([newNotif, ...notifs.slice(0, 19)]));
  } catch (e) {}
}
