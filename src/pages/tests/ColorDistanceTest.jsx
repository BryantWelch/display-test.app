import { useState } from 'react';
import styled from 'styled-components';
import TestShell, {
  Section,
  Segmented,
  Slider,
  Select,
  Toggle,
  ColorInput,
  Readout,
  Button,
  ButtonRow,
  Hint,
} from '../../components/TestShell';

const STEPS = [1, 2, 3, 4, 6, 8];
const CHANNELS = ['r', 'g', 'b'];
const CHANNEL_NAMES = { r: 'Red', g: 'Green', b: 'Blue' };

const PRESETS = [
  { value: 'mid-gray', label: 'Mid gray', bg: '#808080', fg: '#838383' },
  { value: 'near-black', label: 'Near black', bg: '#000000', fg: '#030303' },
  { value: 'near-white', label: 'Near white', bg: '#ffffff', fg: '#fcfcfc' },
  { value: 'skin', label: 'Skin tones', bg: '#d9a384', fg: '#dca586' },
  { value: 'sky', label: 'Sky blues', bg: '#7fb2e5', fg: '#7fb4e8' },
  { value: 'shadow', label: 'Dark shadows', bg: '#141414', fg: '#171717' },
];

const DEFAULTS = { bg: '#808080', fg: '#838383' };

const clamp = (v) => Math.min(255, Math.max(0, Math.round(v)));
const toRgb = (hex) => ({
  r: parseInt(hex.slice(1, 3), 16),
  g: parseInt(hex.slice(3, 5), 16),
  b: parseInt(hex.slice(5, 7), 16),
});
const toHex = ({ r, g, b }) => `#${[r, g, b].map((n) => clamp(n).toString(16).padStart(2, '0')).join('')}`;
const signed = (n) => (n > 0 ? `+${n}` : String(n));
const isLight = ({ r, g, b }) => 0.2126 * r + 0.7152 * g + 0.0722 * b > 128;

const Stage = styled.div`
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
`;

const Patch = styled.div`
  width: min(40vmin, 420px);
  aspect-ratio: 1;
`;

const Staircase = styled.div`
  display: grid;
  grid-template-columns: repeat(${STEPS.length}, min(13vmin, 150px));
  gap: min(4vmin, 40px);

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 24vmin);
  }
`;

const Step = styled.figure`
  margin: 0;
  text-align: center;

  div {
    aspect-ratio: 1;
  }

  figcaption {
    margin-top: 0.5rem;
    font: 600 0.85rem/1.2 var(--font-sans);
    font-variant-numeric: tabular-nums;
  }
`;

const ChannelRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 0.5rem;

  > div:last-child {
    display: flex;
    gap: 0.3rem;
    margin-bottom: 0.85rem;
  }

  ${Button} {
    min-width: 44px;
    padding: 0.4rem 0.5rem;
  }
