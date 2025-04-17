import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../services/pageService';
import s from './Logo.module.css';

const Logo = () => {
  const location = useLocation(); // следим за изменением пути
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [logos, setLogos] = useState<{ dark_logo: string; light_logo: string } | null>(null);

  // Следим за темой
  const updateTheme = () => {
    const current = document.documentElement.getAttribute('data-theme') as 'light' | 'dark';
    setTheme(current || 'light');
  };

  // Загружаем лого с сервера
  const fetchCurrentLogos = async () => {
    try {
      const res = await axios.get<{ dark_logo: string; light_logo: string }>(`${API_URL}/api/logo`);
      setLogos(res.data);
    } catch (error) {
      console.error('Failed to load logos:', error);
    }
  };

  useEffect(() => {
    updateTheme();
    fetchCurrentLogos();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    updateTheme(); // при смене маршрута обновим тему на всякий случай
  }, [location]);

  const logoUrl = logos
    ? `${API_URL}/${theme === 'dark' ? logos.light_logo : logos.dark_logo}`
    : ''; // если логотип ещё не загружен

  return (
    <div className={s.landingLogo}>
      {logoUrl && <img src={logoUrl} alt="Logo" />}
    </div>
  );
};

export default Logo;
