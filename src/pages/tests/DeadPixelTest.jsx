import { useCallback, useEffect, useState } from 'react';
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

const COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#000000' },
  { name: 'Red', value: '#ff0000' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Blue', value: '#0000ff' },
  { name: 'Cyan', value: '#00ffff' },
  { name: 'Magenta', value: '#ff00ff' },
  { name: 'Yellow', value: '#ffff00' },
  { name: '50% gray', value: '#808080' },
];

const INTERVALS = [
  { value: 500, label: '0.5 s' },
  { value: 1000, label: '1 s' },
  { value: 2000, label: '2 s' },
  { value: 5000, label: '5 s' },
];

const DEFAULTS = { index: 0, custom: '#ff8800', running: false, interval: 2000 };

const DeadPixelTest = () => {
  // index -1 means the custom color is showing.
  const [index, setIndex] = useState(DEFAULTS.index);
  const [custom, setCustom] = useState(DEFAULTS.custom);
  const [running, setRunning] = useState(DEFAULTS.running);
  const [interval, setIntervalMs] = useState(DEFAULTS.interval);

  const step = useCallback((dir) => {
    setIndex((i) => {
      if (i < 0) return dir > 0 ? 0 : COLORS.length - 1;
      return (i + dir + COLORS.length) % COLORS.length;
    });
  }, []);

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => step(1), interval);
    return () => clearInterval(id);
  }, [running, interval, step]);

  const color = index < 0 ? custom : COLORS[index].value;
  const colorName = index < 0 ? 'Custom' : COLORS[index].name;

  const handleReset = () => {
    setIndex(DEFAULTS.index);
    setCustom(DEFAULTS.custom);
    setRunning(DEFAULTS.running);
    setIntervalMs(DEFAULTS.interval);
  };

  const shortcuts = [
    { key: ['ArrowRight', ' '], label: 'Next color', action: () => step(1) },
    { key: 'ArrowLeft', label: 'Previous color', action: () => step(-1) },
    { key: 'a', label: 'Start / stop auto-cycle', action: () => setRunning((v) => !v) },
  ];

  return (
    <TestShell
      title="Dead Pixel Test"
      description="Scan each solid color in rows. Dead pixels stay black on every color; stuck and hot pixels stay lit. Click or tap anywhere on the screen to advance."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Color</h3>
            <ColorSwatches
              colors={COLORS}
              value={index < 0 ? null : color}
              onChange={(v) => setIndex(COLORS.findIndex((c) => c.value === v))}
            />
            <ButtonRow style={{ marginTop: '0.6rem' }}>
              <Button type="button" onClick={() => step(-1)}>
                ← Previous
              </Button>
              <Button type="button" onClick={() => step(1)}>
                Next →
              </Button>
            </ButtonRow>
          </Section>

          <Section>
            <h3>Custom color</h3>
            <ColorInput
              label="Hex"
              value={custom}
              onChange={(v) => {
                setCustom(v);
                setIndex(-1);
              }}
            />
            {index >= 0 ? (
              <Button type="button" onClick={() => setIndex(-1)} style={{ width: '100%' }}>
                Show custom color
              </Button>
            ) : null}
          </Section>

          <Section>
            <h3>Auto-cycle</h3>
            <Toggle label="Cycle colors automatically" checked={running} onChange={setRunning} />
            <Segmented label="Interval" options={INTERVALS} value={interval} onChange={setIntervalMs} columns={4} />
            <Hint>Auto-cycle is good for a first pass. Stop on a color to inspect a suspicious spot closely.</Hint>
          </Section>

          <Section>
            <h3>Now showing</h3>
            <Readout
              items={[
                ['Color', colorName],
                ['Value', color.toUpperCase()],
              ]}
            />
          </Section>
        </>
      }
    >
      <div
        onClick={() => step(1)}
        style={{ position: 'absolute', inset: 0, background: color }}
        aria-hidden="true"
      />
    </TestShell>
  );
};

export default DeadPixelTest;
