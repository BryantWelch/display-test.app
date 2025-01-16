import React from 'react';
import styled from 'styled-components';

const DashboardContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  margin-bottom: 2rem;
  color: var(--primary);
`;

const Message = styled.p`
  color: var(--secondary);
  font-size: 1.1rem;
`;

const Dashboard = () => {
  return (
    <DashboardContainer>
      <Title>Your Dashboard</Title>
      <Message>
        Sign in to save your test results and track your display's performance over time.
      </Message>
    </DashboardContainer>
  );
};

export default Dashboard;
