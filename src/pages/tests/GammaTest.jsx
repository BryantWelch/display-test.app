import { useCallback, useMemo, useState } from 'react';
import TestShell, { Section, Segmented, Toggle, Readout, Hint } from '../../components/TestShell';
import { usePixelCanvas, SCALING_WARNING } from '../../components/PixelCanvas';

const GAMMAS = Array.from({ length: 13 }, (_, i) => Math.round((1.6 + i * 0.1) * 10) / 10);
const DEFAULT_INDEX = GAMMAS.indexOf(2.2);

const CHANNELS = {
  gray: { label: 'Gray', mask: [1, 1, 1] },
  r: { label: 'Red', mask: [1, 0, 0] },
  g: { label: 'Green', mask: [0, 1, 0] },
  b: { label: 'Blue', mask: [0, 0, 1] },
};

/** 4×4 on/off masks. Each averages to the given fraction of full light. */
const MASKS = {
  lines: {
    0.25: (x, y) => y % 4 === 0,
    0.5: (x, y) => y % 2 === 0,
    0.75: (x, y) => y % 4 !== 3,
  },
  checker: {
    0.25: (x, y) => x % 2 === 0 && y % 2 === 0,
    0.5: (x, y) => (x + y) % 2 === 0,
    0.75: (x, y) => !(x % 2 === 1 && y % 2 === 1),
  },
};

const levelFor = (mix, gamma) => Math.round(255 * mix ** (1 / gamma));

const rgb = (mask, v) => `rgb(${mask[0] * v}, ${mask[1] * v}, ${mask[2] * v})`;

/** Grid geometry in device pixels, shared by drawing, hit-testing, and arrow-key navigation. */
function computeLayout(width, height, dpr, rowsOfChannels) {
  const n = GAMMAS.length;
  const margin = Math.round(Math.min(width, height) * 0.05);
  const labelSpace = Math.round(22 * dpr);
  const availW = width - margin * 2;
  const availH = height - margin * 2;

  let best = { size: 0, cols: n, rows: 1 };
  if (rowsOfChannels > 1) {
    // One row per channel, one column per gamma (transposed on portrait screens).
    const portrait = height > width;
    const cols = portrait ? rowsOfChannels : n;
    const rows = portrait ? n : rowsOfChannels;
    const size = Math.floor(Math.min(availW / cols, availH / rows - labelSpace) / 1.12);
    best = { size, cols, rows, transposed: portrait };
  } else {
    for (let cols = 1; cols <= n; cols += 1) {
      const rows = Math.ceil(n / cols);
      const size = Math.floor(Math.min(availW / cols, availH / rows - labelSpace) / 1.12);
      if (size > best.size) best = { size, cols, rows };
    }
  }
  const size = Math.max(8, best.size);
  const gap = Math.round(size * 0.12);
  const cellW = size + gap;
  const cellH = size + gap + labelSpace;
  const gridW = best.cols * cellW - gap;
  const gridH = best.rows * cellH - gap;
  const x0 = Math.round((width - gridW) / 2);
  const y0 = Math.round((height - gridH) / 2);
  return { ...best, size, gap, cellW, cellH, x0, y0, labelSpace };
}

/** Maps a flat tile index to grid position plus its channel row / gamma index. */
function tileAt(layout, index, channelKeys) {
  const n = GAMMAS.length;
  if (channelKeys.length > 1) {
    const ch = Math.floor(index / n);
    const g = index % n;
    const col = layout.transposed ? ch : g;
    const row = layout.transposed ? g : ch;
    return { col, row, gammaIndex: g, channel: channelKeys[ch] };
  }
  return { col: index % layout.cols, row: Math.floor(index / layout.cols), gammaIndex: index, channel: channelKeys[0] };
}

