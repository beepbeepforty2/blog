import { createSign } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';

const SITE_ORIGIN = 'https://undiscoveredmaterials.com';
const SITEMAP_URL = `${SITE_ORIGIN}/sitemap.xml`;
const INDEXNOW_KEY = 'b8f4e2a9c1d6473890ab5e3c7f1d2046';
const DEFAULT_GSC_KEY_PATH = path.join(os.homedir(), '.config', 'gsc', 'undiscoveredmaterials.json');

function base64url(input) {
  return Buffer.from(input).toString('base64url');
}

async function loadServiceAccount() {
  const keyPath = process.env.GSC_CREDENTIALS_FILE || DEFAULT_GSC_KEY_PATH;
  try {
    const raw = await readFile(keyPath, 'utf8');
    const parsed = JSON.parse(raw);
    if (!parsed.client_email || !parsed.private_key) {
      throw new Error(`Invalid service account JSON at ${keyPath} (missing client_email or private_key)`);
    }
    return { ...parsed, keyPath };
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    throw error;
  }
}

async function getGoogleAccessToken(serviceAccount, scopes) {
  const now = Math.floor(Date.now() / 1000);
  const header = base64url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claimSet = base64url(
    JSON.stringify({
      iss: serviceAccount.client_email,
      scope: scopes.join(' '),
      aud: 'https://oauth2.googleapis.com/token',
      iat: now,
      exp: now + 3600,
    }),
  );
  const unsigned = `${header}.${claimSet}`;
  const signer = createSign('RSA-SHA256');
  signer.update(unsigned);
  const signature = signer.sign(serviceAccount.private_key, 'base64url');
  const assertion = `${unsigned}.${signature}`;

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion,
    }),
  });
  if (!response.ok) {
    throw new Error(`OAuth token exchange failed (${response.status}): ${await response.text()}`);
  }
  const data = await response.json();
  return data.access_token;
}

async function resolveGscProperty(token) {
  if (process.env.GSC_SITE_URL) return process.env.GSC_SITE_URL;
  const response = await fetch('https://www.googleapis.com/webmasters/v3/sites', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) {
    throw new Error(`Failed to list Search Console properties (${response.status}): ${await response.text()}`);
  }
  const data = await response.json();
  const entries = (data.siteEntry || []).map((entry) => entry.siteUrl);
  const candidates = ['sc-domain:undiscoveredmaterials.com', `${SITE_ORIGIN}/`, SITE_ORIGIN];
  for (const candidate of candidates) {
    if (entries.includes(candidate)) return candidate;
  }
  throw new Error(
    `Service account has access to [${entries.join(', ') || 'none'}], but not undiscoveredmaterials.com. ` +
      'Add the service account client_email to Google Search Console -> Settings -> Users and permissions.',
  );
}

async function getSitemapUrls() {
  try {
    const xml = await readFile(path.resolve('dist/sitemap.xml'), 'utf8');
    return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1].trim());
  } catch (_) {
    const response = await fetch(SITEMAP_URL);
    if (!response.ok) throw new Error(`Unable to read local dist/sitemap.xml or fetch ${SITEMAP_URL}`);
    const xml = await response.text();
    return Array.from(xml.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1].trim());
  }
}

async function auditLiveUrls(urls) {
  console.log(`\n=== 1. Live Googlebot Crawl & Canonical Audit (${urls.length} URLs) ===`);
  const googlebotUA = 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)';

  const robotsRes = await fetch(`${SITE_ORIGIN}/robots.txt`, { headers: { 'User-Agent': googlebotUA } });
  const robotsTxt = await robotsRes.text();
  const robotsOk = robotsRes.status === 200 && robotsTxt.includes(`Sitemap: ${SITEMAP_URL}`);
  console.log(`robots.txt  : HTTP ${robotsRes.status} (${robotsOk ? 'OK' : 'WARN: check Sitemap directive'})`);

  const sitemapRes = await fetch(SITEMAP_URL, { headers: { 'User-Agent': googlebotUA } });
  console.log(`sitemap.xml : HTTP ${sitemapRes.status} (${sitemapRes.status === 200 ? 'OK' : 'FAIL'})`);

  let issues = 0;
  for (const url of urls) {
    const res = await fetch(url, {
      headers: { 'User-Agent': googlebotUA },
      redirect: 'manual',
    });
    const xRobots = res.headers.get('x-robots-tag') || '';
    const cfMitigated = res.headers.get('cf-mitigated') || '';
    const body = res.status === 200 ? await res.text() : '';
    const canonicalMatch = body.match(/<link\s+rel="canonical"\s+href="([^"]+)"/i);
    const canonical = canonicalMatch ? canonicalMatch[1] : null;
    const hasNoindexMeta = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*noindex/i.test(body);
    const hasJsonLd = /<script type="application\/ld\+json">/i.test(body);

    const problems = [];
    if (res.status !== 200) problems.push(`HTTP ${res.status}`);
    if (cfMitigated) problems.push(`Cloudflare challenge (${cfMitigated}) — disable Bot Fight Mode`);
    if (/noindex/i.test(xRobots) || hasNoindexMeta) problems.push('noindex detected');
    if (canonical !== url) problems.push(`canonical mismatch (${canonical})`);
    if (!hasJsonLd) problems.push('missing JSON-LD on live page');

    if (problems.length) {
      issues++;
      console.log(`  [WARN] ${url} -> ${problems.join(', ')}`);
    } else {
      console.log(`  [OK]   ${url} (HTTP 200, canonical OK, JSON-LD OK)`);
    }
  }
  if (issues === 0) {
    console.log('All live URLs return clean HTTP 200 to Googlebot with matching canonicals and JSON-LD.');
  }
}

