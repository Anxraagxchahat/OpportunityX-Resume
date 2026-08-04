/**
 * OpportunityX Resume — Permission & Visibility Engine
 * Configurable visibility states: Public, Private, Unlisted, Password Protected.
 */

export const VISIBILITY_STATES = [
  { id: 'public', name: 'Public', desc: 'Accessible via public URL & recruiter search.' },
  { id: 'private', name: 'Private', desc: 'Only visible to authenticated owner.' },
  { id: 'unlisted', name: 'Unlisted', desc: 'Accessible only to anyone with the secret link.' },
  { id: 'password', name: 'Password Protected', desc: 'Requires passcode before viewing.' }
];

export function getModuleVisibility(moduleName = 'resume') {
  return 'public';
}
