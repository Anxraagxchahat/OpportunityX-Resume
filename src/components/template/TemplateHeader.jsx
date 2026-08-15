import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

import { GithubIcon, LinkedinIcon } from '../icons/BrandIcons';

export const TemplateHeader = ({ personal = {}, accentHex = '#F97316', align = 'left', photoUrl = null }) => {
  const websiteLink = personal.website || personal.portfolio;
  const customLinks = Array.isArray(personal.customLinks) ? personal.customLinks : [];

  return (
    <div className={`pb-4 border-b border-slate-200 flex items-start justify-between gap-4 ${align === 'center' ? 'text-center flex-col items-center' : ''}`}>
      <div className="space-y-1">
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">{personal.fullName || 'Your Full Name'}</h1>
        <p className="text-sm font-bold uppercase tracking-wider" style={{ color: accentHex }}>
          {personal.jobTitle || 'Professional Role'}
        </p>

        <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 font-medium pt-1 ${align === 'center' ? 'justify-center' : ''}`}>
          {personal.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" />{personal.email}</span>}
          {personal.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" />{personal.phone}</span>}
          {personal.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-slate-400" />{personal.location}</span>}
          {websiteLink && <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-400" />{websiteLink}</span>}
          {personal.github && <span className="flex items-center gap-1"><GithubIcon className="w-3 h-3 text-slate-400" />{personal.github}</span>}
          {personal.linkedin && <span className="flex items-center gap-1"><LinkedinIcon className="w-3 h-3 text-slate-400" />{personal.linkedin}</span>}
          {personal.twitter && <span className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-400" />{personal.twitter}</span>}
          {customLinks.map((cl, idx) => (
            cl.url ? <span key={idx} className="flex items-center gap-1"><Globe className="w-3 h-3 text-slate-400" />{cl.label ? `${cl.label}: ` : ''}{cl.url}</span> : null
          ))}
        </div>
      </div>

      {photoUrl && (
        <img src={photoUrl} alt="Profile" className="w-20 h-20 rounded-xl object-cover border border-slate-300 shadow-sm flex-shrink-0" />
      )}
    </div>
  );
};
