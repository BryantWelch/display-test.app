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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: ${props => props.color};
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

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns}, 1fr);
  gap: ${props => props.showGridLines ? '1px' : '0'};
  background: ${props => props.showGridLines ? '#333' : 'transparent'};
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
`;

const Cell = styled.div`
  background: ${props => props.color};
  width: 100%;
  height: 100%;
  transition: background-color 0.3s ease;
`;

const ColorPreview = styled.div`
  width: 100%;
  height: 40px;
  background: ${props => props.color};
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
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

const ToggleButton = styled.button`
  background: ${props => props.active ? '#4169e1' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;
  
  &:hover {
    background: ${props => props.active ? '#3658c5' : '#e0e0e0'};
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

const Checkerboard = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: ${props => `
    linear-gradient(45deg, ${props.color1} 25%, transparent 25%),
    linear-gradient(-45deg, ${props.color1} 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, ${props.color1} 75%),
    linear-gradient(-45deg, transparent 75%, ${props.color1} 75%)
  `};
  background-size: ${props => `${props.size}px ${props.size}px`};
  background-position: 0 0, 0 ${props => props.size/2}px, ${props => props.size/2}px ${props => -props.size/2}px, ${props => -props.size/2}px 0px;
  background-color: ${props => props.color2};
  transition: all 0.3s ease;
`;

const Crosshair = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  pointer-events: none;

  /* Vertical line */
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 0;
    width: 4px;
    height: 100%;
    transform: translateX(-50%);
    background: linear-gradient(
      to bottom,
      yellow 0%,
      yellow 42%,
      transparent 42%,
      transparent 58%,
      yellow 58%,
      yellow 100%
    );
    border: 1px solid black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }

  /* Horizontal line */
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    height: 4px;
    transform: translateY(-50%);
    background: linear-gradient(
      to right,
      yellow 0%,
      yellow 42%,
      transparent 42%,
      transparent 58%,
      yellow 58%,
      yellow 100%
    );
    border: 1px solid black;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
`;

const UniformityTest = () => {
  const navigate = useNavigate();
  const [brightness, setBrightness] = useState(50);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showGridLines, setShowGridLines] = useState(false);
  const [gridSize, setGridSize] = useState(3);
  const [selectedColor, setSelectedColor] = useState('white');
  const [patternType, setPatternType] = useState('solid');
  const [showCrosshair, setShowCrosshair] = useState(false);
  const [checkerboardSize, setCheckerboardSize] = useState(50);

  const initializeTest = useCallback(() => {
    // Add initialization logic here if needed
  }, []);

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

  const getBackgroundColor = () => {
    if (selectedColor === 'white') {
      return `rgb(${brightness * 2.55}, ${brightness * 2.55}, ${brightness * 2.55})`;
    }
    const colors = {
      red: `rgb(${brightness * 2.55}, 0, 0)`,
      green: `rgb(0, ${brightness * 2.55}, 0)`,
      blue: `rgb(0, 0, ${brightness * 2.55})`
    };
    return colors[selectedColor] || colors.white;
  };

  const handleReset = () => {
    setBrightness(50);
    setGridSize(3);
    setShowGridLines(false);
    setSelectedColor('white');
    setPatternType('solid');
    setShowCrosshair(false);
    setCheckerboardSize(50);
  };

  return (
    <TestContainer color={getBackgroundColor()}>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      {patternType === 'checkerboard' && (
        <Checkerboard 
          color1={getBackgroundColor()} 
          color2="rgba(0,0,0,0.5)" 
          size={checkerboardSize}
        />
      )}

      {showGridLines && (
        <Grid 
          columns={gridSize} 
          showGridLines={showGridLines}
        >
          {Array(gridSize * gridSize).fill(0).map((_, i) => (
            <Cell key={i} color={getBackgroundColor()} />
          ))}
        </Grid>
      )}

      {showCrosshair && <Crosshair />}

      <ControlPanel isMinimized={isMinimized}>
        <PanelHeader isMinimized={isMinimized}>
          <h2>Uniformity Controls</h2>
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
              Test your display's color and brightness uniformity across the entire screen. 
              Use different colors and grid patterns to identify any inconsistencies in 
              backlight distribution or color reproduction.
            </Description>

            <Section>
              <h3>Background Color</h3>
              <ColorPreview color={getBackgroundColor()} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {['white', 'red', 'green', 'blue'].map(color => (
                  <ToggleButton
                    key={color}
                    active={selectedColor === color}
                    onClick={() => setSelectedColor(color)}
                  >
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </ToggleButton>
                ))}
              </div>
            </Section>

            <Section>
              <h3>Brightness</h3>
              <RangeControl>
                <label>
                  <span>Level: {brightness}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={brightness}
                  onChange={(e) => setBrightness(Number(e.target.value))}
                />
              </RangeControl>
            </Section>

            <Section>
              <h3>Pattern Type</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
                {['solid', 'checkerboard'].map(type => (
                  <ToggleButton
                    key={type}
                    active={patternType === type}
                    onClick={() => setPatternType(type)}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </ToggleButton>
                ))}
              </div>
            </Section>

            {patternType === 'checkerboard' && (
              <Section>
                <h3>Checkerboard Size</h3>
                <RangeControl>
                  <label>
                    <span>Size: {checkerboardSize}px</span>
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="200"
                    value={checkerboardSize}
                    onChange={(e) => setCheckerboardSize(Number(e.target.value))}
                  />
                </RangeControl>
              </Section>
            )}

            <Section>
              <h3>Grid Pattern</h3>
              <ToggleButton
                active={showGridLines}
                onClick={() => setShowGridLines(!showGridLines)}
                style={{ marginBottom: '1rem' }}
              >
                {showGridLines ? 'Hide Grid' : 'Show Grid'}
              </ToggleButton>
              
              {showGridLines && (
                <RangeControl>
                  <label>
                    <span>Grid Size: {gridSize}x{gridSize}</span>
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={gridSize}
                    onChange={(e) => setGridSize(Number(e.target.value))}
                  />
                </RangeControl>
              )}
            </Section>

            <Section>
              <h3>Additional Tools</h3>
              <ToggleButton
                active={showCrosshair}
                onClick={() => setShowCrosshair(!showCrosshair)}
                style={{ marginBottom: '1rem' }}
              >
                {showCrosshair ? 'Hide Crosshair' : 'Show Crosshair'}
              </ToggleButton>
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

export default UniformityTest;