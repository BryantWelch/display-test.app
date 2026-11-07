import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import AdSlot from '../components/AdSlot';
import FAQSection from '../components/FAQSection';
import JsonLd from '../components/JsonLd';
import { Badge, ButtonLink, Card, Grid, ArrowRight } from '../components/ui';
import { guides, guidePath, infoPath, testsByCategory, tests } from '../registry';
import { SITE } from '../registry/routeMeta';
import { getDisplayInfo } from '../utils/displayInfo';
import { measureRefreshRate } from '../utils/frameTiming';

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  background:
    radial-gradient(900px 400px at 85% -10%, rgba(56, 189, 248, 0.16), transparent 60%),
    radial-gradient(700px 400px at -10% 120%, rgba(74, 222, 128, 0.08), transparent 60%),
    repeating-linear-gradient(90deg, rgba(148, 163, 184, 0.035) 0 1px, transparent 1px 4px);
`;

const HeroInner = styled.div`
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 4.5rem 1.5rem 4rem;
  display: grid;
  grid-template-columns: minmax(0, 1.35fr) minmax(300px, 1fr);
  gap: 3rem;
  align-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
    padding: 3rem 1rem 2.5rem;
    gap: 2rem;
  }
`;

const Kicker = styled.p`
  display: inline-flex;
  gap: 0.5rem;
  align-items: center;
  font-size: var(--fs-small);
  color: var(--text-muted);
  margin-bottom: 1.25rem;

  span {
    width: 0.5rem;
    height: 0.5rem;
    border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.15);
  }
`;

const Title = styled.h1`
  font-size: var(--fs-hero);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.05;
  margin-bottom: 1.25rem;

  em {
    font-style: normal;
    background: linear-gradient(90deg, #f87171, #fbbf24, #4ade80, #38bdf8, #a78bfa);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
`;

const Sub = styled.p`
  font-size: 1.15rem;
  color: var(--text-muted);
  max-width: 56ch;
  line-height: 1.7;
`;

const HeroActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const DisplayCard = styled(Card)`
  background: rgba(17, 26, 46, 0.85);
  backdrop-filter: blur(6px);

  h2 {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-subtle);
    margin-bottom: 1rem;
  }

  dl {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem 1.25rem;
  }

  dt {
    font-size: 0.8rem;
    color: var(--text-subtle);
  }

  dd {
    font-size: 1.25rem;
    font-weight: 650;
    font-variant-numeric: tabular-nums;
  }

  a {
    display: inline-flex;
    gap: 0.35rem;
    align-items: center;
    margin-top: 1.25rem;
    color: var(--accent);
    font-weight: 600;
  }
`;

const Body = styled.div`
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 0 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const CategorySection = styled.section`
  margin-top: 3.5rem;
  scroll-margin-top: calc(var(--nav-height) + 1rem);

  header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 1rem;
    flex-wrap: wrap;
    margin-bottom: 1.1rem;
  }

  h2 {
    font-size: var(--fs-h2);
  }

  header p {
    color: var(--text-muted);
    font-size: 0.95rem;
  }
`;

const TestCard = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  height: 100%;
  padding: 1.25rem 1.35rem;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--border);
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;

  &:hover {
    border-color: var(--accent);
    background: var(--surface-2);
    transform: translateY(-2px);
  }

  h3 {
    font-size: 1.08rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  p {
    color: var(--text-muted);
    font-size: 0.93rem;
    line-height: 1.55;
  }
`;

const Honest = styled.section`
  margin-top: 4rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  h2 {
    grid-column: 1 / -1;
    font-size: var(--fs-h2);
  }

  h3 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
  }

  ul {
    padding-left: 1.1rem;
    color: var(--text-muted);
    line-height: 1.7;
  }
