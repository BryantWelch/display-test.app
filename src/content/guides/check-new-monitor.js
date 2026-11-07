export default {
  slug: 'check-new-monitor',
  order: 20,
  name: 'Check a New Monitor',
  title: 'How to Check a New Monitor Before the Return Window Closes',
  summary: 'A step-by-step inspection for a new monitor, with what’s normal and what’s worth returning at each step.',
  lastReviewed: '2026-11-07',
  seo: {
    title: 'How to Check a New Monitor — Step-by-Step Inspection Checklist',
    description:
      'Just bought a monitor? Check resolution and refresh rate, dead pixels, backlight bleed, black level, gradients, text and motion in order — and learn what’s normal vs worth returning.',
  },
  intro:
    'The return window is the most powerful warranty you’ll ever have: most retailers will take a monitor back for reasons a manufacturer would never accept. This guide walks through the checks in the order that catches the most problems with the least effort, and tells you at each step what’s normal and what’s worth sending back.',
  sections: [
    {
      id: 'use-checkup',
      heading: 'The fastest way: the guided checkup',
      blocks: [
        'The [guided checkup](/checkup) runs the core tests in this guide in order, asks a simple question after each one, and saves a **pass/fail report** you can keep alongside your receipt. If you only do one thing on the day your monitor arrives, do that.',
        'The rest of this guide explains each step in detail, including panel-specific checks the checkup can’t decide for you.',
        { note: 'Do this in the **first few days**, not the last. Some problems (stuck pixels, flicker, VRR issues) are intermittent, and you want time to retest and contact the retailer.' },
      ],
    },
    {
      id: 'before-you-start',
      heading: 'Before you start',
      blocks: [
        'Run through the [setup checklist](/guides/setup-checklist) first: warm up for 15–30 minutes, native resolution, 100% scaling, dynamic contrast and blue-light filters off, Windows HDR off. Many “defects” are configuration.',
        'Also take a moment before you test:',
        {
          ul: [
            'Keep the **box and all packaging** until you’re sure. Many retailers require original packaging for a return.',
            'Note the **return window end date** and the retailer’s policy for opened monitors (some charge restocking fees or treat displays differently).',
            'Photograph the **serial number label** and the panel’s manufacture date if shown.',
            'Inspect the **physical condition**: stand, ports, scratches on the coating, and any rattles. Shipping damage is the easiest return of all.',
          ],
        },
      ],
    },
    {
      id: 'checklist',
      heading: 'The inspection, step by step',
      blocks: [
        { h3: '1. Resolution and refresh rate' },
        'Confirm the monitor is actually running the specs you paid for with [Screen Resolution](/screen-resolution) and [Refresh Rate](/refresh-rate), then check for dropped frames with [Frame Skipping](/frame-skipping).',
        {
          ul: [
            '**Normal:** needing a different cable, port, or OSD setting (like enabling DisplayPort 1.4 or HDMI 2.1 mode) to reach the full refresh rate.',
            '**Returnable:** the advertised resolution or refresh rate isn’t reachable with a supported cable and GPU, or frames are skipped at the advertised rate.',
          ],
        },
        { h3: '2. Dead, stuck, and hot pixels' },
        'Run the [Dead Pixel Test](/dead-pixel) on a clean screen in a dim room. Spend the most time on white, black, red, green and blue.',
        {
          ul: [
            '**Normal:** dust that wipes away, specks that move with your head (reflections).',
            '**Returnable (in the return window):** any defect that bothers you, especially a bright pixel near the center or any cluster. Try the [Stuck Pixel Fixer](/stuck-pixel-fixer) on a stuck pixel first, but don’t let it eat into your window.',
          ],
        },
        'See [How dead pixel policies work](/guides/dead-pixel-policies) for what manufacturers accept once you’re past the return window.',
        { h3: '3. Uniformity, backlight bleed, and glow' },
        'In a dark room, use the [Uniformity](/uniformity) test with dark gray and black fills, then mid-gray and white.',
        {
          ul: [
            '**Normal (LCD):** slightly brighter corners on black in a dark room, and **IPS glow** — a hazy, silvery glow in the corners that **changes when you move your head**.',
            '**Normal (VA):** some dimming at the edges when viewed straight on.',
            '**Returnable:** bright, sharp-edged patches of bleed that **don’t change with viewing angle** and are visible at normal brightness in normal room light; strong tinted or blotchy areas on mid-gray (dirty screen effect) that you notice in everyday content.',
          ],
        },
        { note: 'Phone cameras exaggerate bleed enormously. Judge with your eyes at your normal seating distance and brightness — then photograph it for evidence.' },
        { h3: '4. Black level and RGB range' },
        'Use [Black Level](/black-level) and [White Saturation](/white-saturation). You should just be able to distinguish the lowest and highest steps.',
        {
          ul: [
            '**Normal:** the very first one or two near-black steps being hard to see in a bright room; LCD blacks looking dark gray in a dark room (especially IPS).',
            '**Usually a setting:** blacks look washed out or shadows are crushed — check HDMI RGB range, black stabilizer, and gamma settings first.',
            '**Returnable:** shadows crushed or clipped no matter what settings you use, or obvious tinted near-black on one area of the screen.',
          ],
        },
        { h3: '5. Gradients and banding' },
        'Use [Color Gradient](/color-gradient) and [Gamma](/gamma).',
        {
          ul: [
            '**Normal:** faint banding in very dark gradients, especially on 8-bit panels and over limited bandwidth.',
            '**Usually a setting:** heavy banding in all gradients — check that you’re not running at a reduced bit depth or chroma subsampling, and that no aggressive color-correction or ICC profile is applied.',
            '**Returnable:** strong color tints in grayscale ramps or banding that persists across settings, cables and modes.',
          ],
        },
        { h3: '6. Text and sharpness' },
        'Use [Text Clarity](/text-clarity) and, for TVs or HDMI connections, [Chroma Subsampling](/chroma-subsampling).',
        {
          ul: [
            '**Normal:** slight color fringing on OLED and QD-OLED panels, whose subpixel layouts don’t match what ClearType expects.',
            '**Usually a setting:** blurry text from non-native resolution or scaling, overly sharp halos from the monitor’s sharpness setting, or smeared colored text from 4:2:2/4:2:0 chroma.',
          ],
        },
        { h3: '7. Motion' },
        'Use [Response Time](/response-time) at your monitor’s maximum refresh rate. Try each overdrive setting.',
        {
          ul: [
            '**Normal:** a little trailing on dark transitions, especially on VA panels; mild overshoot (bright or inverse halos) at the most aggressive overdrive setting.',
            '**Returnable:** heavy smearing or obvious overshoot at **every** overdrive setting compared with reviews of the same model, or flicker that appears with VRR in normal use.',
          ],
        },
        { h3: '8. Panel-specific checks' },
        {
          table: {
            head: ['Panel type', 'Extra test', 'What’s normal', 'What’s worth returning'],
            rows: [
              ['Mini-LED / FALD', '[Local Dimming](/local-dimming)', 'Some blooming around bright objects on black; zone transitions on a moving cursor.', 'Dead or stuck zones, zones that flicker, or blooming far worse than reviews of the same model.'],
              ['OLED / QD-OLED', '[Burn-in](/burn-in), [Uniformity](/uniformity)', 'Brightness dropping on large bright areas (ABL); faint banding on very dark gray; text fringing.', 'Image retention or burn-in on a new unit; vertical banding or tinted patches on mid-gray.'],
              ['IPS', '[Viewing Angle](/viewing-angle), [Uniformity](/uniformity)', 'IPS glow in corners that changes with head position.', 'Strong fixed bleed, or a visible yellow/pink tint on one side.'],
              ['VA', '[Viewing Angle](/viewing-angle), [Response Time](/response-time)', 'Gamma/color shift off-axis; slower dark transitions; edges slightly darker from straight on.', 'Severe dark smearing at every overdrive setting, or flicker with VRR that a firmware update doesn’t fix.'],
            ],
          },
        },
      ],
    },
    {
      id: 'evidence',
      heading: 'Document your evidence',
      blocks: [
        'If you find a problem, gather evidence before contacting anyone. It shortens every conversation with support.',
        {
          ul: [
            '**Photos and short videos** of the defect on the test color where it’s clearest. Take one close-up and one wider shot that shows where on the screen it is. Lock your phone’s exposure so it doesn’t brighten a black screen.',
            '**Your settings:** picture mode, brightness, resolution, refresh rate, connection (DP/HDMI) and cable.',
            '**The [checkup](/checkup) report**, date of purchase, serial number, and order number.',
            'For intermittent problems, note **when it happens** (after warm-up, with VRR, at a certain refresh rate).',
          ],
        },
        'Be honest about camera exaggeration — a photo of backlight bleed taken at high exposure in a dark room is less persuasive than one that matches what you see.',
      ],
    },
    {
      id: 'panel-lottery',
      heading: 'The “panel lottery”',
      blocks: [
        'Units of the same model vary — in uniformity, bleed, tint, and pixel defects. That’s why reviews and forum reports sometimes disagree. Two practical consequences:',
        {
          ul: [
            'A replacement unit may be better, the same, or worse. Exchanges for **cosmetic variance** like mild bleed or IPS glow are a gamble.',
            'Clear defects (dead pixels, stuck zones, banding, failure to reach spec) are worth acting on. Mild, normal-for-the-technology variance usually isn’t worth repeated exchanges.',
          ],
        },
      ],
    },
    {
      id: 'return-or-exchange',
      heading: 'Return, exchange, or keep?',
      blocks: [
        {
          table: {
            head: ['Option', 'Good when', 'Watch out for'],
            rows: [
              ['**Return (refund)**', 'The problem is common to the model (motion, glow, coating) or you’ve lost confidence in it.', 'Return window deadlines; restocking fees; original packaging requirements.'],
              ['**Exchange (same model)**', 'You like the model and the issue is unit-specific (pixel defect, unusual bleed, damage).', 'Panel lottery — inspect the replacement just as carefully; some retailers count the exchange as using up your return.'],
              ['**Keep and claim warranty later**', 'Only if you’re out of the return window or the issue appears later.', 'Warranty claims follow manufacturer policy, which is far stricter than retailer returns.'],
            ],
          },
        },
        'When in doubt and still inside the window, contact the retailer early. Policies vary by retailer, region and product, so check the terms on your receipt or the retailer’s site rather than relying on what was true last time.',
      ],
    },
  ],
  related: ['dead-pixel', 'uniformity', 'black-level', 'color-gradient', 'text-clarity', 'response-time', 'local-dimming', 'burn-in', 'viewing-angle', 'refresh-rate'],
  affiliates: 'deadPixel',
  faqs: [
    {
      question: 'What should I check first on a new monitor?',
      answer:
        'Confirm the resolution and refresh rate, then run a dead pixel test and a dark-room uniformity test. Those catch the most common returnable problems. The [guided checkup](/checkup) runs these in order and saves a report.',
    },
    {
      question: 'Is backlight bleed a reason to return a monitor?',
      answer:
        'Some edge glow is normal on LCDs, especially IPS glow that changes with viewing angle. Bright, fixed patches visible in normal room light and normal content are reasonable grounds for a return inside the retailer’s window.',
    },
    {
      question: 'How long do I have to return a monitor?',
      answer:
        'It depends on the retailer and your region — commonly somewhere from two weeks to a month, sometimes longer around holidays. Check your receipt or the retailer’s policy page, and test in the first few days.',
    },
    {
      question: 'Should I exchange or return a monitor with a defect?',
      answer:
        'Exchange if you like the model and the defect is specific to your unit, like a dead pixel. Return if the problem is typical of the model, like motion smearing or strong glow, since a replacement is likely to behave the same.',
    },
    {
      question: 'Can a website fully test a monitor?',
      answer:
        'No. Browser tests are excellent for spotting pixel defects, bleed, banding, range problems and frame skipping. They can’t measure input lag, exact response times, color accuracy or HDR brightness — those need hardware such as a colorimeter.',
    },
  ],
};
