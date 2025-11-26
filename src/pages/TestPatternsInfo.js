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

const TestPatternsInfo = () => {
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/test-patterns');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/test-patterns');
    }
  };

  return (
    <PageContainer>
      <Title>Test Patterns</Title>
      <Subtitle>
        Use this collection of professional test patterns to check sharpness, geometry, scaling,
        overscan, and other core aspects of your display. Patterns are automatically matched to your
        screen resolution.
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />
      <StartTestButton type="button" onClick={handleStartTest}>
        Start test patterns
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
            <h2>What these patterns are for</h2>
            <p>
              Test patterns are synthetic images designed to reveal specific display characteristics more
              clearly than normal content. They help you see issues like scaling artifacts, soft focus,
              crushed blacks, or clipping that might be hard to notice otherwise.
            </p>
            <p>
              In the fullscreen test, you can choose from categories such as geometry, sharpness, color,
              and contrast, then select individual patterns within each category.
            </p>
          </Section>

          <Section>
            <h2>How to use the test patterns</h2>
            <ul>
              <li>Make sure your display is set to its native resolution and preferred refresh rate.</li>
              <li>
                Click <strong>Start test patterns</strong> above to enter fullscreen so the images fill the
                screen without window borders or scaling.
              </li>
              <li>
                In the test, choose a category and pattern from the dropdowns. Each pattern name describes
                the type of check it is intended for.
              </li>
              <li>
                Take your time with each pattern—small imperfections are easier to spot when you focus on
                one test at a time.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>Examples of common checks</h2>
            <p>Depending on the pattern you choose, look for issues like:</p>
            <ul>
              <li>
                <strong>Sharpness / Focus</strong> – fine text and line patterns should look crisp without
                excessive ringing or halos.
              </li>
              <li>
                <strong>Geometry</strong> – straight lines should remain straight with no bowing or uneven
                scaling.
              </li>
              <li>
                <strong>Overscan</strong> – the outer frame or markers should be fully visible, not cut off
                at the edges.
              </li>
              <li>
                <strong>Clipping and levels</strong> – near-black and near-white bars should remain
                distinguishable if your brightness and contrast are set correctly.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>Using the results</h2>
            <p>
              If a specific pattern reveals a problem, you can experiment with monitor settings (sharpness,
              aspect ratio, scaling, or picture mode) and run the same pattern again to confirm
              improvements.
            </p>
            <p>
              For home theater setups, these patterns are especially useful to ensure that your TV isn&apos;t
              cropping the image, that pixels map 1:1, and that fine detail from media players or game
              consoles is preserved.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h2>Tips for accurate evaluation</h2>
          <ul>
            <li>Stand or sit at the distance you normally use for games or movies.</li>
            <li>Disable any &quot;demo&quot; or store mode that alters brightness and contrast automatically.</li>
            <li>Use a dark or neutral room if possible to better see low-level detail.</li>
          </ul>

          <h3>Related tools</h3>
          <p>
            Combine these patterns with the brightness, contrast, uniformity, and gamma tests in{' '}
            <InlineLink to="/">Display Test</InlineLink> to fine-tune your setup and confirm the changes
            you make.
          </p>

          <h3>Disclaimer</h3>
          <p>
            These patterns provide a practical way to check and adjust a display by eye. For precise
            calibration to industry standards, use dedicated calibration hardware and software.
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

export default TestPatternsInfo;
