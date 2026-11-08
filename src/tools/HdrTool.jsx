import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getColorGamut, getDynamicRange, onDisplayChange } from '../utils/displayInfo';

const NR = 'Not reported';

const HDR_VIDEO = { width: 3840, height: 2160, bitrate: 20_000_000, framerate: 30 };
const HDR_FIELDS = { hdrMetadataType: 'smpteSt2086', colorGamut: 'rec2020', transferFunction: 'pq' };

const CODECS = [
  { name: 'HEVC Main 10', contentType: 'video/mp4; codecs="hvc1.2.4.L153.B0"' },
  { name: 'VP9 Profile 2', contentType: 'video/webm; codecs="vp09.02.51.10.01.09.16.09.00"' },
  { name: 'AV1 10-bit', contentType: 'video/mp4; codecs="av01.0.12M.10.0.110.09.16.09.0"' },
];

async function probe(contentType) {
  for (const type of ['media-source', 'file']) {
    try {
      const r = await navigator.mediaCapabilities.decodingInfo({
        type,
        video: { contentType, ...HDR_VIDEO, ...HDR_FIELDS },
      });
      return r;
    } catch {
      // Some browsers reject 'media-source' or the HDR fields; try the next config.
    }
  }
  return null;
}

async function probeHdrDecode() {
  if (typeof navigator === 'undefined' || !navigator.mediaCapabilities?.decodingInfo) return null;
  return Promise.all(CODECS.map(async (c) => ({ ...c, result: await probe(c.contentType) })));
}

const VIDEO_HDR_QUERY = '(video-dynamic-range: high)';

const hasMatchMedia = () => typeof window !== 'undefined' && typeof window.matchMedia === 'function';

const readDisplay = () => ({
  gamut: getColorGamut(),
  dynamicRange: getDynamicRange(),
  videoHdr:
    hasMatchMedia() && window.matchMedia('(video-dynamic-range: standard)').media !== 'not all'
      ? window.matchMedia(VIDEO_HDR_QUERY).matches
      : null,
});

