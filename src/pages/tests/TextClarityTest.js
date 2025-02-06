import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
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
  background-color: ${props => props.$darkMode ? '#000' : '#fff'};
  color: ${props => props.$darkMode ? '#fff' : '#000'};
  overflow: hidden;
`;

const TextContent = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow: hidden;
  padding: 0;
`;

const TextPattern = styled.div`
  font-family: ${props => props.$font};
  font-size: ${props => props.size}px;
  line-height: 1.5;
  margin: 0;
  white-space: pre;
  font-weight: normal;
  padding: 0;
  text-align: left;
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

const RadioGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  color: #666;
  font-size: 1.1rem;
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
  margin-top: 1rem;
  
  &:hover {
    background: #3658c5;
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

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  font-size: 1.1rem;
  cursor: pointer;
  
  &:hover {
    border-color: #4169e1;
  }
  
  &:focus {
    outline: none;
    border-color: #4169e1;
    box-shadow: 0 0 0 2px rgba(65, 105, 225, 0.1);
  }
`;

const ClearTypeSection = styled.div`
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1.5rem;
  margin: 1rem 0;

  h4 {
    font-size: 1.1rem;
    color: #333;
    margin: 0 0 1rem 0;
  }

  p {
    color: #666;
    margin: 0.5rem 0;
    line-height: 1.5;
  }
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin: 1rem 0;
  width: 100%;
`;

const ComparisonBox = styled.div`
  background: ${props => props.$darkMode ? '#000' : '#fff'};
  color: ${props => props.$darkMode ? '#fff' : '#000'};
  padding: 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid ${props => props.$darkMode ? '#333' : '#ddd'};
  min-width: 0; /* Prevent grid item overflow */

  h5 {
    font-size: 0.9rem;
    margin: 0 0 0.75rem 0;
    color: ${props => props.$darkMode ? '#fff' : '#333'};
  }

  .sample {
    font-family: ${props => props.$font};
    font-size: 13px;
    line-height: 1.6;
    margin: 0;
    white-space: pre-line;
    word-break: keep-all;
    -webkit-font-smoothing: ${props => props.$smoothing};
  }
`;

const CollapsibleHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 0.5rem 0;
  user-select: none;

  &:hover h3 {
    color: #4169e1;
  }

  svg {
    width: 20px;
    height: 20px;
    color: #666;
    transition: transform 0.2s ease;
    transform: rotate(${props => props.$isOpen ? '180deg' : '0deg'});
  }

  &:hover svg {
    color: #4169e1;
  }
`;

const CollapsibleContent = styled.div`
  overflow: hidden;
  max-height: ${props => props.$isOpen ? '1000px' : '0'};
  opacity: ${props => props.$isOpen ? '1' : '0'};
  transition: all 0.3s ease-in-out;
  margin-top: ${props => props.$isOpen ? '1rem' : '0'};