async function inspectGscUrls(urls, serviceAccount) {
  console.log('\n=== 2. Google Search Console URL Inspection API ===');
  if (!serviceAccount) {
    console.log(`Skipped: No service account key found at ${DEFAULT_GSC_KEY_PATH}.`);
    console.log('Run `make seo-setup` for 60-second setup instructions to enable CLI Search Console inspection.');
    return;
  }

  const token = await getGoogleAccessToken(serviceAccount, ['https://www.googleapis.com/auth/webmasters.readonly']);
  const siteUrl = await resolveGscProperty(token);
  console.log(`Property: ${siteUrl} (authenticated as ${serviceAccount.client_email})\n`);

  for (const inspectionUrl of urls) {
    const response = await fetch('https://searchconsole.googleapis.com/v1/urlInspection/index:inspect', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ inspectionUrl, siteUrl }),
    });
    if (!response.ok) {
      console.log(`  [ERROR] ${inspectionUrl}: HTTP ${response.status} ${await response.text()}`);
      continue;
    }
    const data = await response.json();
    const indexResult = data.inspectionResult?.indexStatusResult || {};
    const verdict = (indexResult.verdict || 'UNKNOWN').padEnd(7);
    const state = indexResult.coverageState || 'Unknown state';
    const lastCrawl = indexResult.lastCrawlTime ? indexResult.lastCrawlTime.slice(0, 10) : 'never     ';
    const pathLabel = inspectionUrl.replace(SITE_ORIGIN, '') || '/';
    console.log(`  [${verdict}] ${pathLabel.padEnd(48)} | ${state} (last crawl: ${lastCrawl})`);
  }
}

async function submitIndexNow(urls) {
  console.log(`\n=== Submitting ${urls.length} URLs to IndexNow (Bing, DuckDuckGo, Yandex, Naver) ===`);
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({
      host: 'undiscoveredmaterials.com',
      key: INDEXNOW_KEY,
      keyLocation: `${SITE_ORIGIN}/${INDEXNOW_KEY}.txt`,
      urlList: urls,
    }),
  });
  if (response.status === 200 || response.status === 202) {
    console.log(`IndexNow accepted ${urls.length} URLs (HTTP ${response.status}).`);
  } else {
    console.log(`IndexNow returned HTTP ${response.status}: ${await response.text()}`);
  }
}

async function submitGscSitemap(serviceAccount) {
  console.log('\n=== Submitting sitemap.xml to Google Search Console API ===');
  if (!serviceAccount) {
    console.log(`Skipped GSC Sitemap API: No service account key found at ${DEFAULT_GSC_KEY_PATH}.`);
    console.log('Run `make seo-setup` for one-time setup instructions.');
    return;
  }
  const token = await getGoogleAccessToken(serviceAccount, ['https://www.googleapis.com/auth/webmasters']);
  const siteUrl = await resolveGscProperty(token);
  const endpoint =
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}` +
    `/sitemaps/${encodeURIComponent(SITEMAP_URL)}`;
  const response = await fetch(endpoint, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });
  if (response.ok || response.status === 204) {
    console.log(`Successfully submitted ${SITEMAP_URL} to Google Search Console (${siteUrl}).`);
  } else {
    throw new Error(`GSC Sitemap submission failed (${response.status}): ${await response.text()}`);
  }
}

function printSetupGuide() {
  console.log(`
=== One-Time Google Search Console CLI Setup (No More Chrome Clicking) ===

1. Open Google Cloud Console and enable two free APIs on any project:
   - Google Search Console API:
     https://console.cloud.google.com/apis/library/searchconsole.googleapis.com

2. Create a Service Account & download its JSON key:
   - Go to https://console.cloud.google.com/iam-admin/serviceaccounts
   - Click "Create Service Account" (no IAM roles required) -> Keys -> Add Key -> JSON.
   - Save the file to:
     ${DEFAULT_GSC_KEY_PATH}
     (or set GSC_CREDENTIALS_FILE=/path/to/key.json)

3. Grant the Service Account access in Google Search Console:
   - Copy the "client_email" address from ${DEFAULT_GSC_KEY_PATH}
   - In Google Search Console (https://search.google.com/search-console) ->
     Settings -> Users and permissions -> Add user -> paste client_email with "Owner" permission.

Once saved, run:
  make seo-status   # Inspect Google indexing status of all blog URLs in your terminal
  make seo-submit   # Submit sitemap.xml to Google Search Console + ping IndexNow
`);
}

const command = process.argv[2] || 'status';
const urls = await getSitemapUrls();
const serviceAccount = await loadServiceAccount();

if (command === 'setup') {
  printSetupGuide();
} else if (command === 'submit') {
  await submitIndexNow(urls);
  await submitGscSitemap(serviceAccount);
} else if (command === 'status') {
  await auditLiveUrls(urls);
  await inspectGscUrls(urls, serviceAccount);
} else {
  console.error(`Unknown command: ${command}. Use: status | submit | setup`);
  process.exit(1);
}
