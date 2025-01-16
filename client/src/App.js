import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './components/Layout';
import Home from './pages/Home';
import DeadPixelTest from './pages/tests/DeadPixelTest';
import UniformityTest from './pages/tests/UniformityTest';
import SharpnessTest from './pages/tests/SharpnessTest';
import Dashboard from './pages/Dashboard';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const App = () => {
  return (
    <AppContainer>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/test/dead-pixel" element={<DeadPixelTest />} />
          <Route path="/test/uniformity" element={<UniformityTest />} />
          <Route path="/test/sharpness" element={<SharpnessTest />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </AppContainer>
  );
};

export default App;
