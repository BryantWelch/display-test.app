import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';

const TestContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  overflow: hidden;
`;

const PatternImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: opacity 0.3s ease;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  font-size: 1.2rem;
`;

const ControlPanel = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 5px 30px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
  width: 400px;
  padding: ${props => props.$isMinimized ? '1.25rem' : '2rem'};
  color: #333;
  transition: all 0.3s ease;
  transform: translateY(${props => props.$isMinimized ? 'calc(100% - 4rem)' : '0'});
  backdrop-filter: blur(10px);
  max-height: calc(100vh - 4rem);
  overflow-y: auto;
  z-index: 1000;

  /* Custom scrollbar */
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
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${props => props.$isMinimized ? '0' : '1.5rem'};
  padding-bottom: ${props => props.$isMinimized ? '0' : '1rem'};
  border-bottom: ${props => props.$isMinimized ? 'none' : '1px solid rgba(0, 0, 0, 0.1)'};

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

const Description = styled.p`
  color: #666;
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0 0 1.5rem 0;
`;

const Section = styled.div`
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
`;

const ResetButton = styled.button`
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
`;

const PatternSelect = styled.select`
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 0.5rem;
  font-size: 1rem;
  color: #333;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #4169e1;
  }
`;

const CategorySelect = styled(PatternSelect)`
  margin-bottom: 0.5rem;
  font-weight: 600;
`;

const TestPatternsTest = () => {
  const navigate = useNavigate();
  const [isMinimized, setIsMinimized] = useState(false);
  const [selectedPattern, setSelectedPattern] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [resolution, setResolution] = useState('');
  const [patterns, setPatterns] = useState({ categories: {}, patternMap: {} });

  const initializeTest = useCallback(() => {
    const width = window.screen.width;
    const height = window.screen.height;
    
    const resolutionFolders = {
      '1280x720': 'HD-1280x720',
      '1280x800': 'WXGA-1280x800',
      '1920x1080': 'FHD-1920x1080',
      '2560x1440': 'QHD-2560x1440',
      '2560x1600': 'WQXGA-2560x1600',
      '3840x2160': 'UHD-3840x2160'
    };

    const currentResolution = `${width}x${height}`;
    
    const availableResolutions = Object.keys(resolutionFolders)
      .map(res => {
        const [w, h] = res.split('x').map(Number);
        return { resolution: res, pixels: w * h };
      })
      .sort((a, b) => a.pixels - b.pixels);

    const [currentWidth, currentHeight] = currentResolution.split('x').map(Number);
    const currentPixels = currentWidth * currentHeight;
    
    let matchingResolution = availableResolutions.find(r => r.pixels >= currentPixels)?.resolution
      || availableResolutions[availableResolutions.length - 1].resolution;

    const selectedFolder = resolutionFolders[matchingResolution];
    setResolution(selectedFolder);

    // Function to load patterns from the assets directory
    const loadPatterns = async () => {
      try {
        // Get all pattern files from the public directory
        const response = await fetch(`/patterns/${selectedFolder}/index.json`);
        if (!response.ok) {
          throw new Error('Failed to load pattern index');
        }
        const files = await response.json();
        
        const categorizedPatterns = {};
        const patternMapping = {};

        files.forEach(filename => {
          const match = filename.match(/^.*?-([^-]+)-(.+)\.png$/i);
          if (match) {
            const category = match[1];
            const name = match[2];
            
            if (!categorizedPatterns[category]) {
              categorizedPatterns[category] = [];
            }
            
            const friendlyName = name
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
              .join(' ');

            categorizedPatterns[category].push({
              id: filename,
              name: friendlyName
            });

            patternMapping[filename] = {
              category,
              name: friendlyName,
              path: `/patterns/${selectedFolder}/${filename}`
            };
          }
        });

        setPatterns({
          categories: categorizedPatterns,
          patternMap: patternMapping
        });

        if (Object.keys(categorizedPatterns).length > 0) {
          const firstCategory = Object.keys(categorizedPatterns).sort()[0];
          setSelectedCategory(firstCategory);
          if (categorizedPatterns[firstCategory].length > 0) {
            setSelectedPattern(categorizedPatterns[firstCategory][0].id);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading patterns:', error);
        setIsLoading(false);
      }
    };

    loadPatterns();
  }, [setResolution, setPatterns, setIsLoading, setSelectedCategory, setSelectedPattern]);

  useEffect(() => {
    initializeTest();
  }, [initializeTest]);

  useEffect(() => {
    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        navigate('/');
      }
    };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
    };
  }, [navigate]);

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
    if (patterns.categories[category]?.length > 0) {
      setSelectedPattern(patterns.categories[category][0].id);
    }
  };

  const handlePatternChange = (e) => {
    setSelectedPattern(e.target.value);
    setIsLoading(true);
  };

  const handleExit = useCallback(async () => {
    if (document.fullscreenElement) {
      try {
        await document.exitFullscreen();
        // Wait for the next frame to ensure fullscreen exit is complete
        requestAnimationFrame(() => {
          navigate('/');
        });
      } catch (err) {
        console.log(`Error exiting fullscreen: ${err.message}`);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleReset = () => {
    // Reset to first category
    const firstCategory = Object.keys(patterns.categories).sort()[0];
    setSelectedCategory(firstCategory);
    
    // Reset to first pattern (clipping target broadcast)
    if (patterns.categories[firstCategory]?.length > 0) {
      const targetPattern = patterns.categories[firstCategory].find(pattern => 
        pattern.name.toLowerCase().includes('clipping target broadcast'));
      setSelectedPattern(targetPattern?.id || patterns.categories[firstCategory][0].id);
    }
  };

  return (
    <TestContainer>
      <ExitButton onClick={handleExit}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 19l-7-7 7-7" />
        </svg>
        Exit Test
      </ExitButton>

      {selectedPattern && patterns.patternMap[selectedPattern] && (
        <PatternImage
          src={patterns.patternMap[selectedPattern].path}
          alt={patterns.patternMap[selectedPattern].name}
          onLoad={() => setIsLoading(false)}
        />
      )}

      {isLoading && <LoadingOverlay>Loading pattern...</LoadingOverlay>}
      
      <ControlPanel $isMinimized={isMinimized}>
        <PanelHeader $isMinimized={isMinimized}>
          <h2>Test Patterns Controls</h2>
          <MinimizeButton onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <IoChevronUp /> : <IoChevronDown />}
          </MinimizeButton>
        </PanelHeader>

        {!isMinimized && (
          <>
            <Description>
              Select a category and pattern to test different aspects of your display.
              Current resolution: {resolution.replace(/-/g, ' ')}
            </Description>

            <CategorySelect value={selectedCategory} onChange={handleCategoryChange}>
              {Object.keys(patterns.categories).map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)} Patterns
                </option>
              ))}
            </CategorySelect>

            <PatternSelect value={selectedPattern} onChange={handlePatternChange}>
              {patterns.categories[selectedCategory]?.map(pattern => (
                <option key={pattern.id} value={pattern.id}>
                  {pattern.name}
                </option>
              ))}
            </PatternSelect>

            {selectedPattern && patterns.patternMap[selectedPattern] && (
              <Description>
                This pattern helps test your display's {selectedCategory.toLowerCase()} characteristics.
              </Description>
            )}

            <Section>
              <ResetButton onClick={handleReset}>Reset Settings</ResetButton>
            </Section>
          </>
        )}
      </ControlPanel>
    </TestContainer>
  );
};

export default TestPatternsTest;
