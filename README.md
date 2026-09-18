# Iberix Command

A high-precision operations platform for managing global technical infrastructure deployments, data center projects, and specialized engineering workforce resources. Built with React, Vite, and Tailwind CSS.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 3 + shadcn/ui (Radix primitives) |
| Routing | React Router 6 |
| State / data | React Context, TanStack React Query |
| Icons | lucide-react |
| Charts | recharts |
| 3D / maps | three.js, react-leaflet |
| Forms | react-hook-form, zod |

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** 9+ (comes with Node.js)

## Quick Start (Frontend Only)

```bash
git clone <your-repo-url>
cd iberix-command
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

> **Note:** Running `npm run dev` alone serves the frontend without a backend. Entity writes, auth, and integrations will fail until you connect a backend (see [Independent Hosting](#independent-hosting-guide) below).

## Build for Production

```bash
npm run build      # outputs static files to ./dist
npm run preview    # preview the production build locally
```

The `./dist` directory contains fully static files that can be served by any static host or CDN.

---

## Ops Console (Admin Dashboard)

A secret admin route at `/ops-console` provides a two-factor-authenticated dashboard to view partnership leads submitted through the site.

### How it works

1. Navigate to `your-domain/ops-console`
2. Enter your admin username and password
3. A 6-digit OTP code is emailed to your registered address
4. Enter the OTP to access the leads dashboard

### Required secrets

| Secret | Description |
|---|---|
| `ADMIN_USERNAME` | Tough username for admin access |
| `ADMIN_PASSWORD` | Tough password for admin access |
| `ADMIN_OTP_EMAIL` | Email address where OTP codes are sent |

**On Base44:** Set these in Dashboard → Settings → Environment Variables (Secrets).
**Independent hosting:** Set in your backend `.env` file (see `.env.example`).

> **Email delivery note:** The built-in email sender reaches registered app users always. Sending OTP to a Gmail that is not a registered app user requires a paid plan with a custom domain connected. If your Gmail is not registered as an app user, either invite it as one (App Users → Invite) or use `info@iberix.global` as the OTP email instead.

### Features

- Search leads by company, contact name, or email
- Filter by status (new, contacted, qualified, partnered)
- Summary stats (total + per status)
- Refresh and sign out
- OTP expires in 10 minutes; session expires in 24 hours
- All session/OTP records are RLS-locked (no app user can access them; only the backend service role)

---

## Independent Hosting Guide

This app was built on the Base44 platform. The frontend is standard React/Vite and can be hosted anywhere. The backend (database, auth, integrations) is provided by Base44 and must be replaced to run fully independently.

### What Needs Replacing

The frontend talks to the backend through a single SDK client at `src/api/base44Client.js`. Everything flows through this one file:

| Base44 SDK call | Used in | What you need to provide |
|---|---|---|
| `base44.entities.Lead.create()` | AccountabilityModule form | `POST /api/leads` endpoint |
| `base44.entities.Lead.list/filter/get/update/delete` | Admin (if used) | Full Lead CRUD API |
| `base44.auth.me()` | AuthContext | `GET /api/auth/me` |
| `base44.auth.logout()` | AuthContext | Client-side token removal |
| `base44.auth.redirectToLogin()` | AuthContext | Redirect to your login page |
| `base44.app.getPublicSettings()` | AuthContext | `GET /api/app/settings` |
| `base44.auth.loginViaEmailPassword()` | Login page | `POST /api/auth/login` |
| `base44.auth.register()` | Register page | `POST /api/auth/register` |
| `base44.auth.verifyOtp()` | Register page | `POST /api/auth/verify-otp` |
| `base44.auth.resetPasswordRequest()` | ForgotPassword | `POST /api/auth/reset-request` |
| `base44.auth.resetPassword()` | ResetPassword | `POST /api/auth/reset` |
| `base44.integrations.Core.UploadPublicFile` | File uploads | `POST /api/upload` |
| `base44.integrations.Core.SendEmail` | Backend functions | Your email service |
| `base44.integrations.Core.InvokeLLM` | Backend functions | Your LLM provider |

### Architecture (Independent)

```
┌─────────────────────┐     ┌──────────────────────┐     ┌─────────────────┐
│   React Frontend    │────▶│   Your API Backend   │────▶│   Database      │
│   (Vite build)      │     │   (Node/Express)     │     │   (PostgreSQL)  │
│   static files      │     │   REST or GraphQL     │     │                 │
└─────────────────────┘     └──────────────────────┘     └─────────────────┘
                                     │
                                     ├────▶ Email service (Resend, SendGrid, etc.)
                                     ├────▶ LLM provider (OpenAI, Anthropic, etc.)
                                     └────▶ File storage (S3, Cloudinary, etc.)
