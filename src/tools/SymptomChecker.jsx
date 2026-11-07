import { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Inline } from '../lib/markup';

const GROUPS = [
  { id: 'black', label: 'Blacks & contrast' },
  { id: 'text', label: 'Sharpness & text' },
  { id: 'motion', label: 'Refresh rate & motion' },
  { id: 'color', label: 'Color & brightness' },
  { id: 'defects', label: 'Spots & ghosts' },
];

const SYMPTOMS = [
  {
    id: 'washed-out-blacks',
    group: 'black',
    label: 'Washed-out, gray blacks',
    causes: [
      'HDMI RGB range mismatch — the PC sends limited range (16–235) to a display expecting full range.',
      'Windows HDR is on while you’re viewing SDR content.',
      'Black stabilizer / shadow boost raised, or brightness set high.',
      'Normal LCD (especially IPS) black level in a dark room.',
    ],
    fixes: [
      'Set **Full** RGB range in the GPU control panel and match the display’s black level setting.',
      'Turn Windows HDR off for SDR content.',
      'Reset black stabilizer to default and lower brightness for dark rooms.',
    ],
    tests: [
      ['black-level', 'Black Level'],
      ['contrast', 'Contrast'],
    ],
    guide: ['setup-checklist', 'Setup checklist'],
  },
  {
    id: 'crushed-shadows',
    group: 'black',
    label: 'Crushed shadows',
    causes: [
      'The PC sends full range to a display expecting limited range.',
      'Gamma set too high, or dynamic contrast enabled.',
      'A wrong or corrupt ICC profile.',
      'Aggressive local dimming darkening zones with shadow detail.',
    ],
    fixes: [
      'Match the RGB range on the GPU and display.',
      'Choose gamma 2.2 or the sRGB preset, and turn off dynamic contrast.',
      'Temporarily switch to the default sRGB color profile to rule out ICC problems.',
    ],
    tests: [
      ['black-level', 'Black Level'],
      ['gamma', 'Gamma'],
    ],
    guide: ['setup-checklist', 'Setup checklist'],
  },
  {
    id: 'bleed',
    group: 'black',
    label: 'Bright corners / backlight bleed',
    causes: [
      'Backlight bleed — light leaking at the panel edges, fixed in place.',
      'IPS glow — a hazy glow that changes as you move your head (normal).',
      'Brightness set high in a dark room.',
    ],
    fixes: [
      'Lower brightness and add a little room lighting.',
      'Judge at your normal seating distance — cameras exaggerate bleed.',
      'Strong, fixed bleed visible in normal content is worth returning inside the window. Don’t press on the panel.',
    ],
    tests: [
      ['uniformity', 'Uniformity'],
      ['black-screen', 'Black Screen'],
    ],
    guide: ['check-new-monitor', 'Check a new monitor'],
  },
  {
    id: 'halos',
    group: 'black',
    label: 'Halos around bright objects',
    causes: [
      'Local dimming blooming on Mini-LED / FALD — zones are much larger than pixels.',
      'Dark outlines on moving objects from overdrive set too high.',
    ],
    fixes: [
      'Try a lower local dimming setting, or turn it off for desktop work.',
      'If halos only appear during motion, reduce overdrive.',
      'Some blooming is inherent to zone-based dimming.',
    ],
    tests: [
      ['local-dimming', 'Local Dimming'],
      ['response-time', 'Response Time'],
    ],
  },
  {
    id: 'blurry-text',
    group: 'text',
    label: 'Blurry or soft text',
    causes: [
      'Non-native resolution, fractional scaling, or browser zoom.',
      'TV overscan stretching the image.',
      'Chroma subsampling (4:2:2 / 4:2:0) over HDMI.',
      'Sharpness set below its neutral value.',
    ],
    fixes: [
      'Set the native resolution and reset browser zoom (`Ctrl/Cmd + 0`).',
      'On a TV, turn off overscan and label the input as PC.',
      'Set sharpness to the neutral value for your monitor.',
    ],
    tests: [
      ['screen-resolution', 'Screen Resolution'],
      ['text-clarity', 'Text Clarity'],
      ['chroma-subsampling', 'Chroma Subsampling'],
    ],
    guide: ['tv-as-monitor', 'Using a TV as a monitor'],
  },
  {
    id: 'fringing',
    group: 'text',
    label: 'Color fringing on text',
    causes: [
      'OLED / QD-OLED subpixel layouts that ClearType doesn’t match (normal for these panels).',
      'BGR or other unusual subpixel order.',
      '4:2:2 or 4:2:0 chroma subsampling.',
      'Sharpness set too high, creating halos.',
    ],
    fixes: [
      'Run the ClearType Text Tuner and pick the least colorful samples.',
      'Increase scaling so text uses more pixels.',
      'Get 4:4:4 chroma and reduce sharpness.',
    ],
    tests: [
      ['text-clarity', 'Text Clarity'],
      ['chroma-subsampling', 'Chroma Subsampling'],
    ],
  },
  {
    id: 'stuck-60hz',
    group: 'motion',
    label: 'Stuck at 60 Hz',
    causes: [
      'The refresh rate was never changed from the default.',
      'Cable, adapter or port without enough bandwidth.',
      'A monitor OSD setting limiting the DisplayPort or HDMI version.',
      'Plugged into the motherboard instead of the graphics card.',
    ],
    fixes: [
      'Select the rate in display settings (Windows: Advanced display).',
      'Use DisplayPort or a certified Ultra High Speed HDMI cable, without adapters.',
      'Check the monitor OSD and plug into the GPU.',
    ],
    tests: [
      ['refresh-rate', 'Refresh Rate'],
      ['frame-skipping', 'Frame Skipping'],
    ],
    guide: ['setup-checklist', 'Setup checklist'],
  },
  {
    id: 'ghosting',
    group: 'motion',
    label: 'Ghosting or smearing',
    causes: [
      'Slow LCD transitions, especially dark transitions on VA panels.',
      'Overdrive off or too low — or too high, causing bright inverse ghosts.',
      'Running below the panel’s maximum refresh rate.',
      'A cold panel that hasn’t warmed up.',
    ],
    fixes: [
      'Try every overdrive level at your usual refresh rate.',
      'Use the maximum refresh rate and let the panel warm up.',
      'Some dark smearing on VA is inherent to the technology.',
    ],
    tests: [['response-time', 'Response Time']],
  },
  {
    id: 'tearing',
    group: 'motion',
    label: 'Tearing or stutter',
    causes: [
      'VRR (G-Sync / FreeSync) off, or unsupported over the current connection.',
      'Frame rate above the VRR range with V-Sync off.',
      'Skipped frames from a cable or bandwidth problem.',
    ],
    fixes: [
      'Enable VRR on both the display and the GPU.',
      'Cap the frame rate a few fps below the refresh rate.',
      'Check for skipped frames, and try a different cable.',
    ],
    tests: [
      ['frame-skipping', 'Frame Skipping'],
      ['refresh-rate', 'Refresh Rate'],
    ],
  },
  {
    id: 'vrr-blackout',
    group: 'motion',
    label: 'Black screen / flicker with VRR',
    causes: [
      'Marginal cable or port bandwidth at high refresh rates.',
      'VRR brightness flicker as the frame rate swings (common on VA and OLED).',
      'Outdated GPU drivers or monitor firmware.',
    ],
    fixes: [
      'Try a shorter certified cable and a different port.',
      'Step the refresh rate down — if it stops, it’s bandwidth.',
      'Update drivers and firmware, and cap the frame rate to keep it steady.',
    ],
    tests: [
      ['frame-skipping', 'Frame Skipping'],
      ['refresh-rate', 'Refresh Rate'],
    ],
  },
  {
    id: 'flicker',
    group: 'motion',
    label: 'Flicker',
    causes: [
      'PWM backlight dimming at low brightness.',
      'VRR flicker.',
      'A loose or marginal cable, or a failing backlight.',
    ],
    fixes: [
      'Raise brightness — PWM flicker is often worse at low settings.',
      'Test with VRR off, and reseat or swap the cable.',
      'Browsers can’t measure PWM; a phone’s slow-motion camera can sometimes reveal it.',
    ],
    tests: [
      ['refresh-rate', 'Refresh Rate'],
      ['white-screen', 'White Screen'],
    ],
  },
  {
    id: 'banding',
    group: 'color',
    label: 'Banding in gradients',
    causes: [
      'Reduced bit depth or chroma at high refresh rates.',
      'Heavy color correction or an ICC profile adjustment.',
      'Compression in the video or image itself, not the display.',
    ],
    fixes: [
      'Check bit depth and color format in the GPU control panel.',
      'Reset picture adjustments and compare at a lower refresh rate.',
      'Faint banding in very dark gradients is normal on many panels.',
    ],
    tests: [
      ['color-gradient', 'Color Gradient'],
      ['gamma', 'Gamma'],
    ],
  },
  {
    id: 'oversaturated',
    group: 'color',
    label: 'Colors too saturated',
    causes: [
      'A wide-gamut panel showing sRGB content in its native gamut.',
      'Vivid or dynamic picture modes.',
      'HDR mode applied to SDR content in some setups.',
    ],
    fixes: [
      'Use the monitor’s sRGB mode for everyday content.',
      'Choose a neutral picture mode (Standard, sRGB, or Custom).',
      'Use a correct ICC profile, ideally from a calibration.',
    ],
    tests: [
      ['color-gradient', 'Color Gradient'],
      ['color-distance', 'Color Distance'],
    ],
  },
  {
    id: 'tint',
    group: 'color',
    label: 'Yellow, pink, or blue tint',
    causes: [
      'Night Light, Night Shift, True Tone, f.lux or a blue-light filter.',
      'A warm color temperature preset.',
      'Off-axis viewing on IPS or VA.',
      'Panel tint variance on one area of the screen.',
    ],
    fixes: [
      'Turn off blue-light features, including scheduled ones.',
      'Try the 6500K or sRGB preset, and sit centered.',
      'A tint on one area that doesn’t change with angle is worth a return inside the window.',
    ],
    tests: [
      ['white-screen', 'White Screen'],
      ['uniformity', 'Uniformity'],
      ['viewing-angle', 'Viewing Angle'],
    ],
  },
  {
    id: 'hdr-brightness',
    group: 'color',
    label: 'Too dim or too bright in HDR',
    causes: [
      'The Windows SDR content brightness slider.',
      'HDR calibration not run, so games don’t know the peak brightness.',
      'An HDR mode with a low brightness cap, or OLED brightness limiting on large bright areas.',
    ],
    fixes: [
      'Adjust the SDR content brightness slider.',
      'Run the Windows HDR Calibration app and try the display’s other HDR modes.',
      'Use SDR for desktop work if the HDR desktop looks wrong. Large bright areas dimming on OLED is normal.',
    ],
    tests: [
      ['hdr-test', 'HDR Test'],
      ['brightness', 'Brightness'],
    ],
    guide: ['setup-checklist', 'Setup checklist'],
  },
  {
    id: 'image-ghosts',
    group: 'defects',
    label: 'Faint leftover images',
    causes: [
      'Temporary image retention after static content (OLED, some IPS).',
      'OLED burn-in from long-term static elements.',
    ],
    fixes: [
      'Show varied content for a while.',
      'Let the display enter standby so its compensation cycle can run — don’t unplug it.',
      'If it’s still there after several days, treat it as burn-in.',
    ],
    tests: [
      ['burn-in', 'Burn-in'],
      ['uniformity', 'Uniformity'],
    ],
    guide: ['oled-burn-in', 'OLED burn-in guide'],
  },
  {
    id: 'bad-pixel',
    group: 'defects',
    label: 'Dot always black or always lit',
    causes: [
      'Dead pixel (always dark) or stuck / hot pixel (always lit).',
      'Dust or a smudge on the screen.',
    ],
    fixes: [
      'Clean the screen with a dry microfiber cloth.',
      'Run the stuck pixel fixer on lit pixels for 10–30 minutes.',
      'If it stays, check the pixel policy or return inside the window.',
    ],
    tests: [
      ['dead-pixel', 'Dead Pixel'],
      ['stuck-pixel-fixer', 'Stuck Pixel Fixer'],
    ],
    guide: ['dead-pixel-policies', 'Dead pixel policies'],
  },
];

