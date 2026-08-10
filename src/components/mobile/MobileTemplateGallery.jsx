import React from 'react';
import { Check, Sparkles, LayoutGrid } from 'lucide-react';
import { useResume } from '../../context/ResumeContext';
import { useMobileNavigation } from '../../context/MobileNavigationContext';
import { TEMPLATE_REGISTRY, getTemplateCapabilities } from '../../templates';
import { RealTemplateThumbnail } from '../template/RealTemplateThumbnail';

export const MobileTemplateGallery = () => {
  const { activeResume, setTemplate } = useResume();
  const { setActiveTab, addToast } = useMobileNavigation();
  const currentTemplate = activeResume.metadata?.template || 'modern';

  const templatesList = Object.keys(TEMPLATE_REGISTRY).map((id) => getTemplateCapabilities(id));

  const handleSelectTemplate = (templateId) => {
    setTemplate(templateId);
    addToast('Template applied', 'success');
  };

  return (
    <div className="w-full min-h-dvh bg-[var(--ox-bg)] p-4 space-y-4 pb-28 select-none no-print">
      
      {/* Gallery Header */}
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-[var(--ox-text-primary)]">Template Gallery</h2>
          <span className="px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-400 text-xs font-bold border border-orange-500/20">
            {templatesList.length} Templates
          </span>
        </div>
        <p className="text-xs text-[var(--ox-text-secondary)]">
          Select an ATS-optimized design. All your resume data will be automatically reformatted.
        </p>
      </div>

      {/* Templates List */}
      <div className="space-y-4">
        {templatesList.map((tpl) => {
          const isSelected = currentTemplate === tpl.id;

          return (
            <div
              key={tpl.id}
              className={`p-4 rounded-3xl bg-[var(--ox-surface-primary)] border transition-all space-y-3 ${
                isSelected
                  ? 'border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]'
                  : 'border-[var(--ox-border)] hover:border-slate-700'
              }`}
            >
              {/* Aspect Ratio Preview Container */}
              <div className="w-full aspect-[1/1.3] rounded-2xl overflow-hidden bg-white shadow-inner relative border border-[var(--ox-border)]">
                <RealTemplateThumbnail template={tpl} type="preview" />
                
                {isSelected && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-emerald-500 text-white font-extrabold text-xs shadow-lg flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Active Template
                  </div>
                )}
              </div>

              {/* Info & CTA */}
              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--ox-text-primary)]">{tpl.name}</h3>
                  <p className="text-xs text-[var(--ox-text-secondary)]">{tpl.category || 'ATS Recommended'}</p>
                </div>

                <button
                  onClick={() => handleSelectTemplate(tpl.id)}
                  disabled={isSelected}
                  className={`px-5 py-2.5 rounded-2xl font-bold text-xs flex items-center gap-1.5 min-h-[44px] cursor-pointer transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-orange-500 hover:bg-orange-600 text-white shadow-md'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-4 h-4" /> Applied
                    </>
                  ) : (
                    <span>Use Template</span>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};

export default MobileTemplateGallery;
