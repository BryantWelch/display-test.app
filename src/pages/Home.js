import React from 'react';
import styled from 'styled-components';
import FullscreenLink from '../components/FullscreenLink';
import Header from '../components/Header';

const HomeContainer = styled.div`
  display: grid;
  grid-template-columns: 160px minmax(auto, 1200px) 160px;
  gap: 2rem;
  padding: 2rem;
  margin: 0 auto;
  max-width: 1520px;

  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
    padding: 1rem;
  }
`;

const AdContainer = styled.div`
  min-height: 600px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  position: sticky;
  top: 5rem;

  @media (max-width: 1200px) {
    display: none;
  }
`;

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TestGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 4rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

const StyledFullscreenLink = styled(FullscreenLink)`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 2rem;
  text-decoration: none;
  color: var(--text-light);
  border: 2px solid transparent;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    border-color: var(--primary);
    background: rgba(255, 255, 255, 0.08);
  }

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--primary);
  }

  p {
    color: var(--secondary);
    line-height: 1.6;
    font-size: 1rem;
  }
`;

const Home = () => {
  const tests = [
    {
      title: 'Dead Pixel Test',
      description: 'Check your display for dead or stuck pixels using various solid color backgrounds. Cycle through colors manually or automatically to identify display defects.',
      path: '/test/dead-pixel'
    },
    {
      title: 'Uniformity Test',
      description: 'Test screen uniformity with solid color backgrounds and adjustable grid patterns. Identify backlight bleed and color consistency issues across your entire display.',
      path: '/test/uniformity'
    },
    {
      title: 'Text Clarity Test',
      description: 'Check your display for text readability with adjustable font sizes, styles, and background colors. Fine-tune letter spacing and line height to evaluate text rendering quality.',
      path: '/test/text-clarity'
    },
    {
      title: 'Color Gradient Test',
      description: 'Examine your display for color banding with customizable RGB gradients and number of steps. Test your display\'s color smoothness with adjustable gradient patterns.',
      path: '/test/color-gradient'
    },
    {
      title: 'Response Time Test',
      description: 'Evaluate your display\'s motion clarity using moving objects at different speeds and directions. Test for ghosting and blur with customizable animation controls.',
      path: '/test/response-time'
    },
    {
      title: 'Color Distance Test',
      description: 'Test your display\'s ability to accurately reproduce similar colors while maintaining their distinction by adjusting the RGB/HEX values of the foreground and background colors.',
      path: '/test/color-distance'
    },
    {
      title: 'Gamma Test',
      description: 'Check your display\'s gamma calibration across standard values from 1.8 to 2.4. Compare grayscale steps to evaluate gamma accuracy and gray-scale rendering.',
      path: '/test/gamma'
    },
    {
      title: 'Test Patterns',
      description: 'Analyze display performance with essential calibration and alignment patterns. Switch between different test patterns to check various display characteristics.',
      path: '/test/test-patterns'
    },
    {
      title: 'Viewing Angle Test',
      description: 'Test viewing angles using a contrasting pattern and color shifts at different positions. Evaluate your display from multiple viewing positions with visual indicators.',
      path: '/test/viewing-angle'
    },
    {
      title: 'Brightness Test',
      description: 'Measure brightness levels using adjustable white windows from 5% to 100%. Test screen luminance with variable-sized patterns against a black background.',
      path: '/test/brightness'
    },
    {
      title: 'Contrast Test',
      description: 'Test contrast with adjustable checkerboard patterns from 2x2 to 50x50 grids. Evaluate black and white level separation with customizable pattern sizes.',
      path: '/test/contrast'
    },
    {
      title: 'Matrix Test',
      description: 'Create Matrix-style digital rain with adjustable text colors, sizes, and animation speeds. Customize the classic effect with various background options. How deep does the rabbit hole go?',
      path: '/test/matrix'
    }
  ];

  return (
    <HomeContainer>
      <AdContainer id="left-ad">
        {/* Left Ad Space - Will be populated by AdSense */}
      </AdContainer>
      
      <ContentContainer>
        <Header />
        <TestGrid>
          {tests.map((test) => (
            <StyledFullscreenLink
              key={test.path}
              to={test.path}
              title={test.title}
              description={test.description}
            />
          ))}
        </TestGrid>
      </ContentContainer>

      <AdContainer id="right-ad">
        {/* Right Ad Space - Will be populated by AdSense */}
      </AdContainer>
    </HomeContainer>
  );
};

export default Home;
