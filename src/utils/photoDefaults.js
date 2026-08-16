/**
 * Default Profile Photo & Sample Avatars Registry
 * Dynamically queries Template Capability System for photo support.
 */
import { getTemplateCapabilities } from './templateCapabilities';

export const DEFAULT_PROFILE_PHOTO = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';

export const SAMPLE_AVATARS = [
  {
    id: 'avatar-1',
    label: 'Executive Woman',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'avatar-2',
    label: 'Tech Specialist Man',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'avatar-3',
    label: 'Creative Professional',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'avatar-4',
    label: 'Corporate Lead',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'avatar-5',
    label: 'Software Engineer',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
  },
  {
    id: 'avatar-6',
    label: 'Minimal SVG Headshot',
    url: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 128 128'><rect width='128' height='128' fill='%231e293b'/><circle cx='64' cy='48' r='24' fill='%23f97316'/><path d='M24 112c0-22 18-40 40-40s40 18 40 40' fill='%23f97316'/></svg>"
  }
];

export const isPhotoTemplate = (templateId) => {
  if (!templateId) return false;
  return getTemplateCapabilities(templateId).supportsPhoto;
};

export { optimizeProfileImage } from './photoOptimizer';

