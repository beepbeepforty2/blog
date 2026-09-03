import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';

const postsDirectory = path.resolve('content/posts');
const failures = [];

for (const name of (await readdir(postsDirectory)).filter((entry) => entry.endsWith('.md') && !entry.startsWith('_'))) {
  const filename = path.join(postsDirectory, name);
  const source = await readFile(filename, 'utf8');
  const frontmatter = source.match(/^---\n([\s\S]*?)\n---\n/);
  if (!frontmatter) {
    failures.push(`${name}: missing YAML frontmatter`);
    continue;
  }
  const lines = frontmatter[1].split('\n');
  for (const field of ['title', 'description', 'date']) {
    const hasField = lines.some((line) => new RegExp(`^${field}:\\s*\\S`).test(line.trim()));
    if (!hasField) failures.push(`${name}: missing ${field}`);
  }
  if (/^#\s+/m.test(source.slice(frontmatter[0].length))) failures.push(`${name}: body must not contain an H1`);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*\.md$/.test(name)) failures.push(`${name}: filename is not a lowercase hyphenated slug`);
}

if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Post metadata and body structure are valid.');
