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

const DeadPixelInfo = () => {
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/dead-pixel');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      // Navigate anyway if fullscreen fails
      navigate('/test/dead-pixel');
    }
  };

  return (
    <PageContainer>
      <Title>Dead Pixel Test</Title>
      <Subtitle>
        Use this test to quickly check your monitor or laptop display for dead, stuck, or hot pixels
        before a return window closes, after a new purchase, or whenever you notice something that
        doesn&apos;t look quite right.
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '90px', marginBottom: '2rem' }}
      />

      <StartTestButton type="button" onClick={handleStartTest}>
        Start dead pixel test
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
            <h2>What is a dead or stuck pixel?</h2>
            <p>
              Every pixel on your display is made up of tiny subpixels (red, green, and blue). When one of
              these pixels stops updating correctly, you may see:
            </p>
            <ul>
              <li>
                <strong>Dead pixels</strong> – usually appear completely black and never light up, no matter
                which color is shown.
              </li>
              <li>
                <strong>Stuck pixels</strong> – stay locked on one color (for example, bright red or green)
                even when the rest of the screen changes.
              </li>
              <li>
                <strong>Hot pixels</strong> – appear as always-on bright white points, especially noticeable
                on dark backgrounds.
              </li>
            </ul>
            <p>
              It&apos;s normal for manufacturers to allow a very small number of pixel defects, but obvious
              clusters or high-contrast defects can be distracting and may qualify for a warranty claim.
            </p>
          </Section>

          <Section>
            <h2>How to run the dead pixel test</h2>
            <p>For the most accurate results, follow these steps:</p>
            <ul>
              <li>Clean your screen gently with a microfiber cloth to remove dust and smudges.</li>
              <li>Dim the lights in the room so it&apos;s easier to see small defects.</li>
              <li>Sit at a normal viewing distance and center yourself in front of the display.</li>
              <li>
                Click <strong>Start dead pixel test</strong> above to enter the fullscreen testing mode.
              </li>
              <li>
                Use the controls in the test to cycle through solid colors (black, white, red, green,
                blue, and others).
              </li>
              <li>
                Slowly scan the entire screen for pixels that don&apos;t change or stand out from the
                surrounding area.
              </li>
            </ul>
            <p>
              Take your time on each color. Some stuck pixels are only obvious on specific backgrounds,
              like bright green on red, or white on dark gray.
            </p>
          </Section>

          <Section>
            <h2>How to interpret your results</h2>
            <p>
              After running through all of the colors, think about how noticeable any defects are during
              normal use:
            </p>
            <ul>
              <li>
                A single stuck or dead pixel near the edge of the screen is usually considered acceptable
                by most manufacturers.
              </li>
              <li>
                Multiple defects, or any defects close to the center of the screen, may be much more
                distracting.
              </li>
              <li>
                Clusters of bright or dark pixels can be a sign of a more serious panel issue.
              </li>
            </ul>
            <p>
              If you&apos;re within a retailer&apos;s return window or your display is still under warranty, keep a
              record of what you found. Many brands publish specific pixel policies for different models.
            </p>
          </Section>

          <Section>
            <h2>What to do if you find a bad pixel</h2>
            <p>
              Unfortunately there&apos;s no guaranteed way to fix a dead pixel, but mildly stuck pixels can
              sometimes be improved:
            </p>
            <ul>
              <li>
                Power the display off for a few minutes, then turn it back on and rerun the test.
              </li>
              <li>
                Gently massage the area with a soft cloth while the screen is showing solid colors (only
                if your manufacturer doesn&apos;t warn against this).
              </li>
              <li>
                Search for your monitor model plus &quot;pixel policy&quot; to see if the issue qualifies for
                replacement.
              </li>
            </ul>
            <p>
              If a pixel defect is minor and only visible on very specific backgrounds, it may be easier
              to ignore it during everyday use, especially on high-resolution displays.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h2>Tips for accurate testing</h2>
          <ul>
            <li>Run the test at your display&apos;s native resolution and refresh rate.</li>
            <li>Disable dynamic contrast or local dimming features if they hide small details.</li>
            <li>Check from multiple viewing angles to make sure a bright spot isn&apos;t just glare.</li>
            <li>
              Repeat the test after your display has warmed up for 15–20 minutes, especially on OLED and
              high-refresh-rate panels.
            </li>
          </ul>

          <h3>Run other useful tests</h3>
          <p>
            After checking for pixel defects, you can use the other tools in{' '}
            <InlineLink to="/">Display Test</InlineLink> to verify brightness, contrast, text clarity,
            and overall panel uniformity.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This tool is designed to help you visually inspect your display and does not replace
            manufacturer diagnostics. Always follow your device vendor&apos;s guidelines when requesting
            service or replacement.
          </p>
          <AdSlot
            slot="6371361443" // sidebar_info_page
            style={{ display: 'block', width: '100%', minHeight: '250px', marginTop: '1.5rem' }}
          />
        </SidebarCard>
      </ContentGrid>
    </PageContainer>
  );
};

export default DeadPixelInfo;