const Wrap = styled.div`
  display: grid;
  gap: 1.25rem;
`;

const Heading = styled.h2`
  font-size: var(--fs-h2, 1.4rem);
  margin: 0;
`;

const Hint = styled.p`
  color: var(--text-muted);
  margin: 0.25rem 0 0;
`;

const Group = styled.div`
  display: grid;
  gap: 0.5rem;
`;

const GroupLabel = styled.h3`
  font-size: 0.78rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-subtle);
  margin: 0;
`;

const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const Chip = styled.button`
  min-height: 44px;
  padding: 0.5rem 0.95rem;
  border-radius: 999px;
  border: 1px solid var(--border);
  background: var(--surface-2);
  color: var(--text);
  font: inherit;
  font-size: 0.92rem;
  cursor: pointer;
  text-align: left;
  transition: border-color 0.15s ease, background 0.15s ease;

  &:hover {
    border-color: var(--border-strong);
  }

  &:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  &[aria-pressed='true'] {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
`;

const Result = styled.div`
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
  padding: 1.1rem 1.25rem;
  display: grid;
  gap: 1rem;

  h3 {
    font-size: 1.1rem;
    margin: 0;
  }

  h4 {
    font-size: 0.78rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-subtle);
    margin: 0 0 0.4rem;
  }

  ul,
  ol {
    margin: 0;
    padding-left: 1.2rem;
    color: var(--text-muted);
    display: grid;
    gap: 0.3rem;
    line-height: 1.55;
  }
`;

