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
  align-items: center;
  justify-content: center;
  background: ${props => props.$backgroundColor};
  overflow: hidden;
  font-family: monospace;
`;

const MatrixCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const ColorButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.$isSelected ? '#4169e1' : '#ddd'};
  border-radius: 0.25rem;
  background: ${props => props.$color};
  color: ${props => props.$textColor || (props.$isSelected ? 'white' : '#666')};
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: #4169e1;
  }
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
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

const MatrixTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [textColor, setTextColor] = useState('#00ff00');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [speed, setSpeed] = useState(50);
  const [resetKey, setResetKey] = useState(0);
  const canvasRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const isUnmountedRef = React.useRef(false);

  const textColors = [
    { name: 'Matrix Green', value: '#00ff00' },
    { name: 'Cyan', value: '#00ffff' },
    { name: 'Magenta', value: '#ff00ff' },
    { name: 'Yellow', value: '#ffff00' },
    { name: 'White', value: '#ffffff' },
    { name: 'Red', value: '#ff0000' }
  ];

  const backgroundColors = [
    { name: 'Black', value: '#000000' },
    { name: 'Dark Gray', value: '#222222' },
    { name: 'Navy', value: '#000033' }
  ];

  const initMatrix = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Always start with a completely clean canvas
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(0).map(() => 
      Math.floor(Math.random() * -canvas.height / fontSize)
    );

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";
    let prevBgColor = backgroundColor;
    let prevTextColor = textColor;

    const draw = () => {
      // Always clear with solid background when colors change
      if (prevBgColor !== backgroundColor || prevTextColor !== textColor) {
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        prevBgColor = backgroundColor;
        prevTextColor = textColor;
      } else {
        // Semi-transparent background for trail effect
        ctx.fillStyle = backgroundColor + '0a';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // Set text properties
      ctx.fillStyle = textColor;
      ctx.font = fontSize + 'px monospace';
      ctx.textAlign = 'start';
      ctx.textBaseline = 'top';

      for (let i = 0; i < drops.length; i++) {
        // Only draw if drop is on screen
        if (drops[i] * fontSize > 0) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        }
        
        // Reset to random position above screen when reaching bottom
        if (drops[i] * fontSize > canvas.height) {
          drops[i] = Math.random() > 0.975 ? 0 : -10;
        }
        drops[i]++;
      }

      // Schedule next frame with proper timing
      if (!isUnmountedRef.current) {
        animationRef.current = setTimeout(() => {
          requestAnimationFrame(draw);
        }, Math.max(1, 100 - speed));
      }
    };

    draw();
  }, [backgroundColor, textColor, fontSize, speed]);

  useEffect(() => {
    isUnmountedRef.current = false;
    initMatrix();
    
    const handleResize = () => {
      if (canvasRef.current && !isUnmountedRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        initMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [initMatrix]);

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

  const cleanup = useCallback(() => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  }, []);

  const handleReset = () => {
    // First cleanup the current animation
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    
    // Reset all states
    setTextColor('#00ff00');
    setBackgroundColor('#000000');
    setFontSize(16);
    setSpeed(50);
    
    // Force a remount by changing the key
    setResetKey(prev => prev + 1);
  };

  const handleExit = useCallback(async () => {
    // First cleanup the animation
    cleanup();
    
    // Then handle fullscreen exit and navigation
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
  }, [navigate, cleanup]);

  return (
    <TestContainer $backgroundColor={backgroundColor}>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <MatrixCanvas key={resetKey} ref={canvasRef} />

      <ControlPanel $isMinimized={isMinimized}>
        <PanelHeader $isMinimized={isMinimized}>
          <h2>Matrix Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
          </MinimizeButton>
        </PanelHeader>

        {!isMinimized && (
          <>
            <Description>
              "You take the blue pill — the story ends, you wake up in your bed and believe 
              whatever you want to believe. You take the red pill — you stay in Wonderland, 
              and I show you how deep the rabbit-hole goes."
            </Description>

            <Section>
              <h3>Text Color</h3>
              <ColorGrid>
                {textColors.map(color => (
                  <ColorButton
                    key={color.value}
                    $color={color.value}
                    $textColor={color.value === '#ffffff' ? '#000000' : undefined}
                    $isSelected={textColor === color.value}
                    onClick={() => setTextColor(color.value)}
                  >
                    {color.name}
                  </ColorButton>
                ))}
              </ColorGrid>
            </Section>

            <Section>
              <h3>Background Color</h3>
              <ColorGrid>
                {backgroundColors.map(color => (
                  <ColorButton
                    key={color.value}
                    $color={color.value}
                    $textColor="#ffffff"
                    $isSelected={backgroundColor === color.value}
                    onClick={() => setBackgroundColor(color.value)}
                  >
                    {color.name}
                  </ColorButton>
                ))}
              </ColorGrid>
            </Section>

            <Section>
              <h3>Text Size</h3>
              <Label>Size: {fontSize}px</Label>
              <Slider
                type="range"
                min="10"
                max="40"
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
              />
            </Section>

            <Section>
              <h3>Speed</h3>
              <Label>Speed: {speed}%</Label>
              <Slider
                type="range"
                min="1"
                max="100"
                value={speed}
                onChange={(e) => setSpeed(Number(e.target.value))}
              />
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

export default MatrixTest;