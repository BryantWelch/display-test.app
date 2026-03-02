import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Layout from './components/Layout';
import Footer from './components/Footer';
import SEO from './components/SEO';
import StructuredData from './components/StructuredData';
import Home from './pages/Home';
import About from './pages/About';
import DeadPixelInfo from './pages/DeadPixelInfo';
import UniformityInfo from './pages/UniformityInfo';
import TextClarityInfo from './pages/TextClarityInfo';
import ColorGradientInfo from './pages/ColorGradientInfo';
import ResponseTimeInfo from './pages/ResponseTimeInfo';
import ColorDistanceInfo from './pages/ColorDistanceInfo';
import GammaInfo from './pages/GammaInfo';
import TestPatternsInfo from './pages/TestPatternsInfo';
import ViewingAngleInfo from './pages/ViewingAngleInfo';
import BrightnessInfo from './pages/BrightnessInfo';
import MatrixInfo from './pages/MatrixInfo';
import ContrastInfo from './pages/ContrastInfo';
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
  '/about': {
    title: 'About - Display Test App',
    description: 'Learn what the Display Test App is, who it is for, and how to contribute or report issues via the open source GitHub repository.'
  },
  '/dead-pixel': {
    title: 'Dead Pixel Checker - Find Stuck Pixels in 30 Seconds | Free Tool',
    description: 'Find dead pixels instantly. Free checker for LCD, OLED & gaming monitors. Cycle through colors to identify stuck, dead, or hot pixels. Works on all devices - no download needed.'
  },
  '/uniformity': {
    title: 'Screen Uniformity Test - Check Backlight Bleed & Color Consistency | Free Tool',
    description: 'Test your monitor for backlight bleed, IPS glow, and color uniformity issues. Free tool with adjustable grid patterns. Identify panel defects before your return window expires.'
  },
  '/text-clarity': {
    title: 'Text Clarity Test - Evaluate Font Sharpness & Readability | Free Tool',
    description: 'Test text sharpness and readability on your monitor. Adjust font sizes, spacing, and styles to reduce eye strain. Perfect for finding optimal ClearType settings. 100% free, no signup.'
  },
  '/color-gradient': {
    title: 'Color Banding Test - Check Gradient Smoothness | Free Tool',
    description: 'Detect color banding on your display with customizable RGB gradients. Test how smoothly your monitor renders color transitions. Essential for photo/video editing.'
  },
  '/response-time': {
    title: 'Response Time Test - Check Motion Blur & Ghosting | Free Tool',
    description: 'Evaluate your monitor\'s motion clarity and response time. Test for ghosting, blur, and overshoot with moving patterns. Critical for gaming and fast-paced content.'
  },
  '/color-distance': {
    title: 'Color Accuracy Test - Check Subtle Color Distinction | Free Tool',
    description: 'Test your display\'s ability to show subtle color differences. Adjust RGB/HEX values to evaluate color accuracy. Essential for designers and photo editors.'
  },
  '/gamma': {
    title: 'Gamma Calibration Test - Check Display Gamma 1.8 to 2.4 | Free Tool',
    description: 'Test your monitor\'s gamma calibration across standard values. Evaluate grayscale rendering and midtone accuracy. Find optimal gamma settings for your viewing environment.'
  },
  '/test-patterns': {
    title: 'Professional Test Patterns - Check Sharpness & Geometry | Free Tool',
    description: 'Analyze display performance with professional calibration patterns. Test sharpness, geometry, scaling, and overscan. Industry-standard patterns for monitor evaluation.'
  },
  '/viewing-angle': {
    title: 'Viewing Angle Test - Check Color Shift & IPS Glow | Free Tool',
    description: 'Test your monitor\'s viewing angles for gaming and movies. Check for color shift, brightness changes, and IPS glow. Compare IPS, VA, and TN panel performance.'
  },
  '/brightness': {
    title: 'Brightness Test - Measure Display Luminance | Free Tool',
    description: 'Measure your monitor\'s brightness levels with adjustable white windows (5% to 100%). Test screen luminance and find comfortable settings for your environment.'
  },
  '/contrast': {
    title: 'Contrast Ratio Test - Check Black & White Levels | Free Tool',
    description: 'Test contrast with adjustable checkerboard patterns (2x2 to 50x50). Evaluate black and white level separation. Essential for HDR and movie viewing.'
  },
  '/matrix': {
    title: 'Matrix Test - Display Test',
    description: 'Enjoy a customizable Matrix-style digital rain effect with adjustable colors, speeds, and text sizes. A fun homage to classic falling code.'
  },
  '/privacy': {
    title: 'Privacy Policy - Display Test App',
    description: 'Display Test App\'s privacy policy explains how we handle information when you use our display testing application. We are committed to protecting your privacy.'
  },
  '/test/dead-pixel': {
    title: 'Dead Pixel Test - Check for Stuck Pixels | Fullscreen Mode',
    description: 'Check your display for dead or stuck pixels using various solid color backgrounds. Cycle through colors manually or automatically to identify display defects.'
  },
  '/test/uniformity': {
    title: 'Uniformity Test - Check Backlight Bleed | Fullscreen Mode',
    description: 'Test screen uniformity with solid color backgrounds and adjustable grid patterns. Identify backlight bleed and color consistency issues across your entire display.'
  },
  '/test/text-clarity': {
    title: 'Text Clarity Test - Evaluate Font Sharpness | Fullscreen Mode',
    description: 'Check your display for text readability with adjustable font sizes, styles, and background colors. Fine-tune letter spacing and line height to evaluate text rendering quality.'
  },
  '/test/color-gradient': {
    title: 'Color Gradient Test - Detect Banding | Fullscreen Mode',
    description: 'Examine your display for color banding with customizable RGB gradients and number of steps. Test your display\'s color smoothness with adjustable gradient patterns.'
  },
  '/test/response-time': {
    title: 'Response Time Test - Check Motion Blur | Fullscreen Mode',
    description: 'Evaluate your display\'s motion clarity using moving objects at different speeds and directions. Test for ghosting and blur with customizable animation controls.'
  },
  '/test/color-distance': {
    title: 'Color Distance Test - Check Color Accuracy | Fullscreen Mode',
    description: 'Test your display\'s ability to accurately reproduce similar colors while maintaining their distinction by adjusting the RGB/HEX values of the foreground and background colors.'
  },
  '/test/test-patterns': {
    title: 'Test Patterns - Professional Calibration | Fullscreen Mode',
    description: 'Analyze display performance with essential calibration and alignment patterns. Switch between different test patterns to check various display characteristics.'
  },
  '/test/gamma': {
    title: 'Gamma Test - Check Calibration | Fullscreen Mode',
    description: 'Check your display\'s gamma calibration across standard values from 1.8 to 2.4. Compare grayscale steps to evaluate gamma accuracy and gray-scale rendering.'
  },
  '/test/viewing-angle': {
    title: 'Viewing Angle Test - Check Color Shift | Fullscreen Mode',
    description: 'Test viewing angles using a contrasting pattern and color shifts at different positions. Evaluate your display from multiple viewing positions with visual indicators.'
  },
  '/test/brightness': {
    title: 'Brightness Test - Measure Luminance | Fullscreen Mode',
    description: 'Measure brightness levels using adjustable white windows from 5% to 100%. Test screen luminance with variable-sized patterns against a black background.'
  },
  '/test/contrast': {
    title: 'Contrast Test - Check Black Levels | Fullscreen Mode',
    description: 'Test contrast with adjustable checkerboard patterns from 2x2 to 50x50 grids. Evaluate black and white level separation with customizable pattern sizes.'
  },
  '/test/matrix': {
    title: 'Matrix Test - Display Test',
    description: 'Create Matrix-style digital rain with adjustable text colors, sizes, and animation speeds. Customize the classic effect with various background options.'
  }
};

