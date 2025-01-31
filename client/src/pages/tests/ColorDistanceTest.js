import React, { useState, useEffect } from 'react';
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
  transition: background-color 0.3s ease;
`;

const ColorSquare = styled.div`
  width: 35vh;
  height: 35vh;
  background: ${props => props.foregroundColor};
  transition: background-color 0.3s ease;
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

  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(65, 105, 225, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 24px;
    height: 24px;
  }
`;

const Description = styled.p`
  margin: 0 0 2rem 0;
  color: #666;
  line-height: 1.5;
  font-size: 0.95rem;
`;

const Section = styled.div`
  margin-bottom: 2rem;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const ColorControl = styled.div`
  margin-bottom: 1rem;

  .slider-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: #666;
    font-size: 0.9rem;
  }

  input[type="range"] {
    flex: 1;
    margin: 0.5rem 0;
    height: 6px;
    -webkit-appearance: none;
    background: ${props => {
      if (props.color === 'red') return 'linear-gradient(to right, #000, #f00)';
      if (props.color === 'green') return 'linear-gradient(to right, #000, #0f0)';
      if (props.color === 'blue') return 'linear-gradient(to right, #000, #00f)';
      return '#e0e0e0';
    }};
    border-radius: 3px;
    
    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: ${props => {
        if (props.color === 'red') return '#f00';
        if (props.color === 'green') return '#0f0';
        if (props.color === 'blue') return '#00f';
        return '#4169e1';
      }};
      border: 2px solid white;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
    }
  }

  input[type="number"] {
    width: 60px;
    padding: 0.25rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 4px;
    font-size: 0.9rem;
    color: #666;
    -moz-appearance: textfield;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    &:focus {
      outline: none;
      border-color: #4169e1;
    }
  }
`;

const HexInput = styled.input`
  width: 120px;
  padding: 0.5rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
  margin-left: 1rem;

  &:focus {
    outline: none;
    border-color: #4169e1;
  }
`;

const ColorPreview = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: #f5f5f5;
  border-radius: 0.5rem;
`;

const ColorBox = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 4px;
  background: ${props => props.color};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ColorCode = styled.div`
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
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

const ColorDistanceTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState({ r: 128, g: 128, b: 128 });
  const [foregroundColor, setForegroundColor] = useState({ r: 160, g: 160, b: 160 });

  const rgbToHex = (r, g, b) => {
    const toHex = (n) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  };

  const handleHexChange = (hex, isBackground) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      if (isBackground) {
        setBackgroundColor(rgb);
      } else {
        setForegroundColor(rgb);
      }
    }
  };

  const handleReset = () => {
    setBackgroundColor({ r: 128, g: 128, b: 128 });
    setForegroundColor({ r: 160, g: 160, b: 160 });
  };

  useEffect(() => {
    document.documentElement.requestFullscreen().catch(err => {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
    });
  }, []);

  const handleExit = async () => {
    if (document.fullscreenElement) {
      await document.exitFullscreen();
    }
    navigate(-1);
  };

  const backgroundHex = rgbToHex(backgroundColor.r, backgroundColor.g, backgroundColor.b);
  const foregroundHex = rgbToHex(foregroundColor.r, foregroundColor.g, foregroundColor.b);

  return (
    <TestContainer backgroundColor={backgroundHex}>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <ColorSquare foregroundColor={foregroundHex} />

      <ControlPanel isMinimized={isMinimized}>
        <PanelHeader isMinimized={isMinimized}>
          <h2>Color Distance Controls</h2>
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
              Assess your monitor's ability to display and distinguish between similar colors. 
              Adjust the background and foreground colors to test how well your display can show 
              subtle color differences. This helps identify your monitor's capability to represent 
              fine color variations in images and graphics.
            </Description>

            <Section>
              <h3>Background Color</h3>
              <ColorControl color="red">
                <label>Red (R)</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={backgroundColor.r}
                    onChange={(e) => setBackgroundColor({ ...backgroundColor, r: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={backgroundColor.r}
                    onChange={(e) => {
                      const value = Math.min(255, Math.max(0, Number(e.target.value)));
                      setBackgroundColor({ ...backgroundColor, r: value });
                    }}
                  />
                </div>
              </ColorControl>
              <ColorControl color="green">
                <label>Green (G)</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={backgroundColor.g}
                    onChange={(e) => setBackgroundColor({ ...backgroundColor, g: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={backgroundColor.g}
                    onChange={(e) => {
                      const value = Math.min(255, Math.max(0, Number(e.target.value)));
                      setBackgroundColor({ ...backgroundColor, g: value });
                    }}
                  />
                </div>
              </ColorControl>
              <ColorControl color="blue">
                <label>Blue (B)</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={backgroundColor.b}
                    onChange={(e) => setBackgroundColor({ ...backgroundColor, b: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={backgroundColor.b}
                    onChange={(e) => {
                      const value = Math.min(255, Math.max(0, Number(e.target.value)));
                      setBackgroundColor({ ...backgroundColor, b: value });
                    }}
                  />
                </div>
              </ColorControl>
              <ColorPreview>
                <ColorBox color={backgroundHex} />
                <ColorCode>{backgroundHex.toUpperCase()}</ColorCode>
                <HexInput
                  type="text"
                  value={backgroundHex.toUpperCase()}
                  onChange={(e) => handleHexChange(e.target.value, true)}
                  placeholder="#000000"
                />
              </ColorPreview>
            </Section>

            <Section>
              <h3>Foreground Color</h3>
              <ColorControl color="red">
                <label>Red (R)</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={foregroundColor.r}
                    onChange={(e) => setForegroundColor({ ...foregroundColor, r: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={foregroundColor.r}
                    onChange={(e) => {
                      const value = Math.min(255, Math.max(0, Number(e.target.value)));
                      setForegroundColor({ ...foregroundColor, r: value });
                    }}
                  />
                </div>
              </ColorControl>
              <ColorControl color="green">
                <label>Green (G)</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={foregroundColor.g}
                    onChange={(e) => setForegroundColor({ ...foregroundColor, g: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={foregroundColor.g}
                    onChange={(e) => {
                      const value = Math.min(255, Math.max(0, Number(e.target.value)));
                      setForegroundColor({ ...foregroundColor, g: value });
                    }}
                  />
                </div>
              </ColorControl>
              <ColorControl color="blue">
                <label>Blue (B)</label>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={foregroundColor.b}
                    onChange={(e) => setForegroundColor({ ...foregroundColor, b: Number(e.target.value) })}
                  />
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={foregroundColor.b}
                    onChange={(e) => {
                      const value = Math.min(255, Math.max(0, Number(e.target.value)));
                      setForegroundColor({ ...foregroundColor, b: value });
                    }}
                  />
                </div>
              </ColorControl>
              <ColorPreview>
                <ColorBox color={foregroundHex} />
                <ColorCode>{foregroundHex.toUpperCase()}</ColorCode>
                <HexInput
                  type="text"
                  value={foregroundHex.toUpperCase()}
                  onChange={(e) => handleHexChange(e.target.value, false)}
                  placeholder="#000000"
                />
              </ColorPreview>
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

export default ColorDistanceTest;
