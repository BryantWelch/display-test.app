export default {
  slug: 'refresh-rate',
  order: 110,
  category: 'motion',
  name: 'Refresh Rate Test',
  shortName: 'Refresh Rate',
  badges: ['Popular'],
  summary: 'Check your monitor’s real refresh rate (Hz) live, with a frame-time graph and dropped-frame count.',
  seo: {
    title: 'Refresh Rate Test — Is My Monitor Really 144Hz? Check Hz Online',
    description:
      'Free refresh rate test: see the real Hz your monitor runs at (60, 144, 240 Hz+) with a live frame-time graph, and fix a 144Hz monitor stuck at 60Hz.',
  },
  inlineTool: () => import('../../tools/RefreshRateTool'),
  checkup: { step: 10, question: 'Does the measured refresh rate match what your monitor is advertised at?' },
  page: {
    title: 'Refresh Rate Test',
    intro:
      'See the refresh rate your monitor is **actually** running at right now. Use it to confirm a new 144 Hz, 165 Hz, or 240 Hz monitor is set up correctly, or to find out why it’s stuck at 60 Hz.',
    lastReviewed: '2026-11-07',
    sections: [
      {
        id: 'how-it-works',
        heading: 'How a browser measures refresh rate',
        blocks: [
          'Browsers draw a new frame once per display refresh. This page times every one of those frames over the last 240 and works out the average refresh interval, ignoring stalls: 6.94 ms per frame means 144 Hz, 4.17 ms means 240 Hz. The big number is snapped to the nearest standard rate when the measurement is within 3% of one. The smaller figure is the raw measurement — 143.98 Hz on a “144 Hz” monitor is normal.',
          'Because it times the browser, it can only see as many frames as the browser draws. Browser frame caps, energy saver modes, and background tabs lower the number even if the monitor itself runs faster. It also can’t see frames the monitor drops after they leave the graphics card.',
          {
            ul: [
              '**Frame time** — the measured time per refresh.',
              '**Jitter** — how much normal frame times vary (dropped frames are counted separately). Under about 0.5 ms is very steady.',
              '**Dropped** — frames that took more than 1.5× as long as usual. A few while the page loads or you scroll are normal.',
              '**Graph** — the last 240 frames. A flat line is ideal; red spikes are late or dropped frames.',
            ],
          },
          { note: 'Keep the tab visible and in front while measuring. Hidden or background tabs are throttled and will read wrong.' },
        ],
      },
      {
        id: 'stuck-at-60',
        heading: 'Why does my 144 Hz monitor show 60 Hz?',
        blocks: [
          'If the test reads 60 Hz on a high-refresh monitor, the display is usually really running at 60 Hz, or something is capping the browser. Work through these in order:',
          {
            ol: [
              '**The refresh rate isn’t set.** Windows often defaults new monitors to 60 Hz. In Windows 11, go to Settings → System → Display → Advanced display → **Choose a refresh rate** and pick the highest fixed rate. “Dynamic” rates idle at 60 Hz on the desktop. In Windows 10 it’s Settings → System → Display → Advanced display settings → **Refresh rate**.',
              '**Cable or port can’t carry it.** DisplayPort 1.4 handles 1440p at 240 Hz, and 4K at 144 Hz with DSC. HDMI 2.0 tops out around 1440p at 144 Hz and 4K at 60 Hz. For 4K above 60 Hz over HDMI you need HDMI 2.1 on both ends and an Ultra High Speed cable. Some monitors only reach their top rate over DisplayPort, so check the manual. Old, long, or adapter cables often limit you to 60 Hz.',
              '**Plugged into the wrong output.** On a desktop with a graphics card, the cable must go into the card, not the motherboard’s video ports. Laptops may route some ports through the integrated GPU, which may not support high refresh.',
              '**Laptop on battery.** Battery saver, “Dynamic refresh rate”, and many vendor power profiles drop the panel to 60 Hz when unplugged. Plug in and select a performance profile.',
              '**Browser throttling.** Energy saver modes in Chrome and Edge, low-power mode on phones, and background tabs all limit frame rates. Turn energy saver off and keep this tab in front.',
              '**Multiple monitors.** The test measures the monitor the browser window is on. With mixed refresh rates (60 Hz + 144 Hz), move the window to the fast screen and press **Restart measurement**. Some older setups lock every screen to the slowest one. If it still reads the other screen’s rate, try making the fast monitor your main display.',
              '**Safari, iPhone, and iPad.** Safari limits web pages to 60 fps by default, even on 120 Hz ProMotion screens and fast external monitors. Every browser on iPhone and iPad uses Safari’s engine, so they read 60 Hz too. Chrome and Firefox on macOS follow the display rate.',
            ],
          },
          'If the test reads an odd number such as 72 Hz, 100 Hz, or 30 Hz, check for a custom resolution, a TV “PC mode”, or a power-saving mode that halves the frame rate.',
        ],
      },
      {
        id: 'vrr',
        heading: 'G-SYNC, FreeSync, and VRR',
        blocks: [
          'Variable refresh rate lets the monitor wait for each new game frame instead of refreshing on a fixed clock. On the Windows desktop and in browsers the monitor normally runs at its fixed maximum rate, so this test should still show the full figure with VRR enabled.',
          'If the number changes, jumps around, or reads lower with G-SYNC set to “windowed and fullscreen” mode, the browser is being treated as a game. Set G-SYNC to fullscreen-only, or simply note that VRR is working. Games that run below the VRR range use LFC (low framerate compensation), which repeats frames. That’s normal.',
        ],
      },
      {
        id: 'refresh-vs-fps',
        heading: 'Refresh rate vs frame rate',
        blocks: [
          '**Refresh rate (Hz)** is how many times per second the monitor redraws the screen. It’s a property of the display and the connection. **Frame rate (fps)** is how many new images your game or app produces per second. It depends on your GPU, CPU, and settings.',
          {
            table: {
              head: ['Refresh rate', 'Time per refresh', 'Typical use'],
              rows: [
                ['60 Hz', '16.7 ms', 'Office, video, most TVs and laptops'],
                ['120 Hz', '8.3 ms', 'Consoles, ProMotion phones, TVs'],
                ['144 / 165 Hz', '6.9 / 6.1 ms', 'Mainstream gaming monitors'],
                ['240 Hz', '4.2 ms', 'Competitive esports'],
                ['360–540 Hz', '2.8–1.9 ms', 'Top-end esports and OLED'],
              ],
            },
          },
          'You only get the full benefit when fps matches or exceeds Hz. Without VRR, a game running at 70 fps on a 144 Hz monitor holds each frame for about two refreshes, unevenly, which causes judder or tearing. With VRR the monitor slows to 70 Hz to match, which looks smooth, but motion is no clearer than at 70 Hz. Higher refresh rates also reduce motion blur, because each frame is held on screen for less time. See it for yourself in the [motion blur & ghosting test](/response-time).',
        ],
      },
      {
        id: 'mac-linux',
        heading: 'Changing refresh rate on Mac, Linux, and other devices',
        blocks: [
          {
            ul: [
              '**macOS:** System Settings → Displays → select the monitor → **Refresh rate**. ProMotion displays show “ProMotion” — leave it on for up to 120 Hz.',
              '**Linux (GNOME/KDE):** Settings → Displays → Refresh Rate. On X11 you can also run `xrandr` to list modes and `xrandr --output DP-1 --mode 2560x1440 --rate 165` to set one.',
              '**NVIDIA Control Panel:** Display → Change resolution → Refresh rate. **AMD Software:** Settings → Display. Custom resolutions created here can override Windows.',
              '**Android / iPhone:** on Android, high refresh is under Display → Motion smoothness or Smooth Display. On iPhone Pro, ProMotion is automatic, but web pages are capped at 60 fps, so this test reads 60 Hz there. Low Power Mode and battery saver cap the screen at 60 Hz.',
              '**TVs and consoles:** enable 120 Hz output in the console’s video settings, and use an HDMI 2.1 port on the TV (often only some ports support it). See [using a TV as a monitor](/guides/tv-as-monitor).',
            ],
          },
        ],
      },
    ],
    lookFor: {
      good: [
        'The big number matches your monitor’s advertised refresh rate (e.g. 144 or 165).',
        'Raw measurement within a fraction of a hertz of it — 143.9 Hz on a 144 Hz monitor is fine.',
        'A mostly flat frame-time graph with jitter under about 0.5 ms.',
        'Occasional red spikes while scrolling or switching tabs.',
      ],
      bad: [
        '60 Hz on a monitor sold as 120 Hz or higher — check settings, cable, and port.',
        'Exactly half your rated refresh (e.g. 72 on 144) — a power saving mode or an app is limiting frame rate.',
        'Constant red spikes or a jagged graph with the page idle — background load or a driver problem.',
        'A different number every time you restart — VRR, power management, or a mixed multi-monitor setup.',
      ],
    },
    whenToReturn: [
      'The monitor can’t reach its advertised refresh rate on any supported cable and port, after updating GPU drivers and the monitor’s firmware.',
      'The rated refresh rate only works with flicker, blanking, or signal drop-outs (try a certified cable first).',
      'Frame times are consistently erratic at the monitor’s maximum refresh rate but smooth one step lower, and the GPU and other displays aren’t the cause.',
    ],
    tips: [
      'Keep this tab visible and don’t scroll while it measures.',
      'Close other heavy tabs, games, and video.',
      'Plug laptops in and turn off battery or energy saver modes.',
      'On multiple monitors, move the window to the screen you want to test, then restart.',
    ],
    related: ['response-time', 'frame-skipping', 'mouse-polling-rate', 'screen-resolution'],
    affiliates: 'responseTime',
    disclaimer:
      'Measured from browser frame timing. It reflects how often the browser can present frames on this display, which almost always equals the refresh rate, but it is not a hardware signal analyzer.',
    faqs: [
      {
        question: 'How do I know if my monitor is really 144 Hz?',
        answer:
          'Open this page on that monitor with the tab in front. If the big number reads 144, the monitor is running at 144 Hz. If it reads 60, the display is set to 60 Hz or the cable, port, or power mode is holding it back — see the checklist above.',
      },
      {
        question: 'Why does the test show 143.9 Hz instead of 144 Hz?',
        answer:
          'Monitors run on video timings that rarely work out to a perfectly round number, and browser timers add tiny rounding errors. Anything within about 1% of the rated rate is correct; the snapped value is shown in large type.',
      },
      {
        question: 'Can my browser show more than 60 fps?',
        answer:
          'Yes. Chrome, Edge, and Firefox on desktop and Android follow your display’s refresh rate, up to 500 Hz and beyond. Safari, and every browser on iPhone and iPad, limits pages to 60 fps by default, even on ProMotion screens.',
      },
      {
        question: 'Is a higher refresh rate always better?',
        answer:
          'Higher refresh rates reduce motion blur and input delay, but only if your GPU can deliver matching frame rates. Going from 60 to 144 Hz is very noticeable. 240 Hz and up mainly helps fast competitive games.',
      },
      {
        question: 'Does HDMI support 144 Hz?',
        answer:
          'HDMI 2.0 supports 144 Hz at 1080p and 1440p (sometimes with reduced color). 4K at 120 or 144 Hz requires HDMI 2.1 on both the GPU and the monitor, plus an Ultra High Speed cable. DisplayPort 1.4 handles 1440p at 240 Hz and 4K at 144 Hz with DSC.',
      },
      {
        question: 'Does this test detect frame skipping?',
        answer:
          'No. The browser only sees frames it sends. A monitor that is overclocked or out of spec may silently drop frames after they leave the GPU. Use the [frame skipping test](/frame-skipping) and a camera to check.',
      },
    ],
  },
};
