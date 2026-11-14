import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useAutoFade } from '../hooks/useAutoFade';
import { useExitTest } from '../hooks/useExitTest';
import { getTestFromPath } from '../registry';
import { recordResult, RESULT_LABELS } from '../utils/checkupStore';
import { Inline } from '../lib/markup';
import { Section, Description, ResetButton, Button, ButtonRow } from './testControls';

export * from './testControls';

const Container = styled.div`
  position: fixed;
  inset: 0;
  background: #000;
  overflow: hidden;
  cursor: ${({ $hideCursor }) => ($hideCursor ? 'none' : 'auto')};

  @media (max-width: 768px) {
    bottom: auto;
    height: 100dvh;
  }
`;

const chrome = `
  transition: opacity 0.25s ease, transform 0.25s ease;
  z-index: 1000;
  color: var(--text);
  font-family: var(--font-sans);
`;

const ExitButton = styled.button`
  ${chrome}
  position: fixed;
  top: 1rem;
  left: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  min-height: 44px;
  padding: 0.55rem 1rem;
  border-radius: var(--radius-sm);
  background: rgba(11, 17, 32, 0.88);
  border: 1px solid var(--border-strong);
  font-weight: 600;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};

  &:hover {
    background: rgba(30, 43, 72, 0.95);
  }

  svg {
    width: 18px;
    height: 18px;
  }

  @media (max-width: 768px) {
    top: max(0.75rem, env(safe-area-inset-top, 0px));
    left: max(0.75rem, env(safe-area-inset-left, 0px));
  }
`;

const Panel = styled.aside`
  ${chrome}
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  width: 380px;
  max-height: calc(100dvh - 2rem);
  display: flex;
  flex-direction: column;
  background: rgba(11, 17, 32, 0.92);
  backdrop-filter: blur(14px);
  border: 1px solid var(--border-strong);
  border-radius: var(--radius);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.5);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: translateY(${({ $visible }) => ($visible ? '0' : '8px')});
  pointer-events: ${({ $visible }) => ($visible ? 'auto' : 'none')};

  @media (max-width: 768px) {
    width: min(380px, calc(100vw - 1.5rem));
    right: max(0.75rem, env(safe-area-inset-right, 0px));
    bottom: max(0.75rem, env(safe-area-inset-bottom, 0px));
    max-height: calc(100dvh - 5rem - env(safe-area-inset-top, 0px) - env(safe-area-inset-bottom, 0px));
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.75rem 0.75rem 0.75rem 1.1rem;
  border-bottom: ${({ $minimized }) => ($minimized ? 'none' : '1px solid var(--border)')};

  h2 {
    font-size: 0.95rem;
    font-weight: 650;
    letter-spacing: 0.01em;
  }
`;

const IconButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: var(--radius-sm);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  font-weight: 700;

  &:hover {
    background: var(--surface-3);
    color: var(--text);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
  }
`;

const PanelBody = styled.div`
  overflow-y: auto;
  padding: 1rem 1.1rem 1.1rem;
  overscroll-behavior: contain;
`;

const Guide = styled.details`
  margin-bottom: 1.1rem;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  background: rgba(30, 43, 72, 0.5);

  summary {
    cursor: pointer;
    padding: 0.6rem 0.8rem;
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--accent);
  }

  div {
    padding: 0 0.8rem 0.75rem;
    font-size: 0.85rem;
    color: var(--text-muted);
    line-height: 1.55;
  }

  h4 {
    font-size: 0.78rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin: 0.5rem 0 0.25rem;
  }

  ul {
    padding-left: 1.05rem;
  }

  a {
    color: var(--accent);
  }
`;

const Shortcuts = styled.dl`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.35rem 0.85rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 1rem;

  dt kbd {
    display: inline-block;
    min-width: 1.6rem;
    text-align: center;
    padding: 0.1rem 0.4rem;
    border-radius: 5px;
    border: 1px solid var(--border-strong);
    background: var(--surface-2);
    color: var(--text);
    font-family: var(--font-mono);
    font-size: 0.78rem;
  }
`;

const ShortcutsButton = styled(IconButton)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const Note = styled.p`
  margin-top: 0.75rem;
  font-size: 0.78rem;
  color: var(--text-subtle);
