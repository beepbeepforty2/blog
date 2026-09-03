import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import katex from 'katex';

const outputDirectory = path.resolve('dist');
const ignoredElements = new Set(['code', 'pre', 'script', 'style', 'textarea']);

function decodeEntities(value) {
  return value
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&#x27;', "'");
}

function renderExpression(expression, displayMode, filename) {
  try {
    const normalized = decodeEntities(expression).replace(/(?<!\\)%/g, '\\%');
    return katex.renderToString(normalized, {
      displayMode,
      output: 'htmlAndMathml',
      strict: false,
      throwOnError: true,
    });
  } catch (error) {
    throw new Error(`${filename}: unable to render ${displayMode ? 'display' : 'inline'} math ${JSON.stringify(expression)}: ${error.message}`);
  }
}

function renderText(text, filename) {
  const withDisplays = text.replace(/(?<!\\)\$\$([\s\S]+?)(?<!\\)\$\$/g, (_, expression) =>
    renderExpression(expression.trim(), true, filename),
  );
  return withDisplays.replace(/(?<!\\)\$([^$\n]+?)(?<!\\)\$/g, (_, expression) =>
    renderExpression(expression.trim(), false, filename),
  );
}

function renderHtml(html, filename) {
  const tokens = html.split(/(<!--[\s\S]*?-->|<[^>]+>)/g);
  const ignoredStack = [];

  return tokens
    .map((token) => {
      if (!token.startsWith('<') || token.startsWith('<!--')) {
        return ignoredStack.length === 0 ? renderText(token, filename) : token;
      }

      const closing = token.match(/^<\/\s*([a-zA-Z0-9-]+)/);
      if (closing && ignoredElements.has(closing[1].toLowerCase())) {
        if (ignoredStack.length && ignoredStack[ignoredStack.length - 1] === closing[1].toLowerCase()) {
          ignoredStack.pop();
        }
        return token;
      }

      const opening = token.match(/^<\s*([a-zA-Z0-9-]+)/);
      if (opening && ignoredElements.has(opening[1].toLowerCase()) && !token.endsWith('/>')) {
        ignoredStack.push(opening[1].toLowerCase());
      }
      return token;
    })
    .join('');
}

async function findHtmlFiles(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...(await findHtmlFiles(fullPath)));
    else if (entry.isFile() && entry.name.endsWith('.html')) files.push(fullPath);
  }
  return files;
}

let renderedExpressions = 0;
for (const filename of await findHtmlFiles(outputDirectory)) {
  const original = await readFile(filename, 'utf8');
  const rendered = renderHtml(original, filename);
  const count = (rendered.match(/class="katex(?:-display)?"/g) || []).length - (original.match(/class="katex(?:-display)?"/g) || []).length;
  renderedExpressions += count;
  if (rendered !== original) await writeFile(filename, rendered);
}

console.log(`Rendered ${renderedExpressions} math expressions with KaTeX.`);
