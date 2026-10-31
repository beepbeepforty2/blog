import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import katex from '../vendor/katex/katex.mjs';

const outputDirectory = path.resolve('dist');
// <head> and <header> hold the page and post titles, which stay plain text.
const ignoredElements = new Set(['head', 'header', 'code', 'pre', 'script', 'style', 'textarea']);

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
  // One pass so `\$` inside an expression stays part of it. Markdown `\\$`
  // arrives as `\$` and is emitted as an entity, i.e. a literal dollar sign.
  return text.replace(
    /(?<!\\)\$\$([\s\S]+?)(?<!\\)\$\$|(?<!\\)\$((?:\\.|[^\\$\n])+?)\$|\\\$/g,
    (_, display, inline) => {
      if (display !== undefined) return renderExpression(display.trim(), true, filename);
      if (inline !== undefined) return renderExpression(inline.trim(), false, filename);
      return '&#36;';
    },
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
  let rendered = renderHtml(original, filename);
  const count = (rendered.match(/class="katex(?:-display)?"/g) || []).length - (original.match(/class="katex(?:-display)?"/g) || []).length;
  renderedExpressions += count;
  if (!rendered.includes('class="katex')) {
    rendered = rendered.replace(/\s*<link rel="stylesheet" href="\/css\/katex\.min\.css\?h=[^"]+">\n?/, '\n');
  }
  if (rendered !== original) await writeFile(filename, rendered);
}

console.log(`Rendered ${renderedExpressions} math expressions with KaTeX.`);
