import React from 'react';
import { Link } from 'react-router-dom';
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
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary);
`;

const NavLinks = styled.div`
  display: flex;
  gap: 2rem;
`;

const NavLink = styled(Link)`
  color: var(--text);
  transition: color 0.2s;

  &:hover {
    color: var(--primary);
  }
`;

const Navbar = () => {
  return (
    <Nav>
      <NavContainer>
        <Logo to="/">Display Test</Logo>
        <NavLinks>
          <NavLink to="/test/dead-pixel">Dead Pixel</NavLink>
          <NavLink to="/test/uniformity">Uniformity</NavLink>
          <NavLink to="/test/text-clarity">Text Clarity</NavLink>
          <NavLink to="/test/color-gradient">Color Gradient</NavLink>
          <NavLink to="/test/color-distance">Color Distance</NavLink>
          <NavLink to="/test/response-time">Response Time</NavLink>
          <NavLink to="/test/gamma">Gamma</NavLink>
          <NavLink to="/test/test-patterns">Test Patterns</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </NavLinks>
      </NavContainer>
    </Nav>
  );
};

export default Navbar;
