import Breadcrumbs from '../components/Breadcrumbs';
import { Page, Eyebrow, H1, Lead, Prose } from '../components/ui';
import { Inline } from '../lib/markup';
import { getRouteMeta } from '../registry/routeMeta';
import { tests } from '../registry';

const P = ({ text }) => (
  <p>
    <Inline text={text} />
  </p>
);

const About = () => (
  <Page $narrow>
    <Breadcrumbs items={getRouteMeta('/about').breadcrumbs} />
    <Eyebrow>About</Eyebrow>
    <H1>About Display Test</H1>
    <Lead>
      Display Test is a free, open-source set of {tests.length} browser-based tools for checking a monitor, laptop, TV,
      or phone screen — fast to load, no account, and nothing to install.
    </Lead>

    <Prose style={{ marginTop: '2rem' }}>
      <h2>What it is for</h2>
      <P text="Most people reach for a display test in one of three moments: a new monitor just arrived and the return window is ticking, something looks wrong (blurry text, washed-out blacks, smearing), or they're tuning settings for games or creative work. The [new monitor checkup](/checkup) covers the first, the [symptom checker](/guides/symptom-checker) the second, and every test page explains what normal looks like for the third." />

      <h2>What a browser can and can't tell you</h2>
      <P text="Being honest about this is the point of the site. A browser draws exact pixel values and measures when frames are delivered, so it is genuinely good at:" />
      <ul>
        <li>
          <Inline text="Finding **visible defects** — dead or stuck pixels, backlight bleed, clouding, burn-in, blooming." />
        </li>
        <li>
          <Inline text="Checking **signal and settings problems** — wrong refresh rate, limited vs full RGB range, chroma subsampling, overscan, scaling blur." />
        </li>
        <li>
          <Inline text="Showing **comparative patterns** your eyes can judge — gradients, near-black and near-white steps, gamma estimates, motion clarity." />
        </li>
      </ul>
      <P text="It **cannot** measure brightness in nits, contrast ratio, color accuracy (Delta E), response time in milliseconds, or input lag. Those need a colorimeter, photodiode, or high-speed camera — the [gear page](/gear) lists the tools reviewers actually use. Results also pass through your OS, GPU, and browser color management, which the [setup checklist](/guides/setup-checklist) helps you control." />

      <h2>How the tests are built</h2>
      <P text="Patterns are drawn procedurally at your display's physical pixel resolution, so 1-pixel details stay 1 pixel even with OS scaling. Motion tests use the browser's frame clock and report dropped frames rather than pretending to measure the panel. Everything runs locally; the checkup report is stored in your browser only (see the [privacy policy](/privacy))." />

      <h2>Open source</h2>
      <P text="The code is on [GitHub](https://github.com/BryantWelch/display-test.app). Bug reports, ideas for new tests, and corrections to the guides are welcome through [GitHub Issues](https://github.com/BryantWelch/display-test.app/issues) — there's no support email or ticket system." />

      <h2>How the site is funded</h2>
      <P text="Ads and Amazon affiliate links on some pages pay for hosting; recommendations are chosen for usefulness, not commission, and affiliate links are labeled. If the site saved you a return trip, the Ko-fi link in the footer is appreciated but never required." />

      <h2>Sister sites</h2>
      <P text="Testing other gear? Try [keyboard-test.app](https://keyboard-test.app) and [controller-test.app](https://controller-test.app)." />
    </Prose>
  </Page>
);

export default About;
