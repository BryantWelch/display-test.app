import { useCallback, useState } from 'react';
import TestShell, { Section, Segmented, Slider, Toggle, Hint } from '../../components/TestShell';
import PixelCanvas from '../../components/PixelCanvas';

const MODES = [
  { value: 'checker', label: 'Checkerboard' },
  { value: 'ansi', label: 'ANSI 4×4' },
  { value: 'box', label: 'White box' },
  { value: 'inverse', label: 'Black box' },
];

const GRID_PRESETS = [2, 4, 8, 16];
const DEFAULTS = { mode: 'checker', grid: 8, square: false, invert: false, boxArea: 10 };

const ContrastTest = () => {
  const [mode, setMode] = useState(DEFAULTS.mode);
  const [grid, setGrid] = useState(DEFAULTS.grid);
  const [square, setSquare] = useState(DEFAULTS.square);
  const [invert, setInvert] = useState(DEFAULTS.invert);
  const [boxArea, setBoxArea] = useState(DEFAULTS.boxArea);

  const isChecker = mode === 'checker' || mode === 'ansi';

  const draw = useCallback(
    (ctx, { width, height }) => {
      if (isChecker) {
        const cols = mode === 'ansi' ? 4 : grid;
        const rows = mode === 'ansi' || !square ? cols : Math.max(1, Math.round((cols * height) / width));
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#fff';
        for (let r = 0; r < rows; r += 1) {
          const y0 = Math.round((r * height) / rows);
          const y1 = Math.round(((r + 1) * height) / rows);
          for (let c = 0; c < cols; c += 1) {
            if ((r + c + (invert ? 1 : 0)) % 2 === 0) continue;
            const x0 = Math.round((c * width) / cols);
            const x1 = Math.round(((c + 1) * width) / cols);
            ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
          }
        }
        return;
      }
      const white = mode === 'box';
      ctx.fillStyle = white ? '#000' : '#fff';
      ctx.fillRect(0, 0, width, height);
      // Box keeps the screen's aspect ratio so its area is exactly boxArea % of the screen.
      const k = Math.sqrt(boxArea / 100);
      const w = Math.round(width * k);
      const h = Math.round(height * k);
      ctx.fillStyle = white ? '#fff' : '#000';
      ctx.fillRect(Math.round((width - w) / 2), Math.round((height - h) / 2), w, h);
    },
    [isChecker, mode, grid, square, invert, boxArea]
  );

  const cycleMode = (dir) => {
    const i = MODES.findIndex((m) => m.value === mode);
    setMode(MODES[(i + dir + MODES.length) % MODES.length].value);
  };

  const handleReset = () => {
    setMode(DEFAULTS.mode);
    setGrid(DEFAULTS.grid);
    setSquare(DEFAULTS.square);
    setInvert(DEFAULTS.invert);
    setBoxArea(DEFAULTS.boxArea);
  };

  return (
    <TestShell
      title="Checkerboard Contrast Test"
      description="Pure black and pure white side by side. A browser can't measure contrast ratio, but these patterns make black depth, backlight glow, blooming and flare easy to judge by eye — best in a dark room."
      onReset={handleReset}
      shortcuts={[
        { key: 'ArrowRight', label: 'Next pattern', action: () => cycleMode(1) },
        { key: 'ArrowLeft', label: 'Previous pattern', action: () => cycleMode(-1) },
        {
          key: 'ArrowUp',
          label: 'More squares / bigger box',
          action: () => (mode === 'checker' ? setGrid((g) => Math.min(64, g + 1)) : setBoxArea((a) => Math.min(50, a + 1))),
        },
        {
          key: 'ArrowDown',
          label: 'Fewer squares / smaller box',
          action: () => (mode === 'checker' ? setGrid((g) => Math.max(2, g - 1)) : setBoxArea((a) => Math.max(1, a - 1))),
        },
        { key: 'i', label: 'Swap black and white squares', action: () => setInvert((v) => !v) },
      ]}
      controls={
        <>
          <Section>
            <h3>Pattern</h3>
            <Segmented value={mode} onChange={setMode} columns={2} options={MODES} />
          </Section>

          {mode === 'checker' ? (
            <Section>
              <h3>Grid</h3>
              <Segmented
                value={grid}
                onChange={setGrid}
                columns={4}
                options={GRID_PRESETS.map((n) => ({ value: n, label: `${n}×${n}` }))}
              />
              <Slider label="Columns" value={grid} min={2} max={64} onChange={setGrid} />
              <Toggle label="Square cells" checked={square} onChange={setSquare} />
            </Section>
          ) : null}

          {isChecker ? (
            <Section>
              <Toggle label="Swap black and white (I)" checked={invert} onChange={setInvert} />
              {mode === 'ansi' ? (
                <Hint>
                  The ANSI pattern is what reviewers measure with a meter: average the white squares, average the black
                  ones. Here you can judge by eye how much the white squares lift the black ones.
                </Hint>
              ) : null}
            </Section>
          ) : (
            <Section>
              <h3>Box size</h3>
              <Slider
                label="Area of screen"
                value={boxArea}
                min={1}
                max={50}
                onChange={setBoxArea}
                format={(v) => `${v}%`}
              />
              <Hint>
                {mode === 'box'
                  ? 'Look at the black around the box: halos (blooming), a gray glow, or brighter corners show how well the display keeps black next to white.'
                  : 'The black box shows how deep black gets when the rest of the screen is bright — panel glow and screen reflections both lift it.'}
              </Hint>
            </Section>
          )}
        </>
      }
    >
      <PixelCanvas draw={draw} deps={[draw]} aria-label="Contrast pattern" />
    </TestShell>
  );
};

export default ContrastTest;
