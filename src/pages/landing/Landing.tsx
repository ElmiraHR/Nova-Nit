import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import s from './Landing.module.css';
import { fetchPage } from '../../services/pageService';
import { useLanguage } from '../../context/LanguageContext';
import logo from '../../assets/nova-nit-logo.svg';

const Hero = styled.section`
  background: #E3E1DC;
  padding: 4rem 2rem;
  text-align: center;
`;

const HeroTitle = styled.h1`
  color: #2b3242;
  font-family: 'Roboto', sans-serif;
  font-size: 47px;
  line-height: 74px;
  font-weight: 400;
  text-align: left;
  margin-bottom: 1rem;
`;

const HeroButton = styled.button`
  background: #3F4D61;
  color: #ffffff;
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background: #2b3242;
  }
`;

const Landing: React.FC = () => {
  const { language } = useLanguage();
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [storedImagePath, setStoredImagePath] = useState<string | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage('landing');
        setTitle(language === 'EN' ? pageData.hero_title_en || '' : pageData.hero_title_me || '');
        setText(language === 'EN' ? pageData.hero_text_en || '' : pageData.hero_text_me || '');
        setStoredImagePath(pageData.hero_image_path || pageData.image_path || null);
      } catch (error) {
        console.error('Error loading page data:', error);
      }
    };

    loadPageData();
  }, [language]);

  return (
    <Hero>
      <div>
        <img src={logo} alt="logo" />
      </div>
      <div className={s.landingBannerBox}>
        <div className={s.landingBannerBox_textSide}>
          <HeroTitle>{title}</HeroTitle>
          <p>{text}</p>
          <HeroButton>Get Involved</HeroButton>
        </div>
        <div className={s.landingBannerBox_imgSide}>
          {storedImagePath && <img src={storedImagePath} alt="banner" />}
          <HeroButton>Get Involved</HeroButton>
        </div>
      </div>
    </Hero>
  );
};

export default Landing;