`;

const GuideCard = styled(TestCard)``;

function DisplaySnapshot() {
  const [info, setInfo] = useState(null);
  const [hz, setHz] = useState(null);

  useEffect(() => {
    setInfo(getDisplayInfo());
    let cancelled = false;
    measureRefreshRate({ durationMs: 1200 }).then((r) => {
      if (!cancelled && r) setHz(r.snappedHz);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <DisplayCard as="aside" aria-label="Your display">
      <h2>Your display, as the browser sees it</h2>
      <dl>
        <div>
          <dt>Resolution</dt>
          <dd>{info ? `${info.physicalWidth} × ${info.physicalHeight}` : '—'}</dd>
        </div>
        <div>
          <dt>Refresh rate</dt>
          <dd>{hz ? `≈ ${hz} Hz` : info ? 'Measuring…' : '—'}</dd>
        </div>
        <div>
          <dt>Scaling</dt>
          <dd>{info ? `${info.scalingPercent}%` : '—'}</dd>
        </div>
        <div>
          <dt>Color / range</dt>
          <dd>{info ? `${info.gamut || 'n/a'} · ${info.dynamicRange || 'n/a'}` : '—'}</dd>
        </div>
      </dl>
      <Link to="/screen-resolution">
        Full display report <ArrowRight />
      </Link>
    </DisplayCard>
  );
}

const HOME_FAQS = [
  {
    question: 'Are browser-based monitor tests accurate?',
    answer:
      'For finding defects — dead and stuck pixels, backlight bleed, banding, ghosting, wrong refresh rate, washed-out blacks — yes: your eyes are the instrument and the test just shows the right pattern. For absolute numbers like nits, contrast ratio, color error (Delta E) or millisecond response times you need a colorimeter or high-speed camera. Each test page says which kind it is.',
  },
  {
    question: 'What should I test first on a new monitor?',
    answer:
      'Confirm the resolution and refresh rate are what you paid for, then check dead pixels, backlight bleed / uniformity, and black levels while you are inside the return window. The [new monitor checkup](/checkup) walks through it in order and saves a report.',
  },
  {
    question: 'Do I need to install anything?',
    answer:
      'No. Everything runs in your browser and nothing is uploaded. For best results use fullscreen, native resolution, 100% browser zoom, and turn off Night Light or blue-light filters.',
  },
  {
    question: 'Does it work on TVs, laptops, and phones?',
    answer:
      'Yes — any device with a modern browser. TVs and phones may not allow true fullscreen or report refresh rate correctly, and laptop/phone panels often have auto-brightness you should turn off first.',
  },
];

const Home = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    description:
      'Free browser-based monitor tests for dead pixels, refresh rate, ghosting, backlight bleed, gamma, banding, HDR and more.',
  };

  return (
    <>
      <JsonLd data={schema} />
      <Hero>
        <HeroInner>
          <div>
            <Kicker>
              <span aria-hidden="true" /> Free · No install · {tests.length} tests and tools
            </Kicker>
            <Title>
              Know your display. <em>Find every flaw.</em>
            </Title>
            <Sub>
              Check a new monitor for dead pixels, backlight bleed, and the wrong refresh rate before the return
              window closes — then dig into gamma, banding, motion clarity, and HDR. Every test explains what
              “normal” looks like.
            </Sub>
            <HeroActions>
              <ButtonLink to="/checkup">
                Start the new monitor checkup <ArrowRight />
              </ButtonLink>
              <ButtonLink to="/#tests" $variant="secondary">
                Browse all tests
              </ButtonLink>
            </HeroActions>
          </div>
          <DisplaySnapshot />
        </HeroInner>
      </Hero>

      <Body>
        <div id="tests" style={{ scrollMarginTop: 'calc(var(--nav-height) + 1rem)' }} />
        {testsByCategory.map((category) => (
          <CategorySection key={category.id} id={category.id} aria-labelledby={`cat-${category.id}`}>
            <header>
              <h2 id={`cat-${category.id}`}>{category.label}</h2>
              <p>{category.description}</p>
            </header>
            <Grid $min="250px">
              {category.tests.map((t) => (
                <TestCard key={t.slug} to={infoPath(t)}>
                  <h3>
                    {t.name}
                    {t.badges?.map((b) => (
                      <Badge key={b} $tone={b === 'New' ? 'new' : undefined}>
                        {b}
                      </Badge>
                    ))}
                  </h3>
                  <p>{t.summary}</p>
                </TestCard>
              ))}
            </Grid>
          </CategorySection>
        ))}

        <AdSlot slot="belowContent" margin="3.5rem 0 0" />

        {guides.length ? (
          <CategorySection aria-labelledby="home-guides">
            <header>
              <h2 id="home-guides">Guides</h2>
              <p>
                <Link to="/guides" style={{ color: 'var(--accent)' }}>
                  All guides →
                </Link>
              </p>
            </header>
            <Grid $min="260px">
              {guides.slice(0, 6).map((g) => (
                <GuideCard key={g.slug} to={guidePath(g)}>
                  <h3>{g.name}</h3>
                  <p>{g.summary}</p>
                </GuideCard>
              ))}
            </Grid>
          </CategorySection>
        ) : null}

        <Honest aria-labelledby="honest-heading">
          <h2 id="honest-heading">What a browser test can — and can't — tell you</h2>
          <Card>
            <h3>Reliable in a browser</h3>
            <ul>
              <li>Dead, stuck, and hot pixels</li>
              <li>Backlight bleed, IPS glow, uniformity, blooming</li>
              <li>Actual refresh rate and dropped frames</li>
              <li>Ghosting, overshoot, and motion blur (visually)</li>
              <li>Black crush, white clipping, banding, chroma subsampling</li>
            </ul>
          </Card>
          <Card>
            <h3>Needs hardware</h3>
            <ul>
              <li>Brightness in nits and contrast ratio — use a colorimeter</li>
              <li>Color accuracy (Delta E) and measured gamma — use a colorimeter</li>
              <li>Response time in ms and true input lag — use a high-speed camera or photodiode</li>
              <li>PWM flicker frequency — use a slow-motion phone camera or meter</li>
            </ul>
          </Card>
        </Honest>

        <FAQSection faqs={HOME_FAQS} />
      </Body>
    </>
  );
};

export default Home;
