import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import TestShell, { Description } from '../../components/TestShell';

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
    <TestShell
      title="Test Patterns Controls"
      description={`Select a category and pattern to test different aspects of your display. Current resolution: ${resolution.replace(/-/g, ' ')}`}
      onReset={handleReset}
      controls={
        <>
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
        </>
      }
    >
      {selectedPattern && patterns.patternMap[selectedPattern] && (
        <PatternImage
          src={patterns.patternMap[selectedPattern].path}
          alt={patterns.patternMap[selectedPattern].name}
          onLoad={() => setIsLoading(false)}
        />
      )}

      {isLoading && <LoadingOverlay>Loading pattern...</LoadingOverlay>}
    </TestShell>
  );
};

export default TestPatternsTest;
