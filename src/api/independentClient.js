// API client for the Iberix independent backend.
// All calls route to your backend at VITE_API_URL (defaults to /api).
// Every file imports { base44 } from base44Client — no other code changes.

const API_BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'base44_access_token';

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw { status: res.status, message: error.message || 'Request failed', data: error };
  }

  return res.json();
}

function createEntityClient(name) {
  return {
    async create(data) { return request(`/${name}`, { method: 'POST', body: JSON.stringify(data) }); },
    async bulkCreate(items) { return request(`/${name}/bulk`, { method: 'POST', body: JSON.stringify(items) }); },
    async list(sort, limit) {
      const params = new URLSearchParams();
      if (sort) params.set('sort', sort);
      if (limit) params.set('limit', limit);
      return request(`/${name}?${params}`);
    },
    async filter(query, sort, limit) {
      const params = new URLSearchParams();
      if (query) params.set('q', JSON.stringify(query));
      if (sort) params.set('sort', sort);
      if (limit) params.set('limit', limit);
      return request(`/${name}?${params}`);
    },
    async get(id) { return request(`/${name}/${id}`); },
    async update(id, data) { return request(`/${name}/${id}`, { method: 'PATCH', body: JSON.stringify(data) }); },
    async updateMany(query, update) {
      return request(`/${name}/update-many`, { method: 'POST', body: JSON.stringify({ query, update }) });
    },
    async bulkUpdate(items) { return request(`/${name}/bulk-update`, { method: 'POST', body: JSON.stringify(items) }); },
    async delete(id) { return request(`/${name}/${id}`, { method: 'DELETE' }); },
    async deleteMany(query) { return request(`/${name}/delete-many`, { method: 'POST', body: JSON.stringify({ query }) }); },
    async schema() { return request(`/${name}/schema`); },
    subscribe() { return () => {}; },
  };
}

export function createIndependentClient() {
  return {
    auth: {
      async me() { return request('/auth/me'); },
      async loginViaEmailPassword(email, password) {
        const { access_token } = await request('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
        setToken(access_token);
        return { access_token };
      },
      async loginWithProvider(provider, fromUrl) {
        window.location.href = `${API_BASE}/auth/${provider}?from=${encodeURIComponent(fromUrl || window.location.href)}`;
      },
      async register({ email, password }) {
        return request('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
      },
      async verifyOtp({ email, otpCode }) {
        const { access_token } = await request('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ email, otpCode }) });
        setToken(access_token);
        return { access_token };
      },
      async resendOtp(email) {
        return request('/auth/resend-otp', { method: 'POST', body: JSON.stringify({ email }) });
      },
      async resetPasswordRequest(email) {
        return request('/auth/reset-request', { method: 'POST', body: JSON.stringify({ email }) });
      },
      async resetPassword({ resetToken, newPassword }) {
        return request('/auth/reset', { method: 'POST', body: JSON.stringify({ resetToken, newPassword }) });
      },
      setToken,
      getToken,
      isAuthenticated() { return Promise.resolve(!!getToken()); },
      logout(redirectUrl) {
        setToken(null);
        if (redirectUrl) window.location.href = redirectUrl;
      },
      redirectToLogin(nextUrl) {
        const loginUrl = nextUrl ? `/login?returnTo=${encodeURIComponent(nextUrl)}` : '/login';
        window.location.href = loginUrl;
      },
      async updateMe(data) {
        return request('/auth/me', { method: 'PATCH', body: JSON.stringify(data) });
      },
    },

    app: {
      async getPublicSettings() {
        try {
          return await request('/app/settings');
        } catch {
          return { id: 'independent', public_settings: {} };
        }
      },
    },

    entities: {
      Lead: createEntityClient('leads'),
      User: {
        async list() { return request('/users'); },
        async get(id) { return request(`/users/${id}`); },
      },
    },

    functions: {
      async invoke(name, payload) {
        return request(`/functions/${name}`, { method: 'POST', body: JSON.stringify(payload) });
      },
    },

    users: {
      async inviteUser(email, role) {
        return request('/users/invite', { method: 'POST', body: JSON.stringify({ email, role }) });
      },
    },

    analytics: {
      track({ eventName, properties }) {
        console.debug('[analytics]', eventName, properties);
      },
    },

    integrations: {
      Core: {
        async UploadPublicFile({ file }) {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch(`${API_BASE}/upload`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
          });
          return res.json();
        },
        async UploadPrivateFile({ file }) {
          const formData = new FormData();
          formData.append('file', file);
          const res = await fetch(`${API_BASE}/upload-private`, {
            method: 'POST',
            headers: { Authorization: `Bearer ${getToken()}` },
            body: formData,
          });
          return res.json();
        },
      },
    },
  };
}