#!/usr/bin/env node
// ClearKorea feed liveness checker
// Usage: node scripts/check-feeds.mjs [path/to/feeds.json]
// Node 18+ (global fetch). No external dependencies.
// Exit code 1 if any feed with "checked": true is dead (use in CI).

import { readFile } from 'node:fs/promises';

const FEEDS_PATH = process.argv[2] ?? new URL('../config/feeds.json', import.meta.url).pathname;
const TIMEOUT_MS = 12000;
const CONCURRENCY = 8;
const UA = 'ClearKorea-FeedChecker/1.0 (+https://clearkorea.com)';

function buildGoogleNewsUrl(endpoint, q, hl, gl, ceid) {
  const params = new URLSearchParams({ q, hl, gl, ceid });
  return `${endpoint}?${params.toString()}`;
}

function looksLikeFeed(text) {
  const head = text.slice(0, 2000).toLowerCase();
  return head.includes('<rss') || head.includes('<feed') ||
         head.includes('<rdf') || head.includes('<?xml');
}

function countItems(text) {
  const items = (text.match(/<item[\s>]/gi) || []).length;
  const entries = (text.match(/<entry[\s>]/gi) || []).length;
  return items + entries;
}

async function checkOne(target) {
  const { id, url, required } = target;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      signal: ctrl.signal,
      redirect: 'follow',
      headers: { 'User-Agent': UA },
    });
    const text = await res.text();
    const ok = res.ok && looksLikeFeed(text);
    return { id, url, required, status: res.status, ok, items: ok ? countItems(text) : 0 };
  } catch (e) {
    return { id, url, required, status: 0, ok: false,
             error: e.name === 'AbortError' ? 'timeout' : e.message };
  } finally {
    clearTimeout(timer);
  }
}

async function runPool(targets, worker, size) {
  const results = [];
  let i = 0;
  const runners = Array.from({ length: size }, async () => {
    while (i < targets.length) {
      const idx = i++;
      results[idx] = await worker(targets[idx]);
    }
  });
  await Promise.all(runners);
  return results;
}

const cfg = JSON.parse(await readFile(FEEDS_PATH, 'utf8'));

const targets = [];
for (const o of cfg.outlets ?? []) {
  if (o.rss) targets.push({ id: o.id, url: o.rss, required: !!o.checked });
}
const gn = cfg.googleNews;
if (gn?.endpoint) {
  for (const q of gn.queries ?? []) {
    targets.push({
      id: `gnews:${q.id}`,
      url: buildGoogleNewsUrl(gn.endpoint, q.q, q.hl, q.gl, q.ceid),
      required: false,
    });
  }
}

console.log(`Checking ${targets.length} feeds from ${FEEDS_PATH}\n`);
const results = await runPool(targets, checkOne, CONCURRENCY);

for (const r of results) {
  const mark = r.ok ? 'OK  ' : 'DEAD';
  const extra = r.ok ? `${r.items} items` : (r.error ?? `status ${r.status}`);
  console.log(`[${mark}] ${String(r.id).padEnd(22)} ${extra}`);
}

const dead = results.filter(r => !r.ok);
const deadRequired = dead.filter(r => r.required);
console.log(`\nTotal ${results.length} | OK ${results.length - dead.length} | DEAD ${dead.length} (required dead: ${deadRequired.length})`);

if (deadRequired.length) {
  console.error('\nRequired (checked:true) feeds are dead:');
  for (const r of deadRequired) console.error(`  - ${r.id} ${r.url}`);
  process.exit(1);
}
