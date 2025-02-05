import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import tvLogo from '../assets/tv.svg';

const HeaderContainer = styled.header`
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const TitleContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

const colorShift = keyframes`
  0% { filter: hue-rotate(0deg); }
  100% { filter: hue-rotate(360deg); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const Logo = styled.img`
  width: 120px;
  height: auto;
  transition: all 0.3s ease;
  cursor: pointer;
  transform: translateY(${props => props.$scrollOffset}px);

  &:hover {
    transform: scale(1.1) rotate(5deg);
    filter: drop-shadow(0 0 10px var(--primary));
    animation: ${colorShift} 2s linear infinite;
  }

  @media (prefers-reduced-motion: no-preference) {
    animation: ${float} 6s ease-in-out infinite;

    &:hover {
      animation: ${colorShift} 2s linear infinite, ${pulse} 2s ease-in-out infinite;
    }
  }
`;

const Title = styled.h1`
  font-size: 3.5rem;
  background: linear-gradient(to right, var(--primary), #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const Header = () => {
  const [scrollOffset, setScrollOffset] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      setScrollOffset(offset * 0.1); // Subtle parallax effect
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogoClick = () => {
    // TV static effect
    document.body.style.transition = 'all 0.2s ease';
    document.body.style.filter = 'contrast(150%) brightness(150%)';
    
    // Add scan lines
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: repeating-linear-gradient(
        0deg,
        rgba(0, 0, 0, 0.1),
        rgba(0, 0, 0, 0.1) 1px,
        transparent 1px,
        transparent 2px
      );
      pointer-events: none;
      z-index: 9999;
    `;
    document.body.appendChild(overlay);

    // Cleanup effects
    setTimeout(() => {
      document.body.style.filter = 'none';
      document.body.removeChild(overlay);
    }, 1000);
  };

  return (
    <HeaderContainer>
      <TitleContainer>
        <Logo 
          src={tvLogo} 
          alt="Display Test Logo" 
          onClick={handleLogoClick}
          $scrollOffset={scrollOffset}
        />
        <Title>Professional Display Testing</Title>
      </TitleContainer>
      <Subtitle>
        Comprehensive tools to evaluate and optimize your display's performance
      </Subtitle>
    </HeaderContainer>
  );
};

export default Header;