`;

const shuffled = () => {
  const a = [...STEPS];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const ColorDistanceTest = () => {
  const [mode, setMode] = useState('pair');
  const [bg, setBg] = useState(DEFAULTS.bg);
  const [fg, setFg] = useState(DEFAULTS.fg);
  const [editing, setEditing] = useState('fg');
  const [channel, setChannel] = useState('all');
  const [direction, setDirection] = useState('lighter');
  const [showLabels, setShowLabels] = useState(true);
  const [order, setOrder] = useState(STEPS);

  const bgRgb = toRgb(bg);
  const fgRgb = toRgb(fg);
  const target = editing === 'fg' ? fgRgb : bgRgb;
  const setTarget = editing === 'fg' ? setFg : setBg;
  const labelColor = isLight(bgRgb) ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)';

  const setChannelValue = (c, v) => setTarget(toHex({ ...target, [c]: clamp(v) }));
  const nudgeAll = (delta) =>
    setFg((hex) => {
      const c = toRgb(hex);
      return toHex({ r: c.r + delta, g: c.g + delta, b: c.b + delta });
    });
  const swap = () => {
    setBg(fg);
    setFg(bg);
  };
  const applyPreset = (id) => {
    const p = PRESETS.find((x) => x.value === id);
    if (!p) return;
    setBg(p.bg);
    setFg(p.fg);
  };

  const handleReset = () => {
    setMode('pair');
    setBg(DEFAULTS.bg);
    setFg(DEFAULTS.fg);
    setEditing('fg');
    setChannel('all');
    setDirection('lighter');
    setShowLabels(true);
    setOrder(STEPS);
  };

  const stepColor = (n) => {
    const d = direction === 'lighter' ? n : -n;
    const next = { ...bgRgb };
    for (const c of channel === 'all' ? CHANNELS : [channel]) next[c] = clamp(bgRgb[c] + d);
    const clipped = (channel === 'all' ? CHANNELS : [channel]).some((c) => next[c] !== bgRgb[c] + d);
    return { hex: toHex(next), clipped };
  };

  const shortcuts = [
    { key: 'm', label: 'Switch mode', action: () => setMode((m) => (m === 'pair' ? 'staircase' : 'pair')) },
    { key: 's', label: 'Swap colors', action: swap },
    { key: 'ArrowUp', label: 'Patch +1 (all channels)', action: () => nudgeAll(1) },
    { key: 'ArrowDown', label: 'Patch −1 (all channels)', action: () => nudgeAll(-1) },
    { key: 'l', label: 'Show / hide step labels', action: () => setShowLabels((v) => !v) },
  ];

  const diff = CHANNELS.map((c) => `${c.toUpperCase()} ${signed(fgRgb[c] - bgRgb[c])}`).join(' · ');

  return (
    <TestShell
      title="Color Distinction"
      description="See how small a color difference you can spot on this display. This tests discrimination on your screen with your eyes and room lighting — not color accuracy, which needs a colorimeter."
      onReset={handleReset}
      shortcuts={shortcuts}
      style={{ background: bg }}
      controls={
        <>
          <Section>
            <h3>Mode</h3>
            <Segmented
              options={[
                { value: 'pair', label: 'Two colors' },
                { value: 'staircase', label: 'Staircase' },
              ]}
              value={mode}
              onChange={setMode}
              columns={2}
            />
          </Section>

          {mode === 'pair' ? (
            <>
              <Section>
                <h3>Presets</h3>
                <Select
                  value={PRESETS.find((p) => p.bg === bg && p.fg === fg)?.value ?? 'custom'}
                  onChange={applyPreset}
                  options={[...PRESETS, { value: 'custom', label: 'Custom' }]}
                />
              </Section>

              <Section>
                <h3>Colors</h3>
                <ColorInput label="Background" value={bg} onChange={setBg} />
                <ColorInput label="Patch" value={fg} onChange={setFg} />
                <ButtonRow>
                  <Button type="button" onClick={swap}>
                    Swap patch / background
                  </Button>
                </ButtonRow>
              </Section>

              <Section>
                <h3>Fine tune</h3>
                <Segmented
                  options={[
                    { value: 'fg', label: 'Patch' },
                    { value: 'bg', label: 'Background' },
                  ]}
                  value={editing}
                  onChange={setEditing}
                  columns={2}
                />
                {CHANNELS.map((c) => (
                  <ChannelRow key={c}>
                    <Slider
                      label={CHANNEL_NAMES[c]}
                      value={target[c]}
                      min={0}
                      max={255}
                      onChange={(v) => setChannelValue(c, v)}
                    />
                    <div>
                      <Button
                        type="button"
                        aria-label={`${CHANNEL_NAMES[c]} minus 1`}
                        onClick={() => setChannelValue(c, target[c] - 1)}
                      >
                        −1
                      </Button>
                      <Button
                        type="button"
                        aria-label={`${CHANNEL_NAMES[c]} plus 1`}
                        onClick={() => setChannelValue(c, target[c] + 1)}
                      >
                        +1
                      </Button>
                    </div>
                  </ChannelRow>
                ))}
              </Section>

              <Section>
                <h3>Difference</h3>
                <Readout
                  items={[
                    ['Background', bg.toUpperCase()],
                    ['Patch', fg.toUpperCase()],
                    ['Code values', diff],
                  ]}
                />
                <Hint>
                  Differences are 8-bit code values sent to the display, not measured color. Lower the
                  difference until the patch disappears.
                </Hint>
              </Section>
            </>
          ) : (
            <>
              <Section>
                <h3>Base color</h3>
                <ColorInput label="Background" value={bg} onChange={setBg} />
                <Segmented
                  label="Change"
                  options={[
                    { value: 'all', label: 'Gray' },
                    { value: 'r', label: 'R' },
                    { value: 'g', label: 'G' },
                    { value: 'b', label: 'B' },
                  ]}
                  value={channel}
                  onChange={setChannel}
                  columns={4}
                />
                <Segmented
                  label="Direction"
                  options={[
                    { value: 'lighter', label: 'Lighter' },
                    { value: 'darker', label: 'Darker' },
                  ]}
                  value={direction}
                  onChange={setDirection}
                  columns={2}
                />
              </Section>
              <Section>
                <h3>Blind check</h3>
                <Toggle label="Show step labels" checked={showLabels} onChange={setShowLabels} />
                <ButtonRow>
                  <Button
                    type="button"
                    onClick={() => {
                      setOrder(shuffled());
                      setShowLabels(false);
                    }}
                  >
                    Shuffle & hide labels
                  </Button>
                  <Button type="button" onClick={() => setOrder(STEPS)}>
                    Sort
                  </Button>
                </ButtonRow>
                <Hint>
                  Each patch differs from the background by 1, 2, 3, 4, 6 or 8 code values. Shuffle, count the
                  patches you can see, then reveal the labels. Near black and near white are the hardest.
                </Hint>
              </Section>
            </>
          )}
        </>
      }
    >
      <Stage>
        {mode === 'pair' ? (
          <Patch style={{ background: fg }} aria-label="Patch color" />
        ) : (
          <Staircase>
            {order.map((n) => {
              const { hex, clipped } = stepColor(n);
              return (
                <Step key={n}>
                  <div style={{ background: hex }} />
                  <figcaption style={{ color: labelColor, visibility: showLabels ? 'visible' : 'hidden' }}>
                    {direction === 'lighter' ? '+' : '−'}
                    {n}
                    {clipped ? ' (clipped)' : ''}
                  </figcaption>
                </Step>
              );
            })}
          </Staircase>
        )}
      </Stage>
    </TestShell>
  );
};

export default ColorDistanceTest;
