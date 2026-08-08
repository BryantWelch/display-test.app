import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Label } from '../../components/TestShell';

const TestArea = styled.div`
  flex: 1;
  background: ${props => props.$background};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 2rem;
`;

const GrayStepContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  overflow-x: auto;
  padding: 1rem;
`;

const StepRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
  justify-content: center;
`;

const GrayBox = styled.div`
  width: ${props => props.size * 1.5}px;
  height: ${props => props.size * 1.5}px;
  background: rgb(${props => props.value}, ${props => props.value}, ${props => props.value});
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.value === 0 ? '#fff' : '#000'};
  font-size: 1rem;
  user-select: none;
  text-align: center;
  gap: 0.25rem;

  span.percentage {
    font-weight: bold;
  }

  span.rgb {
    font-size: 0.9rem;
    opacity: 0.8;
  }
`;

const RowLabel = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  color: ${props => props.value === 0 ? '#fff' : '#000'};
  margin-right: 1rem;
  width: 80px;
  text-align: right;
  background: ${props => props.value === 0 ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'};
  padding: 4px 8px;
  border-radius: 4px;
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
  padding: 0.5rem;
  background: ${props => props.$active ? '#4169e1' : '#f0f0f0'};
  color: ${props => props.$active ? 'white' : '#666'};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.$active ? '#3658c5' : '#e0e0e0'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  font-size: 0.9rem;
  color: #333;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4169e1;
  }
`;

const GammaTest = () => {
  const [boxSize, setBoxSize] = useState(100);
  const [backgroundColor, setBackgroundColor] = useState('#808080');
  const [showValues, setShowValues] = useState(true);

  const backgroundColors = {
    'white': '#FFFFFF',
    'light-gray': '#E0E0E0',
    'gray': '#808080',
    'dark-gray': '#404040',
    'black': '#000000'
  };

  // Calculate gamma-corrected RGB values
  const calculateGammaSteps = (gamma) => {
    const brightnessLevels = [0, 0.2, 0.4, 0.6, 0.8, 1.0];
    return brightnessLevels.map(brightness => ({
      percentage: Math.round(brightness * 100),
      rgb: Math.round(255 * Math.pow(brightness, 1/gamma))
    }));
  };

  const gammaValues = useMemo(() => ({
    1.8: calculateGammaSteps(1.8),
    2.0: calculateGammaSteps(2.0),
    2.2: calculateGammaSteps(2.2),
    2.4: calculateGammaSteps(2.4)
  }), []);

  const handleReset = () => {
    setBoxSize(100);
    setBackgroundColor('#808080');
    setShowValues(true);
  };

  const renderGraySteps = useCallback(() => {
    return (
      <GrayStepContainer>
        {Object.entries(gammaValues)
          .sort(([a], [b]) => parseFloat(a) - parseFloat(b))
          .map(([gamma, steps]) => (
          <StepRow key={gamma}>
            <RowLabel value={backgroundColor === 'white' ? 0 : 255}>
              γ = {gamma}
            </RowLabel>
            {steps.map((step, index) => (
              <GrayBox
                key={index}
                value={step.rgb}
                size={boxSize}
              >
                {showValues && (
                  <>
                    <span className="percentage">{step.percentage}%</span>
                    <span className="rgb">RGB: {step.rgb}</span>
                  </>
                )}
              </GrayBox>
            ))}
          </StepRow>
        ))}
      </GrayStepContainer>
    );
  }, [boxSize, gammaValues, showValues, backgroundColor]);

  return (
    <TestShell
      title="Gamma Controls"
      description="This test helps determine your display's gamma value. Each row shows reference patterns for different gamma values (1.8, 2.0, 2.2, 2.4). The boxes should appear to have evenly spaced brightness levels within each row. Find the row where the brightness steps look most uniform - this indicates your display's current gamma value. Standard sRGB displays should target gamma 2.2. If your display's gamma is too low, darker grays will appear too bright. If gamma is too high, darker areas will appear crushed. The percentage values show target brightness, while RGB values show actual pixel values."
      onReset={handleReset}
      controls={
        <>
          <Section>
            <h3>Box Size</h3>
            <RangeControl>
              <Label>Size: {boxSize}px</Label>
              <input
                type="range"
                min="50"
                max="200"
                step="5"
                value={boxSize}
                onChange={(e) => setBoxSize(Number(e.target.value))}
              />
            </RangeControl>
          </Section>

          <Section>
            <h3>Background Color</h3>
            <Select
              value={backgroundColor}
              onChange={(e) => setBackgroundColor(e.target.value)}
            >
              {Object.entries(backgroundColors).map(([name, value]) => (
                <option key={name} value={value}>
                  {name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </Select>
          </Section>

          <Section>
            <h3>Show Values</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <ToggleButton
                type="button"
                $active={showValues}
                onClick={() => setShowValues(true)}
              >
                Show
              </ToggleButton>
              <ToggleButton
                type="button"
                $active={!showValues}
                onClick={() => setShowValues(false)}
              >
                Hide
              </ToggleButton>
            </div>
          </Section>
        </>
      }
    >
      <TestArea $background={backgroundColor}>
        {renderGraySteps()}
      </TestArea>
    </TestShell>
  );
};

export default GammaTest;
