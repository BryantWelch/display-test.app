import React, { useState } from 'react';
import styled from 'styled-components';
import TestShell, { Section } from '../../components/TestShell';

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
  background: ${props => props.$active ? '#4169e1' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${props => props.$active ? '#3658c5' : '#e0e0e0'};
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
  const [brightness, setBrightness] = useState(50);
  const [showGridLines, setShowGridLines] = useState(false);
  const [gridSize, setGridSize] = useState(3);
  const [selectedColor, setSelectedColor] = useState('white');
  const [patternType, setPatternType] = useState('solid');
  const [showCrosshair, setShowCrosshair] = useState(false);
  const [checkerboardSize, setCheckerboardSize] = useState(50);

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
    <TestShell
      title="Uniformity Controls"
      description="Test your display's color and brightness uniformity across the entire screen. Use different colors and grid patterns to identify any inconsistencies in backlight distribution or color reproduction."
      onReset={handleReset}
      style={{ backgroundColor: getBackgroundColor() }}
      controls={
        <>
          <Section>
            <h3>Background Color</h3>
            <ColorPreview color={getBackgroundColor()} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
              {['white', 'red', 'green', 'blue'].map(color => (
                <ToggleButton
                  key={color}
                  type="button"
                  $active={selectedColor === color}
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
                  type="button"
                  $active={patternType === type}
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
              type="button"
              $active={showGridLines}
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
              type="button"
              $active={showCrosshair}
              onClick={() => setShowCrosshair(!showCrosshair)}
              style={{ marginBottom: '1rem' }}
            >
              {showCrosshair ? 'Hide Crosshair' : 'Show Crosshair'}
            </ToggleButton>
          </Section>
        </>
      }
    >
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
    </TestShell>
  );
};

export default UniformityTest;
