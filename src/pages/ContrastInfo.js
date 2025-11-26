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

const ContrastInfo = () => {
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/contrast');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/contrast');
    }
  };

  return (
    <PageContainer>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />
      <Title>Contrast Test</Title>
      <Subtitle>
        This guide explains how to use the contrast checkerboard patterns to see how well your display
        distinguishes between dark and light areas at different sizes.
      </Subtitle>

      <StartTestButton type="button" onClick={handleStartTest}>
        Start contrast test
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
            <h2>Why contrast matters</h2>
            <p>
              Contrast is the difference between the darkest blacks and brightest whites your display can
              show. Higher usable contrast makes images and text look more three-dimensional and easier to
              read, especially in dark scenes.
            </p>
            <p>
              This test uses a black-and-white checkerboard to reveal how clearly your display separates
              adjacent dark and bright areas and whether small details remain distinct.
            </p>
          </Section>

          <Section>
            <h2>How to run the contrast test</h2>
            <ul>
              <li>Set your monitor or TV to the picture mode you normally use.</li>
              <li>Dim the room lights if you want to judge contrast for movie watching or gaming.</li>
              <li>
                Click <strong>Start contrast test</strong> above to enter fullscreen and show the
                checkerboard pattern.
              </li>
              <li>
                Use the grid size slider in the fullscreen controls to switch between coarse and fine
                patterns.
              </li>
              <li>
                Step back a bit from the screen and see how well individual squares remain visible at
                different sizes.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>What to look for</h2>
            <p>
              As you change grid size and viewing distance, pay attention to:
            </p>
            <ul>
              <li>Whether black squares look deep and dark rather than washed-out gray.</li>
              <li>Whether white squares appear bright without losing detail or blooming heavily.</li>
              <li>
                If very small checkerboards start to blur together into a gray tone, indicating limited
                fine-detail contrast.
              </li>
              <li>Any visible tint in the whites or uneven shading across the screen.</li>
            </ul>
          </Section>

          <Section>
            <h2>Improving perceived contrast</h2>
            <p>
              If the pattern looks flat or washed out, you can experiment with:
            </p>
            <ul>
              <li>Adjusting the display&apos;s contrast control slightly (avoiding clipping of bright details).</li>
              <li>Lowering brightness in a dark room so blacks look deeper.</li>
              <li>Enabling or tuning local dimming on compatible monitors and TVs.</li>
            </ul>
            <p>
              After each adjustment, rerun the test and compare how distinct the black and white squares
              appear.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h2>Tips for accurate testing</h2>
          <ul>
            <li>View the screen straight on to avoid off-axis glow that can lighten blacks.</li>
            <li>Run the test at your display&apos;s native resolution to avoid scaling artifacts.</li>
            <li>Try both light and dark room conditions to match your typical usage.</li>
          </ul>

          <h3>Related tests</h3>
          <p>
            Combine this contrast test with the brightness, gamma, and test patterns tools in{' '}
            <InlineLink to="/">Display Test</InlineLink> to dial in picture settings that work well for
            your environment.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This is a visual check and not a replacement for calibrated contrast measurements. For
            professional evaluation, use a meter and calibration software.
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

export default ContrastInfo;
