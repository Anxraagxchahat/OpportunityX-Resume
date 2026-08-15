import React from 'react';
import { FileText } from 'lucide-react';
import { InlineAIBadge } from '../../InlineAIBadge';

export const SummarySection = ({
  summary = '',
  updatePersonal,
  openAiModal
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <FileText className="w-4 h-4 text-orange-400" /> Executive Summary
        </h2>
        <InlineAIBadge
          label="Improve with AI"
          onClick={() => openAiModal('summary', summary, (improved) => updatePersonal('summary', improved))}
        />
      </div>
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs font-semibold text-slate-300">
          <span>Summary Text</span>
          <span className="text-[10px] text-slate-500">{(summary || '').length} chars</span>
        </div>
        <textarea
          rows={6}
          value={summary || ''}
          onChange={(e) => updatePersonal('summary', e.target.value)}
          placeholder="e.g. Versatile Full Stack Software Engineer with 5+ years of experience engineering high-throughput SaaS applications, cloud-native microservices, and AI-assisted web interfaces..."
          className="w-full bg-[#10131D] border border-slate-800 rounded-xl p-3.5 text-xs font-medium text-white focus:border-orange-500 focus:outline-none leading-relaxed"
        />
      </div>
    </div>
  );
};
