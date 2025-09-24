import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      onwarn: () => {}, // 경고 무시
    }
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
  server: {
    proxy: {
      '/api/riot': {
        target: 'https://kr.api.riotgames.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/riot/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      '/api/esports': {
        target: 'https://esports-api.lolesports.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/esports/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      '/api/leaguepedia': {
        target: 'https://lol.fandom.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/leaguepedia/, ''),
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      },
      '/api/analysis': {
        target: 'https://lol-banpick-analyzer-8g64.vercel.app',
        changeOrigin: true,
        rewrite: (path) => path
      }
    }
  }
})
