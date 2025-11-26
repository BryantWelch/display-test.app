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

const UniformityInfo = () => {
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/uniformity');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/uniformity');
    }
  };

  return (
    <PageContainer>
      <Title>Uniformity Test</Title>
      <Subtitle>
        Use this guide to evaluate how evenly your display distributes brightness and color across the
        screen. It helps you spot backlight bleed, clouding, and other uniformity issues that might be
        distracting during everyday use.
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />

      <StartTestButton type="button" onClick={handleStartTest}>
        Start uniformity test
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
            <h2>What is screen uniformity?</h2>
            <p>
              An ideal display shows the same brightness and color across the entire panel. In the real
              world, backlights, panel coatings, and manufacturing tolerances can cause some areas to
              look slightly brighter, darker, warmer, or cooler than others.
            </p>
            <p>
              The uniformity test fills your screen with solid colors and optional grids or checkerboard
              patterns so you can focus on subtle differences instead of on content.
            </p>
            <ul>
              <li>
                <strong>Brightness uniformity</strong> – checks whether the corners and edges are dimmer or
                brighter than the center.
              </li>
              <li>
                <strong>Color uniformity</strong> – reveals color tints (for example, a greenish edge or a
                warmer center).
              </li>
              <li>
                <strong>Backlight bleed and clouding</strong> – common on LCDs, most visible on dark scenes.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>How to run the uniformity test</h2>
            <p>For a useful comparison, keep the setup consistent while you run through each pattern.</p>
            <ul>
              <li>Set your display to its normal brightness and color mode (or your calibration preset).</li>
              <li>Dim the room lights so small differences are easier to see.</li>
              <li>Sit at your typical viewing distance, centered in front of the screen.</li>
              <li>
                Click <strong>Start uniformity test</strong> above to enter fullscreen testing mode.
              </li>
              <li>
                Cycle through white, red, green, and blue backgrounds while slowly scanning the panel from
                corner to corner.
              </li>
              <li>
                Enable the grid pattern to divide the display into zones and compare each area against the
                center.
              </li>
              <li>
                Try the checkerboard pattern to expose local backlight issues and haloing around objects.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>How to interpret what you see</h2>
            <p>
              Almost every display shows <em>some</em> non‑uniformity. What matters is whether it is visible
              in everyday use and whether it matches your expectations for the panel type and price.
            </p>
            <ul>
              <li>
                Mild corner darkening or slight tint shifts are common on many IPS and VA monitors.
              </li>
              <li>
                Strong bright patches, obvious colored bands, or clearly visible backlight bleed in dim
                rooms may be distracting.
              </li>
              <li>
                If a problem jumps out during this test, it will usually be noticeable in dark movies or
                photo work as well.
              </li>
            </ul>
            <p>
              When in doubt, repeat the test at a few different brightness levels. Some issues only show
              up at high or very low brightness.
            </p>
          </Section>

          <Section>
            <h2>When should you be concerned?</h2>
            <p>
              Consider taking photos or notes if you notice severe issues, especially on a new purchase.
            </p>
            <ul>
              <li>Large bright blobs or streaks that stay visible on normal content.</li>
              <li>One side of the screen looking noticeably warmer or cooler than the rest.</li>
              <li>Strong diagonal bands or patches that do not change with content.</li>
            </ul>
            <p>
              Check your retailer&apos;s return policy or your manufacturer&apos;s uniformity and backlight bleed
              guidelines if you think the panel is outside normal tolerances.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h2>Tips for better uniformity testing</h2>
          <ul>
            <li>Let the display warm up for 15–30 minutes before judging uniformity.</li>
            <li>Turn off dynamic contrast or local dimming to see the raw panel behavior.</li>
            <li>View the screen straight on; extreme angles can exaggerate color and brightness shifts.</li>
            <li>
              If you use multiple monitors, run the test on each one with the same settings for
              side‑by‑side comparison.
            </li>
          </ul>

          <h3>Run additional checks</h3>
          <p>
            After verifying{' '}
            <InlineLink to="/uniformity">uniformity</InlineLink>, you can use the other tools in{' '}
            <InlineLink to="/">Display Test</InlineLink> to check for{' '}
            <InlineLink to="/dead-pixel">dead pixels</InlineLink>, measure{' '}
            <InlineLink to="/brightness">brightness</InlineLink> and{' '}
            <InlineLink to="/contrast">contrast</InlineLink>, and fine‑tune{' '}
            <InlineLink to="/text-clarity">text clarity</InlineLink>.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This test is meant to help you visually evaluate your display and does not replace
            professional calibration or manufacturer diagnostics. Always follow your device vendor&apos;s
            recommendations when requesting service or replacement.
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

export default UniformityInfo;
