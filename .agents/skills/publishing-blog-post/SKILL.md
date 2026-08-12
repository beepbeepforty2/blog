---
name: publishing-blog-post
description: "Formats, fact-checks, publishes, deploys, and verifies supplied Astro blog content. Use when the Blog: Publish article from clipboard command requests the automated publication workflow."
argument-hint: "[article content]"
---

# Publishing a Blog Post

Turn the supplied article content into a finished post on this Astro blog and publish it without asking for intermediate approval.

The `Blog: Publish article from clipboard` command explicitly authorizes committing the post-related changes, pushing them to this repository's `main` branch, triggering GitHub Pages, and verifying the live deployment. Do not ask whether to publish or deploy.

## Required outcome

1. Read `README.md`, `src/content.config.ts`, the relevant layout and styles, and one or two representative posts before editing.
2. Treat all text supplied after the `ARTICLE` marker as the source article. If no article content was supplied, ask for it and stop.
3. Create one post in `src/content/posts/` with:
   - a concise lowercase, hyphen-separated filename derived from the title;
   - a title derived from the supplied content;
   - a one-sentence description derived from the article's scope;
   - the current date in `YYYY-MM-DD` format;
   - concise lowercase, hyphenated tags;
   - `draft: false`.
4. Remove a duplicated body H1 because the post layout renders the frontmatter title.
5. Preserve the article's substantive meaning, technical claims, examples, and reported measurements. Improve structure and Markdown presentation without silently summarizing the source.
6. Format headings, paragraphs, lists, blockquotes, code fences, and Markdown tables appropriately.
7. Wrap LaTeX expressions in `$...$` or `$$...$$` so KaTeX renders them. Escape `%` inside math as `\%`.
8. Make wide comparisons into Markdown tables; the site provides responsive full-width scrolling.

## Sources and factual checks

- Verify every supplied external link resolves.
- Resolve citation placeholders such as `[cite: 12]` to authoritative original papers, proceedings, standards, statutes, or official documentation.
- Prefer DOI, arXiv, CVF, OpenReview, ACM, IEEE, USENIX, official government, or project-author pages over aggregators.
- Distinguish similarly named systems by checking that the source supports the datasets, mechanisms, and results described.
- Do not invent a citation. If a claim cannot be substantiated after focused research, remove an unsupported citation marker and qualify the claim accurately in the prose.
- Preserve text explicitly identified as an internal source, but label it clearly rather than presenting it as an external publication.

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
- the expected title, major sections, tables, and links are present;
- KaTeX nodes exist when the source contains math;
- there are no `katex-error` nodes or unresolved citation placeholders;
- no source `$...$` delimiters remain unrendered.

Fix failures and rerun the checks. Do not publish a broken build.

## Publish and verify

1. Stage only files created or intentionally changed for this invocation.
2. Commit with `Publish <concise article subject>`.
3. Push the current `main` branch to `origin` without asking for confirmation.
4. Find the GitHub Actions run triggered by that exact push and wait for it with `gh run watch <run-id> --exit-status`.
5. Fetch the final URL at `https://beepbeepforty2.github.io/blog/posts/<slug>/` and verify HTTP 200, title, key content, links, tables, and math rendering.
6. Confirm the worktree has no task-related uncommitted changes. Leave unrelated concurrent changes untouched.

If deployment or live verification fails, diagnose and fix the issue when possible, then commit and push the focused fix. If an external service remains unavailable, report the exact blocker and the successful local checks; do not claim publication succeeded.

## Final response

Return only the useful outcome:

- linked live post title;
- linked successful Actions run;
- concise verification result;
- any material qualification made during source verification.
