import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  :root {
    --primary: #2563eb;
    --secondary: #475569;
    --background: #0f172a;
    --text: #f8fafc;
    --error: #ef4444;
    --success: #22c55e;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background-color: var(--background);
    color: var(--text);
    line-height: 1.5;
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  a {
    color: inherit;
    text-decoration: none;
  }
`;
