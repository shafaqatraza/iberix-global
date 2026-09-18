import { createIndependentClient } from '@/api/independentClient';

// The app always uses the independent backend (src/iberix-backend).
// All API calls route to VITE_API_URL (defaults to /api).
export const base44 = createIndependentClient();