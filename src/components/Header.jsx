import React from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  text-align: center;
  padding: 4rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(to right, var(--primary), #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const Subtitle = styled.p`
  font-size: 1.25rem;
  color: var(--secondary);
  max-width: 600px;
  margin: 0 auto;
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Title>Professional Display Testing</Title>
      <Subtitle>
        Comprehensive tools to evaluate and optimize your display's performance
      </Subtitle>
    </HeaderContainer>
  );
};

export default Header;
