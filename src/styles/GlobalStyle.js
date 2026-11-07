import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    color-scheme: dark;

    --bg: #0b1120;
    --surface: #111a2e;
    --surface-2: #16213a;
    --surface-3: #1e2b48;
    --border: rgba(148, 163, 184, 0.16);
    --border-strong: rgba(148, 163, 184, 0.32);

    --text: #f1f5f9;
    --text-muted: #b8c4d6;
    --text-subtle: #8b9bb3;

    --accent: #38bdf8;
    --accent-strong: #0ea5e9;
    --accent-soft: rgba(56, 189, 248, 0.12);
    --accent-contrast: #03131f;
    --focus: #7dd3fc;

    --success: #4ade80;
    --warning: #fbbf24;
    --danger: #f87171;

    --radius-sm: 8px;
    --radius: 12px;
    --radius-lg: 18px;
    --shadow: 0 10px 30px rgba(2, 6, 23, 0.45);

    --font-sans: 'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
    --font-mono: ui-monospace, 'Cascadia Code', 'SF Mono', Menlo, Consolas, monospace;

    --fs-hero: clamp(2.25rem, 5vw, 3.75rem);
    --fs-h1: clamp(1.9rem, 3.5vw, 2.6rem);
    --fs-h2: clamp(1.3rem, 2.2vw, 1.6rem);
    --fs-h3: 1.1rem;
    --fs-body: 1rem;
    --fs-small: 0.875rem;

    --nav-height: 4rem;
    --content-width: 1200px;
    --reading-width: 760px;

    /* Legacy aliases kept for components that haven't moved to the new names. */
    --primary: var(--accent);
    --primary-dark: #0369a1;
    --secondary: var(--text-muted);
    --background: var(--bg);
    --text-light: var(--text);
    --error: var(--danger);
  }

  *,
  *::before,
  *::after {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: var(--font-sans);
    font-size: var(--fs-body);
    background-color: var(--bg);
    color: var(--text);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4 {
    line-height: 1.2;
    letter-spacing: -0.015em;
    color: var(--text);
  }

  code {
    font-family: var(--font-mono);
    font-size: 0.9em;
    background: var(--surface-2);
    padding: 0.1em 0.35em;
    border-radius: 4px;
  }

  button {
    cursor: pointer;
    border: none;
    font: inherit;
    color: inherit;
    background: none;
  }

  input, select, textarea {
    font: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  :focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 2px;
    border-radius: 4px;
  }

  .visually-hidden {
    position: absolute !important;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  /* Site chrome honors reduced motion; fullscreen tests manage their own animation. */
  @media (prefers-reduced-motion: reduce) {
    body:not(.in-test) *,
    body:not(.in-test) *::before,
    body:not(.in-test) *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
      scroll-behavior: auto !important;
    }
  }

  body.in-test {
    overflow: hidden;
  }
`;
