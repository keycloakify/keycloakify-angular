/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';
import { keycloakify } from 'keycloakify/vite-plugin';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2022'],
  },
  resolve: {
    mainFields: ['module'],
    alias: {
      'keycloakify-angular': path.resolve(__dirname, './dist/keycloakify-angular'),
    },
  },
  plugins: [
    angular(),
    keycloakify({
      accountThemeImplementation: 'none',
      keycloakVersionTargets: {
        '21-and-below': false,
        '22-and-above': 'my-keycloak-theme.jar',
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
