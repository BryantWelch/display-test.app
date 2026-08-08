import React, { useState, useCallback } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Label } from '../../components/TestShell';

const ColorSquare = styled.div`
  width: 35vh;
  height: 35vh;
  background: ${props => props.$foregroundColor};
  transition: background-color 0.3s ease;
`;

const ColorControl = styled.div`
  margin-bottom: 1rem;

  .slider-container {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  input[type="range"] {
    flex: 1;
    margin: 0.5rem 0;
    height: 6px;
    -webkit-appearance: none;
    background: ${props => {
      if (props.$color === 'red') return 'linear-gradient(to right, #000, #f00)';
      if (props.$color === 'green') return 'linear-gradient(to right, #000, #0f0)';
      if (props.$color === 'blue') return 'linear-gradient(to right, #000, #00f)';
      return '#e0e0e0';
    }};
    border-radius: 3px;

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      width: 16px;
      height: 16px;
      background: ${props => {
        if (props.$color === 'red') return '#f00';
        if (props.$color === 'green') return '#0f0';
        if (props.$color === 'blue') return '#00f';
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
  background: ${props => props.$color};
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const ColorCode = styled.div`
  font-family: monospace;
  font-size: 0.9rem;
  color: #666;
`;

const ColorDistanceTest = () => {
  const [backgroundColor, setBackgroundColor] = useState({ r: 128, g: 128, b: 128, hex: '#808080' });
  const [foregroundColor, setForegroundColor] = useState({ r: 160, g: 160, b: 160, hex: '#a0a0a0' });

  const rgbToHex = useCallback((r, g, b) => {
    const toHex = (n) => {
      const hex = Math.round(n).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);

  const handleHexChange = useCallback((hex, isBackground) => {
    // Handle paste events that might include the #
    let cleanHex = hex.trim();

    // If pasted value starts with #, remove it temporarily
    if (cleanHex.startsWith('#')) {
      cleanHex = cleanHex.substring(1);
    }

    // Remove any non-hex characters
    cleanHex = cleanHex.replace(/[^0-9a-f]/gi, '');

    // Limit to 6 characters
    cleanHex = cleanHex.slice(0, 6);

    // Add the # back
    cleanHex = '#' + cleanHex;

    // Update the input value
    if (isBackground) {
      setBackgroundColor(prev => ({
        ...prev,
        hex: cleanHex
      }));
    } else {
      setForegroundColor(prev => ({
        ...prev,
        hex: cleanHex
      }));
    }

    // Only convert to RGB if we have a valid 6-digit hex
    if (cleanHex.length === 7) {  // # plus 6 hex digits
      const result = /^#([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(cleanHex);
      if (result) {
        const rgb = {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        };
        if (isBackground) {
          setBackgroundColor(prev => ({
            ...prev,
            ...rgb
          }));
        } else {
          setForegroundColor(prev => ({
            ...prev,
            ...rgb
          }));
        }
      }
    }
  }, []);

  const handleReset = useCallback(() => {
    setBackgroundColor({ r: 128, g: 128, b: 128, hex: '#808080' });
    setForegroundColor({ r: 160, g: 160, b: 160, hex: '#a0a0a0' });
  }, []);

  const backgroundHex = rgbToHex(backgroundColor.r, backgroundColor.g, backgroundColor.b);
  const foregroundHex = rgbToHex(foregroundColor.r, foregroundColor.g, foregroundColor.b);

  return (
    <TestShell
      title="Color Distance Controls"
      description="Assess your monitor's ability to display and distinguish between similar colors. Adjust the background and foreground colors to test how well your display can show subtle color differences. This helps identify your monitor's capability to represent fine color variations in images and graphics."
      onReset={handleReset}
      style={{ backgroundColor: backgroundHex }}
      controls={
        <>
          <Section>
            <h3>Background Color</h3>
            <ColorControl $color="red">
              <Label>Red (R)</Label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={backgroundColor.r}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    const newColor = { ...backgroundColor, r };
                    const hex = rgbToHex(r, newColor.g, newColor.b);
                    setBackgroundColor({ ...newColor, hex });
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={backgroundColor.r}
                  onChange={(e) => {
                    const value = Math.min(255, Math.max(0, Number(e.target.value)));
                    const newColor = { ...backgroundColor, r: value };
                    const hex = rgbToHex(value, newColor.g, newColor.b);
                    setBackgroundColor({ ...newColor, hex });
                  }}
                />
              </div>
            </ColorControl>
            <ColorControl $color="green">
              <Label>Green (G)</Label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={backgroundColor.g}
                  onChange={(e) => {
                    const g = Number(e.target.value);
                    const newColor = { ...backgroundColor, g };
                    const hex = rgbToHex(newColor.r, g, newColor.b);
                    setBackgroundColor({ ...newColor, hex });
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={backgroundColor.g}
                  onChange={(e) => {
                    const value = Math.min(255, Math.max(0, Number(e.target.value)));
                    const newColor = { ...backgroundColor, g: value };
                    const hex = rgbToHex(newColor.r, value, newColor.b);
                    setBackgroundColor({ ...newColor, hex });
                  }}
                />
              </div>
            </ColorControl>
            <ColorControl $color="blue">
              <Label>Blue (B)</Label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={backgroundColor.b}
                  onChange={(e) => {
                    const b = Number(e.target.value);
                    const newColor = { ...backgroundColor, b };
                    const hex = rgbToHex(newColor.r, newColor.g, b);
                    setBackgroundColor({ ...newColor, hex });
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={backgroundColor.b}
                  onChange={(e) => {
                    const value = Math.min(255, Math.max(0, Number(e.target.value)));
                    const newColor = { ...backgroundColor, b: value };
                    const hex = rgbToHex(newColor.r, newColor.g, value);
                    setBackgroundColor({ ...newColor, hex });
                  }}
                />
              </div>
            </ColorControl>
            <ColorPreview>
              <ColorBox $color={backgroundHex} />
              <ColorCode>{backgroundHex.toUpperCase()}</ColorCode>
              <HexInput
                type="text"
                value={backgroundColor.hex || backgroundHex.toUpperCase()}
                onChange={(e) => handleHexChange(e.target.value, true)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData('text');
                  handleHexChange(pastedText, true);
                }}
                maxLength={7}
                placeholder="#000000"
              />
            </ColorPreview>
          </Section>

          <Section>
            <h3>Foreground Color</h3>
            <ColorControl $color="red">
              <Label>Red (R)</Label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={foregroundColor.r}
                  onChange={(e) => {
                    const r = Number(e.target.value);
                    const newColor = { ...foregroundColor, r };
                    const hex = rgbToHex(r, newColor.g, newColor.b);
                    setForegroundColor({ ...newColor, hex });
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={foregroundColor.r}
                  onChange={(e) => {
                    const value = Math.min(255, Math.max(0, Number(e.target.value)));
                    const newColor = { ...foregroundColor, r: value };
                    const hex = rgbToHex(value, newColor.g, newColor.b);
                    setForegroundColor({ ...newColor, hex });
                  }}
                />
              </div>
            </ColorControl>
            <ColorControl $color="green">
              <Label>Green (G)</Label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={foregroundColor.g}
                  onChange={(e) => {
                    const g = Number(e.target.value);
                    const newColor = { ...foregroundColor, g };
                    const hex = rgbToHex(newColor.r, g, newColor.b);
                    setForegroundColor({ ...newColor, hex });
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={foregroundColor.g}
                  onChange={(e) => {
                    const value = Math.min(255, Math.max(0, Number(e.target.value)));
                    const newColor = { ...foregroundColor, g: value };
                    const hex = rgbToHex(newColor.r, value, newColor.b);
                    setForegroundColor({ ...newColor, hex });
                  }}
                />
              </div>
            </ColorControl>
            <ColorControl $color="blue">
              <Label>Blue (B)</Label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="255"
                  value={foregroundColor.b}
                  onChange={(e) => {
                    const b = Number(e.target.value);
                    const newColor = { ...foregroundColor, b };
                    const hex = rgbToHex(newColor.r, newColor.g, b);
                    setForegroundColor({ ...newColor, hex });
                  }}
                />
                <input
                  type="number"
                  min="0"
                  max="255"
                  value={foregroundColor.b}
                  onChange={(e) => {
                    const value = Math.min(255, Math.max(0, Number(e.target.value)));
                    const newColor = { ...foregroundColor, b: value };
                    const hex = rgbToHex(newColor.r, newColor.g, value);
                    setForegroundColor({ ...newColor, hex });
                  }}
                />
              </div>
            </ColorControl>
            <ColorPreview>
              <ColorBox $color={foregroundHex} />
              <ColorCode>{foregroundHex.toUpperCase()}</ColorCode>
              <HexInput
                type="text"
                value={foregroundColor.hex || foregroundHex.toUpperCase()}
                onChange={(e) => handleHexChange(e.target.value, false)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedText = e.clipboardData.getData('text');
                  handleHexChange(pastedText, false);
                }}
                maxLength={7}
                placeholder="#000000"
              />
            </ColorPreview>
          </Section>
        </>
      }
    >
      <ColorSquare $foregroundColor={foregroundHex} />
    </TestShell>
  );
};

export default ColorDistanceTest;