`;

const DesktopNote = styled(Note)`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNote = styled(Note)`
  display: none;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Toast = styled.div`
  ${chrome}
  position: fixed;
  left: 50%;
  bottom: 1.25rem;
  transform: translateX(-50%);
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  background: rgba(11, 17, 32, 0.85);
  border: 1px solid var(--border);
  font-size: 0.85rem;
  color: var(--text-muted);
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  pointer-events: none;
`;

const Gate = styled.div`
  position: fixed;
  inset: 0;
  z-index: 1100;
  display: grid;
  place-items: center;
  background: #0b1120;
  padding: 1.5rem;
  font-family: var(--font-sans);

  > div {
    max-width: 480px;
    text-align: center;
  }

  h2 {
    margin-bottom: 0.75rem;
  }

  p {
    color: var(--text-muted);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  div div {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
  }
`;

const CheckupBox = styled.div`
  margin-bottom: 1.1rem;
  padding: 0.8rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--accent);
  background: var(--accent-soft);

  p {
    font-size: 0.88rem;
    margin-bottom: 0.6rem;
    color: var(--text);
  }
`;

const keyLabel = (k) =>
  ({ ArrowLeft: '←', ArrowRight: '→', ArrowUp: '↑', ArrowDown: '↓', ' ': 'Space', Escape: 'Esc' })[k] ||
  (k.length === 1 ? k.toUpperCase() : k);

const NON_TEXT_INPUTS = ['checkbox', 'radio', 'button', 'submit', 'reset'];

const isTyping = (el) =>
  el &&
  ((el.tagName === 'INPUT' && !NON_TEXT_INPUTS.includes(el.type)) ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' ||
    el.isContentEditable);

const isActivatable = (el) =>
  el instanceof Element && !!el.closest('button, a, summary, input[type="checkbox"], input[type="radio"]');

/**
 * Shared fullscreen test chrome: exit, auto-fading control panel, keyboard shortcuts,
 * in-test "what you should see" guidance from the registry, photosensitivity gate,
 * and checkup result recording.
 *
 * Props:
 *   title, description, controls, children, onReset, resetLabel, onBeforeExit, style
 *   shortcuts: [{ key: 'ArrowRight' | ['ArrowRight','d'], label: 'Next color', action: () => {} }]
 *   photosensitive: show a consent screen before rendering children (also read from registry)
 *   hideCursor: hide the mouse cursor while chrome is faded (default true)
 *   revealOnMove: show faded chrome on plain mouse movement (default true); clicks, taps and keys always do
 *   guide: override registry guidance { good: [], bad: [] }
 */
const TestShell = ({
  title,
  description,
  controls,
  children,
  onReset,
  resetLabel = 'Reset settings',
  onBeforeExit,
  shortcuts = [],
  photosensitive,
  hideCursor = true,
  revealOnMove = true,
  guide,
  style,
  className,
}) => {
  const { pathname, search } = useLocation();
  const test = getTestFromPath(pathname);
  const lookFor = guide || test?.page?.lookFor;
  const checkupMode = new URLSearchParams(search).has('checkup');
  const needsConsent = photosensitive ?? test?.photosensitive ?? false;

  const [consented, setConsented] = useState(!needsConsent);
  const [minimized, setMinimized] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );
  const [hiddenByUser, setHiddenByUser] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [panelActive, setPanelActive] = useState(false);
  const [panelEngaged, setPanelEngaged] = useState(false);
  const [toast, setToast] = useState(null);
  const [isMobile, setIsMobile] = useState(false);
  const panelRef = useRef(null);
  const toastTimer = useRef(null);
  const visibleRef = useRef(false);
  const revealRef = useRef(() => {});
  const blockClickRef = useRef(null);

  // A phone tap leaves the button focused and the pointer "inside" the panel, which would
  // pause the fade forever. Only hold it open while a finger is down or a field is being edited.
  const pauseFade = (isMobile ? panelEngaged : panelActive) || showHelp;
  const { isVisible: activityVisible, show: revealChrome } = useAutoFade(4000, pauseFade, revealOnMove);
  const visible = consented && !hiddenByUser && activityVisible;
  visibleRef.current = visible;
  revealRef.current = revealChrome;
  const handleExit = useExitTest(onBeforeExit);

  useEffect(() => {
    const query = window.matchMedia('(max-width: 768px)');
    const onChange = () => setIsMobile(query.matches);
    onChange();
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  // On a phone the panel fades, and the same tap would also advance tests that listen for a click.
  // The first tap only brings the controls back. A cleaning-lock hold still lands.
  // The phone's click arrives after this reveal re-renders, so the click guard has to outlive that render.
  useEffect(() => {
    if (!isMobile || !consented) return undefined;
    const onPointerDown = (event) => {
      if (visibleRef.current) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('button, a, input, select, textarea, label, summary, [data-touch-lock]')
      ) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      setHiddenByUser(false);
      revealRef.current();
      const blockClick = (clickEvent) => {
        clickEvent.preventDefault();
        clickEvent.stopPropagation();
        document.removeEventListener('click', blockClick, true);
        if (blockClickRef.current === blockClick) blockClickRef.current = null;
      };
      if (blockClickRef.current) document.removeEventListener('click', blockClickRef.current, true);
      blockClickRef.current = blockClick;
      document.addEventListener('click', blockClick, true);
      window.setTimeout(() => {
        if (blockClickRef.current !== blockClick) return;
        document.removeEventListener('click', blockClick, true);
        blockClickRef.current = null;
      }, 700);
    };
    document.addEventListener('pointerdown', onPointerDown, true);
    return () => document.removeEventListener('pointerdown', onPointerDown, true);
  }, [isMobile, consented]);

  useEffect(
    () => () => {
      if (!blockClickRef.current) return;
      document.removeEventListener('click', blockClickRef.current, true);
      blockClickRef.current = null;
    },
    []
  );

  const flash = useCallback((message) => {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  useEffect(() => {
    document.body.classList.add('in-test');
    return () => {
      document.body.classList.remove('in-test');
      clearTimeout(toastTimer.current);
    };
  }, []);

  const shortcutsRef = useRef(shortcuts);
  shortcutsRef.current = shortcuts;
  const onResetRef = useRef(onReset);
  onResetRef.current = onReset;

  useEffect(() => {
    if (!consented) return undefined;
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (isTyping(e.target) && e.key !== 'Escape') return;
      if ((e.key === ' ' || e.key === 'Enter') && isActivatable(e.target)) return;
      const custom = shortcutsRef.current.find((s) =>
        (Array.isArray(s.key) ? s.key : [s.key]).some((k) => k.toLowerCase() === e.key.toLowerCase())
      );
      if (custom) {
        e.preventDefault();
        custom.action(e);
        return;
      }
      switch (e.key.toLowerCase()) {
        case 'h':
          setHiddenByUser((v) => {
            if (!v) flash('Controls hidden — press H to show');
            return !v;
          });
          break;
        case 'r':
          if (onResetRef.current) {
            onResetRef.current();
            flash('Settings reset');
          }
          break;
        case '?':
        case '/':
          setShowHelp((v) => !v);
          setHiddenByUser(false);
          setMinimized(false);
          break;
        case 'escape':
          if (!document.fullscreenElement) handleExit();
          break;
        default:
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [consented, flash, handleExit]);

  const allShortcuts = [
    ...shortcuts.map((s) => ({ keys: Array.isArray(s.key) ? s.key : [s.key], label: s.label })),
    { keys: ['h'], label: 'Hide / show controls' },
    ...(onReset ? [{ keys: ['r'], label: 'Reset settings' }] : []),
    { keys: ['?'], label: 'Show shortcuts' },
    { keys: ['Escape'], label: 'Exit test' },
  ];

  const record = (result) => {
    if (!test) return;
    recordResult(test.slug, result);
    handleExit('/checkup');
  };

  if (!consented) {
    return (
      <Container style={{ background: '#0b1120' }}>
        <Gate role="dialog" aria-modal="true" aria-labelledby="ps-title">
          <div>
            <h2 id="ps-title">Photosensitivity warning</h2>
            <p>
              This test shows rapidly flashing or flickering colors. If you or anyone watching has
              photosensitive epilepsy or is sensitive to flashing light, do not continue.
            </p>
            <div>
              <Button type="button" onClick={() => handleExit()}>
                Go back
              </Button>
              <Button type="button" $variant="primary" onClick={() => setConsented(true)} autoFocus>
                I understand, continue
              </Button>
            </div>
          </div>
        </Gate>
      </Container>
    );
  }

  return (
    <Container style={style} className={className} $hideCursor={hideCursor && !visible} data-test-surface>
      {children}

      <ExitButton type="button" onClick={() => handleExit()} $visible={visible} tabIndex={visible ? 0 : -1}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        {checkupMode ? 'Back to checkup' : 'Exit test'}
      </ExitButton>

      <Panel
        ref={panelRef}
        aria-label={`${title} controls`}
        $visible={visible}
        $minimized={minimized}
        onPointerEnter={() => setPanelActive(true)}
        onPointerLeave={() => setPanelActive(false)}
        onPointerDown={() => {
          if (!isMobile) return;
          setPanelEngaged(true);
          const end = () => {
            window.removeEventListener('pointerup', end);
            window.removeEventListener('pointercancel', end);
            const el = document.activeElement;
            const editing =
              el instanceof Element &&
              panelRef.current?.contains(el) &&
              el.matches('input, select, textarea');
            if (!editing) setPanelEngaged(false);
          };
          window.addEventListener('pointerup', end);
          window.addEventListener('pointercancel', end);
        }}
        onFocus={(e) => {
          setPanelActive(true);
          if (
            isMobile &&
            e.target instanceof Element &&
            e.target.closest('input, select, textarea')
          ) {
            setPanelEngaged(true);
          }
        }}
        onBlur={(e) => {
          if (!panelRef.current?.contains(e.relatedTarget)) setPanelActive(false);
          if (!isMobile) return;
          const next = e.relatedTarget;
          const stillEditing =
            next instanceof Element &&
            panelRef.current?.contains(next) &&
            next.matches('input, select, textarea');
          if (!stillEditing) setPanelEngaged(false);
        }}
      >
        <PanelHeader $minimized={minimized}>
          <h2>{title}</h2>
          <div>
            <ShortcutsButton
              type="button"
              aria-label="Keyboard shortcuts"
              aria-pressed={showHelp}
              onClick={() => {
                setShowHelp((v) => !v);
                setMinimized(false);
              }}
            >
              ?
            </ShortcutsButton>
            <IconButton
              type="button"
              aria-label={minimized ? 'Expand controls' : 'Minimize controls'}
              aria-expanded={!minimized}
              onClick={() => setMinimized((v) => !v)}
            >
              {minimized ? <IoChevronUp /> : <IoChevronDown />}
            </IconButton>
          </div>
        </PanelHeader>

        {!minimized ? (
          <PanelBody>
            {showHelp ? (
              <Shortcuts aria-label="Keyboard shortcuts">
                {allShortcuts.map((s) => (
                  <div key={s.label} style={{ display: 'contents' }}>
                    <dt>
                      {s.keys.map((k) => (
                        <kbd key={k}>{keyLabel(k)}</kbd>
                      ))}
                    </dt>
                    <dd>{s.label}</dd>
                  </div>
                ))}
              </Shortcuts>
            ) : null}

            {checkupMode && test ? (
              <CheckupBox>
                <p>
                  <strong>Checkup:</strong> {test.checkup?.question || 'How did this display do?'}
                </p>
                <ButtonRow>
                  {['pass', 'minor', 'fail'].map((r) => (
                    <Button key={r} type="button" onClick={() => record(r)}>
                      {RESULT_LABELS[r]}
                    </Button>
                  ))}
                </ButtonRow>
              </CheckupBox>
            ) : null}

            {description ? <Description>{description}</Description> : null}

            {lookFor ? (
              <Guide>
                <summary>What you should see</summary>
                <div>
                  <h4>Normal</h4>
                  <ul>
                    {lookFor.good.map((g) => (
                      <li key={g}>
                        <Inline text={g} />
                      </li>
                    ))}
                  </ul>
                  <h4>Worth a closer look</h4>
                  <ul>
                    {lookFor.bad.map((b) => (
                      <li key={b}>
                        <Inline text={b} />
                      </li>
                    ))}
                  </ul>
                </div>
              </Guide>
            ) : null}

            {controls}

            {onReset ? (
              <Section style={{ marginTop: '1rem' }}>
                <ResetButton type="button" onClick={onReset}>
                  {resetLabel}
                </ResetButton>
              </Section>
            ) : null}
            <DesktopNote>Press H to hide controls, ? for shortcuts.</DesktopNote>
            <MobileNote>Tap the screen to show the controls again.</MobileNote>
          </PanelBody>
        ) : null}
      </Panel>

      <Toast $visible={!!toast} role="status" aria-live="polite">
        {toast}
      </Toast>
    </Container>
  );
};

export default TestShell;
