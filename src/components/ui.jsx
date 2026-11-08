import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

export const Page = styled.div`
  width: 100%;
  max-width: ${({ $narrow }) => ($narrow ? 'var(--reading-width)' : 'var(--content-width)')};
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;

  @media (max-width: 768px) {
    padding: 1.25rem 1rem 3rem;
  }
`;

export const Eyebrow = styled.p`
  font-size: var(--fs-small);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 0.5rem;
`;

export const H1 = styled.h1`
  font-size: var(--fs-h1);
  font-weight: 750;
  margin-bottom: 0.75rem;
`;

export const Lead = styled.p`
  font-size: 1.125rem;
  color: var(--text-muted);
  line-height: 1.7;
  max-width: 68ch;
`;

export const Meta = styled.p`
  font-size: var(--fs-small);
  color: var(--text-subtle);
  margin-top: 0.75rem;
`;

/** Long-form typography for content blocks. */
export const Prose = styled.div`
  color: var(--text-muted);
  line-height: 1.75;

  h2 {
    font-size: var(--fs-h2);
    margin: 2.25rem 0 0.75rem;
    scroll-margin-top: calc(var(--nav-height) + 1rem);
  }

  /* Hash links target the section, so the offset has to live here too or the heading slides under the fixed header. */
  section[id] {
    scroll-margin-top: calc(var(--nav-height) + 1rem);
  }

  h3 {
    font-size: var(--fs-h3);
    margin: 1.5rem 0 0.5rem;
  }

  > :first-child {
    margin-top: 0;
  }

  p {
    margin-bottom: 0.9rem;
  }

  ul,
  ol {
    margin: 0.25rem 0 1rem;
    padding-left: 1.35rem;
  }

  li {
    margin-bottom: 0.4rem;
  }

  li::marker {
    color: var(--text-subtle);
  }

  strong {
    color: var(--text);
    font-weight: 600;
  }
`;

const buttonBase = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-height: 44px;
  padding: 0.7rem 1.3rem;
  border-radius: 999px;
  font-weight: 600;
  font-size: 1rem;
  line-height: 1.2;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.15s ease;
  cursor: pointer;
  white-space: nowrap;

  &:active {
    transform: translateY(1px);
  }

  ${({ $variant }) =>
    $variant === 'secondary'
      ? css`
          background: var(--surface-2);
          color: var(--text);
          border: 1px solid var(--border-strong);
          &:hover {
            background: var(--surface-3);
          }
        `
      : $variant === 'ghost'
      ? css`
          background: transparent;
          color: var(--accent);
          padding-inline: 0.5rem;
          &:hover {
            text-decoration: underline;
          }
        `
      : css`
          background: var(--accent);
          color: var(--accent-contrast);
          border: 1px solid transparent;
          &:hover {
            background: #7dd3fc;
          }
        `}
`;

export const Button = styled.button`
  ${buttonBase}
`;

export const ButtonLink = styled(Link)`
  ${buttonBase}
`;

export const Card = styled.div`
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
`;

export const Badge = styled.span`
  display: inline-block;
  font-size: 0.72rem;
  font-weight: 650;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  color: ${({ $tone }) => ($tone === 'new' ? '#052e16' : 'var(--accent)')};
  background: ${({ $tone }) => ($tone === 'new' ? 'var(--success)' : 'var(--accent-soft)')};
`;

export const Grid = styled.div`
  display: grid;
  gap: ${({ $gap }) => $gap || '1rem'};
  grid-template-columns: repeat(auto-fill, minmax(${({ $min }) => $min || '260px'}, 1fr));
`;

export const ArrowRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="M13 5l7 7-7 7" />
  </svg>
);

export const ExternalIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 3h-6m6 0l-9 9m9-9v6" />
  </svg>
);
