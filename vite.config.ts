/// <reference types="vitest" />

import angular from '@analogjs/vite-plugin-angular';
import path from 'node:path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig(() => ({
  build: {
    target: ['es2022'],
  },
  resolve: {
    mainFields: ['module'],
    alias: {
      'keycloakify-angular': path.resolve(__dirname, './dist/keycloakify-angular'),
    },
  },
  plugins: [angular()],
}));
