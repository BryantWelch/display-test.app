import { useCallback, useMemo, useState } from 'react';
import TestShell, {
  Section,
  Segmented,
  Slider,
  Select,
  Toggle,
  ColorInput,
  Readout,
  Hint,
} from '../../components/TestShell';
import { usePixelCanvas, SCALING_WARNING } from '../../components/PixelCanvas';

const PRESETS = [
  { value: 'gray', label: 'Gray', mask: [1, 1, 1] },
  { value: 'r', label: 'Red', mask: [1, 0, 0] },
  { value: 'g', label: 'Green', mask: [0, 1, 0] },
  { value: 'b', label: 'Blue', mask: [0, 0, 1] },
  { value: 'c', label: 'Cyan', mask: [0, 1, 1] },
  { value: 'm', label: 'Magenta', mask: [1, 0, 1] },
  { value: 'y', label: 'Yellow', mask: [1, 1, 0] },
  { value: 'all', label: 'Gray + RGB' },
  { value: 'custom', label: 'Custom' },
];
const PRESET_BY_VALUE = Object.fromEntries(PRESETS.map((p) => [p.value, p]));

const RANGES = {
  full: { label: 'Full 0–255', lo: 0, hi: 255 },
  dark: { label: 'Dark 0–64', lo: 0, hi: 64 },
  light: { label: 'Light 192–255', lo: 192, hi: 255 },
};

const RANGE_KEYS = [...Object.keys(RANGES), 'custom'];

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

/**
 * Bands for one strip from color A to B. Without stepping, there is one band per distinct code
 * value along the largest channel difference, so every level gets its own integer-wide band.
 */
function buildBands(a, b, steps, labelFrom) {
  const span = Math.max(...a.map((v, i) => Math.abs(b[i] - v)));
  const levels = span + 1;
  const count = steps > 1 && steps < levels ? steps : Math.max(levels, 2);
  return Array.from({ length: count }, (_, j) => {
    const t = count === 1 ? 0 : j / (count - 1);
    return {
      rgb: a.map((v, i) => Math.round(v + (b[i] - v) * t)),
      label: labelFrom ? Math.round(labelFrom[0] + (labelFrom[1] - labelFrom[0]) * t) : j,
    };
  });
}

const luminance = ([r, g, b]) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

