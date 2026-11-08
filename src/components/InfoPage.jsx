import { Suspense, use, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Breadcrumbs from './Breadcrumbs';
import AdSlot from './AdSlot';
import AffiliateProducts from './AffiliateProducts';
import FAQSection from './FAQSection';
import JsonLd from './JsonLd';
import ErrorBoundary from './ErrorBoundary';
import { Page, Eyebrow, H1, Lead, Meta, Prose, Button, Badge, Card, ArrowRight } from './ui';
import { Blocks, Inline } from '../lib/markup';
import { enterTestFullscreen } from '../utils/fullscreen';
import { recordResult, RESULT_LABELS } from '../utils/checkupStore';
import {
  getCategory,
  getRelatedTests,
  hasFullscreen,
  infoPath,
  loadTool,
  prefetchTest,
  testPath,
  tests,
  useFullEntry,
} from '../registry';
import { getRouteMeta, SITE } from '../registry/routeMeta';

const Header = styled.header`
  margin-bottom: 2rem;
`;

const Badges = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
  margin-bottom: 0.75rem;
`;

const Actions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.85rem;
  margin-top: 1.5rem;
`;

const SeeLink = styled.a`
  color: var(--accent);
  font-weight: 550;
`;

const Layout = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 2.5rem;
  align-items: start;

  @media (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const Sidebar = styled.aside`
  position: sticky;
  top: calc(var(--nav-height) + 1rem);
  display: grid;
  gap: 1rem;

  > * {
    min-width: 0;
  }

  @media (max-width: 1000px) {
    position: static;
  }

  h2 {
    font-size: 1rem;
    margin-bottom: 0.6rem;
  }

  ul {
    padding-left: 1.1rem;
    color: var(--text-muted);
    font-size: 0.93rem;
    line-height: 1.6;
  }

  li {
    margin-bottom: 0.4rem;
  }

  p {
    color: var(--text-muted);
    font-size: 0.93rem;
  }
`;

const RelatedList = styled.ul`
  list-style: none;
  padding: 0 !important;
  display: grid;
  gap: 0.25rem;

  a {
    display: block;
    padding: 0.5rem 0.6rem;
    border-radius: var(--radius-sm);
    color: var(--text);
  }

  a:hover {
    background: var(--surface-2);
  }

  span {
    display: block;
    color: var(--text-subtle);
    font-size: 0.85rem;
  }
`;

const ToolCard = styled(Card)`
  margin-bottom: 2rem;
  padding: 1.5rem;
  min-height: 220px;
`;

const CheckupPrompt = styled.div`
  margin-bottom: 1.25rem;
  padding: 1rem 1.15rem;
  border-radius: var(--radius);
  border: 1px solid var(--accent);
  background: var(--accent-soft);

  p {
    margin-bottom: 0.75rem;
    color: var(--text);
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
  }
`;

const LookFor = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin: 1.5rem 0 1rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }

  > div {
    border-radius: var(--radius);
    padding: 1.1rem 1.2rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-top: 3px solid transparent;
  }

  > div:first-child {
    border-top-color: var(--success);
  }

  > div:last-child {
    border-top-color: var(--warning);
  }

  h3 {
    font-size: 1rem;
    margin: 0 0 0.5rem;
  }

  ul {
    padding-left: 1.1rem;
    margin: 0;
  }
`;

const Warning = styled.p`
  border: 1px solid color-mix(in srgb, var(--warning) 50%, transparent);
  background: color-mix(in srgb, var(--warning) 10%, transparent);
  color: var(--text);
  border-radius: var(--radius-sm);
  padding: 0.75rem 1rem;
  margin-top: 1rem;
  font-size: 0.95rem;
`;

const NextUp = styled(Link)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-top: 2.5rem;
  padding: 1.1rem 1.25rem;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);

  &:hover {
    border-color: var(--accent);
  }

  small {
    display: block;
    color: var(--text-subtle);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  strong {
    font-size: 1.1rem;
  }
`;

function LoadedTool({ test }) {
  const Tool = use(loadTool(test));
  return <Tool />;
}

/** Inline tools are interactive and browser-only, so they mount after hydration. */
function InlineTool({ test }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const fallback = <p style={{ color: 'var(--text-subtle)' }}>Loading tool…</p>;
  return (
    <ToolCard as="section" aria-label={`${test.name} tool`}>
      <ErrorBoundary label="tool" resetKey={test.slug}>
        {mounted ? (
          <Suspense fallback={fallback}>
            <LoadedTool test={test} />
          </Suspense>
        ) : (
          fallback
        )}
      </ErrorBoundary>
    </ToolCard>
  );
}

const SETUP_TIPS = [
  'Let the display warm up for 15–30 minutes.',
  'Use native resolution and 100% OS scaling (or the test’s 1:1 mode).',
  'Turn off dynamic contrast, eco / auto-brightness, Night Light, and blue-light filters.',
  'Set browser zoom to 100%.',
];

function FullIntro({ entry }) {
  const test = useFullEntry(entry);
  const text = test.page?.intro || test.summary;
  if (!text) return null;
  return (
    <Lead>
      <Inline text={text} />
    </Lead>
  );
}

function InfoDetails({ entry }) {
  const test = useFullEntry(entry);
  const { page } = test;
  const related = getRelatedTests(test);
  const sameCategory = tests.filter((t) => t.category === test.category);
  const idx = sameCategory.findIndex((t) => t.slug === test.slug);
  const next = sameCategory[idx + 1] || related[0];
  const sections = page.sections || [];

  return (
    <>
      <Layout>
        <div>
          <Prose>
            {sections.map((section) => (
              <section key={section.heading} id={section.id}>
                <h2>{section.heading}</h2>
                <Blocks blocks={section.blocks} />
              </section>
            ))}

            {page.lookFor ? (
              <section id="what-to-look-for">
                <h2>What you should see</h2>
                <LookFor>
                  <div>
                    <h3>Normal / pass</h3>
                    <ul>
                      {page.lookFor.good.map((item) => (
                        <li key={item}>
                          <Inline text={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Worth a closer look</h3>
                    <ul>
                      {page.lookFor.bad.map((item) => (
                        <li key={item}>
                          <Inline text={item} />
                        </li>
                      ))}
                    </ul>
                  </div>
                </LookFor>
              </section>
            ) : null}

            {page.panelNotes?.length ? (
              <section id="panel-types">
                <h2>What's normal for your panel type</h2>
                <Blocks
                  blocks={[
                    {
                      table: {
                        head: ['Panel', 'What to expect'],
                        rows: page.panelNotes.map((n) => [`**${n.panel}**`, n.note]),
                      },
                    },
                  ]}
                />
              </section>
            ) : null}

            {page.whenToReturn?.length ? (
              <section id="when-to-return">
                <h2>When to return or RMA</h2>
                <Blocks blocks={[{ ul: page.whenToReturn }]} />
              </section>
            ) : null}
          </Prose>

          {page.affiliates ? <AffiliateProducts group={page.affiliates} /> : null}
          <FAQSection faqs={page.faqs} />

          {next ? (
            <NextUp to={infoPath(next)}>
              <span>
                <small>Next test</small>
                <strong>{next.name}</strong>
              </span>
              <ArrowRight />
            </NextUp>
          ) : null}
        </div>

        <Sidebar>
          <Card>
            <h2>Before you start</h2>
            <ul>
              {(page.tips?.length ? page.tips : SETUP_TIPS).map((tip) => (
                <li key={tip}>
                  <Inline text={tip} />
                </li>
              ))}
            </ul>
            <p style={{ marginTop: '0.75rem' }}>
              <Inline text="Full list: [setup checklist](/guides/setup-checklist)." />
            </p>
          </Card>
          {related.length ? (
            <Card>
              <h2>Related tests</h2>
              <RelatedList>
                {related.map((t) => (
                  <li key={t.slug}>
                    <Link to={infoPath(t)}>
                      {t.name}
                      <span>{t.summary}</span>
                    </Link>
                  </li>
                ))}
              </RelatedList>
            </Card>
          ) : null}
          <Card>
            <h2>New monitor?</h2>
            <p>
              <Inline text="The [guided checkup](/checkup) walks through every test that matters in the return window and saves a report." />
            </p>
          </Card>
          {page.disclaimer ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-subtle)' }}>
              <Inline text={page.disclaimer} />
            </p>
          ) : null}
          <AdSlot slot="sidebar" minHeight={250} margin="0" />
        </Sidebar>
      </Layout>
      <AdSlot slot="belowContent" margin="3rem 0 0" />
    </>
  );
}

const InfoPage = ({ test: entry }) => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const { page } = entry;
  const category = getCategory(entry.category);
  const meta = getRouteMeta(infoPath(entry));
  const fullscreen = hasFullscreen(entry);
  const checkupMode = new URLSearchParams(search).has('checkup') && Boolean(entry.checkup);

  useEffect(() => {
    prefetchTest(entry);
  }, [entry]);

  const answerCheckup = (result) => {
    recordResult(entry.slug, result);
    navigate('/checkup');
  };

  const start = async () => {
    try {
      await enterTestFullscreen();
    } catch {
      // Fullscreen can be refused (iOS, iframes); the test still works windowed.
    }
    navigate(testPath(entry));
  };

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: entry.name,
    description: meta.description,
    url: `${SITE.url}${infoPath(entry)}`,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'Any (web browser)',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    isAccessibleForFree: true,
    ...(page.lastReviewed ? { dateModified: page.lastReviewed } : {}),
  };

  return (
    <Page>
      <JsonLd data={schema} />
      <Breadcrumbs items={meta.breadcrumbs} />
      <Header>
        {category ? <Eyebrow>{category.label}</Eyebrow> : null}
        <H1>{page.title || entry.name}</H1>
        {entry.badges?.length ? (
          <Badges>
            {entry.badges.map((b) => (
              <Badge key={b} $tone={b === 'New' ? 'new' : undefined}>
                {b}
              </Badge>
            ))}
          </Badges>
        ) : null}
        <Suspense fallback={entry.summary ? <Lead>{entry.summary}</Lead> : null}>
          <FullIntro entry={entry} />
        </Suspense>
        {entry.photosensitive ? (
          <Warning role="note">
            <strong>Photosensitivity warning:</strong> this test flashes or flickers rapidly. Skip it if
            you are sensitive to flashing lights.
          </Warning>
        ) : null}
        {fullscreen ? (
          <Actions>
            <Button
              type="button"
              onClick={start}
              onMouseEnter={() => prefetchTest(entry)}
              onFocus={() => prefetchTest(entry)}
            >
              {page.startLabel || `Start ${entry.shortName || entry.name}`}
              <ArrowRight />
            </Button>
            {page.lookFor ? <SeeLink href="#what-to-look-for">What you should see</SeeLink> : null}
          </Actions>
        ) : null}
        {page.lastReviewed ? <Meta>Last reviewed {page.lastReviewed}</Meta> : null}
      </Header>

      {checkupMode ? (
        <CheckupPrompt>
          <p>
            <strong>Checkup:</strong> {entry.checkup.question}
          </p>
          <div className="row">
            {['pass', 'minor', 'fail'].map((result) => (
              <Button key={result} type="button" $variant="secondary" onClick={() => answerCheckup(result)}>
                {RESULT_LABELS[result]}
              </Button>
            ))}
            <Button type="button" $variant="ghost" onClick={() => navigate('/checkup')}>
              Back to checkup
            </Button>
          </div>
        </CheckupPrompt>
      ) : null}

      <AdSlot slot="banner" />

      {entry.inlineTool ? <InlineTool test={entry} /> : null}

      <Suspense fallback={<p style={{ color: 'var(--text-subtle)', margin: '0 0 2rem' }}>Loading…</p>}>
        <InfoDetails entry={entry} />
      </Suspense>
    </Page>
  );
};

export default InfoPage;
