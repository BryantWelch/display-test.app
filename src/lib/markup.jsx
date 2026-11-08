import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

/**
 * Tiny inline markup for content files: **bold**, *italic*, `code`, [text](/internal) and
 * [text](https://external). Keeps content as plain data so it can be prerendered and reused
 * (info pages, in-test guidance, guides) without JSX in content files.
 */
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g;

export const TextLink = styled(Link)`
  color: var(--accent);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--accent) 40%, transparent);
  text-underline-offset: 2px;

  &:hover {
    text-decoration-color: var(--accent);
  }
`;

const ExternalA = styled.a`
  color: var(--accent);
  text-decoration: underline;
  text-decoration-color: color-mix(in srgb, var(--accent) 40%, transparent);
  text-underline-offset: 2px;
`;

export function Inline({ text }) {
  if (text == null) return null;
  const parts = String(text).split(INLINE).filter((p) => p !== '');
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    if (part.startsWith('`') && part.endsWith('`')) return <code key={i}>{part.slice(1, -1)}</code>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) return <em key={i}>{part.slice(1, -1)}</em>;
    const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (link) {
      const [, label, href] = link;
      if (/^https?:/.test(href)) {
        return (
          <ExternalA key={i} href={href} target="_blank" rel="noopener noreferrer">
            {label}
          </ExternalA>
        );
      }
      return (
        <TextLink key={i} to={href}>
          {label}
        </TextLink>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

const Callout = styled.div`
  border-left: 3px solid ${({ $tone }) => ($tone === 'warning' ? 'var(--warning)' : 'var(--accent)')};
  background: var(--surface-2);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  padding: 0.85rem 1rem;
  margin: 0.75rem 0 1rem;
  color: var(--text-muted);
  line-height: 1.65;
`;

const Table = styled.div`
  overflow-x: auto;
  margin: 0.75rem 0 1.25rem;

  table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.95rem;
  }

  th,
  td {
    text-align: left;
    padding: 0.6rem 0.75rem;
    border-bottom: 1px solid var(--border);
    vertical-align: top;
    color: var(--text-muted);
  }

  th {
    color: var(--text);
    font-weight: 600;
    background: var(--surface-2);
  }
`;

/**
 * Block content. Each block is one of:
 *   'paragraph string'
 *   { h3: 'Sub heading' }
 *   { ul: ['item', ...] } | { ol: ['step', ...] }
 *   { note: 'callout' } | { warning: 'callout' }
 *   { table: { head: ['A', 'B'], rows: [['a', 'b']] } }
 */
export function Blocks({ blocks }) {
  if (!blocks?.length) return null;
  return blocks.map((block, i) => {
    if (typeof block === 'string') {
      return (
        <p key={i}>
          <Inline text={block} />
        </p>
      );
    }
    if (block.h3) return <h3 key={i}>{block.h3}</h3>;
    if (block.ul) {
      return (
        <ul key={i}>
          {block.ul.map((item, j) => (
            <li key={j}>
              <Inline text={item} />
            </li>
          ))}
        </ul>
      );
    }
    if (block.ol) {
      return (
        <ol key={i}>
          {block.ol.map((item, j) => (
            <li key={j}>
              <Inline text={item} />
            </li>
          ))}
        </ol>
      );
    }
    if (block.note || block.warning) {
      return (
        <Callout key={i} $tone={block.warning ? 'warning' : 'info'}>
          <Inline text={block.note || block.warning} />
        </Callout>
      );
    }
    if (block.table) {
      return (
        <Table key={i}>
          <table>
            <thead>
              <tr>
                {block.table.head.map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.table.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, c) => (
                    <td key={c}>
                      <Inline text={cell} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Table>
      );
    }
    return null;
  });
}

/** Strip inline markup for plain-text uses (JSON-LD, meta). */
export const plainText = (text) =>
  String(text ?? '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');
