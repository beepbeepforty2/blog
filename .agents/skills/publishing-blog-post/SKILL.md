---
name: publishing-blog-post
description: "Publishes, deploys, and verifies final Astro blog content supplied directly in chat. Use when the Blog: Publish an article command requests the automated publication workflow."
argument-hint: "[article content]"
---

# Publishing a Blog Post

Turn the final article supplied directly in chat into a post on this Astro blog and publish it without asking for intermediate approval.

The `Blog: Publish an article` command first asks the user to paste the final article into chat. Never read or infer article content from the clipboard. Once the user supplies the article, the command explicitly authorizes committing the post-related changes, pushing them to this repository's `main` branch, triggering the Cloudflare Pages deploy, and verifying the live deployment. Do not ask whether to publish or deploy.

## Required outcome

1. Read `README.md`, `src/content.config.ts`, the relevant layout and styles, and one or two representative posts before editing.
2. Treat the complete article supplied in the user's next chat message as the final article. If no article content was supplied directly in chat, ask the user to paste it and stop. An `ARTICLE` marker is not required.
3. Create one post in `src/content/posts/` with:
   - a concise lowercase, hyphen-separated filename derived from the title;
   - a title derived from the supplied content;
   - a one-sentence description derived from the article's scope;
   - the current date in `YYYY-MM-DD` format;
   - concise lowercase, hyphenated tags;
   - `draft: false`.
4. Remove a duplicated body H1 because the post layout renders the frontmatter title.
5. Treat the pasted article as the final editorial outcome. Preserve its wording, structure, technical claims, examples, measurements, links, and formatting. Do not rewrite, summarize, fact-check, audit, correct, qualify, or add citations.
6. Make only the mechanical transformations required to publish it: add frontmatter, remove the duplicated body H1, and retain valid Markdown as supplied.
7. Do not reinterpret plain-text expressions as LaTeX. Preserve any `$...$` or `$$...$$` math already supplied so KaTeX can render it.

## Content handling

- Do not perform web research or external source verification.
- Do not test whether supplied links resolve.
- Do not resolve, remove, or alter citation placeholders.
- Do not make editorial judgments about claims, wording, tone, or completeness.
- Derive only the required frontmatter fields from the supplied title and content.

## Collision and scope safety

- If the derived filename already belongs to a different article, choose a more specific unique slug; never overwrite an existing post unless the user explicitly requested an update.
- Do not modify unrelated files or include unrelated worktree changes in the commit.
- Small post-presentation fixes necessary for correct rendering may be included, but avoid unrelated site redesigns.
- Never weaken validation or hard-code generated output to force a passing check.

## Validate before publishing

Run:

```sh
npm run check
npm run build
git diff --check
```

Also inspect the generated post in `dist/posts/<slug>/index.html` and verify:

- the route exists;
- the supplied title and body content are present;
- KaTeX nodes exist when the source contains math;
- there are no `katex-error` nodes;
- no source `$...$` delimiters remain unrendered.

Fix failures and rerun the checks. Do not publish a broken build.

## Publish and verify

1. Stage only files created or intentionally changed for this invocation.
2. Commit with `Publish <concise article subject>`.
3. Push the current `main` branch to `origin` without asking for confirmation.
4. Pushing `main` triggers the Cloudflare Pages production build. Poll the final URL until the new post is live (typically under a minute; give up after five minutes and report the blocker) instead of waiting for a GitHub Actions run.
5. Fetch the final URL at `https://undiscoveredmaterials.com/posts/<slug>/` and verify HTTP 200 plus the presence of the supplied title, content, links, tables, and math rendering.
6. Confirm the worktree has no task-related uncommitted changes. Leave unrelated concurrent changes untouched.

If deployment or live verification fails, diagnose and fix the issue when possible, then commit and push the focused fix. If an external service remains unavailable, report the exact blocker and the successful local checks; do not claim publication succeeded.

## Final response

Return only the useful outcome:

- linked live post title;
- concise local and live verification result;
- any deployment blocker if Cloudflare Pages does not complete successfully.
