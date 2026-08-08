import { auth } from '../firebase';

const API_BASE_URL =
  import.meta.env.VITE_BACKEND_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.PROD
    ? 'https://opportunityx-resume.onrender.com/api/v1'
    : 'http://localhost:8000/api/v1');

async function getAuthToken() {
  try {
    const currentUser = auth.currentUser;
    if (currentUser) {
      return await currentUser.getIdToken(true);
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
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers
    });
  } catch (netErr) {
    if (endpoint.includes('/auth')) {
      throw new Error('Unable to connect to OpportunityX authentication service. Please check your network and try again.');
    }
    if (endpoint.includes('/payments')) {
      throw new Error('Payment service is temporarily unreachable. Your account has not been charged.');
    }
    throw new Error('Network connection issue. Please verify your internet connection and retry.');
  }

  if (!response.ok) {
    let errorDetail = 'API request failed';
    try {
      const errJson = await response.json();
      errorDetail = errJson.detail || errJson.message || errorDetail;
    } catch (e) {}
    throw new Error(errorDetail);
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

  // Credits System
  async getCreditBalance() {
    return request('/credits/balance');
  },

  async claimWelcomeCredits() {
    return request('/credits/claim-welcome', { method: 'POST' });
  },

  // Cashfree Payment Gateway
  async createCashfreeOrder(packId, customerPhone = "9999999999") {
    return request('/payments/create-order', {
      method: 'POST',
      body: JSON.stringify({ pack_id: packId, customer_phone: customerPhone })
    });
  },

  async verifyCashfreeOrder(orderId) {
    return request('/payments/verify-order', {
      method: 'POST',
      body: JSON.stringify({ order_id: orderId })
    });
  },

  // AI Generation
  async generateAI(feature, prompt, content) {
    return request('/ai/generate', {
      method: 'POST',
      body: JSON.stringify({ feature, prompt, content })
    });
  },

  // Feature Flags
  async getFeatureFlags() {
    return request('/flags/all');
  },

  // Health Check
  async getHealth() {
    return request('/health');
  }
};
