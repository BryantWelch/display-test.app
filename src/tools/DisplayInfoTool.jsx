import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, ButtonRow } from '../components/testControls';
import { getDisplayInfo, onDisplayChange } from '../utils/displayInfo';
import { measureRefreshRate } from '../utils/frameTiming';

const NR = 'Not reported';

const supported = (feature) => window.matchMedia(`(${feature})`).media !== 'not all';
const matches = (query) => window.matchMedia(query).matches;

/** Value of a media feature, or null when the browser doesn't understand the feature at all. */
function mediaValue(feature, values) {
  if (!supported(`${feature}: ${values[0]}`)) return null;
  return values.find((v) => matches(`(${feature}: ${v})`)) ?? null;
}

function parseUserAgent(ua) {
  let browser = null;
  const tests = [
    [/Edg\/([\d.]+)/, 'Microsoft Edge'],
    [/OPR\/([\d.]+)/, 'Opera'],
    [/SamsungBrowser\/([\d.]+)/, 'Samsung Internet'],
    [/Firefox\/([\d.]+)/, 'Firefox'],
    [/FxiOS\/([\d.]+)/, 'Firefox'],
    [/CriOS\/([\d.]+)/, 'Chrome'],
    [/Chrome\/([\d.]+)/, 'Chrome'],
    [/Version\/([\d.]+).*Safari/, 'Safari'],
  ];
  for (const [re, name] of tests) {
    const m = ua.match(re);
    if (m) {
      browser = `${name} ${m[1].split('.')[0]}`;
      break;
    }
  }

  let os = null;
  if (/Windows NT 10/.test(ua)) os = 'Windows 10 or 11';
  else if (/Windows NT/.test(ua)) os = 'Windows';
  else if (/iPhone|iPad|iPod/.test(ua)) os = 'iOS / iPadOS';
  else if (/Mac OS X/.test(ua)) os = navigator.maxTouchPoints > 1 ? 'iPadOS (desktop mode)' : 'macOS';
  else if (/Android/.test(ua)) os = 'Android';
  else if (/CrOS/.test(ua)) os = 'ChromeOS';
  else if (/Linux/.test(ua)) os = 'Linux';
  return { browser, os };
}

async function detectBrowserAndOs() {
  const fallback = parseUserAgent(navigator.userAgent || '');
  const uad = navigator.userAgentData;
  if (!uad) return fallback;
  try {
    const high = await uad.getHighEntropyValues(['platformVersion', 'fullVersionList']);
    const brands = (high.fullVersionList || uad.brands || []).filter(
      (b) => !/Not.?A.?Brand|Chromium/i.test(b.brand)
    );
    const brand = brands[0];
    const browser = brand ? `${brand.brand} ${String(brand.version).split('.')[0]}` : fallback.browser;
    let os = high.platform || uad.platform || fallback.os;
    if (os === 'Windows' && high.platformVersion) {
      const major = Number(high.platformVersion.split('.')[0]);
      os = major >= 13 ? 'Windows 11' : major > 0 ? 'Windows 10' : 'Windows';
    } else if (os === 'macOS' && high.platformVersion) {
      os = `macOS ${high.platformVersion.split('.').slice(0, 2).join('.')}`;
    }
    return { browser, os };
  } catch {
    return fallback;
  }
}

function readExtras() {
  return {
    outerWidth: window.outerWidth,
    outerHeight: window.outerHeight,
    videoDynamicRange: supported('video-dynamic-range: standard')
      ? matches('(video-dynamic-range: high)')
        ? 'HDR'
        : 'SDR'
      : null,
    colorScheme: mediaValue('prefers-color-scheme', ['light', 'dark']),
    contrast: mediaValue('prefers-contrast', ['no-preference', 'more', 'less', 'custom']),
    reducedMotion: mediaValue('prefers-reduced-motion', ['no-preference', 'reduce']),
    anyPointer: matches('(any-pointer: fine)') ? 'fine' : matches('(any-pointer: coarse)') ? 'coarse' : 'none',
  };
}

const read = () => ({ ...getDisplayInfo(), ...readExtras() });

const signature = (i) => `${i.cssWidth}x${i.cssHeight}@${i.dpr}|${i.gamut}|${i.dynamicRange}`;

const fmtSize = (w, h) => `${w} × ${h}`;
const fmtDpr = (dpr) => String(Math.round(dpr * 1000) / 1000);
const orientationLabel = (o) =>
  o ? o.replace('-primary', '').replace('-secondary', ' (flipped)').replace(/^\w/, (c) => c.toUpperCase()) : NR;
