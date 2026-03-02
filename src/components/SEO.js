import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, canonical }) => {
  const location = useLocation();

  useEffect(() => {
    // Defer non-critical DOM updates to avoid blocking interactions
    const updateSEO = () => {
      // Set canonical URL - normalize by removing trailing slashes
      const normalizedPath = location.pathname.endsWith('/') && location.pathname !== '/' 
        ? location.pathname.slice(0, -1) 
        : location.pathname;
      const canonicalUrl = canonical || `https://display-test.app${normalizedPath}`;
      
      // Batch DOM queries
      const existingCanonical = document.querySelector('link[rel="canonical"]');
      const metaDescription = document.querySelector('meta[name="description"]');
      const ogUrl = document.querySelector('meta[property="og:url"]');
      const twitterUrl = document.querySelector('meta[name="twitter:url"]');

      // Update canonical
      if (existingCanonical) {
        existingCanonical.href = canonicalUrl;
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonicalUrl;
        document.head.appendChild(link);
      }

      // Update title (synchronous - needed for browser tab)
      if (title) {
        document.title = title;
      }

      // Update meta description
      if (description) {
        if (metaDescription) {
          metaDescription.content = description;
        } else {
          const meta = document.createElement('meta');
          meta.name = 'description';
          meta.content = description;
          document.head.appendChild(meta);
        }
      }

      // Update social URLs
      if (ogUrl) ogUrl.content = canonicalUrl;
      if (twitterUrl) twitterUrl.content = canonicalUrl;
    };

    // Use requestIdleCallback for non-critical updates, fallback to setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateSEO);
    } else {
      setTimeout(updateSEO, 0);
    }
  }, [location.pathname, title, description, canonical]);

  return null; // This component doesn't render anything
};

export default SEO;