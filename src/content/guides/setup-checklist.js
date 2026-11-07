export default {
  slug: 'setup-checklist',
  order: 10,
  name: 'Before You Test',
  title: 'Before You Test: Monitor Setup Checklist',
  summary: 'The settings to check before any monitor test so you judge the panel, not your configuration.',
  lastReviewed: '2026-11-07',
  seo: {
    title: 'Monitor Test Setup Checklist — Get Accurate Results Before You Test',
    description:
      'Warm-up, native resolution, 100% scaling, refresh rate, HDR, Night Light, RGB range, and room lighting: the checklist to follow before testing a monitor, TV, or laptop screen.',
  },
  intro:
    'Most “defects” people find in the first ten minutes are settings: a blue-light filter, the wrong refresh rate, 125% scaling, or a limited RGB range. Spend five minutes on this checklist first and every test on the site will tell you about the panel instead of your configuration.',
  sections: [
    {
      id: 'quick-checklist',
      heading: 'The quick checklist',
      blocks: [
        'If you only have a minute, check these. Each item is explained below.',
        {
          ol: [
            'Let the display **warm up for 15–30 minutes**.',
            'Set the OS to the panel’s **native resolution** — confirm with the [Screen Resolution](/screen-resolution) tool.',
            'Set display scaling to **100%** for pixel-level tests, and browser zoom to **100%** (`Ctrl/Cmd + 0`).',
            'Go **fullscreen** (`F11` on Windows, `Ctrl + Cmd + F` on macOS, or the test’s own fullscreen button).',
            'Select the **highest refresh rate** you paid for — check with the [Refresh Rate](/refresh-rate) test.',
            'Turn off **dynamic contrast, eco modes, auto-brightness and ambient light sensors**.',
            'Turn off **Night Light, Night Shift, f.lux, True Tone** and any blue-light filter.',
            'Turn **Windows HDR off** for SDR tests unless you are specifically testing HDR.',
            'Check the **RGB range** (full vs limited) matches between the PC and the display.',
            'Match **room lighting** to the test: dark for black level and uniformity, normal for everything else.',
            '**Clean the screen** with a dry microfiber cloth.',
          ],
        },
        {
          note: 'Want the tests run in order with a saved pass/fail report? The [guided checkup](/checkup) walks you through them one at a time.',
        },
      ],
    },
    {
      id: 'warm-up',
      heading: 'Warm up the display',
      blocks: [
        'Panels change as they reach operating temperature. LCD backlights brighten and settle, uniformity and backlight bleed can shift, and response times on LCDs get faster as the liquid crystal warms. OLEDs are more stable but still run compensation and brightness-limiting logic that behaves differently from a cold start.',
        'Leave the screen on for **15–30 minutes** showing normal content before judging brightness, uniformity, or motion. Dead and stuck pixel checks can be done immediately, but it’s worth repeating them once warm — a few stuck pixels only appear at temperature.',
      ],
    },
    {
      id: 'resolution-scaling',
      heading: 'Native resolution, 100% scaling, and browser zoom',
      blocks: [
        'Pixel-level tests (dead pixels, text clarity, chroma subsampling, fine line patterns) assume **one image pixel = one panel pixel**. That only holds when three things line up:',
        {
          ul: [
            '**Native resolution.** Anything else is resampled by the GPU or the display, which blurs fine patterns and can hide single-pixel defects. Your native resolution is the maximum one listed in display settings (often marked “Recommended”).',
            '**100% OS scaling.** At 125% or 150%, the browser draws each CSS pixel across 1.25 or 1.5 device pixels, so one-pixel lines become soft or uneven. Tests that draw on a canvas at device resolution compensate for this, but patterns designed around CSS pixels can’t. Switch to 100% temporarily for pixel-exact tests, then switch back — high scaling is fine for daily use.',
            '**100% browser zoom.** Browser zoom behaves exactly like OS scaling. Press `Ctrl + 0` (`Cmd + 0` on Mac) to reset it.',
          ],
        },
        'On macOS, “Looks like” scaled modes render at a different resolution and then downsample. For pixel-exact tests choose the “Default” option for built-in Retina displays, or the native mode for external monitors.',
        { note: 'The [Screen Resolution](/screen-resolution) tool shows the resolution, device pixel ratio, and scaling your browser is actually reporting.' },
      ],
    },
    {
      id: 'fullscreen',
      heading: 'Go fullscreen',
      blocks: [
        'Browser chrome, the taskbar, and window borders all add bright or colored areas that affect what you see — especially on black-level and uniformity tests, and on OLED or Mini-LED displays where brightness depends on what else is on screen. Use each test’s fullscreen mode, or press `F11` (Windows/Linux) or `Ctrl + Cmd + F` (macOS).',
      ],
    },
    {
      id: 'refresh-rate',
      heading: 'Select the correct refresh rate',
      blocks: [
        'A new high-refresh monitor often starts at 60 Hz. Windows picks a default, cables and ports may limit bandwidth, and some monitors need an OSD setting (or a DisplayPort version setting) before higher rates appear.',
        {
          ul: [
            '**Windows:** Settings → System → Display → Advanced display → *Choose a refresh rate*.',
            '**macOS:** System Settings → Displays → *Refresh rate*.',
            'If the rate you expect isn’t listed, try a different cable (DisplayPort or certified HDMI 2.1 for high refresh at high resolution) and a different port on the GPU, not the motherboard.',
          ],
        },
        'Then confirm in the browser with the [Refresh Rate](/refresh-rate) test, and check for dropped frames with [Frame Skipping](/frame-skipping). Motion tests such as [Response Time](/response-time) are meaningless at the wrong refresh rate.',
      ],
    },
    {
      id: 'picture-processing',
      heading: 'Turn off dynamic picture features',
      blocks: [
        'Features that change brightness or contrast based on content will distort test results — a dark test pattern makes the display dim itself, and a white one makes it brighten.',
        {
          ul: [
            '**Dynamic contrast / DCR / Adaptive contrast** on monitors and TVs.',
            '**Eco, power-saving, or energy modes** that cap brightness or dim on static content.',
            '**Auto-brightness and ambient light sensors** — on laptops, tablets, phones and some monitors. On Windows also look for “Change brightness based on content” (content adaptive brightness control).',
            '**TV processing:** use PC or Game mode, which disables most of it. See [Using a TV as a monitor](/guides/tv-as-monitor).',
          ],
        },
        'Leave **local dimming** at your normal setting for daily-use judgments, but turn it off for dead pixel and uniformity tests — it can hide hot pixels and create blooming that looks like bleed. Test it separately with the [Local Dimming](/local-dimming) test.',
      ],
    },
    {
      id: 'blue-light',
      heading: 'Disable Night Light and blue-light filters',
      blocks: [
        'Night Light (Windows), Night Shift and True Tone (Apple), f.lux, and monitor “low blue light” or “reader” modes all shift the white point toward yellow. That makes whites look dingy, makes [color tests](/color-gradient) look wrong, and can be mistaken for a tint or a uniformity problem. Many of these run on a schedule, so a screen that tested fine in the afternoon can look different in the evening.',
        'Turn them off — including scheduled activation — while testing.',
      ],
    },
    {
      id: 'hdr',
      heading: 'Windows HDR and Auto HDR',
      blocks: [
        'With Windows HDR turned on, the desktop and browser are SDR content mapped into an HDR signal. How that looks depends on the *SDR content brightness* slider, the monitor’s HDR mode, and how Windows maps SDR gamma. On many displays the result is slightly raised or washed-out shadows and different colors from SDR mode — so black-level, gamma and gradient tests won’t reflect the monitor’s normal SDR behavior.',
        {
          ul: [
            'For SDR tests (almost everything on this site), **turn HDR off** in Settings → System → Display.',
            'Turn HDR on only for the [HDR Test](/hdr-test), and know that the browser’s HDR support is limited — see “What browsers can’t control” below.',
            '**Auto HDR** applies to supported games, not the browser, but it’s worth knowing it exists if a game looks different from your desktop.',
          ],
        },
      ],
    },
    {
      id: 'color-management',
      heading: 'Browser color management and ICC profiles',
      blocks: [
        'Browsers color-manage web content using the display profile your OS provides. If a monitor installs a manufacturer ICC profile, or you’ve calibrated with a colorimeter, the browser will apply it — which is usually what you want.',
        {
          ul: [
            'A **wrong or corrupt profile** can tint the whole screen or crush shadows. If colors look off everywhere, try the default sRGB profile temporarily (Windows: *Color Management* control panel; macOS: System Settings → Displays → *Color profile*).',
            '**Wide-gamut monitors** without a profile, or with color management unavailable, show sRGB content oversaturated. An *sRGB* mode in the monitor OSD is often the simplest fix for everyday use.',
            'Different browsers can render the same page slightly differently depending on their color-management settings. If results look odd, compare in a second browser.',
          ],
        },
      ],
    },
    {
      id: 'gpu-scaling',
      heading: 'GPU scaling vs display scaling',
      blocks: [
        'When the signal isn’t at native resolution, either the graphics card or the monitor stretches it. GPU drivers (NVIDIA, AMD, Intel) let you choose which, plus the mode: full-screen stretch, preserve aspect ratio, or no scaling (centered, black borders).',
        'For testing, the answer is simple: **send native resolution and none of this applies**. If you have to test a non-native mode, expect softer edges whichever device scales, and use aspect-ratio-preserving modes so circles in [Test Patterns](/test-patterns) stay round.',
      ],
    },
    {
      id: 'rgb-range',
      heading: 'HDMI RGB range: full vs limited',
      blocks: [
        'PCs normally use **full range** RGB (levels 0–255). Video and TVs traditionally use **limited range** (16–235). Over HDMI, a PC may send limited range to a monitor that expects full, or the reverse:',
        {
          ul: [
            '**PC sends limited, display expects full:** blacks look gray and washed out, whites look slightly dull.',
            '**PC sends full, display expects limited:** shadow detail is crushed to black and highlights clip.',
          ],
        },
        'Fix it at one end and leave the other on auto or matched: NVIDIA Control Panel (*Output dynamic range: Full*), AMD Software (*Pixel Format: RGB 4:4:4 Full RGB*), Intel Graphics (*Quantization range: Full*), and the display’s own setting (often called *HDMI black level*, *RGB range*, or *Black level*). DisplayPort connections are almost always full range already.',
        'Check with the [Black Level](/black-level) and [White Saturation](/white-saturation) tests: you should be able to just see the lowest and highest steps.',
      ],
    },
    {
      id: 'room-lighting',
      heading: 'Room lighting for each test',
      blocks: [
        {
          table: {
            head: ['Test', 'Room lighting', 'Why'],
            rows: [
              ['[Black Level](/black-level), [Uniformity](/uniformity), backlight bleed, [Local Dimming](/local-dimming)', 'Dark or dim', 'Ambient light washes out near-black detail and hides bleed and blooming.'],
              ['[Dead Pixel](/dead-pixel), [Burn-in](/burn-in)', 'Dim', 'Makes small defects and faint retention easier to see without glare.'],
              ['[Gamma](/gamma), [Color Gradient](/color-gradient), [Text Clarity](/text-clarity)', 'Your normal lighting', 'These should look right in the conditions you actually use.'],
              ['[Viewing Angle](/viewing-angle)', 'Normal, no direct glare', 'Reflections at an angle look like color shift.'],
            ],
          },
        },
        'Avoid bright lamps or windows reflecting in the screen for any test. Glossy and semi-glossy coatings show reflections that look like bright spots or uneven patches.',
      ],
    },
    {
      id: 'clean',
      heading: 'Clean the screen',
      blocks: [
        'Dust, fingerprints and smudges look remarkably like dead pixels and dirty-screen effect. Wipe gently with a **dry microfiber cloth**. If you need liquid, slightly dampen the cloth with distilled water — never spray the screen, and check the manufacturer’s guidance before using any cleaning solution on matte or anti-reflective coatings.',
      ],
    },
    {
      id: 'browser-limits',
      heading: 'What browsers can’t control',
      blocks: [
        'A web page can draw exact pixel values, but several things happen after that which no website can see or change. Keep these in mind when a result surprises you:',
        {
          ul: [
            '**OS color management.** The browser hands colors to the OS and display profile; a page can’t bypass an ICC profile, Night Light, or a calibration LUT.',
            '**HDR tone mapping.** In HDR mode, how bright and saturated content looks is decided by the OS, the GPU and the display’s tone mapping. Browser HDR support varies by browser and platform, so treat browser HDR tests as a rough check, not a measurement.',
            '**GPU dithering and bit depth.** Drivers and panels may dither to simulate higher bit depth (or reduce it). That changes how [gradients](/color-gradient) and banding look, and pages can’t detect it.',
            '**Monitor OSD settings.** Sharpness, overdrive, black stabilizer / shadow boost, dynamic contrast and color modes are applied inside the display. Set sharpness to its neutral value (often 0 or the midpoint — it varies by brand) and note your overdrive setting when testing motion.',
            '**TV and panel processing.** TVs apply noise reduction, sharpening, motion smoothing and contrast enhancement unless you choose **PC or Game mode**. OLEDs apply brightness limiting that depends on how much of the screen is bright.',
            '**Input lag and true response times.** Browsers can show motion patterns for visual comparison, but measuring latency or pixel transition times needs dedicated hardware.',
          ],
        },
        { warning: 'Browser tests are visual aids. They are excellent for spotting defects and misconfiguration, but they don’t replace a colorimeter for calibration or lab equipment for measurements.' },
      ],
    },
    {
      id: 'pwm-flicker',
      heading: 'PWM flicker (why there’s no browser test for it)',
      blocks: [
        'Many displays dim the backlight (or OLED pixels) by switching it on and off very quickly — **pulse-width modulation (PWM)**. At lower brightness the off periods get longer. Some people notice it as eye strain, headaches, or a stroboscopic “trail” when moving the mouse or eyes quickly; many don’t notice it at all.',
        'A web page can’t detect PWM: the flicker happens inside the panel, far faster than the browser’s frame rate, and the browser has no light sensor. A “flicker test” page can only show you its own animation, not your backlight.',
        { h3: 'How to check without a meter' },
        {
          ul: [
            '**Phone camera:** point it at the screen showing [white](/white-screen) at low brightness. Dark rolling bands in the viewfinder (or in slow-motion video) suggest PWM. No bands doesn’t prove it’s flicker-free — some cameras hide it.',
            '**Pencil / fan test:** wave a pen quickly in front of a white screen. A smooth blur is fine; several distinct copies suggest PWM.',
            '**Reviews:** reviewers like RTINGS and Notebookcheck measure PWM frequency with a photodiode. Look for “flicker-free” or a high frequency (in the kHz range) if you’re sensitive.',
          ],
        },
        { note: 'If PWM bothers you: run at higher brightness (PWM is usually worse when dimmed), lower brightness with the room lighting instead, or check whether the monitor has a DC-dimming or “flicker-free” setting.' },
      ],
    },
  ],
  related: ['screen-resolution', 'refresh-rate', 'black-level', 'white-saturation', 'uniformity', 'test-patterns'],
  faqs: [
    {
      question: 'How long should I warm up a monitor before testing?',
      answer:
        '15–30 minutes of normal use is enough for most monitors. Brightness, uniformity and LCD response times settle as the panel reaches operating temperature. Dead pixel checks can be done right away, but repeat them once warm.',
    },
    {
      question: 'Why does display scaling matter for monitor tests?',
      answer:
        'At 125% or 150% scaling the browser spreads each pixel of a test pattern across more than one panel pixel, which blurs single-pixel lines and can hide single-pixel defects. Use 100% scaling and 100% browser zoom for pixel-exact tests, then switch back.',
    },
    {
      question: 'Should I turn HDR off before testing?',
      answer:
        'Yes, for SDR tests. With Windows HDR on, the desktop is SDR content mapped into HDR, which often changes shadows, gamma and color. Turn HDR on only when you’re specifically testing HDR.',
    },
    {
      question: 'Why do my blacks look gray over HDMI?',
      answer:
        'Usually an RGB range mismatch: the PC is sending limited range (16–235) and the display is expecting full range (0–255). Set both to full, or set the PC to full and the display to auto. Check with the [Black Level](/black-level) test.',
    },
    {
      question: 'Do I need to calibrate my monitor before testing it?',
      answer:
        'No. Defect tests (dead pixels, uniformity, bleed, burn-in) don’t need calibration. Just use a neutral preset such as Standard or sRGB, turn off dynamic features and blue-light filters, and use native resolution.',
    },
  ],
};
