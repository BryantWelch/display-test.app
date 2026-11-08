import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter';
import App from './App';
import { GlobalStyle } from './styles/GlobalStyle';
import { guides, loadFullEntry, preloadRoute, tests } from './registry';

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <App />
    </BrowserRouter>
  </StrictMode>
);

const preloadLink = (event) => {
  const link = event.target.closest?.('a[href^="/"]');
  if (link) preloadRoute(new URL(link.href).pathname).catch(() => {});
};
for (const type of ['pointerover', 'pointerdown', 'focusin', 'touchstart']) {
  document.addEventListener(type, preloadLink, { passive: true });
}

/** Fetch guide and test copy during idle so the first click in a session is already warm. */
function warmContent() {
  const jobs = [
    ...guides.map((guide) => () => loadFullEntry(guide, 'guide')),
    ...tests.map((test) => () => loadFullEntry(test)),
  ];
  let index = 0;
  const pump = () => {
    if (index >= jobs.length) return;
    const batch = [jobs[index++], jobs[index++]].filter(Boolean);
    Promise.all(batch.map((run) => run().catch(() => {}))).then(() => {
      const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 50));
      schedule(pump, { timeout: 1000 });
    });
  };
  const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 400));
  schedule(pump, { timeout: 1500 });
}

const renderApp = () => {
  if (container.dataset.ssr === 'true') {
    hydrateRoot(container, app, {
      onRecoverableError(error) {
        (window.__hydrationErrors ||= []).push(String(error?.message || error));
        console.error(error);
      },
    });
  } else {
    createRoot(container).render(app);
  }
  warmContent();
};

// Prerendered HTML is already on screen. Wait for its content module so hydration
// matches. Dev (and any non-prerendered load) paints the shell immediately.
if (container.dataset.ssr === 'true') {
  preloadRoute(window.location.pathname)
    .catch(() => {})
    .then(renderApp);
} else {
  renderApp();
}
