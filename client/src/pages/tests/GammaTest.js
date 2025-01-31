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
  flex: 1;
  background: ${props => props.background};
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
  color: ${props => props.value > 128 ? '#000' : '#fff'};
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
  font-size: 0.9rem;
  color: ${props => props.value > 128 ? '#000' : '#fff'};
  margin-right: 1rem;
  width: 80px;
  text-align: right;
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

const RangeControl = styled.div`
  label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
    color: #666;
  }

  input[type="range"] {
    width: 100%;
    height: 4px;
    background: #e0e0e0;
    border-radius: 2px;
    appearance: none;

    &::-webkit-slider-thumb {
      appearance: none;
      width: 16px;
      height: 16px;
      background: #4169e1;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        transform: scale(1.1);
      }
    }
  }
`;

const ToggleButton = styled.button`
  padding: 0.5rem;
  background: ${props => props.active ? '#4169e1' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#666'};
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;

  &:hover {
    background: ${props => props.active ? '#3658c5' : '#e0e0e0'};
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

const ResetButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background: #4169e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    background: #3658c5;
  }
`;

const Description = styled.p`
  margin: 0 0 2rem 0;
  color: #666;
  line-height: 1.5;
  font-size: 0.95rem;
`;

const GammaTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [boxSize, setBoxSize] = useState(120);
  const [backgroundColor, setBackgroundColor] = useState('gray');
  const [showValues, setShowValues] = useState(true);

  useEffect(() => {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
  }, []);

  const handleExit = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    navigate(-1);
  };

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

  const gammaValues = {
    1.8: calculateGammaSteps(1.8),
    2.0: calculateGammaSteps(2.0),
    2.2: calculateGammaSteps(2.2),
    2.4: calculateGammaSteps(2.4)
  };

  const handleReset = () => {
    setBoxSize(120);
    setBackgroundColor('gray');
    setShowValues(true);
  };

  const renderGraySteps = () => {
    return (
      <GrayStepContainer>
        {Object.entries(gammaValues).map(([gamma, steps]) => (
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
  };

  return (
    <TestContainer>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <TestArea background={backgroundColors[backgroundColor]}>
        {renderGraySteps()}
      </TestArea>

      <ControlPanel isMinimized={isMinimized}>
        <PanelHeader isMinimized={isMinimized}>
          <h2>Gamma Test Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
          </MinimizeButton>
        </PanelHeader>

        {!isMinimized && (
          <>
            <Description>
              This test helps determine your display's gamma value. Each row shows reference patterns for different gamma values (1.8, 2.0, 2.2, 2.4).
              The boxes should appear to have evenly spaced brightness levels within each row. Find the row where the brightness steps look most uniform - 
              this indicates your display's current gamma value.
              
              Standard sRGB displays should target gamma 2.2. If your display's gamma is too low, darker grays will appear too bright. 
              If gamma is too high, darker areas will appear crushed. The percentage values show target brightness, while RGB values show 
              actual pixel values.
            </Description>

            <Section>
              <h3>Box Size</h3>
              <RangeControl>
                <label>
                  <span>Size: {boxSize}px</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
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
                  <option key={name} value={name}>
                    {name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </option>
                ))}
              </Select>
            </Section>

            <Section>
              <h3>Show Values</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <ToggleButton
                  active={showValues}
                  onClick={() => setShowValues(true)}
                >
                  Show
                </ToggleButton>
                <ToggleButton
                  active={!showValues}
                  onClick={() => setShowValues(false)}
                >
                  Hide
                </ToggleButton>
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

export default GammaTest;
