# Blog — agent instructions

Static personal blog: Astro + Cloudflare Pages at <https://undiscoveredmaterials.com/>.
`README.md` is the full reference for writing and publishing conventions. Read it before
first substantial change in a session.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Reproduce locked dependencies (CI parity) |
| `npm run dev` | Local dev server with hot reload |
| `npm run check` | Type-check Astro files + post metadata — run before every commit |
| `npm run build` | Production build to `dist/` — run before every push |
| `npm run preview` | Serve built site locally |

## Posts

- Markdown in `src/content/posts/`; filename = URL slug (lowercase, hyphen-separated,
  short). Never rename an existing post — old URLs do not redirect.
- Frontmatter schema is in `src/content.config.ts`: `title`, `description`,
  `published` (date or datetime), optional `updated`, `tags`, `draft`.
- The layout renders the frontmatter title as the page H1 — posts must not repeat it
  in the body. Sections start at `##`.
- Math: `$...$` inline, `$$...$$` display. KaTeX renders at build time; never convert
  plain text to LaTeX, and check built HTML for `katex-error` nodes or unrendered `$`
  delimiters when a post contains math.
- `draft: true` hides a post from both local and production builds.

## Publishing

Pushing to `main` triggers the Cloudflare Pages production build (<1 min).

- Full article publication (paste-in-chat workflow) is automated by the
  `publishing-blog-post` skill in `.agents/skills/` — prefer it over manual steps.
  Its rules take precedence over the README where they differ (e.g. `draft: false`,
  no clipboard inference).
- Manual flow: validate (`npm run check`, `npm run build`), commit only the post
  files, push `main`, poll the live URL for the new deployment, and verify HTTP 200
  plus the expected content. Cloudflare deployment status is available in its dashboard.
- For substantial post revisions, set the `updated` frontmatter date.

## Safety

- Commit only files related to the task at hand; leave unrelated worktree changes
  (e.g. `.agents/`, `.amp/`, `.grok/`) untouched unless the task is about them.
- `dist/` and `node_modules/` are local artifacts — never commit them.
- Never weaken validation or hard-code build output to make checks pass.
- Production deploys come only from `main`; never force-push it.
