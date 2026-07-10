import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
  compressHTML: false,
  build: {
    inlineStylesheets: 'never'
  },
  vite: {
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
