import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Description } from '../../components/TestShell';

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const ColorButton = styled.button`
  width: 100%;
  aspect-ratio: 1;
  border: 2px solid ${(props) => (props.$isSelected ? '#4169e1' : 'transparent')};
  border-radius: 0.5rem;
  cursor: pointer;
  background: ${(props) => props.$color};
  transition: transform 0.2s;

  &:hover {
    transform: scale(1.05);
  }
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.95rem;
  cursor: pointer;

  input {
    width: 1rem;
    height: 1rem;
  }
`;

const DeadPixelTest = () => {
  const [backgroundColor, setBackgroundColor] = useState('#808080');
  const [isAutoChanging, setIsAutoChanging] = useState(false);
  const autoChangeRef = useRef(null);

  const colors = useMemo(
    () => [
      { name: 'White', value: '#FFFFFF' },
      { name: 'Black', value: '#000000' },
      { name: 'Red', value: '#FF0000' },
      { name: 'Green', value: '#00FF00' },
      { name: 'Blue', value: '#0000FF' },
      { name: 'Yellow', value: '#FFFF00' },
      { name: 'Magenta', value: '#FF00FF' },
      { name: 'Cyan', value: '#00FFFF' },
      { name: 'Gray', value: '#808080' },
    ],
    []
  );

  useEffect(() => {
    if (!isAutoChanging) {
      if (autoChangeRef.current) {
        clearInterval(autoChangeRef.current);
      }
      return undefined;
    }

    const colorValues = colors.map((color) => color.value);
    let currentIndex = colorValues.indexOf(backgroundColor);

    autoChangeRef.current = setInterval(() => {
      currentIndex = (currentIndex + 1) % colorValues.length;
      setBackgroundColor(colorValues[currentIndex]);
    }, 2000);

    return () => {
      if (autoChangeRef.current) {
        clearInterval(autoChangeRef.current);
      }
    };
  }, [isAutoChanging, backgroundColor, colors]);

  const handleReset = () => {
    setBackgroundColor('#808080');
    setIsAutoChanging(false);
    if (autoChangeRef.current) {
      clearInterval(autoChangeRef.current);
    }
  };

  return (
    <TestShell
      title="Dead Pixel Controls"
      description="Test your display for dead or stuck pixels by cycling through different colors. A dead pixel will appear black on all colors, while a stuck pixel will remain one color regardless of the background."
      onReset={handleReset}
      style={{ backgroundColor }}
      controls={
        <>
          <Section>
            <h3>Background Color</h3>
            <ColorGrid>
              {colors.map((color) => (
                <ColorButton
                  key={color.name}
                  type="button"
                  $color={color.value}
                  $isSelected={backgroundColor === color.value}
                  onClick={() => setBackgroundColor(color.value)}
                  title={color.name}
                />
              ))}
            </ColorGrid>
          </Section>

          <Section>
            <h3>Auto Cycle</h3>
            <Description>
              Enable automatic cycling through all colors to help identify stuck or dead pixels.
              Colors will change every 2 seconds.
            </Description>
            <Checkbox>
              <input
                type="checkbox"
                checked={isAutoChanging}
                onChange={(e) => setIsAutoChanging(e.target.checked)}
              />
              Enable auto color change
            </Checkbox>
          </Section>
        </>
      }
    />
  );
};

export default DeadPixelTest;
