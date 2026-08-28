# Pratik’s notes

A static personal blog built with [Zola](https://www.getzola.org/) and deployed with [Cloudflare Workers](https://workers.cloudflare.com/) static assets at [undiscoveredmaterials.com](https://undiscoveredmaterials.com/).

This README is the reference for writing, previewing, validating, and publishing posts.

## Toolchain

The repository pins Zola 0.23.4. `scripts/install-zola.sh` downloads the appropriate official binary for macOS or Linux, verifies its SHA-256 checksum, and stores it under the ignored `.tools/` directory.

Node is retained only for the pinned KaTeX build step and generated-site validation. Zola owns content loading, Markdown rendering, templates, routes, RSS, sitemap generation, and static output.

Install the locked Node dependency:

```sh
npm ci
```

The first `npm run check`, `npm run build`, or `npm run dev` downloads the pinned Zola binary if it is absent.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Install the locked KaTeX dependency. |
| `npm run dev` | Start Zola’s local server with drafts and live reload. |
| `npm run check` | Validate Zola content, internal links, post metadata, slugs, and heading structure. |
| `npm run build` | Check the site, build into `dist/`, render math with KaTeX, and validate generated output. |
| `npm run preview` | Serve the completed `dist/` build at `http://localhost:4321/`. |

## Project map

```text
content/posts/          Markdown posts
content/_index.md       Home section configuration
content/posts/_index.md Post section configuration
templates/              Tera layouts and partials
static/css/             Site, theme, syntax, and KaTeX styles
static/js/              Theme and browser behavior
static/fonts/           Self-hosted site fonts
scripts/                Zola installation, build, math, and validation scripts
zola.toml               Site URL, Markdown, feed, sitemap, and taxonomy configuration
wrangler.jsonc          Cloudflare Workers static-assets configuration
.agents/skills/         Automated article publishing workflow
.amp/plugins/           Amp command-palette integration
```

`dist/`, `.tools/`, and `node_modules/` are generated local artifacts and must not be committed.

## Create a post

Create a Markdown file in `content/posts/`. Its filename becomes the URL slug, so use a short lowercase name separated by hyphens:

```text
content/posts/understanding-event-loops.md
```

The resulting URL is:

```text
https://undiscoveredmaterials.com/posts/understanding-event-loops/
```

Use this frontmatter structure:

```md
---
title: Understanding event loops
description: A short summary shown on the home page and in the RSS feed.
date: 2026-08-28
taxonomies:
  tags: [javascript, runtimes]
draft: true
---

Start writing here.

## A section

Explain one idea at a time. Use links, lists, quotes, and code where useful.
```

### Frontmatter

| Field | Required | Purpose |
| --- | --- | --- |
| `title` | Yes | Post heading and browser title. |
| `description` | Yes | Home-page, metadata, and RSS summary. |
| `date` | Yes | Publication date or RFC 3339 datetime. |
| `updated` | No | Date of the latest substantial revision. |
| `taxonomies.tags` | No | Lowercase tags used as metadata. |
| `draft` | No | Excludes the post unless Zola is run with `--drafts`. Defaults to `false`. |

Keep `draft: true` while writing. `npm run dev` includes drafts. Production builds exclude them.

The post template renders the frontmatter title as the only page H1. Begin body sections at `##`.

Do not rename a published post unless its URL is intentionally changing. Old post URLs are not inferred or redirected automatically.

## Markdown and code

Zola renders CommonMark with GitHub-style tables, task lists, strikethrough, and fenced code blocks.

Use a language identifier on fenced code:

````md
```ts
type Result<T> =
  | { ok: true; value: T }
  | { ok: false; error: Error };
```
````

Syntax highlighting uses Zola’s generated light and dark Giallo styles. The site’s twenty visual themes share the appropriate light or dark token palette.

Existing punctuation-sensitive heading IDs are explicitly recorded with Zola’s `{#id}` syntax where required. Preserve those suffixes when revising a heading because they protect published deep links.

## Themes and navigation

The twenty palettes are defined in `static/css/themes.css`. `templates/partials/theme-selector.html` contains the picker, and `static/js/themes.js` handles selection, the light/dark toggle, favicon color, browser-storage synchronization, and horizontal positioning within the picker.

`templates/base.html` contains a small inline theme bootstrap before the stylesheet links. It restores `data-theme` and `data-theme-mode` from browser storage before the first paint, preventing a page from briefly rendering in the default palette during normal full-page navigation. The storage keys are `theme`, `theme-mode`, `theme-dark`, and `theme-light`.

Initial picker synchronization must remain non-animated. Intentional theme changes may animate the picker horizontally. Keep that movement local to the picker strip; viewport-level methods such as `scrollIntoView()` can move the page during navigation and make the header or picker appear to redraw. `scrollbar-gutter: stable` in `static/css/global.css` reserves consistent scrollbar space between pages of different lengths.

The site uses ordinary static links rather than client-side route transitions. Navigation stability depends on the pre-paint theme bootstrap and stable layout, not on retained component state.

## Math

Use dollar signs for inline LaTeX:

```md
The privacy budget is $(\epsilon, \delta)$ and the clipping threshold is $C$.
```

Use double dollar signs for display math:

```md
$$
\Pr[M(D) \in S] \le e^\epsilon \Pr[M(D') \in S] + \delta
$$
```

`npm run build` renders math into static KaTeX HTML. Production pages do not require client-side JavaScript for equations. Zola’s development server loads the local KaTeX auto-render helper so math is visible during live preview.

The build fails on invalid expressions. It also checks for missing KaTeX output and `katex-error` nodes.

## Preview and validate

Start the live development server:

```sh
npm run dev
```

Before every commit:

```sh
npm run check
npm run build
git diff --check
```

The production build verifies routes, canonical URLs, article metadata, RSS entry count, sitemap membership, redirects, static downloads, theme count, syntax styles, and build-time math.

To inspect the exact production output:

```sh
npm run preview
```

## Publish with Amp

From an Amp thread opened in this repository:

1. Type `/` or press `Ctrl+O` to open the command palette.
2. Run **Blog: Publish an article**.
3. Paste the complete final article into the chat when prompted.

The command invokes the `publishing-blog-post` project skill. It creates the Zola post, runs the validation and production build, commits only the post-related files, pushes `main`, waits for the Cloudflare Workers check, and verifies the live URL.

Amp does not expose project skills as direct slash commands. To invoke it manually, run **skill: invoke**, select `publishing-blog-post`, and provide the article in the next message.

## Manual publishing

1. Set `draft: false` or remove the `draft` field.
2. Check the title, description, date, and tags.
3. Run `npm run check`, `npm run build`, and `git diff --check`.
4. Commit only the intended files.
5. Push `main`.
6. Wait for the exact commit’s `Workers Builds: blog` check to succeed.
7. Verify the live URL returns HTTP 200 with the expected content.

For substantial revisions, set or update the `updated` field.

## Cloudflare Workers deployment

Pushing `main` triggers the production Workers Build. The configured build command remains `npm run build`. The script installs the pinned Zola binary, creates `dist/`, and performs the KaTeX and output validation steps. `wrangler.jsonc` publishes `./dist` as static assets.

Public routes retain trailing slashes:

```text
/
/about/
/resume/
/posts/<slug>/
/rss.xml
/sitemap.xml
```

`static/_redirects` keeps `/posts` redirected to the homepage and redirects the previous Astro sitemap filenames to `/sitemap.xml`.

The manual GitHub Pages workflow in `.github/workflows/deploy.yml` remains separate. It publishes the legacy redirect stubs from `redirect/` and does not deploy this site.
