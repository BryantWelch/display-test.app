import Breadcrumbs from '../components/Breadcrumbs';
import { Page, Eyebrow, H1, Meta, Prose } from '../components/ui';
import { Inline } from '../lib/markup';
import { getRouteMeta } from '../registry/routeMeta';

const P = ({ text }) => (
  <p>
    <Inline text={text} />
  </p>
);

const Li = ({ text }) => (
  <li>
    <Inline text={text} />
  </li>
);

const PrivacyPolicy = () => (
  <Page $narrow>
    <Breadcrumbs items={getRouteMeta('/privacy').breadcrumbs} />
    <Eyebrow>Legal</Eyebrow>
    <H1>Privacy policy</H1>
    <Meta>Last updated: November 7, 2026</Meta>

    <Prose style={{ marginTop: '2rem' }}>
      <h2>Overview</h2>
      <P text='Display Test ("we", "our", or "us") operates display-test.app. This policy explains what information is handled when you use the site, including advertising and affiliate features.' />

      <h2>How the testing tools work</h2>
      <P text="Every test runs entirely in your browser. There is no account and no backend that receives your test results. Tools read information your browser already exposes — screen resolution, scaling, refresh timing, color gamut and HDR support, touch and pointer capabilities — to display it back to you. That information is not sent anywhere by us." />

      <h2>What is stored on your device</h2>
      <P text="Some features save data in your browser's **local storage** so they work when you come back:" />
      <ul>
        <Li text="**New monitor checkup** — your pass / minor / fail answers, selected panel type, and a snapshot of display information (resolution, scaling, measured refresh rate, gamut)." />
        <Li text="**Calibration and preferences** — for example the screen ruler's pixels-per-millimetre calibration." />
      </ul>
      <P text="This data never leaves your device unless you choose to copy a report or a share link. A share link encodes your checkup results and resolution in the part of the URL after `#`, which browsers do not send to our server. You can delete stored data with **Start over** on the checkup page or by clearing site data in your browser." />

      <h2>Information we do not collect</h2>
      <ul>
        <Li text="We do not ask you to create an account or submit a contact form." />
        <Li text="We do not store test results on our servers." />
        <Li text="We do not sell your personal information." />
        <Li text="We do not use a first-party analytics product." />
      </ul>

      <h2>Advertising (Google AdSense)</h2>
      <P text="We use Google AdSense to show ads. Google and its partners may use cookies, device identifiers, and similar technologies to serve ads, measure performance, and (where allowed) personalize advertising based on your visits to this and other sites. Ads are not shown inside fullscreen tests." />
      <ul>
        <Li text="[How Google uses data from sites that use its services](https://policies.google.com/technologies/ads)" />
        <Li text="[Google Ad Settings](https://adssettings.google.com/)" />
        <Li text="[Google Privacy Policy](https://policies.google.com/privacy)" />
      </ul>
      <P text="If you use an ad blocker, some of these technologies may not load." />

      <h2>Affiliate links (Amazon Associates)</h2>
      <P text="display-test.app is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. When you click an Amazon link (including amzn.to), Amazon may use cookies to attribute purchases. We may earn a commission on qualifying purchases at no extra cost to you. Amazon's handling of your information is governed by Amazon's privacy policy." />

      <h2>Web fonts</h2>
      <P text="The site's own font is self-hosted. The [Text Clarity Test](/text-clarity) can load a few optional fonts from Google Fonts when you open it, which means your browser contacts Google's font servers and they receive your IP address and browser details. See the [Google Fonts privacy FAQ](https://developers.google.com/fonts/faq/privacy)." />

      <h2>Other third-party links</h2>
      <P text="The site links to other services, including Ko-fi (optional donations), GitHub, our sister sites keyboard-test.app and controller-test.app, and software or manufacturer sites referenced in guides. Those services have their own privacy policies; this policy covers display-test.app only." />

      <h2>Children's privacy</h2>
      <P text="The site is not directed at children under 13, and we do not knowingly collect personal information from children." />

      <h2>Changes to this policy</h2>
      <P text="We may update this policy from time to time. Changes are posted on this page with an updated date." />

      <h2>Contact</h2>
      <P text="Questions about this policy can be raised on [GitHub Issues](https://github.com/BryantWelch/display-test.app/issues)." />
    </Prose>
  </Page>
);

export default PrivacyPolicy;
