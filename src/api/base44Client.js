import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';
import { createIndependentClient } from '@/api/independentClient';

// Flip VITE_HOSTING_MODE in .env to switch between Base44 and independent hosting.
//   'base44' (default)     → uses the Base44 SDK and platform backend
//   'independent'          → routes all calls to your own API at VITE_API_URL
// No other code changes are needed — every file imports { base44 } from here.
const HOSTING_MODE = import.meta.env.VITE_HOSTING_MODE || 'base44';

const { appId, token, functionsVersion, appBaseUrl } = appParams;

export const base44 = HOSTING_MODE === 'independent'
  ? createIndependentClient()
  : createClient({ appId, token, functionsVersion, serverUrl: '', appBaseUrl });