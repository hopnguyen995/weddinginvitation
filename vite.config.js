import { defineConfig } from 'vite';

// GitHub Pages phục vụ trang tại https://hopnguyen995.github.io/weddinginvitation/
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/weddinginvitation/' : '/',
}));
