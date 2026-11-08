import { useCallback, useRef, useState } from 'react';
import TestShell, {
  Section,
  Segmented,
  Toggle,
  ColorSwatches,
  ColorInput,
  Readout,
  Button,
  ButtonRow,
  Hint,
} from '../../components/TestShell';
import PixelCanvas from '../../components/PixelCanvas';
import { summarizeIntervals } from '../../utils/frameTiming';

const PX_PER_FRAME = [4, 8, 12, 16, 24, 32];
const PX_PER_SEC = [480, 960, 1920, 3840];
const RATE_DIVISORS = [1, 2, 4, 8];
const RATE_NAMES = ['Full rate', '½ rate', '¼ rate', '⅛ rate'];
const BACKGROUNDS = { black: '#000000', gray: '#808080', white: '#ffffff' };
const OBJECT_COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Light gray', value: '#c0c0c0' },
  { name: 'Dark gray', value: '#404040' },
  { name: 'Red', value: '#ff0000' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Blue', value: '#0000ff' },
  { name: 'Yellow', value: '#ffff00' },
  { name: 'Cyan', value: '#00ffff' },
  { name: 'Magenta', value: '#ff00ff' },
];
const DROP_HISTORY = 120;

const DEFAULTS = {
  unit: 'frame',
  pxPerFrame: 8,
  pxPerSec: 960,
  background: 'gray',
  customBg: '#1e1e1e',
  objectColor: '#ffffff',
  object: 'ufo',
  lanes: 3,
  syncTrack: false,
  dropIndicator: true,
};

function isLight(hex) {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 140;
}

function makeSprite(kind, color, size) {
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d');
  if (kind === 'block') {
    const s = Math.max(4, Math.round(size * 0.55));
    c.width = s;
    c.height = s;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, s, s);
    return c;
  }
  if (kind === 'text') {
    const fontPx = Math.max(10, Math.round(size * 0.34));
    const font = `800 ${fontPx}px system-ui, -apple-system, "Segoe UI", sans-serif`;
    ctx.font = font;
    c.width = Math.ceil(ctx.measureText('MOTION').width) + 4;
    c.height = Math.round(fontPx * 1.3);
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';
    ctx.fillText('MOTION', 2, c.height / 2);
    return c;
  }
  const w = Math.max(16, Math.round(size));
  const h = Math.round(w * 0.6);
  c.width = w;
  c.height = h;
  ctx.fillStyle = '#9fdcff';
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.46, w * 0.2, h * 0.34, 0, Math.PI, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.58, w * 0.48, h * 0.2, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
  ctx.beginPath();
  ctx.ellipse(w / 2, h * 0.72, w * 0.26, h * 0.1, 0, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = '#ffd84a';
  for (let i = 0; i < 5; i += 1) {
    ctx.beginPath();
    ctx.arc(w * (0.2 + 0.15 * i), h * 0.58, Math.max(1.5, w * 0.032), 0, 2 * Math.PI);
    ctx.fill();
  }
  return c;
}

const fmtFps = (v) => (Math.abs(v - Math.round(v)) < 0.05 ? String(Math.round(v)) : v.toFixed(1));

