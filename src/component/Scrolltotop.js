// src/components/ScrollToTop.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Scrolltotop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // smooth scroll effect
    });
  }, [pathname]);

  return null;
};

export default Scrolltotop;
