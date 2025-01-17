import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TestContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  background: ${props => props.darkMode ? '#000' : '#fff'};
  color: ${props => props.darkMode ? '#fff' : '#000'};
  overflow: hidden;
`;

const TextContent = styled.div`
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 2rem;
  overflow: auto;
`;

const TextPattern = styled.div`
  font-family: ${props => props.font};
  font-size: ${props => props.size}px;
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
  word-break: break-word;
  font-weight: normal;
  width: 100%;
`;

const ControlPanel = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 400px;
  padding: ${props => props.isMinimized ? '1.25rem' : '2rem'};
  color: #333;
  transition: all 0.3s ease;
  transform: translateY(${props => props.isMinimized ? 'calc(100% - 4rem)' : '0'});
  backdrop-filter: blur(10px);
  max-height: calc(100vh - 4rem);
  overflow-y: auto;

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
  padding: 0;
  
  &:hover {
    background: #3658c5;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 24px;
    margin-top: -2px;
    font-weight: 300; /* Make the symbols slightly thinner */
  }
`;

const Description = styled.p`
  margin: 1.5rem 0;
  color: #666;
  line-height: 1.6;
  font-size: 1.1rem;
`;

const Section = styled.div`
  margin: 2rem 0;

  h3 {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 0.75rem;
    font-weight: 500;
  }
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

const SliderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Slider = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: #4169e1;
    border-radius: 50%;
    cursor: pointer;
  }
`;

const SliderValue = styled.div`
  text-align: right;
  color: #666;
  font-size: 1.1rem;
  font-weight: 500;
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

const FullScreenButton = styled(ExitButton)`
  left: auto;
  right: 1.5rem;
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

const TechnicalInfo = styled.div`
  background: #f8f9fa;
  border-radius: 0.5rem;
  padding: 1rem;
  margin-top: 1rem;
  font-size: 1rem;
  color: #666;

  div {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }

  span:last-child {
    font-weight: 500;
    color: #333;
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
  background: ${props => props.darkMode ? '#000' : '#fff'};
  color: ${props => props.darkMode ? '#fff' : '#000'};
  padding: 0.75rem;
  border-radius: 0.25rem;
  border: 1px solid ${props => props.darkMode ? '#333' : '#ddd'};
  min-width: 0; /* Prevent grid item overflow */

  h5 {
    font-size: 0.9rem;
    margin: 0 0 0.75rem 0;
    color: ${props => props.darkMode ? '#fff' : '#333'};
  }

  .sample {
    font-family: ${props => props.font};
    font-size: 13px;
    line-height: 1.6;
    margin: 0;
    white-space: pre-line;
    word-break: keep-all;
    -webkit-font-smoothing: ${props => props.smoothing};
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
    transform: rotate(${props => props.isOpen ? '180deg' : '0deg'});
  }

  &:hover svg {
    color: #4169e1;
  }
`;

const CollapsibleContent = styled.div`
  overflow: hidden;
  max-height: ${props => props.isOpen ? '1000px' : '0'};
  opacity: ${props => props.isOpen ? '1' : '0'};
  transition: all 0.3s ease-in-out;
  margin-top: ${props => props.isOpen ? '1rem' : '0'};
`;

