import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { testsByCategory, infoPath } from '../registry';
import tvLogo from '../assets/tv.svg';

const Bar = styled.header`
  position: fixed;
  inset: 0 0 auto 0;
  height: var(--nav-height);
  z-index: 100;
  background: rgba(11, 17, 32, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
`;

const Inner = styled.nav`
  max-width: var(--content-width);
  height: 100%;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;

  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const Logo = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  font-weight: 750;
  font-size: 1.15rem;
  letter-spacing: -0.01em;
  margin-right: auto;

  img {
    width: 30px;
    height: 30px;
  }
`;

const Links = styled.ul`
  list-style: none;
  display: flex;
  align-items: center;
  gap: 0.25rem;

  @media (max-width: 900px) {
    display: none;
  }
`;

const navItem = `
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  min-height: 40px;
  padding: 0.45rem 0.8rem;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  font-weight: 550;
  font-size: 0.97rem;

  &:hover,
  &[aria-expanded='true'],
  &.active {
    color: var(--text);
    background: var(--surface-2);
  }
`;

const Item = styled(NavLink)`
  ${navItem}
`;

const MenuToggle = styled.button`
  ${navItem}

  svg {
    transition: transform 0.15s ease;
  }

  &[aria-expanded='true'] svg {
    transform: rotate(180deg);
  }
`;

const Cta = styled(Link)`
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding: 0.45rem 1rem;
  border-radius: 999px;
  background: var(--accent);
  color: var(--accent-contrast);
  font-weight: 650;
  font-size: 0.95rem;
  margin-left: 0.5rem;

  &:hover {
    background: #7dd3fc;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

const Mega = styled.div`
  position: absolute;
  top: calc(var(--nav-height) - 0.25rem);
  left: 50%;
  transform: translateX(-50%);
  width: min(1100px, calc(100vw - 2rem));
  background: var(--surface);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow);
  padding: 1.5rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem 1.5rem;

  h3 {
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-subtle);
    margin-bottom: 0.4rem;
  }

  ul {
    list-style: none;
  }

  a {
    display: block;
    padding: 0.3rem 0.4rem;
    margin-left: -0.4rem;
    border-radius: 6px;
    color: var(--text-muted);
    font-size: 0.95rem;
  }

  a:hover,
  a.active {
    color: var(--text);
    background: var(--surface-2);
  }
`;

const Burger = styled.button`
  display: none;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-sm);
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    display: inline-flex;
  }

  &:hover {
    background: var(--surface-2);
  }
`;

const Drawer = styled.div`
  position: fixed;
  top: var(--nav-height);
  inset-inline: 0;
  bottom: 0;
  background: var(--bg);
  overflow-y: auto;
  padding: 1rem 1rem 3rem;
  z-index: 99;

  > a,
  details > summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 48px;
    padding: 0.6rem 0.75rem;
    border-radius: var(--radius-sm);
    font-weight: 600;
    font-size: 1.05rem;
    cursor: pointer;
    list-style: none;
  }

  details > summary::-webkit-details-marker {
    display: none;
  }

  details > summary::after {
    content: '+';
    color: var(--accent);
    font-size: 1.3rem;
  }

  details[open] > summary::after {
    content: '−';
  }

  h3 {
    font-size: 0.75rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--text-subtle);
    margin: 1rem 0.75rem 0.25rem;
  }

  ul {
    list-style: none;
  }

  li a {
    display: block;
    min-height: 44px;
    padding: 0.65rem 0.75rem;
    color: var(--text-muted);
    border-radius: var(--radius-sm);
  }

  a:hover,
  summary:hover {
    background: var(--surface-2);
  }

  .cta {
    margin-top: 1rem;
    justify-content: center;
    background: var(--accent);
    color: var(--accent-contrast);
    border-radius: 999px;
  }
`;

const Chevron = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
    <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const TestColumns = ({ onNavigate }) =>
  testsByCategory.map((category) => (
    <div key={category.id}>
      <h3>{category.label}</h3>
      <ul>
        {category.tests.map((t) => (
          <li key={t.slug}>
            <NavLink to={infoPath(t)} onClick={onNavigate}>
              {t.shortName || t.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  ));

const Navbar = () => {
  const [megaOpen, setMegaOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { pathname } = useLocation();
  const toggleRef = useRef(null);
  const burgerRef = useRef(null);
  const wrapRef = useRef(null);
  const megaId = useId();
  const drawerId = useId();

  useEffect(() => {
    setMegaOpen(false);
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!megaOpen && !drawerOpen) return undefined;
    const onKey = (e) => {
      if (e.key !== 'Escape') return;
      if (megaOpen) {
        setMegaOpen(false);
        toggleRef.current?.focus();
      }
      if (drawerOpen) {
        setDrawerOpen(false);
        burgerRef.current?.focus();
      }
    };
    const onPointer = (e) => {
      if (megaOpen && wrapRef.current && !wrapRef.current.contains(e.target)) setMegaOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [megaOpen, drawerOpen]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  const close = () => {
    setMegaOpen(false);
    setDrawerOpen(false);
  };

  return (
    <Bar>
      <Inner aria-label="Main">
        <Logo to="/" aria-label="Display Test home">
          <img src={tvLogo} alt="" width="30" height="30" />
          Display Test
        </Logo>

        <Links ref={wrapRef}>
          <li>
            <MenuToggle
              ref={toggleRef}
              type="button"
              aria-expanded={megaOpen}
              aria-controls={megaId}
              onClick={() => setMegaOpen((v) => !v)}
            >
              Tests <Chevron />
            </MenuToggle>
            {megaOpen ? (
              <Mega id={megaId}>
                <TestColumns onNavigate={close} />
              </Mega>
            ) : null}
          </li>
          <li>
            <Item to="/guides">Guides</Item>
          </li>
          <li>
            <Item to="/gear">Gear</Item>
          </li>
          <li>
            <Item to="/about">About</Item>
          </li>
        </Links>
        <Cta to="/checkup">New monitor checkup</Cta>

        <Burger
          ref={burgerRef}
          type="button"
          aria-label={drawerOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={drawerOpen}
          aria-controls={drawerId}
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            {drawerOpen ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </Burger>
      </Inner>

      {drawerOpen ? (
        <Drawer id={drawerId}>
          <details>
            <summary>Tests</summary>
            <TestColumns onNavigate={close} />
          </details>
          <Link to="/guides" onClick={close}>
            Guides
          </Link>
          <Link to="/gear" onClick={close}>
            Gear
          </Link>
          <Link to="/about" onClick={close}>
            About
          </Link>
          <Link to="/checkup" className="cta" onClick={close}>
            New monitor checkup
          </Link>
        </Drawer>
      ) : null}
    </Bar>
  );
};

export default Navbar;
