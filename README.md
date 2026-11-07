# Display Test

Free, browser-based monitor tests at [display-test.app](https://display-test.app): dead and stuck pixels, refresh rate, motion blur and ghosting, backlight bleed, black level and HDMI range, gamma, banding, chroma 4:4:4, HDR / wide gamut, text clarity, burn-in, and more — plus a guided **new monitor checkup** and guides for diagnosing common display problems.

Everything runs client-side. Pages are prerendered to static HTML at build time for fast loads and SEO, then hydrate into a React single-page app.

![image](https://github.com/user-attachments/assets/7318370f-0e51-4939-b67a-477aa1d57a29)

## What a browser can and can't measure

The tests draw exact pixel values at the display's physical resolution and use the browser frame clock, so they're good at finding visible defects, signal/settings problems (refresh rate, RGB range, chroma subsampling, overscan), and comparative patterns. They **cannot** measure nits, contrast ratio, Delta E, response time in ms, or input lag — that needs a colorimeter or photodiode. The site says so wherever it matters.

## Getting started

Requires Node.js 20+ (CI uses 22).

```bash
npm install
npm run dev       # http://localhost:3000
npm run build     # client build + SSR build + prerender into dist/
npm run preview   # serve dist/ at http://localhost:4173
npm run lint
```

## How it's built

- **Vite + React 19 + React Router 7 + styled-components 6.**
- **Prerendering:** `npm run build` builds the client, builds `src/entry-server.jsx` for SSR, then `scripts/prerender.js` renders every route to `dist/<route>.html` with its head tags, styles, and JSON-LD, and writes `sitemap.xml` and `404.html`. Fullscreen `/test/*` routes get head tags only and render client-side.
- **Registry:** every file in `src/content/tests/` and `src/content/guides/` is discovered automatically (`src/registry/`). One content file adds the info page, the fullscreen route, nav and home entries, the footer link, and the sitemap entry.
- **Shared test kit:** `TestShell` (fullscreen chrome, shortcuts, in-test guidance, photosensitivity gate, checkup prompts), `testControls` (dark control kit), `PixelCanvas` (device-pixel-exact canvas), `frameTiming` and `displayInfo` utilities.

## Adding a test

1. Create the fullscreen component in `src/pages/tests/` (wrap it in `TestShell`), and/or an inline tool in `src/tools/`.
2. Add `src/content/tests/<slug>.js` following the schema in [`src/content/README.md`](src/content/README.md) — `src/content/tests/dead-pixel.js` is a complete example.
3. Set `checkup: { step, question }` to include it in the new monitor checkup.

## Project layout

```
src/
  content/tests/    one data file per test (copy, SEO, FAQs, checkup step)
  content/guides/   one data file per guide
  pages/tests/      fullscreen test components
  tools/            inline tools shown on info pages
  components/       layout, InfoPage, TestShell, controls, ads, affiliates
  registry/         auto-discovery, categories, route metadata
  utils/ hooks/ lib/ styles/
scripts/prerender.js
```

## Deployment

`netlify.toml` builds with `npm run build` and publishes `dist/`. Each route is a real `.html` file, so no SPA redirect is needed; `404.html` handles unknown paths. `/assets/*` is served with long-lived immutable caching.

## Support

If you find this project helpful, consider supporting it:

[![Buy Me a Coffee](https://storage.ko-fi.com/cdn/kofi5.png)](https://ko-fi.com/V7V01A0SJC)

## Contributing

Issues and pull requests are welcome. Run `npm run lint` and `npm run build` before opening a PR — CI runs both.

## License

MIT — see [LICENSE](LICENSE).
