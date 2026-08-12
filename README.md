# Pratik’s notes

A minimal static blog built with [Astro](https://astro.build/) and deployed to [GitHub Pages](https://beepbeepforty2.github.io/blog/).

This README is the reference for writing, previewing, and publishing posts.

## Publish with Amp

From an Amp thread opened in this repository:

1. Copy the complete article to the macOS clipboard.
2. Type `/` or press `Ctrl+O` to open Amp's command palette.
3. Run **Blog: Publish article from clipboard**.

The command sends the copied article to the project publishing skill. It derives the post metadata, formats Markdown and math, resolves citation placeholders, validates the site, commits and pushes the post, waits for GitHub Pages, and verifies the live URL. Running the command authorizes that complete publication workflow, so it does not pause for deployment confirmation.

Amp does not expose project skills as `/skill-name` commands. To invoke the underlying skill manually, open the palette, run **skill: invoke**, select `publishing-blog-post`, and send the article in the next message.

## Quick start

From the repository directory:

```sh
npm install
npm run dev
```

Open the URL printed by Astro. The development server reloads when a post is saved.

## Create a post

Create a Markdown file in `src/content/posts/`. The filename becomes the URL, so use a short, lowercase, hyphen-separated name:

```text
src/content/posts/understanding-event-loops.md
```

That post will be published at:

```text
https://beepbeepforty2.github.io/blog/posts/understanding-event-loops/
```

Copy this template:

```md
---
title: Understanding event loops
description: A short summary shown on the home page and in the RSS feed.
published: 2026-08-11
tags: [javascript, runtimes]
draft: true
---

Start writing here.

## A section

Explain one idea at a time. Use links, lists, quotes, and code where useful.
```

### Frontmatter fields

The block between the `---` lines is the post's metadata.

| Field | Required | Purpose |
| --- | --- | --- |
| `title` | Yes | The post heading and browser-page title. |
| `description` | Yes | A short summary for the home page, metadata, and RSS feed. |
| `published` | Yes | Publication date in `YYYY-MM-DD` format. |
| `updated` | No | Last substantial update in `YYYY-MM-DD` format. |
| `tags` | No | A list such as `[astro, github]`. Defaults to an empty list. |
| `draft` | No | Set to `true` to hide the post from production. Defaults to `false`. |

Keep `draft: true` while working. Remove the field or change it to `false` when the post is ready.

## Markdown examples

### Headings

Use the post title from frontmatter as the page's only top-level heading. Begin sections with `##`:

```md
## Main section

### Smaller subsection
```

### Links, emphasis, lists, and quotes

```md
Read the [Astro documentation](https://docs.astro.build/).

Use **bold text** sparingly and use *italics* for emphasis.

- First item
- Second item
  - Nested item

1. First step
2. Second step

> A useful quotation or callout.
```

### Inline code

Wrap commands, filenames, variables, and short expressions in backticks:

```md
Run `npm run build` before publishing and edit `astro.config.mjs` to change the site configuration.
```

### Code blocks

Use three backticks and include the language name for syntax highlighting:

````md
```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error };

const result: Result<number> = { ok: true, value: 42 };
```
````

Common language identifiers include `ts`, `js`, `tsx`, `json`, `sh`, `bash`, `python`, `go`, `rust`, `sql`, `html`, `css`, and `yaml`.

To show terminal input without syntax highlighting:

````md
```text
$ npm run build
```
````

### Math

Use dollar signs for inline LaTeX:

```md
The privacy budget is $(\epsilon, \delta)$ and the clipping threshold is $C$.
```

Use double dollar signs on separate lines for a displayed equation:

```md
$$
\Pr[M(D) \in S] \le e^\epsilon \Pr[M(D') \in S] + \delta
$$
```

Math is rendered with KaTeX during the static build, so it does not require client-side JavaScript.

## Preview before publishing

Run the development server while writing:

```sh
npm run dev
```

Draft posts are intentionally hidden from both local and production builds. Temporarily set `draft: false` to preview the finished page, then restore it to `true` if it is not ready to publish.

Before pushing, validate the content and create a production build:

```sh
npm run check
npm run build
```

To inspect the generated production site locally:

```sh
npm run preview
```

## Publish a post

1. Set `draft: false` or remove the `draft` field.
2. Check the title, description, and publication date.
3. Run `npm run check` and `npm run build`.
4. Commit and push to `main`:

```sh
git add src/content/posts/understanding-event-loops.md
git commit -m "Add post about event loops"
git push
```

Pushing to `main` starts the GitHub Actions workflow in `.github/workflows/deploy.yml`. A successful run publishes the updated site to:

```text
https://beepbeepforty2.github.io/blog/
```

Deployment usually takes less than a minute. Its status is available on the repository's **Actions** tab.

## Update an existing post

Edit its Markdown file and add or change the `updated` date when the revision is substantial:

```yaml
published: 2026-08-11
updated: 2026-09-02
```

Then validate, commit, and push as usual. Do not change the filename unless the post URL should also change; old URLs are not redirected automatically.

## Useful commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install or update local dependencies. |
| `npm ci` | Reproduce the exact locked dependencies, as CI does. |
| `npm run dev` | Start the local development server. |
| `npm run check` | Validate Astro files, TypeScript, and post metadata. |
| `npm run build` | Generate the static production site in `dist/`. |
| `npm run preview` | Serve the generated production build locally. |

## Project map

```text
src/content/posts/        Blog posts written in Markdown
src/content.config.ts     Allowed post metadata
src/layouts/Base.astro    Shared page layout and site navigation
src/pages/                Home, post, About, and RSS routes
src/styles/global.css     Site styling
astro.config.mjs          Site URL, GitHub Pages base path, and code theme
.github/workflows/        Automatic GitHub Pages deployment
.agents/skills/           Project-specific Amp publishing workflow
.amp/plugins/             Project-specific Amp command-palette actions
```

The generated `dist/` directory and `node_modules/` are local build artifacts and should not be committed.
