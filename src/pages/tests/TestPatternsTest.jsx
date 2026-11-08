import { useState } from 'react';
import TestShell, {
  Section,
  Segmented,
  Select,
  Toggle,
  Readout,
  Button,
  ButtonRow,
  Hint,
  Description,
} from '../../components/TestShell';
import { usePixelCanvas, SCALING_WARNING } from '../../components/PixelCanvas';
import { PATTERNS, PATTERN_CATEGORIES } from './patterns/catalog';
import { invertCanvas } from './patterns/generators';

const canvasStyle = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  display: 'block',
  imageRendering: 'pixelated',
};

const DEFAULT_ID = PATTERNS[0].id;

const TestPatternsTest = () => {
  const [patternId, setPatternId] = useState(DEFAULT_ID);
  const [variants, setVariants] = useState({});
  const [invert, setInvert] = useState(false);

  const index = Math.max(0, PATTERNS.findIndex((p) => p.id === patternId));
  const pattern = PATTERNS[index];
  const variant = variants[pattern.id] ?? pattern.variants?.[0].value;
  const inverted = invert && !!pattern.invertible;
  const inCategory = PATTERNS.filter((p) => p.category === pattern.category);

  const { canvasRef, info } = usePixelCanvas({
    draw: (ctx, { width, height }) => {
      pattern.draw(ctx, width, height, variant);
      if (inverted) invertCanvas(ctx, width, height);
    },
    deps: [pattern.id, variant, inverted],
  });

  const step = (delta) => setPatternId(PATTERNS[(index + delta + PATTERNS.length) % PATTERNS.length].id);

  const stepVariant = (delta) => {
    const list = pattern.variants;
    if (!list) return;
    const i = list.findIndex((v) => v.value === variant);
    setVariants((prev) => ({ ...prev, [pattern.id]: list[(i + delta + list.length) % list.length].value }));
  };

  const selectCategory = (category) => {
    if (category !== pattern.category) setPatternId(PATTERNS.find((p) => p.category === category).id);
  };

  const handleReset = () => {
    setPatternId(DEFAULT_ID);
    setVariants({});
    setInvert(false);
  };

  const shortcuts = [
    { key: ['ArrowRight', 'PageDown'], label: 'Next pattern', action: () => step(1) },
    { key: ['ArrowLeft', 'PageUp'], label: 'Previous pattern', action: () => step(-1) },
    { key: 'ArrowDown', label: 'Next variant', action: () => stepVariant(1) },
    { key: 'ArrowUp', label: 'Previous variant', action: () => stepVariant(-1) },
    { key: 'i', label: 'Invert (black/white patterns)', action: () => pattern.invertible && setInvert((v) => !v) },
    ...PATTERN_CATEGORIES.map((c, i) => ({ key: String(i + 1), label: `${c.label} patterns`, action: () => selectCategory(c.value) })),
  ];

  const ready = info.width > 0;
  const screenW = ready ? Math.round(window.screen.width * info.dpr) : 0;
  const screenH = ready ? Math.round(window.screen.height * info.dpr) : 0;
  const notFullscreen = ready && (info.width < screenW - 2 || info.height < screenH - 2);

  return (
    <TestShell
      title="Test Patterns"
      description="Every pattern is drawn live at your display’s exact device resolution, so 1px detail maps to one physical pixel."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Pattern</h3>
            <Segmented options={PATTERN_CATEGORIES} value={pattern.category} onChange={selectCategory} columns={3} />
            <Select
              label={`${inCategory.indexOf(pattern) + 1} of ${inCategory.length}`}
              value={pattern.id}
              onChange={setPatternId}
              options={inCategory.map((p) => ({ value: p.id, label: p.name }))}
            />
            <ButtonRow>
              <Button type="button" onClick={() => step(-1)}>
                ← Previous
              </Button>
              <Button type="button" onClick={() => step(1)}>
                Next →
              </Button>
            </ButtonRow>
          </Section>

          {pattern.variants ? (
            <Section>
              <h3>Variant</h3>
              <Segmented
                options={pattern.variants}
                value={variant}
                onChange={(v) => setVariants((prev) => ({ ...prev, [pattern.id]: v }))}
                columns={Math.min(pattern.variants.length, 4)}
              />
            </Section>
          ) : null}

          <Section>
            <h3>What to look for</h3>
            <Description>{pattern.help}</Description>
            {pattern.invertible ? <Toggle label="Invert (I)" checked={invert} onChange={setInvert} /> : null}
          </Section>

          <Section>
            <h3>Drawing at</h3>
            <Readout
              items={[
                ['Canvas', ready ? `${info.width} × ${info.height} px` : '—'],
                ['Screen (approx.)', ready ? `${screenW} × ${screenH} px` : '—'],
                ['Device pixel ratio', ready ? String(Math.round(info.dpr * 1000) / 1000) : '—'],
                ['Pixel-exact', ready ? (info.exact ? 'Yes' : 'No') : '—'],
              ]}
            />
            {ready && !info.exact ? <Hint style={{ color: 'var(--warning)' }}>{SCALING_WARNING}</Hint> : null}
            {notFullscreen ? (
              <Hint>The canvas is smaller than your screen. Enter fullscreen (F11) so patterns cover every panel pixel.</Hint>
            ) : null}
          </Section>
        </>
      }
    >
      <canvas ref={canvasRef} style={canvasStyle} aria-label={`${pattern.name} test pattern`} role="img" />
    </TestShell>
  );
};

export default TestPatternsTest;
