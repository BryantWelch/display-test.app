import React from 'react';
import { Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './components/Layout';
import Home from './pages/Home';
import DeadPixelTest from './pages/tests/DeadPixelTest';
import UniformityTest from './pages/tests/UniformityTest';
import TextClarityTest from './pages/tests/TextClarityTest';
import ColorGradientTest from './pages/tests/ColorGradientTest';
import ResponseTimeTest from './pages/tests/ResponseTimeTest';
import ColorDistanceTest from './pages/tests/ColorDistanceTest';
import TestPatternsTest from './pages/tests/TestPatternsTest';
import Dashboard from './pages/Dashboard';
import GammaTest from './pages/tests/GammaTest';

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
          <Route path="/test/text-clarity" element={<TextClarityTest />} />
          <Route path="/test/color-gradient" element={<ColorGradientTest />} />
          <Route path="/test/response-time" element={<ResponseTimeTest />} />
          <Route path="/test/color-distance" element={<ColorDistanceTest />} />
          <Route path="/test/test-patterns" element={<TestPatternsTest />} />
          <Route path="/test/gamma" element={<GammaTest />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </AppContainer>
  );
};

export default App;
