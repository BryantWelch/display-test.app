export default {
  slug: 'symptom-checker',
  order: 15,
  name: 'Symptom Checker',
  title: 'Diagnose Display Problems by Symptom',
  summary: 'Pick what looks wrong on your screen to see the likely causes, quick fixes, and which test confirms it.',
  lastReviewed: '2026-11-07',
  seo: {
    title: 'Monitor Problem Symptom Checker — Washed-out Blacks, Blurry Text, Flicker & More',
    description:
      'Diagnose common monitor and TV problems by symptom: washed-out blacks, blurry text, flicker, stuck at 60 Hz, ghosting, banding, backlight bleed, tearing and more — with fixes and free tests.',
  },
  intro:
    'Something looks wrong but you’re not sure what? Pick the symptom below to see the most likely causes, the quick fixes to try first, and the test that confirms it. Most display problems turn out to be a setting, a cable, or normal behavior for the panel type — a real hardware defect is usually the last explanation, not the first.',
  interactive: () => import('../../tools/SymptomChecker'),
  interactiveFirst: true,
  sections: [
    {
      id: 'how-to-use',
      heading: 'How to use this guide',
      blocks: [
        'Start with the [setup checklist](/guides/setup-checklist) — native resolution, 100% scaling, correct refresh rate, HDR and blue-light filters off — because it rules out the most common causes in one go. Then find your symptom below. Each one lists likely causes in rough order of how often they’re the culprit.',
        { note: 'If you’ve just bought the display and the problem survives the fixes, check [How to check a new monitor](/guides/check-new-monitor) before the return window closes.' },
      ],
    },
    {
      id: 'black-and-shadows',
      heading: 'Blacks, shadows, and contrast',
      blocks: [
        { h3: 'Washed-out, gray blacks' },
        {
          ul: [
            '**Likely causes:** HDMI RGB range mismatch (PC sending limited, display expecting full); Windows HDR on while viewing SDR content; a black stabilizer / shadow boost setting raised; brightness set too high; ambient light on an IPS or matte screen; normal LCD black level in a dark room.',
            '**Test:** [Black Level](/black-level), [Contrast](/contrast).',
            '**Fix:** set full range RGB on the GPU and matching black level on the display; turn HDR off for SDR content; reset black stabilizer to default; lower brightness in dark rooms.',
          ],
        },
        { h3: 'Crushed shadows (dark detail disappears)' },
        {
          ul: [
            '**Likely causes:** PC sending full range to a display expecting limited; gamma set too high; contrast or dynamic contrast too aggressive; a bad ICC profile; aggressive local dimming darkening zones that contain shadow detail.',
            '**Test:** [Black Level](/black-level), [Gamma](/gamma).',
            '**Fix:** match RGB range; choose gamma 2.2 (or the sRGB preset); turn off dynamic contrast; temporarily switch to the default sRGB profile to rule out ICC problems.',
          ],
        },
        { h3: 'Bright corners or edges on black (bleed and glow)' },
        {
          ul: [
            '**Likely causes:** backlight bleed (light leaking at the panel edges — fixed position); IPS glow (changes with viewing angle); brightness set high in a dark room.',
            '**Test:** [Uniformity](/uniformity), [Black Screen](/black-screen).',
            '**Fix:** lower brightness, add some room lighting, and sit at a normal distance. Strong fixed bleed visible in normal content is worth a return inside the window. Avoid pressing on the panel or loosening the bezel.',
          ],
        },
        { h3: 'Dark or bright halos around objects (blooming)' },
        {
          ul: [
            '**Likely causes:** local dimming on Mini-LED/FALD and edge-lit LCDs — zones are much larger than pixels, so a bright object lights its whole zone. Inverse (dark) halos can also come from overdrive on moving objects.',
            '**Test:** [Local Dimming](/local-dimming), [Response Time](/response-time).',
            '**Fix:** try a lower local dimming setting, or turn it off for desktop work with small bright text on black; for halos that only appear during motion, reduce overdrive. Some blooming is inherent to zone-based dimming.',
          ],
        },
      ],
    },
    {
      id: 'sharpness-and-text',
      heading: 'Sharpness and text',
      blocks: [
        { h3: 'Blurry or soft text' },
        {
          ul: [
            '**Likely causes:** non-native resolution; fractional scaling; browser zoom; TV overscan; chroma subsampling over HDMI; sharpness set below neutral.',
            '**Test:** [Screen Resolution](/screen-resolution), [Text Clarity](/text-clarity), [Chroma Subsampling](/chroma-subsampling).',
            '**Fix:** set native resolution; reset browser zoom; on TVs, turn off overscan and label the input as PC; set sharpness to the neutral value.',
          ],
        },
        { h3: 'Color fringing on text' },
        {
          ul: [
            '**Likely causes:** OLED and QD-OLED subpixel layouts that ClearType doesn’t match (normal); BGR or unusual subpixel order; 4:2:2 or 4:2:0 chroma; sharpness set too high (halos).',
            '**Test:** [Text Clarity](/text-clarity), [Chroma Subsampling](/chroma-subsampling).',
            '**Fix:** run the ClearType Text Tuner; increase scaling; get 4:4:4 chroma; reduce sharpness. On OLED some fringing is inherent to the panel.',
          ],
        },
      ],
    },
    {
      id: 'motion',
      heading: 'Refresh rate and motion',
      blocks: [
        { h3: 'Stuck at 60 Hz' },
        {
          ul: [
            '**Likely causes:** refresh rate never changed from the default; cable or port without enough bandwidth (older HDMI, adapters, long cables); a monitor OSD setting limiting the DisplayPort or HDMI version; plugged into the motherboard instead of the graphics card.',
            '**Test:** [Refresh Rate](/refresh-rate), [Frame Skipping](/frame-skipping).',
            '**Fix:** select the rate in display settings; use DisplayPort or a certified Ultra High Speed HDMI cable; check the OSD; plug into the GPU.',
          ],
        },
        { h3: 'Ghosting, smearing, or trails' },
        {
          ul: [
            '**Likely causes:** slow LCD transitions (especially dark transitions on VA); overdrive off or too low; inverse ghosting (bright outlines) from overdrive set too high; running below the panel’s maximum refresh rate; a cold panel.',
            '**Test:** [Response Time](/response-time).',
            '**Fix:** try each overdrive level at your usual refresh rate; use the maximum refresh rate; let the panel warm up. Some smearing on VA panels is inherent to the technology.',
          ],
        },
        { h3: 'Tearing or stutter' },
        {
          ul: [
            '**Likely causes:** VRR (G-Sync / FreeSync) off or not supported over the current connection; frame rate above the VRR range with V-Sync off; skipped frames; a background app or browser throttling.',
            '**Test:** [Frame Skipping](/frame-skipping), [Refresh Rate](/refresh-rate).',
            '**Fix:** enable VRR on both the display and GPU; cap the frame rate a few fps below the refresh rate; check for skipped frames with a different cable.',
          ],
        },
        { h3: 'Black screen, “no signal” blinks, or flicker with VRR' },
        {
          ul: [
            '**Likely causes:** marginal cable or port bandwidth at high refresh rates; VRR brightness flicker when the frame rate swings (common on VA and OLED, especially in loading screens); outdated firmware or GPU drivers.',
            '**Test:** [Frame Skipping](/frame-skipping), [Refresh Rate](/refresh-rate).',
            '**Fix:** try a shorter certified cable and a different port; step the refresh rate down to confirm a bandwidth issue; update GPU drivers and monitor firmware; cap the frame rate to keep it stable.',
          ],
        },
        { h3: 'Flicker' },
        {
          ul: [
            '**Likely causes:** PWM backlight dimming at low brightness; VRR flicker; a loose or marginal cable; a failing backlight.',
            '**Test:** [Refresh Rate](/refresh-rate), [White Screen](/white-screen).',
            '**Fix:** raise brightness (PWM is often worse at low brightness); test with VRR off; reseat or swap the cable. A browser can’t measure PWM — a phone camera’s slow-motion mode can sometimes reveal it.',
          ],
        },
      ],
    },
    {
      id: 'color',
      heading: 'Color and gradients',
      blocks: [
        { h3: 'Banding in gradients' },
        {
          ul: [
            '**Likely causes:** 6- or 8-bit output; heavy color correction or ICC profile adjustments; reduced bit depth or chroma at high refresh rates; compression in videos or images (not the display).',
            '**Test:** [Color Gradient](/color-gradient), [Gamma](/gamma).',
            '**Fix:** check bit depth and color format in the GPU control panel; reset picture adjustments; compare with a different refresh rate. Faint banding in dark gradients is normal on many panels.',
          ],
        },
        { h3: 'Colors too saturated' },
        {
          ul: [
            '**Likely causes:** wide-gamut panel showing sRGB content without color management (native gamut mode); “vivid” or “dynamic” picture modes; HDR mode on SDR content in some setups.',
            '**Test:** [Color Gradient](/color-gradient), [Color Distance](/color-distance).',
            '**Fix:** use the monitor’s sRGB mode for everyday content; use a neutral picture mode; install or create a proper ICC profile.',
          ],
        },
        { h3: 'Yellow, pink, or blue tint' },
        {
          ul: [
            '**Likely causes:** Night Light, Night Shift, True Tone or a blue-light filter; warm color temperature preset; viewing angle on IPS/VA; panel tint variance.',
            '**Test:** [White Screen](/white-screen), [Uniformity](/uniformity), [Viewing Angle](/viewing-angle).',
            '**Fix:** turn off blue-light features (including schedules); try the 6500K / sRGB preset; sit centered. A tint on one area that doesn’t change with angle is worth a return inside the window.',
          ],
        },
      ],
    },
    {
      id: 'hdr-brightness',
      heading: 'Brightness and HDR',
      blocks: [
        { h3: 'Screen too dim or too bright in HDR' },
        {
          ul: [
            '**Likely causes:** SDR content brightness slider in Windows; HDR calibration not run; the monitor in an HDR mode with a low brightness cap (such as a “True Black” mode on OLED); automatic brightness limiting on OLED with large bright areas; HDR picture modes with dynamic tone mapping.',
            '**Test:** [HDR Test](/hdr-test), [Brightness](/brightness).',
            '**Fix:** adjust the SDR content brightness slider; run Windows HDR Calibration; try the display’s other HDR modes. Large bright areas dimming on OLED is normal. Use SDR for desktop work if HDR desktop looks wrong.',
          ],
        },
      ],
    },
    {
      id: 'defects-and-ghosts',
      heading: 'Spots, ghosts, and defects',
      blocks: [
        { h3: 'Image ghosts (faint leftover images)' },
        {
          ul: [
            '**Likely causes:** temporary image retention after static content (OLED, some IPS); OLED burn-in; on fast motion, ghosting rather than retention.',
            '**Test:** [Burn-in](/burn-in), [Uniformity](/uniformity).',
            '**Fix:** show varied content and let the display enter standby so OLED compensation runs. If it persists for days, see the [OLED burn-in guide](/guides/oled-burn-in).',
          ],
        },
        { h3: 'A dot that’s always black or always lit' },
        {
          ul: [
            '**Likely causes:** dead pixel (always dark), stuck or hot pixel (always lit), or dust on the screen.',
            '**Test:** [Dead Pixel](/dead-pixel), [Stuck Pixel Fixer](/stuck-pixel-fixer).',
            '**Fix:** clean the screen; try the stuck pixel fixer for lit pixels. Check [dead pixel policies](/guides/dead-pixel-policies) if it stays.',
          ],
        },
      ],
    },
  ],
  related: ['black-level', 'text-clarity', 'chroma-subsampling', 'refresh-rate', 'response-time', 'color-gradient', 'uniformity', 'local-dimming', 'burn-in', 'hdr-test'],
  faqs: [
    {
      question: 'Why do my monitor’s blacks look gray?',
      answer:
        'Most often an HDMI RGB range mismatch, Windows HDR being on for SDR content, or brightness set high. Set full range RGB on the GPU and the matching setting on the display, and check with the [Black Level](/black-level) test. LCDs in a dark room also show some glow.',
    },
    {
      question: 'Why is my 144 Hz monitor stuck at 60 Hz?',
      answer:
        'The refresh rate usually needs selecting manually in display settings, and the cable or port must have enough bandwidth. Use DisplayPort or a certified HDMI cable, plug into the graphics card, and confirm with the [Refresh Rate](/refresh-rate) test.',
    },
    {
      question: 'Why does my monitor flicker with G-Sync or FreeSync?',
      answer:
        'Variable refresh can cause brightness flicker when the frame rate changes quickly, especially on VA and OLED panels and in loading screens. Capping the frame rate, updating firmware and drivers, or using a better cable often helps. Black screens or “no signal” blinks point more to cable bandwidth.',
    },
    {
      question: 'Is text fringing on an OLED monitor a defect?',
      answer:
        'Usually not. OLED and QD-OLED panels use subpixel layouts that Windows ClearType doesn’t fully support, which produces colored edges on text. Tuning ClearType and increasing scaling help.',
    },
    {
      question: 'Can a browser test diagnose every display problem?',
      answer:
        'No. Browser tests are great for spotting defects and settings problems, but they can’t measure input lag, PWM flicker frequency, exact response times or HDR brightness. Those need hardware tools.',
    },
  ],
};
