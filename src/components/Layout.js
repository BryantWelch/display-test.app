import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = ({ children }) => {
  const location = useLocation();
  const isTestPage = location.pathname.includes('/test/');

  return (
    <>
      {!isTestPage && <Navbar />}
      {children}
    </>
  );
};

export default Layout;
