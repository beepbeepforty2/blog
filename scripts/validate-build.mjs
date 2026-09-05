import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('dist');
const postsDirectory = path.resolve('content/posts');
const entries = (await readdir(postsDirectory)).filter((entry) => entry.endsWith('.md') && !entry.startsWith('_'));
const postSlugs = [];
for (const entry of entries) {
  const source = await readFile(path.join(postsDirectory, entry), 'utf8');
  if (/^\s*draft:\s*true\s*$/m.test(source)) continue;
  postSlugs.push(entry.slice(0, -3));
}
postSlugs.sort();
const requiredFiles = [
  'index.html',
  'about/index.html',
  'resume/index.html',
  'rss.xml',
  'sitemap.xml',
  'robots.txt',
  '_redirects',
  'resume/pratik-chatse-resume.pdf',
  'resume/pratik-chatse-resume.md',
  'css/global.css',
  'css/katex.min.css',
  'giallo-light.css',
  'giallo-dark.css',
  ...postSlugs.map((slug) => `posts/${slug}/index.html`),
];

for (const relative of requiredFiles) await access(path.join(output, relative));

const index = await readFile(path.join(output, 'index.html'), 'utf8');
const themeCount = (index.match(/data-theme-id=/g) || []).length;
if (themeCount !== 20) throw new Error(`Expected 20 themes, found ${themeCount}`);
if (!index.includes('Built with Zola.')) throw new Error('Footer does not identify the Zola build');

for (const slug of postSlugs) {
  const html = await readFile(path.join(output, 'posts', slug, 'index.html'), 'utf8');
  const canonical = `https://undiscoveredmaterials.com/posts/${slug}/`;
  if (!html.includes(`<link rel="canonical" href="${canonical}">`)) throw new Error(`${slug}: canonical URL mismatch`);
  if (!html.includes('<meta property="og:type" content="article">')) throw new Error(`${slug}: missing article metadata`);
  if (html.includes('katex-error')) throw new Error(`${slug}: contains a KaTeX error`);
  if (html.includes('/_astro/')) throw new Error(`${slug}: contains an Astro asset URL`);
  if (html.includes('/js/katex.min.js') || html.includes('/js/auto-render.min.js')) throw new Error(`${slug}: production math depends on browser JavaScript`);
  if (/(?<!\\)\$[^$\n]+(?<!\\)\$/.test(html)) throw new Error(`${slug}: contains an unrendered math delimiter`);
}

const mathPost = await readFile(path.join(output, 'posts/privacy-preserving-computer-vision/index.html'), 'utf8');
if (!mathPost.includes('class="katex"')) throw new Error('Expected build-time KaTeX output was not found');

const rss = await readFile(path.join(output, 'rss.xml'), 'utf8');
if ((rss.match(/<item>/g) || []).length !== postSlugs.length) throw new Error('RSS item count mismatch');
if (rss.includes('<content:encoded>')) throw new Error('RSS unexpectedly contains full article content');

const sitemap = await readFile(path.join(output, 'sitemap.xml'), 'utf8');
for (const slug of postSlugs) {
  if (!sitemap.includes(`https://undiscoveredmaterials.com/posts/${slug}/`)) throw new Error(`${slug}: missing from sitemap`);
}

const robots = await readFile(path.join(output, 'robots.txt'), 'utf8');
if (!robots.includes('https://undiscoveredmaterials.com/sitemap.xml')) throw new Error('robots.txt points to the wrong sitemap');

const redirects = await readFile(path.join(output, '_redirects'), 'utf8');
for (const rule of ['/posts / 301', '/posts/ / 301', '/sitemap-index.xml /sitemap.xml 301', '/sitemap-0.xml /sitemap.xml 301']) {
  if (!redirects.includes(rule)) throw new Error(`Missing redirect rule: ${rule}`);
}

try {
  await access(path.join(output, 'posts/rss.xml'));
  throw new Error('Unexpected section feed at /posts/rss.xml');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const katexFonts = (await readdir(path.join(output, 'css/fonts'))).filter((name) => name.startsWith('KaTeX_'));
if (!katexFonts.length) throw new Error('No KaTeX fonts were copied into dist/css/fonts');

const siteFonts = [
  'FantasqueSansMono-Regular.woff2',
  'FantasqueSansMono-Bold.woff2',
  'FantasqueSansMono-Italic.woff2',
  'FantasqueSansMono-BoldItalic.woff2',
];
for (const name of siteFonts) await access(path.join(output, 'fonts', name));

console.log('Generated routes, metadata, feeds, sitemap, assets, themes, and math are valid.');
