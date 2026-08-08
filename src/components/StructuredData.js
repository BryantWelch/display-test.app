import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const StructuredData = ({ type = 'WebPage', data = {} }) => {
  const location = useLocation();

  useEffect(() => {
    const updateStructuredData = () => {
      // Only remove this component's schema — leave FAQ and other typed scripts alone
      const existingScript = document.querySelector('script[data-schema-type="primary"]');
      if (existingScript) {
        existingScript.remove();
      }

      // Create structured data based on type
      let structuredData = {};

      if (type === 'WebPage') {
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: data.title || 'Display Test',
          description: data.description || 'Free professional display testing tools',
          url: `https://display-test.app${location.pathname}`,
          inLanguage: 'en-US',
          isPartOf: {
            '@type': 'WebSite',
            name: 'Display Test',
            url: 'https://display-test.app'
          }
        };
      } else if (type === 'SoftwareApplication') {
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'Display Test',
          applicationCategory: 'UtilitiesApplication',
          operatingSystem: 'Web Browser',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD'
          },
          description: 'Free professional display testing suite for LCD, LED, OLED, and gaming monitors',
          url: 'https://display-test.app'
        };
      } else if (type === 'HowTo') {
        structuredData = {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: data.title || 'How to test your display',
          description: data.description || 'Learn how to test your monitor',
          step: data.steps || []
        };
      }

      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.setAttribute('data-schema-type', 'primary');
      script.text = JSON.stringify(structuredData);
      document.head.appendChild(script);
    };

    // Defer to idle time to avoid blocking interactions
    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateStructuredData);
    } else {
      setTimeout(updateStructuredData, 0);
    }

    return () => {
      const scriptToRemove = document.querySelector('script[data-schema-type="primary"]');
      if (scriptToRemove) {
        scriptToRemove.remove();
      }
    };
  }, [location.pathname, type, data]);

  return null;
};

export default StructuredData;
