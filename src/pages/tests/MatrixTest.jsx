import { useRef, useState } from 'react';
import TestShell, {
  Section,
  Segmented,
  Slider,
  Toggle,
  ColorSwatches,
  ColorInput,
  Hint,
} from '../../components/TestShell';
import { usePixelCanvas } from '../../components/PixelCanvas';

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => String.fromCharCode(from + i)).join('');

const CHARSETS = {
  katakana: { label: 'Katakana', chars: range(0xff66, 0xff9d) + '0123456789' },
  latin: { label: 'Latin', chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+=<>' },
  hex: { label: 'Hex', chars: '0123456789ABCDEF' },
  binary: { label: 'Binary', chars: '01' },
};

const TEXT_COLORS = [
  { name: 'Matrix green', value: '#00ff41' },
  { name: 'Cyan', value: '#00e5ff' },
  { name: 'Amber', value: '#ffb000' },
  { name: 'Magenta', value: '#ff2bd6' },
  { name: 'Red pill', value: '#ff2a2a' },
  { name: 'Blue pill', value: '#3d7bff' },
  { name: 'White', value: '#e8e8e8' },
];

const BG_COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'Charcoal', value: '#141414' },
  { name: 'Deep green', value: '#001a08' },
  { name: 'Navy', value: '#000a1f' },
];

const TRAILS = { short: 250, medium: 550, long: 1100 };

const DEFAULTS = {
  color: '#00ff41',
  bg: '#000000',
  size: 22,
  speed: 50,
  density: 70,
  trail: 'medium',
  charset: 'katakana',
  heads: true,
};

const FADE_INTERVAL = 1000 / 30;
const MAX_DT = 100;

