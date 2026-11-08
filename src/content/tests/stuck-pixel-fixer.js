export default {
  slug: 'stuck-pixel-fixer',
  order: 205,
  category: 'defects',
  name: 'Stuck Pixel Fixer',
  shortName: 'Stuck Pixel Fixer',
  badges: ['Popular'],
  summary: 'A draggable, rapidly flashing square that can sometimes revive stuck pixels. Includes a timer and auto-stop.',
  seo: {
    title: 'Stuck Pixel Fixer — Free Online Tool to Unstick Pixels',
    description:
      'Free stuck pixel fixer: drag a flashing square over a stuck pixel and run it on a timer. Honest odds, safety tips, and what to do if it doesn’t work.',
  },
  testSeo: {
    title: 'Stuck Pixel Fixer — Fullscreen',
    description: 'Flashing noise square with timer for unsticking stuck pixels.',
  },
  load: () => import('../../pages/tests/StuckPixelFixerTest'),
  photosensitive: true,
  page: {
    title: 'Stuck Pixel Fixer',
    intro:
      'Rapidly cycling a stuck pixel through red, green, blue, white, and black sometimes gets it working again. It’s free, it can’t hurt the panel, and it takes about 20 minutes to find out.',
    startLabel: 'Start stuck pixel fixer',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'stuck-vs-dead',
        heading: 'Stuck vs dead: what this can fix',
        blocks: [
          {
            ul: [
              '**Stuck pixel** — stays lit in one color (red, green, blue, or a mix) because a subpixel’s liquid crystal or transistor is stuck in one state. **Sometimes fixable.**',
              '**Hot pixel** — always bright white. Occasionally responds the same way as a stuck pixel.',
              '**Dead pixel** — always black (on most panels) because it gets no power or has a broken connection. **Not fixable** by any software.',
            ],
          },
          'Not sure which you have? Use the [dead pixel test](/dead-pixel) first: a pixel that changes nothing on any color, and is black on white, is dead.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to use the fixer',
        blocks: [
          {
            ol: [
              'Find the pixel with the [dead pixel test](/dead-pixel) and note where it is.',
              'Start the fixer and accept the photosensitivity warning.',
              'Drag the square over the pixel (or move it with the arrow keys; hold **Shift** for 10 px steps). Make it a bit larger than the defect.',
              'Pick a timer — **10–20 minutes** is a good first run — and press **Start flashing**. Look away while it runs.',
              'When it stops, recheck with the dead pixel test on black, white, and the color it was stuck on.',
              'If it improved but isn’t gone, try another 20–30 minutes. If nothing changed after about an hour total, it’s unlikely to respond.',
            ],
          },
          'Can’t pinpoint the pixel? Turn on **Flash the whole screen**. It’s more intense, so sit back or leave the room.',
        ],
      },
      {
        id: 'odds',
        heading: 'Honest odds',
        blocks: [
          'Nobody publishes reliable success rates. Anecdotally, rapid flashing revives a minority of stuck pixels — most often ones that appeared recently or that flicker on and off. Pixels that have been stuck for months, or that are fully dead, rarely or never respond.',
          'There’s no proven scientific mechanism either: the idea is that rapidly switching the subpixel can free a liquid crystal or transistor that’s stuck in one state. It can’t repair broken wiring, which is why it never fixes dead pixels.',
          { note: 'If the display is still inside its return window, a return or exchange is the surest fix. Run the fixer if you want to keep the unit, but don’t let the window close while you wait.' },
        ],
      },
      {
        id: 'safety',
        heading: 'Safety',
        blocks: [
          { warning: 'This tool flashes rapidly changing colors. Don’t use it if you or anyone nearby has photosensitive epilepsy or is sensitive to flashing light. Look away or leave the room while it runs.' },
          {
            ul: [
              'Flashing can’t harm an LCD or OLED panel. On OLED, driving one small area hard for hours adds a tiny amount of uneven wear, so stick to the timer.',
              'Pressing or rubbing the screen is a common tip, but it can create more dead pixels, damage touch layers, and void warranties. We don’t recommend it.',
              'The page keeps the screen awake while the timer runs, then stops automatically.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'The square stays exactly over the bad pixel while it flashes.',
        'After a run, the pixel matches its neighbors on every color in the dead pixel test.',
      ],
      bad: [
        'The pixel stays black on every color — it’s dead and won’t respond.',
        'No change at all after about an hour of total running time.',
        'More defects appear over days — a panel fault, not a stuck pixel.',
      ],
    },
    panelNotes: [
      { panel: 'IPS / VA / TN (LCD)', note: 'Stuck subpixels are most common here and the most likely to respond to flashing.' },
      { panel: 'OLED / QD-OLED', note: 'Stuck pixels are rarer and less likely to respond. Keep runs short and use the timer. Running the display’s built-in pixel or panel refresh is worth trying first.' },
      { panel: 'Phones and laptops', note: 'Works the same way. Disable auto-lock or rely on the wake lock, and keep the device plugged in.' },
    ],
    whenToReturn: [
      'Inside the retailer return window and the pixel is near the center or bothers you — return it.',
      'Dead pixels, clusters, or lines of bad pixels — these won’t be fixed by flashing.',
      'Outside the window: check your manufacturer’s pixel policy in the [dead pixel policies guide](/guides/dead-pixel-policies).',
    ],
    tips: [
      'Confirm the defect with the dead pixel test first.',
      'Look away while the square flashes.',
      'Use 10–20 minute runs and recheck between them.',
      'Keep laptops and phones plugged in during longer runs.',
    ],
    related: ['dead-pixel', 'uniformity', 'burn-in', 'screen-resolution'],
    affiliates: 'deadPixel',
    disclaimer:
      'Results aren’t guaranteed. Flashing can sometimes revive stuck pixels but cannot repair dead pixels or panel faults. Contains rapidly flashing colors.',
    faqs: [
      {
        question: 'Do stuck pixel fixers actually work?',
        answer:
          'Sometimes. Rapid color cycling revives a minority of stuck pixels, usually recent ones. It never works on dead pixels, which have no power or a broken connection. It’s free and harmless to try.',
      },
      {
        question: 'How long should I run the stuck pixel fixer?',
        answer:
          'Start with 10–20 minutes, then check. If it improved, run another 20–30 minutes. If there’s no change after about an hour in total, it’s unlikely to help.',
      },
      {
        question: 'Can a stuck pixel fix itself?',
        answer:
          'Occasionally, yes — some stuck pixels clear after days of normal use or a power cycle. Try turning the display off for 10 minutes before running the fixer.',
      },
      {
        question: 'Can this damage my screen?',
        answer:
          'No. Flashing colors are normal content for any panel. The only caution is OLED: don’t run any single bright pattern for many hours, which is why the tool has a timer and auto-stop.',
      },
      {
        question: 'Should I press on the stuck pixel?',
        answer:
          'We don’t recommend it. Pressure can damage the panel, create new dead pixels, crack touch layers, and void warranties — especially on OLED, laptops, and phones.',
      },
    ],
  },
};
