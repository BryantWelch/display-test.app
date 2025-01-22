import React, { useState, useEffect } from 'react';
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
  transition: background-color 0.3s ease;
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

const FullScreenButton = styled(ExitButton)`
  left: auto;
  right: 1.5rem;
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
  padding: 0;
  
  &:hover {
    background: #3658c5;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const Description = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  h3 {
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 1rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ColorButton = styled.button`
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid ${props => props.isSelected ? '#4169e1' : 'transparent'};
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${props => props.color};
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
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
  margin-top: 1rem;
  
  &:hover {
    background: #3658c5;
  }
`;

const colors = [
  { name: 'White', value: '#FFFFFF' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#FF0000' },
  { name: 'Green', value: '#00FF00' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Yellow', value: '#FFFF00' },
  { name: 'Magenta', value: '#FF00FF' },
  { name: 'Cyan', value: '#00FFFF' },
  { name: 'Gray', value: '#808080' }
];

const DeadPixelTest = () => {
  const [currentColor, setCurrentColor] = useState(0);
  const [isMinimized, setIsMinimized] = useState(false);
  const [autoChange, setAutoChange] = useState(false);
  const [changeInterval, setChangeInterval] = useState(2000);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  const handleReset = () => {
    setCurrentColor(0);
    setAutoChange(false);
    if (changeInterval) {
      clearInterval(changeInterval);
      setChangeInterval(2000);
    }
  };

  useEffect(() => {
    let intervalId;
    if (autoChange) {
      intervalId = setInterval(() => {
        setCurrentColor((prev) => (prev + 1) % colors.length);
      }, changeInterval);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [autoChange, changeInterval]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  return (
    <TestContainer style={{ backgroundColor: colors[currentColor].value }}>
      <ExitButton onClick={() => window.history.back()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <FullScreenButton onClick={toggleFullScreen}>
        {isFullScreen ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
            Exit Full Screen
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8V3h5M3 16v5h5m8-5v5h5M21 8V3h-5" />
            </svg>
            Full Screen
          </>
        )}
      </FullScreenButton>

      <ControlPanel isMinimized={isMinimized}>
        <PanelHeader isMinimized={isMinimized}>
          <h2>Dead Pixel Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 15l-6-6-6 6" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 9l6 6 6-6" />
              </svg>
            )}
          </MinimizeButton>
        </PanelHeader>

        {!isMinimized && (
          <>
            <Description>
              Test your display for dead or stuck pixels by cycling through different colors. 
              A dead pixel will appear black on all colors, while a stuck pixel will remain 
              one color regardless of the background.
            </Description>

            <Section>
              <h3>Background Color</h3>
              <ColorGrid>
                {colors.map((color, index) => (
                  <ColorButton
                    key={color.name}
                    color={color.value}
                    isSelected={currentColor === index}
                    onClick={() => setCurrentColor(index)}
                    title={color.name}
                  />
                ))}
              </ColorGrid>
            </Section>

            <Section>
              <h3>Auto Cycle</h3>
              <label>
                <input
                  type="checkbox"
                  checked={autoChange}
                  onChange={(e) => setAutoChange(e.target.checked)}
                />
                {' '}Enable auto color change
              </label>
              {autoChange && (
                <div>
                  <input
                    type="range"
                    min="500"
                    max="5000"
                    step="500"
                    value={changeInterval}
                    onChange={(e) => setChangeInterval(Number(e.target.value))}
                  />
                  <span>{changeInterval / 1000}s</span>
                </div>
              )}
            </Section>

            <Section>
              <ResetButton onClick={handleReset}>
                Reset settings
              </ResetButton>
            </Section>
          </>
        )}
      </ControlPanel>
    </TestContainer>
  );
};

export default DeadPixelTest;