const App = () => {
  const location = useLocation();
  const isTestRoute = location.pathname.startsWith('/test/');
  const currentSEO = seoData[location.pathname] || seoData['/'];

  return (
    <AppContainer>
      <SEO {...currentSEO} />
      <StructuredData 
        type={location.pathname === '/' ? 'SoftwareApplication' : 'WebPage'} 
        data={currentSEO} 
      />
      <Layout>
        <MainContent>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/dead-pixel" element={<DeadPixelInfo />} />
              <Route path="/uniformity" element={<UniformityInfo />} />
              <Route path="/text-clarity" element={<TextClarityInfo />} />
              <Route path="/color-gradient" element={<ColorGradientInfo />} />
              <Route path="/response-time" element={<ResponseTimeInfo />} />
              <Route path="/color-distance" element={<ColorDistanceInfo />} />
              <Route path="/gamma" element={<GammaInfo />} />
              <Route path="/test-patterns" element={<TestPatternsInfo />} />
              <Route path="/viewing-angle" element={<ViewingAngleInfo />} />
              <Route path="/brightness" element={<BrightnessInfo />} />
              <Route path="/matrix" element={<MatrixInfo />} />
              <Route path="/contrast" element={<ContrastInfo />} />
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
      {!isTestRoute && <Footer />}
    </AppContainer>
  );
};

export default App;