const pointerLabel = (p) => ({ fine: 'Mouse / trackpad (fine)', coarse: 'Touch (coarse)', none: 'None' })[p] || NR;

function buildGroups(info, refresh, ua) {
  const nonInteger = !Number.isInteger(info.dpr);
  const refreshValue =
    refresh.state === 'measuring'
      ? 'Measuring…'
      : refresh.result
        ? `${refresh.result.snappedHz} Hz (${refresh.result.hz.toFixed(1)} measured)`
        : NR;

  return [
    {
      title: 'Screen',
      rows: [
        ['Physical resolution', fmtSize(info.physicalWidth, info.physicalHeight), 'CSS size × device pixel ratio'],
        ['CSS (scaled) resolution', fmtSize(info.cssWidth, info.cssHeight), 'What websites see'],
        ['Available screen area', fmtSize(info.availWidth, info.availHeight), 'Minus taskbar / dock, in CSS px'],
        ['Aspect ratio', info.aspectRatio || NR],
        ['Device pixel ratio', fmtDpr(info.dpr), nonInteger ? 'Fractional scaling' : null],
        ['OS scaling × browser zoom', `${info.scalingPercent}%`, 'Browser zoom also changes this'],
        ['Refresh rate', refreshValue, 'Measured from animation frames'],
        ['Orientation', orientationLabel(info.orientation)],
        [
          'Multiple screens',
          info.isExtended == null ? NR : info.isExtended ? 'Yes (desktop extends across screens)' : 'No',
        ],
      ],
    },
    {
      title: 'Browser window',
      rows: [
        ['Viewport', fmtSize(info.viewportWidth, info.viewportHeight), 'Page area, CSS px'],
        ['Viewport in device pixels', fmtSize(Math.round(info.viewportWidth * info.dpr), Math.round(info.viewportHeight * info.dpr))],
        ['Window (outer)', fmtSize(info.outerWidth, info.outerHeight), 'Including tabs and toolbars'],
      ],
    },
    {
      title: 'Color & HDR',
      rows: [
        ['Color gamut', info.gamut || NR, 'From the CSS color-gamut query'],
        ['Dynamic range', info.dynamicRange || NR, 'HDR = HDR mode is on for this screen'],
        ['Video dynamic range', info.videoDynamicRange || NR],
        ['Color depth', `${info.colorDepth}-bit (as reported)`, 'Browsers usually report 24 regardless of panel'],
      ],
    },
    {
      title: 'Input',
      rows: [
        ['Primary pointer', pointerLabel(info.pointer)],
        ['Any pointer', pointerLabel(info.anyPointer)],
        ['Hover', info.hover ? 'Yes' : 'No'],
        ['Touch points', info.touchPoints ? String(info.touchPoints) : 'None reported'],
      ],
    },
    {
      title: 'Preferences & software',
      rows: [
        ['Color scheme', info.colorScheme || NR],
        ['Contrast', info.contrast || NR],
        ['Reduced motion', info.reducedMotion || NR],
        ['Forced colors', info.forcedColors ? 'Active' : 'Off'],
        ['Browser', ua?.browser || NR, 'Best effort'],
        ['Operating system', ua?.os || NR, 'Best effort'],
      ],
    },
  ];
}

function reportText(groups) {
  const lines = ['Display report — display-test.app/screen-resolution', `Generated ${new Date().toLocaleString()}`, ''];
  for (const g of groups) {
    lines.push(g.title.toUpperCase());
    for (const [k, v] of g.rows) lines.push(`  ${k}: ${v}`);
    lines.push('');
  }
  return lines.join('\n').trim();
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    ta.remove();
    return ok;
  }
}

const Hero = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-end;
  gap: 1rem 2rem;
  margin-bottom: 1.25rem;
`;

const Big = styled.div`
  small {
    display: block;
    color: var(--text-subtle);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 0.25rem;
  }

  strong {
    display: block;
    font-size: clamp(2rem, 6vw, 3rem);
    line-height: 1.05;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.02em;
  }

  span {
    display: block;
    margin-top: 0.35rem;
    color: var(--text-muted);
    font-size: 0.95rem;
  }
