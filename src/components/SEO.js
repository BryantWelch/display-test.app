import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const setMetaBySelector = (selector, attr, value) => {
  if (!value) return;
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    if (selector.includes('property=')) {
      const match = selector.match(/property="([^"]+)"/);
      if (match) el.setAttribute('property', match[1]);
    } else if (selector.includes('name=')) {
      const match = selector.match(/name="([^"]+)"/);
      if (match) el.setAttribute('name', match[1]);
    }
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
};

const SEO = ({ title, description, canonical, noindex = false }) => {
  const location = useLocation();

  useEffect(() => {
    const updateSEO = () => {
      const normalizedPath =
        location.pathname.endsWith('/') && location.pathname !== '/'
          ? location.pathname.slice(0, -1)
          : location.pathname;
      const canonicalUrl = canonical || `https://display-test.app${normalizedPath}`;

      const existingCanonical = document.querySelector('link[rel="canonical"]');
      if (existingCanonical) {
        existingCanonical.href = canonicalUrl;
      } else {
        const link = document.createElement('link');
        link.rel = 'canonical';
        link.href = canonicalUrl;
        document.head.appendChild(link);
      }

      if (title) {
        document.title = title;
      }

      setMetaBySelector('meta[name="description"]', 'content', description);
      setMetaBySelector('meta[property="og:url"]', 'content', canonicalUrl);
      setMetaBySelector('meta[property="og:title"]', 'content', title);
      setMetaBySelector('meta[property="og:description"]', 'content', description);
      setMetaBySelector('meta[name="twitter:url"]', 'content', canonicalUrl);
      setMetaBySelector('meta[name="twitter:title"]', 'content', title);
      setMetaBySelector('meta[name="twitter:description"]', 'content', description);

      const robotsMeta = document.querySelector('meta[name="robots"]');
      if (noindex) {
        setMetaBySelector('meta[name="robots"]', 'content', 'noindex, follow');
      } else if (robotsMeta) {
        robotsMeta.remove();
      }
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(updateSEO);
    } else {
      setTimeout(updateSEO, 0);
    }
  }, [location.pathname, title, description, canonical, noindex]);

  return null;
};

export default SEO;
