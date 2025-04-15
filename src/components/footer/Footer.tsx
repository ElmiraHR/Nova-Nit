import React, { useEffect, useState } from 'react';
import s from './Footer.module.css';
import styled from 'styled-components';
import Logo from '../../components/logo/Logo';
import DonateButton from '../../components/donateButton/DonateButton';
import SocialLinks from '../../components/socialLinks/SocialLinks';
import { fetchPage } from '../../services/pageService';
import { useLanguage } from '../../context/LanguageContext';

const NavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;

  @media (max-width: 576px) {
  gap: 8px;
}
`;

const NavLink = styled.a`
  color: var(--text-in-boxes);
  text-decoration: none;
  text-align: left;
  font-size: 18px;
  font-weight: 600;
  transition: border-bottom 0.3s ease;
  padding: 8px 0;

  &:hover {
    border-bottom: 2px solid var(--text-in-boxes);
  }
`;
const Footer: React.FC = () => {
  const { language } = useLanguage();

  const [storedLogos, setStoredLogos] = useState<string[]>([]);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage('landing');

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

      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      }
    };

    loadPageData();
  }, [language]);

  const baseURL = 'http://localhost:8080'; // Базовый URL для логотипов и изображений
  return (
    <footer className={s.footer}>
      <div className={s.footerWraper}>
        <div className={s.footerWraper1}>
          <div className={s.footer_first}>
            <Logo />
            <span>
            <p>NU Nova Nit</p>
            <p>8. Marta 70</p>
            <p>81000 Podgorica</p>
            <p>Montenegro</p>
            <p>+382-68-067-663</p>
            <p>CKB 510000000012512167</p>
            </span>
          </div>

          <div className={s.footerPartnersLogos}>
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
              <p> {language === "ME" ? 'Nema dostupnih partnera.' : 'No partners available.'}</p>
            )}
          </div>
        </div>
        <div className={s.footer_third}>
          <div className={s.footer_thirdLinks}>
            <NavLinks>
              <NavLink href="/">{language === "ME" ? 'POČETNA' : 'HOME'}</NavLink>
              <NavLink href="/mission">{language === "ME" ? 'NAŠA MISIJA' : 'OUR MISSION'}</NavLink>
              <NavLink href="/faq">{language === "ME" ? 'ČESTO POSTAVLJENA PITANJA' : 'FAQ'}</NavLink>
              <NavLink href="/partners">{language === "ME" ? 'KORPORATIVNI PARTNERI' : 'CORPORATE PARTNERS'}</NavLink>
              <NavLink href="/contact-us">{language === "ME" ? 'KONTAKTIRAJTE NAS' : 'CONTACT US'}</NavLink>
              <NavLink href="/volunteer">{language === "ME" ? 'VOLONTIRAJTE' : 'VOLLUNTEER'}</NavLink>
              <DonateButton />
            </NavLinks>

          </div>
          <div className={s.footer_thirdSocial}>
            <h3>{language === "ME" ? 'Prati nas' : 'Follow us'}</h3>
            <SocialLinks size={94} instagramUrl="https://www.instagram.com/novanit_pg/" facebookUrl="https://www.facebook.com/NovaNitPG/"/>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