`;

const Explain = styled.p`
  color: var(--text-muted);
  font-size: 0.92rem;
  line-height: 1.6;
  margin: 0 0 1.25rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);

  strong {
    color: var(--text);
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
`;

const Group = styled.section`
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  padding: 0.85rem 1rem;

  h3 {
    margin: 0 0 0.6rem;
    font-size: 0.75rem;
    font-weight: 650;
    color: var(--text-subtle);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  dl {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    gap: 0.45rem 1rem;
    margin: 0;
    font-size: 0.9rem;
  }

  dt {
    color: var(--text-muted);
  }

  dt small {
    display: block;
    color: var(--text-subtle);
    font-size: 0.76rem;
  }

  dd {
    margin: 0;
    color: var(--text);
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
`;

const Status = styled.span`
  color: var(--success);
  font-size: 0.88rem;
  align-self: center;
`;

const DisplayInfoTool = () => {
  const [info, setInfo] = useState(read);
  const [ua, setUa] = useState(null);
  const [refresh, setRefresh] = useState({ state: 'idle', result: null });
  const [copied, setCopied] = useState(null);
  const measuring = useRef(false);
  const copiedTimer = useRef(null);
  const lastSig = useRef(signature(info));

  const measure = useCallback(async () => {
    if (measuring.current) return;
    measuring.current = true;
    setRefresh((r) => ({ ...r, state: 'measuring' }));
    const result = await measureRefreshRate({ durationMs: 1500 });
    measuring.current = false;
    setRefresh({ state: 'done', result });
  }, []);

  useEffect(() => {
    measure();
    detectBrowserAndOs().then(setUa);
  }, [measure]);

  const update = useCallback(() => {
    const next = read();
    setInfo(next);
    const sig = signature(next);
    if (sig !== lastSig.current) {
      lastSig.current = sig;
      measure();
    }
  }, [measure]);

  // The resolution query in onDisplayChange is bound to the current DPR, so resubscribe when it changes.
  useEffect(() => onDisplayChange(update), [update, info.dpr]);

  // Moving the window to a monitor with the same DPR fires no event, so poll cheaply too.
  useEffect(() => {
    const id = setInterval(() => {
      if (signature(read()) !== lastSig.current) update();
    }, 1000);
    return () => clearInterval(id);
  }, [update]);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const groups = buildGroups(info, refresh, ua);

  const copy = async () => {
    const ok = await copyText(reportText(groups));
    setCopied(ok ? 'Copied to clipboard' : 'Copy failed — select and copy manually');
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(null), 2500);
  };

  const scaled = info.dpr !== 1;

  return (
    <div>
      <Hero>
        <Big>
          <small>Your screen resolution</small>
          <strong>{fmtSize(info.physicalWidth, info.physicalHeight)}</strong>
          <span>
            {info.aspectRatio ? `${info.aspectRatio} · ` : ''}
            {info.scalingPercent}% scaling
            {refresh.result ? ` · ${refresh.result.snappedHz} Hz` : ''}
            {info.dynamicRange === 'HDR' ? ' · HDR on' : ''}
          </span>
        </Big>
        <ButtonRow>
          <Button type="button" onClick={measure} disabled={refresh.state === 'measuring'}>
            {refresh.state === 'measuring' ? 'Measuring…' : 'Re-measure refresh rate'}
          </Button>
          <Button type="button" $variant="primary" onClick={copy}>
            Copy report
          </Button>
          <Status role="status" aria-live="polite">
            {copied}
          </Status>
        </ButtonRow>
      </Hero>

      <Explain>
        {scaled ? (
          <>
            Websites see <strong>{fmtSize(info.cssWidth, info.cssHeight)}</strong> CSS pixels. Your device pixel
            ratio is <strong>{fmtDpr(info.dpr)}</strong> (OS scaling × browser zoom), so the screen is
            drawing about <strong>{fmtSize(info.physicalWidth, info.physicalHeight)}</strong> physical pixels.
          </>
        ) : (
          <>
            Scaling is 100%, so CSS pixels and physical pixels match:{' '}
            <strong>{fmtSize(info.cssWidth, info.cssHeight)}</strong>.
          </>
        )}{' '}
        This is the resolution your operating system is <em>rendering</em> — if it is set to a non-native mode or a
        macOS scaled “looks like” mode, your panel’s native resolution can differ. Browser zoom other than 100% also
        changes these numbers.
      </Explain>

      <Grid>
        {groups.map((g) => (
          <Group key={g.title} aria-label={g.title}>
            <h3>{g.title}</h3>
            <dl>
              {g.rows.map(([k, v, hint]) => (
                <div key={k} style={{ display: 'contents' }}>
                  <dt>
                    {k}
                    {hint ? <small>{hint}</small> : null}
                  </dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </Group>
        ))}
      </Grid>
    </div>
  );
};

export default DisplayInfoTool;
