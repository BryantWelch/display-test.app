import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isTestPage = location.pathname.includes('/test/');

  useEffect(() => {
    if (!isTestPage) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, isTestPage]);

  return (
    <>
      {!isTestPage && <Navbar />}
      {children}
    </>
  );
};

export default Layout;
