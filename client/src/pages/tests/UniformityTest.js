import React, { useState } from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Controls = styled.div`
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  gap: 1rem;
`;

const Button = styled.button`
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: #333;
  width: 100%;
  height: 100%;
`;

const Cell = styled.div`
  background: ${props => props.color};
  width: 100%;
  height: 100%;
`;

const UniformityTest = () => {
  const [brightness, setBrightness] = useState(50);

  const handleBrightnessChange = (delta) => {
    setBrightness(prev => Math.max(0, Math.min(100, prev + delta)));
  };

  const color = `rgb(${brightness * 2.55}, ${brightness * 2.55}, ${brightness * 2.55})`;

  return (
    <TestContainer>
      <Controls>
        <Button onClick={() => handleBrightnessChange(-10)}>Darker</Button>
        <Button onClick={() => handleBrightnessChange(10)}>Brighter</Button>
        <Button onClick={() => window.history.back()}>Exit Test</Button>
      </Controls>
      <Grid>
        {Array(9).fill(0).map((_, i) => (
          <Cell key={i} color={color} />
        ))}
      </Grid>
    </TestContainer>
  );
};

export default UniformityTest;