```

### 1. Database Setup

The app uses two entities. Here is the PostgreSQL schema:

```sql
-- Users table (auth + profile)
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(255),
  role          VARCHAR(50) DEFAULT 'user',  -- 'admin' or 'user'
  is_verified   BOOLEAN DEFAULT FALSE,
  created_date  TIMESTAMPTZ DEFAULT NOW(),
  updated_date  TIMESTAMPTZ DEFAULT NOW()
);

-- Leads table (partnership inquiries from the form)
CREATE TABLE leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company       VARCHAR(255) NOT NULL,
  contact_name  VARCHAR(255) NOT NULL,
  email         VARCHAR(255) NOT NULL,
  region        VARCHAR(50) DEFAULT 'Global',
  -- region values: 'APAC', 'Europe', 'North America', 'MENA', 'Africa', 'LATAM', 'Global'
  service       VARCHAR(100) DEFAULT 'Multiple',
  -- service values: 'Data Centre Deployment', 'Network Deployment', 'Field Support', 'Dedicated Engineering Teams', 'Multiple'
  scope         TEXT,
  status        VARCHAR(50) DEFAULT 'new',
  -- status values: 'new', 'contacted', 'qualified', 'partnered'
  created_by_id UUID REFERENCES users(id),
  created_date  TIMESTAMPTZ DEFAULT NOW(),
  updated_date  TIMESTAMPTZ DEFAULT NOW()
);

-- OTP codes for registration verification
CREATE TABLE otp_codes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL,
  code          VARCHAR(10) NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  used          BOOLEAN DEFAULT FALSE,
  created_date  TIMESTAMPTZ DEFAULT NOW()
);

-- Password reset tokens
CREATE TABLE reset_tokens (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) NOT NULL,
  token         VARCHAR(255) UNIQUE NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  used          BOOLEAN DEFAULT FALSE,
  created_date  TIMESTAMPTZ DEFAULT NOW()
);

-- App public settings (returned on boot)
CREATE TABLE app_settings (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_settings JSONB DEFAULT '{}'::jsonb
);

-- Admin console sessions (OTP codes + session tokens)
CREATE TABLE admin_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id    VARCHAR(255) NOT NULL,
  otp_code      VARCHAR(10),
  purpose       VARCHAR(20) DEFAULT 'otp',  -- 'otp' or 'session'
  expires_at    TIMESTAMPTZ NOT NULL,
  used          BOOLEAN DEFAULT FALSE,
  created_date  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_otp_email ON otp_codes(email);
CREATE INDEX idx_admin_session_id ON admin_sessions(session_id);
```

### 2. Backend API Specification

Build a REST API (Node.js/Express, Fastify, NestJS, or any language). Below are the endpoints the frontend expects.

#### Auth

| Method | Path | Body | Returns |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{ email, password }` | `{ message }` (does NOT log in; user is unverified) |
| `POST` | `/api/auth/verify-otp` | `{ email, otpCode }` | `{ access_token, user }` |
| `POST` | `/api/auth/resend-otp` | `{ email }` | `{ message }` |
| `POST` | `/api/auth/login` | `{ email, password }` | `{ access_token, user }` |
| `GET` | `/api/auth/me` | (Bearer token) | `{ id, email, full_name, role }` |
| `POST` | `/api/auth/reset-request` | `{ email }` | `{ message }` (always 200, even if email not found) |
| `POST` | `/api/auth/reset` | `{ resetToken, newPassword }` | `{ message }` |
| `POST` | `/api/auth/logout` | (Bearer token) | `{ message }` |

**Auth flow:** Register creates an unverified user and emails an OTP. The user enters the OTP, which verifies them and returns an `access_token`. Store the token in `localStorage` as `base44_access_token`. All authenticated requests send `Authorization: Bearer <token>`.

