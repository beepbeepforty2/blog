# Pratik’s notes

A minimal static blog built with [Astro](https://astro.build/) and deployed to GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

## Add a post

Create a Markdown file in `src/content/posts/`:

```md
---
title: Post title
description: A short summary.
published: 2026-08-11
tags: [typescript, tooling]
---

Your post goes here.
```

Set `draft: true` in the frontmatter to exclude a post from builds. Pushing to `main` deploys the site automatically.
