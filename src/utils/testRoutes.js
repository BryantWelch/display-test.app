/** Map fullscreen test routes back to their SEO/info guide pages. */
export const TEST_TO_INFO = {
  '/test/dead-pixel': '/dead-pixel',
  '/test/uniformity': '/uniformity',
  '/test/text-clarity': '/text-clarity',
  '/test/color-gradient': '/color-gradient',
  '/test/color-distance': '/color-distance',
  '/test/response-time': '/response-time',
  '/test/gamma': '/gamma',
  '/test/test-patterns': '/test-patterns',
  '/test/viewing-angle': '/viewing-angle',
  '/test/brightness': '/brightness',
  '/test/contrast': '/contrast',
  '/test/matrix': '/matrix',
};

export function getInfoRouteFromTestPath(testPath) {
  return TEST_TO_INFO[testPath] || '/';
}
