/**
 * OpportunityX Resume — Central Template Preview Assets Registry
 * Imports and exports all bundled template preview assets (thumbnails, normal, full previews).
 */

import modernATS from "../template-previews/modern.svg";
import minimalATS from "../template-previews/minimal.svg";
import executiveATS from "../template-previews/executive.svg";
import corporateATS from "../template-previews/corporate.svg";
import recruiterATS from "../template-previews/recruiter.svg";
import fullstack from "../template-previews/fullstack.svg";

import creativeSidebar from "../template-previews/creative-sidebar.jpg";
import marketingAccent from "../template-previews/marketing-accent.jpg";
import developerDark from "../template-previews/developer-dark.jpg";
import atsClassic from "../template-previews/ats-classic.jpg";
import businessAnalyst from "../template-previews/business-analyst.jpg";
import executiveMinimal from "../template-previews/executive-minimal.jpg";
import compactEntry from "../template-previews/compact-entry.jpg";
import seniorEnterprise from "../template-previews/senior-enterprise.jpg";
import healthcareCalm from "../template-previews/healthcare-calm.jpg";
import asiaCompact from "../template-previews/asia-compact.jpg";
import technicalGrid from "../template-previews/technical-grid.jpg";
import accentColumn from "../template-previews/accent-column.jpg";
import whitespaceModern from "../template-previews/whitespace-modern.jpg";
import executiveBold from "../template-previews/executive-bold.jpg";
import professionalClean from "../template-previews/professional-clean.jpg";

import breCool from "../template-previews/bre-cool.svg";
import breCreative from "../template-previews/bre-creative.svg";
import breGreen from "../template-previews/bre-green.svg";
import breLeftRight from "../template-previews/bre-left-right.svg";
import breMaterialDark from "../template-previews/bre-material-dark.svg";
import breOblique from "../template-previews/bre-oblique.svg";
import breSidebar from "../template-previews/bre-sidebar.svg";
import jsonresumeModern from "../template-previews/jsonresume-modern.svg";

export const TEMPLATE_PREVIEWS = {
  modern: { thumbnail: modernATS, normal: modernATS, full: modernATS },
  minimal: { thumbnail: minimalATS, normal: minimalATS, full: minimalATS },
  executive: { thumbnail: executiveATS, normal: executiveATS, full: executiveATS },
  corporate: { thumbnail: corporateATS, normal: corporateATS, full: corporateATS },
  recruiter: { thumbnail: recruiterATS, normal: recruiterATS, full: recruiterATS },
  fullstack: { thumbnail: fullstack, normal: fullstack, full: fullstack },
  'creative-sidebar': { thumbnail: creativeSidebar, normal: creativeSidebar, full: creativeSidebar },
  'marketing-accent': { thumbnail: marketingAccent, normal: marketingAccent, full: marketingAccent },
  'developer-dark': { thumbnail: developerDark, normal: developerDark, full: developerDark },
  'ats-classic': { thumbnail: atsClassic, normal: atsClassic, full: atsClassic },
  'business-analyst': { thumbnail: businessAnalyst, normal: businessAnalyst, full: businessAnalyst },
  'executive-minimal': { thumbnail: executiveMinimal, normal: executiveMinimal, full: executiveMinimal },
  'compact-entry': { thumbnail: compactEntry, normal: compactEntry, full: compactEntry },
  'senior-enterprise': { thumbnail: seniorEnterprise, normal: seniorEnterprise, full: seniorEnterprise },
  'healthcare-calm': { thumbnail: healthcareCalm, normal: healthcareCalm, full: healthcareCalm },
  'asia-compact': { thumbnail: asiaCompact, normal: asiaCompact, full: asiaCompact },
  'technical-grid': { thumbnail: technicalGrid, normal: technicalGrid, full: technicalGrid },
  'accent-column': { thumbnail: accentColumn, normal: accentColumn, full: accentColumn },
  'whitespace-modern': { thumbnail: whitespaceModern, normal: whitespaceModern, full: whitespaceModern },
  'executive-bold': { thumbnail: executiveBold, normal: executiveBold, full: executiveBold },
  'professional-clean': { thumbnail: professionalClean, normal: professionalClean, full: professionalClean },
  'bre-cool': { thumbnail: breCool, normal: breCool, full: breCool },
  'bre-creative': { thumbnail: breCreative, normal: breCreative, full: breCreative },
  'bre-green': { thumbnail: breGreen, normal: breGreen, full: breGreen },
  'bre-purple': { thumbnail: breGreen, normal: breGreen, full: breGreen },
  'bre-left-right': { thumbnail: breLeftRight, normal: breLeftRight, full: breLeftRight },
  'bre-material-dark': { thumbnail: breMaterialDark, normal: breMaterialDark, full: breMaterialDark },
  'bre-oblique': { thumbnail: breOblique, normal: breOblique, full: breOblique },
  'bre-sidebar': { thumbnail: breSidebar, normal: breSidebar, full: breSidebar },
  'jsonresume-modern': { thumbnail: jsonresumeModern, normal: jsonresumeModern, full: jsonresumeModern }
};

export const getTemplatePreviewAsset = (templateId, type = 'normal') => {
  const entry = TEMPLATE_PREVIEWS[templateId] || TEMPLATE_PREVIEWS.modern;
  return entry[type] || entry.normal || modernATS;
};

export default TEMPLATE_PREVIEWS;
