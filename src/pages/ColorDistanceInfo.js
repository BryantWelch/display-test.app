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

const ColorDistanceInfo = () => {
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/color-distance');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/color-distance');
    }
  };

  return (
    <PageContainer>
      <Title>Color Distance Test</Title>
      <Subtitle>
        This guide helps you understand how well your display can distinguish between very similar colors,
        which is important for photo editing, design work, and choosing accessible color schemes.
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />

      <StartTestButton type="button" onClick={handleStartTest}>
        Start color distance test
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
            <h2>What is color distance?</h2>
            <p>
              Color distance is a way of describing how different two colors are from one another. When the
              distance is small, colors may look nearly identical; when it is large, they are clearly
              distinct. Your display&apos;s contrast, bit depth, and calibration all affect how visible those
              differences are.
            </p>
            <p>
              This test shows a foreground square on top of a solid background. By carefully adjusting RGB
              or HEX values, you can find the point where colors just barely separate or completely blend
              together.
            </p>
          </Section>

          <Section>
            <h2>How to run the color distance test</h2>
            <ul>
              <li>Set your monitor to its normal brightness and color mode or calibration preset.</li>
              <li>Sit at your usual viewing distance for photo editing, design work, or gaming.</li>
              <li>
                Click <strong>Start color distance test</strong> above to enter fullscreen, which removes
                surrounding UI distractions.
              </li>
              <li>
                Use the background controls to choose a base gray or color that represents your typical
                content.
              </li>
              <li>
                Slowly adjust the foreground color, either with the RGB sliders or by entering HEX values,
                to see how much difference it takes for the square to stand out clearly.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>What to look for</h2>
            <p>
              As you tweak the values, pay attention to how your perception changes:
            </p>
            <ul>
              <li>At what point do you first notice the foreground square against the background?</li>
              <li>Does the boundary between colors look smooth, or do you see harsh transitions?</li>
              <li>Do small changes in one channel (R, G, or B) produce visible jumps or barely any change?</li>
              <li>Are some color pairs harder to distinguish than others (for example, subtle green vs. gray)?</li>
            </ul>
            <p>
              These observations can help you judge whether your display is suited for color-critical work
              or mostly for general use and gaming.
            </p>
          </Section>

          <Section>
            <h2>Using the results</h2>
            <p>
              If your display struggles to show small differences between similar colors, you may want to:
            </p>
            <ul>
              <li>Increase contrast slightly, avoiding clipping in very dark or very bright regions.</li>
              <li>Use color-managed applications with accurate ICC profiles for your monitor.</li>
              <li>Consider a higher-quality or factory-calibrated panel for demanding color work.</li>
            </ul>
            <p>
              For non-critical tasks, simply knowing which color combinations are easiest to distinguish
              can help you pick better UI themes or in-game HUD colors.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h2>Practical examples</h2>
          <p>
            Subtle color differences matter when grading skin tones, balancing shadows in photos, or
            designing accessible interfaces. This test lets you mimic these situations with simple blocks
            of color.
          </p>

          <h3>Combine with other tools</h3>
          <p>
            For a more complete evaluation, pair this test with the color gradient, gamma, and uniformity
            tests in{' '}
            <InlineLink to="/">Display Test</InlineLink>. Together they give a good overview of how your
            panel handles color detail.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This tool provides a visual, subjective way to explore color differences. It does not replace
            professional calibration equipment or formal color difference metrics like Delta E.
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

export default ColorDistanceInfo;
