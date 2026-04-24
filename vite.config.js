import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { execSync } from 'child_process';

let gitHash = 'unknown';
let gitBranch = 'unknown';

try {
  gitHash = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
  gitBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
} catch (err) {
  console.warn('No git info available');
}

export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __GIT_HASH__: JSON.stringify(gitHash),
    __GIT_BRANCH__: JSON.stringify(gitBranch),
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
