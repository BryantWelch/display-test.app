import React, { useState } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Label } from '../../components/TestShell';

const CheckerboardContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: ${props => `repeat(${props.$size}, 1fr)`};
  grid-template-rows: ${props => `repeat(${props.$size}, 1fr)`};
  width: 100%;
  height: 100%;
  background: white;
`;

const Square = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.$isBlack ? 'black' : 'white'};
`;

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const ContrastTest = () => {
  const [gridSize, setGridSize] = useState(8);

  const handleReset = () => {
    setGridSize(8);
  };

  const renderCheckerboard = () => {
    const squares = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const isBlack = (row + col) % 2 === 0;
      squares.push(<Square key={i} $isBlack={isBlack} />);
    }
    return squares;
  };

  return (
    <TestShell
      title="Contrast Controls"
      description="This test evaluates your display's contrast capabilities using a black and white checkerboard pattern. By adjusting the grid size, you can test contrast at different scales, which helps identify any contrast ratio issues or display artifacts. Smaller grid sizes are useful for testing fine detail contrast, while larger patterns help evaluate overall contrast performance."
      onReset={handleReset}
      controls={
        <Section>
          <h3>Grid Size</h3>
          <Label>Size: {gridSize}x{gridSize} grid</Label>
          <Slider
            type="range"
            min="2"
            max="50"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
          />
        </Section>
      }
    >
      <CheckerboardContainer $size={gridSize}>
        {renderCheckerboard()}
      </CheckerboardContainer>
    </TestShell>
  );
};

export default ContrastTest;
