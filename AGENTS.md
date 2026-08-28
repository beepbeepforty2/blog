# Blog — agent instructions

Static personal blog: Zola + Cloudflare Workers static assets at <https://undiscoveredmaterials.com/>.
`README.md` is the full reference for writing and publishing conventions. Read it before
first substantial change in a session.

## Commands

| Command | Purpose |
| --- | --- |
| `npm ci` | Reproduce locked dependencies (CI parity) |
| `npm run dev` | Local dev server with hot reload |
| `npm run check` | Validate Zola content, links, and post metadata — run before every commit |
| `npm run build` | Build Zola, render KaTeX, and validate `dist/` — run before every push |
| `npm run preview` | Serve built site locally |

## Posts

- Markdown in `content/posts/`; filename = URL slug (lowercase, hyphen-separated,
  short). Never rename an existing post — old URLs do not redirect.
- Frontmatter uses `title`, `description`, `date` (date or datetime), optional
  `updated`, `taxonomies.tags`, and `draft`; `scripts/validate-content.mjs` enforces
  the required project conventions.
- The layout renders the frontmatter title as the page H1 — posts must not repeat it
  in the body. Sections start at `##`.
- Math: `$...$` inline, `$$...$$` display. KaTeX renders at build time; never convert
  plain text to LaTeX, and check built HTML for `katex-error` nodes or unrendered `$`
  delimiters when a post contains math.
- `draft: true` hides a post from production; `npm run dev` includes drafts.

## Publishing

Pushing to `main` triggers the `Workers Builds: blog` production check (<1 min).

- Full article publication (paste-in-chat workflow) is automated by the
  `publishing-blog-post` skill in `.agents/skills/` — prefer it over manual steps.
  Its rules take precedence over the README where they differ (e.g. `draft: false`,
  no clipboard inference).
- Manual flow: validate (`npm run check`, `npm run build`), commit only the post
  files, push `main`, wait for the exact commit's `Workers Builds: blog` check to
  succeed, then verify the live URL returns HTTP 200 with the expected content.
  The check links to the Cloudflare build logs.
- For substantial post revisions, set the `updated` frontmatter date.

## Safety

- Commit only files related to the task at hand; leave unrelated worktree changes
  (e.g. `.agents/`, `.amp/`, `.grok/`) untouched unless the task is about them.
- `dist/`, `.tools/`, and `node_modules/` are local artifacts — never commit them.
- Never weaken validation or hard-code build output to make checks pass.
- Production deploys come only from `main`; never force-push it.
