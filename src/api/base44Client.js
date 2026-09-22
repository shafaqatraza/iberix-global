import { createIndependentClient } from '@/api/independentClient';

// Three modes (set VITE_HOSTING_MODE in .env):
// 1. 'base44' (default) — uses the Base44 SDK and platform backend
// 2. 'independent' — routes all calls to your own API at VITE_API_URL
// 3. 'frontend-only' — no backend, form submissions emailed via Web3Forms
const HOSTING_MODE = import.meta.env.VITE_HOSTING_MODE || 'base44';

let base44;

if (HOSTING_MODE === 'independent' || HOSTING_MODE === 'frontend-only') {
  // No Base44 SDK needed — use the lightweight independent client
  base44 = createIndependentClient();
} else {
  // Base44 mode — dynamically import the SDK so it's NOT bundled in static builds
  const { createClient } = await import('@base44/sdk');
  const { appParams } = await import('@/lib/app-params');
  const { appId, token, functionsVersion, appBaseUrl } = appParams;
  base44 = createClient({ appId, token, functionsVersion, serverUrl: '', appBaseUrl });
}

export { base44 };