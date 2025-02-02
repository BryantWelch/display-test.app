import React, { useState, useEffect, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

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
  border: 2px solid ${props => props.$isSelected ? '#4169e1' : 'transparent'};
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

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.95rem;
  cursor: pointer;

  input {
    width: 1rem;
    height: 1rem;
  }
`;

const DeadPixelTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('#808080');
  const [isAutoChanging, setIsAutoChanging] = useState(false);
  const autoChangeRef = useRef(null);

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

  const initializeTest = useCallback(() => {
    // Add any initialization logic here if needed
  }, []);

  useEffect(() => {
    initializeTest();
  }, []);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        navigate(-1);
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [navigate]);

  useEffect(() => {
    if (isAutoChanging) {
      const colorValues = colors.map(color => color.value);
      let currentIndex = colorValues.indexOf(backgroundColor);

      autoChangeRef.current = setInterval(() => {
        currentIndex = (currentIndex + 1) % colorValues.length;
        setBackgroundColor(colorValues[currentIndex]);
      }, 2000);

      return () => {
        if (autoChangeRef.current) {
          clearInterval(autoChangeRef.current);
        }
      };
    }
  }, [isAutoChanging, backgroundColor]);

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
    setBackgroundColor('#808080');
    setIsAutoChanging(false);
    if (autoChangeRef.current) {
      clearInterval(autoChangeRef.current);
    }
  };

  return (
    <TestContainer style={{ backgroundColor: backgroundColor }}>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <ControlPanel $isMinimized={isMinimized}>
        <PanelHeader $isMinimized={isMinimized}>
          <h2>Dead Pixel Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
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
                    $isSelected={backgroundColor === color.value}
                    onClick={() => setBackgroundColor(color.value)}
                    title={color.name}
                  />
                ))}
              </ColorGrid>
            </Section>

            <Section>
              <h3>Auto Cycle</h3>
              <Description>
                Enable automatic cycling through all colors to help identify stuck or dead pixels.
                Colors will change every 2 seconds.
              </Description>
              <Checkbox>
                <input
                  type="checkbox"
                  checked={isAutoChanging}
                  onChange={(e) => setIsAutoChanging(e.target.checked)}
                />
                Enable auto color change
              </Checkbox>
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
