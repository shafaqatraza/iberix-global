import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // frontend-only mode = static build for GitHub Pages (no Base44 plugin, relative assets)
  const isFrontendOnly = (env.VITE_HOSTING_MODE || process.env.VITE_HOSTING_MODE) === 'frontend-only';

  const plugins = [react()];
  if (!isFrontendOnly) {
    try {
      const { default: base44Plugin } = await import('@base44/vite-plugin');
      plugins.unshift(base44Plugin({
        legacySDKImports: false,
        hmrNotifier: true,
        navigationNotifier: true,
        analyticsTracker: true,
        visualEditAgent: true
      }));
    } catch {
      // @base44/vite-plugin not installed — independent deployment, skip it
    }
  }

  return {
    base: isFrontendOnly ? './' : '/',
    plugins,
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      }
    }
  };
});