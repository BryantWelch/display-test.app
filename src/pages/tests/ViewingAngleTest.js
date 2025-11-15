import React, { useState, useEffect, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useAutoFade } from '../../hooks/useAutoFade';

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

const ControlPanel = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 400px;
  padding: ${props => props.$isMinimized ? '1.25rem' : '2rem'};
  color: #333;
  transition: all 0.3s ease;
  transform: translateY(${props => props.$isMinimized ? 'calc(100% - 4rem)' : '0'});
  backdrop-filter: blur(10px);
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  z-index: 1000;
  opacity: ${props => props.$isVisible ? 1 : 0};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    width: min(360px, 90vw);
    right: 1.25rem;
    left: auto;
    bottom: 1.25rem;
    top: 5.25rem;
    padding: ${props => props.$isMinimized ? '1rem' : '1.5rem'};
  }

  @media (max-width: 480px) {
    width: 92vw;
    right: 4vw;
    left: 4vw;
    bottom: 0.75rem;
    padding: ${props => props.$isMinimized ? '0.9rem' : '1.25rem'};
    border-radius: 0.6rem;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.$isMinimized ? '0' : '1.5rem'};
  padding-bottom: ${props => props.$isMinimized ? '0' : '1rem'};
  border-bottom: ${props => props.$isMinimized ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'};

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
  padding: 0;
  
  &:hover {
    background: #3658c5;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 0.88rem;
    margin-bottom: 1rem;
  }
`;

const Section = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.83rem;
  }
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

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.98rem;
    padding: 0.85rem;
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
  opacity: ${props => props.$isVisible ? 1 : 0};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};

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

  @media (max-width: 768px) {
    top: 1.25rem;
    left: 1.25rem;
    padding: 0.6rem 1rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 0.9rem;
    font-size: 0.95rem;
    border-radius: 0.4rem;
  }
`;

const ViewingAngleTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const { isVisible } = useAutoFade(5000, 2000, isMinimized);
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

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        navigate('/');
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [navigate]);

  // Calculate optimal grid size based on viewport and circle size
  const gridDimensions = useMemo(() => {
    const cols = Math.floor(screenDimensions.width / circleDiameter);
    const rows = Math.floor(screenDimensions.height / circleDiameter);
    return { rows, cols, total: rows * cols };
  }, [screenDimensions, circleDiameter]);

  const circles = useMemo(() => {
    return Array.from({ length: gridDimensions.total }, (_, i) => i);
  }, [gridDimensions.total]);

  const handleExit = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        // Wait for the next frame to ensure fullscreen exit is complete
        requestAnimationFrame(() => {
          navigate('/');
        });
      } catch (err) {
        console.log(`Error exiting fullscreen: ${err.message}`);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleReset = () => {
    setCircleDiameter(100);
  };

  return (
    <TestContainer>
      <ExitButton onClick={handleExit} $isVisible={isVisible}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

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

      <ControlPanel $isMinimized={isMinimized} $isVisible={isVisible}>
        <PanelHeader $isMinimized={isMinimized}>
          <h2>Viewing Angle Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
          </MinimizeButton>
        </PanelHeader>

        {!isMinimized && (
          <>
            <Description>
              This test helps evaluate your display's viewing angle performance. Adjust the circle size to create an optimal pattern
              for checking color and brightness consistency across your screen from different viewing angles.
            </Description>

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
