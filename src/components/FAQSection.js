import React from 'react';
import styled from 'styled-components';
import FAQSchema from './FAQSchema';

const Wrap = styled.section`
  margin-top: 2.5rem;
`;

const Heading = styled.h2`
  font-size: 1.4rem;
  margin: 0 0 1rem;
  color: var(--text-light);
`;

const Item = styled.details`
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  margin-bottom: 0.65rem;
  overflow: hidden;

  &[open] {
    background: rgba(255, 255, 255, 0.05);
  }

  summary {
    list-style: none;
    cursor: pointer;
    padding: 0.95rem 1.1rem;
    font-weight: 600;
    color: var(--text-light);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    line-height: 1.45;

    &::-webkit-details-marker {
      display: none;
    }

    &::after {
      content: '+';
      flex-shrink: 0;
      font-size: 1.25rem;
      font-weight: 400;
      color: var(--primary);
      line-height: 1;
    }
  }

  &[open] summary::after {
    content: '−';
  }
`;

const Answer = styled.p`
  margin: 0;
  padding: 0 1.1rem 1rem;
  color: var(--secondary);
  line-height: 1.65;
  font-size: 0.98rem;
`;

/**
 * Visible FAQ accordion + matching FAQPage JSON-LD.
 */
const FAQSection = ({ faqs, title = 'Frequently asked questions' }) => {
  if (!faqs?.length) return null;

  return (
    <>
      <FAQSchema faqs={faqs} />
      <Wrap>
        <Heading>{title}</Heading>
        {faqs.map((faq) => (
          <Item key={faq.question}>
            <summary>{faq.question}</summary>
            <Answer>{faq.answer}</Answer>
          </Item>
        ))}
      </Wrap>
    </>
  );
};

export default FAQSection;
