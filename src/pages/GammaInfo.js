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

const GammaInfo = () => {
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/gamma');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/gamma');
    }
  };

  return (
    <PageContainer>
      <Title>Gamma Test</Title>
      <Subtitle>
        This guide helps you understand and evaluate your display's gamma response so midtones, shadows,
        and highlights look balanced and natural.
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />

      <StartTestButton type="button" onClick={handleStartTest}>
        Start gamma test
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
            <h2>What is gamma?</h2>
            <p>
              Gamma describes how a display maps numeric signal values (0–255) to visible brightness. Most
              modern sRGB displays target a gamma around 2.2, which gives a natural balance between shadow
              detail and highlight brightness.
            </p>
            <p>
              If gamma is too low, midtones look washed out and flat. If gamma is too high, shadows crush
              together and dark scenes lose detail. This test visualizes several gamma curves side by side
              so you can see which one your screen most closely matches.
            </p>
          </Section>

          <Section>
            <h2>How to run the gamma test</h2>
            <ul>
              <li>Reset your monitor to a neutral picture mode (often called sRGB, Standard, or Rec.709).</li>
              <li>Turn off dynamic contrast and other automatic brightness features.</li>
              <li>
                Click <strong>Start gamma test</strong> above to enter fullscreen and minimize surrounding
                distractions.
              </li>
              <li>
                In the gamma test, each row represents a different target gamma (1.8, 2.0, 2.2, 2.4) with
                gray steps from dark to light.
              </li>
              <li>
                Look for the row where the perceived change in brightness between each neighboring box
                feels the most even.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>Interpreting the patterns</h2>
            <p>
              When gamma is correct, midtone steps should feel evenly spaced: no sudden jump in the center
              and no bunched-up steps in shadows or highlights.
            </p>
            <ul>
              <li>
                If the lower gamma rows (1.8 or 2.0) look more evenly spaced, your display may be a bit
                too bright in the midtones.
              </li>
              <li>
                If the higher gamma rows (2.4) look more even, your display may be crushing shadows and
                running too dark.
              </li>
              <li>
                For general desktop and web use, gamma 2.2 alignment is usually the best target.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>Improving your gamma</h2>
            <p>
              If the test suggests your gamma is off, you can try:
            </p>
            <ul>
              <li>Using your monitor&apos;s built-in gamma or &quot;PC / sRGB&quot; presets if available.</li>
              <li>Adjusting contrast and brightness controls slightly, then re-checking the patterns.</li>
              <li>On some systems, using calibration tools or system wizards to fine-tune gamma.</li>
            </ul>
            <p>
              After each adjustment, rerun the test and look for the row where the brightness steps appear
              most uniform.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h2>Tips for accurate viewing</h2>
          <ul>
            <li>View the screen straight on; off-axis viewing can change perceived gamma.</li>
            <li>Avoid strong reflections or bright lights behind you that might wash out dark tones.</li>
            <li>Give your eyes a minute to adapt to the screen before judging subtle differences.</li>
          </ul>

          <h3>Combine with other tests</h3>
          <p>
            Gamma interacts with brightness, contrast, and color. After running this test, you may want to
            revisit the brightness, contrast, and color gradient tests in{' '}
            <InlineLink to="/">Display Test</InlineLink> to confirm everything looks balanced.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This gamma test is a visual guide, not a formal calibration tool. For professional-grade
            accuracy, use a hardware colorimeter and calibration software.
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

export default GammaInfo;
