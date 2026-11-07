import { useCallback, useState } from 'react';
import TestShell, { Section, Segmented, Slider, Readout, Hint } from '../../components/TestShell';
import { usePixelCanvas } from '../../components/PixelCanvas';

const SIZES = [1, 2, 5, 10, 25, 50, 100];
const SHAPES = [
  { value: 'square', label: 'Square' },
  { value: 'rect', label: 'Screen-shaped', title: 'Rectangle with the same aspect ratio as the screen' },
  { value: 'circle', label: 'Circle' },
];
const POSITIONS = [
  { value: 'center', label: 'Center' },
  { value: 'tl', label: 'Top left' },
  { value: 'tr', label: 'Top right' },
  { value: 'bl', label: 'Bottom left' },
  { value: 'br', label: 'Bottom right' },
];
const DEFAULTS = { size: 10, level: 100, background: 0, shape: 'square', position: 'center' };

const code = (pct) => Math.round((255 * pct) / 100);
const gray = (pct) => {
  const v = code(pct);
  return `rgb(${v}, ${v}, ${v})`;
};

/** Window rectangle (and circle radius) in device pixels for a target share of screen area. */
function windowGeometry(width, height, sizePct, shape, position) {
  const total = width * height;
  const target = (total * sizePct) / 100;
  const short = Math.min(width, height);
  let w;
  let h;
  let area;
  if (sizePct >= 100) {
    w = width;
    h = height;
    area = total;
  } else if (shape === 'circle') {
    const r = Math.min(Math.sqrt(target / Math.PI), short / 2);
    w = Math.round(r * 2);
    h = w;
    area = Math.PI * r * r;
  } else if (shape === 'rect') {
    const k = Math.sqrt(sizePct / 100);
    w = Math.round(width * k);
    h = Math.round(height * k);
    area = w * h;
  } else {
    const side = Math.sqrt(target);
    if (side <= short) {
      w = Math.round(side);
      h = w;
    } else {
      // Too big for a square: keep the short dimension full and extend the long one.
      w = width >= height ? Math.round(target / height) : width;
      h = width >= height ? height : Math.round(target / width);
    }
    area = w * h;
  }

  const inset = sizePct >= 100 ? 0 : Math.round(short * 0.03);
  const left = position === 'tl' || position === 'bl';
  const right = position === 'tr' || position === 'br';
  const top = position === 'tl' || position === 'tr';
  const bottom = position === 'bl' || position === 'br';
  const x = left ? inset : right ? width - w - inset : Math.round((width - w) / 2);
  const y = top ? inset : bottom ? height - h - inset : Math.round((height - h) / 2);
  return { x: Math.max(0, x), y: Math.max(0, y), w, h, areaPct: (area / total) * 100 };
}

