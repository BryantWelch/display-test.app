import React, { useState } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Label } from '../../components/TestShell';

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

const ColorPreview = styled.div`
  width: 100%;
  height: 40px;
  margin-bottom: 1rem;
  border-radius: 4px;
  background: ${props => props.$gradient};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ColorGradientTest = () => {
  const [steps, setSteps] = useState(32);
  const [selectedColor, setSelectedColor] = useState('white');
  const [gradientDirection, setGradientDirection] = useState('horizontal');
  const [gradientType, setGradientType] = useState('linear');
  const [distribution, setDistribution] = useState('linear');

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

  return (
    <TestShell
      title="Gradient Controls"
      description="Test your display's gradient rendering capabilities and check for color banding. Adjust the target color and number of steps to evaluate smooth color transitions."
      onReset={handleReset}
      style={{ background: generateGradient() }}
      controls={
        <>
          <Section>
            <h3>Target Color</h3>
            <ColorPreview $gradient={generateGradient()} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              {['white', 'red', 'green', 'blue', 'magenta', 'yellow', 'cyan', 'orange'].map(color => (
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
                  type="button"
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
                  type="button"
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
                  type="button"
                  $active={distribution === dist}
                  onClick={() => setDistribution(dist)}
                >
                  {dist.charAt(0).toUpperCase() + dist.slice(1)}
                </ToggleButton>
              ))}
            </div>
          </Section>
        </>
      }
    />
  );
};

export default ColorGradientTest;
