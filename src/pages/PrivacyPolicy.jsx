import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 2rem;
  color: var(--text);
`;

const Section = styled.section`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: var(--primary);
  margin-bottom: 2rem;
`;

const Heading = styled.h2`
  color: var(--primary);
  margin: 1.5rem 0 1rem;
`;

const Text = styled.p`
  margin-bottom: 1rem;
  line-height: 1.6;
`;

const List = styled.ul`
  margin: 1rem 0;
  padding-left: 2rem;
  
  li {
    margin-bottom: 0.5rem;
    line-height: 1.6;
  }
`;

const ExternalLink = styled.a`
  color: var(--primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PrivacyPolicy = () => {
  return (
    <Container>
      <Title>Privacy Policy</Title>
      
      <Section>
        <Text>Last updated: August 8, 2026</Text>
        
        <Heading>Overview</Heading>
        <Text>
          Display Test App (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) operates display-test.app.
          This Privacy Policy explains what information is handled when you use the site,
          including advertising and affiliate features.
        </Text>
      </Section>

      <Section>
        <Heading>How the Testing Tools Work</Heading>
        <Text>
          The display tests themselves run in your browser. We do not require an account,
          and we do not operate a backend that stores your test results or personal profile
          data. Visual tests and settings stay on your device unless you choose to share
          them yourself.
        </Text>
      </Section>

      <Section>
        <Heading>Information We Do Not Collect Directly</Heading>
        <Text>We do not:</Text>
        <List>
          <li>Ask you to create an account or submit a contact form on this site</li>
          <li>Store test results on our own servers</li>
          <li>Sell your personal information</li>
        </List>
        <Text>
          Third-party services we use (described below) may collect information according
          to their own policies when their technologies load on the site or when you follow
          outbound links.
        </Text>
      </Section>

      <Section>
        <Heading>Advertising (Google AdSense)</Heading>
        <Text>
          We use Google AdSense to show ads. Google and its advertising partners may use
          cookies, device identifiers, and similar technologies to serve ads, measure
          performance, and (where allowed) personalize advertising based on your visits
          to this and other sites.
        </Text>
        <Text>
          You can learn more about how Google uses data when you use partners&apos; sites
          or apps, and manage ad settings, here:
        </Text>
        <List>
          <li>
            <ExternalLink
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              How Google uses data from sites or apps that use our services
            </ExternalLink>
          </li>
          <li>
            <ExternalLink
              href="https://adssettings.google.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Ad Settings
            </ExternalLink>
          </li>
          <li>
            <ExternalLink
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google Privacy Policy
            </ExternalLink>
          </li>
        </List>
        <Text>
          If you use an ad blocker or similar tools, some of these technologies may not load.
        </Text>
      </Section>

      <Section>
        <Heading>Affiliate Links (Amazon Associates)</Heading>
        <Text>
          display-test.app is a participant in the Amazon Services LLC Associates Program,
          an affiliate advertising program designed to provide a means for sites to earn
          advertising fees by advertising and linking to Amazon.com and related sites.
        </Text>
        <Text>
          When you click Amazon (including amzn.to) links on this site, Amazon may use
          cookies and similar technologies to track referrals and attribute purchases.
          We may earn a commission on qualifying purchases at no additional cost to you.
          Amazon&apos;s handling of your information is governed by Amazon&apos;s privacy
          policy.
        </Text>
      </Section>

      <Section>
        <Heading>Other Third-Party Links and Services</Heading>
        <Text>
          The site may link to or load content from other services, including:
        </Text>
        <List>
          <li>Ko-fi (optional donations)</li>
          <li>Related tools such as keyboard-test.app and controller-test.app</li>
          <li>GitHub (source code, issues, and project pages)</li>
          <li>External product, software, and resource sites linked from navigation or content</li>
        </List>
        <Text>
          Those services have their own privacy policies. This policy only covers
          display-test.app.
        </Text>
      </Section>

      <Section>
        <Heading>Cookies and Similar Technologies</Heading>
        <Text>
          Cookies and similar technologies may be set by Google AdSense and by third
          parties when you interact with ads or follow affiliate or external links.
          We do not use a first-party analytics product on this site today, but advertising
          and affiliate partners may still collect usage and device data as described above.
        </Text>
      </Section>

      <Section>
        <Heading>Children&apos;s Privacy</Heading>
        <Text>
          The site is not directed at children under 13, and we do not knowingly collect
          personal information from children.
        </Text>
      </Section>

      <Section>
        <Heading>Changes to This Policy</Heading>
        <Text>
          We may update this privacy policy from time to time. Changes will be posted on
          this page with an updated &quot;Last updated&quot; date.
        </Text>
      </Section>

      <Section>
        <Heading>Contact Us</Heading>
        <Text>
          If you have questions about this Privacy Policy, you can open an issue on our
          GitHub repository:
          <br />
          <ExternalLink
            href="https://github.com/BryantWelch/display-test.app/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/BryantWelch/display-test.app/issues
          </ExternalLink>
        </Text>
      </Section>
    </Container>
  );
};

export default PrivacyPolicy;
