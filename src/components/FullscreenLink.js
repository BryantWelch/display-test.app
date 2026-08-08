import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const TestCard = styled(Link)`
  cursor: pointer;
  text-decoration: none;
  display: block;
  color: inherit;
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

const FullscreenLink = ({ to, title, description, className }) => (
  <TestCard to={to} className={className}>
    <TestTitle>{title}</TestTitle>
    <TestDescription>{description}</TestDescription>
  </TestCard>
);

export default FullscreenLink;