const TONES = { good: 'var(--success)', warn: 'var(--warning)', bad: 'var(--danger)', muted: 'var(--text-subtle)' };

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.75rem;
`;

const Row = styled.li`
  display: grid;
  grid-template-columns: 7.5rem minmax(0, 1fr);
  gap: 0.25rem 1rem;
  align-items: baseline;
  padding: 0.85rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-left: 3px solid ${({ $tone }) => TONES[$tone] || 'var(--border)'};

  @media (max-width: 520px) {
    grid-template-columns: 1fr;
  }

  > span {
    color: var(--text-subtle);
    font-size: 0.78rem;
    font-weight: 650;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  strong {
    font-size: 1.15rem;
    color: var(--text);
  }

  > div {
    grid-column: 2;
    margin: 0.2rem 0 0;
    color: var(--text-muted);
    font-size: 0.88rem;
    line-height: 1.55;

    @media (max-width: 520px) {
      grid-column: 1;
    }
  }
`;

const Codecs = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;

  span {
    font-size: 0.82rem;
    padding: 0.2rem 0.55rem;
    border-radius: 999px;
    border: 1px solid var(--border-strong);
    color: var(--text-muted);
  }

  span[data-ok='true'] {
    border-color: var(--success);
    color: var(--text);
  }
`;

function gamutVerdict(gamut) {
  if (!gamut) return { tone: 'muted', value: NR, note: 'This browser doesn’t support the color-gamut media query.' };
  if (gamut === 'Rec. 2020')
    return { tone: 'good', value: 'Rec. 2020 (beyond P3)', note: 'Very wide gamut reported. No consumer panel covers all of Rec. 2020: in Windows HDR mode this usually reflects the HDR signal’s Rec. 2020 encoding, otherwise a display profile beyond P3.' };
  if (gamut === 'Display P3')
    return { tone: 'good', value: 'Display P3 (wide gamut)', note: 'The browser can show colors outside sRGB on this screen. Try the fullscreen P3-only test to confirm.' };
  if (gamut === 'sRGB')
    return { tone: 'warn', value: 'sRGB', note: 'Standard gamut. Wide-gamut panels can still report sRGB if the OS is clamping color (for example Windows SDR mode without a color profile).' };
  return { tone: 'bad', value: 'Below sRGB', note: 'The display reports less than full sRGB coverage.' };
}

function hdrVerdict({ dynamicRange, videoHdr }) {
  if (!dynamicRange)
    return { tone: 'muted', value: NR, note: 'This browser doesn’t support the dynamic-range media query (common in older browsers). That doesn’t mean HDR is off.' };
  if (dynamicRange === 'HDR')
    return {
      tone: 'good',
      value: 'Yes — HDR is on for this screen',
      note: 'The browser reports this display as HDR: on Windows, Use HDR is on; on Macs, the display supports EDR. HDR video and HDR images can exceed SDR white; this page itself stays at SDR white.',
    };
  return {
    tone: 'warn',
    value: videoHdr ? 'Video only' : 'No — SDR',
    note: videoHdr
      ? 'The page renders in SDR, but the browser can play HDR video on this screen.'
      : 'The browser reports this screen as SDR. On Windows, turn on Use HDR in Settings → System → Display; some browsers report SDR even then, so compare with Chrome or Edge. On Mac, HDR (EDR) is automatic on supported displays.',
  };
}

const HdrTool = () => {
  const [display, setDisplay] = useState(readDisplay);
  const [codecs, setCodecs] = useState(undefined);

  useEffect(() => {
    const update = () => setDisplay(readDisplay());
    const unsubscribe = onDisplayChange(update);
    const videoQuery = hasMatchMedia() ? window.matchMedia(VIDEO_HDR_QUERY) : null;
    videoQuery?.addEventListener?.('change', update);
    return () => {
      unsubscribe();
      videoQuery?.removeEventListener?.('change', update);
    };
  }, []);

  useEffect(() => {
    let alive = true;
    probeHdrDecode().then((r) => alive && setCodecs(r));
    return () => {
      alive = false;
    };
  }, [display.dynamicRange]);

  const gamut = gamutVerdict(display.gamut);
  const hdr = hdrVerdict(display);

  const supported = codecs?.filter((c) => c.result?.supported) || [];
  const decode =
    codecs === undefined
      ? { tone: 'muted', value: 'Checking…', note: '' }
      : codecs === null
        ? { tone: 'muted', value: NR, note: 'This browser doesn’t expose the Media Capabilities API.' }
        : supported.length
          ? {
              tone: 'good',
              value: `${supported.length} of ${CODECS.length} HDR10 formats`,
              note: 'Reported for 4K PQ / HDR10 video. Browsers that don’t understand the HDR fields may report plain 10-bit decode support instead.',
            }
          : { tone: 'warn', value: 'None reported', note: 'The browser didn’t report HDR10 decode support for these formats. Installing the HEVC extension (Windows) or using Edge/Chrome can change this.' };

  return (
    <List aria-live="polite">
      <Row $tone={gamut.tone}>
        <span>Gamut</span>
        <strong>{gamut.value}</strong>
        <div>{gamut.note}</div>
      </Row>
      <Row $tone={hdr.tone}>
        <span>HDR</span>
        <strong>{hdr.value}</strong>
        <div>{hdr.note}</div>
      </Row>
      <Row $tone={decode.tone}>
        <span>HDR video</span>
        <strong>{decode.value}</strong>
        <div>
          {decode.note}
          {codecs?.length ? (
            <Codecs>
              {codecs.map((c) => (
                <span key={c.name} data-ok={String(!!c.result?.supported)}>
                  {c.name}: {c.result ? (c.result.supported ? (c.result.smooth ? 'yes' : 'yes, may stutter') : 'no') : 'not reported'}
                  {c.result?.supported && c.result.powerEfficient ? ' · hardware' : ''}
                </span>
              ))}
            </Codecs>
          ) : null}
        </div>
      </Row>
    </List>
  );
};

export default HdrTool;
