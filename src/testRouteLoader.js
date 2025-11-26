// Centralized dynamic imports for test routes so we can both lazy-load
// them in the router and prefetch them from info pages.

export const loadDeadPixelTest = () => import('./pages/tests/DeadPixelTest');
export const loadUniformityTest = () => import('./pages/tests/UniformityTest');
export const loadTextClarityTest = () => import('./pages/tests/TextClarityTest');
export const loadColorGradientTest = () => import('./pages/tests/ColorGradientTest');
export const loadResponseTimeTest = () => import('./pages/tests/ResponseTimeTest');
export const loadColorDistanceTest = () => import('./pages/tests/ColorDistanceTest');
export const loadTestPatternsTest = () => import('./pages/tests/TestPatternsTest');
export const loadGammaTest = () => import('./pages/tests/GammaTest');
export const loadViewingAngleTest = () => import('./pages/tests/ViewingAngleTest');
export const loadBrightnessTest = () => import('./pages/tests/BrightnessTest');
export const loadContrastTest = () => import('./pages/tests/ContrastTest');
export const loadMatrixTest = () => import('./pages/tests/MatrixTest');
