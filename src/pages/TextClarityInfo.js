import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import AdSlot from '../components/AdSlot';

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

const TextClarityInfo = () => {
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/text-clarity');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/text-clarity');
    }
  };

  return (
    <PageContainer>
      <Title>Text Clarity Test</Title>
      <Subtitle>
        This guide helps you evaluate how clearly text appears on your display so you can reduce eye
        strain and choose settings that make long reading or work sessions more comfortable.
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />

      <StartTestButton type="button" onClick={handleStartTest}>
        Start text clarity test
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
            <h2>Why text clarity matters</h2>
            <p>
              If you spend a lot of time reading, coding, or writing documents, small differences in text
              rendering can have a big impact on eye strain and fatigue. Blurry edges, poor contrast, or
              awkward spacing make it harder to skim and focus.
            </p>
            <p>
              This test fills your screen with repeated lines of text and provides controls to adjust font
              size, line height, letter spacing, and color scheme so you can quickly see what feels most
              comfortable on your display.
            </p>
          </Section>

          <Section>
            <h2>How to run the text clarity test</h2>
            <ul>
              <li>Set your system scaling and resolution to the values you normally use.</li>
              <li>Sit at your typical working distance from the display.</li>
              <li>
                Click <strong>Start text clarity test</strong> above to enter fullscreen testing mode.
              </li>
              <li>
                Use the controls to switch between common fonts (sans-serif, serif, monospace) and adjust
                the font size until small text is just readable without squinting.
              </li>
              <li>
                Experiment with line height and letter spacing to see which combination makes paragraphs
                feel the most natural to read.
              </li>
              <li>
                Toggle between black-on-white and white-on-black to mimic light and dark theme reading
                environments.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>What to look for</h2>
            <p>
              As you adjust the settings, pay attention to a few key signs of good or poor text clarity:
            </p>
            <ul>
              <li>Smooth, consistent letter shapes without jagged edges or colored fringes.</li>
              <li>Even spacing between letters and lines, with no characters touching or overlapping.</li>
              <li>Text that remains readable without excessive effort when you briefly look away and refocus.</li>
              <li>No obvious shimmering or color shift when scrolling or moving your eyes across lines.</li>
            </ul>
            <p>
              If one configuration feels noticeably easier to read than another, it is usually the better
              choice for long sessions, even if it uses a slightly larger font size.
            </p>
          </Section>

          <Section>
            <h2>Improving text clarity on your system</h2>
            <p>
              If the test reveals persistent issues, you can try a few system-level tweaks:
            </p>
            <ul>
              <li>On Windows, run the built-in <strong>ClearType</strong> wizard to fine-tune font smoothing.</li>
              <li>On macOS or Linux, experiment with font smoothing and scaling settings in system preferences.</li>
              <li>Use your display&apos;s native resolution whenever possible, especially on LCD panels.</li>
              <li>Increase application or browser zoom instead of lowering resolution to make text larger.</li>
            </ul>
            <p>
              After making changes, rerun this test to confirm that text looks better and is easier to read.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h2>Tips for comfortable reading</h2>
          <ul>
            <li>Keep brightness at a comfortable level relative to your room lighting.</li>
            <li>Prefer high-contrast text themes when working in bright environments.</li>
            <li>Avoid extremely thin fonts on low-resolution or older monitors.</li>
            <li>Take regular breaks and look away from the screen to reduce eye strain.</li>
          </ul>

          <h3>Try other tests</h3>
          <p>
            After checking{' '}
            <InlineLink to="/text-clarity">text clarity</InlineLink>, you can use the other tools in{' '}
            <InlineLink to="/">Display Test</InlineLink> to verify{' '}
            <InlineLink to="/gamma">gamma</InlineLink>,{' '}
            <InlineLink to="/brightness">brightness</InlineLink>,{' '}
            <InlineLink to="/contrast">contrast</InlineLink>, and overall panel{' '}
            <InlineLink to="/uniformity">uniformity</InlineLink>.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This tool is designed to help you visually evaluate text clarity and comfort. It does not
            replace professional eye care or medical advice. Consult an eye care professional if you
            experience persistent discomfort while using screens.
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

export default TextClarityInfo;
