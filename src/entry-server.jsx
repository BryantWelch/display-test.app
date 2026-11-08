import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ServerStyleSheet } from 'styled-components';
import App from './App';
import { GlobalStyle } from './styles/GlobalStyle';
import { getRouteMeta, getPrerenderRoutes, SITE } from './registry/routeMeta';
import { renderHeadString } from './lib/head';

export { getPrerenderRoutes, SITE };

/** Render one route to HTML for the prerenderer. `ssr: false` routes only get head tags. */
export function render(url, { ssr = true } = {}) {
  const meta = getRouteMeta(url);
  const head = renderHeadString(meta);
  if (!ssr) return { html: '', head, styles: '', meta };

  const sheet = new ServerStyleSheet();
  try {
    const html = renderToString(
      sheet.collectStyles(
        <StaticRouter location={url}>
          <GlobalStyle />
          <App />
        </StaticRouter>
      )
    );
    return { html, head, styles: sheet.getStyleTags(), meta };
  } finally {
    sheet.seal();
  }
}
