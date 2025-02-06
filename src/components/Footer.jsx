import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const FooterContainer = styled.footer`
  background: linear-gradient(to right, var(--primary-dark), var(--primary));
  color: var(--text-light);
  padding: 3rem 0 2rem;
  margin-top: auto;
  text-align: center;
  position: relative;
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
`;

const ExternalLink = styled.a`
  color: var(--text-light);
  text-decoration: none;
  position: relative;
  transition: color 0.2s;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 1px;
    bottom: -2px;
    left: 0;
    background: linear-gradient(to right, var(--primary), #60a5fa);
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  &:hover {
    color: #60a5fa;
    
    &:after {
      transform: scaleX(1);
      transform-origin: bottom left;
    }
  }
`;

const InternalLink = styled(Link)`
  color: var(--text-light);
  text-decoration: none;
  position: relative;
  transition: color 0.2s;

  &:after {
    content: '';
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 1px;
    bottom: -2px;
    left: 0;
    background: linear-gradient(to right, var(--primary), #60a5fa);
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  &:hover {
    color: #60a5fa;
    
    &:after {
      transform: scaleX(1);
      transform-origin: bottom left;
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
  position: relative;
`;

const KofiButton = styled.div`
  position: absolute;
  bottom: 1rem;
  right: 2rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    position: static;
    margin-top: 2rem;
  }
`;

const KofiLink = styled.a`
  color: var(--text-light);
  text-decoration: none;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  img {
    border: 0;
    height: 36px;
  }
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
              <ExternalLink href="https://github.com/BryantWelch/display-test.app" target="_blank" rel="noopener noreferrer">
                GitHub Repository
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://github.com/BryantWelch/display-test.app/issues" target="_blank" rel="noopener noreferrer">
                Report an Issue
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://github.com/BryantWelch/display-test.app/pulls" target="_blank" rel="noopener noreferrer">
                Contribute
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://github.com/BryantWelch/display-test.app/releases" target="_blank" rel="noopener noreferrer">
                Releases
              </ExternalLink>
            </li>
          </FooterLinks>
        </FooterSection>
        
        <FooterSection>
          <h3>Resources</h3>
          <FooterLinks>
            <li>
              <ExternalLink href="https://www.color.org/" target="_blank" rel="noopener noreferrer">
                ICC Color Standards
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.displayninja.com/knowledge-base/" target="_blank" rel="noopener noreferrer">
                Display Ninja Knowledge Base
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.rtings.com/research" target="_blank" rel="noopener noreferrer">
                Rtings Research
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.testufo.com/" target="_blank" rel="noopener noreferrer">
                UFO Test
              </ExternalLink>
            </li>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Community</h3>
          <FooterLinks>
            <li>
              <ExternalLink href="https://www.reddit.com/r/Monitors/" target="_blank" rel="noopener noreferrer">
                r/Monitors
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://forums.blurbusters.com/" target="_blank" rel="noopener noreferrer">
                Blur Busters Forum
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://www.avsforum.com/forums/display-calibration.139/" target="_blank" rel="noopener noreferrer">
                AVS Forum - Display Calibration
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href="https://hub.displaycal.net/forums/forum/general-discussion/" target="_blank" rel="noopener noreferrer">
                DisplayCal Forum
              </ExternalLink>
            </li>
          </FooterLinks>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        <div>
          &copy; {currentYear} Display Test App. Open source under{' '}
          <ExternalLink 
            href="https://github.com/BryantWelch/display-test.app/blob/main/LICENSE" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            MIT License
          </ExternalLink>
          {' • '}
          <InternalLink to="/privacy">Privacy Policy</InternalLink>
        </div>
      </Copyright>

      <KofiButton>
        <KofiLink href='https://ko-fi.com/V7V01A0SJC' target='_blank' rel="noopener noreferrer">
          <img src='https://storage.ko-fi.com/cdn/kofi5.png?v=6' alt='Buy Me a Coffee at ko-fi.com' />
        </KofiLink>
      </KofiButton>
    </FooterContainer>
  );
};

export default Footer;