**Token format:** Use JWT (HS256) with a strong secret. Include `user_id`, `email`, `role`, and an expiry in the payload.

#### Entities (Lead)

| Method | Path | Body / Query | Returns |
|---|---|---|---|
| `POST` | `/api/leads` | Lead object | Created lead |
| `GET` | `/api/leads` | `?sort=&limit=` | `[Lead]` |
| `GET` | `/api/leads/:id` | | Lead |
| `PATCH` | `/api/leads/:id` | Partial Lead | Updated lead |
| `DELETE` | `/api/leads/:id` | | `{ success: true }` |

Lead object shape:
```json
{
  "company": "string (required)",
  "contact_name": "string (required)",
  "email": "string (required, email format)",
  "region": "APAC | Europe | North America | MENA | Africa | LATAM | Global",
  "service": "Data Centre Deployment | Network Deployment | Field Support | Dedicated Engineering Teams | Multiple",
  "scope": "string",
  "status": "new | contacted | qualified | partnered"
}
```

#### App Settings

| Method | Path | Returns |
|---|---|---|
| `GET` | `/api/app/settings` | `{ id, public_settings }` |

This is called on every page load. Return an empty object if you have no public settings:
```json
{ "id": "any", "public_settings": {} }
```

#### File Upload (if needed)

| Method | Path | Body | Returns |
|---|---|---|---|
| `POST` | `/api/upload` | `multipart/form-data` with `file` field | `{ file_url: "https://..." }` |

Store files in S3, Cloudinary, or local disk and return a publicly accessible URL.

#### Admin Console (Ops Console)

| Method | Path | Body | Returns |
|---|---|---|---|
| `POST` | `/api/admin/login` | `{ username, password }` | `{ otpSent, sessionId }` |
| `POST` | `/api/admin/verify` | `{ sessionId, otp }` | `{ sessionToken }` |
| `POST` | `/api/admin/leads` | `{ sessionToken }` | `{ leads: [Lead] }` |
| `POST` | `/api/admin/logout` | `{ sessionToken }` | `{ success: true }` |

### 3. Replace the SDK Client

Replace the contents of `src/api/base44Client.js` with your own API client. This is the single integration point — everything else in the app imports from here.

```js
// src/api/base44Client.js
const API_BASE = import.meta.env.VITE_API_URL || '/api';

function getToken() {
  return localStorage.getItem('base44_access_token');
}

function setToken(token) {
  if (token) localStorage.setItem('base44_access_token', token);
  else localStorage.removeItem('base44_access_token');
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

export const base44 = {
  // --- Auth ---
  auth: {
    async me() {
      return request('/auth/me');
    },
    async loginViaEmailPassword(email, password) {
      const { access_token } = await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      setToken(access_token);
      return { access_token };
    },
    async register({ email, password }) {
      return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
    },
    async verifyOtp({ email, otpCode }) {
      const { access_token } = await request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otpCode }),
      });
      setToken(access_token);
      return { access_token };
    },
    async resendOtp(email) {
      return request('/auth/resend-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    async resetPasswordRequest(email) {
      return request('/auth/reset-request', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
    },
    async resetPassword({ resetToken, newPassword }) {
      return request('/auth/reset', {
        method: 'POST',
        body: JSON.stringify({ resetToken, newPassword }),
      });
    },
    isAuthenticated() {
      return Promise.resolve(!!getToken());
    },
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

  // --- App settings ---
  app: {
    async getPublicSettings() {
      return request('/app/settings');
    },
  },

  // --- Entities ---
  entities: {
    Lead: {
      async create(data) {
        return request('/leads', { method: 'POST', body: JSON.stringify(data) });
      },
      async list(sort, limit) {
        const params = new URLSearchParams();
        if (sort) params.set('sort', sort);
        if (limit) params.set('limit', limit);
        return request(`/leads?${params}`);
      },
      async filter(query, sort, limit) {
        const params = new URLSearchParams({ q: JSON.stringify(query) });
        if (sort) params.set('sort', sort);
        if (limit) params.set('limit', limit);
        return request(`/leads?${params}`);
      },
      async get(id) {
        return request(`/leads/${id}`);
      },
      async update(id, data) {
        return request(`/leads/${id}`, { method: 'PATCH', body: JSON.stringify(data) });
      },
      async delete(id) {
        return request(`/leads/${id}`, { method: 'DELETE' });
      },
    },
    // User entity is read-only from the frontend perspective
    User: {
      async list() { return request('/users'); },
      async get(id) { return request(`/users/${id}`); },
    },
  },

  // --- Integrations (implement as needed) ---
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
    },
  },

  // --- Users ---
  users: {
    async inviteUser(email, role) {
      return request('/users/invite', {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      });
    },
  },

  // --- Analytics ---
  analytics: {
    track({ eventName, properties }) {
      // Send to your analytics provider or no-op
      console.debug('[analytics]', eventName, properties);
    },
  },
};
```

