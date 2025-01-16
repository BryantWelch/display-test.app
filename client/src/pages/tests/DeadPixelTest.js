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

const colors = ['white', 'black', 'red', 'green', 'blue'];

const DeadPixelTest = () => {
  const [currentColor, setCurrentColor] = useState(0);

  const handleNextColor = () => {
    setCurrentColor((prev) => (prev + 1) % colors.length);
  };

  return (
    <TestContainer style={{ backgroundColor: colors[currentColor] }}>
      <Controls>
        <Button onClick={handleNextColor}>Next Color</Button>
        <Button onClick={() => window.history.back()}>Exit Test</Button>
      </Controls>
    </TestContainer>
  );
};

export default DeadPixelTest;
