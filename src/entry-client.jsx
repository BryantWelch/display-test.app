import { StrictMode } from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import '@fontsource-variable/inter';
import App from './App';
import { GlobalStyle } from './styles/GlobalStyle';

const container = document.getElementById('root');
const app = (
  <StrictMode>
    <BrowserRouter>
      <GlobalStyle />
      <App />
    </BrowserRouter>
  </StrictMode>
);

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
