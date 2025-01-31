import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const TestContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.backgroundColor};
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
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15);
  width: 400px;
  padding: ${props => props.isMinimized ? '1.25rem' : '2rem'};
  color: #333;
  transition: all 0.3s ease;
  transform: translateY(${props => props.isMinimized ? 'calc(100% - 4rem)' : '0'});
  backdrop-filter: blur(10px);
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  z-index: 1000;
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
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;

  &:hover {
    color: #333;
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

const Section = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    margin: 0 0 0.75rem 0;
    font-size: 0.9rem;
    font-weight: 600;
    color: #666;
  }
`;

const Slider = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const ColorButton = styled.button`
  padding: 0.5rem 1rem;
  border: 2px solid ${props => props.isSelected ? '#4169e1' : '#ddd'};
  border-radius: 0.25rem;
  background: ${props => props.color};
  color: ${props => props.textColor || (props.isSelected ? 'white' : '#666')};
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

const Description = styled.p`
  margin: 0 0 1.5rem 0;
  font-size: 0.9rem;
  line-height: 1.5;
  color: #666;
`;

const MatrixTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [textColor, setTextColor] = useState('#00ff00');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(16);
  const [speed, setSpeed] = useState(50);
  const canvasRef = React.useRef(null);
  const animationRef = React.useRef(null);

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

    const columns = Math.floor(canvas.width / fontSize);
    const drops = new Array(columns).fill(1);
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()";

    const draw = () => {
      ctx.fillStyle = backgroundColor + '0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = textColor;
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }

      animationRef.current = setTimeout(() => {
        requestAnimationFrame(draw);
      }, 100 - speed); // Adjust speed (0-100)
    };

    draw();
  }, [backgroundColor, textColor, fontSize, speed]);

  useEffect(() => {
    document.documentElement.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
    initMatrix();
    
    const handleResize = () => {
      if (canvasRef.current) {
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

  const handleReset = () => {
    setTextColor('#00ff00');
    setBackgroundColor('#000000');
    setFontSize(16);
    setSpeed(50);
  };

  const handleExit = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    navigate(-1);
  };

  return (
    <TestContainer backgroundColor={backgroundColor}>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <MatrixCanvas ref={canvasRef} />

      <ControlPanel isMinimized={isMinimized}>
        <PanelHeader isMinimized={isMinimized}>
          <h2>Matrix Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? '▼' : '▲'}
          </MinimizeButton>
        </PanelHeader>

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
                color={color.value}
                textColor={color.value === '#ffffff' ? '#000000' : undefined}
                isSelected={textColor === color.value}
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
                color={color.value}
                textColor="#ffffff"
                isSelected={backgroundColor === color.value}
                onClick={() => setBackgroundColor(color.value)}
              >
                {color.name}
              </ColorButton>
            ))}
          </ColorGrid>
        </Section>

        <Section>
          <h3>Text Size</h3>
          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Size: {fontSize}px
          </div>
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
          <div style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            Speed: {speed}%
          </div>
          <Slider
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </Section>
      </ControlPanel>
    </TestContainer>
  );
};

export default MatrixTest;