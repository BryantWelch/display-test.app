import { useState } from 'react';
import TestShell, { Section, Segmented, Toggle, Readout, Hint } from '../../components/TestShell';
import { LevelField, gray } from './BlackLevelTest';

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

const RANGES = [
  { value: 20, label: '−20 to −1' },
  { value: 40, label: '−40 to −1' },
];

const BACKGROUNDS = [
  { value: 255, label: '255 · PC white', title: 'Full-range RGB white' },
  { value: 235, label: '235 · Video white', title: 'Limited-range (TV) reference white' },
];

const BARS = {
  255: [
    { value: 245, label: '245' },
    { value: 250, label: '250' },
    { value: 254, label: '254' },
    { value: 255, label: 'White 255' },
  ],
  235: [
    { value: 226, label: '226' },
    { value: 231, label: '231' },
    { value: 235, label: 'White 235' },
    { value: 245, label: '245' },
    { value: 254, label: '254' },
  ],
};

const BAR_CAPTIONS = {
  255: 'Near-white bars. 254 is the hardest — on most good monitors you can just pick it out from 255.',
  235: 'Video white is 235. Codes above it (245, 254) are “whiter than white”; a limited-range TV may clip them to match 235.',
};

const DEFAULTS = { span: 20, background: 255, labels: true };

const WhiteSaturationTest = () => {
  const [span, setSpan] = useState(DEFAULTS.span);
  const [background, setBackground] = useState(DEFAULTS.background);
  const [labels, setLabels] = useState(DEFAULTS.labels);

  const patches = range(background - span, background - 1);
  const ramp = range(background - span, 255);

  const handleReset = () => {
    setSpan(DEFAULTS.span);
    setBackground(DEFAULTS.background);
    setLabels(DEFAULTS.labels);
  };

  const shortcuts = [
    { key: 'l', label: 'Show / hide labels', action: () => setLabels((v) => !v) },
    { key: 'b', label: 'Switch background 255 / 235', action: () => setBackground((v) => (v === 255 ? 235 : 255)) },
    { key: 'x', label: 'Switch range 20 / 40', action: () => setSpan((v) => (v === 20 ? 40 : 20)) },
  ];

  return (
    <TestShell
      title="White Saturation Test"
      description="Each patch is one code value darker than the white background. Count how many of the top patches you can still tell apart from the background."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Patches</h3>
            <Segmented label="Levels below background" options={RANGES} value={span} onChange={setSpan} columns={2} />
            <Segmented label="Background" options={BACKGROUNDS} value={background} onChange={setBackground} columns={2} />
            <Toggle label="Show level labels" checked={labels} onChange={setLabels} />
          </Section>

          <Section>
            <h3>Reading it</h3>
            <Readout
              items={[
                ['Background', background === 255 ? '255 (full-range white)' : '235 (video white)'],
                ['Patches', `${patches[0]}–${patches[patches.length - 1]}`],
                ['Good result', `visible up to ${background - 5}–${background - 2}`],
              ]}
            />
            <Hint>
              If the top 5–10 patches melt into the background, whites are clipping: contrast is too high, a
              dynamic/vivid mode is stretching the image, or the display is treating a full-range signal as limited.
              A full white screen is bright — lower the brightness if it is uncomfortable.
            </Hint>
          </Section>
        </>
      }
    >
      <LevelField
        background={background}
        patches={patches}
        bars={BARS[background]}
        barsCaption={BAR_CAPTIONS[background]}
        ramp={ramp}
        showLabels={labels}
        labelColor={gray(background - 110)}
      />
    </TestShell>
  );
};

export default WhiteSaturationTest;
