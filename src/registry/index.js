import { lazy } from 'react';
import { CATEGORIES, CATEGORY_BY_ID } from './categories';

/**
 * Every file in src/content/tests and src/content/guides is picked up automatically.
 * Adding a tool = one content file (+ its component). See src/content/README.md for the schema.
 */
const testModules = import.meta.glob('../content/tests/*.js', { eager: true });
const guideModules = import.meta.glob('../content/guides/*.js', { eager: true });

const byOrder = (a, b) => (a.order ?? 999) - (b.order ?? 999) || a.name.localeCompare(b.name);

export const tests = Object.values(testModules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort(byOrder);

export const guides = Object.values(guideModules)
  .map((m) => m.default)
  .filter(Boolean)
  .sort(byOrder);

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

/** Warm the chunk when the user hovers/focuses a Start button. */
export function prefetchTest(test) {
  test?.load?.().catch(() => {});
}
