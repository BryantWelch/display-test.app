import { useCallback, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import TestShell, {
  Section,
  Segmented,
  Slider,
  ColorSwatches,
  Readout,
  Button,
  ButtonRow,
  Hint,
} from '../../components/TestShell';
import { formatTime, useWakeLock } from '../../hooks/useWakeLock';

const CHECK_COLORS = [
  { name: '18% gray', value: '#2e2e2e' },
  { name: '50% gray', value: '#808080' },
  { name: 'Red', value: '#ff0000' },
  { name: 'Green', value: '#00ff00' },
  { name: 'Blue', value: '#0000ff' },
  { name: 'Cyan', value: '#00ffff' },
];

const MODES = [
  { value: 'check', label: 'Check' },
  { value: 'retention', label: 'Retention' },
  { value: 'refresher', label: 'Refresher' },
];

const REFRESH_PATTERNS = [
  { value: 'bar', label: 'White bar', title: 'A full-height white bar slowly crossing black' },
  { value: 'invert', label: 'Inverted', title: 'Static negative of the retention pattern' },
  { value: 'cycle', label: 'Color cycle', title: 'Slow, smooth full-screen hue cycle' },
];

const REFRESH_MINUTES = [5, 10, 20, 30, 60].map((m) => ({ value: m, label: `${m} min` }));

const REVEAL_GRAY = '#808080';

const WAKE_LABELS = {
  off: 'Not needed',
  on: 'On — screen stays awake',
  released: 'Released — keep the tab visible',
  denied: 'Blocked — disable sleep manually',
  unsupported: 'Not supported — disable sleep manually',
};

const Fill = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
`;

const sweep = keyframes`
  from { transform: translateX(-20vw); }
  to { transform: translateX(100vw); }
`;

const SweepBar = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 18vw;
  background: #fff;
  animation: ${sweep} 14s linear infinite;
`;

const hueCycle = keyframes`
  0% { background: hsl(0, 100%, 50%); }
  16.6% { background: hsl(60, 100%, 50%); }
  33.3% { background: hsl(120, 100%, 50%); }
  50% { background: hsl(180, 100%, 50%); }
  66.6% { background: hsl(240, 100%, 50%); }
  83.3% { background: hsl(300, 100%, 50%); }
  100% { background: hsl(360, 100%, 50%); }
`;

const HueCycle = styled(Fill)`
  animation: ${hueCycle} 60s linear infinite;
`;

/** Static high-contrast "desktop": taskbar, channel logo, game HUD, crosshair. */
const RetentionPattern = ({ inverted }) => {
  const bg = inverted ? '#fff' : '#000';
  const fg = inverted ? '#000' : '#fff';
  return (
    <Fill style={{ background: bg }}>
      <div
        style={{
          position: 'absolute',
          left: '3vw',
          top: '4vh',
          padding: '1.2vh 1.6vw',
          border: `0.6vh solid ${fg}`,
          borderRadius: '1vh',
          color: fg,
          font: '800 5vh/1 system-ui, sans-serif',
          letterSpacing: '0.1em',
        }}
      >
        NEWS 24
      </div>
      <div
        style={{
          position: 'absolute',
          right: '3vw',
          top: '4vh',
          padding: '0.8vh 1.2vw',
          background: fg,
          color: bg,
          font: '800 3.5vh/1 system-ui, sans-serif',
        }}
      >
        ● LIVE
      </div>
      <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
        <div style={{ width: '6vh', height: '0.6vh', background: fg }} />
        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            width: '0.6vh',
            height: '6vh',
            background: fg,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
      <div style={{ position: 'absolute', left: '3vw', bottom: '12vh', display: 'flex', gap: '0.6vw' }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{ width: '2.4vw', height: '3vh', background: i < 7 ? fg : 'transparent', border: `0.3vh solid ${fg}` }} />
        ))}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: '7vh',
          background: fg,
          display: 'flex',
          alignItems: 'center',
          gap: '1.2vw',
          padding: '0 2vw',
        }}
      >
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ width: '4vh', height: '4vh', borderRadius: '0.8vh', background: bg }} />
        ))}
        <div style={{ marginLeft: 'auto', color: bg, font: '700 3.2vh/1 system-ui, sans-serif' }}>12:00</div>
      </div>
    </Fill>
  );
};

