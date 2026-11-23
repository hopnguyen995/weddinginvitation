import { defineConfig } from 'vite';

// GitHub Pages phục vụ trang tại https://hopnguyen995.github.io/weddinginvitation/
export default defineConfig(({ command }) => ({
  // Root deploy works on Netlify, Vercel, Cloudflare Pages, or any static host.
  // Set BASE_PATH=/weddinginvitation/ only when building for GitHub Pages.
  base: process.env.BASE_PATH || '/',
}));
