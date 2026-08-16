/**
 * domUtils.js — DOM & Event Utilities for OpportunityX Resume Builder
 */

/**
 * Checks whether an event target is an editable input or inside an editable container.
 * When true, global keyboard shortcuts and navigation events MUST be bypassed so that
 * native character typing, cursor movements, and input edits are preserved.
 *
 * @param {EventTarget|HTMLElement|null} target
 * @returns {boolean}
 */
export const isEditableTarget = (target) => {
  if (!target || !(target instanceof HTMLElement)) return false;

  // Direct element type checks
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement ||
    target.isContentEditable ||
    target.getAttribute('contenteditable') === 'true' ||
    target.getAttribute('role') === 'textbox'
  ) {
    return true;
  }

  // Nested element inside an editable container (e.g. styled spans in rich editors or custom controls)
  if (typeof target.closest === 'function') {
    const editableAncestor = target.closest(
      'input, textarea, select, [contenteditable="true"], [contenteditable=""], [role="textbox"]'
    );
    if (editableAncestor) return true;
  }

  return false;
};