### 4. Remove Base44 Build Dependencies

To fully decouple, remove the Base44 Vite plugin from `vite.config.js`:

```js
// vite.config.js (independent)
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:3000',  // your backend
    },
  },
});
```

Then uninstall the Base44 packages:

```bash
npm uninstall @base44/sdk @base44/vite-plugin
```

And remove the `base44/` directory (entities, functions, workflows, agents) — these are Base44-specific config files not used by the independent backend.

### 5. Environment Variables

Create a `.env` file in the project root:

```env
# Frontend
VITE_API_URL=https://your-api-domain.com/api

# Admin Console (Ops Console)
ADMIN_USERNAME=your-tough-username
ADMIN_PASSWORD=your-tough-password
ADMIN_OTP_EMAIL=your-email@gmail.com

# Backend (in your backend .env)
DATABASE_URL=postgresql://user:password@localhost:5432/iberix
JWT_SECRET=your-strong-random-secret
SMTP_HOST=smtp.your-provider.com
SMTP_PORT=587
SMTP_USER=your-smtp-user
SMTP_PASS=your-smtp-password
FROM_EMAIL=noreply@your-domain.com

# File storage (if using S3)
S3_BUCKET=your-bucket
S3_REGION=eu-west-1
S3_ACCESS_KEY=your-key
S3_SECRET_KEY=your-secret
```

### 6. Deployment

#### Frontend (static)

The built `./dist` folder is static. Deploy to any of:

- **Netlify:** Drag `dist/` into the dashboard, or connect the repo with build command `npm run build` and publish directory `dist`.
- **Vercel:** `vercel --prod` (auto-detects Vite).
- **Cloudflare Pages:** Connect repo, build command `npm run build`, output `dist`.
- **Nginx / Apache:** Copy `dist/` to your web root. Add a SPA fallback:
  ```nginx
  location / {
    try_files $uri $uri/ /index.html;
  }
  ```
- **Any CDN:** Upload `dist/` contents. Ensure `index.html` is served for all unknown routes (SPA routing).

#### Backend

Deploy your API backend to:

- **Railway / Render / Fly.io:** Connect repo, set env vars, deploy.
- **Docker:** Write a `Dockerfile` for your backend, deploy to any container host.
- **VPS:** Run Node.js behind Nginx with PM2 or systemd.

#### Database

- **Managed PostgreSQL:** Neon, Supabase, Railway, RDS, Cloud SQL.
- **Self-hosted:** PostgreSQL on your VPS.

### 7. Project Structure

```
src/
├── api/
│   └── base44Client.js       # ← Replace this with your API client
├── components/
│   ├── iberix/               # Brand components (Hero, Footer, etc.)
│   └── ui/                   # shadcn/ui primitives
├── data/                     # Static data (services, regions, coverage, legal)
├── i18n/                     # Region context + translations (EN/ES)
├── lib/                      # Auth context, utils, app params
├── pages/                    # Route pages (Home, ServiceSpec, RegionPage, OpsConsole, etc.)
├── App.jsx                   # Router
├── main.jsx                  # Entry point
└── index.css                 # Tailwind + design tokens
base44/                       # ← Remove for independent hosting
├── entities/                # Entity schemas (Lead.jsonc, AdminSession.jsonc)
├── functions/                # Backend functions (AdminConsole)
└── config.jsonc              # Base44 config
```

## License

Proprietary. Iberix Global Ltd. (Companies House UK, No. SC902201)