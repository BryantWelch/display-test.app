import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './components/Layout';
import Footer from './components/Footer';
import Home from './pages/Home';
import DeadPixelTest from './pages/tests/DeadPixelTest';
import UniformityTest from './pages/tests/UniformityTest';
import TextClarityTest from './pages/tests/TextClarityTest';
import ColorGradientTest from './pages/tests/ColorGradientTest';
import ResponseTimeTest from './pages/tests/ResponseTimeTest';
import ColorDistanceTest from './pages/tests/ColorDistanceTest';
import TestPatternsTest from './pages/tests/TestPatternsTest';
import GammaTest from './pages/tests/GammaTest';
import ViewingAngleTest from './pages/tests/ViewingAngleTest';
import BrightnessTest from './pages/tests/BrightnessTest';
import ContrastTest from './pages/tests/ContrastTest';
import MatrixTest from './pages/tests/MatrixTest';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

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
          <Route path="/test/viewing-angle" element={<ViewingAngleTest />} />
          <Route path="/test/brightness" element={<BrightnessTest />} />
          <Route path="/test/contrast" element={<ContrastTest />} />
          <Route path="/test/matrix" element={<MatrixTest />} />
        </Routes>
      </Layout>
      {isHomePage && <Footer />}
    </AppContainer>
  );
};

export default App;
