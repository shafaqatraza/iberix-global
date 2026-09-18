import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { createIndependentClient } from '@/api/independentClient';

// Three modes (set VITE_HOSTING_MODE in .env):
// 1. 'base44' (default) — uses the Base44 SDK and platform backend
// 2. 'independent' — routes all calls to your own API at VITE_API_URL
// 3. 'frontend-only' — no backend, form submissions emailed via Web3Forms
const HOSTING_MODE = import.meta.env.VITE_HOSTING_MODE || 'base44';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

export const base44 = HOSTING_MODE === 'independent' || HOSTING_MODE === 'frontend-only'
  ? createIndependentClient()
  : createClient({ appId, token, functionsVersion, serverUrl: '', appBaseUrl });