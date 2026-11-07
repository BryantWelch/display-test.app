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

/** Load (and cache) the full content entry for a test or guide. */
export function loadFullEntry(entry, kind = 'test') {
  const key = `${kind}:${entry.slug}`;
  if (!fullCache.has(key)) {
    const promise = import.meta.env.SSR ? Promise.resolve(entry) : fullLoaders[key]();
    promise.then((full) => {
      promise.value = full;
    });
    fullCache.set(key, promise);
  }
  return fullCache.get(key);
}

/** Full entry for rendering; suspends until loaded on the client. */
export function useFullEntry(entry, kind = 'test') {
  if (import.meta.env.SSR) return entry;
  const promise = loadFullEntry(entry, kind);
  return promise.value ?? use(promise);
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
const lazyTools = new Map();

/** React.lazy wrapper for a fullscreen test component, cached so identity is stable. */
export function getLazyTest(test) {
  if (!lazyTests.has(test.slug)) lazyTests.set(test.slug, lazy(test.load));
  return lazyTests.get(test.slug);
}

/** React.lazy wrapper for an inline (on-page) tool component. */
export function getLazyTool(test) {
  if (!test.inlineTool) return null;
  if (!lazyTools.has(test.slug)) lazyTools.set(test.slug, lazy(test.inlineTool));
  return lazyTools.get(test.slug);
}

/** Resolve once the content for an info or guide URL is loaded (used before hydration). */
export function preloadRoute(pathname) {
  const guideMatch = pathname.match(/^\/guides\/([^/]+)\/?$/);
  if (guideMatch) {
    const guide = getGuide(guideMatch[1]);
    return guide ? loadFullEntry(guide, 'guide') : Promise.resolve();
  }
  const testMatch = pathname.match(/^\/([^/]+)\/?$/);
  const test = testMatch && getTest(testMatch[1]);
  return test ? loadFullEntry(test) : Promise.resolve();
}

/** Warm the chunk when the user hovers/focuses a Start button. */
export function prefetchTest(test) {
  test?.load?.().catch(() => {});
}
