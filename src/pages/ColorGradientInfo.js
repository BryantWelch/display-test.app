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

const ColorGradientInfo = () => {
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/color-gradient');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/color-gradient');
    }
  };

  return (
    <PageContainer>
      <Title>Color Gradient Test</Title>
      <Subtitle>
        Use this test to examine how smoothly your display renders gradients and to spot color banding
        or uneven transitions. It is especially useful when evaluating HDR modes, color profiles, or
        GPU scaling settings.
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />

      <StartTestButton type="button" onClick={handleStartTest}>
        Start color gradient test
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
            <h2>What are gradients and banding?</h2>
            <p>
              A perfect gradient should transition smoothly from dark to light without visible steps.
              On real-world displays, limited bit depth, dithering algorithms, and color processing can
              cause the gradient to break into stripes or blocks. This is called <strong>color banding</strong>.
            </p>
            <p>
              The color gradient test lets you generate adjustable gradients in different colors,
              directions, and step counts so you can see exactly how your panel and graphics pipeline
              handle subtle transitions.
            </p>
          </Section>

          <Section>
            <h2>How to run the color gradient test</h2>
            <ul>
              <li>Set your display to its normal brightness and color mode (or your calibration preset).</li>
              <li>Turn off any aggressive dynamic contrast or sharpening features on the display.</li>
              <li>
                Click <strong>Start color gradient test</strong> above to enter fullscreen mode and
                minimize distractions.
              </li>
              <li>
                Use the controls to choose a base color (white, red, green, blue, etc.) and adjust the
                number of gradient steps.
              </li>
              <li>
                Slowly scan the gradient from one end to the other, watching for visible stripes,
                abrupt jumps, or noisy patches.
              </li>
              <li>
                Try different directions (horizontal, vertical, diagonal) and the radial mode to see how
                uniform the panel looks across the screen.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>How to interpret what you see</h2>
            <p>
              Some mild banding is expected on many 8-bit displays, especially in dark shades. Focus on
              whether the banding is distracting during normal content, such as movies or games.
            </p>
            <ul>
              <li>
                If the gradient looks mostly smooth with only subtle steps, your display and settings are
                performing well.
              </li>
              <li>
                If you see strong, clearly defined bands, your panel or signal path may be truncating
                color information.
              </li>
              <li>
                Noisy, flickering, or blocky areas can indicate heavy temporal dithering or compression.
              </li>
            </ul>
            <p>
              Repeat the test at different brightness levels and with various colors, since some tones
              are more prone to banding than others.
            </p>
          </Section>

          <Section>
            <h2>Tips for reducing banding</h2>
            <p>
              If you notice severe banding, you can try a few adjustments:
            </p>
            <ul>
              <li>Enable 10-bit output in your GPU control panel if your display supports it.</li>
              <li>Use higher-quality color profiles or disable overly aggressive post-processing.</li>
              <li>Ensure your content is not heavily compressed or using limited color depth.</li>
              <li>Keep brightness and contrast at moderate levels instead of extremes.</li>
            </ul>
            <p>
              After changing settings, rerun this test and compare the gradient to see whether banding
              has improved.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h3>When to worry</h3>
          <ul>
            <li>Harsh bands that remain obvious in everyday content.</li>
            <li>Large areas of a gradient collapsing into just a few tones.</li>
            <li>Banding that appears after enabling a specific display mode or GPU feature.</li>
          </ul>

          <h3>Related checks</h3>
          <p>
            Banding often shows up in dark movie scenes, skies, or subtle shadows. After using this test,
            try watching content you know well and see if gradients look smoother.
          </p>
          <p>
            You can also combine this with the{' '}
            <InlineLink to="/gamma">gamma</InlineLink> and{' '}
            <InlineLink to="/uniformity">uniformity</InlineLink> tests in{' '}
            <InlineLink to="/">Display Test</InlineLink> to get a fuller picture of your panel&apos;s
            performance.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This tool helps you visually evaluate gradient rendering and color banding. It does not
            replace professional calibration hardware or manufacturer diagnostics.
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

export default ColorGradientInfo;
