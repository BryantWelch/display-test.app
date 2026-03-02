import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, canonical }) => {
  const location = useLocation();

  useEffect(() => {
    // Set canonical URL - normalize by removing trailing slashes
    const normalizedPath = location.pathname.endsWith('/') && location.pathname !== '/' 
      ? location.pathname.slice(0, -1) 
      : location.pathname;
    const canonicalUrl = canonical || `https://display-test.app${normalizedPath}`;
    
    // Remove existing canonical link if any
    const existingCanonical = document.querySelector('link[rel="canonical"]');
    if (existingCanonical) {
      existingCanonical.remove();
    }

    // Add new canonical link
    const link = document.createElement('link');
    link.rel = 'canonical';
    link.href = canonicalUrl;
    document.head.appendChild(link);

    // Set page title
    if (title) {
      document.title = title;
    }

    // Set meta description
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.name = 'description';
        document.head.appendChild(metaDescription);
      }
      metaDescription.content = description;
    }

    // Set Open Graph URL
    let ogUrl = document.querySelector('meta[property="og:url"]');
    if (ogUrl) {
      ogUrl.content = canonicalUrl;
    }

    // Set Twitter URL
    let twitterUrl = document.querySelector('meta[name="twitter:url"]');
    if (twitterUrl) {
      twitterUrl.content = canonicalUrl;
    }

    // Cleanup function
    return () => {
      // No cleanup needed as we want the canonical to persist
    };
  }, [location.pathname, title, description, canonical]);

  return null; // This component doesn't render anything
};

export default SEO; 