const GammaTest = () => {
  const [channel, setChannel] = useState('gray');
  const [pattern, setPattern] = useState('lines');
  const [mix, setMix] = useState(0.5);
  const [showLabels, setShowLabels] = useState(true);
  const [selected, setSelected] = useState(DEFAULT_INDEX);

  const channelKeys = useMemo(() => (channel === 'rgb' ? ['r', 'g', 'b'] : [channel]), [channel]);
  const tileCount = GAMMAS.length * channelKeys.length;

  const draw = useCallback(
    (ctx, { width, height, dpr }) => {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, width, height);

      const layout = computeLayout(width, height, dpr, channelKeys.length);
      const maskFn = MASKS[pattern][mix];
      const patterns = {};
      channelKeys.forEach((key) => {
        const tile = document.createElement('canvas');
        tile.width = 4;
        tile.height = 4;
        const tctx = tile.getContext('2d');
        const img = tctx.createImageData(4, 4);
        const m = CHANNELS[key].mask;
        for (let y = 0; y < 4; y += 1) {
          for (let x = 0; x < 4; x += 1) {
            const on = maskFn(x, y) ? 255 : 0;
            const i = (y * 4 + x) * 4;
            img.data[i] = m[0] * on;
            img.data[i + 1] = m[1] * on;
            img.data[i + 2] = m[2] * on;
            img.data[i + 3] = 255;
          }
        }
        tctx.putImageData(img, 0, 0);
        patterns[key] = ctx.createPattern(tile, 'repeat');
      });

      const fontPx = Math.round(12 * dpr);
      ctx.font = `600 ${fontPx}px system-ui, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';

      for (let i = 0; i < tileCount; i += 1) {
        const t = tileAt(layout, i, channelKeys);
        const x = layout.x0 + t.col * layout.cellW;
        const y = layout.y0 + t.row * layout.cellH;
        const s = layout.size;
        const mask = CHANNELS[t.channel].mask;
        const gamma = GAMMAS[t.gammaIndex];

        // Dither surround; pattern is anchored to the canvas origin so the phase is global.
        ctx.fillStyle = patterns[t.channel];
        ctx.fillRect(x, y, s, s);

        const inset = Math.round(s * 0.25);
        ctx.fillStyle = rgb(mask, levelFor(mix, gamma));
        ctx.fillRect(x + inset, y + inset, s - inset * 2, s - inset * 2);

        if (i === selected) {
          const w = Math.max(2, Math.round(2 * dpr));
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = w;
          const o = Math.round(layout.gap / 2);
          ctx.strokeRect(x - o + w / 2, y - o + w / 2, s + o * 2 - w, s + o * 2 - w);
        }

        if (showLabels) {
          ctx.fillStyle = i === selected ? '#cbd5e1' : '#64748b';
          ctx.fillText(gamma.toFixed(1), x + s / 2, y + s + Math.round(layout.gap * 0.6));
        }
      }
    },
    [channelKeys, pattern, mix, showLabels, selected, tileCount]
  );

  const { canvasRef, info } = usePixelCanvas({ draw, deps: [draw] });

  const layout = useMemo(
    () => (info.width ? computeLayout(info.width, info.height, info.dpr, channelKeys.length) : null),
    [info, channelKeys.length]
  );

  const move = useCallback(
    (dx, dy) => {
      if (!layout) return;
      setSelected((cur) => {
        if (dx && channelKeys.length === 1) return Math.min(tileCount - 1, Math.max(0, cur + dx));
        const t = tileAt(layout, cur, channelKeys);
        const col = Math.min(layout.cols - 1, Math.max(0, t.col + dx));
        const row = Math.min(layout.rows - 1, Math.max(0, t.row + dy));
        for (let i = 0; i < tileCount; i += 1) {
          const c = tileAt(layout, i, channelKeys);
          if (c.col === col && c.row === row) return i;
        }
        // Moving down into a partial last row.
        return dy > 0 ? tileCount - 1 : cur;
      });
    },
    [layout, channelKeys, tileCount]
  );

  const handleCanvasClick = (e) => {
    if (!layout) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * info.width;
    const py = ((e.clientY - rect.top) / rect.height) * info.height;
    for (let i = 0; i < tileCount; i += 1) {
      const t = tileAt(layout, i, channelKeys);
      const x = layout.x0 + t.col * layout.cellW;
      const y = layout.y0 + t.row * layout.cellH;
      if (px >= x && px < x + layout.size && py >= y && py < y + layout.size) {
        setSelected(i);
        return;
      }
    }
  };

  const changeChannel = (value) => {
    setChannel(value);
    setSelected(DEFAULT_INDEX);
  };

  const handleReset = () => {
    setChannel('gray');
    setPattern('lines');
    setMix(0.5);
    setShowLabels(true);
    setSelected(DEFAULT_INDEX);
  };

  const current = tileAt(layout || { cols: GAMMAS.length }, Math.min(selected, tileCount - 1), channelKeys);
  const currentGamma = GAMMAS[current.gammaIndex];

  return (
    <TestShell
      title="Gamma Test"
      description="Each tile is a fine pattern of full-on and full-off pixel lines (averaging a known share of light) around a solid patch. Step back or squint until the lines blur: the tile whose center disappears into its surround is your display's approximate gamma at that brightness."
      onReset={handleReset}
      shortcuts={[
        { key: 'ArrowLeft', label: 'Select previous tile', action: () => move(-1, 0) },
        { key: 'ArrowRight', label: 'Select next tile', action: () => move(1, 0) },
        { key: 'ArrowUp', label: 'Select tile above', action: () => move(0, -1) },
        { key: 'ArrowDown', label: 'Select tile below', action: () => move(0, 1) },
        { key: 'l', label: 'Show / hide gamma labels', action: () => setShowLabels((v) => !v) },
      ]}
      controls={
        <>
          {!info.exact ? (
            <Hint role="alert" style={{ color: 'var(--warning)', marginTop: 0, marginBottom: '1rem' }}>
              {SCALING_WARNING}
            </Hint>
          ) : null}

          <Section>
            <h3>Your match</h3>
            <Readout
              items={[
                ['Selected tile', showLabels ? `γ ${currentGamma.toFixed(1)}` : 'hidden (press L)'],
                ['Channel', CHANNELS[current.channel].label],
                ['Solid level', showLabels ? `${levelFor(mix, currentGamma)} / 255` : '—'],
                ['Pattern average', `${mix * 100}% of full light`],
              ]}
            />
            <Hint>Use the arrow keys or click a tile to mark the one that blends best.</Hint>
          </Section>

          <Section>
            <h3>Channel</h3>
            <Segmented
              value={channel}
              onChange={changeChannel}
              columns={5}
              options={[
                { value: 'gray', label: 'Gray' },
                { value: 'r', label: 'R' },
                { value: 'g', label: 'G' },
                { value: 'b', label: 'B' },
                { value: 'rgb', label: 'RGB', title: 'Red, green and blue rows together' },
              ]}
            />
            <Hint>
              Red, green and blue should match at the same gamma. If one channel lands elsewhere, grays will carry a
              tint at that brightness.
            </Hint>
          </Section>

          <Section>
            <h3>Brightness region</h3>
            <Segmented
              value={mix}
              onChange={setMix}
              columns={3}
              options={[
                { value: 0.25, label: 'Dark 25%' },
                { value: 0.5, label: 'Mid 50%' },
                { value: 0.75, label: 'Light 75%' },
              ]}
            />
          </Section>

          <Section>
            <h3>Pattern</h3>
            <Segmented
              value={pattern}
              onChange={setPattern}
              columns={2}
              options={[
                { value: 'lines', label: 'Lines', title: 'Horizontal 1-pixel lines (most reliable on LCDs)' },
                { value: 'checker', label: 'Checker', title: '1-pixel checkerboard' },
              ]}
            />
            <Toggle label="Show gamma labels (L)" checked={showLabels} onChange={setShowLabels} />
            <Hint>
              Hide the labels while you judge so you aren&apos;t nudged toward 2.2. If Lines and Checker disagree, trust
              Lines — some LCDs handle single-pixel checkerboards poorly.
            </Hint>
          </Section>
        </>
      }
    >
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        aria-label="Gamma matching tiles"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', display: 'block', imageRendering: 'pixelated' }}
      />
    </TestShell>
  );
};

export default GammaTest;