const Empty = styled.p`
  border: 1px dashed var(--border-strong);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  color: var(--text-subtle);
  margin: 0;
`;

const TestLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;

  a {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    padding: 0.5rem 0.95rem;
    border-radius: var(--radius-sm);
    border: 1px solid var(--border);
    background: var(--surface-2);
    color: var(--text);
    font-weight: 600;
    font-size: 0.92rem;
  }

  a:hover,
  a:focus-visible {
    border-color: var(--accent);
  }
`;

export default function SymptomChecker() {
  const [selectedId, setSelectedId] = useState(null);
  const selected = SYMPTOMS.find((s) => s.id === selectedId);

  return (
    <Wrap>
      <div>
        <Heading>What looks wrong?</Heading>
        <Hint>Pick a symptom to see likely causes, quick fixes, and the test that confirms it.</Hint>
      </div>

      {GROUPS.map((group) => (
        <Group key={group.id} role="group" aria-labelledby={`symptom-group-${group.id}`}>
          <GroupLabel id={`symptom-group-${group.id}`}>{group.label}</GroupLabel>
          <Chips>
            {SYMPTOMS.filter((s) => s.group === group.id).map((s) => (
              <Chip
                key={s.id}
                type="button"
                aria-pressed={s.id === selectedId}
                aria-controls="symptom-result"
                onClick={() => setSelectedId(s.id === selectedId ? null : s.id)}
              >
                {s.label}
              </Chip>
            ))}
          </Chips>
        </Group>
      ))}

      <div id="symptom-result" aria-live="polite">
        {selected ? (
          <Result>
            <h3>{selected.label}</h3>
            <div>
              <h4>Likely causes</h4>
              <ul>
                {selected.causes.map((c) => (
                  <li key={c}>
                    <Inline text={c} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Try first</h4>
              <ol>
                {selected.fixes.map((f) => (
                  <li key={f}>
                    <Inline text={f} />
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h4>Confirm with</h4>
              <TestLinks>
                {selected.tests.map(([slug, label]) => (
                  <Link key={slug} to={`/${slug}`}>
                    {label} →
                  </Link>
                ))}
                {selected.guide ? (
                  <Link to={`/guides/${selected.guide[0]}`}>{selected.guide[1]} →</Link>
                ) : null}
              </TestLinks>
            </div>
          </Result>
        ) : (
          <Empty>
            No symptom selected yet. Not sure? Start with the{' '}
            <Inline text="[setup checklist](/guides/setup-checklist)" /> — most problems are settings.
          </Empty>
        )}
      </div>
    </Wrap>
  );
}
