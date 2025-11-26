import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import AdSlot from '../components/AdSlot';
import { loadResponseTimeTest } from '../testRouteLoader';

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

const ResponseTimeInfo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    loadResponseTimeTest();
  }, []);

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/response-time');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/response-time');
    }
  };

  return (
    <PageContainer>
      <Title>Response Time Test</Title>
      <Subtitle>
        This guide helps you evaluate how quickly your display's pixels change, which affects motion
        clarity, ghosting, and overall responsiveness—especially important for gaming.
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />

      <StartTestButton type="button" onClick={handleStartTest}>
        Start response time test
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
            <h2>What is response time?</h2>
            <p>
              Response time describes how quickly a pixel can change from one level to another. Slow
              transitions cause trails or blurring behind moving objects, while overly aggressive
              overdrive can produce bright halos or inverse ghosting.
            </p>
            <p>
              This test simulates high-contrast motion using either a moving display icon or pursuit text
              so you can inspect how clearly edges remain while tracking objects with your eyes.
            </p>
          </Section>

          <Section>
            <h2>How to run the response time test</h2>
            <ul>
              <li>Set your display to the refresh rate you normally use (e.g., 60 Hz, 120 Hz, 144 Hz).</li>
              <li>Disable motion blur reduction or backlight strobing at first so you can see the baseline.</li>
              <li>
                Click <strong>Start response time test</strong> above to enter fullscreen and minimize
                distractions.
              </li>
              <li>
                Begin with the default speed and a single moving object, then gradually increase speed to
                see when blur and ghosting become obvious.
              </li>
              <li>
                Switch between the "Display" and "Pursuit Text" modes to compare how different types of
                content look in motion.
              </li>
              <li>
                Try both horizontal and vertical directions to match the kind of motion you care about
                most (for example, side-scrolling vs. vertical scrolling games).
              </li>
            </ul>
          </Section>

          <Section>
            <h2>What to look for</h2>
            <p>
              As the objects move across the screen, pay attention to:
            </p>
            <ul>
              <li>How clearly edges and text remain when you follow them with your eyes.</li>
              <li>Any dark trails, smearing, or double images behind high-contrast edges.</li>
              <li>Bright halos or inverse ghosts that indicate aggressive overdrive tuning.</li>
              <li>
                Differences between dark-on-light and light-on-dark objects, which can reveal asymmetric
                pixel transitions.
              </li>
            </ul>
            <p>
              If motion looks significantly clearer at certain speeds or object sizes, note those
              settings—they may resemble how your favorite games or applications behave.
            </p>
          </Section>

          <Section>
            <h2>How to improve motion clarity</h2>
            <p>
              If you are unhappy with the motion performance you see, try adjusting a few options:
            </p>
            <ul>
              <li>Experiment with your monitor&apos;s overdrive or response time setting (often Low/Normal/High).</li>
              <li>Use the highest stable refresh rate your GPU and display support.</li>
              <li>Avoid mixing low frame rates with very high refresh rates, which can feel uneven.</li>
              <li>Check that your connection (e.g., DisplayPort or HDMI version) supports the chosen mode.</li>
            </ul>
            <p>
              After each change, rerun this test and compare how the motion trail and clarity have
              changed.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h2>Additional tips</h2>
          <ul>
            <li>Try dark and bright backgrounds to see how response varies with contrast.</li>
            <li>
              If you have a high-speed camera, you can record the moving objects to analyze frame-by-frame
              behavior.
            </li>
            <li>
              Remember that not all content needs perfectly sharp motion—prioritize settings that feel
              comfortable during your typical use.
            </li>
          </ul>

          <h3>Combine with other tests</h3>
          <p>
            For a full picture of gaming or video performance, pair this with the{' '}
            <InlineLink to="/gamma">gamma</InlineLink>,{' '}
            <InlineLink to="/brightness">brightness</InlineLink>,{' '}
            <InlineLink to="/contrast">contrast</InlineLink>, and{' '}
            <InlineLink to="/viewing-angle">viewing angle</InlineLink> tests in{' '}
            <InlineLink to="/">Display Test</InlineLink>.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This tool provides a visual indication of motion clarity and response behavior. It does not
            replace manufacturer specifications or laboratory-grade measurements.
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

export default ResponseTimeInfo;
