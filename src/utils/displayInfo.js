/**
 * What the browser will tell us about the current display. Values are reported by the
 * browser/OS and can be wrong (e.g. colorDepth is almost always 24); callers should label
 * anything unsupported as "not reported" rather than "no".
 */

const mq = (query) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false;

const supportsMq = (feature) =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia(`(${feature})`).media !== 'not all';

export function getColorGamut() {
  if (!supportsMq('color-gamut: srgb')) return null;
  if (mq('(color-gamut: rec2020)')) return 'Rec. 2020';
  if (mq('(color-gamut: p3)')) return 'Display P3';
  if (mq('(color-gamut: srgb)')) return 'sRGB';
  return 'Below sRGB';
}

export function getDynamicRange() {
  if (!supportsMq('dynamic-range: standard')) return null;
  return mq('(dynamic-range: high)') ? 'HDR' : 'SDR';
}

export function getDisplayInfo() {
  if (typeof window === 'undefined') return null;
  const dpr = window.devicePixelRatio || 1;
  const { screen } = window;
  const physicalWidth = Math.round(screen.width * dpr);
  const physicalHeight = Math.round(screen.height * dpr);

  return {
    cssWidth: screen.width,
    cssHeight: screen.height,
    physicalWidth,
    physicalHeight,
    availWidth: screen.availWidth,
    availHeight: screen.availHeight,
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
    dpr,
    scalingPercent: Math.round(dpr * 100),
    colorDepth: screen.colorDepth,
    gamut: getColorGamut(),
    dynamicRange: getDynamicRange(),
    orientation: screen.orientation?.type || null,
    isExtended: typeof screen.isExtended === 'boolean' ? screen.isExtended : null,
    touchPoints: navigator.maxTouchPoints || 0,
    pointer: mq('(pointer: fine)') ? 'fine' : mq('(pointer: coarse)') ? 'coarse' : 'none',
    hover: mq('(hover: hover)'),
    prefersReducedMotion: mq('(prefers-reduced-motion: reduce)'),
    prefersContrast: !supportsMq('prefers-contrast: more')
      ? null
      : mq('(prefers-contrast: more)')
        ? 'more'
        : mq('(prefers-contrast: less)')
          ? 'less'
          : 'no-preference',
    forcedColors: mq('(forced-colors: active)'),
    aspectRatio: aspectLabel(physicalWidth, physicalHeight),
  };
}

const gcd = (a, b) => (b ? gcd(b, a % b) : a);

export function aspectLabel(w, h) {
  if (!w || !h) return null;
  const portrait = h > w;
  const long = portrait ? h : w;
  const short = portrait ? w : h;
  const known = [
    [16, 9], [16, 10], [21, 9], [32, 9], [4, 3], [5, 4], [3, 2], [64, 27], [43, 18], [12, 5],
  ];
  const ratio = long / short;
  let best = null;
  let bestDiff = 0.02;
  for (const k of known) {
    const diff = Math.abs(ratio - k[0] / k[1]);
    if (diff < bestDiff) [best, bestDiff] = [k, diff];
  }
  let a;
  let b;
  if (best) [a, b] = best;
  else {
    const d = gcd(long, short);
    [a, b] = [long / d, short / d];
    if (a > 50) return portrait ? `1:${ratio.toFixed(2)}` : `${ratio.toFixed(2)}:1`;
  }
  const label = portrait ? `${b}:${a}` : `${a}:${b}`;
  const ultrawide = a === 64 || a === 43 || (a === 12 && b === 5);
  return ultrawide ? `${portrait ? '9:21' : '21:9'} (${label})` : label;
}

/** Subscribe to changes when the window moves between monitors or settings change. */
export function onDisplayChange(callback) {
  if (typeof window === 'undefined') return () => {};
  const queries = ['(color-gamut: p3)', '(color-gamut: rec2020)', '(dynamic-range: high)'].map((q) =>
    window.matchMedia(q)
  );
  queries.forEach((q) => q.addEventListener?.('change', callback));
  window.addEventListener('resize', callback);

  // A resolution query only matches one DPR, so re-arm it after every change.
  let dprQuery = null;
  const onDpr = () => {
    armDpr();
    callback();
  };
  const armDpr = () => {
    dprQuery?.removeEventListener?.('change', onDpr);
    dprQuery = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`);
    dprQuery.addEventListener?.('change', onDpr);
  };
  armDpr();

  return () => {
    queries.forEach((q) => q.removeEventListener?.('change', callback));
    dprQuery?.removeEventListener?.('change', onDpr);
    window.removeEventListener('resize', callback);
  };
}
