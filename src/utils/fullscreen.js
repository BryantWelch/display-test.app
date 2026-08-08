/**
 * Enter browser fullscreen for tests. On mobile this can show a short system
 * toast — TestShell parks the minimized panel at the top so it stays usable.
 */
export async function enterTestFullscreen() {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (typeof root.requestFullscreen !== 'function') return;
  if (document.fullscreenElement) return;
  await root.requestFullscreen();
}
