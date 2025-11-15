import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const PageContainer = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 2rem 1.5rem 4rem;
  color: var(--text-light);

  @media (max-width: 768px) {
    padding: 1.5rem 1rem 3rem;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  margin-bottom: 1rem;
  color: var(--primary);
`;

const Subtitle = styled.p`
  font-size: 1.05rem;
  color: var(--secondary);
  line-height: 1.7;
  margin-bottom: 2rem;
`;

const Section = styled.section`
  margin-bottom: 1.75rem;

  h2 {
    font-size: 1.4rem;
    margin-bottom: 0.75rem;
    color: var(--text-light);
  }

  p {
    color: var(--secondary);
    line-height: 1.7;
    margin-bottom: 0.75rem;
  }

  ul {
    margin: 0.25rem 0 0.75rem;
    padding-left: 1.25rem;
    color: var(--secondary);
  }

  li {
    margin-bottom: 0.35rem;
    line-height: 1.6;
  }
`;

const InlineLink = styled(Link)`
  color: var(--primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const ExternalLink = styled.a`
  color: var(--primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const About = () => {
  return (
    <PageContainer>
      <Title>About Display Test App</Title>
      <Subtitle>
        Display Test App is a collection of focused, browser-based tools for checking and tuning monitor
        behavior—designed to be fast to load, easy to use, and free to access.
      </Subtitle>

      <Section>
        <h2>What this site is</h2>
        <p>
          The goal of this project is to provide a practical set of tests you can run directly in your
          browser to evaluate a new display, compare multiple monitors, or periodically check that your
          setup still looks the way it should.
        </p>
        <p>
          The tools focus on common real-world checks: dead pixels, uniformity issues, text clarity,
          gradients and banding, response time behavior, viewing angles, brightness, and contrast. Each
          test now has its own guide page explaining how to run it and how to interpret what you see.
        </p>
      </Section>

      <Section>
        <h2>Who it is for</h2>
        <p>
          Display Test App is aimed at anyone who cares about how their screen looks:
        </p>
        <ul>
          <li>PC gamers dialing in settings for competitive play or cinematic titles.</li>
          <li>Developers, designers, and content creators who want to sanity-check their panels.</li>
          <li>Enthusiasts comparing new monitors, TVs, or laptops during a return window.</li>
          <li>Anyone curious about what their current display is really capable of.</li>
        </ul>
      </Section>

      <Section>
        <h2>Open source project</h2>
        <p>
          This site is an open source project hosted on GitHub. If you&apos;d like to see how it works under
          the hood, suggest improvements, or contribute code or documentation, you can do so via the
          repository and issue tracker.
        </p>
        <p>
          You can find the code here:
        </p>
        <ul>
          <li>
            <ExternalLink
              href="https://github.com/BryantWelch/display-test.app"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub Repository
            </ExternalLink>
          </li>
          <li>
            <ExternalLink
              href="https://github.com/BryantWelch/display-test.app/issues"
              target="_blank"
              rel="noopener noreferrer"
            >
              Report an Issue or Suggestion
            </ExternalLink>
          </li>
        </ul>
      </Section>

      <Section>
        <h2>Feedback and support</h2>
        <p>
          There is no dedicated support email or ticket system. If you run into a bug, have an idea for a
          new pattern, or spot something that could be clearer, the best way to reach the maintainer is
          through GitHub Issues.
        </p>
        <p>
          You can also reach the homepage at any time via the navigation bar or by visiting{' '}
          <InlineLink to="/">Display Test</InlineLink> directly.
        </p>
        <p>
          If this app saves you time or helps you tune a new monitor, there is a small donation button in
          the footer that goes to Ko-fi. Contributions are optional but appreciated and go toward hosting
          costs and ongoing improvements.
        </p>
      </Section>
    </PageContainer>
  );
};

export default About;
