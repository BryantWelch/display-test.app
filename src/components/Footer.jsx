import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: linear-gradient(to right, var(--primary-dark), var(--primary));
  color: var(--text-light);
  padding: 3rem 0 2rem;
  margin-top: auto;
  text-align: center;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 4rem;
  padding: 0 2rem;
  justify-content: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const FooterSection = styled.div`
  text-align: center;
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: 1.2rem;
    background: linear-gradient(to right, #fff, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const FooterLinks = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  text-align: center;

  li {
    margin-bottom: 0.75rem;
  }

  a {
    color: var(--text-light);
    text-decoration: none;
    opacity: 0.8;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
    }
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 3rem;
  padding: 2rem 2rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-light);
  opacity: 0.6;
  font-size: 0.9rem;
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>About</h3>
          <FooterLinks>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <a href="https://www.displayninja.com/monitor-basics/" target="_blank" rel="noopener noreferrer">
                Display Technology Guide
              </a>
            </li>
            <li>
              <a href="https://www.rtings.com/monitor/tests" target="_blank" rel="noopener noreferrer">
                Monitor Testing Methods
              </a>
            </li>
            <li>
              <a href="https://www.tftcentral.co.uk/articles.htm" target="_blank" rel="noopener noreferrer">
                Display Articles
              </a>
            </li>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Resources</h3>
          <FooterLinks>
            <li>
              <a href="https://www.color.org/" target="_blank" rel="noopener noreferrer">
                ICC Color Standards
              </a>
            </li>
            <li>
              <a href="https://www.eizo.com/library/" target="_blank" rel="noopener noreferrer">
                Display Knowledge Base
              </a>
            </li>
            <li>
              <a href="https://www.lagom.nl/lcd-test/" target="_blank" rel="noopener noreferrer">
                Lagom LCD Tests
              </a>
            </li>
            <li>
              <a href="https://www.blur-busters.com/" target="_blank" rel="noopener noreferrer">
                Motion Blur Research
              </a>
            </li>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Community</h3>
          <FooterLinks>
            <li>
              <a href="https://www.reddit.com/r/Monitors/" target="_blank" rel="noopener noreferrer">
                r/Monitors
              </a>
            </li>
            <li>
              <a href="https://forums.blurbusters.com/" target="_blank" rel="noopener noreferrer">
                Display Enthusiasts Forum
              </a>
            </li>
            <li>
              <a href="https://discord.gg/monitors" target="_blank" rel="noopener noreferrer">
                Monitor Discord
              </a>
            </li>
            <li>
              <a href="https://github.com/topics/display-testing" target="_blank" rel="noopener noreferrer">
                Open Source Tools
              </a>
            </li>
          </FooterLinks>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        &copy; {currentYear} Display Test App. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
};

export default Footer;
