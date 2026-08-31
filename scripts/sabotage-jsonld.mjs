#!/usr/bin/env node
/**
 * Sabotage harness for verify-jsonld.mjs.
 *
 * The JSON-LD graph is the entity-disambiguation signal: one canonical Person
 * node at a stable @id that every page references. A gate protecting that is
 * worthless until it has been watched failing, so this injects each defect
 * class it claims to catch, asserts a FAIL, and restores dist/ byte-identically.
 *
 * Asserts the clean tree passes first AND last, and treats a no-op injection as
 * HARNESS BROKEN rather than as a catch.
 *
 * Usage: node scripts/sabotage-jsonld.mjs   (after npm run build)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const GATE = 'scripts/verify-jsonld.mjs';
const ABOUT = 'dist/about/index.html';
const HOME = 'dist/index.html';

for (const f of [ABOUT, HOME]) {
  if (!existsSync(f)) {
    console.error(`FAIL: ${f} missing — run \`npm run build\` first`);
    process.exit(1);
  }
}

const runGate = () => {
  try {
    execFileSync('node', [GATE], { stdio: 'pipe' });
    return { code: 0, out: '' };
  } catch (e) {
    return { code: e.status ?? 1, out: `${e.stdout ?? ''}${e.stderr ?? ''}` };
  }
};

const originals = new Map([
  [ABOUT, readFileSync(ABOUT, 'utf8')],
  [HOME, readFileSync(HOME, 'utf8')],
]);
const restore = () => {
  for (const [f, c] of originals) writeFileSync(f, c, 'utf8');
};

const clean = runGate();
if (clean.code !== 0) {
  console.error('FAIL: clean tree does not pass — fix that before sabotaging');
  console.error(clean.out.trim() || '(no output)');
  process.exit(1);
}
console.log('clean tree passes\n');

const cases = [
  [
    'Person @id changed (breaks entity identity)',
    ABOUT,
    (h) => h.replaceAll('https://blog.brianbaldock.net/#brian', 'https://blog.brianbaldock.net/#someone-else'),
  ],
  [
    'ProfilePage node removed from /about/',
    ABOUT,
    (h) => h.replace('"@type":"ProfilePage"', '"@type":"WebPage"'),
  ],
  [
    'jobTitle wrong',
    ABOUT,
    (h) => h.replace('"jobTitle":"Senior Software Engineer"', '"jobTitle":"Wizard"'),
  ],
  [
    'sameAs emptied (no profile corroboration)',
    ABOUT,
    (h) => h.replace(/"sameAs":\[[^\]]*\]/, '"sameAs":[]'),
  ],
  [
    'whole ld+json block stripped from home',
    HOME,
    (h) => h.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, ''),
  ],
  [
    'home title loses the seoTagline',
    HOME,
    (h) => h.replace(/<title>[^<]*<\/title>/, '<title>Brian Baldock</title>'),
  ],
];

let caught = 0;
for (const [name, file, mutate] of cases) {
  const before = originals.get(file);
  const after = mutate(before);
  if (after === before) {
    console.error(`  HARNESS BROKEN: ${name} changed nothing — pattern did not match`);
    restore();
    continue;
  }
  writeFileSync(file, after, 'utf8');
  const { code } = runGate();
  restore();
  if (code === 0) {
    console.error(`  MISSED: ${name} — gate still passed`);
  } else {
    console.log(`  caught: ${name}`);
    caught++;
  }
}

const finalOk = runGate().code === 0;
console.log(`\nclean tree passes again after restore: ${finalOk}`);
console.log(`${caught}/${cases.length} defect classes caught`);
process.exit(caught === cases.length && finalOk ? 0 : 1);
