import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem;
`;

const Hero = styled.section`
  text-align: center;
  margin-bottom: 4rem;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, var(--primary), #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
`;

const TestCard = styled(Link)`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 1rem;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TestTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
`;

const TestDescription = styled.p`
  color: var(--secondary);
`;

const Home = () => {
  const tests = [
    {
      title: 'Dead Pixel Test',
      description: 'Check your display for dead or stuck pixels with our comprehensive testing tool.',
      path: '/test/dead-pixel'
    },
    {
      title: 'Uniformity Test',
      description: 'Evaluate the consistency of your display\'s brightness and color across the entire screen.',
      path: '/test/uniformity'
    },
    {
      title: 'Text Clarity Test',
      description: 'Assess the clarity and readability of text on your display.',
      path: '/test/text-clarity'
    },
    {
      title: 'Color Gradient Test',
      description: 'Test your display\'s ability to render smooth color gradients and check for color banding issues.',
      path: '/test/color-gradient'
    },
    {
      title: 'Response Time Test',
      description: 'Test your display\'s response time with various moving objects and text. Follow the objects with your eyes to evaluate motion clarity and ghosting.',
      path: '/test/response-time'
    },
    {
      title: 'Color Distance Test',
      description: 'Assess your monitor\'s ability to accurately reproduce similar colors while maintaining their distinction. Test how well your display can differentiate between closely related colors.',
      path: '/test/color-distance'
    },
    {
      title: 'Gamma Test',
      description: 'Evaluate your display\'s gamma calibration and check for proper gray-scale rendering.',
      path: '/test/gamma'
    }
  ];

  return (
    <HomeContainer>
      <Hero>
        <Title>Professional Display Testing</Title>
        <Subtitle>
          Comprehensive tools to evaluate and optimize your display's performance
        </Subtitle>
      </Hero>

      <TestGrid>
        {tests.map((test) => (
          <TestCard key={test.path} to={test.path}>
            <TestTitle>{test.title}</TestTitle>
            <TestDescription>{test.description}</TestDescription>
          </TestCard>
        ))}
      </TestGrid>
    </HomeContainer>
  );
};

export default Home;
