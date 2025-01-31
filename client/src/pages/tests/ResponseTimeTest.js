import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import testPatternImage from '../../assets/test-pattern.svg';
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
  margin-bottom: 2rem;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const Description = styled.p`
  margin: 0 0 2rem 0;
  color: #666;
  line-height: 1.5;
  font-size: 0.95rem;
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
  background: ${props => props.active ? '#4169e1' : '#f0f0f0'};
  color: ${props => props.active ? 'white' : '#333'};
  border: none;
  border-radius: 4px;
  padding: 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  width: 100%;

  &:hover {
    background: ${props => props.active ? '#365bb7' : '#e0e0e0'};
  }
`;

const TestArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.background};
  overflow: hidden;
`;

const MovingBlock = styled.div`
  position: absolute;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  left: ${props => props.direction === 'horizontal' ? -props.size : props.offset}px;
  top: ${props => props.direction === 'vertical' ? -props.size : props.offset}px;
  animation: ${props => props.direction === 'horizontal' ? 'moveRight' : 'moveDown'} ${props => 100/props.speed}s linear infinite;
  background: url(${testPatternImage}) no-repeat center center;
  background-size: contain;
  filter: ${props => props.color === 'white' ? 'invert(1)' : 'none'};
  will-change: transform;

  @keyframes moveRight {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(${window.screen.width}px + ${props => props.size}px));
    }
  }

  @keyframes moveDown {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(${window.screen.height}px + ${props => props.size}px));
    }
  }
`;

const PursuitText = styled.div`
  position: absolute;
  color: ${props => props.color === 'white' ? 'white' : 'black'};
  font-size: ${props => props.size}px;
  left: ${props => props.direction === 'horizontal' ? -props.size : props.offset}px;
  top: ${props => props.direction === 'vertical' ? -props.size : props.offset}px;
  white-space: nowrap;
  animation: ${props => props.direction === 'horizontal' ? 'moveRight' : 'moveDown'} ${props => 100/props.speed}s linear infinite;
  will-change: transform;

  @keyframes moveRight {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(${window.screen.width}px + ${props => props.size}px));
    }
  }

  @keyframes moveDown {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(${window.screen.height}px + ${props => props.size}px));
    }
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

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  background: white;
  font-size: 1rem;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4169e1;
  }
`;

const ResponseTimeTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [testType, setTestType] = useState('moving-block');
  const [speed, setSpeed] = useState(35);
  const [blockSize, setBlockSize] = useState(50);
  const [backgroundColor, setBackgroundColor] = useState('gray');
  const [objectColor, setObjectColor] = useState('black');
  const [direction, setDirection] = useState('horizontal');
  const [objectCount, setObjectCount] = useState(1);

  const backgroundColors = {
    'white': '#FFFFFF',
    'light-gray': '#E0E0E0',
    'gray': '#808080',
    'dark-gray': '#404040',
    'black': '#000000',
    'navy': '#000080',
    'royal-blue': '#4169E1',
    'teal': '#008080',
    'forest-green': '#228B22',
    'burgundy': '#800020'
  };

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

  const handleReset = () => {
    setTestType('moving-block');
    setSpeed(35);
    setBlockSize(50);
    setBackgroundColor('gray');
    setObjectColor('black');
    setDirection('horizontal');
    setObjectCount(1);
  };

  const renderTest = () => {
    const objects = [];
    for (let i = 0; i < objectCount; i++) {
      const offset = (i * 100) + (window.innerHeight - (objectCount * 100)) / 2;

      if (testType === 'moving-block') {
        objects.push(
          <MovingBlock
            key={i}
            size={blockSize}
            color={objectColor}
            speed={speed}
            direction={direction}
            offset={offset}
          />
        );
      } else {
        objects.push(
          <PursuitText
            key={i}
            size={blockSize}
            speed={speed}
            color={objectColor}
            direction={direction}
            offset={offset}
          >
            PURSUIT TEST
          </PursuitText>
        );
      }
    }
    return objects;
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
        {renderTest()}
      </TestArea>

      <ControlPanel isMinimized={isMinimized}>
        <PanelHeader isMinimized={isMinimized}>
          <h2>RESPONSE TIME CONTROLS</h2>
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
              Test your display's response time with various moving patterns and transitions.
              Follow the objects with your eyes to evaluate motion clarity and ghosting.
            </Description>

            <Section>
              <h3>Test Type</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <ToggleButton
                  active={testType === 'moving-block'}
                  onClick={() => setTestType('moving-block')}
                >
                  Moving Block
                </ToggleButton>
                <ToggleButton
                  active={testType === 'pursuit'}
                  onClick={() => setTestType('pursuit')}
                >
                  Pursuit Text
                </ToggleButton>
              </div>
            </Section>

            <Section>
              <h3>Direction</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <ToggleButton
                  active={direction === 'horizontal'}
                  onClick={() => setDirection('horizontal')}
                >
                  Horizontal
                </ToggleButton>
                <ToggleButton
                  active={direction === 'vertical'}
                  onClick={() => setDirection('vertical')}
                >
                  Vertical
                </ToggleButton>
              </div>
            </Section>

            <Section>
              <h3>Speed</h3>
              <RangeControl>
                <label>
                  <span>Speed: {speed} pixels/second</span>
                </label>
                <input
                  type="range"
                  min="5"
                  max="200"
                  step="5"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                />
              </RangeControl>
            </Section>

            <Section>
              <h3>Size</h3>
              <RangeControl>
                <label>
                  <span>Size: {blockSize}px</span>
                </label>
                <input
                  type="range"
                  min="20"
                  max="100"
                  step="10"
                  value={blockSize}
                  onChange={(e) => setBlockSize(Number(e.target.value))}
                />
              </RangeControl>
            </Section>

            <Section>
              <h3>Number of Objects</h3>
              <RangeControl>
                <label>
                  <span>Count: {objectCount}</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={objectCount}
                  onChange={(e) => setObjectCount(Number(e.target.value))}
                />
              </RangeControl>
            </Section>

            <Section>
              <h3>Object & Text Color</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
                <ToggleButton
                  active={objectColor === 'black'}
                  onClick={() => setObjectColor('black')}
                >
                  Dark
                </ToggleButton>
                <ToggleButton
                  active={objectColor === 'white'}
                  onClick={() => setObjectColor('white')}
                >
                  Light
                </ToggleButton>
              </div>
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
              <ResetButton onClick={handleReset}>Reset Settings</ResetButton>
            </Section>
          </>
        )}
      </ControlPanel>
    </TestContainer>
  );
};

export default ResponseTimeTest;
