import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { guides, guidePath, infoPath, tests } from '../registry';
import { AFFILIATE_DISCLOSURE } from './AffiliateProducts';

const Wrap = styled.footer`
  margin-top: 4rem;
  border-top: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-muted);
`;

const Columns = styled.div`
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 3rem 1.5rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 2rem;

  h2 {
    font-size: 0.8rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text);
    margin-bottom: 0.85rem;
  }

  ul {
    list-style: none;
    display: grid;
    gap: 0.45rem;
    font-size: 0.93rem;
  }

  a:hover {
    color: var(--text);
    text-decoration: underline;
  }
`;

const Bottom = styled.div`
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 1.5rem;
  border-top: 1px solid var(--border);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem 2rem;
  align-items: center;
  justify-content: space-between;
  font-size: 0.85rem;

  p {
    max-width: 70ch;
  }

  a:hover {
    color: var(--text);
    text-decoration: underline;
  }

  img {
    height: 36px;
    width: auto;
    display: block;
  }
`;

const Ext = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    {children}
  </a>
);

const Footer = () => {
  const featured = tests.filter((t) => t.badges?.includes('Popular')).slice(0, 8);
  const year = new Date().getFullYear();

  return (
    <Wrap>
      <Columns>
        <div>
          <h2>Popular tests</h2>
          <ul>
            {featured.map((t) => (
              <li key={t.slug}>
                <Link to={infoPath(t)}>{t.shortName || t.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/#tests">All tests →</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Guides</h2>
          <ul>
            <li>
              <Link to="/checkup">New monitor checkup</Link>
            </li>
            {guides.slice(0, 7).map((g) => (
              <li key={g.slug}>
                <Link to={guidePath(g)}>{g.name}</Link>
              </li>
            ))}
            <li>
              <Link to="/guides">All guides →</Link>
            </li>
          </ul>
        </div>
        <div>
          <h2>Project</h2>
          <ul>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/gear">Calibration gear</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy</Link>
            </li>
            <li>
              <Ext href="https://github.com/BryantWelch/display-test.app">GitHub</Ext>
            </li>
            <li>
              <Ext href="https://github.com/BryantWelch/display-test.app/issues">Report an issue</Ext>
            </li>
            <li>
              <Ext href="https://keyboard-test.app">Keyboard Test</Ext>
            </li>
            <li>
              <Ext href="https://controller-test.app">Controller Test</Ext>
            </li>
          </ul>
        </div>
        <div>
          <h2>Community & research</h2>
          <ul>
            <li>
              <Ext href="https://www.reddit.com/r/Monitors/">r/Monitors</Ext>
            </li>
            <li>
              <Ext href="https://forums.blurbusters.com/">Blur Busters Forum</Ext>
            </li>
            <li>
              <Ext href="https://www.avsforum.com/forums/display-calibration.139/">AVS Forum calibration</Ext>
            </li>
            <li>
              <Ext href="https://www.rtings.com/monitor/learn">RTINGS monitor research</Ext>
            </li>
            <li>
              <Ext href="https://www.testufo.com/">TestUFO</Ext>
            </li>
            <li>
              <Ext href="http://www.lagom.nl/lcd-test/">Lagom LCD test</Ext>
            </li>
          </ul>
        </div>
      </Columns>
      <Bottom>
        <div>
          <p>
            © {year} Display Test · Open source under the{' '}
            <Ext href="https://github.com/BryantWelch/display-test.app/blob/main/LICENSE">MIT License</Ext>.
          </p>
          <p style={{ marginTop: '0.4rem', color: 'var(--text-subtle)' }}>{AFFILIATE_DISCLOSURE}</p>
        </div>
        <Ext href="https://ko-fi.com/V7V01A0SJC">
          <img src="https://storage.ko-fi.com/cdn/kofi5.png?v=6" alt="Support Display Test on Ko-fi" width="143" height="36" />
        </Ext>
      </Bottom>
    </Wrap>
  );
};

export default Footer;
