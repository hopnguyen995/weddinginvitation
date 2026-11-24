import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { copyFileSync, existsSync } from 'node:fs';
import { defineConfig } from 'vite';

// GitHub Pages: BASE_PATH=/weddinginvitation/ (đặt trong .github/workflows/deploy.yml)
// Netlify/Vercel/Cloudflare: để trống → '/'
const ROOT = dirname(fileURLToPath(import.meta.url));
const BASE = process.env.BASE_PATH || '/';
// Địa chỉ đầy đủ của trang, dùng cho ảnh/link xem trước khi gửi qua Zalo, Messenger, Facebook
const SITE_URL = process.env.SITE_URL || 'https://hopnguyen995.github.io/weddinginvitation/';

export default defineConfig({
  base: BASE,
  plugins: [{
    name: 'site-url',
    transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', SITE_URL.endsWith('/') ? SITE_URL : `${SITE_URL}/`),
  }, {
    // GitHub Pages: link dạng /weddinginvitation/anh-nam không có file → GitHub trả 404.html.
    // Cho 404.html chính là thiệp để tên khách vẫn hiện (thiệp tự đọc tên từ đường dẫn).
    name: 'spa-404',
    apply: 'build',
    closeBundle() {
      const out = resolve(ROOT, 'dist');
      if (existsSync(resolve(out, 'index.html'))) copyFileSync(resolve(out, 'index.html'), resolve(out, '404.html'));
    },
  }],
  build: {
    rollupOptions: {
      input: {
        main: resolve(ROOT, 'index.html'),       // thiệp nhà trai
        groom: resolve(ROOT, 'nha-trai/index.html'), // thiệp nhà trai (/nha-trai/)
        bride: resolve(ROOT, 'nha-gai/index.html'), // thiệp nhà gái
      },
    },
  },
});
