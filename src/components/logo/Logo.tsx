import lightLogo from '../../assets/nova-nit-logo.svg';
import darkLogo from '../../assets/nova-nit-dark-logo.svg';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import s from './Logo.module.css';

const Logo = () => {
  const location = useLocation(); // следим за изменением пути
  const [theme, setTheme] = useState('light');

  const updateTheme = () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    setTheme(currentTheme);
  };

  useEffect(() => {
    updateTheme(); // при монтировании
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    updateTheme(); // при смене маршрута тоже проверяем тему
  }, [location]);

  return (
    <div className={s.landingLogo}>
      <img src={theme === 'dark' ? darkLogo : lightLogo} alt="logo" />
    </div>
  );
};

export default Logo;
