/**
 * Serves `src/content/{tests,guides}/*.js?meta` with the long-form fields removed, so the
 * client's eager registry only ships what nav, cards, routing and head tags need. Full
 * entries are lazy-loaded per page (see src/registry/index.js). SSR gets the full file.
 */
const META_ID = /[\\/]src[\\/]content[\\/](tests|guides)[\\/][^\\/]+\.js\?meta$/;

const STRIP = {
  tests: { top: ['faqs'], page: ['intro', 'sections', 'panelNotes', 'whenToReturn', 'tips', 'faqs', 'disclaimer'] },
  guides: { top: ['intro', 'sections', 'faqs'], page: [] },
};

const keyName = (prop) => prop.key?.name ?? prop.key?.value;

function removalRange(code, prop) {
  let end = prop.end;
  while (/\s/.test(code[end])) end += 1;
  if (code[end] === ',') end += 1;
  return [prop.start, end];
}

export default function contentMetaPlugin() {
  return {
    name: 'content-meta',
    enforce: 'pre',
    transform(code, id, options) {
      const match = id.match(META_ID);
      if (!match || options?.ssr) return null;
      const rules = STRIP[match[1]];
      const ast = this.parse(code);
      const decl = ast.body.find((n) => n.type === 'ExportDefaultDeclaration')?.declaration;
      if (decl?.type !== 'ObjectExpression') {
        this.error(`content-meta: ${id} must use \`export default { ... }\``);
      }

      const ranges = [];
      for (const prop of decl.properties) {
        const name = keyName(prop);
        if (rules.top.includes(name)) ranges.push(removalRange(code, prop));
        if (name === 'page' && prop.value.type === 'ObjectExpression') {
          for (const inner of prop.value.properties) {
            if (rules.page.includes(keyName(inner))) ranges.push(removalRange(code, inner));
          }
        }
      }

      let out = code;
      for (const [start, end] of ranges.sort((a, b) => b[0] - a[0])) {
        out = out.slice(0, start) + out.slice(end);
      }
      return { code: out, map: null };
    },
  };
}
