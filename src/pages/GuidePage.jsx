import { Suspense, lazy, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Breadcrumbs from '../components/Breadcrumbs';
import AdSlot from '../components/AdSlot';
import AffiliateProducts from '../components/AffiliateProducts';
import FAQSection from '../components/FAQSection';
import JsonLd from '../components/JsonLd';
import ErrorBoundary from '../components/ErrorBoundary';
import { Page, Eyebrow, H1, Lead, Meta, Prose, Card } from '../components/ui';
import { Blocks, Inline } from '../lib/markup';
import { getTest, guidePath, infoPath, useFullEntry } from '../registry';
import { getRouteMeta, SITE } from '../registry/routeMeta';

const Toc = styled.nav`
  margin: 1.75rem 0 0.5rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);

  h2 {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-subtle);
    margin-bottom: 0.5rem;
  }

  ol {
    padding-left: 1.2rem;
    color: var(--text-muted);
    display: grid;
    gap: 0.25rem;
  }

  a:hover {
    color: var(--text);
    text-decoration: underline;
  }
`;

const Related = styled.ul`
  list-style: none;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0.75rem;

  a {
    display: block;
    height: 100%;
    padding: 0.9rem 1rem;
    border-radius: var(--radius-sm);
    background: var(--surface);
    border: 1px solid var(--border);
  }

  a:hover {
    border-color: var(--accent);
  }

  span {
    display: block;
    color: var(--text-muted);
    font-size: 0.88rem;
    margin-top: 0.2rem;
  }
`;

function Interactive({ guide }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const Widget = useMemo(() => (guide.interactive ? lazy(guide.interactive) : null), [guide]);
  if (!Widget) return null;
  const fallback = <p style={{ color: 'var(--text-subtle)' }}>Loading…</p>;
  return (
    <Card as="section" style={{ margin: '2rem 0' }}>
      <ErrorBoundary label="tool" resetKey={guide.slug}>
        {mounted ? <Suspense fallback={fallback}>{<Widget />}</Suspense> : fallback}
      </ErrorBoundary>
    </Card>
  );
}

function GuideFallback({ entry }) {
  return (
    <>
      {entry.summary ? <Lead>{entry.summary}</Lead> : null}
      {entry.lastReviewed ? <Meta>Last reviewed {entry.lastReviewed}</Meta> : null}
    </>
  );
}

const GuideBody = ({ entry }) => {
  const guide = useFullEntry(entry, 'guide');
  const related = (guide.related || []).map(getTest).filter(Boolean);
  const sections = guide.sections || [];

  return (
    <>
      <Lead>
        <Inline text={guide.intro} />
      </Lead>
      {guide.lastReviewed ? <Meta>Last reviewed {guide.lastReviewed}</Meta> : null}

      {sections.length > 3 ? (
        <Toc aria-label="On this page">
          <h2>On this page</h2>
          <ol>
            {sections.map((s) => (
              <li key={s.id || s.heading}>
                <a href={`#${s.id}`}>{s.heading}</a>
              </li>
            ))}
          </ol>
        </Toc>
      ) : null}

      {guide.interactiveFirst ? <Interactive guide={guide} /> : null}

      <Prose>
        {sections.map((section, i) => (
          <section key={section.id || section.heading} id={section.id}>
            <h2>{section.heading}</h2>
            <Blocks blocks={section.blocks} />
            {i === 1 ? <AdSlot slot="banner" /> : null}
          </section>
        ))}
      </Prose>

      {!guide.interactiveFirst ? <Interactive guide={guide} /> : null}

      {guide.affiliates ? <AffiliateProducts group={guide.affiliates} /> : null}

      {related.length ? (
        <section style={{ marginTop: '2.5rem' }} aria-labelledby="guide-related">
          <h2 id="guide-related" style={{ fontSize: 'var(--fs-h2)', marginBottom: '1rem' }}>
            Tests mentioned in this guide
          </h2>
          <Related>
            {related.map((t) => (
              <li key={t.slug}>
                <Link to={infoPath(t)}>
                  <strong>{t.name}</strong>
                  <span>{t.summary}</span>
                </Link>
              </li>
            ))}
          </Related>
        </section>
      ) : null}

      <FAQSection faqs={guide.faqs} />
      <AdSlot slot="belowContent" margin="3rem 0 0" />
    </>
  );
};

const GuidePage = ({ guide: entry }) => {
  const meta = getRouteMeta(guidePath(entry));
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: entry.title || entry.name,
    description: meta.description,
    url: `${SITE.url}${guidePath(entry)}`,
    dateModified: entry.lastReviewed,
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };

  return (
    <Page $narrow>
      <JsonLd data={schema} />
      <Breadcrumbs items={meta.breadcrumbs} />
      <Eyebrow>Guide</Eyebrow>
      <H1>{entry.title || entry.name}</H1>
      <Suspense fallback={<GuideFallback entry={entry} />}>
        <GuideBody entry={entry} />
      </Suspense>
    </Page>
  );
};

export default GuidePage;
