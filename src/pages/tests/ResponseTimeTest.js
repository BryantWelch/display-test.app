import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import testPatternImage from '../../assets/test-pattern.svg';
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

const Display = styled.div`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  ${props => props.$direction === 'horizontal' ? `
    top: ${props.$offset}px;
    left: -${props.$size}px;
  ` : `
    left: ${props.$offset}px;
    top: -${props.$size}px;
  `}
  animation: ${props => props.$direction === 'horizontal' ? 'blockRight' : 'blockDown'} ${props => 100/props.$speed}s linear infinite;
  background: url(${testPatternImage}) no-repeat center center;
  background-size: contain;
  filter: ${props => props.$color === 'white' ? 'invert(1)' : 'none'};
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @keyframes blockRight {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(calc(100vw + ${props => props.$size}px), 0, 0);
    }
  }

  @keyframes blockDown {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, calc(100vh + ${props => props.$size}px), 0);
    }
  }
`;

const HorizontalWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: auto;
  height: 100vh;
  top: 0;
  left: -${props => props.$size * 12}px;
  animation: moveRight ${props => 100/props.$speed}s linear infinite;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @keyframes moveRight {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(calc(100vw + ${props => props.$size * 12}px), 0, 0);
    }
  }
`;

const VerticalWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  height: auto;
  top: -${props => props.$size}px;
  left: 0;
  animation: moveDown ${props => 100/props.$speed}s linear infinite;
  will-change: transform;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  @keyframes moveDown {
    from {
      transform: translate3d(0, 0, 0);
    }
    to {
      transform: translate3d(0, calc(100vh + ${props => props.$size}px), 0);
    }
  }
`;

const PursuitText = styled.div`
  color: ${props => props.$color === 'white' ? 'white' : 'black'};
  font-size: ${props => props.$size}px;
  white-space: nowrap;
  text-align: center;
  min-height: ${props => props.$size}px;
  line-height: 1;
  margin: ${props => props.$direction === 'vertical' ? `0 ${props.$margin}px` : `${props.$margin}px 0`};
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

  const cleanup = useCallback(() => {
    const currentAnimation = animationFrameRef.current;
    if (currentAnimation) {
      cancelAnimationFrame(currentAnimation);
    }
  }, []);

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  const handleReset = useCallback(() => {
    setTestType('moving-block');
    setSpeed(35);
    setBlockSize(100);
    setBackgroundColor('gray');
    setObjectColor('black');
    setDirection('horizontal');
    setObjectCount(1);
  }, []);

  const renderTest = () => {
    if (testType === 'moving-block') {
      return Array.from({ length: objectCount }).map((_, i) => {
        const sectionSize = direction === 'horizontal'
          ? window.innerHeight / objectCount
          : window.innerWidth / objectCount;

        const offset = (i * sectionSize) + (sectionSize / 2) - (blockSize / 2);

        return (
          <Display
            key={i}
            $size={blockSize}
            $color={objectColor}
            $speed={speed}
            $direction={direction}
            $offset={offset}
          />
        );
      });
    }

    // Calculate margin based on number of objects
    const margin = objectCount > 1 ? blockSize / 2 : 0;

    const Wrapper = direction === 'horizontal' ? HorizontalWrapper : VerticalWrapper;

    // For pursuit text, wrap all texts in a single container
    return (
      <Wrapper
        $speed={speed}
        $size={blockSize}
      >
        {Array.from({ length: objectCount }).map((_, i) => (
          <PursuitText
            key={i}
            $size={blockSize}
            $color={objectColor}
            $margin={margin}
            $direction={direction}
          >
            PURSUIT TEST
          </PursuitText>
        ))}
      </Wrapper>
    );
  };

  return (
    <TestShell
      title="Response Time Controls"
      description="Test your display's response time with either an image of a display or the word pursuit text. Follow the objects with your eyes or camera to evaluate motion clarity and ghosting."
      onReset={handleReset}
      onBeforeExit={cleanup}
      controls={
        <>
          <Section>
            <h3>Test Type</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <ToggleButton
                type="button"
                $active={testType === 'moving-block'}
                onClick={() => setTestType('moving-block')}
              >
                Display
              </ToggleButton>
              <ToggleButton
                type="button"
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
                type="button"
                $active={direction === 'horizontal'}
                onClick={() => setDirection('horizontal')}
              >
                Horizontal
              </ToggleButton>
              <ToggleButton
                type="button"
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
                type="button"
                $active={objectColor === 'black'}
                onClick={() => setObjectColor('black')}
              >
                Dark
              </ToggleButton>
              <ToggleButton
                type="button"
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
              {Object.entries(backgroundColors).map(([name]) => (
                <option key={name} value={name}>
                  {name.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </option>
              ))}
            </Select>
          </Section>
        </>
      }
    >
      <TestArea $background={backgroundColors[backgroundColor]}>
        {renderTest()}
      </TestArea>
    </TestShell>
  );
};

export default ResponseTimeTest;
