# Content files

Every file in `tests/` and `guides/` is discovered automatically by `src/registry/index.js`
(`import.meta.glob`). There is no list to update: add a file and it appears in routes, the
home page, the nav mega-menu, the footer, the sitemap, and the prerendered HTML.

Files must use `export default { ... }`. On the client, the registry eagerly loads a stripped
"meta" version of every file (built by `scripts/contentMetaPlugin.js`) and lazy-loads the full
file per page. Stripped fields: top-level `faqs`; for tests `page.intro`, `page.sections`,
`page.panelNotes`, `page.whenToReturn`, `page.tips`, `page.faqs`, `page.disclaimer`; for guides
`intro`, `sections`, `faqs`. Anything read outside `InfoPage` / `GuidePage` (nav, cards, head
tags, `TestShell`'s `lookFor`, `related`) must stay outside that list.

Text fields support inline markup: `**bold**`, `*italic*`, `` `code` ``, `[label](/internal-path)`
and `[label](https://external)`.

## Test / tool entry (`tests/<slug>.js`)

```js
export default {
  slug: 'dead-pixel',            // URL: /dead-pixel (info) and /test/dead-pixel (fullscreen)
  order: 200,                     // sort order within the site (lower first)
  category: 'defects',            // start | defects | color | motion | clarity | utilities | fun
  name: 'Dead Pixel Test',        // card title, H1 fallback
  shortName: 'Dead Pixel',        // nav label
  badges: ['Popular'],            // optional: 'Popular' | 'New'
  summary: 'One sentence for cards and related links.',
  seo: { title, description },    // info page <title>/<meta>
  testSeo: { title, description },// optional, for /test/<slug> (noindex)
  load: () => import('../../pages/tests/DeadPixelTest'),  // optional fullscreen test
  inlineTool: () => import('../../tools/RefreshRateTool'), // optional on-page widget
  photosensitive: false,          // true => warning on page + consent gate before the test
  checkup: { step: 20, question: 'Did you find any dead pixels?' }, // optional: include in /checkup
  page: {
    title, intro, startLabel, lastReviewed: 'YYYY-MM-DD',
    sections: [{ id, heading, blocks: [...] }],
    lookFor: { good: [...], bad: [...] },      // "What you should see" — also shown inside the test
    panelNotes: [{ panel: 'OLED', note }],      // what's normal per panel type
    whenToReturn: [...],
    tips: [...],                                // sidebar "Before you start" (defaults to setup tips)
    related: ['slug', ...],
    affiliates: 'deadPixel',                    // key in src/data/affiliateProducts.js pageAffiliates
    disclaimer: '...',
    faqs: [{ question, answer }],
  },
};
```

Block types (see `src/lib/markup.jsx`): a string (paragraph), `{ h3 }`, `{ ul: [] }`, `{ ol: [] }`,
`{ note }`, `{ warning }`, `{ table: { head: [], rows: [[]] } }`.

## Guide entry (`guides/<slug>.js`)

```js
export default {
  slug, order, name, title, summary, lastReviewed,
  seo: { title, description },
  intro,
  sections: [{ id, heading, blocks }],
  related: ['test-slug', ...],
  faqs: [...],
  affiliates: 'key',               // optional
  interactive: () => import('../../tools/SymptomChecker'), // optional client-only widget
  interactiveFirst: false,
};
```

## Fullscreen test components

Wrap everything in `TestShell` (`src/components/TestShell.jsx`) and build controls from the kit it
re-exports (`Section`, `Segmented`, `Slider`, `Select`, `Toggle`, `ColorSwatches`, `ColorInput`,
`Readout`, `Button`, `ButtonRow`, `Hint`). Pass `shortcuts` for test-specific keys. Use
`PixelCanvas` / `usePixelCanvas` for anything that must be pixel-exact, and
`src/utils/frameTiming.js` for refresh-rate-aware motion.
