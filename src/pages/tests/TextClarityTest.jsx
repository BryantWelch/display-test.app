import { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import TestShell, { Section, Segmented, Slider, Select, Hint } from '../../components/TestShell';
import PixelCanvas, { SCALING_WARNING } from '../../components/PixelCanvas';

const GOOGLE_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Roboto:wght@300..700&family=Source+Serif+4:wght@300..700&family=JetBrains+Mono:wght@300..700&display=swap';

const FONTS = [
  { value: 'system', label: 'System UI (Segoe UI / SF Pro)', css: 'system-ui, -apple-system, "Segoe UI", sans-serif' },
  { value: 'inter', label: 'Inter (web font)', css: '"Inter Variable", Inter, system-ui, sans-serif' },
  { value: 'roboto', label: 'Roboto (web font)', css: '"Roboto", system-ui, sans-serif' },
  { value: 'georgia', label: 'Georgia / serif', css: 'Georgia, "Times New Roman", serif' },
  { value: 'source-serif', label: 'Source Serif 4 (web font)', css: '"Source Serif 4", Georgia, serif' },
  { value: 'mono', label: 'System monospace', css: 'ui-monospace, "Cascadia Mono", Consolas, Menlo, monospace' },
  { value: 'jetbrains', label: 'JetBrains Mono (web font)', css: '"JetBrains Mono", ui-monospace, monospace' },
];
const FONT_BY_ID = Object.fromEntries(FONTS.map((f) => [f.value, f]));

const SCHEMES = [
  { value: 'bw', label: 'Black on white', fg: '#000000', bg: '#ffffff' },
  { value: 'wb', label: 'White on black', fg: '#ffffff', bg: '#000000' },
  { value: 'dark', label: 'Dark mode gray', fg: '#e6e6e6', bg: '#121212' },
  { value: 'low', label: 'Low contrast', fg: '#8a8a8a', bg: '#e6e6e6' },
];
const SCHEME_BY_ID = Object.fromEntries(SCHEMES.map((s) => [s.value, s]));

const VIEWS = [
  { value: 'text', label: 'Paragraphs' },
  { value: 'ladder', label: 'Tiny sizes' },
  { value: 'fringing', label: 'Fringing' },
];

const DEFAULTS = {
  font: 'system',
  size: 16,
  weight: 400,
  lineHeight: 1.5,
  letterSpacing: 0,
  scheme: 'bw',
  view: 'text',
};

const PARAGRAPHS = [
  'Sharp text is mostly about three things: running the display at its native resolution, letting the operating system scale the interface instead of the monitor, and anti-aliasing that suits the physical layout of the subpixels. Get those right and even small type should look crisp, evenly weighted, and free of shimmering edges.',
  'Look closely at thin vertical strokes such as l, I, i and the pipe character. On most LCDs with ClearType or similar subpixel smoothing they pick up a faint red edge on one side and a blue edge on the other. That is expected. What should not happen is a visible rainbow halo, letters that look bold in one place and thin in another, or edges that crawl when you move your eyes.',
  'Compare round letters like o, e, c and g with diagonals like v, w, x and k. Curves should be smooth rather than stair-stepped, and diagonals should not look notched. If everything looks soft, check that Windows or macOS is not running the display at a non-native resolution, and that the monitor itself is not applying sharpness or overscan.',
  'Confusable characters: Il1| O0o rn m cl d vv w 5S 8B 6b 9g. Punctuation: ; : , . ’ “ ” ( ) [ ] { } < > / \\ — the quick brown fox jumps over the lazy dog. THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG. 0123456789.',
  'Dark mode and light mode stress text differently. Light text on a dark background tends to bloom slightly on bright, glossy panels and can show smearing on slower VA panels when scrolling. Dark text on white is the classic office case and makes color fringing easiest to see. Low-contrast gray text is where thin fonts and low pixel density hurt the most.',
  'Pixel density matters more than any setting. At around 90 to 110 pixels per inch, subpixel anti-aliasing does a lot of work to make text look smooth. At 160 pixels per inch and above, with 150 to 200 percent scaling, glyphs span enough pixels that fringing and stair-stepping become very hard to see at a normal viewing distance.',
];

const LADDER_SIZES = [8, 9, 10, 11, 12, 13, 14, 15, 16];
const LADDER_SAMPLE = 'The quick brown fox jumps over the lazy dog — Il1| O0 rn m 0123456789 ;:,.';
const SYNTH_SAMPLE = 'Hamburgefonstiv 1lI| 0O rnm';
const SYNTH_SIZES = [11, 13, 16];

const Fill = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

const Columns = styled.div`
  height: 100%;
  padding: 2.5rem 3rem;
  column-width: 32em;
  column-gap: 3em;
  column-fill: auto;

  p {
    margin: 0 0 1em;
  }

  @media (max-width: 768px) {
    padding: 4.5rem 1.25rem 1.25rem;
  }
`;

const Ladder = styled.div`
  padding: 4.5rem 3rem 2rem;
  display: grid;
  gap: 0.9rem;

  @media (max-width: 768px) {
    padding: 4.5rem 1.25rem 1.25rem;
  }
`;

const LadderRow = styled.div`
  display: grid;
  grid-template-columns: 9rem 1fr;
  align-items: baseline;
  gap: 1rem;

  span:first-child {
    font: 500 12px/1.2 var(--font-sans);
    opacity: 0.65;
  }

  span:last-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const Scroll = styled.div`
  position: absolute;
  inset: 0;
  overflow-y: auto;
  background: #161616;
  color: #e5e5e5;
  font-family: var(--font-sans);
`;

const FringeLayout = styled.div`
  max-width: 920px;
  padding: 4.5rem 3rem 3rem;

  h2 {
    font-size: 1.05rem;
    margin: 2rem 0 0.4rem;
  }

  h2:first-child {
    margin-top: 0;
  }

  p,
  li {
    font-size: 0.92rem;
    line-height: 1.55;
    color: #b8b8b8;
    max-width: 70ch;
  }

  ul {
    padding-left: 1.2rem;
    margin: 0.4rem 0 0;
  }

  strong {
    color: #f0f0f0;
  }

  code {
    font-family: var(--font-mono);
    color: #f0f0f0;
  }

  @media (max-width: 768px) {
    padding: 4.5rem 1.25rem 2rem;
  }
`;

const Warning = styled.p`
  border: 1px solid #a16207;
  background: rgba(161, 98, 7, 0.18);
  border-radius: 6px;
  padding: 0.6rem 0.8rem;
  margin-bottom: 1rem;
`;

const SampleGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
  margin-top: 0.75rem;

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const HtmlSample = styled.div`
  padding: 0.75rem 0.9rem;
  border-radius: 6px;
  background: ${({ $dark }) => ($dark ? '#000' : '#fff')};
  color: ${({ $dark }) => ($dark ? '#fff' : '#000')};

  div {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.45;
  }
`;

const SynthGrid = styled.div`
  display: grid;
  grid-template-columns: 6.5rem 1fr 1fr;
  gap: 0.5rem 0.75rem;
  align-items: center;
  margin-top: 0.75rem;

  > span {
    font-size: 0.85rem;
    font-weight: 600;
    color: #d4d4d4;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
`;

const CanvasBox = styled.div`
  position: relative;
  height: ${({ $h }) => $h}px;
  border-radius: 4px;
  overflow: hidden;
`;

const TileRow = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.75rem;
  margin-top: 0.75rem;

  figcaption {
    font-size: 0.8rem;
    color: #a3a3a3;
    margin-top: 0.35rem;
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/**
 * Simulated subpixel anti-aliasing: glyphs are rasterized at 3x horizontal resolution, then each
 * device pixel's R, G and B channels take the coverage of the subpixel they'd sit on for the given
 * layout. 'gray' averages the three samples instead (plain grayscale anti-aliasing).
 */
function drawSynthText(ctx, { width, height, dpr }, { layout, dark, family, weight }) {
  const fg = dark ? 255 : 0;
  const bg = dark ? 0 : 255;
  ctx.fillStyle = dark ? '#000' : '#fff';
  ctx.fillRect(0, 0, width, height);

  const ow = width * 3;
  const off = document.createElement('canvas');
  off.width = ow;
  off.height = height;
  const o = off.getContext('2d', { willReadFrequently: true });
  o.fillStyle = '#000';
  o.fillRect(0, 0, ow, height);
  o.setTransform(3, 0, 0, 1, 0, 0);
  o.fillStyle = '#fff';
  o.textBaseline = 'alphabetic';
  let y = Math.round(4 * dpr);
  for (const s of SYNTH_SIZES) {
    const px = Math.round(s * dpr);
    o.font = `${weight} ${px}px ${family}`;
    y += Math.round(px * 1.3);
    o.fillText(SYNTH_SAMPLE, Math.round(8 * dpr), y);
  }

  const src = o.getImageData(0, 0, ow, height).data;
  const out = ctx.createImageData(width, height);
  const d = out.data;
  const cov = new Float32Array(ow);
  for (let row = 0; row < height; row++) {
    const base = row * ow;
    for (let i = 0; i < ow; i++) cov[i] = src[(base + i) * 4] / 255;
    const at = (i) => cov[clamp(i, 0, ow - 1)];
    const sub = (i) => (at(i - 2) + 2 * at(i - 1) + 3 * at(i) + 2 * at(i + 1) + at(i + 2)) / 9;
    for (let x = 0; x < width; x++) {
      const c = 3 * x;
      let r;
      let g;
      let b;
      if (layout === 'gray') {
        r = g = b = (cov[c] + cov[c + 1] + cov[c + 2]) / 3;
      } else if (layout === 'rgb') {
        r = sub(c);
        g = sub(c + 1);
        b = sub(c + 2);
      } else {
        b = sub(c);
        g = sub(c + 1);
        r = sub(c + 2);
      }
      const p = (row * width + x) * 4;
      d[p] = bg + (fg - bg) * r;
      d[p + 1] = bg + (fg - bg) * g;
      d[p + 2] = bg + (fg - bg) * b;
      d[p + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
}

function drawTile(ctx, { width, height }, kind) {
  const img = ctx.createImageData(width, height);
  const d = img.data;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let rgb;
      if (kind === 'white-lines') rgb = x % 2 === 0 ? [255, 255, 255] : [0, 0, 0];
      else if (kind === 'black-lines') rgb = x % 2 === 0 ? [0, 0, 0] : [255, 255, 255];
      else if (kind === 'rgb-columns') rgb = [[255, 0, 0], [0, 255, 0], [0, 0, 255]][x % 3];
      else rgb = x % 4 === 0 && y % 4 === 0 ? [255, 255, 255] : [0, 0, 0];
      const p = (y * width + x) * 4;
      d[p] = rgb[0];
      d[p + 1] = rgb[1];
      d[p + 2] = rgb[2];
      d[p + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
}

const TILES = [
  { kind: 'white-lines', caption: '1px white lines on black' },
  { kind: 'black-lines', caption: '1px black lines on white' },
  { kind: 'rgb-columns', caption: '1px red / green / blue columns' },
  { kind: 'dots', caption: 'Single white pixels' },
];

const LAYOUT_ROWS = [
  { layout: 'gray', label: 'Grayscale' },
  { layout: 'rgb', label: 'RGB stripe' },
  { layout: 'bgr', label: 'BGR stripe' },
];

function FringingView({ family, weight, fontTick }) {
  const [inexact, setInexact] = useState(false);
  const onInfo = useCallback((info) => {
    if (info.width) setInexact(!info.exact);
  }, []);
  const synthHeight = 4 + SYNTH_SIZES.reduce((sum, s) => sum + Math.round(s * 1.3), 0) + 8;

  return (
    <Scroll>
      <FringeLayout>
        {inexact ? <Warning>{SCALING_WARNING}</Warning> : null}

        <h2>1. Your browser’s real text rendering</h2>
        <p>
          Drawn by your operating system and browser, exactly like web pages and apps. Look at vertical
          strokes (l, I, |) up close: a <strong>red edge on one side and blue on the other</strong> means
          subpixel anti-aliasing (ClearType on Windows). Neutral gray edges mean grayscale smoothing (macOS,
          most phones, or ClearType turned off).
        </p>
        <SampleGrid>
          {[false, true].map((dark) => (
            <HtmlSample key={String(dark)} $dark={dark} style={{ fontFamily: family, fontWeight: weight }}>
              {[10, 12, 14, 16].map((s) => (
                <div key={s} style={{ fontSize: s }}>
                  {s}px · The quick brown fox jumps over the lazy dog Il1| 0O
                </div>
              ))}
            </HtmlSample>
          ))}
        </SampleGrid>

        <h2>2. Which subpixel layout suits your panel?</h2>
        <p>
          These samples are generated pixel by pixel by this page, not by your OS, so they look the same on
          every computer. Each one is anti-aliased for a different subpixel layout. The row that looks
          sharpest with the least colored halo is the best match for your screen:
        </p>
        <ul>
          <li>
            <strong>RGB stripe</strong> looks cleanest on most LCD monitors and laptops.
          </li>
          <li>
            <strong>BGR stripe</strong> looks cleanest on some LCDs and TVs, and on stripe panels rotated
            180°.
          </li>
          <li>
            On <strong>QD-OLED</strong> (triangular subpixels) and <strong>WOLED</strong> (red, white, blue,
            green) both stripe rows fringe, because neither matches the panel; grayscale usually looks best.
            Portrait-rotated monitors also favor grayscale.
          </li>
        </ul>
        <SynthGrid>
          <span />
          <span>Black on white</span>
          <span>White on black</span>
          {LAYOUT_ROWS.map(({ layout, label }) => (
            <div key={layout} style={{ display: 'contents' }}>
              <span>{label}</span>
              {[false, true].map((dark) => (
                <CanvasBox key={String(dark)} $h={synthHeight}>
                  <PixelCanvas
                    draw={(ctx, info) => drawSynthText(ctx, info, { layout, dark, family, weight })}
                    deps={[family, weight, fontTick]}
                    onInfo={layout === 'gray' && !dark ? onInfo : undefined}
                    aria-hidden="true"
                  />
                </CanvasBox>
              ))}
            </div>
          ))}
        </SynthGrid>

        <h2>3. Pixel structure patterns</h2>
        <p>
          With a magnifier or a phone camera in macro / 2–3× zoom mode, these tiles reveal the physical
          subpixel layout: three vertical stripes per pixel on most LCDs, a triangle of dots on QD-OLED, and
          four stripes including a white one on WOLED. At normal distance the line tiles should look like an
          even gray, not shimmer or show bands.
        </p>
        <TileRow>
          {TILES.map((t) => (
            <figure key={t.kind} style={{ margin: 0 }}>
              <CanvasBox $h={90}>
                <PixelCanvas draw={(ctx, info) => drawTile(ctx, info, t.kind)} aria-hidden="true" />
              </CanvasBox>
              <figcaption>{t.caption}</figcaption>
            </figure>
          ))}
        </TileRow>

        <h2>Reducing fringing</h2>
        <ul>
          <li>
            <strong>Windows:</strong> press Start, type <code>cttune</code> (“Adjust ClearType text”) and run
            the wizard on each monitor at its native resolution, choosing the sample that looks best to you.
            Most Windows browsers and apps follow this setting.
          </li>
          <li>
            Turning ClearType <strong>off</strong> in the same wizard switches most apps to grayscale
            smoothing, which many OLED owners prefer.
          </li>
          <li>
            ClearType only knows RGB and BGR stripes. On QD-OLED and WOLED it can reduce fringing but cannot
            remove it; some apps also use their own text rendering and ignore the setting.
          </li>
          <li>
            Higher pixel density or 150–200% scaling makes every glyph span more subpixels, which hides
            fringing far better than any setting.
          </li>
          <li>
            <strong>macOS</strong> uses grayscale smoothing only. Soft text there usually means a scaled “looks
            like” resolution rather than an anti-aliasing problem.
          </li>
        </ul>
      </FringeLayout>
    </Scroll>
  );
}

const TextClarityTest = () => {
  const [font, setFont] = useState(DEFAULTS.font);
  const [size, setSize] = useState(DEFAULTS.size);
  const [weight, setWeight] = useState(DEFAULTS.weight);
  const [lineHeight, setLineHeight] = useState(DEFAULTS.lineHeight);
  const [letterSpacing, setLetterSpacing] = useState(DEFAULTS.letterSpacing);
  const [scheme, setScheme] = useState(DEFAULTS.scheme);
  const [view, setView] = useState(DEFAULTS.view);
  const [fontTick, setFontTick] = useState(0);
  const [dpr, setDpr] = useState(1);

  const family = FONT_BY_ID[font].css;
  const colors = SCHEME_BY_ID[scheme];

  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = GOOGLE_FONTS_URL;
    document.head.appendChild(link);
    const bump = () => setFontTick((n) => n + 1);
    document.fonts?.addEventListener?.('loadingdone', bump);
    return () => {
      document.fonts?.removeEventListener?.('loadingdone', bump);
      link.remove();
    };
  }, []);

  useEffect(() => {
    document.fonts
      ?.load(`${weight} 16px ${family}`)
      .then(() => setFontTick((n) => n + 1))
      .catch(() => {});
  }, [family, weight]);

  useEffect(() => {
    const update = () => setDpr(window.devicePixelRatio || 1);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const handleReset = () => {
    setFont(DEFAULTS.font);
    setSize(DEFAULTS.size);
    setWeight(DEFAULTS.weight);
    setLineHeight(DEFAULTS.lineHeight);
    setLetterSpacing(DEFAULTS.letterSpacing);
    setScheme(DEFAULTS.scheme);
    setView(DEFAULTS.view);
  };

  const cycle = (list, current, set) => {
    const i = list.findIndex((o) => o.value === current);
    set(list[(i + 1) % list.length].value);
  };

  const shortcuts = [
    { key: 'ArrowUp', label: 'Larger text', action: () => setSize((s) => Math.min(72, s + 1)) },
    { key: 'ArrowDown', label: 'Smaller text', action: () => setSize((s) => Math.max(8, s - 1)) },
    { key: 'v', label: 'Next view', action: () => cycle(VIEWS, view, setView) },
    { key: 'c', label: 'Next color scheme', action: () => cycle(SCHEMES, scheme, setScheme) },
  ];

  const textStyle = {
    fontFamily: family,
    fontWeight: weight,
    lineHeight,
    letterSpacing: `${letterSpacing}px`,
    color: colors.fg,
  };
  const devicePx = (s) => {
    const v = s * dpr;
    return Number.isInteger(v) ? String(v) : v.toFixed(1);
  };

  return (
    <TestShell
      title="Text Clarity"
      description="Check how sharp and comfortable text is on your display. Paragraphs and Tiny sizes use your real OS text rendering; Fringing compares anti-aliasing for different subpixel layouts."
      onReset={handleReset}
      shortcuts={shortcuts}
      style={{ background: view === 'fringing' ? '#161616' : colors.bg }}
      controls={
        <>
          <Section>
            <h3>View</h3>
            <Segmented options={VIEWS} value={view} onChange={setView} columns={3} />
          </Section>

          <Section>
            <h3>Font</h3>
            <Select value={font} onChange={setFont} options={FONTS} />
            <Hint>
              Roboto, Source Serif 4 and JetBrains Mono load from Google Fonts; if blocked, text falls back to a
              similar system font.
            </Hint>
          </Section>

          {view !== 'fringing' ? (
            <Section>
              <h3>Text</h3>
              {view === 'text' ? (
                <Slider label="Size" value={size} min={8} max={72} onChange={setSize} format={(v) => `${v}px`} />
              ) : null}
              <Slider
                label="Weight"
                value={weight}
                min={300}
                max={700}
                step={100}
                onChange={setWeight}
                hint="Some system fonts only have regular and bold weights."
              />
              <Slider
                label="Line height"
                value={lineHeight}
                min={1}
                max={2.2}
                step={0.05}
                onChange={setLineHeight}
                format={(v) => v.toFixed(2)}
              />
              <Slider
                label="Letter spacing"
                value={letterSpacing}
                min={-1}
                max={5}
                step={0.25}
                onChange={setLetterSpacing}
                format={(v) => `${v}px`}
              />
            </Section>
          ) : (
            <Section>
              <h3>Text</h3>
              <Slider label="Weight" value={weight} min={300} max={700} step={100} onChange={setWeight} />
            </Section>
          )}

          {view !== 'fringing' ? (
            <Section>
              <h3>Colors</h3>
              <Segmented options={SCHEMES} value={scheme} onChange={setScheme} columns={2} />
            </Section>
          ) : null}

          <Hint>
            Sizes are CSS pixels. At your current scaling, 1 CSS px = {devicePx(1)} device px.
          </Hint>
        </>
      }
    >
      {view === 'text' ? (
        <Fill style={{ background: colors.bg }}>
          <Columns style={{ ...textStyle, fontSize: size }}>
            {[...PARAGRAPHS, ...PARAGRAPHS].map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </Columns>
        </Fill>
      ) : null}

      {view === 'ladder' ? (
        <Fill style={{ background: colors.bg }}>
          <Ladder style={{ color: colors.fg }}>
            {LADDER_SIZES.map((s) => (
              <LadderRow key={s}>
                <span>
                  {s}px · {devicePx(s)} device px
                </span>
                <span style={{ ...textStyle, fontSize: s }}>{LADDER_SAMPLE}</span>
              </LadderRow>
            ))}
          </Ladder>
        </Fill>
      ) : null}

      {view === 'fringing' ? <FringingView family={family} weight={weight} fontTick={fontTick} /> : null}
    </TestShell>
  );
};

export default TextClarityTest;
