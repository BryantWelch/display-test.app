import { useCallback, useEffect, useRef, useState } from 'react';
import TestShell, {
  Section,
  Segmented,
  Slider,
  Toggle,
  Readout,
  Button,
  ButtonRow,
  Hint,
} from '../../components/TestShell';
import { formatTime, useWakeLock } from '../../hooks/useWakeLock';
import { usePixelCanvas } from '../../components/PixelCanvas';

const NOISE = [
  { value: 'pixel', label: 'Per-pixel', title: 'Every device pixel gets a random color each frame' },
  { value: 'block', label: 'Blocks', title: 'Random 4×4 blocks' },
  { value: 'cycle', label: 'Solid cycle', title: 'Whole square cycles red, green, blue, white, black' },
];

const RATES = [
  { value: 0, label: 'Every frame' },
  { value: 30, label: '30 / s' },
  { value: 10, label: '10 / s' },
];

const MINUTES = [5, 10, 20, 30, 60].map((m) => ({ value: m, label: `${m}` }));

// RGBA bytes packed little-endian into Uint32: red, green, blue, white, black.
const PALETTE = new Uint32Array([0xff0000ff, 0xff00ff00, 0xffff0000, 0xffffffff, 0xff000000]);
const CYCLE_CSS = ['#ff0000', '#00ff00', '#0000ff', '#ffffff', '#000000'];
const TILE = 256;
const MIN_SIZE = 24;
const MAX_SIZE = 800;

const WAKE_LABELS = {
  off: 'Starts with the timer',
  on: 'On — screen stays awake',
  released: 'Released — keep the tab visible',
  denied: 'Blocked — disable sleep manually',
  unsupported: 'Not supported — disable sleep manually',
};

const viewport = () =>
  typeof window === 'undefined' ? { w: 1280, h: 720 } : { w: window.innerWidth, h: window.innerHeight };

const clampPos = (pos, size) => {
  const { w, h } = viewport();
  return {
    x: Math.round(Math.min(Math.max(0, pos.x), Math.max(0, w - size))),
    y: Math.round(Math.min(Math.max(0, pos.y), Math.max(0, h - size))),
  };
};

const DEFAULTS = { size: 120, noise: 'pixel', rate: 0, minutes: 10, full: false };

const centered = (size) => {
  const { w, h } = viewport();
  return clampPos({ x: w / 2 - size / 2, y: h / 2 - size / 2 }, size);
};

