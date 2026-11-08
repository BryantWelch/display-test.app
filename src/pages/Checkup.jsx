import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import Breadcrumbs from '../components/Breadcrumbs';
import { Page, Eyebrow, H1, Lead, Button, Card, Meta } from '../components/ui';
import { Inline } from '../lib/markup';
import { getTest, tests, testPath, infoPath, loadFullEntry, prefetchTest } from '../registry';
import { getRouteMeta } from '../registry/routeMeta';
import { enterTestFullscreen } from '../utils/fullscreen';
import { getDisplayInfo } from '../utils/displayInfo';
import { measureRefreshRate } from '../utils/frameTiming';
import { loadCheckup, saveCheckup, resetCheckup, RESULT_LABELS } from '../utils/checkupStore';

const PANELS = [
  { id: 'unknown', label: 'Not sure' },
  { id: 'ips', label: 'IPS LCD' },
  { id: 'va', label: 'VA LCD' },
  { id: 'tn', label: 'TN LCD' },
  { id: 'mini-led', label: 'Mini-LED / local dimming' },
  { id: 'oled', label: 'OLED' },
];

const PANEL_STEPS = {
  ips: [{ slug: 'viewing-angle', step: 90, question: 'Is IPS glow in dark corners acceptable from your normal seat?' }],
  va: [{ slug: 'viewing-angle', step: 90, question: 'Do colors and shadows stay acceptable from your normal seat?' }],
  tn: [{ slug: 'viewing-angle', step: 90, question: 'Is the vertical color shift acceptable from your normal seat?' }],
  'mini-led': [{ slug: 'local-dimming', step: 90, question: 'Is blooming around bright objects acceptable?' }],
  oled: [{ slug: 'burn-in', step: 90, question: 'Are uniform gray screens free of ghost images?' }],
};

const CODES = { pass: 'p', minor: 'm', fail: 'f', skip: 's' };
const DECODE = Object.fromEntries(Object.entries(CODES).map(([k, v]) => [v, k]));

function buildSteps(panel) {
  const base = tests
    .filter((t) => t.checkup?.step)
    .map((t) => ({ slug: t.slug, step: t.checkup.step, question: t.checkup.question }));
  const extras = (PANEL_STEPS[panel] || []).filter((e) => getTest(e.slug) && !base.some((b) => b.slug === e.slug));
  return [...base, ...extras].sort((a, b) => a.step - b.step).map((s) => ({ ...s, test: getTest(s.slug) }));
}

function encodeReport(state) {
  const r = Object.entries(state.results)
    .map(([slug, res]) => `${slug}:${CODES[res] || 's'}`)
    .join(',');
  const d = state.displayInfo;
  const parts = [`r=${r}`, `p=${state.panel || 'unknown'}`];
  if (d) parts.push(`d=${d.physicalWidth}x${d.physicalHeight}@${d.hz || 0}`);
  return parts.join('&');
}

