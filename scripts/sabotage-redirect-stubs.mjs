#!/usr/bin/env node
/**
 * Sabotage harness for verify-redirect-stubs.mjs.
 *
 * A green gate proves nothing until it has been watched failing. Injects each
 * defect class the gate claims to catch, asserts a FAIL, and restores dist/
 * byte-identically. Also asserts the clean tree passes first and last, and
 * treats a no-op injection as HARNESS BROKEN rather than as a catch.
 *
 * Usage: node scripts/sabotage-redirect-stubs.mjs   (after npm run build)
 */

import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const GATE = 'scripts/verify-redirect-stubs.mjs';
const STUB = 'dist/edge-profile-pro-tips/index.html';

if (!existsSync(STUB)) {
  console.error(`FAIL: ${STUB} missing — run \`npm run build\` first`);
  process.exit(1);
}

const runGate = () => {
  try {
    execFileSync('node', [GATE], { stdio: 'pipe' });
    return { code: 0, out: '' };
  } catch (e) {
    return {
      code: e.status ?? 1,
      out: `${e.stdout ?? ''}${e.stderr ?? ''}`,
    };
  }
};

const original = readFileSync(STUB, 'utf8');
const restore = () => writeFileSync(STUB, original, 'utf8');

const clean = runGate();
if (clean.code !== 0) {
  console.error('FAIL: clean tree does not pass — fix that before sabotaging');
  console.error('--- gate output ---');
  console.error(clean.out.trim() || '(no output)');
  process.exit(1);
}
console.log('clean tree passes\n');

const cases = [
  ['title reverted to "Redirecting…"',
    (h) => h.replace(/<title>[^<]*<\/title>/, '<title>Redirecting…</title>')],
  ['meta description removed',
    (h) => h.replace(/<meta name="description" content="[^"]*">/, '')],
  ['title drifted from the target post',
    (h) => h.replace(/<title>([^<]*)<\/title>/, '<title>Some Other Title | Brian Baldock</title>')],
  ['description drifted from the target post',
    (h) => h.replace(/<meta name="description" content="[^"]*">/,
      '<meta name="description" content="a different description">')],
  ['canonical points somewhere else',
    (h) => h.replace(/<link rel="canonical" href="[^"]*">/,
      '<link rel="canonical" href="https://blog.brianbaldock.net/wrong/">')],
];

let caught = 0;
for (const [name, mutate] of cases) {
  const mutated = mutate(original);
  if (mutated === original) {
    console.error(`  HARNESS BROKEN: ${name} changed nothing — pattern did not match`);
    restore();
    continue;
  }
  writeFileSync(STUB, mutated, 'utf8');
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
