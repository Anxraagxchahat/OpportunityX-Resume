import { auth } from '../firebase';

// Smart multi-port detection for local development (supports 8001, 8000, 8002, or Render in prod)
const DEFAULT_LOCAL_URL = 'http://localhost:8001/api/v1';
const FALLBACK_LOCAL_URLS = [
  'http://localhost:8001/api/v1',
  'http://localhost:8000/api/v1',
  'http://127.0.0.1:8001/api/v1',
  'http://127.0.0.1:8000/api/v1'
];

let cachedBaseUrl =
  import.meta.env.VITE_BACKEND_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://opportunityx-resume.onrender.com/api/v1'
    : DEFAULT_LOCAL_URL);

async function getAuthToken() {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return await currentUser.getIdToken();
    }
  } catch (e) {
    console.warn("Failed to retrieve Firebase ID Token:", e);
  }
  return null;
}

async function request(endpoint, options = {}) {
  const token = await getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response;
  let lastNetErr = null;

  // Try current cachedBaseUrl
  try {
    response = await fetch(`${cachedBaseUrl}${endpoint}`, {
      ...options,
      headers
    });
  } catch (netErr) {
    lastNetErr = netErr;

    // In development: auto-probe fallback ports if primary port fails
    if (!import.meta.env.PROD) {
      for (const fallbackUrl of FALLBACK_LOCAL_URLS) {
        if (fallbackUrl === cachedBaseUrl) continue;
        try {
          const fallbackRes = await fetch(`${fallbackUrl}${endpoint}`, {
            ...options,
            headers
          });
          cachedBaseUrl = fallbackUrl;
          response = fallbackRes;
          lastNetErr = null;
          break;
        } catch (fbErr) {
          // Continue probing
        }
      }
    }
  }

  if (lastNetErr || !response) {
    if (endpoint.includes('/auth')) {
      throw new Error('Unable to connect to OpportunityX authentication service. Please check your network and try again.');
    }
    if (endpoint.includes('/payments')) {
      throw new Error('Payment service is temporarily unreachable. Your account has not been charged.');
    }
    throw new Error('Backend service connecting. Please click Retry.');
  }

  if (!response.ok) {
    let errorDetail = 'API request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch (e) {}
    const err = new Error(errorDetail);
    err.status = response.status;
    throw err;
  }

  return response.json();
}

export const apiService = {
  // Auth Sync & User Profile
  async syncAuth() {
    return request('/auth/sync', { method: 'POST' });
  },

  async getEcosystemProfile() {
    return request('/ecosystem/profile');
  },

  async updateUserProfile(profileData) {
    return request('/ecosystem/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData)
    });
  },

  // Resumes CRUD
  async getResumes() {
    return request('/resumes');
  },

  async getResume(id) {
    return request(`/resumes/${id}`);
  },

  async createResume(resumeData) {
    return request('/resumes', {
      method: 'POST',
      body: JSON.stringify({
        title: resumeData.title || 'Untitled Resume',
        resume_data: resumeData.resume_data || resumeData,
        ats_score: resumeData.ats_score || 0
      })
    });
  },

  async updateResume(id, updateData) {
    return request(`/resumes/${id}`, {
      method: 'PUT',
      body: JSON.stringify({
        title: updateData.title,
        resume_data: updateData.resume_data || updateData,
        ats_score: updateData.ats_score
      })
    });
  },

  async deleteResume(id) {
    return request(`/resumes/${id}`, {
      method: 'DELETE'
    });
  },

  async shareResume(id) {
    return request(`/resumes/${id}/share`, {
      method: 'POST'
    });
  },

  // ──────────────────────────────────────────
  // AI Credits & Rewards System (Authoritative)
  // ──────────────────────────────────────────
  async getCreditBalance() {
    return request('/credits/balance');
  },

  async getRewardsOverview() {
    try {
      return await request('/credits/rewards-overview');
    } catch (err) {
      if (err.status === 404) {
        try {
          const res = await request('/credits/referral-code');
          if (res && (res.referralCode || res.referral_code)) {
            const code = res.referralCode || res.referral_code;
            return {
              remaining_credits: 5,
              social_bonus_earned: 0,
              social_tasks: [
                { task_id: 'instagram_follow', platform: 'Instagram', action: 'Follow OpportunityX', official_url: 'https://www.instagram.com/theopportunityx/', reward_amount: 2, completed: false },
                { task_id: 'linkedin_follow', platform: 'LinkedIn', action: 'Follow OpportunityX', official_url: 'https://www.linkedin.com/company/128134073', reward_amount: 1, completed: false },
                { task_id: 'x_follow', platform: 'X', action: 'Follow OpportunityX', official_url: 'https://x.com/TheOpportunityX', reward_amount: 1, completed: false },
                { task_id: 'youtube_subscribe', platform: 'YouTube', action: 'Subscribe to OpportunityX', official_url: 'https://www.youtube.com/@theopportunityX', reward_amount: 1, completed: false }
              ],
              referral_profile: {
                referral_code: code,
                has_redeemed: res.has_redeemed || false,
                redeemed_code: res.redeemed_code || null,
                successful_referrals: res.successful_referrals || 0,
                referral_credits_earned: res.referral_credits_earned || 0
              }
            };
          }
        } catch (fbErr) {}
      }
      throw err;
    }
  },

  async getReferralCode() {
    return request('/credits/referral-code');
  },

  async claimWelcomeCredits() {
    return request('/credits/claim-welcome', { method: 'POST' });
  },

  async claimSocialReward(taskId) {
    return request('/credits/claim-social', {
      method: 'POST',
      body: JSON.stringify({ task_id: taskId })
    });
  },

  async redeemReferralCode(referralCode) {
    return request('/credits/redeem-referral', {
      method: 'POST',
      body: JSON.stringify({ referral_code: referralCode })
    });
  },

  async consumeCredit(actionName = 'AI Feature', credits = 1) {
    return request('/credits/consume', {
      method: 'POST',
      body: JSON.stringify({
        action_name: actionName,
        credits: credits
      })
    });
  },

  async getCreditTransactions() {
    return request('/credits/transactions');
  },

  // AI Generation Infrastructure (Server-Side Proxy)
  async generateAI(feature = 'summary', prompt = '', content = {}) {
    const payloadContent = typeof content === 'object' && content !== null ? content : { rawText: String(content || '') };
    return request('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({
        feature,
        prompt: prompt || undefined,
        content: payloadContent
      })
    });
  },

  // Feature Flags
  async getFeatureFlags() {
    return request('/flags');
  },

  // Health
  async getHealth() {
    return request('/health');
  }
};
