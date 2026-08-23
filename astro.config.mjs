import { unified } from '@astrojs/markdown-remark';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { readdirSync, readFileSync } from 'node:fs';

const postDates = new Map();
for (const file of readdirSync('./src/content/posts')) {
  const raw = readFileSync(`./src/content/posts/${file}`, 'utf8');
  const lastmod = raw.match(/^updated:\s*['"]?([^\s'"]+)/m)?.[1] ?? raw.match(/^published:\s*['"]?([^\s'"]+)/m)?.[1];
  if (lastmod) postDates.set(file.replace(/\.md$/, ''), lastmod);
}

export default defineConfig({
  site: 'https://beepbeepforty2.github.io',
  base: '/blog',
  redirects: {
    '/posts': '/blog/',
  },
  integrations: [
    sitemap({
      serialize(item) {
        const slug = item.url.match(/\/posts\/([^/]+)\/?$/)?.[1];
        if (slug && postDates.has(slug)) item.lastmod = new Date(postDates.get(slug));
        return item;
      },
    }),
  ],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: {
      theme: 'css-variables',
      wrap: true,
    },
  },
});
