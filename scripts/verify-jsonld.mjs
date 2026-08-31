// Verify the emitted structured data on the built site.
// Reads dist/ HTML, extracts the ld+json block, parses it, and asserts the
// Person entity is present with a stable @id on every page type.
import { readFileSync, existsSync } from 'node:fs';

const PERSON_ID = 'https://blog.brianbaldock.net/#brian';
let failures = 0;

function fail(msg) {
  console.log('FAIL: ' + msg);
  failures++;
}

function graphOf(file) {
  if (!existsSync(file)) {
    fail(`missing file ${file}`);
    return null;
  }
  const html = readFileSync(file, 'utf8');
  const m = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/);
  if (!m) {
    fail(`no ld+json block in ${file}`);
    return null;
  }
  let parsed;
  try {
    parsed = JSON.parse(m[1]);
  } catch (e) {
    fail(`ld+json in ${file} does not parse: ${e.message}`);
    return null;
  }
  if (!Array.isArray(parsed['@graph'])) {
    fail(`${file}: no @graph array`);
    return null;
  }
  return parsed['@graph'];
}

function node(graph, type) {
  return graph.find((n) => n['@type'] === type);
}

// --- home page ---
const home = graphOf('dist/index.html');
if (home) {
  const p = node(home, 'Person');
  if (!p) fail('home: no Person node');
  else {
    if (p['@id'] !== PERSON_ID) fail(`home: Person @id is ${p['@id']}`);
    if (p.jobTitle !== 'Senior Software Engineer') fail('home: wrong jobTitle');
    if (p.worksFor?.name !== 'Microsoft') fail('home: wrong worksFor');
    if (!Array.isArray(p.sameAs) || p.sameAs.length < 4)
      fail(`home: sameAs has ${p.sameAs?.length} entries, expected >= 4`);
    for (const u of p.sameAs ?? [])
      if (!/^https:\/\//.test(u)) fail(`home: sameAs entry not absolute https: ${u}`);
    if (p.address?.addressLocality !== 'Seattle') fail('home: wrong locality');
  }
  const w = node(home, 'WebSite');
  if (!w) fail('home: no WebSite node');
  else if (w.author?.['@id'] !== PERSON_ID) fail('home: WebSite.author does not reference Person @id');
  if (node(home, 'ProfilePage')) fail('home: ProfilePage should only be on /about/');
}

// --- about page ---
// This is the canonical home of the Person entity, so its Person node gets the
// SAME scrutiny as the home page's. Checking those fields only on the home page
// left /about/ able to ship a corrupted jobTitle or an empty sameAs while the
// gate stayed green -- caught by scripts/sabotage-jsonld.mjs.
const about = graphOf('dist/about/index.html');
if (about) {
  const pp = node(about, 'ProfilePage');
  if (!pp) fail('about: no ProfilePage node');
  else {
    if (pp.mainEntity?.['@id'] !== PERSON_ID) fail('about: ProfilePage.mainEntity wrong');
    if (pp['@id'] !== 'https://blog.brianbaldock.net/about/') fail(`about: ProfilePage @id is ${pp['@id']}`);
  }
  const ap = node(about, 'Person');
  if (!ap) fail('about: no Person node');
  else {
    if (ap['@id'] !== PERSON_ID) fail('about: Person @id wrong');
    if (ap.jobTitle !== 'Senior Software Engineer') fail(`about: wrong jobTitle (${ap.jobTitle})`);
    if (ap.worksFor?.name !== 'Microsoft') fail('about: wrong worksFor');
    if (!Array.isArray(ap.sameAs) || ap.sameAs.length < 4)
      fail(`about: sameAs has ${ap.sameAs?.length ?? 0} entries, expected >= 4`);
    for (const u of ap.sameAs ?? [])
      if (!/^https:\/\//.test(u)) fail(`about: sameAs entry not absolute https: ${u}`);
    if (ap.address?.addressLocality !== 'Seattle') fail('about: wrong locality');
    // The portrait is the entity's image; a broken path silently weakens it.
    if (!/^https:\/\/blog\.brianbaldock\.net\/images\/about\//.test(ap.image ?? ''))
      fail(`about: Person.image is not an absolute site URL (${ap.image})`);
  }
}

// --- a post page ---
const post = graphOf('dist/posts/securescore/index.html');
if (post) {
  const bp = node(post, 'BlogPosting');
  if (!bp) fail('post: no BlogPosting node');
  else {
    if (bp.author?.['@id'] !== PERSON_ID) fail('post: BlogPosting.author does not reference Person @id');
    if (!bp.datePublished) fail('post: no datePublished');
  }
  if (node(post, 'Person')?.['@id'] !== PERSON_ID) fail('post: Person @id wrong');
}

// --- home page <title> ---
const homeHtml = readFileSync('dist/index.html', 'utf8');
const t = homeHtml.match(/<title>([^<]*)<\/title>/)?.[1];
console.log('home <title>: ' + t + '  (' + (t?.length ?? 0) + ' chars)');
if (!/Identity, Security, and AI Infrastructure/.test(t ?? '')) fail('home title missing seoTagline');
// SERP truncation is by PIXEL width (~580px), not characters; ~70 chars of
// mixed-case text is the practical guideline and >75 is where it actually
// bites. An earlier 60-char limit here was invented and would have failed
// titles this site ships happily.
if ((t?.length ?? 0) > 75) fail(`home title is ${t.length} chars, likely truncated in SERP`);

console.log(failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
