import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 2rem;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary);
`;

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
`;

const DropdownButton = styled.button`
  color: var(--text);
  background: none;
  border: none;
  font-size: 1rem;
  cursor: pointer;
  padding: 0.75rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  border-radius: 6px;

  &:hover {
    color: var(--primary);
    background-color: rgba(255, 255, 255, 0.05);
  }

  svg {
    transition: transform 0.2s;
    transform: ${props => props.show ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const DropdownContent = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  background-color: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(10px);
  min-width: 220px;
  border-radius: 12px;
  padding: 0.5rem;
  box-shadow: 0 4px 20px -1px rgba(0, 0, 0, 0.3);
  opacity: ${props => props.show ? '1' : '0'};
  visibility: ${props => props.show ? 'visible' : 'hidden'};
  transform: translateY(${props => props.show ? '0' : '-10px'});
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:before {
    content: '';
    position: absolute;
    top: -4px;
    left: 1rem;
    width: 8px;
    height: 8px;
    background: rgba(15, 23, 42, 0.95);
    transform: rotate(45deg);
  }
`;

const DropdownItem = styled.a`
  color: var(--text);
  padding: 0.75rem 1rem;
  display: block;
  text-decoration: none;
  transition: all 0.2s;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.95rem;

  &:hover {
    color: var(--primary);
    background-color: rgba(255, 255, 255, 0.05);
  }
`;

const ExternalDropdownItem = styled(DropdownItem)`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 12px;
    height: 12px;
    opacity: 0.7;
  }
`;

const FullscreenNavLink = ({ to, children }) => {
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await document.documentElement.requestFullscreen();
      navigate(to);
    } catch (err) {
      console.log(`Error attempting to enable fullscreen: ${err.message}`);
      navigate(to);
    }
  };

  return (
    <DropdownItem onClick={handleClick}>
      {children}
    </DropdownItem>
  );
};

const Navbar = () => {
  const [showTestsDropdown, setShowTestsDropdown] = useState(false);
  const [showToolsDropdown, setShowToolsDropdown] = useState(false);

  return (
    <Nav>
      <NavContainer>
        <Logo to="/">Display Test</Logo>
        <DropdownContainer 
          onMouseEnter={() => setShowTestsDropdown(true)}
          onMouseLeave={() => setShowTestsDropdown(false)}
        >
          <DropdownButton show={showTestsDropdown}>
            Tests
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </DropdownButton>
          <DropdownContent show={showTestsDropdown}>
            <FullscreenNavLink to="/test/dead-pixel">Dead Pixel</FullscreenNavLink>
            <FullscreenNavLink to="/test/uniformity">Uniformity</FullscreenNavLink>
            <FullscreenNavLink to="/test/text-clarity">Text Clarity</FullscreenNavLink>
            <FullscreenNavLink to="/test/color-gradient">Color Gradient</FullscreenNavLink>
            <FullscreenNavLink to="/test/color-distance">Color Distance</FullscreenNavLink>
            <FullscreenNavLink to="/test/response-time">Response Time</FullscreenNavLink>
            <FullscreenNavLink to="/test/gamma">Gamma</FullscreenNavLink>
            <FullscreenNavLink to="/test/test-patterns">Test Patterns</FullscreenNavLink>
            <FullscreenNavLink to="/test/viewing-angle">Viewing Angle</FullscreenNavLink>
            <FullscreenNavLink to="/test/brightness">Brightness</FullscreenNavLink>
            <FullscreenNavLink to="/test/contrast">Contrast</FullscreenNavLink>
            <FullscreenNavLink to="/test/matrix">Matrix</FullscreenNavLink>
          </DropdownContent>
        </DropdownContainer>
        <DropdownContainer 
          onMouseEnter={() => setShowToolsDropdown(true)}
          onMouseLeave={() => setShowToolsDropdown(false)}
        >
          <DropdownButton show={showToolsDropdown}>
            Other Tools
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </DropdownButton>
          <DropdownContent show={showToolsDropdown}>
            <ExternalDropdownItem 
              href="https://keyboard-test.app" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Keyboard Test
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ExternalDropdownItem>
            <ExternalDropdownItem 
              href="https://controller-test.app" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              Controller Test
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </ExternalDropdownItem>
          </DropdownContent>
        </DropdownContainer>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
