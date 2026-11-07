import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Navbar from './Navbar';
import Footer from './Footer';

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  flex: 1;
  padding-top: var(--nav-height);

  &:focus {
    outline: none;
  }
`;

const SkipLink = styled.a`
  position: absolute;
  left: 1rem;
  top: -100px;
  z-index: 200;
  padding: 0.6rem 1rem;
  border-radius: var(--radius-sm);
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 600;

  &:focus {
    top: 0.75rem;
  }
`;

const Layout = ({ children }) => {
  const { pathname, hash } = useLocation();
  const isTestPage = pathname.startsWith('/test/');

  useEffect(() => {
    if (isTestPage) return;
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash, isTestPage]);

  if (isTestPage) return children;

  return (
    <Shell>
      <SkipLink href="#main">Skip to content</SkipLink>
      <Navbar />
      <Main id="main" tabIndex={-1}>
        {children}
      </Main>
      <Footer />
    </Shell>
  );
};

export default Layout;
