import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Label } from '../../components/TestShell';

const MatrixCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
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

const MatrixTest = () => {
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

  const cleanupAnimation = useCallback(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return (
    <TestShell
      title="Matrix Controls"
      description={'"You take the blue pill — the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill — you stay in Wonderland, and I show you how deep the rabbit-hole goes."'}
      onReset={handleReset}
      onBeforeExit={cleanupAnimation}
      style={{ backgroundColor, fontFamily: 'monospace' }}
      controls={
        <>
          <ColorSection>
            <h3>Text Color</h3>
            <ColorGrid>
              {textColors.map(color => (
                <ColorButton
                  key={color.value}
                  type="button"
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
                  type="button"
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
        </>
      }
    >
      <MatrixCanvas key={resetKey} ref={canvasRef} />
    </TestShell>
  );
};

export default MatrixTest;
