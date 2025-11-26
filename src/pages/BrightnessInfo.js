import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import AdSlot from '../components/AdSlot';
import { loadBrightnessTest } from '../testRouteLoader';

const PageContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  color: var(--text-light);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem 3rem;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  margin-bottom: 1rem;
  color: var(--primary);
`;

const Subtitle = styled.p`
  font-size: 1.05rem;
  color: var(--secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const ContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1.2fr;
  gap: 2rem;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.section`
  margin-bottom: 1.75rem;

  h2 {
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
    color: var(--text-light);
  }

  h3 {
    font-size: 1.1rem;
    margin-bottom: 0.5rem;
    color: var(--text-light);
  }

  p {
    color: var(--secondary);
    line-height: 1.7;
    margin-bottom: 0.75rem;
  }

  ul {
    margin: 0.25rem 0 0.75rem;
    padding-left: 1.25rem;
    color: var(--secondary);
  }

  li {
    margin-bottom: 0.35rem;
    line-height: 1.6;
  }
`;

const SidebarCard = styled.aside`
  background: rgba(255, 255, 255, 0.04);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.06);

  h2 {
    font-size: 1.2rem;
    margin-bottom: 0.75rem;
    color: var(--text-light);
  }

  h3 {
    font-size: 1.05rem;
    margin: 1rem 0 0.5rem;
    color: var(--text-light);
  }

  p, li {
    color: var(--secondary);
    font-size: 0.95rem;
    line-height: 1.6;
  }
`;

const StartTestButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.9rem 1.6rem;
  margin: 1.5rem 0 2rem;
  border-radius: 999px;
  border: none;
  background: var(--primary);
  color: #020617;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.5);
  transition: transform 0.1s ease, box-shadow 0.1s ease, background 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 14px 30px rgba(15, 23, 42, 0.6);
    background: #38bdf8;
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 8px 18px rgba(15, 23, 42, 0.5);
  }
`;

const ArrowIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 18px;
    height: 18px;
  }
`;

const InlineLink = styled(Link)`
  color: var(--primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const BrightnessInfo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    loadBrightnessTest();
  }, []);

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/brightness');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/brightness');
    }
  };

  return (
    <PageContainer>
      <Title>Brightness Test</Title>
      <Subtitle>
        Use this test to check your display's peak brightness and how evenly it can light different areas
        of the screen using a bright window on a dark background.
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />

      <StartTestButton type="button" onClick={handleStartTest}>
        Start brightness test
        <ArrowIcon>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" />
            <path d="M13 5l7 7-7 7" />
          </svg>
        </ArrowIcon>
      </StartTestButton>

      <ContentGrid>
        <div>
          <Section>
            <h2>What this test measures</h2>
            <p>
              The brightness test shows a white window on a black background. By changing the window size,
              you can see how your display handles different average picture levels and whether the center
              remains bright when only a small portion of the screen is lit.
            </p>
            <p>
              This is useful for understanding both peak brightness and how features like local dimming,
              ABL (Automatic Brightness Limiting), or power-saving modes behave.
            </p>
          </Section>

          <Section>
            <h2>How to run the brightness test</h2>
            <ul>
              <li>Set your display to the picture mode and brightness you normally use.</li>
              <li>Darken the room if possible to better judge absolute brightness and contrast.</li>
              <li>
                Click <strong>Start brightness test</strong> above to enter fullscreen with a white window
                on black.
              </li>
              <li>
                Start with a medium window size, then adjust the size slider to make the window larger or
                smaller.
              </li>
              <li>
                Watch how the perceived brightness and uniformity of the window change as you adjust the
                size.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>What to look for</h2>
            <p>
              As you change the window size, pay attention to:
            </p>
            <ul>
              <li>Whether the white window stays consistently bright or dims as it grows.</li>
              <li>Any visible blooming or halos around the bright area on dark backgrounds.</li>
              <li>Differences in brightness between the center and the edges of the window.</li>
              <li>Whether your eyes feel strained at very high brightness levels in a dark room.</li>
            </ul>
            <p>
              Many displays will slightly dim a large white window to stay within power or thermal limits,
              especially OLED and some high-brightness LCDs.
            </p>
          </Section>

          <Section>
            <h2>Using the results</h2>
            <p>
              Based on what you see, you might decide to:
            </p>
            <ul>
              <li>Lower peak brightness a bit for dark-room comfort while keeping highlights impactful.</li>
              <li>Increase brightness for bright rooms to maintain readability and contrast.</li>
              <li>Adjust local dimming or HDR modes and rerun the test to see how behavior changes.</li>
            </ul>
            <p>
              Remember that a comfortable, consistent brightness for your environment is more important
              than chasing the highest possible number.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h2>Additional tips</h2>
          <ul>
            <li>Give your eyes a minute to adapt before judging very bright or dark patterns.</li>
            <li>Run the test again after your display has warmed up, as brightness can drift slightly.</li>
            <li>
              If you have a light meter, you can measure the white window at different sizes for more
              precise comparisons.
            </li>
          </ul>

          <h3>Related checks</h3>
          <p>
            After{' '}
            <InlineLink to="/brightness">brightness</InlineLink>, use the{' '}
            <InlineLink to="/contrast">contrast</InlineLink>,{' '}
            <InlineLink to="/uniformity">uniformity</InlineLink>, and{' '}
            <InlineLink to="/gamma">gamma</InlineLink> tests in{' '}
            <InlineLink to="/">Display Test</InlineLink> to get a fuller picture of how your display
            behaves in different conditions.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This test provides a visual way to judge brightness and comfort. For calibrated measurements,
            a dedicated meter and professional software are required.
          </p>
          <AdSlot
            slot="6371361443" // sidebar_info_page
            style={{ display: 'block', width: '100%', minHeight: '250px', marginTop: '1.5rem' }}
          />
        </SidebarCard>
      </ContentGrid>
      <AdSlot
        slot="7385060214" // home_below_grid reused as bottom banner for info page
        style={{ display: 'block', width: '100%', minHeight: '70px', marginTop: '2.5rem' }}
      />
    </PageContainer>
  );
};

export default BrightnessInfo;
