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

const PrivacyPolicy = () => {
  return (
    <Container>
      <Title>Privacy Policy</Title>
      
      <Section>
        <Text>Last updated: February 3, 2025</Text>
        
        <Heading>Overview</Heading>
        <Text>
          Display Test App ("we", "our", or "us") is committed to protecting your privacy. 
          This Privacy Policy explains how we handle information when you use our display testing application.
        </Text>
      </Section>

      <Section>
        <Heading>Information We Don't Collect</Heading>
        <Text>Our application is designed to be privacy-focused. We do not:</Text>
        <List>
          <li>Collect personal information</li>
          <li>Use cookies or tracking technologies</li>
          <li>Store any user data</li>
          <li>Share any information with third parties</li>
        </List>
      </Section>

      <Section>
        <Heading>How Our App Works</Heading>
        <Text>
          Display Test App runs entirely in your browser. All tests and functionalities are performed locally on your device, 
          and no data is sent to our servers or stored anywhere else.
        </Text>
      </Section>

      <Section>
        <Heading>Third-Party Links</Heading>
        <Text>
          Our application may contain links to other websites or applications (such as our Keyboard Test and Controller Test apps). 
          This privacy policy only applies to Display Test App. We encourage you to read the privacy policies of any other sites you visit.
        </Text>
      </Section>

      <Section>
        <Heading>Changes to This Policy</Heading>
        <Text>
          We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page 
          and updating the "Last updated" date.
        </Text>
      </Section>

      <Section>
        <Heading>Contact Us</Heading>
        <Text>
          If you have any questions about this Privacy Policy, you can contact us through our GitHub repository at:
          <br />
          <a href="https://github.com/BryantWelch/display-test.app/issues" target="_blank" rel="noopener noreferrer">
            https://github.com/BryantWelch/display-test.app/issues
          </a>
        </Text>
      </Section>
    </Container>
  );
};

export default PrivacyPolicy;
