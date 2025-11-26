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

const ViewingAngleInfo = () => {
  const navigate = useNavigate();

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/viewing-angle');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/viewing-angle');
    }
  };

  return (
    <PageContainer>
      <Title>Viewing Angle Test</Title>
      <Subtitle>
        This guide helps you evaluate how your display's colors and brightness change when viewed from
        different positions—a key factor for shared screens and TV-style setups.
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />

      <StartTestButton type="button" onClick={handleStartTest}>
        Start viewing angle test
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
            <h2>What this test shows</h2>
            <p>
              Good viewing angles mean the image stays consistent in brightness, contrast, and color even
              when you move your head or view the screen from the side. Poor viewing angles cause colors
              to shift, darken, or wash out quickly as you move away from the center.
            </p>
            <p>
              The viewing angle test covers your screen with repeating circular gradients. By walking
              around or leaning side to side, you can easily see how uniform those circles remain.
            </p>
          </Section>

          <Section>
            <h2>How to run the viewing angle test</h2>
            <ul>
              <li>Set your monitor or TV to its normal picture mode and brightness level.</li>
              <li>Sit centered in front of the display at your usual viewing distance.</li>
              <li>
                Click <strong>Start viewing angle test</strong> above to enter fullscreen and show the
                circle pattern.
              </li>
              <li>
                From your normal position, note how bright and neutral the center circles look.
              </li>
              <li>
                Slowly move left, right, up, and down, and observe how the circles change in different
                areas of the screen.
              </li>
            </ul>
          </Section>

          <Section>
            <h2>What to look for</h2>
            <p>
              As you move around the screen, pay attention to:
            </p>
            <ul>
              <li>How quickly the overall brightness drops off when viewed from the side.</li>
              <li>Whether whites take on a yellow, blue, or purple tint at extreme angles.</li>
              <li>If dark areas become milky gray (IPS glow) or crush into black (VA black crush).</li>
              <li>Whether colors in the corners look different from the center even when you sit straight on.</li>
            </ul>
            <p>
              Displays with strong viewing angles will keep the circles looking similar from multiple
              positions, while weaker panels will show obvious shifts.
            </p>
          </Section>

          <Section>
            <h2>Using the results</h2>
            <p>
              If you notice severe shifts, consider how you use the display:
            </p>
            <ul>
              <li>
                For solo desktop use, mild viewing angle issues might not matter if you usually sit in the
                center.
              </li>
              <li>
                For couch gaming or TV use with multiple viewers, wide viewing angles are more important.
              </li>
              <li>
                For color-critical work, consistency across the panel helps ensure accurate editing.
              </li>
            </ul>
          </Section>
        </div>

        <SidebarCard>
          <h2>Testing tips</h2>
          <ul>
            <li>View the test in a dim room to better see subtle brightness changes.</li>
            <li>Try different circle sizes in the fullscreen controls to match your screen size.</li>
            <li>
              If your monitor has &quot;viewing angle&quot; or &quot;uniformity&quot; modes, run the test before and after
              enabling them.
            </li>
          </ul>

          <h3>Combine with other tests</h3>
          <p>
            After checking viewing angles, you can use the uniformity, gamma, and color distance tests in{' '}
            <InlineLink to="/">Display Test</InlineLink> to see how your panel behaves from your preferred
            seating positions.
          </p>

          <h3>Disclaimer</h3>
          <p>
            This tool gives a visual impression of viewing angle behavior and is not a substitute for
            formal measurement. Always consider your typical usage distance and room lighting when judging
            results.
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

export default ViewingAngleInfo;
