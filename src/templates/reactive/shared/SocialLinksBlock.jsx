import React from 'react';
import { Globe, GitBranch, Share2, ExternalLink } from 'lucide-react';

export const SocialLinksBlock = ({ personal, accentHex, variant = 'default' }) => {
  if (!personal) return null;

  const websiteLink = personal?.website || personal?.portfolio;
  const githubLink = personal?.github;
  const twitterLink = personal?.twitter;
  const customLinks = Array.isArray(personal?.customLinks)
    ? personal.customLinks.filter(c => c && c.url)
    : [];

  const hasAnySocial = Boolean(websiteLink || githubLink || twitterLink || customLinks.length > 0);
  if (!hasAnySocial) return null;

  const linksList = [
    websiteLink && { id: 'portfolio', label: 'Personal Portfolio', url: websiteLink, icon: Globe },
    githubLink && { id: 'github', label: 'GitHub Profile', url: githubLink, icon: GitBranch },
    twitterLink && { id: 'twitter', label: 'Twitter / X', url: twitterLink, icon: Share2 },
    ...customLinks.map((c, i) => ({ id: `custom-${i}`, label: c.label || 'Web Link', url: c.url, icon: ExternalLink }))
  ].filter(Boolean);

  if (variant === 'compact') {
    return (
      <div className="space-y-1 text-xs">
        <h2 className="font-bold uppercase tracking-wider text-slate-900 border-b pb-0.5" style={{ borderColor: accentHex }}>
          Social & Portfolio Links
        </h2>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
          {linksList.map((item) => (
            <div key={item.id} className="flex items-center gap-1.5 text-slate-700">
              <span className="font-semibold text-slate-900">{item.label}:</span>
              <span className="font-mono text-[10px] text-slate-600 truncate">{item.url}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // default / inline
  return (
    <div className="space-y-1.5 text-xs pdf-block pdf-item pdf-keep-together break-inside-avoid">
      <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 pb-0.5 border-b pdf-section-header" style={{ borderColor: accentHex }}>
        Profiles & Portfolio Links
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1 text-[11px]">
        {linksList.map((item) => (
          <div key={item.id} className="flex items-center gap-1.5 text-slate-700 min-w-0">
            <span className="font-bold text-slate-900 shrink-0">{item.label}:</span>
            <span className="font-mono text-[10px] text-slate-600 break-all">{item.url}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
