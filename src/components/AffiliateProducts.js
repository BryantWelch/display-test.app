import React from 'react';
import styled from 'styled-components';

const Wrap = styled.section`
  margin: 2rem 0 1.75rem;
  padding: 1.25rem 1.35rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
`;

const Heading = styled.h2`
  font-size: 1.25rem;
  margin: 0 0 0.5rem;
  color: var(--text-light);
`;

const Intro = styled.p`
  margin: 0 0 1rem;
  color: var(--secondary);
  line-height: 1.65;
  font-size: 0.98rem;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
`;

const Item = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.85rem 0.95rem;
  border-radius: 10px;
  background: rgba(2, 6, 23, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.05);
`;

const ProductLink = styled.a`
  color: var(--primary);
  font-weight: 600;
  text-decoration: none;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;

  &:hover {
    text-decoration: underline;
  }

  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    opacity: 0.85;
  }
`;

const Note = styled.span`
  color: var(--secondary);
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Disclosure = styled.p`
  margin: 0.9rem 0 0;
  font-size: 0.8rem;
  line-height: 1.45;
  color: rgba(148, 163, 184, 0.9);
`;

const ExternalIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      d="M21 3h-6m6 0l-9 9m9-9v6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/**
 * In-content product recommendations (Amazon affiliate links).
 * Keep copy contextual to the page — don't dump the full nav catalog.
 */
const AffiliateProducts = ({ title, intro, products }) => {
  if (!products?.length) return null;

  return (
    <Wrap>
      <Heading>{title}</Heading>
      {intro ? <Intro>{intro}</Intro> : null}
      <List>
        {products.map((product) => (
          <Item key={product.href}>
            <ProductLink href={product.href} target="_blank" rel="noopener noreferrer sponsored">
              {product.name}
              <ExternalIcon />
            </ProductLink>
            {product.note ? <Note>{product.note}</Note> : null}
          </Item>
        ))}
      </List>
      <Disclosure>
        As an Amazon Associate I earn from qualifying purchases. Links may earn a commission at no
        extra cost to you.
      </Disclosure>
    </Wrap>
  );
};

export default AffiliateProducts;
