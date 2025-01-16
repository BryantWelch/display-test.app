import React, { useState } from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  color: black;
  overflow: auto;
  padding: 60px 0 20px 0; /* Add padding to account for controls */
`;

const Controls = styled.div`
  position: fixed;
  top: 1rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 0.5rem;
  display: flex;
  gap: 1rem;
  z-index: 100;
`;

const Button = styled.button`
  background: var(--primary);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  border: none;
  cursor: pointer;

  &:hover {
    opacity: 0.9;
  }
`;

const Pattern = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  padding: 1rem;
`;

const TextSection = styled.div`
  border: 1px solid #ccc;
  padding: 1rem;
  margin-bottom: 2rem;
`;

const TextPattern = styled.pre`
  font-family: monospace;
  font-size: ${props => props.size}px;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-all;
`;

const SectionTitle = styled.h3`
  margin-bottom: 1rem;
  color: #333;
`;

const SharpnessTest = () => {
  const [fontSize, setFontSize] = useState(12);

  const generateText = (size) => {
    const lines = [];
    const text = 'The quick brown fox jumps over the lazy dog. ';
    const numbers = '1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
    
    // Add alternating lines of text and numbers
    for (let i = 0; i < 10; i++) {
      lines.push(text.repeat(3));
      lines.push(numbers.repeat(2));
    }
    
    return lines.join('\\n');
  };

  const handleFontSize = (delta) => {
    setFontSize(prev => Math.max(6, Math.min(24, prev + delta)));
  };

  return (
    <TestContainer>
      <Controls>
        <Button onClick={() => handleFontSize(-2)}>Smaller</Button>
        <Button onClick={() => handleFontSize(2)}>Larger</Button>
        <Button onClick={() => window.history.back()}>Exit Test</Button>
      </Controls>
      <Pattern>
        <TextSection>
          <SectionTitle>Font Size: {fontSize}px</SectionTitle>
          <TextPattern size={fontSize}>
            {generateText(fontSize)}
          </TextPattern>
        </TextSection>
        <TextSection>
          <SectionTitle>Reference Text (8px)</SectionTitle>
          <TextPattern size={8}>
            {generateText(8)}
          </TextPattern>
        </TextSection>
      </Pattern>
    </TestContainer>
  );
};

export default SharpnessTest;
