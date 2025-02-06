import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(10px);
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 99;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  position: relative;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary);
  z-index: 101;
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: var(--text);
  padding: 0.75rem;
  z-index: 101;
  cursor: pointer;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 5px;
    align-items: center;
    justify-content: center;
    margin-left: auto;
  }

  span {
    display: block;
    width: 24px;
    height: 2px;
    background-color: var(--text);
    transition: all 0.3s ease-in-out;

    &:nth-child(1) {
      transform: ${props => props.isOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none'};
    }

    &:nth-child(2) {
      opacity: ${props => props.isOpen ? '0' : '1'};
    }

    &:nth-child(3) {
      transform: ${props => props.isOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none'};
    }
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    width: 85%;
    max-width: 400px;
    height: 100vh;
    background-color: rgb(15, 23, 42);
    flex-direction: column;
    align-items: stretch;
    padding: 5rem 1.5rem 2rem;
    gap: 0.75rem;
    z-index: 100;
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transform: translateX(${props => props.isOpen ? '0' : '100%'});
    transition: transform 0.3s ease-in-out, visibility 0s ${props => props.isOpen ? '0s' : '0.3s'};
    overflow-y: auto;
    box-shadow: -4px 0 15px rgba(0, 0, 0, 0.3);
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.75);
  z-index: 98;
  opacity: 1;
  transition: opacity 0.3s ease-in-out;
`;

const DropdownContainer = styled.div`
  position: relative;

  @media (max-width: 768px) {
    width: 100%;
    position: static;
  }
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
  border-radius: 0.375rem;
  transition: all 0.2s;
  width: 100%;
  justify-content: space-between;

  @media (max-width: 768px) {
    background: rgba(255, 255, 255, 0.1);
    font-size: 1.1rem;
    padding: 1rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }

  svg {
    transition: transform 0.2s;
    transform: ${props => props.show ? 'rotate(180deg)' : 'rotate(0)'};
  }
`;

const DropdownContent = styled.div`
  display: ${props => props.show ? 'flex' : 'none'};
  flex-direction: column;
  position: absolute;
  min-width: 220px;
  background-color: rgb(15, 23, 42);
  border-radius: 0.5rem;
  padding: 0.5rem;
  z-index: 101;
  top: 100%;
  left: 0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    background: none;
    box-shadow: none;
    padding: 0.5rem 0 0.5rem 1rem;
    margin: 0.5rem 0;
    gap: 0.5rem;
  }
`;

const DropdownItem = styled(Link)`
  color: var(--text);
  text-decoration: none;
  padding: 0.75rem 1rem;
  display: block;
  border-radius: 0.375rem;
  transition: all 0.2s;
  white-space: nowrap;

  @media (max-width: 768px) {
    background: rgba(255, 255, 255, 0.1);
    margin-bottom: 0.25rem;
    white-space: normal;
    font-size: 0.95rem;
  }

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
`;

const ExternalDropdownItem = styled(DropdownItem)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  white-space: normal;

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.8;
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    background: rgba(255, 255, 255, 0.1);
    margin-bottom: 0.25rem;
    padding: 0.75rem 1rem;
    font-size: 0.95rem;
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
  const [showDiscsDropdown, setShowDiscsDropdown] = useState(false);
  const [showHardwareDropdown, setShowHardwareDropdown] = useState(false);
  const [showSoftwareDropdown, setShowSoftwareDropdown] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navRef = useRef(null);

  const closeAllDropdowns = () => {
    setShowTestsDropdown(false);
    setShowToolsDropdown(false);
    setShowDiscsDropdown(false);
    setShowHardwareDropdown(false);
    setShowSoftwareDropdown(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    if (!isMenuOpen) {
      closeAllDropdowns();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        closeAllDropdowns();
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMenuOpen]);

  const handleDropdownClick = (setter, currentValue) => {
    // Close all other dropdowns
    closeAllDropdowns();
    // Toggle the clicked dropdown
    setter(!currentValue);
  };

  const handleDropdownHover = (setter, value) => {
    // Only use hover on non-mobile
    if (window.innerWidth > 768) {
      setter(value);
    }
  };

  return (
    <Nav>
      <NavContainer ref={navRef}>
        <Logo to="/">Display Test</Logo>
        
        <MenuButton isOpen={isMenuOpen} onClick={toggleMenu} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </MenuButton>

        {isMenuOpen && <Overlay onClick={() => setIsMenuOpen(false)} />}
        
        <NavLinks isOpen={isMenuOpen}>
          {/* Tests Dropdown */}
          <DropdownContainer 
            onMouseEnter={() => handleDropdownHover(setShowTestsDropdown, true)}
            onMouseLeave={() => handleDropdownHover(setShowTestsDropdown, false)}
          >
            <DropdownButton 
              show={showTestsDropdown}
              onClick={() => handleDropdownClick(setShowTestsDropdown, showTestsDropdown)}
            >
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

          {/* Other Tools Dropdown */}
          <DropdownContainer 
            onMouseEnter={() => handleDropdownHover(setShowToolsDropdown, true)}
            onMouseLeave={() => handleDropdownHover(setShowToolsDropdown, false)}
          >
            <DropdownButton 
              show={showToolsDropdown}
              onClick={() => handleDropdownClick(setShowToolsDropdown, showToolsDropdown)}
            >
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

          {/* Calibration Discs */}
          <DropdownContainer 
            onMouseEnter={() => handleDropdownHover(setShowDiscsDropdown, true)}
            onMouseLeave={() => handleDropdownHover(setShowDiscsDropdown, false)}
          >
            <DropdownButton 
              show={showDiscsDropdown}
              onClick={() => handleDropdownClick(setShowDiscsDropdown, showDiscsDropdown)}
            >
              Calibration Discs
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </DropdownButton>
            <DropdownContent show={showDiscsDropdown}>
            <ExternalDropdownItem 
                href="https://amzn.to/3CuY9zI"
                target="_blank"
                rel="noopener noreferrer"
              >
                Digital Video Essentials HD Basics
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
              <ExternalDropdownItem 
                href="https://amzn.to/4hKeOOB"
                target="_blank"
                rel="noopener noreferrer"
              >
                Disney WOW Calibration Disc
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
            <ExternalDropdownItem
                href="https://amzn.to/42J18Pp"
                target="_blank"
                rel="noopener noreferrer"
              >
                Spears & Munsil HD Benchmark and Calibration Disc
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
            </DropdownContent>
          </DropdownContainer>

          {/* Calibration Hardware */}
          <DropdownContainer 
            onMouseEnter={() => handleDropdownHover(setShowHardwareDropdown, true)}
            onMouseLeave={() => handleDropdownHover(setShowHardwareDropdown, false)}
          >
            <DropdownButton 
              show={showHardwareDropdown}
              onClick={() => handleDropdownClick(setShowHardwareDropdown, showHardwareDropdown)}
            >
              Calibration Hardware
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </DropdownButton>
            <DropdownContent show={showHardwareDropdown}>
            <ExternalDropdownItem 
                href="https://amzn.to/4jJwPyh"
                target="_blank"
                rel="noopener noreferrer"
              >
                Calibrite Display 123 Colorimeter
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
              <ExternalDropdownItem 
                href="https://amzn.to/414WKJi"
                target="_blank"
                rel="noopener noreferrer"
              >
                Calibrite Display Pro HL
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
              <ExternalDropdownItem 
                href="https://amzn.to/4hLjvHI"
                target="_blank"
                rel="noopener noreferrer"
              >
                Data Color SpyderX Pro
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
              <ExternalDropdownItem 
                href="https://amzn.to/4jLTgCY"
                target="_blank"
                rel="noopener noreferrer"
              >
                X-Rite i1Basic Pro 3
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
            </DropdownContent>
          </DropdownContainer>

          {/* Calibration Software */}
          <DropdownContainer 
            onMouseEnter={() => handleDropdownHover(setShowSoftwareDropdown, true)}
            onMouseLeave={() => handleDropdownHover(setShowSoftwareDropdown, false)}
          >
            <DropdownButton 
              show={showSoftwareDropdown}
              onClick={() => handleDropdownClick(setShowSoftwareDropdown, showSoftwareDropdown)}
            >
              Calibration Software
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </DropdownButton>
            <DropdownContent show={showSoftwareDropdown}>
            <ExternalDropdownItem 
                href="https://windowsreport.com/software/colorjinn-calibrize/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Calibrize
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
              <ExternalDropdownItem 
                href="https://store.portrait.com/consumer-software.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Calman Software
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
              <ExternalDropdownItem 
                href="https://displaycal.net/"
                target="_blank"
                rel="noopener noreferrer"
              >
                DisplayCAL
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
              <ExternalDropdownItem 
                href="https://quickgamma.de/indexen.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                QuickGamma
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 3h-6m6 0l-9 9m9-9v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </ExternalDropdownItem>
            </DropdownContent>
          </DropdownContainer>

        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
