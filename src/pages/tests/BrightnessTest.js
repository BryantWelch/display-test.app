import React, { useState, useEffect, useCallback } from 'react';
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
  align-items: center;
  justify-content: center;
  background: black;
  overflow: hidden;
`;

const BrightnessWindow = styled.div`
  background: ${props => `rgba(255, 255, 255, ${props.$brightness})`};
  width: ${props => props.$size}vw;
  height: ${props => props.$size}vh;
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

const Label = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
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

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const BrightnessTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [windowSize, setWindowSize] = useState(15);

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
    setWindowSize(15);
  };

  return (
    <TestContainer>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <BrightnessWindow 
        $brightness={1} 
        $size={windowSize}
      />

      <ControlPanel $isMinimized={isMinimized}>
        <PanelHeader $isMinimized={isMinimized}>
          <h2>Brightness Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
          </MinimizeButton>
        </PanelHeader>

        {!isMinimized && (
          <>
            <Description>
              This test helps evaluate your display's ability to show different levels of brightness 
              across varying window sizes. A larger window size can help identify brightness 
              uniformity issues, while smaller sizes can help test local brightness accuracy. 
              The test uses a pure white square (100% brightness) against a black background 
              for maximum contrast.
            </Description>

            <Section>
              <h3>Window Size</h3>
              <Label>Size: {windowSize}%</Label>
              <Slider
                type="range"
                min="5"
                max="100"
                value={windowSize}
                onChange={(e) => setWindowSize(Number(e.target.value))}
              />
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

export default BrightnessTest;
