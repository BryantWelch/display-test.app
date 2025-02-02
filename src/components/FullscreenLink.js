import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TestCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  padding: 2rem;
  border-radius: 1rem;
  transition: transform 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
  }
`;

const TestTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
`;

const TestDescription = styled.p`
  color: var(--secondary);
`;

const FullscreenLink = ({ to, title, description }) => {
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await document.documentElement.requestFullscreen();
      navigate(to);
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      // Navigate anyway if fullscreen fails
      navigate(to);
    }
  };

  return (
    <TestCard onClick={handleClick}>
      <TestTitle>{title}</TestTitle>
      <TestDescription>{description}</TestDescription>
    </TestCard>
  );
};

export default FullscreenLink;
