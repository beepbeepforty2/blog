---
title: Hello, world
description: A small first post, and a quick tour of writing here.
published: 2026-08-11
tags: [meta]
---

This is a deliberately simple, static blog. Posts are Markdown files, which means writing is mostly just writing.

## Code looks like this

Astro renders fenced code blocks with syntax highlighting at build time:

```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error };

export function attempt<T>(fn: () => T): Result<T> {
  try {
    return { ok: true, value: fn() };
  } catch (error) {
    return { ok: false, error: error as Error };
  }
}
```

There is no server, database, account, or client-side framework involved. GitHub Actions builds the HTML and GitHub Pages serves it.

## Publishing a post

Add a file to `src/content/posts`, fill in its frontmatter, commit, and push. The deployment workflow handles the rest.
