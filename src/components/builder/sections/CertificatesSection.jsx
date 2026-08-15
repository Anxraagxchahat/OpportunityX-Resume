import React from 'react';
import { Award, Plus, Trash2 } from 'lucide-react';

export const CertificatesSection = ({
  certificates = [],
  updateCertificates,
  addCertificateItem,
  removeCertificateItem
}) => {
  return (
    <div className="space-y-4 max-w-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-orange-400" /> Certifications ({certificates.length})
        </h2>
        <button onClick={addCertificateItem} className="px-3 py-1.5 text-xs font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-lg flex items-center gap-1.5">
          <Plus className="w-3.5 h-3.5" /> Add Certification
        </button>
      </div>
      {certificates.map((cert, idx) => (
        <div key={cert.id || `cert-${idx}`} className="p-4 rounded-xl bg-[#10131D] border border-slate-800 space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-orange-400">{cert.name || `Certification #${idx + 1}`}</span>
            <button onClick={() => removeCertificateItem(cert.id, idx)} className="p-1 text-slate-500 hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Certification Name</label>
              <input type="text" value={cert.name || ''} onChange={(e) => updateCertificates(certificates.map((c, i) => (i === idx || (c.id && c.id === cert.id) ? { ...c, name: e.target.value } : c)))} placeholder="e.g. AWS Certified Solutions Architect" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Issuing Organization</label>
              <input type="text" value={cert.issuer || ''} onChange={(e) => updateCertificates(certificates.map((c, i) => (i === idx || (c.id && c.id === cert.id) ? { ...c, issuer: e.target.value } : c)))} placeholder="e.g. Amazon Web Services" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Issue Date / Year</label>
              <input type="text" value={cert.date || ''} onChange={(e) => updateCertificates(certificates.map((c, i) => (i === idx || (c.id && c.id === cert.id) ? { ...c, date: e.target.value } : c)))} placeholder="e.g. 2023" className="w-full bg-[#080B12] border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
