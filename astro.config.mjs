import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

const allowedHosts = [
  'yb-recover.com',
  'www.yb-recover.com',
  'yb-response.com',
  'www.yb-response.com',
  'yb-alert.com',
  'www.yb-alert.com',
  'yb-check.com',
  'www.yb-check.com',
  'yb-case.com',
  'www.yb-case.com',
  'yb-safe.com',
  'www.yb-safe.com',
  'yb-help.com',
  'www.yb-help.com',
  'yb-watch.co.kr',
  'www.yb-watch.co.kr'
];

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  compressHTML: false,
  build: {
    inlineStylesheets: 'never'
  },
  vite: {
    server: {
      allowedHosts
    },
    preview: {
      allowedHosts
    },
    build: {
      cssMinify: false,
      minify: false,
      assetsInlineLimit: 0
    },
    ssr: {
      noExternal: []
    }
  }
});