const ResponseTimeTest = () => {
  const [s, setS] = useState(DEFAULTS);
  const [paused, setPaused] = useState(false);
  const [stats, setStats] = useState({ hz: 0, snapped: 0, dropped: 0 });
  const set = (patch) => setS((prev) => ({ ...prev, ...patch }));

  const loop = useRef({
    frame: 0,
    last: null,
    lastEmit: 0,
    intervals: [],
    frameMs: 0,
    hz: 60,
    snapped: 60,
    dropped: 0,
    history: [],
  });
  const sprite = useRef({ key: '', canvas: null });

  const hzForSpeed = stats.snapped || 60;
  const pxPerFrame = s.unit === 'frame' ? s.pxPerFrame : Math.max(1, Math.round(s.pxPerSec / hzForSpeed));
  const bg = s.background === 'custom' ? s.customBg : BACKGROUNDS[s.background];
  const fg = isLight(bg) ? '0, 0, 0' : '255, 255, 255';

  const resetDrops = useCallback(() => {
    loop.current.dropped = 0;
    loop.current.history = [];
    setStats((prev) => ({ ...prev, dropped: 0 }));
  }, []);

  const animate = (ctx, info, t) => {
    const st = loop.current;
    if (st.last !== null) {
      const dt = t - st.last;
      if (dt < 250) {
        st.intervals.push(dt);
        if (st.intervals.length > 240) st.intervals.shift();
        const drop = st.frameMs > 0 && dt > st.frameMs * 1.5;
        if (drop) st.dropped += 1;
        st.history.push(drop);
        if (st.history.length > DROP_HISTORY) st.history.shift();
      }
    }
    st.last = t;
    if (t - st.lastEmit >= 250) {
      st.lastEmit = t;
      const sum = summarizeIntervals(st.intervals);
      if (sum) {
        st.frameMs = sum.frameMs;
        st.hz = sum.hz;
        st.snapped = sum.snappedHz;
        setStats({ hz: sum.hz, snapped: sum.snappedHz, dropped: st.dropped });
      }
    }
    if (!paused) st.frame += 1;

    const { width: W, height: H, dpr } = info;
    const unit = Math.max(1, Math.round(dpr));
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const syncH = s.syncTrack ? Math.round(44 * dpr) : 0;
    const laneH = Math.floor(Math.min((H * 0.8 - syncH) / s.lanes, 220 * dpr));
    const totalH = laneH * s.lanes + syncH;
    let y = Math.floor((H - totalH) / 2);

    const spriteSize = Math.round(Math.min(laneH * 0.75, 140 * dpr));
    const key = `${s.object}|${s.objectColor}|${spriteSize}`;
    if (sprite.current.key !== key) sprite.current = { key, canvas: makeSprite(s.object, s.objectColor, spriteSize) };
    const img = sprite.current.canvas;
    const span = W + img.width;
    const v = pxPerFrame;

    ctx.textBaseline = 'top';
    ctx.font = `600 ${Math.round(12 * dpr)}px system-ui, -apple-system, "Segoe UI", sans-serif`;

    if (s.syncTrack) {
      const rowH = Math.round(10 * dpr);
      const block = Math.round(16 * dpr);
      const period = block * 2;
      const phase = (st.frame * v) % period;
      const row = st.frame % 2;
      ctx.fillStyle = `rgba(${fg}, 0.6)`;
      ctx.fillText('Sync track — rungs line up when your eye or camera tracks at the right speed', Math.round(12 * dpr), y);
      const rowY = y + Math.round(16 * dpr) + row * rowH;
      ctx.fillStyle = `rgb(${fg})`;
      for (let x = phase - period; x < W; x += period) ctx.fillRect(x, rowY, block, rowH);
      y += syncH;
    }

    for (let i = 0; i < s.lanes; i += 1) {
      const k = RATE_DIVISORS[i];
      ctx.fillStyle = `rgba(${fg}, 0.18)`;
      ctx.fillRect(0, y, W, unit);
      ctx.fillStyle = `rgba(${fg}, 0.7)`;
      ctx.fillText(
        `${RATE_NAMES[i]} · ${fmtFps(st.snapped / k)} fps · ${v * k} px per update`,
        Math.round(12 * dpr),
        y + Math.round(6 * dpr)
      );
      const step = Math.floor(st.frame / k) * k;
      const x = ((step * v) % span) - img.width;
      ctx.drawImage(img, x, y + Math.floor((laneH - img.height) / 2) + Math.round(8 * dpr));
      y += laneH;
    }
    ctx.fillStyle = `rgba(${fg}, 0.18)`;
    ctx.fillRect(0, y, W, unit);

    if (s.dropIndicator) {
      const gap = unit;
      const cell = Math.max(1, Math.min(Math.round(3 * dpr), Math.floor((W * 0.9) / DROP_HISTORY) - gap));
      const stripW = DROP_HISTORY * (cell + gap);
      const sx = Math.floor((W - stripW) / 2);
      const sy = Math.round(20 * dpr);
      const sh = Math.round(10 * dpr);
      const offset = DROP_HISTORY - st.history.length;
      for (let i = 0; i < st.history.length; i += 1) {
        ctx.fillStyle = st.history[i] ? '#ef4444' : `rgba(${fg}, 0.22)`;
        ctx.fillRect(sx + (offset + i) * (cell + gap), sy, cell, sh);
      }
      ctx.fillStyle = `rgba(${fg}, 0.7)`;
      ctx.textAlign = 'center';
      ctx.fillText(
        `${paused ? 'Paused · ' : ''}${st.dropped} dropped frame${st.dropped === 1 ? '' : 's'}`,
        Math.round(W / 2),
        sy + sh + Math.round(6 * dpr)
      );
      ctx.textAlign = 'start';
    }
  };

  const bump = (dir) =>
    setS((prev) => {
      const list = prev.unit === 'frame' ? PX_PER_FRAME : PX_PER_SEC;
      const field = prev.unit === 'frame' ? 'pxPerFrame' : 'pxPerSec';
      const idx = Math.max(0, list.indexOf(prev[field]));
      return { ...prev, [field]: list[Math.min(list.length - 1, Math.max(0, idx + dir))] };
    });

  const reset = () => {
    setS(DEFAULTS);
    setPaused(false);
    resetDrops();
  };

  const hz = stats.hz;

  return (
    <TestShell
      title="Motion Blur & Ghosting"
      description="Track the moving object with your eyes. Look for trails behind it (ghosting / smearing) and bright or dark outlines (overshoot). Compare the full-rate lane with the lower-rate lanes."
      onReset={reset}
      shortcuts={[
        { key: ['ArrowUp', 'ArrowRight'], label: 'Faster', action: () => bump(1) },
        { key: ['ArrowDown', 'ArrowLeft'], label: 'Slower', action: () => bump(-1) },
        { key: ' ', label: 'Pause / resume', action: () => setPaused((p) => !p) },
      ]}
      controls={
        <>
          <Section>
            <h3>Measured</h3>
            <Readout
              items={[
                ['Refresh rate', hz ? `${stats.snapped} Hz (${hz.toFixed(1)})` : 'Measuring…'],
                ['Speed per frame', `${pxPerFrame} px`],
                ['Speed per second', hz ? `${Math.round(pxPerFrame * hz)} px` : '—'],
                ['Dropped frames', String(stats.dropped)],
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
          </Section>

          <Section>
            <h3>Speed</h3>
            <Segmented
              label="Units"
              value={s.unit}
              onChange={(unit) => set({ unit })}
              options={[
                { value: 'frame', label: 'px / frame' },
                { value: 'sec', label: 'px / second' },
              ]}
            />
            {s.unit === 'frame' ? (
              <Segmented
                value={s.pxPerFrame}
                onChange={(pxPerFrame) => set({ pxPerFrame })}
                options={PX_PER_FRAME}
                columns={6}
              />
            ) : (
              <Segmented
                value={s.pxPerSec}
                onChange={(pxPerSec) => set({ pxPerSec })}
                options={PX_PER_SEC}
                columns={4}
              />
            )}
            <Hint>
              Speeds are in physical (device) pixels and stay a whole number of pixels per frame, so motion is perfectly
              even. px/second presets are rounded to the nearest px/frame at your measured refresh rate.
            </Hint>
          </Section>

          <Section>
            <h3>Scene</h3>
            <Segmented
              label="Object"
              value={s.object}
              onChange={(object) => set({ object })}
              options={[
                { value: 'ufo', label: 'UFO' },
                { value: 'block', label: 'Block' },
                { value: 'text', label: 'Text' },
              ]}
            />
            <Segmented
              label="Lanes"
              value={s.lanes}
              onChange={(lanes) => set({ lanes })}
              options={[
                { value: 1, label: '1', title: 'Full rate only' },
                { value: 2, label: '2', title: 'Full + ½ rate' },
                { value: 3, label: '3', title: 'Full + ½ + ¼ rate' },
                { value: 4, label: '4', title: 'Full + ½ + ¼ + ⅛ rate' },
              ]}
              columns={4}
            />
            <Toggle label="Pursuit camera sync track" checked={s.syncTrack} onChange={(syncTrack) => set({ syncTrack })} />
            <Toggle
              label="Dropped-frame indicator"
              checked={s.dropIndicator}
              onChange={(dropIndicator) => set({ dropIndicator })}
            />
          </Section>

          <Section>
            <h3>Background</h3>
            <Segmented
              value={s.background}
              onChange={(background) => set({ background })}
              options={[
                { value: 'black', label: 'Black' },
                { value: 'gray', label: 'Gray' },
                { value: 'white', label: 'White' },
                { value: 'custom', label: 'Custom' },
              ]}
              columns={4}
            />
            {s.background === 'custom' ? (
              <ColorInput label="Custom background" value={s.customBg} onChange={(customBg) => set({ customBg })} />
            ) : null}
          </Section>

          <Section>
            <h3>Object color</h3>
            <ColorSwatches colors={OBJECT_COLORS} value={s.objectColor} onChange={(objectColor) => set({ objectColor })} />
            <div style={{ marginTop: '0.6rem' }}>
              <ColorInput label="Custom color" value={s.objectColor} onChange={(objectColor) => set({ objectColor })} />
            </div>
            <Hint>
              Dark backgrounds reveal VA black smearing; mid-gray shows overdrive overshoot as bright or dark halos.
            </Hint>
          </Section>
        </>
      }
    >
      <PixelCanvas animate={animate} aria-label="Moving objects for motion blur and ghosting testing" role="img" />
    </TestShell>
  );
};

export default ResponseTimeTest;
