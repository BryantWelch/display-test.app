import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Label } from '../../components/TestShell';

const TestArea = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
`;

const PatternContainer = styled.div`
  width: ${props => `calc(${props.$screenWidth}px * 0.98)`};
  height: ${props => `calc(${props.$screenHeight}px * 0.98)`};
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
`;

const Pattern = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  background: #000;
  display: grid;
  grid-template-columns: repeat(${props => props.$columns}, 1fr);
  grid-template-rows: repeat(${props => props.$rows}, 1fr);
  gap: ${props => `calc(${props.$screenHeight}px * 0.005)`};
  padding: ${props => `calc(${props.$screenHeight}px * 0.005)`};
`;

const CircleContainer = styled.div`
  position: relative;
  width: 100%;
  &:after {
    content: '';
    display: block;
    padding-bottom: 100%;
  }
`;

const Circle = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at center,
    rgba(255, 255, 255, 1) 0%,
    rgba(255, 255, 255, 0.95) 10%,
    rgba(255, 255, 255, 0.85) 20%,
    rgba(255, 255, 255, 0.75) 30%,
    rgba(255, 255, 255, 0.6) 40%,
    rgba(255, 255, 255, 0.4) 50%,
    rgba(255, 255, 255, 0.2) 60%,
    rgba(255, 255, 255, 0.1) 70%,
    rgba(255, 255, 255, 0.05) 80%,
    rgba(255, 255, 255, 0) 100%
  );
`;

const RangeControl = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;

  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #666;
  }

  input[type="range"] {
    width: 100%;
  }
`;

const ViewingAngleTest = () => {
  const [circleDiameter, setCircleDiameter] = useState(100); // in pixels
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate optimal grid size based on viewport and circle size
  const gridDimensions = useMemo(() => {
    const cols = Math.floor(screenDimensions.width / circleDiameter);
    const rows = Math.floor(screenDimensions.height / circleDiameter);
    return { rows, cols, total: rows * cols };
  }, [screenDimensions, circleDiameter]);

  const circles = useMemo(() => {
    return Array.from({ length: gridDimensions.total }, (_, i) => i);
  }, [gridDimensions.total]);

  const handleReset = () => {
    setCircleDiameter(100);
  };

  return (
    <TestShell
      title="Viewing Angle Controls"
      description="This test helps evaluate your display's viewing angle performance. Adjust the circle size to create an optimal pattern for checking color and brightness consistency across your screen from different viewing angles."
      onReset={handleReset}
      controls={
        <Section>
          <h3>Circle Size</h3>
          <RangeControl>
            <Label>Size: {circleDiameter}px ({gridDimensions.cols}×{gridDimensions.rows} grid)</Label>
            <input
              type="range"
              min="50"
              max="400"
              step="10"
              value={circleDiameter}
              onChange={(e) => setCircleDiameter(parseInt(e.target.value))}
            />
          </RangeControl>
        </Section>
      }
    >
      <TestArea>
        <PatternContainer
          $screenWidth={screenDimensions.width}
          $screenHeight={screenDimensions.height}
        >
          <Pattern
            $rows={gridDimensions.rows}
            $columns={gridDimensions.cols}
            $screenHeight={screenDimensions.height}
          >
            {circles.map((i) => (
              <CircleContainer key={i}>
                <Circle />
              </CircleContainer>
            ))}
          </Pattern>
        </PatternContainer>
      </TestArea>
    </TestShell>
  );
};

export default ViewingAngleTest;
