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
  position: relative;
`;

const KofiButton = styled.div`
  position: absolute;
  bottom: 1.5rem;
  right: 2rem;
  transition: transform 0.2s ease;

  &:hover {
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    position: static;
    margin-top: 2rem;
  }

  img {
    height: 36px;
    border: 0;
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
              <a href="https://github.com/BryantWelch/display-test.app" target="_blank" rel="noopener noreferrer">
                GitHub Repo
              </a>
            </li>
            <li>
              <a href="https://github.com/BryantWelch/display-test.app/issues" target="_blank" rel="noopener noreferrer">
                Issues
              </a>
            </li>
            <li>
              <a href="https://github.com/BryantWelch/display-test.app/pulls" target="_blank" rel="noopener noreferrer">
                Pull Requests
              </a>
            </li>
            <li>
              <a href="https://github.com/BryantWelch/display-test.app/releases" target="_blank" rel="noopener noreferrer">
                Releases
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
              <a href="https://www.displayninja.com/knowledge-base/" target="_blank" rel="noopener noreferrer">
                Display Ninja Knowledge Base
              </a>
            </li>
            <li>
              <a href="https://www.rtings.com/research" target="_blank" rel="noopener noreferrer">
                Rtings Research
              </a>
            </li>
            <li>
              <a href="https://www.testufo.com/" target="_blank" rel="noopener noreferrer">
                UFO Test
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
                Blur Busters Forum
              </a>
            </li>
            <li>
              <a href="https://www.avsforum.com/forums/display-calibration.139/" target="_blank" rel="noopener noreferrer">
                AVS Forum - Display Calibration
              </a>
            </li>
            <li>
              <a href="https://hub.displaycal.net/forums/forum/general-discussion/" target="_blank" rel="noopener noreferrer">
                DisplayCal Forum
              </a>
            </li>
          </FooterLinks>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        &copy; {currentYear} Display Test App. All rights reserved.
      </Copyright>

      <KofiButton>
        <a href='https://ko-fi.com/V7V01A0SJC' target='_blank' rel="noopener noreferrer">
          <img src='https://storage.ko-fi.com/cdn/kofi5.png?v=6' alt='Buy Me a Coffee at ko-fi.com' />
        </a>
      </KofiButton>
    </FooterContainer>
  );
};

export default Footer;
