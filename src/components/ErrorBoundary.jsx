import { Component } from 'react';
import styled from 'styled-components';

const Box = styled.div`
  max-width: 560px;
  margin: 6rem auto;
  padding: 2rem;
  text-align: center;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);

  h2 {
    margin-bottom: 0.75rem;
  }

  p {
    color: var(--text-muted);
    margin-bottom: 1.25rem;
  }

  div {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  button,
  a {
    padding: 0.65rem 1.2rem;
    border-radius: 999px;
    background: var(--accent);
    color: var(--accent-contrast);
    font-weight: 600;
  }

  a {
    background: var(--surface-3);
    color: var(--text);
  }
`;

/** Keeps a crashing test (canvas, WebGL, unsupported API) from blanking the whole site. */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('Display Test error:', error, info?.componentStack);
  }

  componentDidUpdate(prevProps) {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ error: null });
    }
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <Box role="alert">
        <h2>Something went wrong</h2>
        <p>
          This {this.props.label || 'page'} hit an error — often an unsupported browser feature. Try
          reloading, or use a current version of Chrome, Edge, Firefox, or Safari.
        </p>
        <div>
          <button type="button" onClick={() => window.location.reload()}>
            Reload
          </button>
          <a href={this.props.backHref || '/'}>Go back</a>
        </div>
      </Box>
    );
  }
}

export default ErrorBoundary;
