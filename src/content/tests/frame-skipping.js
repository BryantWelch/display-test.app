export default {
  slug: 'frame-skipping',
  order: 420,
  category: 'motion',
  name: 'Frame Skipping Test',
  shortName: 'Frame Skipping',
  badges: [],
  summary: 'Light one square per frame and photograph it to catch a monitor that silently drops frames.',
  seo: {
    title: 'Frame Skipping Test — Check If Your Monitor Drops Frames | Free',
    description:
      'Free frame skipping test. One square lights per refresh; a slow-shutter photo shows whether your monitor (especially an overclocked one) displays every frame.',
  },
  testSeo: {
    title: 'Frame Skipping Test — Fullscreen',
    description: 'One square lights per frame; photograph it with a slow shutter to detect skipped frames.',
  },
  load: () => import('../../pages/tests/FrameSkippingTest'),
  page: {
    title: 'Frame Skipping Test',
    intro:
      'Some monitors accept a high refresh rate but quietly throw frames away, so 75 Hz looks no smoother than 60. This test lights one square per frame. A quick long-exposure photo shows whether every frame really made it to the screen.',
    startLabel: 'Start frame skipping test',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'what-is',
        heading: 'What is frame skipping?',
        blocks: [
          'Frame skipping happens when the monitor receives a signal at one refresh rate but its panel actually updates less often. For example, it accepts 75 Hz but drops every fifth frame to show 60. Windows, the GPU, and the browser all report the higher rate, because the frames *were* sent. The [refresh rate test](/refresh-rate) can’t catch it either: it only times frames leaving the browser.',
          'It is most common when you **overclock** a monitor with a custom resolution (CRU, NVIDIA or AMD custom modes), and on some cheap or older monitors and TVs at non-native rates. Motion looks juddery even though every number says it should be smooth.',
        ],
      },
      {
        id: 'how-to',
        heading: 'How to run the test',
        blocks: [
          {
            ol: [
              'Set the refresh rate you want to verify, then click **Start frame skipping test**.',
              'Wait for the status above the grid to turn green: **Ready**. That means the browser is delivering frames steadily and isn’t dropping any of its own.',
              'Press **H** to hide the control panel.',
              'Use your phone camera’s Pro / manual mode (or a long-exposure app) and set the shutter to **1/10 s or slower**. Keep ISO low and hold the phone steady, or rest it on something.',
              'Take the photo of the grid. Take two or three to be sure.',
            ],
          },
          'At 1/10 s you should see about one tenth of your refresh rate in lit squares: roughly 6 at 60 Hz, 14 at 144 Hz, 24 at 240 Hz. If the run wraps past the last square, choose more squares.',
        ],
      },
      {
        id: 'reading',
        heading: 'Reading the photo',
        blocks: [
          {
            table: {
              head: ['In the photo', 'Meaning'],
              rows: [
                ['One unbroken run of evenly lit squares', 'No frame skipping — every frame was displayed.'],
                ['Regular gaps (e.g. every 4th or 5th square dark)', 'The monitor is skipping frames. The real refresh rate is lower than the setting.'],
                ['A dimmer square at the start or end of the run', 'The shutter opened or closed partway through that frame. This is normal.'],
                ['One square clearly brighter than its neighbours', 'The browser delivered a frame late, so that square stayed lit for two refreshes. Check the dropped-frame count in the panel and retake the photo.'],
                ['A single gap next to a brighter square', 'A one-off hiccup in the browser or compositor, not the monitor. Retake the photo: real frame skipping repeats at the same interval in every shot.'],
                ['Every square lit evenly', 'The exposure was longer than the whole grid cycle — use a faster shutter or more squares.'],
              ],
            },
          },
          'Squares may look slightly brighter at one end of the run and dimmer at the other. That comes from the camera shutter and from the panel’s pixel response, not skipped frames.',
          { note: 'With backlight strobing / black frame insertion on, the photo can show uneven brightness from the strobe. Turn strobing off for this test.' },
        ],
      },
      {
        id: 'fix',
        heading: 'If your monitor skips frames',
        blocks: [
          {
            ul: [
              'Lower the custom refresh rate until the photo shows no gaps. That is the true maximum for your panel.',
              'Try **reduced blanking** timings (CVT-RB / CVT-RB2) in your custom resolution tool. They lower the pixel clock and sometimes avoid skipping.',
              'Use the monitor’s officially supported refresh rates. Out-of-spec overclocks aren’t guaranteed to work and may not be covered by warranty.',
              'If an **advertised** refresh rate skips frames, that’s a defect — contact the seller.',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'A continuous run of lit squares with no gaps in a 1/10 s photo.',
        'Run length close to one tenth of your refresh rate.',
        'The status reads **Ready** in green while you take the photo.',
      ],
      bad: [
        'Dark squares at a regular interval inside the lit run — the monitor is skipping frames.',
        'Fewer lit squares than the run spans (e.g. 6 lit across 7–8 positions at a “75 Hz” setting) — the panel is really running slower.',
        'The status never turns green — the browser itself is dropping frames; close other apps and retry.',
      ],
    },
    whenToReturn: [
      'Frame skipping at any refresh rate the manufacturer **advertises** — the monitor isn’t delivering what was sold.',
      'Skipping that only happens with overclocked or custom modes isn’t a defect. Go back to a supported rate.',
    ],
    tips: [
      'Run the [refresh rate test](/refresh-rate) first to confirm the rate you set is active.',
      'Close other apps and tabs so the browser doesn’t drop frames.',
      'Turn off backlight strobing / black frame insertion.',
      'A phone camera with manual shutter (Pro mode) or a long-exposure app works fine.',
    ],
    related: ['refresh-rate', 'response-time', 'mouse-polling-rate', 'test-patterns'],
    affiliates: 'responseTime',
    disclaimer:
      'A camera-assisted check. The browser can’t see frames dropped inside the monitor, so the photo is the result.',
    faqs: [
      {
        question: 'Why can’t software detect frame skipping?',
        answer:
          'The GPU sends every frame and the monitor acknowledges the signal, so Windows, drivers, and the browser all report the full refresh rate. The monitor drops the frame internally, after it’s already out of the computer’s hands. Only a camera can see what the panel actually displayed.',
      },
      {
        question: 'What shutter speed should I use?',
        answer:
          '1/10 s is a good default. It captures about a tenth of a second of frames, which is enough to see a pattern without wrapping around the grid at the default 60 squares, even at 500 Hz. If the run does wrap (fewer squares, or a slower shutter), choose more squares or use 1/20 s.',
      },
      {
        question: 'Does frame skipping happen at the monitor’s default refresh rate?',
        answer:
          'Rarely. It’s mostly a problem with overclocked refresh rates and some budget monitors or TVs at non-native rates. Still, a 30-second check on a new monitor costs nothing.',
      },
      {
        question: 'Is frame skipping the same as stutter or dropped frames in games?',
        answer:
          'No. In-game stutter means the computer didn’t produce a frame in time; the [refresh rate test](/refresh-rate) and the dropped-frame counter here catch that. Frame skipping means the computer did send the frame but the monitor didn’t show it.',
      },
    ],
  },
};
