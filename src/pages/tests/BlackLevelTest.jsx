import { useState } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Segmented, Toggle, Readout, Hint } from '../../components/TestShell';

export const gray = (v) => `rgb(${v}, ${v}, ${v})`;

const Field = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: safe center;
  overflow-y: auto;
  gap: clamp(1rem, 4vh, 2.5rem);
  padding: clamp(4rem, 9vh, 5.5rem) clamp(0.75rem, 4vw, 3rem) clamp(1.5rem, 5vh, 3rem);
  font-family: var(--font-mono);
  user-select: none;

  @media (max-width: 768px) {
    padding-bottom: calc(7rem + env(safe-area-inset-bottom, 0px));
  }
`;

const Block = styled.div`
  width: min(100%, 1400px);
  margin: 0 auto;
`;

const Caption = styled.p`
  margin: 0 0 0.5rem;
  font-size: clamp(0.65rem, 1vw, 0.8rem);
  font-family: var(--font-sans);
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const PatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(10, minmax(0, 1fr));
  gap: clamp(0.35rem, 1.2vw, 1rem);

  @media (max-width: 768px) {
    grid-template-columns: repeat(5, minmax(0, 1fr));
  }
`;

const Patch = styled.div`
  height: ${({ $rows }) => ($rows > 2 ? '9vh' : '16vh')};
  border-radius: 2px;

  @media (max-width: 768px) {
    height: 12vh;
  }
`;

const PatchLabel = styled.span`
  display: block;
  margin-top: 0.25rem;
  text-align: center;
  font-size: clamp(0.6rem, 1vw, 0.8rem);
  font-weight: 600;
  visibility: ${({ $show }) => ($show ? 'visible' : 'hidden')};

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const Bars = styled.div`
  display: flex;
  justify-content: center;
  gap: clamp(0.5rem, 2vw, 2rem);
`;

const Bar = styled.div`
  width: clamp(2.5rem, 9vw, 8rem);
  height: 12vh;
`;

const Ramp = styled.div`
  display: flex;
`;

const RampStep = styled.div`
  flex: 1 1 0;
  min-width: 0;
`;

/**
 * Near-level patch layout shared by the black level and white saturation tests: labeled patches
 * on a uniform background, a row of reference bars, and a 1-step ramp.
 */
export function LevelField({ background, patches, bars, barsCaption, ramp, showLabels, labelColor }) {
  const rows = Math.ceil(patches.length / 10);
  const rampLabelEvery = ramp.length > 21 ? 5 : 1;
  return (
    <Field style={{ background: gray(background), color: labelColor }} aria-hidden="true">
      <Block>
        <Caption $show={showLabels}>Patches (code value of 255)</Caption>
        <PatchGrid>
          {patches.map((v) => (
            <div key={v}>
              <Patch $rows={rows} style={{ background: gray(v) }} />
              <PatchLabel $show={showLabels}>{v}</PatchLabel>
            </div>
          ))}
        </PatchGrid>
      </Block>

      <Block>
        <Caption $show={showLabels}>{barsCaption}</Caption>
        <Bars>
          {bars.map((b) => (
            <div key={b.value}>
              <Bar style={{ background: gray(b.value) }} />
              <PatchLabel $show={showLabels}>{b.label}</PatchLabel>
            </div>
          ))}
        </Bars>
      </Block>

      <Block>
        <Caption $show={showLabels}>
          Step ramp {ramp[0]}–{ramp[ramp.length - 1]}, one code per step
        </Caption>
        <Ramp>
          {ramp.map((v, i) => (
            <RampStep key={v}>
              <div style={{ height: '7vh', background: gray(v) }} />
              <PatchLabel $show={showLabels && i % rampLabelEvery === 0}>{v}</PatchLabel>
            </RampStep>
          ))}
        </Ramp>
      </Block>
    </Field>
  );
}

const range = (from, to) => Array.from({ length: to - from + 1 }, (_, i) => from + i);

const RANGES = [
  { value: 20, label: '+1 to +20' },
  { value: 40, label: '+1 to +40' },
];

const BACKGROUNDS = [
  { value: 0, label: '0 · PC black', title: 'Full-range RGB black' },
  { value: 16, label: '16 · Video black', title: 'Limited-range (TV) black' },
];

const BARS = {
  0: [
    { value: 0, label: 'Black 0' },
    { value: 5, label: '+2% (5)' },
    { value: 10, label: '+4% (10)' },
  ],
  16: [
    { value: 12, label: '−2% (12)' },
    { value: 16, label: 'Black 16' },
    { value: 20, label: '+2% (20)' },
    { value: 25, label: '+4% (25)' },
  ],
};

const BAR_CAPTIONS = {
  0: 'PLUGE-style bars. Full-range PC black is 0, so no “below black” bar exists — 5 should be faintly visible.',
  16: 'PLUGE layout around video black 16. Browsers send full-range values, so 12 should be faintly darker than the background. If 12, 16, and the background all merge into pure black, the display is clipping below 16.',
};

const DEFAULTS = { span: 20, background: 0, labels: true };

const BlackLevelTest = () => {
  const [span, setSpan] = useState(DEFAULTS.span);
  const [background, setBackground] = useState(DEFAULTS.background);
  const [labels, setLabels] = useState(DEFAULTS.labels);

  const patches = range(background + 1, background + span);
  const ramp = range(background, background + span);

  const handleReset = () => {
    setSpan(DEFAULTS.span);
    setBackground(DEFAULTS.background);
    setLabels(DEFAULTS.labels);
  };

  const shortcuts = [
    { key: 'l', label: 'Show / hide labels', action: () => setLabels((v) => !v) },
    { key: 'b', label: 'Switch background 0 / 16', action: () => setBackground((v) => (v === 0 ? 16 : 0)) },
    { key: 'x', label: 'Switch range +20 / +40', action: () => setSpan((v) => (v === 20 ? 40 : 20)) },
  ];

  return (
    <TestShell
      title="Black Level Test"
      description="Each patch is one code value brighter than the last. Count how many you can see above the background. Dim the room and give your eyes a minute to adapt."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Patches</h3>
            <Segmented label="Levels above background" options={RANGES} value={span} onChange={setSpan} columns={2} />
            <Segmented label="Background" options={BACKGROUNDS} value={background} onChange={setBackground} columns={2} />
            <Toggle label="Show level labels" checked={labels} onChange={setLabels} />
            <Hint>
              Labels are dim gray, but on local-dimming displays they can light a zone. Turn them off for a cleaner
              read once you know the layout.
            </Hint>
          </Section>

          <Section>
            <h3>Reading it</h3>
            <Readout
              items={[
                ['Background', background === 0 ? '0 (full-range black)' : '16 (video black)'],
                ['Patches', `${patches[0]}–${patches[patches.length - 1]}`],
                ['Good result', background === 0 ? 'visible from 2–5' : '12 bar just darker than background'],
              ]}
            />
            <Hint>
              If the background itself looks gray and every patch is visible, the display is probably expecting full
              range while receiving limited (or brightness is too high). If the first 5–10 patches are invisible,
              blacks are crushed.
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
        labelColor={gray(background + 70)}
      />
    </TestShell>
  );
};

export default BlackLevelTest;
