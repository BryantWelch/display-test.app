import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import testPatternImage from '../../assets/test-pattern.svg';
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
  background: #000;
  overflow: hidden;
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

const TestArea = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.$background};
  overflow: hidden;
`;

const MovingBlock = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  left: ${props => props.$direction === 'horizontal' ? 0 : props.$offset}px;
  top: ${props => props.$direction === 'vertical' ? 0 : props.$offset}px;
  animation: ${props => props.$direction === 'horizontal' ? 'moveRight' : 'moveDown'} ${props => 100/props.$speed}s linear infinite;
  background: url(${testPatternImage}) no-repeat center center;
  background-size: contain;
  filter: ${props => props.$color === 'white' ? 'invert(1)' : 'none'};
  will-change: transform;

  @keyframes moveRight {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(${window.screen.width}px + ${props => props.$size}px));
    }
  }

  @keyframes moveDown {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(${window.screen.height}px + ${props => props.$size}px));
    }
  }
`;

const PursuitText = styled.div`
  position: absolute;
  color: ${props => props.$color === 'white' ? 'white' : 'black'};
  font-size: ${props => props.$size}px;
  left: ${props => props.$direction === 'horizontal' ? 0 : props.$offset}px;
  top: ${props => props.$direction === 'vertical' ? 0 : props.$offset}px;
  white-space: nowrap;
  animation: ${props => props.$direction === 'horizontal' ? 'moveRight' : 'moveDown'} ${props => 100/props.$speed}s linear infinite;
  will-change: transform;

  @keyframes moveRight {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(${window.screen.width}px + ${props => props.$size}px));
    }
  }

  @keyframes moveDown {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(${window.screen.height}px + ${props => props.$size}px));
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
  const [blockSize, setBlockSize] = useState(100);
  const [backgroundColor, setBackgroundColor] = useState('gray');
  const [objectColor, setObjectColor] = useState('black');
  const [direction, setDirection] = useState('horizontal');
  const [objectCount, setObjectCount] = useState(1);
  const animationFrameRef = React.useRef(null);

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

  const initializeTest = () => {
    // Initialize test here
  };

  useEffect(() => {
    initializeTest();
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initializeTest]);

  const handleExit = useCallback(async () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
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
    setTestType('moving-block');
    setSpeed(35);
    setBlockSize(100);
    setBackgroundColor('gray');
    setObjectColor('black');
    setDirection('horizontal');
    setObjectCount(1);
  };

  const renderTest = () => {
    const objects = [];
    for (let i = 0; i < objectCount; i++) {
      // Calculate section size for each item
      const sectionSize = direction === 'horizontal' 
        ? window.innerHeight / objectCount
        : window.innerWidth / objectCount;
      
      // Calculate offset with centering
      const offset = direction === 'horizontal'
        ? (i * sectionSize) + (sectionSize / 2) - (blockSize / 2) // Center vertically within each section
        : (i * sectionSize) + (sectionSize / 2) - (blockSize / 2); // Center horizontally within each section

      if (testType === 'moving-block') {
        objects.push(
          <MovingBlock
            key={i}
            $size={blockSize}
            $color={objectColor}
            $speed={speed}
            $direction={direction}
            $offset={offset}
          />
        );
      } else {
        objects.push(
          <PursuitText
            key={i}
            $size={blockSize}
            $speed={speed}
            $color={objectColor}
            $direction={direction}
            $offset={offset}
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

      <TestArea $background={backgroundColors[backgroundColor]}>
        {renderTest()}
      </TestArea>

      <ControlPanel $isMinimized={isMinimized}>
        <PanelHeader $isMinimized={isMinimized}>
          <h2>Response Time Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
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
                  $active={testType === 'moving-block'}
                  onClick={() => setTestType('moving-block')}
                >
                  Moving Block
                </ToggleButton>
                <ToggleButton
                  $active={testType === 'pursuit'}
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
                  $active={direction === 'horizontal'}
                  onClick={() => setDirection('horizontal')}
                >
                  Horizontal
                </ToggleButton>
                <ToggleButton
                  $active={direction === 'vertical'}
                  onClick={() => setDirection('vertical')}
                >
                  Vertical
                </ToggleButton>
              </div>
            </Section>

            <Section>
              <h3>Speed</h3>
              <RangeControl>
                <Label>
                  <span>Speed: {speed} pixels/second</span>
                </Label>
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
                <Label>
                  <span>Size: {blockSize}px</span>
                </Label>
                <input
                  type="range"
                  min="50"
                  max="200"
                  step="10"
                  value={blockSize}
                  onChange={(e) => setBlockSize(Number(e.target.value))}
                />
              </RangeControl>
            </Section>

            <Section>
              <h3>Number of Objects</h3>
              <RangeControl>
                <Label>
                  <span>Count: {objectCount}</span>
                </Label>
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
                  $active={objectColor === 'black'}
                  onClick={() => setObjectColor('black')}
                >
                  Dark
                </ToggleButton>
                <ToggleButton
                  $active={objectColor === 'white'}
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