const MatrixTest = () => {
  const [color, setColor] = useState(DEFAULTS.color);
  const [bg, setBg] = useState(DEFAULTS.bg);
  const [size, setSize] = useState(DEFAULTS.size);
  const [speed, setSpeed] = useState(DEFAULTS.speed);
  const [density, setDensity] = useState(DEFAULTS.density);
  const [trail, setTrail] = useState(DEFAULTS.trail);
  const [charset, setCharset] = useState(DEFAULTS.charset);
  const [heads, setHeads] = useState(DEFAULTS.heads);
  const [paused, setPaused] = useState(false);
  const sim = useRef(null);

  const animate = (ctx, { width, height, dpr }, t) => {
    const cellH = Math.max(6, Math.round(size * dpr));
    const cellW = Math.max(4, Math.round(cellH * 0.8));
    const chars = CHARSETS[charset].chars;
    const key = `${width}x${height}:${cellH}:${charset}`;
    let s = sim.current;

    if (!s || s.key !== key) {
      const cols = Math.ceil(width / cellW);
      const rows = Math.ceil(height / cellH);
      s = sim.current = {
        key,
        cols,
        rows,
        last: t,
        fadeAcc: 0,
        y: Array.from({ length: cols }, () => -Math.random() * rows),
        speedMul: Array.from({ length: cols }, () => 0.6 + Math.random() * 0.8),
        prevRow: new Array(cols).fill(-1),
        prevChar: new Array(cols).fill(''),
      };
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);
    }

    const dt = Math.min(MAX_DT, Math.max(0, t - s.last));
    s.last = t;
    if (paused) return;

    s.fadeAcc += dt;
    if (s.fadeAcc >= FADE_INTERVAL) {
      const alpha = 1 - Math.exp(-s.fadeAcc / TRAILS[trail]);
      ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`;
      ctx.fillRect(0, 0, width, height);
      // 8-bit alpha blending stalls a few levels above black; color-burn floors that residue to 0.
      ctx.globalCompositeOperation = 'color-burn';
      ctx.fillStyle = 'rgb(246, 246, 246)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'source-over';
      s.fadeAcc = 0;
    }

    const rowsPerSec = 6 + speed * 0.5;
    const restartSpread = s.rows * (0.1 + (1 - density / 100) * 2.5);
    ctx.font = `${cellH}px "MS Gothic", "Yu Gothic", "Hiragino Kaku Gothic ProN", "Noto Sans Mono CJK JP", monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'top';

    for (let i = 0; i < s.cols; i++) {
      s.y[i] += rowsPerSec * s.speedMul[i] * (dt / 1000);
      const row = Math.floor(s.y[i]);
      if (row <= s.prevRow[i]) continue;
      const x = i * cellW + cellW / 2;

      for (let r = s.prevRow[i] + 1; r <= row; r++) {
        if (r < 0) continue;
        if (heads && s.prevChar[i] && s.prevRow[i] >= 0 && r === s.prevRow[i] + 1) {
          ctx.fillStyle = '#000';
          ctx.fillRect(i * cellW, s.prevRow[i] * cellH, cellW, cellH);
          ctx.fillStyle = color;
          ctx.fillText(s.prevChar[i], x, s.prevRow[i] * cellH);
        }
        if (r >= s.rows) {
          s.prevChar[i] = '';
          s.prevRow[i] = r;
          continue;
        }
        const ch = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillStyle = heads && r === row ? '#f0fff4' : color;
        ctx.fillText(ch, x, r * cellH);
        s.prevChar[i] = ch;
        s.prevRow[i] = r;
      }

      if (row >= s.rows + 4) {
        s.y[i] = -Math.random() * restartSpread;
        s.speedMul[i] = 0.6 + Math.random() * 0.8;
        s.prevRow[i] = Math.floor(s.y[i]);
        s.prevChar[i] = '';
      } else {
        s.prevRow[i] = Math.max(s.prevRow[i], row);
      }
    }
  };

  const { canvasRef } = usePixelCanvas({ animate });

  const handleReset = () => {
    setColor(DEFAULTS.color);
    setBg(DEFAULTS.bg);
    setSize(DEFAULTS.size);
    setSpeed(DEFAULTS.speed);
    setDensity(DEFAULTS.density);
    setTrail(DEFAULTS.trail);
    setCharset(DEFAULTS.charset);
    setHeads(DEFAULTS.heads);
    setPaused(false);
  };

  const shortcuts = [
    { key: ' ', label: 'Pause / resume', action: () => setPaused((p) => !p) },
    { key: 'ArrowUp', label: 'Faster', action: () => setSpeed((v) => Math.min(100, v + 5)) },
    { key: 'ArrowDown', label: 'Slower', action: () => setSpeed((v) => Math.max(1, v - 5)) },
    {
      key: 'c',
      label: 'Next color',
      action: () => {
        const i = TEXT_COLORS.findIndex((c) => c.value === color);
        setColor(TEXT_COLORS[(i + 1) % TEXT_COLORS.length].value);
      },
    },
  ];

  return (
    <TestShell
      title="Matrix Digital Rain"
      description="Just for fun. Wake up, Neo… then dim the lights — on an OLED, the background between the streams should be truly black."
      onReset={handleReset}
      shortcuts={shortcuts}
      style={{ background: bg }}
      controls={
        <>
          <Section>
            <h3>Rain color</h3>
            <ColorSwatches colors={TEXT_COLORS} value={color} onChange={setColor} columns={7} />
            <div style={{ marginTop: '0.6rem' }}>
              <ColorInput label="Custom" value={color} onChange={setColor} />
            </div>
          </Section>

          <Section>
            <h3>Background</h3>
            <ColorSwatches colors={BG_COLORS} value={bg} onChange={setBg} columns={4} />
          </Section>

          <Section>
            <h3>Motion</h3>
            <Slider label="Speed" value={speed} min={1} max={100} onChange={setSpeed} format={(v) => `${v}%`} />
            <Slider label="Density" value={density} min={10} max={100} onChange={setDensity} format={(v) => `${v}%`} />
            <Segmented
              label="Trail length"
              options={[
                { value: 'short', label: 'Short' },
                { value: 'medium', label: 'Medium' },
                { value: 'long', label: 'Long' },
              ]}
              value={trail}
              onChange={setTrail}
              columns={3}
            />
          </Section>

          <Section>
            <h3>Characters</h3>
            <Slider label="Size" value={size} min={10} max={60} onChange={setSize} format={(v) => `${v}px`} />
            <Segmented
              options={Object.entries(CHARSETS).map(([value, c]) => ({ value, label: c.label }))}
              value={charset}
              onChange={setCharset}
              columns={4}
            />
            <Toggle label="Bright leading characters" checked={heads} onChange={setHeads} />
            <Hint>Press Space to pause. Speed is frame-rate independent, so it looks the same at 60 Hz or 240 Hz.</Hint>
          </Section>
        </>
      }
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          display: 'block',
          mixBlendMode: 'lighten',
        }}
      />
    </TestShell>
  );
};

export default MatrixTest;
