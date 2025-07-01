import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './components/Layout';
import Footer from './components/Footer';
import SEO from './components/SEO';
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
import PrivacyPolicy from './pages/PrivacyPolicy';

const AppContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  padding-top: 4rem;
`;

// SEO data for each route
const seoData = {
  '/': {
    title: 'Display Test - Free Monitor Testing Tools',
    description: 'Free professional display testing suite for LCD, LED, OLED, and gaming monitors. Tools include brightness calibration, contrast ratio measurement, dead pixel detection, color accuracy testing, response time analysis, screen uniformity check, gamma calibration, and viewing angle assessment.'
  },
  '/privacy': {
    title: 'Privacy Policy - Display Test App',
    description: 'Display Test App\'s privacy policy explains how we handle information when you use our display testing application. We are committed to protecting your privacy.'
  },
  '/test/dead-pixel': {
    title: 'Dead Pixel Test - Display Test',
    description: 'Check your display for dead or stuck pixels using various solid color backgrounds. Cycle through colors manually or automatically to identify display defects.'
  },
  '/test/uniformity': {
    title: 'Uniformity Test - Display Test',
    description: 'Test screen uniformity with solid color backgrounds and adjustable grid patterns. Identify backlight bleed and color consistency issues across your entire display.'
  },
  '/test/text-clarity': {
    title: 'Text Clarity Test - Display Test',
    description: 'Check your display for text readability with adjustable font sizes, styles, and background colors. Fine-tune letter spacing and line height to evaluate text rendering quality.'
  },
  '/test/color-gradient': {
    title: 'Color Gradient Test - Display Test',
    description: 'Examine your display for color banding with customizable RGB gradients and number of steps. Test your display\'s color smoothness with adjustable gradient patterns.'
  },
  '/test/response-time': {
    title: 'Response Time Test - Display Test',
    description: 'Evaluate your display\'s motion clarity using moving objects at different speeds and directions. Test for ghosting and blur with customizable animation controls.'
  },
  '/test/color-distance': {
    title: 'Color Distance Test - Display Test',
    description: 'Test your display\'s ability to accurately reproduce similar colors while maintaining their distinction by adjusting the RGB/HEX values of the foreground and background colors.'
  },
  '/test/test-patterns': {
    title: 'Test Patterns - Display Test',
    description: 'Analyze display performance with essential calibration and alignment patterns. Switch between different test patterns to check various display characteristics.'
  },
  '/test/gamma': {
    title: 'Gamma Test - Display Test',
    description: 'Check your display\'s gamma calibration across standard values from 1.8 to 2.4. Compare grayscale steps to evaluate gamma accuracy and gray-scale rendering.'
  },
  '/test/viewing-angle': {
    title: 'Viewing Angle Test - Display Test',
    description: 'Test viewing angles using a contrasting pattern and color shifts at different positions. Evaluate your display from multiple viewing positions with visual indicators.'
  },
  '/test/brightness': {
    title: 'Brightness Test - Display Test',
    description: 'Measure brightness levels using adjustable white windows from 5% to 100%. Test screen luminance with variable-sized patterns against a black background.'
  },
  '/test/contrast': {
    title: 'Contrast Test - Display Test',
    description: 'Test contrast with adjustable checkerboard patterns from 2x2 to 50x50 grids. Evaluate black and white level separation with customizable pattern sizes.'
  },
  '/test/matrix': {
    title: 'Matrix Test - Display Test',
    description: 'Create Matrix-style digital rain with adjustable text colors, sizes, and animation speeds. Customize the classic effect with various background options.'
  }
};

const App = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  const currentSEO = seoData[location.pathname] || seoData['/'];

  return (
    <AppContainer>
      <SEO {...currentSEO} />
      <Layout>
        <MainContent>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
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
        </MainContent>
      </Layout>
      {isHomePage && <Footer />}
    </AppContainer>
  );
};

export default App;