`;

const TextClarityTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [darkMode, setDarkMode] = useState(true);
  const [font, setFont] = useState('monospace');
  const [isClearTypeOpen, setIsClearTypeOpen] = useState(false);
  const [textContent, setTextContent] = useState('');
  const [lineHeight, setLineHeight] = useState(1.5);
  const [letterSpacing, setLetterSpacing] = useState(0);

  useEffect(() => {
    const initializeTest = () => {
      // Add any initialization logic here if needed
    };
    initializeTest();
  }, []);

  const generateText = useCallback(() => {
    const text = 'The quick brown fox jumps over the lazy dog. ';
    const lines = [];
    
    // Calculate how many lines we need based on the container height and font size
    const containerHeight = window.innerHeight;
    const linesNeeded = Math.ceil(containerHeight / (fontSize * lineHeight)); // 1.5 is line-height
    
    // Create a very long line of text by repeating the sentence many times
    const fullLineText = text.repeat(50); // Increased repetitions to ensure no gaps
    
    // Fill the height with repeated lines
    for (let i = 0; i < linesNeeded; i++) {
      lines.push(fullLineText);
    }
    
    return lines.join('\n');
  }, [fontSize, lineHeight]);

  // Update text when font size changes or window resizes
  useEffect(() => {
    setTextContent(generateText());
  }, [fontSize, lineHeight, generateText]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setTextContent(generateText());
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial generation
    return () => window.removeEventListener('resize', handleResize);
  }, [fontSize, lineHeight, generateText]);

  const handleExit = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        // Wait for the next frame to ensure fullscreen exit is complete
        requestAnimationFrame(() => {
          navigate('/');
        });
      } catch (err) {
        console.log(`Error exiting fullscreen: ${err.message}`);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        navigate('/');
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [navigate]);

  const fonts = [
    { value: 'monospace', label: 'Monospace' },
    { value: 'Arial, sans-serif', label: 'Arial' },
    { value: 'Times New Roman, serif', label: 'Times New Roman' },
    { value: 'Helvetica, Arial, sans-serif', label: 'Helvetica' },
    { value: 'Georgia, serif', label: 'Georgia' },
    { value: 'Verdana, sans-serif', label: 'Verdana' },
    { value: 'Courier New, monospace', label: 'Courier New' },
    { value: 'Tahoma, sans-serif', label: 'Tahoma' },
    { value: 'Trebuchet MS, sans-serif', label: 'Trebuchet MS' },
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'serif', label: 'Serif' },
    { value: 'Calibri, sans-serif', label: 'Calibri' },
    { value: 'Cambria, serif', label: 'Cambria' },
    { value: 'Consolas, monospace', label: 'Consolas' },
    { value: 'Palatino, serif', label: 'Palatino' },
    { value: 'Segoe UI, sans-serif', label: 'Segoe UI' }
  ];

  // Add Google Fonts link
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400&family=Lato:wght@400&family=Montserrat:wght@400&family=Noto+Sans:wght@400&family=Open+Sans:wght@400&family=Poppins:wght@400&family=Roboto:wght@400&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  const handleReset = () => {
    setFontSize(16);
    setDarkMode(true);
    setFont('monospace');
    setLineHeight(1.5);
    setLetterSpacing(0);
  };

  const clearTypeExample = "Quick brown fox\nABCDEFGHIJKLM\n1234567890";

  return (
    <TestContainer $darkMode={darkMode}>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <TextContent>
        <TextPattern 
          size={fontSize} 
          $font={font}
          style={{ lineHeight, letterSpacing: `${letterSpacing}px` }}
        >
          {textContent}
        </TextPattern>
      </TextContent>
      
      <ControlPanel $isMinimized={isMinimized}>
        <PanelHeader $isMinimized={isMinimized}>
          <h2>Text Clarity Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
          </MinimizeButton>
        </PanelHeader>
        
        {!isMinimized && (
          <>
            <Description>
              Evaluate your display's text rendering quality and measure its font readability across different sizes and styles. This test helps identify text clarity issues and ClearType settings that work best for your screen.
            </Description>

            <Section>
              <h3>Font Family</h3>
              <Select 
                value={font}
                onChange={(e) => setFont(e.target.value)}
              >
                {fonts.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </Select>
            </Section>

            <Section>
              <h3>Font Size</h3>
              <RangeControl>
                <Label>Size: {fontSize}px</Label>
                <input
                  type="range"
                  min="8"
                  max="72"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                />
              </RangeControl>
            </Section>

            <Section>
              <h3>Line Height</h3>
              <RangeControl>
                <Label>Height: {lineHeight}</Label>
                <input
                  type="range"
                  min="1"
                  max="2"
                  step="0.1"
                  value={lineHeight}
                  onChange={(e) => setLineHeight(Number(e.target.value))}
                />
              </RangeControl>
            </Section>

            <Section>
              <h3>Letter Spacing</h3>
              <RangeControl>
                <Label>Spacing: {letterSpacing}px</Label>
                <input
                  type="range"
                  min="-2"
                  max="10"
                  step="0.5"
                  value={letterSpacing}
                  onChange={(e) => setLetterSpacing(Number(e.target.value))}
                />
              </RangeControl>
            </Section>

            <Section>
              <h3>Color</h3>
              <RadioGroup>
                <RadioLabel>
                  <input
                    type="radio"
                    checked={!darkMode}
                    onChange={() => setDarkMode(false)}
                  />
                  Black on white
                </RadioLabel>
                <RadioLabel>
                  <input
                    type="radio"
                    checked={darkMode}
                    onChange={() => setDarkMode(true)}
                  />
                  White on black
                </RadioLabel>
              </RadioGroup>
            </Section>

            <Section>
              <CollapsibleHeader 
                onClick={() => setIsClearTypeOpen(!isClearTypeOpen)}
                $isOpen={isClearTypeOpen}
              >
                <h3>ClearType Test</h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleHeader>
              <CollapsibleContent $isOpen={isClearTypeOpen}>
                <ClearTypeSection>
                  <h4>Check Your ClearType Status</h4>
                  <p>
                    Compare the text samples below. If your text looks more like the left example,
                    ClearType is likely disabled. If it looks more like the right example,
                    ClearType is probably enabled.
                  </p>
                  <ComparisonGrid>
                    <ComparisonBox $darkMode={darkMode} $font={font} $smoothing="none">
                      <h5>ClearType Disabled</h5>
                      <div className="sample">{clearTypeExample}</div>
                    </ComparisonBox>
                    <ComparisonBox $darkMode={darkMode} $font={font} $smoothing="antialiased">
                      <h5>ClearType Enabled</h5>
                      <div className="sample">{clearTypeExample}</div>
                    </ComparisonBox>
                  </ComparisonGrid>
                  <p>
                    Note: To adjust ClearType settings in Windows, type "Adjust ClearType text"
                    in the Start menu search bar.
                  </p>
                </ClearTypeSection>
              </CollapsibleContent>
            </Section>

            <ResetButton onClick={handleReset}>
              Reset settings
            </ResetButton>
          </>
        )}
      </ControlPanel>
    </TestContainer>
  );
};

export default TextClarityTest;