const BrightnessTest = () => {
  const [size, setSize] = useState(DEFAULTS.size);
  const [level, setLevel] = useState(DEFAULTS.level);
  const [background, setBackground] = useState(DEFAULTS.background);
  const [shape, setShape] = useState(DEFAULTS.shape);
  const [position, setPosition] = useState(DEFAULTS.position);

  const draw = useCallback(
    (ctx, { width, height }) => {
      ctx.fillStyle = gray(background);
      ctx.fillRect(0, 0, width, height);
      const g = windowGeometry(width, height, size, shape, position);
      ctx.fillStyle = gray(level);
      if (shape === 'circle' && size < 100) {
        ctx.beginPath();
        ctx.arc(g.x + g.w / 2, g.y + g.h / 2, g.w / 2, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillRect(g.x, g.y, g.w, g.h);
      }
    },
    [size, level, background, shape, position]
  );

  const { canvasRef, info } = usePixelCanvas({ draw, deps: [draw] });

  const geometry = info.width ? windowGeometry(info.width, info.height, size, shape, position) : null;
  const areaPct = geometry ? geometry.areaPct : size;
  const apl = (areaPct * code(level) + (100 - areaPct) * code(background)) / 255;

  const stepSize = (dir) => {
    const i = SIZES.indexOf(size);
    const next = i === -1 ? SIZES.findIndex((s) => s > size) : i + dir;
    setSize(SIZES[Math.min(SIZES.length - 1, Math.max(0, next))]);
  };
  const cycle = (list, value, set) => {
    const i = list.findIndex((o) => o.value === value);
    set(list[(i + 1) % list.length].value);
  };

  const handleReset = () => {
    setSize(DEFAULTS.size);
    setLevel(DEFAULTS.level);
    setBackground(DEFAULTS.background);
    setShape(DEFAULTS.shape);
    setPosition(DEFAULTS.position);
  };

  return (
    <TestShell
      title="White Window Test"
      description="A white window covering a set share of the screen, on black. Change the window size and watch how brightness behaves: OLEDs dim large windows (ABL), Mini-LEDs bloom around small ones. Brightness in nits needs a meter — this shows the behavior, not the number."
      onReset={handleReset}
      shortcuts={[
        { key: 'ArrowUp', label: 'Larger window', action: () => stepSize(1) },
        { key: 'ArrowDown', label: 'Smaller window', action: () => stepSize(-1) },
        { key: 'ArrowRight', label: 'Brighter window (+5%)', action: () => setLevel((v) => Math.min(100, v + 5)) },
        { key: 'ArrowLeft', label: 'Dimmer window (−5%)', action: () => setLevel((v) => Math.max(0, v - 5)) },
        { key: 's', label: 'Next shape', action: () => cycle(SHAPES, shape, setShape) },
        { key: 'p', label: 'Next position', action: () => cycle(POSITIONS, position, setPosition) },
      ]}
      controls={
        <>
          <Section>
            <h3>Window size (share of screen area)</h3>
            <Segmented
              value={size}
              onChange={setSize}
              columns={4}
              options={SIZES.map((s) => ({ value: s, label: `${s}%` }))}
            />
            <Hint>HDR peak brightness is usually quoted for a 10% window; full-screen (100%) brightness is often much lower.</Hint>
          </Section>

          <Section>
            <h3>Window level</h3>
            <Segmented
              value={level}
              onChange={setLevel}
              columns={5}
              options={[100, 75, 50, 25, 10].map((v) => ({ value: v, label: `${v}%` }))}
            />
            <Slider label="Signal level" value={level} min={0} max={100} onChange={setLevel} format={(v) => `${v}% (${code(v)})`} />
          </Section>

          <Section>
            <h3>Background level</h3>
            <Segmented
              value={background}
              onChange={setBackground}
              columns={4}
              options={[0, 5, 10, 25].map((v) => ({ value: v, label: `${v}%` }))}
            />
            <Slider label="Signal level" value={background} min={0} max={100} onChange={setBackground} format={(v) => `${v}% (${code(v)})`} />
          </Section>

          <Section>
            <h3>Shape and position</h3>
            <Segmented value={shape} onChange={setShape} columns={3} options={SHAPES} />
            <Segmented value={position} onChange={setPosition} columns={3} options={POSITIONS} />
          </Section>

          <Section>
            <h3>Readout</h3>
            <Readout
              items={[
                ['Window area', `${areaPct < 10 ? areaPct.toFixed(1) : Math.round(areaPct)}% of screen`],
                ['Average picture level', `${apl < 10 ? apl.toFixed(1) : Math.round(apl)}%`],
                ['Window size', geometry ? `${geometry.w} × ${geometry.h} px` : '—'],
              ]}
            />
            {geometry && Math.abs(geometry.areaPct - size) > 0.5 ? (
              <Hint>This shape can&apos;t reach {size}% on this screen, so the readout shows the actual area.</Hint>
            ) : null}
            <Hint>
              Levels are signal values, not light: at gamma 2.2 a 50% signal produces only about 22% of full brightness.
            </Hint>
          </Section>
        </>
      }
    >
      <canvas
        ref={canvasRef}
        aria-label="White window pattern"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block' }}
      />
    </TestShell>
  );
};

export default BrightnessTest;
