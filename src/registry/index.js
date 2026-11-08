import { lazy, use } from 'react';
import { CATEGORIES, CATEGORY_BY_ID } from './categories';

/**
 * Every file in src/content/tests and src/content/guides is picked up automatically.
 * Adding a tool = one content file (+ its component). See src/content/README.md for the schema.
 *
 * `?meta` imports are the lightweight versions (long-form copy stripped by
 * scripts/contentMetaPlugin.js on the client); full entries load per page via useFullEntry.
 */
const testMeta = import.meta.glob('../content/tests/*.js', { eager: true, import: 'default', query: '?meta' });
const guideMeta = import.meta.glob('../content/guides/*.js', { eager: true, import: 'default', query: '?meta' });
const testFull = import.meta.glob('../content/tests/*.js', { import: 'default' });
const guideFull = import.meta.glob('../content/guides/*.js', { import: 'default' });

const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name);

const fileOf = (path) => path.replace(/\?meta$/, '');

const index = (metaModules, fullLoaders, kind) =>
  Object.entries(metaModules)
    .filter(([, entry]) => entry)
    .map(([path, entry]) => {
      fullLoaders[`${kind}:${entry.slug}`] = (kind === 'test' ? testFull : guideFull)[fileOf(path)];
      return entry;
    })
    .sort(byOrder);

const fullLoaders = {};
export const tests = index(testMeta, fullLoaders, 'test');
export const guides = index(guideMeta, fullLoaders, 'guide');

const fullCache = new Map();
const toolCache = new Map();

/** Tag a promise with status/value so React's use() reads it synchronously once settled. */
function tracked(promise) {
  promise.status = 'pending';
  promise.then(
    (value) => {
      promise.status = 'fulfilled';
      promise.value = value;
    },
    (reason) => {
      promise.status = 'rejected';
      promise.reason = reason;
    }
  );
  return promise;
}

/** Load (and cache) the full content entry for a test or guide. */
export function loadFullEntry(entry, kind = 'test') {
  const key = `${kind}:${entry.slug}`;
  if (!fullCache.has(key)) {
    const promise = tracked(import.meta.env.SSR ? Promise.resolve(entry) : fullLoaders[key]());
    if (!import.meta.env.SSR) {
      promise
        .then((full) => {
          if (full.inlineTool) loadTool(full).catch(() => {});
          // Symptom checker (and any future guide widget) can fetch alongside the copy.
          if (typeof full.interactive === 'function') full.interactive().catch(() => {});
        })
        .catch(() => {});
    }
    fullCache.set(key, promise);
  }
  return fullCache.get(key);
}

/** Full entry for rendering; suspends until loaded on the client. */
export function useFullEntry(entry, kind = 'test') {
  if (import.meta.env.SSR) return entry;
  return use(loadFullEntry(entry, kind));
}

/** Load (and cache) the inline tool component for a test. */
export function loadTool(test) {
  if (!toolCache.has(test.slug)) {
    toolCache.set(test.slug, tracked(test.inlineTool().then((mod) => mod.default)));
  }
  return toolCache.get(test.slug);
}

const testsBySlug = Object.fromEntries(tests.map((t) => [t.slug, t]));
const guidesBySlug = Object.fromEntries(guides.map((g) => [g.slug, g]));

export const getTest = (slug) => testsBySlug[slug];
export const getGuide = (slug) => guidesBySlug[slug];

export const infoPath = (test) => `/${test.slug}`;
export const testPath = (test) => `/test/${test.slug}`;
export const guidePath = (guide) => `/guides/${guide.slug}`;

/** True when the entry has a fullscreen /test/:slug route. */
export const hasFullscreen = (test) => typeof test.load === 'function';

export function getTestFromPath(pathname) {
  const match = pathname.match(/^\/(?:test\/)?([^/]+)\/?$/);
  return match ? testsBySlug[match[1]] : undefined;
}

export function getInfoRouteFromTestPath(pathname) {
  const test = getTestFromPath(pathname);
  return test ? infoPath(test) : '/';
}

export const testsByCategory = CATEGORIES.map((category) => ({
  ...category,
  tests: tests.filter((t) => t.category === category.id),
})).filter((c) => c.tests.length > 0);

export const getCategory = (id) => CATEGORY_BY_ID[id];

export function getRelatedTests(test, limit = 4) {
  const explicit = (test.page?.related || []).map(getTest).filter(Boolean);
  if (explicit.length >= limit) return explicit.slice(0, limit);
  const sameCategory = tests.filter(
    (t) => t.category === test.category && t.slug !== test.slug && !explicit.includes(t)
  );
  return [...explicit, ...sameCategory].slice(0, limit);
}

const lazyTests = new Map();

/** React.lazy wrapper for a fullscreen test component, cached so identity is stable. */
export function getLazyTest(test) {
  if (!lazyTests.has(test.slug)) lazyTests.set(test.slug, lazy(test.load));
  return lazyTests.get(test.slug);
}

/** Resolve once the content for an info, guide, or fullscreen URL is loaded. */
export function preloadRoute(pathname) {
  const guideMatch = pathname.match(/^\/guides\/([^/]+)\/?$/);
  if (guideMatch) {
    const guide = getGuide(guideMatch[1]);
    return guide ? loadFullEntry(guide, 'guide') : Promise.resolve();
  }
  const fullscreenMatch = pathname.match(/^\/test\/([^/]+)\/?$/);
  if (fullscreenMatch) {
    const test = getTest(fullscreenMatch[1]);
    return test?.load ? test.load().then(() => undefined) : Promise.resolve();
  }
  const testMatch = pathname.match(/^\/([^/]+)\/?$/);
  const test = testMatch && getTest(testMatch[1]);
  if (!test) return Promise.resolve();
  return loadFullEntry(test).then((full) => (full.inlineTool ? loadTool(full) : undefined));
}

/** Warm the chunk when the user hovers/focuses a Start button. */
export function prefetchTest(test) {
  test?.load?.().catch(() => {});
}
