export default {
  slug: 'oled-burn-in',
  order: 40,
  name: 'OLED Burn-in',
  title: 'OLED Burn-in Explained: Causes, Prevention, and How to Check',
  summary: 'Why OLED burn-in happens, how it differs from temporary image retention, and practical ways to reduce the risk.',
  lastReviewed: '2026-11-07',
  seo: {
    title: 'OLED Burn-in Explained — Image Retention vs Burn-in, Prevention & Testing',
    description:
      'What causes OLED burn-in, how it differs from temporary image retention, WOLED vs QD-OLED, how to prevent it on monitors, TVs, phones and laptops, and how to check your screen.',
  },
  intro:
    'OLED pixels make their own light, which is why they deliver perfect blacks and instant response — and also why they can wear unevenly. Burn-in is a real risk, but it’s a slow one, and modern panels include several defenses. Here’s what actually causes it, how to tell it apart from harmless temporary retention, and what you can do about it.',
  sections: [
    {
      id: 'burn-in-vs-retention',
      heading: 'Burn-in vs temporary image retention',
      blocks: [
        'Both look like a faint ghost of something that was on screen — a taskbar, logo, or game HUD — but they’re different problems:',
        {
          table: {
            head: ['', 'Temporary image retention', 'Burn-in'],
            rows: [
              ['**What it is**', 'A short-term after-image from pixels that haven’t settled after showing static content.', 'Permanent uneven wear: some subpixels have aged more than their neighbors.'],
              ['**How long it lasts**', 'Fades within minutes to hours of varied content, or after the panel’s compensation cycle.', 'Doesn’t fade with use or rest. Compensation can reduce its visibility, but not undo the wear.'],
              ['**How common**', 'Fairly common and normal on OLED, especially after hours of static content at high brightness.', 'Develops over long periods of repeated static content.'],
            ],
          },
        },
        'If you see a ghost image, don’t panic. Switch to varied content, let the display go into standby so it can run its short compensation cycle, and check again the next day. If it’s still there after several days of normal use and compensation cycles, it’s likely burn-in.',
      ],
    },
    {
      id: 'why',
      heading: 'Why burn-in happens',
      blocks: [
        'Each OLED subpixel’s organic material gradually loses efficiency the more light it produces over its lifetime. The display normally ages evenly because content changes. When the same area shows the same bright, static content for thousands of hours, those subpixels age faster than the rest, and the difference becomes visible as a ghost — usually most visible on uniform gray or colored backgrounds.',
        {
          ul: [
            '**Blue emitters** have historically aged fastest, which is why panel designs work around them.',
            '**Brightness matters:** driving a subpixel harder ages it faster, so static content at high brightness (or HDR highlights) wears more quickly.',
            '**Compensation:** panels track how much each area has been used and adjust drive levels to even out wear. This hides early, mild wear — but it uses some of the panel’s headroom, so it isn’t a free fix.',
          ],
        },
      ],
    },
    {
      id: 'woled-qdoled',
      heading: 'WOLED vs QD-OLED',
      blocks: [
        'The two main large-screen OLED technologies handle color differently, which affects how they age and how they look:',
        {
          ul: [
            '**WOLED** (used by LG Display) uses white-emitting OLED material with color filters, plus an extra unfiltered white subpixel (an RGBW layout). The white subpixel boosts brightness efficiently.',
            '**QD-OLED** (used by Samsung Display) uses blue OLED emitters, with quantum dots converting some of that light to red and green. Its subpixels are arranged in a triangular pattern, which causes visible color fringing on text.',
          ],
        },
        'Both are susceptible to burn-in, and both have improved generation over generation. Long-term results depend heavily on usage patterns, brightness and the manufacturer’s compensation, so it’s not useful to say one is simply “safer” than the other.',
        { note: 'Text fringing on OLED is a subpixel-layout effect, not burn-in or a defect. See [Text Clarity](/text-clarity).' },
      ],
    },
    {
      id: 'risk-factors',
      heading: 'What raises the risk',
      blocks: [
        {
          ul: [
            '**Static desktop UI:** taskbars, docks, menu bars, desktop icons, and window title bars that sit in the same place for hours every day.',
            '**Game HUDs:** health bars, minimaps, ammo counters, and scoreboards, especially in games you play for long sessions.',
            '**News tickers and channel logos** on TVs.',
            '**High brightness** and HDR, which drive subpixels harder.',
            '**Long uninterrupted sessions** with the same layout, and leaving a static screen on while you’re away.',
            '**Interrupting compensation cycles** by unplugging the display or cutting power at the wall.',
          ],
        },
        'Mixed use — videos, games, browsing, different apps — is much lower risk than a fixed spreadsheet or trading layout eight hours a day.',
      ],
    },
    {
      id: 'mitigation',
      heading: 'How to reduce burn-in risk',
      blocks: [
        {
          ul: [
            '**Leave pixel shift / screen move enabled.** It moves the image by a few pixels over time so edges of static elements aren’t always on the same subpixels.',
            '**Auto-hide the taskbar or dock**, and avoid desktop icons sitting in one spot for hours.',
            '**Use dark mode** where you like it — dark backgrounds mean fewer subpixels running hard.',
            '**Use a short screen-off timeout** or a black screen saver, rather than leaving a static image up while you’re away.',
            '**Lower brightness** for desktop work. You rarely need maximum SDR brightness indoors.',
            '**Let the panel run its pixel refresh / compensation cycles.** Many OLED displays run a short cycle automatically in standby after use. Turn the display off with its power button or let it sleep — **don’t unplug it or cut power at the wall** right afterwards. Run the longer manual refresh only when the manufacturer recommends it.',
            '**Enable the display’s own protection features** (static logo dimming, taskbar detection, screen savers) unless they cause a specific problem for you.',
            '**Vary content** — and for desktop-heavy use, consider whether an LCD is a better fit.',
          ],
        },
      ],
    },
    {
      id: 'warranty',
      heading: 'Burn-in warranties',
      blocks: [
        'Coverage varies a lot. Some OLED monitor brands explicitly include burn-in in their warranty for a set number of years, while others exclude it as “normal wear” or say nothing. TV and phone warranties often exclude it. Coverage may also differ by region and product line.',
        { warning: 'Check the **current written warranty** for your exact model and country before buying, and keep a copy. Burn-in coverage is a major difference between OLED products, and policies change.' },
        'If you need to make a claim, document it the same way as a pixel defect: photos on the colors where it’s most visible (usually uniform gray, red, or blue), your typical usage, and confirmation that you’ve let compensation cycles run.',
      ],
    },
    {
      id: 'check',
      heading: 'How to check for burn-in',
      blocks: [
        {
          ol: [
            'Let the display run varied content for a while first, so temporary retention has a chance to clear.',
            'Open the [Burn-in Test](/burn-in) in fullscreen in a dim room.',
            'Look at **mid-gray**, then **red, green, blue** and **white**. Burn-in is usually easiest to see on solid gray or a single primary color.',
            'Look for faint shapes in the positions of your taskbar, game HUD, logos or window edges. Move your head — reflections move, burn-in doesn’t.',
            'Compare with the [Uniformity](/uniformity) test; some OLED panels have faint vertical banding on dark gray from manufacturing that isn’t burn-in.',
          ],
        },
      ],
    },
    {
      id: 'phones-laptops',
      heading: 'Phones and laptops',
      blocks: [
        'Most phones and many laptops and tablets use OLED, so the same principles apply. Status bars, navigation bars, keyboard areas, and always-on displays are the usual culprits. Phones mitigate this with pixel shifting and dimming, and many people never see burn-in over a phone’s life — but heavy use of one app at full brightness (navigation, for example) can show up over time.',
        'You can run the [Burn-in Test](/burn-in) in a phone’s browser. Turn off auto-brightness, go fullscreen, and look at the gray and solid-color screens.',
      ],
    },
  ],
  related: ['burn-in', 'uniformity', 'black-screen', 'white-screen', 'text-clarity', 'dead-pixel'],
  faqs: [
    {
      question: 'Is OLED burn-in permanent?',
      answer:
        'True burn-in is permanent uneven wear of the subpixels. Temporary image retention, which looks similar, fades after varied content or after the panel’s compensation cycle. If a ghost image survives several days of normal use and compensation cycles, treat it as burn-in.',
    },
    {
      question: 'Can a burn-in fixer video remove burn-in?',
      answer:
        'It can help clear temporary image retention, but it can’t restore worn subpixels. Running bright patterns for hours also adds wear to the rest of the panel. Let the display’s own compensation cycle run instead.',
    },
    {
      question: 'Should I unplug my OLED TV or monitor when not in use?',
      answer:
        'Generally no. Many OLEDs run their compensation cycle in standby after you turn them off. Use the power button and leave them plugged in, unless the manufacturer says otherwise.',
    },
    {
      question: 'Is QD-OLED or WOLED more resistant to burn-in?',
      answer:
        'Both can burn in, and both have improved with each generation. Real-world results depend more on usage, brightness and the manufacturer’s mitigation than on the panel type alone.',
    },
    {
      question: 'Does burn-in happen on LCD monitors?',
      answer:
        'LCDs don’t suffer OLED-style burn-in, though some can show temporary image retention after very long static images. It usually clears after the screen is turned off for a while.',
    },
  ],
};
