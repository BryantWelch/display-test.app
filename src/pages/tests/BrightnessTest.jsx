import React, { useState } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Label } from '../../components/TestShell';

const BrightnessWindow = styled.div`
  background: ${props => `rgba(255, 255, 255, ${props.$brightness})`};
  width: ${props => props.$size}vw;
  height: ${props => props.$size}vh;
`;

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const BrightnessTest = () => {
  const [windowSize, setWindowSize] = useState(15);

  const handleReset = () => {
    setWindowSize(15);
  };

  return (
    <TestShell
      title="Brightness Controls"
      description="This test helps evaluate your display's ability to show different levels of brightness across varying window sizes. A larger window size can help identify brightness uniformity issues, while smaller sizes can help test local brightness accuracy. The test uses a pure white square (100% brightness) against a black background for maximum contrast."
      onReset={handleReset}
      controls={
        <Section>
          <h3>Window Size</h3>
          <Label>Size: {windowSize}%</Label>
          <Slider
            type="range"
            min="5"
            max="100"
            value={windowSize}
            onChange={(e) => setWindowSize(Number(e.target.value))}
          />
        </Section>
      }
    >
      <BrightnessWindow
        $brightness={1}
        $size={windowSize}
      />
    </TestShell>
  );
};

export default BrightnessTest;