const TextClarityTest = () => {
  const [fontSize, setFontSize] = useState(16);
  const [selectedFont, setSelectedFont] = useState('Arial, sans-serif');
  const [darkMode, setDarkMode] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isClearTypeOpen, setIsClearTypeOpen] = useState(false);
  const [isDisplayInfoOpen, setIsDisplayInfoOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [textContent, setTextContent] = useState('');

  const generateText = () => {
    const lines = [];
    const text = 'The quick brown fox jumps over the lazy dog. ';
    const numbers = '1234567890 ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
    
    // Calculate how many lines we need based on the container height and font size
    const containerHeight = window.innerHeight;
    const linesNeeded = Math.ceil((containerHeight / fontSize) * 1.5); // 1.5 is line-height
    
    for (let i = 0; i < linesNeeded * 2; i++) { // Multiply by 2 to ensure enough content
      lines.push(text.repeat(8));
      lines.push(numbers.repeat(6));
    }
    
    return lines.join('\n');
  };

  // Update text when font size changes or window resizes
  useEffect(() => {
    setTextContent(generateText());
  }, [fontSize]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setTextContent(generateText());
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial generation
    return () => window.removeEventListener('resize', handleResize);
  }, [fontSize]);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullScreen(true);
    } else {
      document.exitFullscreen();
      setIsFullScreen(false);
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, []);

  // Get technical information on mount
  useEffect(() => {
    // Get resolution
    const resolution = `${window.screen.width} × ${window.screen.height}`;
    
    // Get pixel density
    const pixelDensity = window.devicePixelRatio;
    
    // Get scaling (devicePixelRatio as percentage)
    const scaling = `${Math.round(window.devicePixelRatio * 100)}%`;

    const technicalInfo = {
      resolution,
      pixelDensity: pixelDensity.toFixed(2),
      scaling
    };

    setTextContent(generateText());
  }, []);

  const fonts = [
    { label: 'Arial', value: 'Arial, sans-serif' },
    { label: 'Times New Roman', value: '"Times New Roman", serif' },
    { label: 'Courier New', value: '"Courier New", monospace' },
    { label: 'Georgia', value: 'Georgia, serif' },
    { label: 'Verdana', value: 'Verdana, sans-serif' },
    { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
    { label: 'Tahoma', value: 'Tahoma, sans-serif' },
    { label: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' }
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
    setDarkMode(false);
    setSelectedFont('Arial, sans-serif');
  };

  const clearTypeExample = "Quick brown fox\nABCDEFGHIJKLM\n1234567890";

  return (
    <TestContainer darkMode={darkMode}>
      <ExitButton onClick={() => window.history.back()}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <FullScreenButton onClick={toggleFullScreen}>
        {isFullScreen ? (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
            </svg>
            Exit Full Screen
          </>
        ) : (
          <>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 8V3h5M3 16v5h5m8-5v5h5M21 8V3h-5" />
            </svg>
            Full Screen
          </>
        )}
      </FullScreenButton>

      <TextContent>
        <TextPattern 
          size={fontSize} 
          font={selectedFont}
        >
          {textContent}
        </TextPattern>
      </TextContent>
      
      <ControlPanel isMinimized={isMinimized}>
        <PanelHeader isMinimized={isMinimized}>
          <h2>Text Clarity Controls</h2>
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
              Evaluate your display's text rendering quality and measure its font readability across different sizes and styles. This test helps identify text clarity issues and ClearType settings that work best for your screen.
            </Description>

            <Section>
              <h3>Font Family</h3>
              <Select 
                value={selectedFont}
                onChange={(e) => setSelectedFont(e.target.value)}
              >
                {fonts.map(font => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </Select>
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
              <h3>Font size (point)</h3>
              <SliderContainer>
                <Slider
                  type="range"
                  min="6"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                />
                <SliderValue>{fontSize}</SliderValue>
              </SliderContainer>
            </Section>

            <Section>
              <CollapsibleHeader 
                onClick={() => setIsDisplayInfoOpen(!isDisplayInfoOpen)}
                isOpen={isDisplayInfoOpen}
              >
                <h3>Display Information</h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleHeader>
              <CollapsibleContent isOpen={isDisplayInfoOpen}>
                <TechnicalInfo>
                  <div>
                    <span>Resolution:</span>
                    <span>{window.screen.width} × {window.screen.height}</span>
                  </div>
                  <div>
                    <span>Pixel Density:</span>
                    <span>{window.devicePixelRatio.toFixed(2)}x</span>
                  </div>
                  <div>
                    <span>Display Scaling:</span>
                    <span>{Math.round(window.devicePixelRatio * 100)}%</span>
                  </div>
                </TechnicalInfo>
              </CollapsibleContent>
            </Section>

            <Section>
              <CollapsibleHeader 
                onClick={() => setIsClearTypeOpen(!isClearTypeOpen)}
                isOpen={isClearTypeOpen}
              >
                <h3>ClearType Test</h3>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 9l-7 7-7-7" />
                </svg>
              </CollapsibleHeader>
              <CollapsibleContent isOpen={isClearTypeOpen}>
                <ClearTypeSection>
                  <h4>Check Your ClearType Status</h4>
                  <p>
                    Compare the text samples below. If your text looks more like the left example,
                    ClearType is likely disabled. If it looks more like the right example,
                    ClearType is probably enabled.
                  </p>
                  <ComparisonGrid>
                    <ComparisonBox darkMode={darkMode} font={selectedFont} smoothing="none">
                      <h5>ClearType Disabled</h5>
                      <div className="sample">{clearTypeExample}</div>
                    </ComparisonBox>
                    <ComparisonBox darkMode={darkMode} font={selectedFont} smoothing="antialiased">
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