const DEFAULTS = { mode: 'check', colorIndex: 1, retentionMinutes: 3, refreshPattern: 'bar', refreshMinutes: 10 };

const BurnInTest = () => {
  const [mode, setMode] = useState(DEFAULTS.mode);
  const [colorIndex, setColorIndex] = useState(DEFAULTS.colorIndex);
  const [retentionMinutes, setRetentionMinutes] = useState(DEFAULTS.retentionMinutes);
  const [refreshPattern, setRefreshPattern] = useState(DEFAULTS.refreshPattern);
  const [refreshMinutes, setRefreshMinutes] = useState(DEFAULTS.refreshMinutes);
  // phase: idle | running | done. For retention, "done" is the 50% gray reveal.
  const [phase, setPhase] = useState('idle');
  const [endAt, setEndAt] = useState(0);
  const [doneAt, setDoneAt] = useState(0);
  const [now, setNow] = useState(() => Date.now());

  const wake = useWakeLock(phase === 'running' || (mode === 'retention' && phase === 'done'));

  useEffect(() => {
    if (phase === 'idle' || mode === 'check') return undefined;
    const id = setInterval(() => {
      const t = Date.now();
      setNow(t);
      if (phase === 'running' && t >= endAt) {
        setPhase('done');
        setDoneAt(t);
      }
    }, 500);
    return () => clearInterval(id);
  }, [phase, endAt, mode]);

  const stop = useCallback(() => setPhase('idle'), []);

  const start = useCallback(() => {
    const t = Date.now();
    const minutes = mode === 'retention' ? retentionMinutes : refreshMinutes;
    setNow(t);
    setEndAt(t + minutes * 60_000);
    setPhase('running');
  }, [mode, retentionMinutes, refreshMinutes]);

  const changeMode = (m) => {
    setMode(m);
    setPhase('idle');
  };

  const stepColor = (dir) => setColorIndex((i) => (i + dir + CHECK_COLORS.length) % CHECK_COLORS.length);

  const handleReset = () => {
    setMode(DEFAULTS.mode);
    setColorIndex(DEFAULTS.colorIndex);
    setRetentionMinutes(DEFAULTS.retentionMinutes);
    setRefreshPattern(DEFAULTS.refreshPattern);
    setRefreshMinutes(DEFAULTS.refreshMinutes);
    setPhase('idle');
  };

  const shortcuts = [
    { key: '1', label: 'Check for burn-in', action: () => changeMode('check') },
    { key: '2', label: 'Retention test', action: () => changeMode('retention') },
    { key: '3', label: 'Refresher', action: () => changeMode('refresher') },
    ...(mode === 'check'
      ? [
          { key: ['ArrowRight', ' '], label: 'Next color', action: () => stepColor(1) },
          { key: 'ArrowLeft', label: 'Previous color', action: () => stepColor(-1) },
        ]
      : [{ key: ' ', label: 'Start / stop', action: () => (phase === 'idle' ? start() : stop()) }]),
  ];

  let surface;
  if (mode === 'check') {
    surface = <Fill style={{ background: CHECK_COLORS[colorIndex].value }} onClick={() => stepColor(1)} />;
  } else if (phase !== 'running') {
    surface = <Fill style={{ background: REVEAL_GRAY }} />;
  } else if (mode === 'retention') {
    surface = <RetentionPattern />;
  } else if (refreshPattern === 'bar') {
    surface = (
      <Fill style={{ background: '#000' }}>
        <SweepBar />
      </Fill>
    );
  } else if (refreshPattern === 'invert') {
    surface = <RetentionPattern inverted />;
  } else {
    surface = <HueCycle />;
  }

  const remaining = formatTime(endAt - now);
  const sinceDone = formatTime(now - doneAt);

  let statusItems;
  let statusHint;
  if (mode === 'retention') {
    if (phase === 'idle') {
      statusItems = [['Status', 'Ready'], ['Pattern time', `${retentionMinutes} min`]];
      statusHint =
        'Look at this gray now so you know your baseline. Then start: a static taskbar, logo, and HUD stay on screen, followed by 50% gray to reveal any ghost.';
    } else if (phase === 'running') {
      statusItems = [['Status', 'Showing static pattern'], ['Gray reveal in', remaining]];
      statusHint = 'Leave the pattern alone until the countdown ends. Hide this panel with H so it doesn’t leave its own mark.';
    } else {
      statusItems = [['Status', 'Revealing on 50% gray'], ['Time since pattern', sinceDone]];
      statusHint =
        'A faint outline that fades within a few minutes is normal temporary image retention. A few minutes of static content can’t cause burn-in, so a stubborn ghost should still clear with varied content or the panel’s own compensation cycle.';
    }
  } else if (mode === 'refresher') {
    if (phase === 'idle') {
      statusItems = [['Status', 'Ready'], ['Duration', `${refreshMinutes} min`]];
      statusHint =
        'Only helps temporary retention. For OLED, the panel’s own pixel refresh / compensation cycle (usually run in standby) is the real fix.';
    } else if (phase === 'running') {
      statusItems = [['Status', 'Running'], ['Time left', remaining]];
      statusHint = 'Hide this panel with H. You can leave the room — the countdown keeps going.';
    } else {
      statusItems = [['Status', 'Finished — showing 50% gray'], ['Finished', `${sinceDone} ago`]];
      statusHint = 'If a ghost is still clearly visible, let the display run its own refresh cycle in standby rather than repeating this.';
    }
  }

  return (
    <TestShell
      title="Burn-in Test"
      description="Check for permanent burn-in on uniform colors, test how quickly your panel shows temporary image retention, or run a gentle refresher for retention."
      onReset={handleReset}
      shortcuts={shortcuts}
      controls={
        <>
          <Section>
            <h3>Mode</h3>
            <Segmented options={MODES} value={mode} onChange={changeMode} columns={3} />
          </Section>

          {mode === 'check' ? (
            <Section>
              <h3>Full-field color</h3>
              <ColorSwatches
                colors={CHECK_COLORS}
                value={CHECK_COLORS[colorIndex].value}
                onChange={(v) => setColorIndex(CHECK_COLORS.findIndex((c) => c.value === v))}
                columns={6}
              />
              <ButtonRow style={{ marginTop: '0.6rem' }}>
                <Button type="button" onClick={() => stepColor(-1)}>
                  ← Previous
                </Button>
                <Button type="button" onClick={() => stepColor(1)}>
                  Next →
                </Button>
              </ButtonRow>
              <Readout items={[['Showing', CHECK_COLORS[colorIndex].name]]} />
              <Hint>
                Look for shapes that match things you leave on screen: taskbar, browser tabs, game HUDs, channel
                logos, news tickers. The grays show OLED burn-in best; solid red, green, and blue reveal which
                subpixel color has worn. Sit back a little and let your eyes move — ghosts are often easier to see
                in peripheral vision.
              </Hint>
            </Section>
          ) : null}

          {mode === 'retention' ? (
            <Section>
              <h3>Retention test</h3>
              <Slider
                label="Pattern time"
                value={retentionMinutes}
                min={1}
                max={10}
                onChange={setRetentionMinutes}
                format={(v) => `${v} min`}
              />
            </Section>
          ) : null}

          {mode === 'refresher' ? (
            <Section>
              <h3>Refresher</h3>
              <Segmented label="Pattern" options={REFRESH_PATTERNS} value={refreshPattern} onChange={setRefreshPattern} columns={3} />
              <Segmented label="Duration" options={REFRESH_MINUTES} value={refreshMinutes} onChange={setRefreshMinutes} columns={5} />
              <Hint>
                Nothing flashes quickly: the bar and hue cycle change slowly, and Inverted is a static negative of the
                retention pattern. On OLED, keep sessions short — bright content adds a little wear too.
              </Hint>
            </Section>
          ) : null}

          {mode !== 'check' ? (
            <Section>
              <h3>Timer</h3>
              <ButtonRow style={{ marginBottom: '0.75rem' }}>
                {phase === 'idle' ? (
                  <Button type="button" $variant="primary" onClick={start}>
                    Start
                  </Button>
                ) : (
                  <Button type="button" onClick={stop}>
                    {phase === 'running' ? 'Stop' : 'Back to start'}
                  </Button>
                )}
              </ButtonRow>
              <Readout items={[...statusItems, ['Screen wake lock', WAKE_LABELS[wake] || WAKE_LABELS.off]]} />
              <Hint>{statusHint}</Hint>
            </Section>
          ) : null}
        </>
      }
    >
      {surface}
    </TestShell>
  );
};

export default BurnInTest;
