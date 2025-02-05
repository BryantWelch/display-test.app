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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: background 0.3s ease;
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

const RangeControl = styled.div`
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }

  input[type="range"] {
    width: 100%;
    margin: 0.5rem 0;
  }
`;

const ToggleButton = styled.button`
  background: ${props => props.$active ? '#4169e1' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${props => props.$active ? '#365bb7' : '#e0e0e0'};
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
`;

const ColorPreview = styled.div`
  width: 100%;
  height: 40px;
  margin-bottom: 1rem;
  border-radius: 4px;
  background: ${props => props.$gradient};
  border: 1px solid rgba(0, 0, 0, 0.1);
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

const ColorGradientTest = () => {
  const navigate = useNavigate();
  const [steps, setSteps] = useState(32);
  const [selectedColor, setSelectedColor] = useState('white');
  const [isMinimized, setIsMinimized] = useState(false);
  const [gradientDirection, setGradientDirection] = useState('horizontal');
  const [gradientType, setGradientType] = useState('linear');
  const [distribution, setDistribution] = useState('linear');

  const initializeTest = useCallback(() => {
    // Add initialization logic here if needed
  }, []);

  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

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
    setSteps(32);
    setSelectedColor('white');
    setGradientDirection('horizontal');
    setGradientType('linear');
    setDistribution('linear');
  };

  const getColor = () => {
    const colors = {
      white: 'rgb(255, 255, 255)',
      red: 'rgb(255, 0, 0)',
      green: 'rgb(0, 255, 0)',
      blue: 'rgb(0, 0, 255)',
      magenta: 'rgb(255, 0, 255)',
      yellow: 'rgb(255, 255, 0)',
      cyan: 'rgb(0, 255, 255)',
      orange: 'rgb(255, 165, 0)'
    };
    return colors[selectedColor] || colors.white;
  };

  const getGradientDirection = (direction) => {
    switch (direction) {
      case 'horizontal':
        return '90deg';
      case 'vertical':
        return '180deg';
      case 'diagonal-1':
        return '45deg';
      case 'diagonal-2':
        return '135deg';
      case 'diagonal-3':
        return '225deg';  // For top-right black to bottom-left color
      case 'diagonal-4':
        return '315deg';  // For bottom-right black to top-left color
      default:
        return 'to right';
    }
  };

  const distributeSteps = (i, totalSteps) => {
    if (distribution === 'linear') {
      return i / totalSteps;
    }
    // Emphasize dark regions with more steps
    return Math.pow(i / totalSteps, 2);
  };

  const generateGradient = (stepCount = steps) => {
    const targetColor = getColor();
    const match = targetColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    const [, r, g, b] = match.map(Number);
    
    if (gradientType === 'radial') {
      return generateRadialGradient(r, g, b, stepCount);
    }

    // Create distinct color bands
    const gradientStops = [];
    for (let i = 0; i <= stepCount; i++) {
      const ratio = distributeSteps(i, stepCount);
      const startPercent = (i / stepCount) * 100;
      const endPercent = ((i + 1) / stepCount) * 100;
      
      const currentR = Math.round(r * ratio);
      const currentG = Math.round(g * ratio);
      const currentB = Math.round(b * ratio);
      const color = `rgb(${currentR}, ${currentG}, ${currentB})`;
      
      if (i < stepCount) {
        gradientStops.push(`${color} ${startPercent}%`);
        gradientStops.push(`${color} ${endPercent}%`);
      }
    }

    const direction = getGradientDirection(gradientDirection);
    return `linear-gradient(${direction}, ${gradientStops.join(', ')})`;
  };

  const generateRadialGradient = (r, g, b, stepCount) => {
    const gradientStops = [];
    
    // Create distinct circular bands
    for (let i = 0; i <= stepCount; i++) {
      const ratio = distributeSteps(i, stepCount);
      const startPercent = (i / stepCount) * 100;
      const endPercent = ((i + 1) / stepCount) * 100;
      
      const currentR = Math.round(r * ratio);
      const currentG = Math.round(g * ratio);
      const currentB = Math.round(b * ratio);
      const color = `rgb(${currentR}, ${currentG}, ${currentB})`;
      
      // Add two stops for each step to create distinct bands
      // For the last step, we only need one stop
      if (i < stepCount) {
        gradientStops.push(`${color} ${startPercent}%`);
        gradientStops.push(`${color} ${endPercent}%`);
      } else {
        gradientStops.push(`${color} ${startPercent}%`);
      }
    }

    return `radial-gradient(circle at center, ${gradientStops.join(', ')})`;
  };

  return (
    <TestContainer style={{ background: generateGradient() }}>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <ControlPanel $isMinimized={isMinimized}>
        <PanelHeader $isMinimized={isMinimized}>
          <h2>GRADIENT CONTROLS</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
          </MinimizeButton>
        </PanelHeader>

        {!isMinimized && (
          <>
            <Description>
              Test your display's gradient rendering capabilities and check for color banding.
              Adjust the target color and number of steps to evaluate smooth color transitions.
            </Description>

            <Section>
              <h3>Target Color</h3>
              <ColorPreview $gradient={generateGradient()} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {['white', 'red', 'green', 'blue', 'magenta', 'yellow', 'cyan', 'orange'].map(color => (
                  <ToggleButton
                    key={color}
                    $active={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </ToggleButton>
                ))}
              </div>
            </Section>

            <Section>
              <h3>Gradient Steps</h3>
              <RangeControl>
                <Label>
                  <span>Steps: {steps}</span>
                </Label>
                <input
                  type="range"
                  min="8"
                  max="256"
                  step="8"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                />
              </RangeControl>
            </Section>

            <Section>
              <h3>Gradient Direction</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {['horizontal', 'vertical', 'diagonal-1', 'diagonal-2', 'diagonal-3', 'diagonal-4'].map(direction => (
                  <ToggleButton
                    key={direction}
                    $active={gradientDirection === direction}
                    onClick={() => setGradientDirection(direction)}
                  >
                    {direction.charAt(0).toUpperCase() + direction.slice(1)}
                  </ToggleButton>
                ))}
              </div>
            </Section>

            <Section>
              <h3>Gradient Type</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {['linear', 'radial'].map(type => (
                  <ToggleButton
                    key={type}
                    $active={gradientType === type}
                    onClick={() => setGradientType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </ToggleButton>
                ))}
              </div>
            </Section>

            <Section>
              <h3>Step Distribution</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                {['linear', 'non-linear'].map(dist => (
                  <ToggleButton
                    key={dist}
                    $active={distribution === dist}
                    onClick={() => setDistribution(dist)}
                  >
                    {dist.charAt(0).toUpperCase() + dist.slice(1)}
                  </ToggleButton>
                ))}
              </div>
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

export default ColorGradientTest;
