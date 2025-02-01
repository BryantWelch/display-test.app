import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const TestContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: black;
  overflow: hidden;
`;

const CheckerboardContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: grid;
  grid-template-columns: ${props => `repeat(${props.size}, 1fr)`};
  grid-template-rows: ${props => `repeat(${props.size}, 1fr)`};
  width: 100%;
  height: 100%;
  background: white;
`;

const Square = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.isBlack ? 'black' : 'white'};
`;

const ControlPanel = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);
  width: 400px;
  padding: ${props => props.isMinimized ? '1.25rem' : '2rem'};
  color: #333;
  transition: all 0.3s ease;
  transform: translateY(${props => props.isMinimized ? 'calc(100% - 4rem)' : '0'});
  backdrop-filter: blur(10px);
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.isMinimized ? '0' : '1.5rem'};
  padding-bottom: ${props => props.isMinimized ? '0' : '1rem'};
  border-bottom: ${props => props.isMinimized ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'};

  h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const MinimizeButton = styled.button`
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  &:hover {
    color: #333;
  }
`;

const ExitButton = styled.button`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  z-index: 1000;

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const FullScreenButton = styled(ExitButton)`
  left: auto;
  right: 1.5rem;
`;

const Section = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #666;
  }
`;

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const Description = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #666;
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #4169e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.1rem;
  transition: all 0.2s ease;

  &:hover {
    background: #3658c5;
  }
`;

const ContrastTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [gridSize, setGridSize] = useState(8);

  const initializeTest = () => {
    // Add initialization logic here if needed
  };

  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

  const handleExit = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.log(`Error exiting fullscreen: ${err.message}`);
      }
    }
    navigate(-1);
  }, [navigate]);

  const handleReset = () => {
    setGridSize(8);
  };

  const renderCheckerboard = () => {
    const squares = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
      const row = Math.floor(i / gridSize);
      const col = i % gridSize;
      const isBlack = (row + col) % 2 === 0;
      squares.push(<Square key={i} isBlack={isBlack} />);
    }
    return squares;
  };

  return (
    <TestContainer>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <CheckerboardContainer size={gridSize}>
        {renderCheckerboard()}
      </CheckerboardContainer>

      <ControlPanel isMinimized={isMinimized}>
        <PanelHeader isMinimized={isMinimized}>
          <h2>Contrast Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? '▼' : '▲'}
          </MinimizeButton>
        </PanelHeader>

        <Description>
          This test evaluates your display's contrast capabilities using a black and white 
          checkerboard pattern. By adjusting the grid size, you can test contrast at different 
          scales, which helps identify any contrast ratio issues or display artifacts. 
          Smaller grid sizes are useful for testing fine detail contrast, while larger 
          patterns help evaluate overall contrast performance.
        </Description>

        <Section>
          <h3>Grid Size</h3>
          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Size: {gridSize}x{gridSize} grid
          </div>
          <Slider
            type="range"
            min="2"
            max="50"
            value={gridSize}
            onChange={(e) => setGridSize(Number(e.target.value))}
          />
        </Section>

        <Section>
          <ResetButton onClick={handleReset}>Reset Settings</ResetButton>
        </Section>
      </ControlPanel>
    </TestContainer>
  );
};

export default ContrastTest;
