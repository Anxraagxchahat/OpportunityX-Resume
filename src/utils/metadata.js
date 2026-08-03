/**
 * OpportunityX Resume — Metadata & Ecosystem Generator
 * Generates and updates internal metadata, cloud stubs, and ecosystem schemas.
 */

export function generateLocalDeviceId() {
  try {
    let deviceId = localStorage.getItem('opportunityx_device_id');
    if (!deviceId) {
      deviceId = `dev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('opportunityx_device_id', deviceId);
    }
    return deviceId;
  } catch (e) {
    return 'dev-browser-local';
  }
}

export function createResumeMetadata(customTitle = 'Untitled Resume', template = 'modern') {
  const timestamp = new Date().toISOString();
  return {
    uuid: `ox-resume-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    id: `ox-resume-${Date.now()}`,
    title: customTitle,
    schemaVersion: "1.0.0",
    version: 1,
    createdAt: timestamp,
    updatedAt: timestamp,
    lastSaved: timestamp,
    lastExported: null,
    lastModified: timestamp,
    activeTemplate: template,
    template,
    accentColor: "#F97316",
    fontFamily: "Inter",
    localDeviceId: generateLocalDeviceId(),
    hiddenSections: [],
    isFavorite: false,
    isArchived: false,
    targetProfile: "Software Developer"
  };
}

export function createEcosystemSchema() {
  return {
    version: "1.0.0",
    verificationHash: `ox_verify_${Math.random().toString(36).substring(2, 10)}`,
    syncReady: true,
    platform: "OpportunityX Career OS",
    targetHubs: ["career", "verify", "freelancing", "portfolio"]
  };
}

export function createCloudSchema() {
  return {
    cloudId: null,
    syncStatus: "local_only",
    lastSync: null,
    deviceId: generateLocalDeviceId()
  };
}

export function createSecuritySchema() {
  return {
    readOnly: false,
    shareMode: false,
    verificationMode: false,
    passwordProtected: false
  };
}

export function createStyleSchema() {
  return {
    accentColor: "#F97316",
    headerStyle: "modern", // modern, centered, sidebar, classic
    dividerStyle: "solid", // solid, double, dotted, minimal, dashed
    fontFamily: "Inter", // Inter, Outfit, Plus Jakarta Sans, JetBrains Mono, Roboto
    pageMargin: "normal", // compact, normal, spacious
    lineSpacing: "normal", // compact, normal, relaxed
    sectionSpacing: "normal", // compact, normal, spacious
    paperBackground: "white" // white, warm, light-gray, minimal-accent, sidebar-tint
  };
}

export function stripInternalMetadata(resumeData) {
  if (!resumeData) return resumeData;
  const copy = JSON.parse(JSON.stringify(resumeData));
  delete copy.security;
  delete copy.cloud;
  delete copy.metadata?.localDeviceId;
  delete copy.metadata?.isFavorite;
  delete copy.metadata?.isArchived;
  return copy;
}
