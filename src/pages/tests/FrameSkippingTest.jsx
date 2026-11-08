import { useRef, useState } from 'react';
import TestShell, { Section, Segmented, Toggle, Readout, Button, ButtonRow, Hint } from '../../components/TestShell';
import PixelCanvas from '../../components/PixelCanvas';
import { summarizeIntervals } from '../../utils/frameTiming';

const COUNTS = [20, 40, 60, 100, 120];
const DEFAULTS = { count: 60, numbers: true };

const columnsFor = (count) => (count <= 40 ? 10 : count <= 60 ? 12 : 20);

const FrameSkippingTest = () => {
  const [s, setS] = useState(DEFAULTS);
  const [paused, setPaused] = useState(false);
  const [stats, setStats] = useState({ hz: 0, snapped: 0, jitter: 0, dropped: 0, ready: false });
  const set = (patch) => setS((prev) => ({ ...prev, ...patch }));

  const loop = useRef({ frame: 0, last: null, lastEmit: 0, intervals: [], frameMs: 0, recentDrops: [], dropped: 0, ready: false });

  const animate = (ctx, info, t) => {
    const st = loop.current;
    if (st.last !== null) {
      const dt = t - st.last;
      if (dt < 250) {
        st.intervals.push(dt);
        if (st.intervals.length > 240) st.intervals.shift();
        const drop = st.frameMs > 0 && dt > st.frameMs * 1.5;
        if (drop) st.dropped += 1;
        st.recentDrops.push(drop);
        if (st.recentDrops.length > 60) st.recentDrops.shift();
      } else {
        st.recentDrops = [];
      }
    }
    st.last = t;
    if (t - st.lastEmit >= 250) {
      st.lastEmit = t;
      const sum = summarizeIntervals(st.intervals);
      if (sum) {
        st.frameMs = sum.frameMs;
        st.ready =
          sum.samples >= 120 && st.recentDrops.length >= 60 && !st.recentDrops.includes(true) && sum.jitterMs < sum.frameMs * 0.2;
        setStats({ hz: sum.hz, snapped: sum.snappedHz, jitter: sum.jitterMs, dropped: st.dropped, ready: st.ready });
      }
    }
    if (!paused) st.frame += 1;

    const { width: W, height: H, dpr } = info;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, W, H);

    const cols = columnsFor(s.count);
    const rows = Math.ceil(s.count / cols);
    const gap = Math.max(2, Math.round(6 * dpr));
    const cell = Math.floor(Math.min((W * 0.9 - gap * (cols - 1)) / cols, (H * 0.7 - gap * (rows - 1)) / rows));
    const gridW = cols * cell + (cols - 1) * gap;
    const gridH = rows * cell + (rows - 1) * gap;
    const x0 = Math.floor((W - gridW) / 2);
    const y0 = Math.floor((H - gridH) / 2) + Math.round(20 * dpr);
    const lit = st.frame % s.count;

    ctx.font = `600 ${Math.max(9, Math.round(cell * 0.3))}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let i = 0; i < s.count; i += 1) {
      const x = x0 + (i % cols) * (cell + gap);
      const y = y0 + Math.floor(i / cols) * (cell + gap);
      const on = i === lit;
      ctx.fillStyle = on ? '#ffffff' : '#1c1c1c';
      ctx.fillRect(x, y, cell, cell);
      if (s.numbers) {
        ctx.fillStyle = on ? '#000000' : '#5a5a5a';
        ctx.fillText(String(i + 1), x + cell / 2, y + cell / 2);
      }
    }

    const statusY = y0 - Math.round(44 * dpr);
    ctx.font = `700 ${Math.round(Math.min(18 * dpr, W / 26))}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    ctx.fillStyle = paused ? '#94a3b8' : st.ready ? '#22c55e' : '#f59e0b';
    const status = paused
      ? 'Paused'
      : st.ready
        ? 'Ready — take the photo now (1/10 s or slower)'
        : 'Waiting for stable frame timing…';
    ctx.fillText(status, Math.round(W / 2), statusY);
    ctx.textAlign = 'start';
  };

  const step = (dir) =>
    setS((prev) => {
      const idx = COUNTS.indexOf(prev.count);
      return { ...prev, count: COUNTS[Math.min(COUNTS.length - 1, Math.max(0, idx + dir))] };
    });

  const resetDrops = () => {
    loop.current.dropped = 0;
    setStats((prev) => ({ ...prev, dropped: 0 }));
  };

  const reset = () => {
    setS(DEFAULTS);
    setPaused(false);
    resetDrops();
  };

  const exposureFrames = stats.snapped ? Math.round(stats.snapped / 10) : null;

  return (
    <TestShell
      title="Frame Skipping Test"
      description="One square lights per frame, in order. Photograph the grid with a slow shutter (1/10 s or longer). An unbroken run of lit squares means every frame reached the panel; gaps mean the monitor skipped frames."
      onReset={reset}
      shortcuts={[
        { key: ['ArrowUp', 'ArrowRight'], label: 'More squares', action: () => step(1) },
        { key: ['ArrowDown', 'ArrowLeft'], label: 'Fewer squares', action: () => step(-1) },
        { key: ' ', label: 'Pause / resume', action: () => setPaused((p) => !p) },
      ]}
      controls={
        <>
          <Section>
            <h3>Measured</h3>
            <Readout
              items={[
                ['Refresh rate', stats.hz ? `${stats.snapped} Hz (${stats.hz.toFixed(1)})` : 'Measuring…'],
                ['Frame-time jitter', stats.hz ? `${stats.jitter.toFixed(2)} ms` : '—'],
                ['Browser dropped frames', String(stats.dropped)],
                ['Status', paused ? 'Paused' : stats.ready ? 'Ready' : 'Stabilizing'],
              ]}
            />
            <ButtonRow style={{ marginTop: '0.6rem' }}>
              <Button type="button" onClick={() => setPaused((p) => !p)} $active={paused}>
                {paused ? 'Resume' : 'Pause'}
              </Button>
              <Button type="button" onClick={resetDrops}>
                Reset drop counter
              </Button>
            </ButtonRow>
            <Hint>
              The browser can only see its own dropped frames. Frames the monitor skips after they leave the GPU are
              invisible to software — that is what the photo reveals.
            </Hint>
          </Section>

          <Section>
            <h3>Grid</h3>
            <Segmented label="Squares" value={s.count} onChange={(count) => set({ count })} options={COUNTS} columns={5} />
            <Toggle label="Show square numbers" checked={s.numbers} onChange={(numbers) => set({ numbers })} />
          </Section>

          <Section>
            <h3>How to photograph</h3>
            <Hint style={{ marginTop: 0 }}>
              Use your phone’s Pro / manual mode (or a long-exposure app) at <strong>1/10 s</strong> or slower, low ISO,
              and keep it steady. Press <strong>H</strong> to hide this panel first.
              {exposureFrames ? ` At ${stats.snapped} Hz, 1/10 s should show about ${exposureFrames} consecutive lit squares.` : ''}
            </Hint>
          </Section>
        </>
      }
    >
      <PixelCanvas animate={animate} role="img" aria-label="Grid of squares lighting one per frame" />
    </TestShell>
  );
};

export default FrameSkippingTest;
