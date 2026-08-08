import React, { useState } from 'react';
import styled from 'styled-components';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useAutoFade } from '../hooks/useAutoFade';
import { useExitTest } from '../hooks/useExitTest';

const TestContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #000;
  transition: background-color 0.3s ease;
`;

const ExitButton = styled.button`
  position: fixed;
  top: 1.5rem;
  left: 1.5rem;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem 1.25rem;
  font-size: 1.1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
  z-index: 1000;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  pointer-events: ${(props) => (props.$isVisible ? 'auto' : 'none')};

  &:hover {
    background: rgba(0, 0, 0, 0.9);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    top: 1.25rem;
    left: 1.25rem;
    padding: 0.6rem 1rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    top: 1rem;
    left: 1rem;
    padding: 0.5rem 0.9rem;
    font-size: 0.95rem;
    border-radius: 0.4rem;
  }
`;

const ControlPanel = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 400px;
  padding: ${(props) => (props.$isMinimized ? '1.25rem' : '2rem')};
  color: #333;
  transition: all 0.3s ease;
  transform: translateY(${(props) => (props.$isMinimized ? 'calc(100% - 4rem)' : '0')});
  backdrop-filter: blur(10px);
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  z-index: 1000;
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  pointer-events: ${(props) => (props.$isVisible ? 'auto' : 'none')};
  -webkit-overflow-scrolling: touch;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: rgba(0, 0, 0, 0.3);
  }

  /* Mobile: stay bottom-anchored; nudge up when minimized to clear Android fullscreen toast */
  @media (max-width: 768px) {
    width: min(360px, 90vw);
    right: 1.25rem;
    left: auto;
    bottom: ${(props) => (props.$isMinimized ? '4.5rem' : '1.25rem')};
    max-height: calc(100dvh - 6.5rem);
    padding: ${(props) => (props.$isMinimized ? '1rem' : '1.5rem')};
    transform: translateY(${(props) => (props.$isMinimized ? 'calc(100% - 4rem)' : '0')});
  }

  @media (max-width: 480px) {
    width: 92vw;
    right: 4vw;
    left: 4vw;
    bottom: ${(props) => (props.$isMinimized ? '4.25rem' : '0.75rem')};
    max-height: calc(100dvh - 5.5rem);
    padding: ${(props) => (props.$isMinimized ? '0.9rem' : '1.25rem')};
    border-radius: 0.6rem;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${(props) => (props.$isMinimized ? '0' : '1.5rem')};
  padding-bottom: ${(props) => (props.$isMinimized ? '0' : '1rem')};
  border-bottom: ${(props) => (props.$isMinimized ? 'none' : '1px solid rgba(0, 0, 0, 0.1)')};

  h2 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

const MinimizeButton = styled.button`
  background: #4169e1;
  border: none;
  color: white;
  font-size: 1.75rem;
  cursor: pointer;
  width: 2.5rem;
  height: 2.5rem;
  line-height: 1;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  padding: 0;

  &:hover {
    background: #3658c5;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
  }
`;

export const Description = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    font-size: 0.9rem;
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    font-size: 0.88rem;
    margin-bottom: 1rem;
  }
`;

export const Section = styled.div`
  margin-bottom: 1.5rem;

  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    font-weight: 600;
    color: #333;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  &:last-child {
    margin-bottom: 0;
  }

  @media (max-width: 768px) {
    margin-bottom: 1.25rem;
  }

  @media (max-width: 480px) {
    margin-bottom: 1rem;
  }
`;

export const ResetButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #4169e1;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  font-size: 1.1rem;
  margin-top: 0.25rem;
  transition: all 0.2s ease;

  &:hover {
    background: #3658c5;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 0.9rem;
  }

  @media (max-width: 480px) {
    font-size: 0.98rem;
    padding: 0.85rem;
  }
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-size: 0.95rem;
`;

/**
 * Shared fullscreen test chrome: exit, auto-fading control panel, minimize, reset.
 * Pass test-specific controls via `controls`; canvas/overlays as `children`.
 */
const TestShell = ({
  title,
  description,
  controls,
  children,
  onReset,
  resetLabel = 'Reset settings',
  onBeforeExit,
  style,
  className,
}) => {
  const [isMinimized, setIsMinimized] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  );
  const { isVisible } = useAutoFade(5000, 2000, isMinimized);
  const handleExit = useExitTest(onBeforeExit);

  return (
    <TestContainer style={style} className={className}>
      {children}

      <ExitButton type="button" onClick={handleExit} $isVisible={isVisible}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      <ControlPanel $isMinimized={isMinimized} $isVisible={isVisible}>
        <PanelHeader $isMinimized={isMinimized}>
          <h2>{title}</h2>
          <MinimizeButton
            type="button"
            aria-label={isMinimized ? 'Expand controls' : 'Minimize controls'}
            onClick={() => setIsMinimized((v) => !v)}
          >
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
          </MinimizeButton>
        </PanelHeader>

        {!isMinimized && (
          <>
            {description ? <Description>{description}</Description> : null}
            {controls}
            {onReset ? (
              <Section>
                <ResetButton type="button" onClick={onReset}>
                  {resetLabel}
                </ResetButton>
              </Section>
            ) : null}
          </>
        )}
      </ControlPanel>
    </TestContainer>
  );
};

export default TestShell;
