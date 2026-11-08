/**
 * Static site generation: render every registry route to real HTML so crawlers, link
 * previews, and no-JS visitors get titles, meta, structured data, and content.
 * Fullscreen /test/* routes get route-specific head tags and are rendered client-side.
 */
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const root = process.cwd();
const distDir = path.join(root, 'dist');
const serverDir = path.join(root, 'dist-server');

const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
const { render, getPrerenderRoutes, SITE } = await import(
  pathToFileURL(path.join(serverDir, 'entry-server.js')).href
);

const ROOT_PLACEHOLDER = '<div id="root"><!--app-html--></div>';
if (!template.includes(ROOT_PLACEHOLDER)) {
  throw new Error('index.html is missing the <div id="root"><!--app-html--></div> placeholder');
}

function toFile(routePath) {
  if (routePath === '/') return 'index.html';
  return `${routePath.replace(/^\//, '')}.html`;
}

function writePage(file, { html, head, styles }, ssr) {
  const rootDiv = ssr ? `<div id="root" data-ssr="true">${html}</div>` : '<div id="root"></div>';
  const page = template
    .replace('<!--app-head-->', head)
    .replace('<!--app-styles-->', styles)
    .replace(ROOT_PLACEHOLDER, rootDiv);
  const out = path.join(distDir, file);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, page);
}

const routes = getPrerenderRoutes();
for (const route of routes) {
  writePage(toFile(route.path), render(route.path, { ssr: route.ssr }), route.ssr);
}

writePage('404.html', render('/404'), true);

const today = new Date().toISOString().slice(0, 10);
const urls = routes
  .filter((r) => r.sitemap)
  .map((r) => {
    const loc = `${SITE.url}${r.path === '/' ? '' : r.path}`;
    return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>${r.lastmod || today}</lastmod>\n  </url>`;
  })
  .join('\n');
fs.writeFileSync(
  path.join(distDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
);

fs.rmSync(serverDir, { recursive: true, force: true });
console.log(`Prerendered ${routes.length + 1} pages and sitemap.xml`);
