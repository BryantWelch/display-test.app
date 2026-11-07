import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { getRouteMeta } from '../registry/routeMeta';
import { applyHead } from '../lib/head';

/** Keeps <head> in sync on client-side navigation. The first page load is already correct from prerendering. */
const Head = () => {
  const { pathname } = useLocation();
  const isFirst = useRef(true);

  useEffect(() => {
    const hasPrerenderedHead = isFirst.current && document.head.querySelector('[data-head="route"]');
    isFirst.current = false;
    if (!hasPrerenderedHead) applyHead(getRouteMeta(pathname));
  }, [pathname]);

  return null;
};

export default Head;
