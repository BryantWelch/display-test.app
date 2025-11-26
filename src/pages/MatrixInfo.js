import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import AdSlot from '../components/AdSlot';
import { loadMatrixTest } from '../testRouteLoader';

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
  font-size: 2.4rem;
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

const MatrixInfo = () => {
  const navigate = useNavigate();

  useEffect(() => {
    loadMatrixTest();
  }, []);

  const handleStartTest = async () => {
    try {
      await document.documentElement.requestFullscreen();
      navigate('/test/matrix');
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate('/test/matrix');
    }
  };

  return (
    <PageContainer>
      <Title>Matrix Test</Title>
      <Subtitle>
        This playful tool fills your screen with customizable Matrix-style digital rain—great for showing
        off your display or setting a sci-fi mood.
      </Subtitle>
      <Subtitle>
        This one isn't a serious calibration pattern—it's an homage to falling code, green phosphor
        monitors, and the question: &quot;How deep does the rabbit hole go?&quot;
      </Subtitle>
      <AdSlot
        slot="3936769799" // home_top_banner reused for info page top banner
        style={{ display: 'block', width: '100%', minHeight: '70px', marginBottom: '2rem' }}
      />

      <StartTestButton type="button" onClick={handleStartTest}>
        Enter the Matrix
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
            <h2>Blue pill or red pill?</h2>
            <p>
              Strictly speaking, this isn't a display test. It's a toy inspired by the classic &quot;digital
              rain&quot; effect: streams of characters falling down the screen, like a terminal that forgot how
              to stop printing debug logs.
            </p>
            <p>
              You can customize the color, speed, and text size, but the core idea is simple—fill your
              monitor with cascading code and enjoy the vibe.
            </p>
          </Section>

          <Section>
            <h2>How to use the Matrix test</h2>
            <ul>
              <li>Dim the room lights and set your display to a comfortable brightness.</li>
              <li>
                Click <strong>Enter the Matrix</strong> above to go fullscreen and start the rain effect.
              </li>
              <li>
                Use the in-test controls to tweak text color (classic green or something wilder),
                background shade, speed, and font size.
              </li>
              <li>Lean back, watch the code fall, and contemplate simulated realities if you like.</li>
            </ul>
          </Section>

          <Section>
            <h2>Things you might notice</h2>
            <p>
              While this isn't meant as a strict diagnostic, it can still highlight some behavior:
            </p>
            <ul>
              <li>How clear small, high-contrast text looks in motion.</li>
              <li>Whether faint trails appear behind fast-moving characters.</li>
              <li>How evenly the background appears across the screen.</li>
            </ul>
            <p>
              But mostly, it's about enjoying the aesthetic—no lab coat required.
            </p>
          </Section>
        </div>

        <SidebarCard>
          <h2>For fans of the movie</h2>
          <p>
            This effect is a nod to a certain trilogy about choices, reality, and a lot of green code. No
            spoilers here, but if you feel an urge to whisper &quot;There is no spoon&quot;, that's normal.
          </p>

          <h3>Ideas for using it</h3>
          <ul>
            <li>Background ambience while working or coding.</li>
            <li>Fun backdrop for photos or streaming scenes.</li>
            <li>A quick way to show off your monitor in a very nerdy way.</li>
          </ul>

          <h3>Disclaimer</h3>
          <p>
            This &quot;test&quot; is purely for entertainment. For serious calibration, use the other tools in{' '}
            <InlineLink to="/">Display Test</InlineLink>—or take the red pill and buy a colorimeter.
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

export default MatrixInfo;
