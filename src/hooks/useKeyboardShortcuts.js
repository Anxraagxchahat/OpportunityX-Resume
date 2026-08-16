import { useEffect } from 'react';
import { isEditableTarget } from '../utils/domUtils';

/**
 * useKeyboardShortcuts — Global shortcut management with strict editable-target protection.
 *
 * Ensures that ANY keystrokes originating from inside an input, textarea, select, or
 * contenteditable element are NEVER intercepted as global shortcuts or navigation triggers.
 */
export const useKeyboardShortcuts = ({
  onSaveSnapshot,
  onUndo,
  onRedo,
  onDuplicate,
  onDownloadPDF,
  onToggleShortcutsModal,
  enabled = true
} = {}) => {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e) => {
      // 1. STRICT GUARD: If user is typing inside any editable control, ALWAYS ignore global shortcuts
      if (isEditableTarget(e.target)) {
        return;
      }

      const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);
      const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

      // 2. Ctrl/Cmd + S — Save Version Snapshot
      if (isCmdOrCtrl && e.key.toLowerCase() === 's') {
        e.preventDefault();
        if (onSaveSnapshot) onSaveSnapshot();
        return;
      }

      // 3. Ctrl/Cmd + Shift + Z OR Ctrl/Cmd + Y — Redo Action
      if (isCmdOrCtrl && ((e.shiftKey && e.key.toLowerCase() === 'z') || e.key.toLowerCase() === 'y')) {
        e.preventDefault();
        if (onRedo) onRedo();
        return;
      }

      // 4. Ctrl/Cmd + Z (without Shift) — Undo Action
      if (isCmdOrCtrl && !e.shiftKey && e.key.toLowerCase() === 'z') {
        e.preventDefault();
        if (onUndo) onUndo();
        return;
      }

      // 5. Ctrl/Cmd + D — Duplicate Resume
      if (isCmdOrCtrl && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        if (onDuplicate) onDuplicate();
        return;
      }

      // 6. Ctrl/Cmd + P — Download / Print PDF
      if (isCmdOrCtrl && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        if (onDownloadPDF) onDownloadPDF();
        return;
      }

      // 7. Ctrl/Cmd + / OR ? — Toggle Keyboard Shortcuts Reference Modal
      if ((isCmdOrCtrl && e.key === '/') || e.key === '?') {
        e.preventDefault();
        if (onToggleShortcutsModal) onToggleShortcutsModal();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [enabled, onSaveSnapshot, onUndo, onRedo, onDuplicate, onDownloadPDF, onToggleShortcutsModal]);
};

export default useKeyboardShortcuts;
