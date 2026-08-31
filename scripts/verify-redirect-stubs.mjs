#!/usr/bin/env node
/**
 * Verify legacy redirect stubs carry real metadata that MATCHES their target.
 *
 * 98.4% of this blog's Bing impressions land on the legacy top-level slugs
 * rather than /posts/<slug>/. Those stubs used to ship `<title>Redirecting…</title>`
 * and no description, so the ranked page had no snippet. This gate proves each
 * stub now mirrors its target post's title and description exactly, still
 * carries the canonical and the meta-refresh, and never says "Redirecting".
 *
 * A mismatch matters as much as an absence: two URLs for the same content
 * showing different titles is its own defect.
 *
 * Usage: node scripts/verify-redirect-stubs.mjs
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const failures = [];
const pick = (html, re) => (html.match(re)?.[1] ?? null);

const TITLE = /<title>([^<]*)<\/title>/;
const DESC = /<meta name="description" content="([^"]*)"/;
const CANON = /<link rel="canonical" href="([^"]*)"/;
const REFRESH = /<meta http-equiv="refresh" content="0; url=([^"]*)"/;

if (!existsSync(DIST)) {
  console.error('FAIL: no dist/ — run `npm run build` first');
  process.exit(1);
}

// A stub is a top-level dir whose index.html has a meta refresh.
const entries = readdirSync(DIST, { withFileTypes: true })
  .filter((d) => d.isDirectory() && d.name !== 'posts' && !d.name.startsWith('_'));

let checked = 0;

for (const dir of entries) {
  const file = join(DIST, dir.name, 'index.html');
  if (!existsSync(file)) continue;
  const html = readFileSync(file, 'utf8');
  const target = pick(html, REFRESH);
  if (!target) continue; // not a stub

  checked++;
  const name = `/${dir.name}/`;
  const title = pick(html, TITLE);
  const desc = pick(html, DESC);
  const canon = pick(html, CANON);

  if (!title || /redirecting/i.test(title)) {
    failures.push(`${name} title is "${title}" — the ranked page has no snippet`);
  }
  if (!desc || desc.trim() === '') {
    failures.push(`${name} has no meta description`);
  }
  if (!canon || !canon.includes(target)) {
    failures.push(`${name} canonical "${canon}" does not point at target "${target}"`);
  }

  // Cross-check against the real post it points to.
  const targetFile = join(DIST, target.replace(/^\//, ''), 'index.html');
  if (existsSync(targetFile)) {
    const t = readFileSync(targetFile, 'utf8');
    const tTitle = pick(t, TITLE);
    const tDesc = pick(t, DESC);
    if (tTitle && title && tTitle !== title) {
      failures.push(`${name} title differs from target:\n    stub: ${title}\n    post: ${tTitle}`);
    }
    if (tDesc && desc && tDesc !== desc) {
      failures.push(`${name} description differs from target`);
    }
  } else {
    failures.push(`${name} target ${target} does not exist in dist/`);
  }
}

if (checked === 0) {
  console.error('FAIL: found no redirect stubs at all — did the build change?');
  process.exit(1);
}

if (failures.length) {
  console.error(`FAIL: ${failures.length} problem(s) across ${checked} stub(s):\n`);
  for (const f of failures) console.error('  ' + f);
  process.exit(1);
}

console.log(`OK: ${checked} redirect stubs carry real, matching metadata`);
