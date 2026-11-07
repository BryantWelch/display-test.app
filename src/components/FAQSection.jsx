import styled from 'styled-components';
import JsonLd from './JsonLd';
import { Inline, plainText } from '../lib/markup';

const Wrap = styled.section`
  margin-top: 2.5rem;
`;

const Heading = styled.h2`
  font-size: var(--fs-h2);
  margin: 0 0 1rem;
`;

const Item = styled.details`
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface);
  margin-bottom: 0.6rem;

  &[open] {
    background: var(--surface-2);
  }

  summary {
    list-style: none;
    cursor: pointer;
    padding: 0.95rem 1.1rem;
    font-weight: 600;
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
      color: var(--accent);
      line-height: 1;
    }
  }

  &[open] summary::after {
    content: '−';
  }
`;

const Answer = styled.p`
  padding: 0 1.1rem 1rem;
  color: var(--text-muted);
  line-height: 1.7;
`;

/** Visible FAQ accordion + matching FAQPage JSON-LD (prerendered). */
const FAQSection = ({ faqs, title = 'Frequently asked questions' }) => {
  if (!faqs?.length) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: plainText(faq.question),
      acceptedAnswer: { '@type': 'Answer', text: plainText(faq.answer) },
    })),
  };

  return (
    <Wrap aria-labelledby="faq-heading">
      <JsonLd data={schema} />
      <Heading id="faq-heading">{title}</Heading>
      {faqs.map((faq) => (
        <Item key={faq.question}>
          <summary>{faq.question}</summary>
          <Answer>
            <Inline text={faq.answer} />
          </Answer>
        </Item>
      ))}
    </Wrap>
  );
};

export default FAQSection;
