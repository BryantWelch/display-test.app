/**
 * Refresh-rate estimation from requestAnimationFrame timestamps.
 * Browsers fire rAF once per vsync on the monitor the window is on (when the tab is visible
 * and not throttled by power saving), so the median frame interval ≈ refresh period.
 */

export const COMMON_RATES = [24, 30, 48, 50, 60, 72, 75, 90, 100, 120, 144, 160, 165, 170, 175, 180, 200, 240, 280, 300, 360, 480, 500, 540];

export function snapToCommonRate(hz) {
  let best = COMMON_RATES[0];
  for (const rate of COMMON_RATES) {
    if (Math.abs(rate - hz) < Math.abs(best - hz)) best = rate;
  }
  return Math.abs(best - hz) / best < 0.03 ? best : Math.round(hz);
}

function median(values) {
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/**
 * Summarize a list of frame intervals (ms). The median alone is biased when timestamps are
 * coarsened (e.g. to 1 ms), so the period is refined by averaging intervals that land near a
 * whole number of refreshes. Jitter excludes dropped frames, which are counted separately.
 */
export function summarizeIntervals(intervals) {
  if (intervals.length < 5) return null;
  let period = median(intervals);
  for (let pass = 0; pass < 2; pass += 1) {
    let total = 0;
    let frames = 0;
    for (const ms of intervals) {
      const k = Math.round(ms / period);
      if (k >= 1 && k <= 3 && Math.abs(ms - k * period) <= period * 0.35) {
        total += ms;
        frames += k;
      }
    }
    if (frames) period = total / frames;
  }
  const steady = intervals.filter((ms) => ms <= period * 1.5);
  const mean = steady.reduce((a, b) => a + b, 0) / steady.length;
  const variance = steady.reduce((a, b) => a + (b - mean) ** 2, 0) / steady.length;
  const hz = 1000 / period;
  return {
    hz,
    snappedHz: snapToCommonRate(hz),
    frameMs: period,
    jitterMs: Math.sqrt(variance),
    minMs: Math.min(...intervals),
    maxMs: Math.max(...intervals),
    dropped: intervals.length - steady.length,
    samples: intervals.length,
  };
}

/**
 * One-shot measurement. Resolves with a summary after `durationMs`, discarding warm-up frames.
 */
export function measureRefreshRate({ durationMs = 1500, warmupFrames = 20 } = {}) {
  return new Promise((resolve) => {
    if (typeof requestAnimationFrame !== 'function') {
      resolve(null);
      return;
    }
    const intervals = [];
    let last = null;
    let frames = 0;
    let start = null;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      clearTimeout(fallback);
      resolve(summarizeIntervals(intervals));
    };
    // rAF stops in hidden tabs, so don't leave the promise pending forever.
    const fallback = setTimeout(finish, durationMs + 3000);
    const tick = (t) => {
      if (done) return;
      frames += 1;
      if (frames > warmupFrames) {
        if (start === null) start = t;
        if (last !== null) intervals.push(t - last);
        last = t;
      }
      if (start !== null && t - start >= durationMs) {
        finish();
        return;
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

/**
 * Continuous monitor. Calls `onUpdate(summary, intervals)` about every `updateMs` with a rolling
 * window of the last `windowSize` intervals. Returns a stop function.
 */
export function monitorFrames({ windowSize = 240, updateMs = 250, onUpdate }) {
  let raf = 0;
  let last = null;
  let lastEmit = 0;
  let stopped = false;
  const intervals = [];

  const tick = (t) => {
    if (stopped) return;
    if (last !== null) {
      const dt = t - last;
      // Ignore huge gaps (tab hidden, debugger) so they don't poison the window.
      if (dt < 250) {
        intervals.push(dt);
        if (intervals.length > windowSize) intervals.shift();
      }
    }
    last = t;
    if (t - lastEmit >= updateMs) {
      lastEmit = t;
      onUpdate?.(summarizeIntervals(intervals), intervals.slice());
    }
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);

  const onVisibility = () => {
    last = null;
    intervals.length = 0;
  };
  document.addEventListener('visibilitychange', onVisibility);

  return () => {
    stopped = true;
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', onVisibility);
  };
}
