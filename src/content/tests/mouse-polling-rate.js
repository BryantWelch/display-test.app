export default {
  slug: 'mouse-polling-rate',
  order: 440,
  category: 'motion',
  name: 'Mouse Polling Rate Test',
  shortName: 'Mouse Polling',
  badges: [],
  summary: 'Estimate your mouse’s polling rate (125–8000 Hz) from the movement events your browser receives.',
  seo: {
    title: 'Mouse Polling Rate Test — Check 1000Hz, 4000Hz & 8000Hz Online',
    description:
      'Free mouse polling rate checker. Move your mouse in circles to see the live, average, and max Hz your browser receives, from 125 Hz up to 8000 Hz.',
  },
  inlineTool: () => import('../../tools/MousePollingTool'),
  page: {
    title: 'Mouse Polling Rate Test',
    intro:
      'Move your mouse in fast circles inside the box. The tool counts the position updates your browser receives and estimates the polling rate: how many times per second the mouse reports to the computer.',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How this polling rate test works',
        blocks: [
          'A mouse sends position reports to the computer at a fixed rate: 125 Hz for basic mice, 1000 Hz for most gaming mice, and up to 4000–8000 Hz for some newer models. This tool records the timestamp of every report the browser passes to the page and works out the rate while you’re moving.',
          {
            ul: [
              '**pointermove events** — what ordinary web pages see. Browsers usually bundle mouse movement into one event per display frame, so this tops out near your [refresh rate](/refresh-rate) (60–240 Hz), however fast the mouse is.',
              '**Coalesced samples** — `getCoalescedEvents()` returns every individual report that was bundled into each pointermove event. This is the number to trust in most browsers.',
              '**pointerrawupdate** — mainly Chromium browsers such as Chrome and Edge, on secure (HTTPS) pages. Delivers reports as soon as they arrive, without waiting for the next frame. When available it’s used as the main reading.',
            ],
          },
          'The **histogram** groups the gaps between reports by the nearest standard polling rate. A healthy 1000 Hz mouse puts most samples in the 1000 Hz row. Browsers round event timestamps (to roughly 0.1–1 ms), so at 4000–8000 Hz individual gaps can’t be timed exactly and the histogram spreads out; the Avg and Max readings average over many reports and stay accurate.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to get an accurate reading',
        blocks: [
          {
            ol: [
              'Set the polling rate you want to check in the mouse’s software (or with its button / switch).',
              'Move the mouse in quick, continuous circles inside the box for 3–5 seconds. Small, slow movements send fewer reports, because many mice only report when they’ve actually moved.',
              'Read **Max** for the best sustained rate (measured over a fraction of a second of continuous movement) and **Avg** for the overall picture. Press **Reset** between settings.',
            ],
          },
          'Expect a reading a little under the setting, e.g. 950–1000 for 1000 Hz. At 4000 and 8000 Hz, browsers, USB hubs, and CPU load often limit what arrives, so readings vary more. A wired connection or the 8K dongle plugged straight into the PC (not a hub) helps.',
        ],
      },
      {
        id: 'input-lag',
        heading: 'Polling rate is not input lag',
        blocks: [
          'A higher polling rate cuts the wait between a movement and the next report: up to 8 ms at 125 Hz, 1 ms at 1000 Hz, 0.125 ms at 8000 Hz. That is only one small part of **input lag**, the total time from a click or movement to a visible change on screen.',
          '**A browser cannot measure display input lag.** It only knows when an event arrived and when it handed a frame to the GPU. It can’t see the time inside the mouse, OS, GPU queue, or the monitor’s processing, or how long the pixels took to change. Any website claiming to measure your monitor’s input lag in milliseconds is guessing.',
          { h3: 'How reviewers measure it' },
          {
            ul: [
              '**High-speed camera:** film the mouse and screen together at 1000+ fps, click, and count frames until the screen changes.',
              '**Click-to-photon tools:** devices such as NVIDIA LDAT or the open-source **OSLTT** press a button electronically and use a light sensor on the screen to time the change, many times over.',
              '**Monitor-only lag:** testers compare a monitor against a reference, or use a signal-injection tool such as the Leo Bodnar lag tester, to isolate the display’s own processing delay.',
            ],
          },
          'To keep display lag low: use the monitor’s highest refresh rate, turn off extra picture processing (or enable Game Mode on TVs), and check motion clarity with the [motion blur & ghosting test](/response-time).',
        ],
      },
      {
        id: 'which-rate',
        heading: 'Which polling rate should I use?',
        blocks: [
          {
            table: {
              head: ['Polling rate', 'Report interval', 'Notes'],
              rows: [
                ['125 Hz', '8 ms', 'Office mice; cursor can look choppy on high-refresh screens.'],
                ['500 Hz', '2 ms', 'Fine for most use; lower CPU load.'],
                ['1000 Hz', '1 ms', 'Standard for gaming. Smooth on 144–240 Hz monitors.'],
                ['2000–8000 Hz', '0.5–0.125 ms', 'Smoother cursor paths on 240–540 Hz monitors. Uses more CPU and battery; some games stutter at 8000 Hz.'],
              ],
            },
          },
          'If a game stutters or drops frames when you move the mouse, try a lower polling rate. That’s a CPU or game-engine limit, not a faulty mouse.',
        ],
      },
    ],
    lookFor: {
      good: [
        'Coalesced or raw readings close to your mouse’s setting (e.g. 900–1000 for 1000 Hz) while moving fast.',
        'pointermove events near your monitor’s refresh rate — that’s browser batching, not the mouse.',
        'Most histogram samples in the row matching your setting.',
      ],
      bad: [
        'A 1000 Hz mouse reading near 125 Hz in every source — it may be in a low-power or office mode.',
        'Readings that collapse when you move fast — a wireless interference, USB hub, or receiver-placement problem.',
        'Samples spread across many histogram rows at 1000 Hz or below — the PC, USB port, or wireless link can’t keep up (some spread at 4000–8000 Hz is normal timestamp rounding).',
      ],
    },
    tips: [
      'Move in fast, continuous circles — slow motion sends fewer reports.',
      'Plug the mouse or its wireless dongle directly into the PC, not a hub or monitor USB port.',
      'Use Chrome or Edge to see pointerrawupdate readings.',
      'Close heavy apps; high polling rates need CPU time.',
    ],
    related: ['refresh-rate', 'response-time', 'frame-skipping', 'test-patterns'],
    affiliates: 'responseTime',
    disclaimer:
      'Estimates the rate at which your browser receives pointer updates. It is not a hardware USB analyzer and cannot measure input lag.',
    faqs: [
      {
        question: 'Why does the pointermove number match my monitor’s refresh rate?',
        answer:
          'Browsers deliver one pointermove event per display frame and bundle the extra reports inside it. That’s why this tool also reads coalesced events and, in Chrome or Edge, pointerrawupdate. Those reveal the reports in between.',
      },
      {
        question: 'Why does my 8000 Hz mouse read lower?',
        answer:
          'At very high rates the browser, OS, USB controller, and CPU load can all drop or merge reports, and timestamps may be rounded. Try Chrome, plug the receiver directly into a rear USB port, and close other apps. A reading of several thousand Hz still means high polling is active.',
      },
      {
        question: 'Can this test measure mouse or monitor input lag?',
        answer:
          'No. Input lag includes the mouse, OS, game, GPU, and display, and a browser can’t see most of that chain. Reviewers measure it with high-speed cameras or click-to-photon tools such as OSLTT or NVIDIA LDAT.',
      },
      {
        question: 'Does polling rate matter on a 60 Hz monitor?',
        answer:
          'Only a little. Going from 125 to 500–1000 Hz makes cursor movement smoother and more consistent. Beyond 1000 Hz the benefits show up mainly on high-refresh monitors.',
      },
      {
        question: 'Does this work with touchpads, pens, and touchscreens?',
        answer:
          'Yes — it measures whatever pointer you use and labels it. Touchpads and touchscreens typically report at 60–240 Hz, and pens often at 120–480 Hz.',
      },
    ],
  },
};
