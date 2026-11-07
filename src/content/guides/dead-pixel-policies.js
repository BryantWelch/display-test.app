export default {
  slug: 'dead-pixel-policies',
  order: 30,
  name: 'Dead Pixel Policies',
  title: 'How Dead Pixel Policies Work (and How to File a Claim)',
  summary: 'What ISO pixel fault classes, zero-bright-dot guarantees and return windows mean, and how to make a successful claim.',
  lastReviewed: '2026-11-07',
  seo: {
    title: 'Dead Pixel Policy Explained — ISO 9241-307 Classes, Warranties & Returns',
    description:
      'How many dead pixels are acceptable? Learn how pixel fault classes, zero bright dot guarantees, and retailer return windows work, and follow a step-by-step RMA decision tree.',
  },
  intro:
    'Found a bad pixel? Whether you can get it replaced depends less on the defect than on who you ask and when. Retailers, manufacturers and warranty tiers all count pixels differently. This guide explains the vocabulary, the common policy types, and a step-by-step way to decide what to do.',
  sections: [
    {
      id: 'definitions',
      heading: 'Definitions: bright dots, dark dots, and subpixels',
      blocks: [
        'Every pixel on an LCD or OLED is made of subpixels — usually red, green and blue (some OLEDs add white). Policies describe defects by what you see:',
        {
          ul: [
            '**Bright dot (bright pixel, hot pixel):** a pixel or subpixel that stays lit. Most visible on black. Policies treat these most strictly because they’re the most distracting.',
            '**Dark dot (dead pixel):** a pixel or subpixel that stays off. Most visible on white.',
            '**Subpixel defect:** only one subpixel is affected — for example a pixel that stays red (stuck red subpixel) or shows cyan on white (missing red subpixel). Many policies count these separately from whole-pixel defects.',
            '**Cluster:** two or more defects close together, often within a small square of pixels. Policies usually allow far fewer clusters than isolated defects.',
          ],
        },
        'A **stuck pixel** in everyday speech is a bright subpixel defect. A **dead pixel** is a dark one. Use the [Dead Pixel Test](/dead-pixel) to see which you have — the colors on which it appears tell you.',
      ],
    },
    {
      id: 'iso-classes',
      heading: 'ISO pixel fault classes',
      blocks: [
        'Many manufacturer policies reference ISO pixel fault classes. The older **ISO 13406-2** standard defined **Classes I to IV**; it was replaced by **ISO 9241-307**, which uses a similar class idea. Manufacturers still commonly write “Class I” or “Class II” in their policies, sometimes loosely.',
        'The idea is the same in both: a class sets the maximum number of each defect type allowed **per million pixels**. Lower class numbers are stricter.',
        {
          table: {
            head: ['Class', 'What it means in practice'],
            rows: [
              ['**Class 0 / Class I**', 'No pixel faults allowed. ISO 13406-2 called this Class I; ISO 9241-307 calls the zero-fault level Class 0. Rare outside specialist, medical and some premium displays.'],
              ['**Class II**', 'The most common reference for consumer monitors. Allows a small number of bright, dark and subpixel defects per million pixels.'],
              ['**Class III**', 'Allows noticeably more defects. Typical of low-cost or industrial panels.'],
              ['**Class IV**', 'Allows many defects (ISO 13406-2 only). Effectively never used for consumer displays.'],
            ],
          },
        },
        'Because limits are **per million pixels**, a higher-resolution screen can be allowed more defects in absolute terms. A 4K monitor has about 8.3 million pixels, so a policy based on Class II can, in principle, allow several bright and dark defects on a panel that would only be allowed one or two at 1080p.',
        { note: 'In practice, many manufacturers publish their **own** thresholds that are stricter (or simply different) than any ISO class. The ISO class is a starting point, not the policy.' },
      ],
    },
    {
      id: 'how-brands-count',
      heading: 'How manufacturers count defects',
      blocks: [
        'Policies often combine several rules. When reading one, look for:',
        {
          ul: [
            '**Defect type:** separate limits for bright dots, dark dots and subpixel defects. Bright dots almost always have the lowest limit.',
            '**Location:** some policies define a **center zone** (for example a central rectangle covering part of the screen) with stricter limits than the edges.',
            '**Clusters and distance:** limits on how close defects can be to each other, or on clusters of adjacent defects.',
            '**Totals:** an overall maximum regardless of type.',
            '**Product tier:** premium, professional or gaming lines may carry stricter policies than budget lines from the same brand.',
            '**Time limits:** some “zero bright dot” guarantees only apply for an initial period (such as the first weeks or months), after which the standard policy applies.',
          ],
        },
      ],
    },
    {
      id: 'policy-types',
      heading: 'Common policy types',
      blocks: [
        {
          table: {
            head: ['Policy type', 'What it typically covers', 'Who offers it'],
            rows: [
              ['**Retailer return window**', 'Any reason, or any defect, within a fixed period after purchase. Usually the most generous option.', 'Retailers. Terms vary by store, region and product category.'],
              ['**Zero bright dot / premium panel guarantee**', 'Replacement for even a single bright (always-on) pixel; dark dots may still follow the standard policy.', 'Some manufacturers on some product lines, sometimes for a limited period.'],
              ['**Zero dead pixel guarantee**', 'Replacement for any pixel defect, bright or dark.', 'Less common; sometimes offered on premium lines or by retailers as an add-on.'],
              ['**ISO Class II–based policy**', 'Replacement only once the number or location of defects exceeds published limits.', 'The common default for consumer monitors and laptops.'],
              ['**Extended warranty / protection plan**', 'Depends entirely on the plan — some exclude pixel defects below the manufacturer threshold.', 'Retailers and third parties. Read the exclusions.'],
            ],
          },
        },
        'Some brands are known for premium pixel guarantees — Dell, for example, has long marketed a Premium Panel guarantee on many of its monitors. But terms differ by product line and region and change over time.',
        { warning: '**Always verify the current policy on the manufacturer’s website for your exact model and country** before you rely on it. Pixel policies are revised regularly, and what applied to a previous model, or in another country, may not apply to yours. Save a copy (screenshot or PDF) of the policy on the day you check.' },
      ],
    },
    {
      id: 'retailer-vs-manufacturer',
      heading: 'Retailer vs manufacturer',
      blocks: [
        'These are separate routes with very different rules:',
        {
          ul: [
            '**Retailer returns** are governed by the store’s policy (and local consumer law). Within the window, many retailers accept returns of working-but-imperfect monitors, including a single dead pixel. This is almost always your easiest option.',
            '**Manufacturer warranty (RMA)** is governed by the published pixel policy. If your defects fall within its allowance, the claim will usually be declined even though the defect is real.',
            'Some regions have consumer-protection laws that give you rights beyond either policy. Check local consumer guidance if a claim is refused for something you consider a fault.',
          ],
        },
      ],
    },
    {
      id: 'decision-tree',
      heading: 'RMA decision tree',
      blocks: [
        'Follow these steps in order. Stop when one of them resolves the problem.',
        {
          ol: [
            '**Clean the screen** with a dry microfiber cloth. If the spot disappears, it was dust.',
            '**Retest on every color** with the [Dead Pixel Test](/dead-pixel) — white, black, red, green, blue. Check whether the spot moves when you move your head (reflection) or changes with angle (a mark in the coating).',
            '**Classify the defect:** bright on black = bright dot; dark on white = dark dot; visible on only some colors = subpixel defect. Count how many, and note whether any are near the center or close together.',
            '**If it’s stuck (lit), not dead:** power the display off for at least 10 minutes, then run the [Stuck Pixel Fixer](/stuck-pixel-fixer) over the spot for 10–30 minutes. Retest. Dark (dead) pixels won’t respond to this.',
            '**Are you inside the retailer’s return window?** If yes and the defect bothers you, return or exchange through the retailer now. Don’t spend the remaining days trying fixes.',
            '**Outside the return window:** read the manufacturer’s current pixel policy for your model and country. Does your count, type and location exceed it? If yes, file a warranty claim. If no, ask anyway (some brands are flexible for central bright dots) but expect a refusal.',
            '**Have an extended warranty or protection plan?** Check whether it covers pixel defects below the manufacturer threshold.',
            '**Claim refused and the defect is serious?** Escalate politely with your evidence, and check local consumer-protection rules.',
          ],
        },
      ],
    },
    {
      id: 'filing-a-claim',
      heading: 'How to file a claim with good evidence',
      blocks: [
        {
          ol: [
            'Find the defect on the color where it’s most visible and **photograph it**: one close-up (phone at 2–3× zoom, exposure locked) and one wide shot showing its position on the screen.',
            'If there are several, **count and map them** — a quick sketch or a numbered screenshot of the layout is enough.',
            'Write down the **model, serial number, purchase date and order number**, and attach the receipt.',
            'Describe the defect in the policy’s own terms: “one bright subpixel (green) in the center zone” is more effective than “dead pixel”.',
            'Mention what you’ve already tried (cleaning, power cycle, stuck pixel fixer).',
            'Ask what kind of replacement you’ll get (new vs refurbished) and whether you need to ship first or can get an advance replacement.',
            'Before shipping, **retest the replacement** as soon as it arrives — see [How to check a new monitor](/guides/check-new-monitor).',
          ],
        },
      ],
    },
  ],
  related: ['dead-pixel', 'stuck-pixel-fixer', 'white-screen', 'black-screen', 'uniformity'],
  affiliates: 'deadPixel',
  faqs: [
    {
      question: 'How many dead pixels are acceptable on a monitor?',
      answer:
        'There is no single number. Many manufacturers base their policy on an ISO Class II–style allowance, which permits a few defects per million pixels, while some offer zero-bright-dot guarantees on certain lines. Retailers are often more lenient inside their return window. Check the current policy for your exact model.',
    },
    {
      question: 'What is ISO 9241-307 Class II?',
      answer:
        'It’s a pixel fault class that sets a maximum number of bright, dark and subpixel defects per million pixels. It’s the most commonly referenced class for consumer monitors. Because it scales with pixel count, higher-resolution screens can be allowed more defects.',
    },
    {
      question: 'Is a stuck pixel covered by warranty?',
      answer:
        'Usually it counts as a bright dot or subpixel defect, which many policies treat more strictly than dark dots. Whether a single one qualifies depends on the manufacturer and model. Try the [Stuck Pixel Fixer](/stuck-pixel-fixer) first, then check the policy.',
    },
    {
      question: 'Should I return to the retailer or claim from the manufacturer?',
      answer:
        'If you’re still inside the retailer’s return window, the retailer is almost always easier and more generous. Manufacturer warranty claims follow published pixel thresholds and may provide a refurbished replacement.',
    },
    {
      question: 'Do dead pixel policies apply to laptops and TVs?',
      answer:
        'Yes, but laptops and TVs often have their own policies separate from the same brand’s monitors. Look up the policy for the specific product category and model.',
    },
  ],
};
