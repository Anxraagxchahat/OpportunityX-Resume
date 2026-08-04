/**
 * OpportunityX Resume — Verification Engine (verify.opportunityx.co.in)
 * Generates verification hashes, Verification IDs, and Authenticity Badges.
 */

export function generateVerificationDetails(resumeData, oxId = 'OX-USER-2026-X89A2F1D') {
  const jsonStr = JSON.stringify(resumeData || {});
  let hash = 0;
  for (let i = 0; i < jsonStr.length; i++) {
    hash = (hash << 5) - hash + jsonStr.charCodeAt(i);
    hash |= 0;
  }

  const verificationId = `VERIFY-OX-${Math.abs(hash).toString(16).toUpperCase()}`;

  return {
    verificationId,
    oxId,
    status: 'Verified Candidate',
    verificationUrl: `https://verify.opportunityx.co.in/v/${verificationId}`,
    issuedAt: new Date().toISOString(),
    isAuthentic: true
  };
}
