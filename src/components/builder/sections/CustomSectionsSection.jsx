import React from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';

export const CustomSectionsSection = ({
  customSections = [],
  updateCustomSections,
  addCustomSection,
  removeCustomSection
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-orange-400" /> Custom Sections ({customSections.length})
        </h2>
        <button onClick={addCustomSection} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Custom Section
        </button>
      </div>
      {customSections.map((cs, sIdx) => (
        <div key={cs.id || sIdx} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <input
              type="text"
              value={cs.title || ''}
              onChange={(e) => updateCustomSections(customSections.map((s) => (s.id === cs.id ? { ...s, title: e.target.value } : s)))}
              placeholder="e.g. Leadership & Volunteer / Publications / Speaking"
              className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs font-bold text-orange-400 focus:border-orange-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => removeCustomSection(cs.id)}
              className="p-1.5 text-slate-400 hover:text-red-400 bg-slate-800/40 hover:bg-red-500/10 rounded-lg transition-all flex-shrink-0 cursor-pointer"
              title="Delete Section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Section Items */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <div className="flex justify-between items-center">
              <span className="text-[11px] font-semibold text-slate-400">Section Items / Details</span>
              <button
                type="button"
                onClick={() => {
                  const currentItems = Array.isArray(cs.items) ? cs.items : [];
                  const newItem = { id: `citem-${Date.now()}`, name: '', description: '' };
                  updateCustomSections(customSections.map((s) => (s.id === cs.id ? { ...s, items: [...currentItems, newItem] } : s)));
                }}
                className="text-[11px] font-semibold text-orange-400 hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" /> Add Item
              </button>
            </div>

            {Array.isArray(cs.items) && cs.items.length > 0 ? (
              <div className="space-y-2">
                {cs.items.map((item, iIdx) => (
                  <div key={item.id || iIdx} className="p-3 rounded-lg bg-[#080B12] border border-slate-800/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400">Item #{iIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updatedItems = cs.items.filter((_, i) => i !== iIdx);
                          updateCustomSections(customSections.map((s) => (s.id === cs.id ? { ...s, items: updatedItems } : s)));
                        }}
                        className="text-slate-500 hover:text-red-400 p-0.5 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                    <input
                      type="text"
                      value={item.name || ''}
                      onChange={(e) => {
                        const updatedItems = cs.items.map((it, i) => (i === iIdx ? { ...it, name: e.target.value } : it));
                        updateCustomSections(customSections.map((s) => (s.id === cs.id ? { ...s, items: updatedItems } : s)));
                      }}
                      placeholder="Item Title / Role (e.g. Community Tech Lead)"
                      className="w-full bg-[#10131D] border border-slate-800 rounded px-2.5 py-1 text-xs text-white focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={item.description || ''}
                      onChange={(e) => {
                        const updatedItems = cs.items.map((it, i) => (i === iIdx ? { ...it, description: e.target.value } : it));
                        updateCustomSections(customSections.map((s) => (s.id === cs.id ? { ...s, items: updatedItems } : s)));
                      }}
                      placeholder="Description / Details (e.g. Organized local tech workshops...)"
                      className="w-full bg-[#10131D] border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-300 focus:border-orange-500 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-[11px] text-slate-500 italic">No items added yet. Click "+ Add Item" above to add details.</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
