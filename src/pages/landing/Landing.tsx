import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import s from './Landing.module.css';
import { fetchPage } from '../../services/pageService';
import { useLanguage } from '../../context/LanguageContext';
import lightLogo from '../../assets/nova-nit-logo.svg';
import darkLogo from '../../assets/nova nit-dark-logo.svg';

const Hero = styled.section`
  background: var(--main-bg);
  padding: 1rem 2rem 8rem 2rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  color: var(--text-in-boxes);
  font-family: 'Roboto', sans-serif;
  font-size: clamp(20px, 3.265vw, 47px);
  line-height: clamp(34px, 6.5vw, 74px);
  font-weight: 400;
  text-align: left;
  margin-bottom: 1rem;
`;

const HeroText = styled.p`
  color: var(--text-in-boxes);
  font-size: clamp(18px, 2vw, 24px);
  line-height: clamp(24px, 3vw, 40px);
  font-family: 'Roboto', sans-serif;
  text-align: left;
  font-weight: 400;
`;

const HeroButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto;
  background: var(--button-bg);
  color: var(--button-text);
  width: clamp(181px, 23.5vw, 334px);
  height: clamp(50px, 7vw, 80px);
  padding: 0;
  border: none;
  border-radius: 4px;
  font-size: clamp(18px, 2vw, 24px);
  font-weight: 700;
  cursor: pointer;

  &:hover {
    background: var(--text-in-boxes);
  }
`;

const Landing: React.FC = () => {
  const { language } = useLanguage();
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [storedImagePath, setStoredImagePath] = useState<string | null>(null);

  const [bodyTitle, setBodyTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [sections, setSections] = useState<{ en: string; me: string }[]>([]);

  const [titlePartners, setTitlePartners] = useState('');
  const [infoPartners, setInfoPartners] = useState('');
  const [storedMainImage, setStoredMainImage] = useState('');
  const [storedLogos, setStoredLogos] = useState<string[]>([]);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage('landing');

        setTitle(language === 'EN' ? pageData.hero_title_en || '' : pageData.hero_title_me || '');
        setText(language === 'EN' ? pageData.hero_text_en || '' : pageData.hero_text_me || '');
        setStoredImagePath(pageData.hero_image_path || pageData.image_path || null);

        setBodyTitle(language === 'EN' ? pageData.body_title_en || '' : pageData.body_title_me || '');
        setBodyText(language === 'EN' ? pageData.body_info_en || '' : pageData.body_info_me || '');

        setTitlePartners(language === 'EN' ? pageData.partners_title_en || '' : pageData.partners_title_me || '');
        setInfoPartners(language === 'EN' ? pageData.partners_info_en || '' : pageData.partners_info_me || '');
        setStoredMainImage(pageData.partners_image_path || '');

        // Парсим partners_logos
        let parsedLogos: string[] = [];
        if (Array.isArray(pageData.partners_logos)) {
          parsedLogos = pageData.partners_logos;
        } else if (typeof pageData.partners_logos === 'string') {
          try {
            parsedLogos = JSON.parse(pageData.partners_logos);
          } catch (error) {
            console.error('Ошибка парсинга partners_logos:', error);
          }
        }

        setStoredLogos(parsedLogos);

        // Проверяем секции
        const sectionsData = [
          { en: pageData.section1_en || 'Нет данных', me: pageData.section1_me || 'Nema podataka' },
          { en: pageData.section2_en || 'Нет данных', me: pageData.section2_me || 'Nema podataka' },
          { en: pageData.section3_en || 'Нет данных', me: pageData.section3_me || 'Nema podataka' },
        ];
        setSections(sectionsData);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    loadPageData();
  }, [language]);

  // Следим за изменением темы и обновляем логотип
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(newTheme);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });

    return () => observer.disconnect();
  }, []);

  const baseURL = 'http://localhost:8080'; // Базовый URL для логотипов и изображений

  return (
    <Hero>
      <div className={s.landingLogo}>
        <img src={theme === 'dark' ? darkLogo : lightLogo} alt="logo" />
      </div>

      {/* Основной баннер */}
      <div className={s.landingBannerBox}>
        <div className={s.landingBannerBox_textSide}>
          <HeroTitle>{title}</HeroTitle>
          <HeroText>{text}</HeroText>
          <HeroButton>Get Involved</HeroButton>
        </div>
        <div className={s.landingBannerBox_imgSide}>
          {storedImagePath && <img src={storedImagePath} alt="banner" />}
          <HeroButton>Learn More</HeroButton>
        </div>
      </div>

      {/* Блок информации */}
      <div className={s.landingBodyBox}>
        <h2>{bodyTitle}</h2>
        <HeroText>{bodyText}</HeroText>
        <HeroButton>Get Involved</HeroButton>
      </div>

      {/* Секции */}
      <div className={s.landingBodyBox_section}>
        {sections.map((sec, index) => (
          <div className={s.landingBodyBox_sectionBox} key={index}>
            <h3>{language === 'EN' ? sec.en : sec.me}</h3>
          </div>
        ))}
      </div>

      {/* Партнеры */}
      <div className={s.landingPartnersBox}>
        <div className={s.landingPartnersBox_imgSide}>
          {storedMainImage && <img src={`${baseURL}${storedMainImage}`} alt="photo" />}
        </div>
        <div className={s.landingPartnersBox_textSide}>
          <h2>{titlePartners}</h2>

          {/* Логотипы партнеров */}
          <div className={s.landingPartnersLogos}>
            {storedLogos.length > 0 ? (
              storedLogos.map((file, idx) => (
                <div key={idx}>
                  <img
                    src={`${baseURL}${file}`} // Добавляем базовый URL
                    alt={`Partner Logo ${idx}`}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                </div>
              ))
            ) : (
              <p>No partners available.</p>
            )}
          </div>

          <HeroText>{infoPartners}</HeroText>
          <HeroButton>Get Involved</HeroButton>
        </div>
      </div>
    </Hero>
  );
};

export default Landing;