function decodeReport(hash) {
  const params = new URLSearchParams(hash.replace(/^#/, ''));
  if (!params.has('r')) return null;
  const results = {};
  params
    .get('r')
    .split(',')
    .filter(Boolean)
    .forEach((pair) => {
      const [slug, code] = pair.split(':');
      if (getTest(slug) && DECODE[code]) results[slug] = DECODE[code];
    });
  const [res, hz] = (params.get('d') || '').split('@');
  const [w, h] = (res || '').split('x').map(Number);
  return {
    results,
    notes: {},
    panel: PANELS.some((p) => p.id === params.get('p')) ? params.get('p') : 'unknown',
    displayInfo: w && h ? { physicalWidth: w, physicalHeight: h, hz: Number(hz) || null } : null,
    shared: true,
  };
}

function reportText(state, steps) {
  const d = state.displayInfo;
  const lines = ['Display Test — New monitor checkup', ''];
  if (d) {
    lines.push(`Resolution: ${d.physicalWidth} x ${d.physicalHeight}${d.hz ? ` @ ${d.hz} Hz` : ''}`);
    if (d.scalingPercent) lines.push(`OS scaling: ${d.scalingPercent}%`);
    if (d.gamut) lines.push(`Color gamut: ${d.gamut}${d.dynamicRange ? `, ${d.dynamicRange}` : ''}`);
  }
  lines.push(`Panel: ${PANELS.find((p) => p.id === state.panel)?.label || 'Not sure'}`, '');
  steps.forEach((s, i) => {
    const res = state.results[s.slug];
    lines.push(`${i + 1}. ${s.test.name}: ${res ? RESULT_LABELS[res] : 'Not run'}`);
  });
  lines.push('', 'Generated with https://display-test.app/checkup');
  return lines.join('\n');
}

const Grid2 = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 320px;
  gap: 2rem;
  margin-top: 2rem;
  align-items: start;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
`;

const Progress = styled.div`
  height: 8px;
  border-radius: 999px;
  background: var(--surface-3);
  overflow: hidden;
  margin: 0.75rem 0 1.5rem;

  span {
    display: block;
    height: 100%;
    background: var(--accent);
    transition: width 0.3s ease;
  }
`;

const Steps = styled.ol`
  list-style: none;
  display: grid;
  gap: 0.75rem;
  padding: 0;
`;

const tone = {
  pass: css`
    color: #052e16;
    background: var(--success);
  `,
  minor: css`
    color: #422006;
    background: var(--warning);
  `,
  fail: css`
    color: #fff;
    background: var(--danger);
  `,
  skip: css`
    color: var(--text-muted);
    background: var(--surface-3);
  `,
};

const Status = styled.span`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  white-space: nowrap;
  ${({ $result }) => tone[$result] || tone.skip}
`;

const StepCard = styled.li`
  display: grid;
  grid-template-columns: 2.25rem minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem 1.15rem;
  background: var(--surface);
  border: 1px solid ${({ $current }) => ($current ? 'var(--accent)' : 'var(--border)')};
  border-radius: var(--radius);

  > b {
    display: grid;
    place-items: center;
    width: 2.25rem;
    height: 2.25rem;
    border-radius: 50%;
    background: var(--surface-2);
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  h3 {
    font-size: 1.02rem;
    margin-bottom: 0.2rem;
  }

  h3 a {
    color: var(--text);
  }

  p {
    color: var(--text-muted);
    font-size: 0.92rem;
  }

  .actions {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  @media (max-width: 640px) {
    grid-template-columns: 2.25rem minmax(0, 1fr);

    .actions {
      grid-column: 1 / -1;
      justify-content: flex-start;
    }
  }
`;

const SmallButton = styled(Button)`
  min-height: 40px;
  padding: 0.5rem 1rem;
  font-size: 0.92rem;
`;

const SideCard = styled(Card)`
  display: grid;
  gap: 0.9rem;

  h2 {
    font-size: 1.05rem;
  }

  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 0.4rem 1rem;
    font-size: 0.92rem;
  }

  dt {
    color: var(--text-subtle);
  }

  dd {
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

const PanelPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;

  button {
    min-height: 40px;
    padding: 0.4rem 0.8rem;
    border-radius: 999px;
    border: 1px solid var(--border-strong);
    background: var(--surface-2);
    color: var(--text-muted);
    font-size: 0.88rem;
    cursor: pointer;
  }

  button[aria-pressed='true'] {
    background: var(--accent-soft);
    border-color: var(--accent);
    color: var(--text);
  }
`;

const Verdict = styled(Card)`
  margin-top: 2rem;
  border-color: ${({ $tone }) =>
    $tone === 'fail' ? 'var(--danger)' : $tone === 'minor' ? 'var(--warning)' : 'var(--success)'};

  h2 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-muted);
    line-height: 1.7;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.6rem;
    margin-top: 1.25rem;
  }

  @media print {
    .row {
      display: none;
    }
  }
`;

const EMPTY = { results: {}, notes: {}, startedAt: null, panel: 'unknown', displayInfo: null };

const Checkup = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [state, setState] = useState(EMPTY);
  const [measuring, setMeasuring] = useState(false);
  const [flash, setFlash] = useState('');

  useEffect(() => {
    const shared = decodeReport(window.location.hash);
    setState(shared || { ...EMPTY, ...loadCheckup() });
    setMounted(true);
    const sync = () => setState((s) => (s.shared ? s : { ...EMPTY, ...loadCheckup() }));
    window.addEventListener('checkup-change', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('checkup-change', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const update = useCallback((patch) => {
    const next = { ...loadCheckup(), ...patch };
    saveCheckup(next);
  }, []);

  const snapshot = useCallback(async () => {
    setMeasuring(true);
    const info = getDisplayInfo();
    const timing = await measureRefreshRate({ durationMs: 1500 });
    update({ displayInfo: { ...info, hz: timing?.snappedHz ?? null, rawHz: timing?.hz ?? null } });
    setMeasuring(false);
  }, [update]);

  useEffect(() => {
    if (mounted && !state.shared && !state.displayInfo) snapshot();
  }, [mounted, state.shared, state.displayInfo, snapshot]);

  const steps = useMemo(() => buildSteps(state.panel), [state.panel]);
  const done = steps.filter((s) => state.results[s.slug]).length;
  const current = steps.find((s) => !state.results[s.slug]);
  const counts = steps.reduce((acc, s) => {
    const r = state.results[s.slug];
    if (r) acc[r] = (acc[r] || 0) + 1;
    return acc;
  }, {});

  const run = async (step) => {
    prefetchTest(step.test);
    loadFullEntry(step.test).catch(() => {});
    if (!state.startedAt) update({ startedAt: new Date().toISOString() });
    if (step.test.load) {
      try {
        await enterTestFullscreen();
      } catch {
        // fullscreen refused; test still works windowed
      }
      navigate(`${testPath(step.test)}?checkup=1`);
    } else {
      navigate(`${infoPath(step.test)}?checkup=1`);
    }
  };

  const setResult = (slug, result) => {
    const s = loadCheckup();
    update({ results: { ...s.results, [slug]: result } });
  };

  const copy = async (text, message) => {
    try {
      await navigator.clipboard.writeText(text);
      setFlash(message);
    } catch {
      setFlash('Copy failed — your browser blocked clipboard access');
    }
    setTimeout(() => setFlash(''), 2500);
  };

  const shareUrl = () => `${window.location.origin}/checkup#${encodeReport(state)}`;

  const verdict = counts.fail ? 'fail' : counts.minor ? 'minor' : 'pass';
  const d = state.displayInfo;

  return (
    <Page>
      <Breadcrumbs items={getRouteMeta('/checkup').breadcrumbs} />
      <Eyebrow>Guided checkup</Eyebrow>
      <H1>New monitor checkup</H1>
      <Lead>
        Work through the tests that matter inside a return window, in a sensible order. Each test opens
        with a Pass / Minor issue / Fail prompt, and your answers are saved in this browser so you can come back
        later and share a report.
      </Lead>

      {state.shared ? (
        <Card style={{ marginTop: '1.5rem' }}>
          <p>
            <strong>You are viewing a shared report.</strong> It is read-only and is not saved to this browser.
          </p>
          <div style={{ marginTop: '0.75rem' }}>
            <SmallButton
              type="button"
              $variant="secondary"
              onClick={() => {
                window.history.replaceState(null, '', '/checkup');
                setState({ ...EMPTY, ...loadCheckup() });
              }}
            >
              Start my own checkup
            </SmallButton>
          </div>
        </Card>
      ) : null}

      <Grid2>
        <section aria-labelledby="steps-heading">
          <h2 id="steps-heading" style={{ fontSize: '1.2rem' }}>
            Steps {mounted ? `— ${done} of ${steps.length} done` : ''}
          </h2>
          <Progress aria-hidden="true">
            <span style={{ width: `${steps.length ? (done / steps.length) * 100 : 0}%` }} />
          </Progress>

          <Steps>
            {steps.map((step, i) => {
              const result = mounted ? state.results[step.slug] : undefined;
              const isCurrent = mounted && !state.shared && current?.slug === step.slug;
              return (
                <StepCard key={step.slug} $current={isCurrent}>
                  <b aria-hidden="true">{i + 1}</b>
                  <div>
                    <h3>
                      <Link to={infoPath(step.test)}>{step.test.name}</Link>
                    </h3>
                    <p>{step.question || step.test.summary}</p>
                    {step.slug === 'refresh-rate' && mounted && d?.hz ? (
                      <p>
                        Measured here: <strong>{d.hz} Hz</strong>
                      </p>
                    ) : null}
                  </div>
                  <div className="actions">
                    {result ? <Status $result={result}>{RESULT_LABELS[result]}</Status> : null}
                    {!state.shared ? (
                      <>
                        <SmallButton
                          type="button"
                          $variant={isCurrent ? undefined : 'secondary'}
                          onClick={() => run(step)}
                          onPointerEnter={() => prefetchTest(step.test)}
                          onFocus={() => prefetchTest(step.test)}
                        >
                          {result ? 'Retest' : 'Run test'}
                        </SmallButton>
                        {!result ? (
                          <SmallButton type="button" $variant="ghost" onClick={() => setResult(step.slug, 'skip')}>
                            Skip
                          </SmallButton>
                        ) : null}
                      </>
                    ) : null}
                  </div>
                </StepCard>
              );
            })}
          </Steps>

          {mounted && done > 0 ? (
            <Verdict $tone={verdict}>
              <h2>
                {done < steps.length ? 'Report so far' : 'Report'}: {counts.pass || 0} pass, {counts.minor || 0} minor,{' '}
                {counts.fail || 0} fail
                {counts.skip ? `, ${counts.skip} skipped` : ''}
              </h2>
              <p>
                <Inline
                  text={
                    verdict === 'fail'
                      ? 'At least one test failed. If you are still inside the return window, document it now (photos with the test pattern visible, your settings) and read [how dead pixel and defect policies work](/guides/dead-pixel-policies) before contacting the seller.'
                      : verdict === 'minor'
                        ? 'Some minor issues. Many are normal for the panel type — check the "What you should see" notes on each test page, and the [symptom checker](/guides/symptom-checker) for fixes you can try in settings.'
                        : 'Everything you checked passed. Keep this report in case anything changes during the warranty period.'
                  }
                />
              </p>
              {!state.shared ? (
                <div className="row">
                  <SmallButton type="button" onClick={() => copy(reportText(state, steps), 'Report copied')}>
                    Copy report
                  </SmallButton>
                  <SmallButton type="button" $variant="secondary" onClick={() => copy(shareUrl(), 'Share link copied')}>
                    Copy share link
                  </SmallButton>
                  <SmallButton type="button" $variant="secondary" onClick={() => window.print()}>
                    Print
                  </SmallButton>
                  <SmallButton
                    type="button"
                    $variant="ghost"
                    onClick={() => {
                      if (window.confirm('Clear all checkup results?')) resetCheckup();
                    }}
                  >
                    Start over
                  </SmallButton>
                </div>
              ) : null}
              <p role="status" aria-live="polite" style={{ marginTop: '0.75rem', minHeight: '1.5em' }}>
                {flash}
              </p>
            </Verdict>
          ) : null}
        </section>

        <aside style={{ display: 'grid', gap: '1rem' }}>
          <SideCard>
            <h2>This display</h2>
            {mounted && d ? (
              <dl>
                <dt>Resolution</dt>
                <dd>
                  {d.physicalWidth} × {d.physicalHeight}
                </dd>
                <dt>Refresh rate</dt>
                <dd>{measuring ? 'Measuring…' : d.hz ? `${d.hz} Hz` : 'Not measured — keep this tab in front and re-detect'}</dd>
                {d.scalingPercent ? (
                  <>
                    <dt>OS scaling</dt>
                    <dd>{d.scalingPercent}%</dd>
                  </>
                ) : null}
                {d.gamut !== undefined ? (
                  <>
                    <dt>Gamut / range</dt>
                    <dd>
                      {d.gamut || 'Not reported'} / {d.dynamicRange || 'Not reported'}
                    </dd>
                  </>
                ) : null}
              </dl>
            ) : (
              <Meta>{mounted ? 'Measuring…' : 'Detected when the page loads.'}</Meta>
            )}
            {mounted && !state.shared ? (
              <SmallButton type="button" $variant="secondary" onClick={snapshot} disabled={measuring}>
                Re-detect (after moving the window)
              </SmallButton>
            ) : null}
            <Meta style={{ marginTop: 0 }}>
              Run the checkup on the monitor you are testing. Resolution is CSS pixels × scaling, as reported by the
              browser.
            </Meta>
          </SideCard>

          <SideCard>
            <h2 id="panel-heading">Panel type</h2>
            <PanelPicker role="group" aria-labelledby="panel-heading">
              {PANELS.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  aria-pressed={(mounted ? state.panel : 'unknown') === p.id}
                  disabled={state.shared}
                  onClick={() => update({ panel: p.id })}
                >
                  {p.label}
                </button>
              ))}
            </PanelPicker>
            <Meta style={{ marginTop: 0 }}>Adds the panel-specific check (glow, blooming, or burn-in).</Meta>
          </SideCard>

          <SideCard>
            <h2>Before you start</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
              <Inline text="Let the monitor warm up for 15–30 minutes, set native resolution, and turn off dynamic contrast and eco modes. The [setup checklist](/guides/setup-checklist) covers the rest." />
            </p>
          </SideCard>
        </aside>
      </Grid2>
    </Page>
  );
};

export default Checkup;
