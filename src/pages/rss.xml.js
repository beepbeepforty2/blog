import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = (await getCollection('posts', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.published.valueOf() - a.data.published.valueOf(),
  );
  const base = `${import.meta.env.BASE_URL.replace(/\/$/, '')}/`;

  return rss({
    title: 'Pratik’s notes',
    description: 'Notes on software, systems, and building things.',
    site: new URL(base, context.site),
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.published,
      link: `posts/${post.id}/`,
    })),
  });
}
