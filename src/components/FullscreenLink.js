import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const TestCard = styled.div`
  cursor: pointer;
`;

const TestTitle = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: var(--primary);
`;

const TestDescription = styled.p`
  color: var(--secondary);
  line-height: 1.6;
  font-size: 1rem;
`;

const FullscreenLink = ({ to, title, description, className }) => {
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
    <TestCard onClick={handleClick} className={className}>
      <TestTitle>{title}</TestTitle>
      <TestDescription>{description}</TestDescription>
    </TestCard>
  );
};

export default FullscreenLink;
