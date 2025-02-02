import React from 'react';
import styled from 'styled-components';

const ColorPickerContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ColorInput = styled.input`
  width: 100%;
  height: 40px;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;

  &::-webkit-color-swatch-wrapper {
    padding: 0;
  }
  
  &::-webkit-color-swatch {
    border: none;
    border-radius: 3px;
  }
`;

const ColorPreview = styled.div`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  background-color: ${props => props.color};
  border: 1px solid #ddd;
`;

export const ColorPicker = ({ color, onChange }) => {
  return (
    <ColorPickerContainer>
      <ColorInput
        type="color"
        value={color}
        onChange={(e) => onChange(e.target.value)}
      />
      <ColorPreview color={color} />
    </ColorPickerContainer>
  );
};