const ColorGradientTest = () => {
  const [preset, setPreset] = useState('gray');
  const [range, setRange] = useState('full');
  const [customLo, setCustomLo] = useState(0);
  const [customHi, setCustomHi] = useState(255);
  const [fromColor, setFromColor] = useState('#000000');
  const [toColor, setToColor] = useState('#ff8800');
  const [direction, setDirection] = useState('horizontal');
  const [steps, setSteps] = useState(0);
  const [labels, setLabels] = useState(false);

  const [lo, hi] = range === 'custom' ? [Math.min(customLo, customHi), Math.max(customLo, customHi)] : [RANGES[range].lo, RANGES[range].hi];

  const strips = useMemo(() => {
    if (preset === 'custom') return [buildBands(hexToRgb(fromColor), hexToRgb(toColor), steps, null)];
    const masks = preset === 'all' ? ['gray', 'r', 'g', 'b'].map((k) => PRESET_BY_VALUE[k].mask) : [PRESET_BY_VALUE[preset].mask];
    return masks.map((m) =>
      buildBands(
        m.map((c) => c * lo),
        m.map((c) => c * hi),
        steps,
        [lo, hi]
      )
    );
  }, [preset, fromColor, toColor, steps, lo, hi]);

  const horizontal = direction === 'horizontal';

  const draw = useCallback(
    (ctx, { width, height, dpr }) => {
      const length = horizontal ? width : height;
      const cross = horizontal ? height : width;
      const line = document.createElement('canvas');
      line.width = horizontal ? length : 1;
      line.height = horizontal ? 1 : length;
      const lctx = line.getContext('2d');

      strips.forEach((bands, s) => {
        const n = bands.length;
        const img = lctx.createImageData(line.width, line.height);
        for (let p = 0; p < length; p += 1) {
          const { rgb } = bands[Math.min(n - 1, Math.floor((p * n) / length))];
          img.data[p * 4] = rgb[0];
          img.data[p * 4 + 1] = rgb[1];
          img.data[p * 4 + 2] = rgb[2];
          img.data[p * 4 + 3] = 255;
        }
        lctx.putImageData(img, 0, 0);
        const c0 = Math.floor((s * cross) / strips.length);
        const c1 = Math.floor(((s + 1) * cross) / strips.length);
        if (horizontal) ctx.drawImage(line, 0, 0, length, 1, 0, c0, length, c1 - c0);
        else ctx.drawImage(line, 0, 0, 1, length, c0, 0, c1 - c0, length);
      });

      if (!labels) return;
      const bands = strips[0];
      const n = bands.length;
      const bandPx = length / n;
      const every = [1, 2, 4, 8, 16, 32, 64, 128].find((k) => k * bandPx >= 44 * dpr) || 256;
      const tick = Math.round(12 * dpr);
      const fontPx = Math.round(11 * dpr);
      ctx.font = `600 ${fontPx}px ui-monospace, monospace`;
      ctx.textBaseline = 'top';
      ctx.textAlign = 'left';
      for (let j = 0; j < n; j += 1) {
        if (j % every !== 0 && j !== n - 1) continue;
        if (j === n - 1 && j % every !== 0 && (j % every) * bandPx < 30 * dpr) continue;
        const start = Math.ceil((j * length) / n);
        ctx.fillStyle = luminance(bands[j].rgb) > 110 ? '#000' : '#fff';
        const text = String(bands[j].label);
        if (horizontal) {
          ctx.fillRect(start, 0, 1, tick);
          ctx.fillText(text, Math.min(start + 3 * dpr, length - ctx.measureText(text).width - 2), tick - fontPx);
        } else {
          ctx.fillRect(0, start, tick, 1);
          ctx.fillText(text, tick + 3 * dpr, Math.min(start + 2 * dpr, length - fontPx - 2));
        }
      }
    },
    [strips, horizontal, labels]
  );

  const { canvasRef, info } = usePixelCanvas({ draw, deps: [draw] });

  const length = horizontal ? info.width : info.height;
  const bandCount = strips[0].length;
  const pxPerBand = length ? length / bandCount : 0;

  const cyclePreset = (dir) => {
    const i = PRESETS.findIndex((p) => p.value === preset);
    setPreset(PRESETS[(i + dir + PRESETS.length) % PRESETS.length].value);
  };
  const cycleRange = (dir) => {
    const keys = Object.keys(RANGES);
    const i = keys.indexOf(range);
    setRange(keys[(i + dir + keys.length) % keys.length]);
  };

  const handleReset = () => {
    setPreset('gray');
    setRange('full');
    setCustomLo(0);
    setCustomHi(255);
    setFromColor('#000000');
    setToColor('#ff8800');
    setDirection('horizontal');
    setSteps(0);
    setLabels(false);
  };

  return (
    <TestShell
      title="Gradient & Banding Test"
      description="Every code value in the ramp gets its own solid, pixel-exact band — no browser interpolation or dithering. On a good display the ramp looks smooth; visible stripes, jumps or color tints come from your display or graphics pipeline."
      onReset={handleReset}
      shortcuts={[
        { key: 'ArrowRight', label: 'Next color', action: () => cyclePreset(1) },
        { key: 'ArrowLeft', label: 'Previous color', action: () => cyclePreset(-1) },
        { key: 'ArrowUp', label: 'Next range', action: () => cycleRange(1) },
        { key: 'ArrowDown', label: 'Previous range', action: () => cycleRange(-1) },
        { key: 'd', label: 'Toggle direction', action: () => setDirection((d) => (d === 'horizontal' ? 'vertical' : 'horizontal')) },
        { key: 'l', label: 'Show / hide level labels', action: () => setLabels((v) => !v) },
      ]}
      controls={
        <>
          {!info.exact ? (
            <Hint role="alert" style={{ color: 'var(--warning)', marginTop: 0, marginBottom: '1rem' }}>
              {SCALING_WARNING}
            </Hint>
          ) : null}

          <Section>
            <h3>Color</h3>
            <Segmented value={preset} onChange={setPreset} columns={3} options={PRESETS.map(({ value, label }) => ({ value, label }))} />
            {preset === 'custom' ? (
              <>
                <ColorInput label="Start color" value={fromColor} onChange={setFromColor} />
                <ColorInput label="End color" value={toColor} onChange={setToColor} />
              </>
            ) : null}
          </Section>

          {preset !== 'custom' ? (
            <Section>
              <h3>Range</h3>
              <Segmented
                value={range}
                onChange={setRange}
                columns={2}
                options={RANGE_KEYS.map((k) => ({ value: k, label: k === 'custom' ? 'Custom' : RANGES[k].label }))}
              />
              {range === 'custom' ? (
                <>
                  <Slider label="Start level" value={customLo} min={0} max={255} onChange={setCustomLo} />
                  <Slider label="End level" value={customHi} min={0} max={255} onChange={setCustomHi} />
                </>
              ) : null}
              <Hint>Narrow ranges stretch a few levels across the whole screen, so each step is wide enough to judge.</Hint>
            </Section>
          ) : null}

          <Section>
            <h3>Layout</h3>
            <Segmented
              value={direction}
              onChange={setDirection}
              columns={2}
              options={[
                { value: 'horizontal', label: 'Horizontal' },
                { value: 'vertical', label: 'Vertical' },
              ]}
            />
            <Select
              label="Steps"
              value={String(steps)}
              onChange={(v) => setSteps(Number(v))}
              options={[
                { value: '0', label: 'Every level (smooth)' },
                ...[4, 8, 16, 32, 64, 128].map((n) => ({ value: String(n), label: `${n} steps` })),
              ]}
            />
            <Toggle label="Level labels and ticks (L)" checked={labels} onChange={setLabels} />
          </Section>

          <Section>
            <h3>Ramp</h3>
            <Readout
              items={[
                ['Levels shown', bandCount],
                ['Band width', pxPerBand ? `${pxPerBand.toFixed(1)} device px` : '—'],
              ]}
            />
            {pxPerBand && pxPerBand < 1 ? (
              <Hint style={{ color: 'var(--warning)' }}>
                The screen has fewer pixels than levels in this direction, so some levels are skipped. Try the other
                direction or a narrower range.
              </Hint>
            ) : null}
          </Section>
        </>
      }
    >
      <canvas
        ref={canvasRef}
        aria-label="Gradient ramp"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }}
      />
    </TestShell>
  );
};

export default ColorGradientTest;
