import { tests, guides, getTestFromPath, getGuide, infoPath, testPath, guidePath, hasFullscreen } from './index';

export const SITE = {
  name: 'Display Test',
  url: 'https://display-test.app',
  image: 'https://display-test.app/logo512.png',
};

const STATIC_PAGES = {
  '/': {
    title: 'Display Test — Free Monitor Tests: Dead Pixels, Refresh Rate, Ghosting & More',
    description:
      'Free browser-based monitor tests: dead and stuck pixels, refresh rate, motion blur and ghosting, backlight bleed, gamma, banding, HDR, and more. Includes a guided new-monitor checkup.',
    breadcrumbs: [],
    lastReviewed: '2026-11-07',
  },
  '/about': {
    title: 'About Display Test — What It Is and How It Works',
    description:
      'What Display Test is, what a browser-based monitor test can and cannot measure, and how to contribute or report issues on GitHub.',
    breadcrumbs: [{ name: 'About', path: '/about' }],
    lastReviewed: '2026-11-07',
  },
  '/privacy': {
    title: 'Privacy Policy — Display Test',
    description:
      'How Display Test handles information: no accounts, results stay in your browser, and how ads and affiliate links work.',
    breadcrumbs: [{ name: 'Privacy', path: '/privacy' }],
    lastReviewed: '2026-11-07',
  },
  '/gear': {
    title: 'Display Calibration Gear — Colorimeters, Calibration Discs, Cables & Software',
    description:
      'Colorimeters, calibration discs, cables, cleaning kits, and calibration software that pair with Display Test — and when each one is actually worth it.',
    breadcrumbs: [{ name: 'Gear', path: '/gear' }],
    lastReviewed: '2026-11-07',
  },
  '/guides': {
    title: 'Monitor Guides — Checking a New Monitor, Dead Pixel Policies, OLED Burn-in',
    description:
      'Practical guides for checking a new monitor in its return window, understanding dead pixel policies, OLED burn-in, and diagnosing common display problems.',
    breadcrumbs: [{ name: 'Guides', path: '/guides' }],
    lastReviewed: '2026-11-07',
  },
  '/checkup': {
    title: 'New Monitor Checkup — Guided Step-by-Step Test with Report',
    description:
      'A guided checkup for a new monitor: confirm resolution and refresh rate, then check dead pixels, bleed, uniformity, levels, banding, text, and motion. Save a pass/fail report.',
    breadcrumbs: [{ name: 'New monitor checkup', path: '/checkup' }],
    lastReviewed: '2026-11-07',
  },
};

const NOT_FOUND = {
  title: 'Page Not Found — Display Test',
  description: 'That page does not exist. Browse all display tests and guides instead.',
  noindex: true,
  breadcrumbs: [],
};

const normalize = (pathname) =>
  pathname.length > 1 && pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;

/**
 * Head + breadcrumb data for any route. Used by the prerenderer (real HTML) and by
 * the client <Head> component on in-app navigation.
 */
export function getRouteMeta(rawPathname) {
  const pathname = normalize(rawPathname.split(/[?#]/)[0]);

  if (STATIC_PAGES[pathname]) {
    return { ...STATIC_PAGES[pathname], canonical: `${SITE.url}${pathname === '/' ? '' : pathname}` };
  }

  if (pathname.startsWith('/guides/')) {
    const guide = getGuide(pathname.slice('/guides/'.length));
    if (guide) {
      return {
        title: guide.seo.title,
        description: guide.seo.description,
        canonical: `${SITE.url}${guidePath(guide)}`,
        ogType: 'article',
        lastReviewed: guide.lastReviewed,
        breadcrumbs: [
          { name: 'Guides', path: '/guides' },
          { name: guide.name, path: guidePath(guide) },
        ],
      };
    }
    return { ...NOT_FOUND };
  }

  const test = getTestFromPath(pathname);
  if (test) {
    const isFullscreen = pathname.startsWith('/test/');
    if (isFullscreen && !hasFullscreen(test)) return { ...NOT_FOUND };
    const seo = isFullscreen ? test.testSeo || test.seo : test.seo;
    return {
      title: seo.title,
      description: seo.description,
      canonical: `${SITE.url}${infoPath(test)}`,
      noindex: isFullscreen,
      lastReviewed: test.page?.lastReviewed,
      breadcrumbs: [
        { name: 'Tests', path: '/#tests' },
        { name: test.name, path: infoPath(test) },
      ],
    };
  }

  return { ...NOT_FOUND };
}

/** Every route that should be written to disk at build time. */
export function getPrerenderRoutes() {
  const routes = Object.keys(STATIC_PAGES).map((path) => ({ path, ssr: true, sitemap: true }));
  for (const test of tests) {
    routes.push({ path: infoPath(test), ssr: true, sitemap: true, lastmod: test.page?.lastReviewed });
    if (hasFullscreen(test)) routes.push({ path: testPath(test), ssr: false, sitemap: false });
  }
  for (const guide of guides) {
    routes.push({ path: guidePath(guide), ssr: true, sitemap: true, lastmod: guide.lastReviewed });
  }
  return routes;
}
