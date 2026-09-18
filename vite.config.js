import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { fileURLToPath, URL } from 'node:url'

// Base44 vite plugin is optional — used in the Base44 preview, skipped for independent deployment.
// This lets the same codebase work in both environments without changes.
async function loadPlugins() {
  const plugins = [react()];
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
  return plugins;
}

export default defineConfig(async () => ({
  plugins: await loadPlugins(),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    }
  }
}));