import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://beepbeepforty2.github.io',
  base: '/blog',
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
