import React from 'react';
import styled from 'styled-components';
import FullscreenLink from '../components/FullscreenLink';
import Header from '../components/Header';

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1520px;
  margin: 0 auto;
  padding: 2rem;

  @media (max-width: 1200px) {
    padding: 1rem;
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem 1rem 2rem;
  }
  
  @media (max-width: 480px) {
    padding: 1.25rem 0.75rem 2rem;
  }
`;

const MainContent = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  width: 100%;
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
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

  @media (max-width: 768px) {
    padding: 1.5rem;

    h2 {
      font-size: 1.35rem;
    }

    p {
      font-size: 0.95rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1.25rem 1rem;

    h2 {
      font-size: 1.2rem;
    }

    p {
      font-size: 0.92rem;
    }
  }
`;

const Home = () => {
  const tests = [
    {
      title: 'Dead Pixel Test',
      description: 'Check your display for dead or stuck pixels using various solid color backgrounds. Cycle through colors manually or automatically to identify display defects.',
      path: '/dead-pixel'
    },
    {
      title: 'Uniformity Test',
      description: 'Test screen uniformity with solid color backgrounds and adjustable grid patterns. Identify backlight bleed and color consistency issues across your entire display.',
      path: '/uniformity'
    },
    {
      title: 'Text Clarity Test',
      description: 'Check your display for text readability with adjustable font sizes, styles, and background colors. Fine-tune letter spacing and line height to evaluate text rendering quality.',
      path: '/text-clarity'
    },
    {
      title: 'Color Gradient Test',
      description: 'Examine your display for color banding with customizable RGB gradients and number of steps. Test your display\'s color smoothness with adjustable gradient patterns.',
      path: '/color-gradient'
    },
    {
      title: 'Response Time Test',
      description: 'Evaluate your display\'s motion clarity using moving objects at different speeds and directions. Test for ghosting and blur with customizable animation controls.',
      path: '/response-time'
    },
    {
      title: 'Color Distance Test',
      description: 'Test your display\'s ability to accurately reproduce similar colors while maintaining their distinction by adjusting the RGB/HEX values of the foreground and background colors.',
      path: '/color-distance'
    },
    {
      title: 'Gamma Test',
      description: 'Check your display\'s gamma calibration across standard values from 1.8 to 2.4. Compare grayscale steps to evaluate gamma accuracy and gray-scale rendering.',
      path: '/gamma'
    },
    {
      title: 'Test Patterns',
      description: 'Analyze display performance with essential calibration and alignment patterns. Switch between different test patterns to check various display characteristics.',
      path: '/test-patterns'
    },
    {
      title: 'Viewing Angle Test',
      description: 'Test viewing angles using a contrasting pattern and color shifts at different positions. Evaluate your display from multiple viewing positions with visual indicators.',
      path: '/viewing-angle'
    },
    {
      title: 'Brightness Test',
      description: 'Measure brightness levels using adjustable white windows from 5% to 100%. Test screen luminance with variable-sized patterns against a black background.',
      path: '/brightness'
    },
    {
      title: 'Contrast Test',
      description: 'Test contrast with adjustable checkerboard patterns from 2x2 to 50x50 grids. Evaluate black and white level separation with customizable pattern sizes.',
      path: '/contrast'
    },
    {
      title: 'Matrix Test',
      description: 'Create Matrix-style digital rain with adjustable text colors, sizes, and animation speeds. Customize the classic effect with various background options. How deep does the rabbit hole go?',
      path: '/matrix'
    }
  ];

  return (
    <HomeContainer>
      <MainContent>
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
      </MainContent>
    </HomeContainer>
  );
};

export default Home;
