#!/usr/bin/env node
/**
 * Migrate Hashnode markdown export → Astro content collection.
 *
 * - Reads ~/projects/blog-migration-source/*.md
 * - Rewrites frontmatter to match src/content.config.ts schema
 * - Downloads all cdn.hashnode.com images into public/images/<slug>/
 * - Rewrites image URLs (cover + inline) to local /images/<slug>/<file>
 * - Writes posts to src/content/posts/<slug>.md
 *
 * Run: node scripts/migrate-hashnode.mjs
 */

import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC_DIR = path.resolve(process.env.HOME, 'projects/blog-migration-source');
const POSTS_OUT = path.join(ROOT, 'src/content/posts');
const IMAGES_OUT = path.join(ROOT, 'public/images');

// ---------- frontmatter parse/serialize ----------

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) throw new Error('No frontmatter');
  const fm = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!kv) continue;
    let [, key, val] = kv;
    val = val.trim();
    // Strip surrounding quotes
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    fm[key] = val;
  }
  return { fm, body: m[2] };
}

function yamlString(s) {
  // Always double-quote, escape backslashes + double quotes
  return `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
}

function serializeFrontmatter(obj) {
  const lines = ['---'];
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue;
    if (Array.isArray(v)) {
      if (v.length === 0) {
        lines.push(`${k}: []`);
      } else {
        lines.push(`${k}:`);
        for (const item of v) lines.push(`  - ${yamlString(item)}`);
      }
    } else if (typeof v === 'boolean' || typeof v === 'number') {
      lines.push(`${k}: ${v}`);
    } else {
      lines.push(`${k}: ${yamlString(v)}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

// ---------- helpers ----------

function slugFromHashnodeTags(raw) {
  if (!raw) return [];
  return raw.split(',').map((t) => t.trim()).filter(Boolean);
}

function deriveDescription(body) {
  // First non-empty, non-image paragraph, truncated to 160 chars
  const paras = body
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith('!') && !p.startsWith('#') && !p.startsWith('>'));
  if (!paras.length) return undefined;
  let text = paras[0].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  text = text.replace(/[*_`]/g, '').replace(/\s+/g, ' ').trim();
  if (text.length > 160) text = text.slice(0, 157).replace(/\s+\S*$/, '') + '...';
  return text || undefined;
}

const HASHNODE_IMG_RE = /https:\/\/cdn\.hashnode\.com\/res\/hashnode\/image\/upload\/[^\s)"]+/g;

function stripHashnodeAlign(body) {
  // Hashnode appends ' align="left"' inside the URL paren; strip it
  return body.replace(/(\!\[[^\]]*\]\()([^)\s]+)(\s+align="[^"]+")(\))/g, '$1$2$4');
}

async function download(url, destPath) {
  // Strip any align="..." token that may still be glued on
  const cleanUrl = url.replace(/\s+align="[^"]+"$/, '');
  const res = await fetch(cleanUrl, { redirect: 'follow' });
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${cleanUrl}`);
  const buf = Buffer.from(await res.arrayBuffer());
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, buf);
  return buf.length;
}

function localImageName(url) {
  // Last path component or hashed fallback
  const cleanUrl = url.replace(/\s+align="[^"]+"$/, '').split('?')[0];
  const base = path.basename(new URL(cleanUrl).pathname);
  if (base && /\.[a-z0-9]+$/i.test(base)) return base;
  const ext = (cleanUrl.match(/\.([a-z0-9]+)(?:$|\?)/i) || [, 'png'])[1];
  const h = crypto.createHash('sha1').update(cleanUrl).digest('hex').slice(0, 12);
  return `${h}.${ext}`;
}

// ---------- main ----------

async function main() {
  await fs.mkdir(POSTS_OUT, { recursive: true });
  await fs.mkdir(IMAGES_OUT, { recursive: true });

  const files = (await fs.readdir(SRC_DIR)).filter((f) => f.endsWith('.md'));
  console.log(`Found ${files.length} source posts`);

  let totalImages = 0;
  let totalBytes = 0;
  const failures = [];

  for (const file of files) {
    const raw = await fs.readFile(path.join(SRC_DIR, file), 'utf8');
    let parsed;
    try {
      parsed = parseFrontmatter(raw);
    } catch (e) {
      failures.push({ file, error: `frontmatter: ${e.message}` });
      continue;
    }
    const { fm, body: rawBody } = parsed;
    const body = stripHashnodeAlign(rawBody);

    const slug = fm.slug || path.basename(file, '.md');
    const imgDir = path.join(IMAGES_OUT, slug);

    // Collect all hashnode image URLs in this post (cover + inline)
    const urls = new Set();
    if (fm.cover && fm.cover.includes('cdn.hashnode.com')) urls.add(fm.cover);
    for (const m of body.matchAll(HASHNODE_IMG_RE)) urls.add(m[0]);

    // Download
    const urlMap = new Map();
    for (const url of urls) {
      const name = localImageName(url);
      const dest = path.join(imgDir, name);
      const rel = `/images/${slug}/${name}`;
      try {
        // Skip if already downloaded
        let bytes = 0;
        try {
          const stat = await fs.stat(dest);
          bytes = stat.size;
        } catch {
          bytes = await download(url, dest);
          totalImages++;
          totalBytes += bytes;
        }
        urlMap.set(url, rel);
      } catch (e) {
        failures.push({ file, url, error: e.message });
      }
    }

    // Rewrite body image URLs (longest-first to avoid prefix collisions)
    let newBody = body;
    const sortedUrls = [...urlMap.keys()].sort((a, b) => b.length - a.length);
    for (const url of sortedUrls) {
      const rel = urlMap.get(url);
      newBody = newBody.split(url).join(rel);
    }

    // Build new frontmatter
    const newFm = {
      title: fm.title || slug,
      description: fm.seoDescription || deriveDescription(newBody),
      pubDate: fm.datePublished || fm.pubDate,
      updatedDate: fm.dateUpdated || undefined,
      cover: fm.cover ? (urlMap.get(fm.cover) || fm.cover) : undefined,
      coverAlt: fm.coverAlt || (fm.title ? `Cover image for ${fm.title}` : undefined),
      tags: slugFromHashnodeTags(fm.tags),
      slug,
    };

    const out = `${serializeFrontmatter(newFm)}\n\n${newBody.trim()}\n`;
    await fs.writeFile(path.join(POSTS_OUT, `${slug}.md`), out, 'utf8');
    process.stdout.write('.');
  }

  console.log('\n\n=== summary ===');
  console.log(`Posts written: ${files.length - failures.filter((f) => f.error.startsWith('frontmatter')).length}`);
  console.log(`Images downloaded: ${totalImages} (${(totalBytes / 1024 / 1024).toFixed(2)} MiB)`);
  if (failures.length) {
    console.log(`\nFailures (${failures.length}):`);
    for (const f of failures) console.log(' -', f);
    process.exitCode = 1;
  }
}

main().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
