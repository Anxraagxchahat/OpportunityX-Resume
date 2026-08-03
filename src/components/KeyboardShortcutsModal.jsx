import React from 'react';
import { X, Command, Keyboard } from 'lucide-react';
import { useResume } from '../context/ResumeContext';

export const shortcutsList = [
  { key: 'Ctrl + S', macKey: '⌘ + S', label: 'Save Resume Snapshot', desc: 'Instantly saves a named snapshot to version history' },
  { key: 'Ctrl + Z', macKey: '⌘ + Z', label: 'Undo Action', desc: 'Reverts your previous edit' },
  { key: 'Ctrl + Shift + Z', macKey: '⌘ + Shift + Z', label: 'Redo Action', desc: 'Re-applies your reverted edit' },
  { key: 'Ctrl + D', macKey: '⌘ + D', label: 'Duplicate Resume', desc: 'Clones current resume draft' },
  { key: 'Ctrl + P', macKey: '⌘ + P', label: 'Download PDF', desc: 'Opens browser clean PDF print preview' },
  { key: 'Ctrl + /  or  ?', macKey: '⌘ + /  or  ?', label: 'Toggle Shortcuts Modal', desc: 'Displays this quick reference modal' }
];

export const KeyboardShortcutsModal = () => {
  const { isKeyboardHelpOpen, setIsKeyboardHelpOpen } = useResume();

  if (!isKeyboardHelpOpen) return null;

  const isMac = typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#0B0D14] border border-slate-800 rounded-2xl w-full max-w-lg shadow-2xl p-6 space-y-5 relative">
        {/* Close Button */}
        <button
          onClick={() => setIsKeyboardHelpOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400">
            <Keyboard className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-white">Keyboard Shortcuts</h3>
            <p className="text-xs text-slate-400">Speed up your resume building workflow</p>
          </div>
        </div>

        {/* Shortcuts List */}
        <div className="space-y-2.5 max-h-[60vh] overflow-y-auto custom-scrollbar">
          {shortcutsList.map((sc, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 rounded-xl bg-[#10131D] border border-slate-800/80 hover:border-orange-500/30 transition-colors"
            >
              <div>
                <div className="text-xs font-bold text-white">{sc.label}</div>
                <div className="text-[11px] text-slate-400">{sc.desc}</div>
              </div>

              <kbd className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-orange-400 shadow-inner">
                {isMac ? sc.macKey : sc.key}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
          <span>Press <kbd className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono">Esc</kbd> or click X to close</span>
          <button
            onClick={() => setIsKeyboardHelpOpen(false)}
            className="px-4 py-1.5 rounded-xl bg-orange-500 text-black font-bold text-xs hover:bg-orange-400 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