const StuckPixelFixerTest = () => {
  const [size, setSize] = useState(DEFAULTS.size);
  const [pos, setPos] = useState(() => centered(DEFAULTS.size));
  const [noise, setNoise] = useState(DEFAULTS.noise);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [minutes, setMinutes] = useState(DEFAULTS.minutes);
  const [full, setFull] = useState(DEFAULTS.full);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [endAt, setEndAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const wake = useWakeLock(running);
  const drag = useRef(null);
  const frame = useRef({ last: 0, index: 0, tile: null, small: null });

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (t >= endAt) {
        setRunning(false);
        setFinished(true);
      }
    }, 500);
    return () => clearInterval(id);
  }, [running, endAt]);

  useEffect(() => {
    const onResize = () => setPos((p) => clampPos(p, size));
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [size]);

  const settings = useRef(null);
  settings.current = { noise, rate };

  const fillTile = (dpr) => {
    const f = frame.current;
    if (!f.tile) {
      f.tile = document.createElement('canvas');
      f.tile.width = TILE;
      f.tile.height = TILE;
      f.small = document.createElement('canvas');
    }
    const block = settings.current.noise === 'block' ? Math.max(2, Math.round(4 * dpr)) : 1;
    const cells = Math.ceil(TILE / block);
    const target = block === 1 ? f.tile : f.small;
    if (target.width !== cells) {
      target.width = cells;
      target.height = cells;
    }
    const tctx = target.getContext('2d');
    const img = tctx.createImageData(cells, cells);
    const px = new Uint32Array(img.data.buffer);
    for (let i = 0; i < px.length; i += 1) px[i] = PALETTE[(Math.random() * 5) | 0];
    tctx.putImageData(img, 0, 0);
    if (block > 1) {
      const ctx = f.tile.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(f.small, 0, 0, cells * block, cells * block);
    }
    return f.tile;
  };

  const animate = (ctx, { width, height, dpr }, t) => {
    const f = frame.current;
    const { noise: mode, rate: hz } = settings.current;
    if (hz && t - f.last < 1000 / hz - 2) return;
    f.last = t;
    if (mode === 'cycle') {
      f.index = (f.index + 1) % CYCLE_CSS.length;
      ctx.fillStyle = CYCLE_CSS[f.index];
      ctx.fillRect(0, 0, width, height);
      return;
    }
    const tile = fillTile(dpr);
    for (let y = 0; y < height; y += TILE) {
      for (let x = 0; x < width; x += TILE) ctx.drawImage(tile, x, y);
    }
  };

  const draw = (ctx, { width, height }) => {
    if (running) return;
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, 0, width, height);
  };

  const { canvasRef, info } = usePixelCanvas({ draw, animate: running ? animate : undefined, deps: [running] });

  const start = useCallback(() => {
    const t = Date.now();
    setNow(t);
    setEndAt(t + minutes * 60_000);
    setFinished(false);
    setRunning(true);
  }, [minutes]);

  const stop = useCallback(() => setRunning(false), []);

  const resize = useCallback(
    (next) => {
      const s = Math.round(Math.min(MAX_SIZE, Math.max(MIN_SIZE, next)));
      setSize(s);
      setPos((p) => clampPos({ x: p.x + (size - s) / 2, y: p.y + (size - s) / 2 }, s));
    },
    [size]
  );

  const nudge = (dx, dy) => (e) => {
    const step = e?.shiftKey ? 10 : 1;
    setPos((p) => clampPos({ x: p.x + dx * step, y: p.y + dy * step }, size));
  };

  const onPointerDown = (e) => {
    if (full) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      kind: e.target.dataset.handle ? 'resize' : 'move',
      x: e.clientX,
      y: e.clientY,
      pos,
      size,
    };
  };

  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (d.kind === 'move') {
      setPos(clampPos({ x: d.pos.x + dx, y: d.pos.y + dy }, size));
    } else {
      const s = Math.round(Math.min(MAX_SIZE, Math.max(MIN_SIZE, d.size + Math.max(dx, dy))));
      setSize(s);
      setPos(clampPos(d.pos, s));
    }
  };

  const endDrag = () => {
    drag.current = null;
  };

  const handleReset = () => {
    setRunning(false);
    setFinished(false);
    setSize(DEFAULTS.size);
    setPos(centered(DEFAULTS.size));
    setNoise(DEFAULTS.noise);
    setRate(DEFAULTS.rate);
    setMinutes(DEFAULTS.minutes);
    setFull(DEFAULTS.full);
  };

  const shortcuts = [
    { key: ' ', label: 'Start / stop', action: () => (running ? stop() : start()) },
    { key: 'ArrowLeft', label: 'Move left (Shift = 10 px)', action: nudge(-1, 0) },
    { key: 'ArrowRight', label: 'Move right (Shift = 10 px)', action: nudge(1, 0) },
    { key: 'ArrowUp', label: 'Move up (Shift = 10 px)', action: nudge(0, -1) },
    { key: 'ArrowDown', label: 'Move down (Shift = 10 px)', action: nudge(0, 1) },
    { key: ['+', '='], label: 'Bigger square', action: () => resize(size + 20) },
    { key: ['-', '_'], label: 'Smaller square', action: () => resize(size - 20) },
    { key: 'f', label: 'Full-screen flashing on / off', action: () => setFull((v) => !v) },
  ];

  const boxStyle = full
    ? { position: 'absolute', inset: 0 }
    : {
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        width: size,
        height: size,
        cursor: 'move',
        outline: running ? 'none' : '1px dashed rgba(255, 255, 255, 0.6)',
        outlineOffset: 2,
      };

  return (
    <TestShell
      title="Stuck Pixel Fixer"
      description="Drag the flashing square over the stuck pixel (or use the arrow keys), then start the timer. Works sometimes on stuck pixels; it cannot revive dead (always-black) pixels."
      onReset={handleReset}
      shortcuts={shortcuts}
      hideCursor={false}
      controls={
        <>
          <Section>
            <h3>Run</h3>
            <Segmented label="Timer (minutes)" options={MINUTES} value={minutes} onChange={setMinutes} columns={5} />
            <ButtonRow style={{ marginBottom: '0.75rem' }}>
              {running ? (
                <Button type="button" onClick={stop}>
                  Stop
                </Button>
              ) : (
                <Button type="button" $variant="primary" onClick={start}>
                  {finished ? 'Run again' : 'Start flashing'}
                </Button>
              )}
            </ButtonRow>
            <Readout
              items={[
                ['Status', running ? 'Flashing' : finished ? 'Finished' : 'Stopped'],
                ['Time left', running ? formatTime(endAt - now) : `${minutes}:00`],
                ['Screen wake lock', WAKE_LABELS[wake] || WAKE_LABELS.off],
              ]}
            />
            {finished ? (
              <Hint>
                Done. Close this and check the spot with the dead pixel test on black, white, and the color it was
                stuck on. If it’s improved but not gone, one or two more runs are reasonable.
              </Hint>
            ) : null}
          </Section>

          <Section>
            <h3>Square</h3>
            <Toggle label="Flash the whole screen" checked={full} onChange={setFull} />
            {!full ? (
              <Slider
                label="Size"
                value={size}
                min={MIN_SIZE}
                max={MAX_SIZE}
                step={4}
                onChange={resize}
                format={(v) => `${v} × ${v} px`}
              />
            ) : null}
            <Hint>
              {full
                ? 'Full-screen is useful when you can’t find the exact spot, but it’s far more intense. Look away while it runs.'
                : 'Drag to move, drag the corner to resize, or use arrow keys (Shift for 10 px). Make it a bit bigger than the defect.'}
            </Hint>
          </Section>

          <Section>
            <h3>Pattern</h3>
            <Segmented label="Noise" options={NOISE} value={noise} onChange={setNoise} columns={3} />
            <Segmented label="Change rate" options={RATES} value={rate} onChange={setRate} columns={3} />
            <Readout
              items={[
                ['Area (device px)', `${info.width} × ${info.height}`],
                ['Position (CSS px)', full ? 'Full screen' : `${pos.x}, ${pos.y}`],
              ]}
            />
          </Section>
        </>
      }
    >
      <div
        style={{ ...boxStyle, touchAction: 'none' }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        role="application"
        aria-label="Flashing square. Drag to move, or use the arrow keys."
      >
        <canvas
          ref={canvasRef}
          style={{ display: 'block', width: '100%', height: '100%', imageRendering: 'pixelated' }}
        />
        {!full && !running ? (
          <div
            data-handle="resize"
            title="Drag to resize"
            style={{
              position: 'absolute',
              right: -8,
              bottom: -8,
              width: 22,
              height: 22,
              borderRadius: 4,
              background: 'rgba(255, 255, 255, 0.85)',
              cursor: 'nwse-resize',
            }}
          />
        ) : null}
      </div>
    </TestShell>
  );
};

export default StuckPixelFixerTest;
