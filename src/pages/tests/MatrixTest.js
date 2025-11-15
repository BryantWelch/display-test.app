import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useAutoFade } from '../../hooks/useAutoFade';

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
  opacity: ${props => props.$isVisible ? 1 : 0};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};

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

  @media (max-width: 768px) {
    width: min(360px, 90vw);
    right: 1.25rem;
    left: auto;
    bottom: 1.25rem;
    top: 5.25rem;
    padding: ${props => props.$isMinimized ? '1rem' : '1.5rem'};
  }

  @media (max-width: 480px) {
    width: 92vw;
    right: 4vw;
    left: 4vw;
    bottom: 0.75rem;
    padding: ${props => props.$isMinimized ? '0.9rem' : '1.25rem'};
    border-radius: 0.6rem;
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
  opacity: ${props => props.$isVisible ? 1 : 0};
  pointer-events: ${props => props.$isVisible ? 'auto' : 'none'};

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

  @media (max-width: 768px) {
    top: 1.25rem;
    left: 1.25rem;
    padding: 0.6rem 1rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 0.9rem;
    font-size: 0.95rem;
    border-radius: 0.4rem;
  }
`;

const Description = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 0.88rem;
    margin-bottom: 1rem;
  }
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

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

const Label = styled.div`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    font-size: 0.83rem;
  }
`;

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const ColorButton = styled.button`
  width: 100%;
  height: 40px;
  padding: 0;
  border: 2px solid #4169e1;
  border-radius: 4px;
  background: ${props => props.$color};
  cursor: pointer;
  transition: all 0.2s ease;
`;

const ColorGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.5rem;
`;

const ColorSection = styled.div`
  margin-bottom: 2rem;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.98rem;
    padding: 0.85rem;
  }
`;

const MatrixTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const { isVisible } = useAutoFade(5000, 2000, isMinimized);
  const [textColor, setTextColor] = useState('#00ff00');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(30);
  const [speed, setSpeed] = useState(50);
  const [resetKey, setResetKey] = useState(0);
  const canvasRef = React.useRef(null);
  const animationRef = React.useRef(null);
  const abortControllerRef = React.useRef(null);

  useEffect(() => {
    abortControllerRef.current = new AbortController();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

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
    { name: 'Navy', value: '#000033' },
    { name: 'Dark Blue', value: '#000066' }
  ];

  const initMatrix = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const canvas = canvasRef.current;
    if (!canvas || signal.aborted) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(0).map(() => 
      Math.floor(Math.random() * -canvas.height / fontSize)
    );

    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";

    const draw = () => {
      if (signal.aborted) return;

      ctx.fillStyle = backgroundColor + '0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = textColor;
      ctx.font = fontSize + 'px monospace';
      ctx.textAlign = 'start';
      ctx.textBaseline = 'top';

      for (let i = 0; i < drops.length; i++) {
        if (drops[i] * fontSize > 0) {
          const text = chars[Math.floor(Math.random() * chars.length)];
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        }
        
        if (drops[i] * fontSize > canvas.height) {
          drops[i] = Math.random() > 0.975 ? 0 : -10;
        }
        drops[i]++;
      }

      if (!signal.aborted) {
        animationRef.current = setTimeout(() => {
          requestAnimationFrame(draw);
        }, Math.max(1, 100 - speed));
      }
    };

    if (!signal.aborted) {
      animationRef.current = setTimeout(() => {
        requestAnimationFrame(draw);
      }, Math.max(1, 100 - speed));
    }
  }, [backgroundColor, textColor, fontSize, speed]);

  useEffect(() => {
    initMatrix();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [backgroundColor, textColor, fontSize, speed, initMatrix]);

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        initMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
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

  const handleReset = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    
    setTextColor('#00ff00');
    setBackgroundColor('#000000');
    setFontSize(30);
    setSpeed(50);
    
    setResetKey(prev => prev + 1);
  };

  const handleExit = useCallback(async () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
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

  return (
    <TestContainer $backgroundColor={backgroundColor}>
      <ExitButton onClick={handleExit} $isVisible={isVisible}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <MatrixCanvas key={resetKey} ref={canvasRef} />

      <ControlPanel $isMinimized={isMinimized} $isVisible={isVisible}>
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

            <ColorSection>
              <h3>Text Color</h3>
              <ColorGrid>
                {textColors.map(color => (
                  <ColorButton
                    key={color.value}
                    $color={color.value}
                    onClick={() => setTextColor(color.value)}
                  />
                ))}
              </ColorGrid>
            </ColorSection>

            <ColorSection>
              <h3>Background Color</h3>
              <ColorGrid>
                {backgroundColors.map(color => (
                  <ColorButton
                    key={color.value}
                    $color={color.value}
                    onClick={() => setBackgroundColor(color.value)}
                  />
                ))}
              </ColorGrid>
            </ColorSection>

            <Section>
              <h3>Text Size</h3>
              <Label>Size: {fontSize}px</Label>
              <Slider
                type="range"
                min="10"
                max="60"
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