import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  // base: './' đảm bảo ứng dụng chạy tốt trên cả root domain (Vercel, Netlify)
  // và subpath (GitHub Pages, GitLab Pages) mà không bị lỗi đường dẫn assets
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    chunkSizeWarningLimit: 2000,
  }
});
