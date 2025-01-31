import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

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
  background: #000;
  overflow: hidden;
`;

const TestArea = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
`;

const PatternContainer = styled.div`
  width: ${props => `calc(${props.screenWidth}px * 0.98)`};
  height: ${props => `calc(${props.screenHeight}px * 0.98)`};
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
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  grid-template-rows: repeat(${props => props.rows}, 1fr);
  gap: ${props => `calc(${props.screenHeight}px * 0.005)`};
  padding: ${props => `calc(${props.screenHeight}px * 0.005)`};
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
  background: #4169e1;
  border: none;
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  line-height: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(65, 105, 225, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 24px;
    height: 24px;
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
  z-index: 100;

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

const Section = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    font-size: 0.9rem;
    margin-bottom: 0.75rem;
    color: #666;
    font-weight: 500;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const Description = styled.p`
  font-size: 0.9rem;
  line-height: 1.5;
  color: #666;
  margin-bottom: 1.5rem;
`;

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const SliderLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 0.9rem;

  span {
    font-weight: 500;
  }
`;

const Slider = styled.input`
  width: 100%;
  height: 4px;
  background: #ddd;
  border-radius: 2px;
  appearance: none;
  outline: none;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 16px;
    height: 16px;
    background: #4169e1;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      background: #2851db;
    }
  }

  &::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: #4169e1;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      transform: scale(1.2);
      background: #2851db;
    }
  }
`;

const ResetButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4169e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #2851db;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ViewingAngleTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [gridSize, setGridSize] = useState(5);
  const [screenDimensions, setScreenDimensions] = useState({
    width: window.screen.width,
    height: window.screen.height
  });

  useEffect(() => {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });

    const handleResize = () => {
      setScreenDimensions({
        width: window.screen.width,
        height: window.screen.height
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleExit = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    navigate(-1);
  };

  const handleReset = () => {
    setGridSize(5);
  };

  const totalCircles = gridSize * gridSize;

  return (
    <TestContainer>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <TestArea>
        <PatternContainer 
          screenWidth={screenDimensions.width}
          screenHeight={screenDimensions.height}
        >
          <Pattern 
            rows={gridSize} 
            columns={gridSize}
            screenHeight={screenDimensions.height}
          >
            {Array.from({ length: totalCircles }, (_, i) => (
              <CircleContainer key={i}>
                <Circle />
              </CircleContainer>
            ))}
          </Pattern>
        </PatternContainer>
      </TestArea>

      <ControlPanel isMinimized={isMinimized}>
        <PanelHeader isMinimized={isMinimized}>
          <h2>Viewing Angle Test Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
          </MinimizeButton>
        </PanelHeader>

        {!isMinimized && (
          <>
            <Description>
              This test helps evaluate your display's viewing angle performance. Use the slider to adjust the density of test circles across your screen.
              Each circle should maintain consistent brightness and shape when viewed from different angles. Higher densities create a more detailed test pattern
              to help identify any inconsistencies across the entire screen surface.
            </Description>

            <Section>
              <h3>Circle Density</h3>
              <SliderContainer>
                <SliderLabel>
                  <span>Grid Size:</span>
                  <span>{gridSize} × {gridSize}</span>
                </SliderLabel>
                <Slider
                  type="range"
                  min="2"
                  max="25"
                  value={gridSize}
                  onChange={(e) => setGridSize(parseInt(e.target.value))}
                />
              </SliderContainer>
            </Section>

            <Section>
              <ResetButton onClick={handleReset}>Reset Settings</ResetButton>
            </Section>
          </>
        )}
      </ControlPanel>
    </TestContainer>
  );
};

export default ViewingAngleTest;
