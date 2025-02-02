import styled from 'styled-components';

export const ControlPanel = styled.div`
  position: fixed;
  top: ${props => props.isMinimized ? 'calc(100% - 40px)' : '20px'};
  right: 20px;
  width: 300px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: top 0.3s ease;
  z-index: 1000;
`;

export const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 15px;
  border-bottom: 1px solid #eee;
  cursor: pointer;

  h2 {
    margin: 0;
    font-size: 1.1rem;
    color: #333;
  }
`;

export const MinimizeButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  color: #666;

  &:hover {
    color: #333;
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;

export const PanelContent = styled.div`
  max-height: ${props => props.isMinimized ? '0' : 'calc(100vh - 140px)'};
  overflow-y: auto;
  transition: max-height 0.3s ease;
`;

export const Section = styled.div`
  padding: 15px;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  h3 {
    margin: 0 0 10px 0;
    font-size: 1rem;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 0.9rem;
    color: #666;
    line-height: 1.4;
  }
`;

export const RangeControl = styled.div`
  label {
    display: block;
    margin-bottom: 8px;
    font-size: 0.9rem;
    color: #666;
  }

  input[type="range"] {
    width: 100%;
    margin: 8px 0;
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
  transition: all 0.2s ease;

  &:hover {
    background: #3658c5;
  }
`;

// Wrap the ControlPanel to handle the header and minimize functionality
export const ControlPanelWrapper = ({ title, isMinimized, onMinimize, onReset, children }) => {
  return (
    <ControlPanel isMinimized={isMinimized}>
      <PanelHeader onClick={onMinimize}>
        <h2>{title}</h2>
        <MinimizeButton>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d={isMinimized ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"} />
          </svg>
        </MinimizeButton>
      </PanelHeader>
      <PanelContent isMinimized={isMinimized}>
        {children}
        {onReset && (
          <Section>
            <ResetButton onClick={onReset}>Reset Settings</ResetButton>
          </Section>
        )}
      </PanelContent>
    </ControlPanel>
  );
};
