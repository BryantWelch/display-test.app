import styled from 'styled-components';
import { ExternalIcon } from './ui';
import { pageAffiliates } from '../data/affiliateProducts';

const Wrap = styled.section`
  margin: 2.5rem 0 1.5rem;
  padding: 1.25rem 1.35rem;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--surface);
`;

const Heading = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.5rem;
`;

const Intro = styled.p`
  margin: 0 0 1rem;
  color: var(--text-muted);
  line-height: 1.65;
`;

const List = styled.ul`
  list-style: none;
  display: grid;
  gap: 0.65rem;
`;

const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.85rem 0.95rem;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
`;

const ProductLink = styled.a`
  color: var(--accent);
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Note = styled.span`
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.5;
`;

export const Disclosure = styled.p`
  margin: 0.9rem 0 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: var(--text-subtle);
`;

export const AFFILIATE_DISCLOSURE =
  'As an Amazon Associate, Display Test earns from qualifying purchases. Links marked as products may earn a commission at no extra cost to you.';

/**
 * In-content recommendations. Pass either `group` (a key of pageAffiliates) or
 * explicit title/intro/products. Set `affiliate` false for ordinary outbound links.
 */
const AffiliateProducts = ({ group, title, intro, products, affiliate = true, id }) => {
  const data = group ? pageAffiliates[group] : { title, intro, products };
  if (!data?.products?.length) return null;
  const headingId = id || `aff-${group || 'custom'}`;

  return (
    <Wrap aria-labelledby={headingId}>
      <Heading id={headingId}>{data.title}</Heading>
      {data.intro ? <Intro>{data.intro}</Intro> : null}
      <List>
        {data.products.map((product) => (
          <Item key={product.href}>
            <ProductLink
              href={product.href}
              target="_blank"
              rel={affiliate ? 'noopener noreferrer sponsored' : 'noopener noreferrer'}
            >
              {product.name}
              <ExternalIcon />
            </ProductLink>
            {product.note ? <Note>{product.note}</Note> : null}
          </Item>
        ))}
      </List>
      {affiliate ? <Disclosure>{AFFILIATE_DISCLOSURE}</Disclosure> : null}
    </Wrap>
  );
};

export default AffiliateProducts;
