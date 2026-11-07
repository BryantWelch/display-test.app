import { SITE } from '../registry/routeMeta';

function headTags(meta) {
  const ogType = meta.ogType || 'website';
  return [
    { tag: 'meta', attrs: { name: 'description', content: meta.description } },
    { tag: 'link', attrs: { rel: 'canonical', href: meta.canonical } },
    meta.noindex ? { tag: 'meta', attrs: { name: 'robots', content: 'noindex, follow' } } : null,
    { tag: 'meta', attrs: { property: 'og:type', content: ogType } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: SITE.name } },
    { tag: 'meta', attrs: { property: 'og:url', content: meta.canonical } },
    { tag: 'meta', attrs: { property: 'og:title', content: meta.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: meta.description } },
    { tag: 'meta', attrs: { property: 'og:image', content: SITE.image } },
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary' } },
    { tag: 'meta', attrs: { name: 'twitter:title', content: meta.title } },
    { tag: 'meta', attrs: { name: 'twitter:description', content: meta.description } },
    { tag: 'meta', attrs: { name: 'twitter:image', content: SITE.image } },
  ].filter(Boolean);
}

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Server: serialize head tags for the prerendered HTML. */
export function renderHeadString(meta) {
  const tags = headTags(meta)
    .map(({ tag, attrs }) => {
      const attrString = Object.entries(attrs)
        .map(([k, v]) => `${k}="${escapeAttr(v)}"`)
        .join(' ');
      return `<${tag} ${attrString} data-head="route" />`;
    })
    .join('\n    ');
  return `<title>${escapeAttr(meta.title)}</title>\n    ${tags}`;
}

/** Client: replace route head tags after in-app navigation. */
export function applyHead(meta) {
  document.title = meta.title;
  document.head.querySelectorAll('[data-head="route"]').forEach((el) => el.remove());
  for (const { tag, attrs } of headTags(meta)) {
    const el = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
    el.setAttribute('data-head', 'route');
    document.head.appendChild(el);
  }
}
