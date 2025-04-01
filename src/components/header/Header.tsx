import React, { useState, useEffect } from 'react';
import LanguageSwitcher from '../LanguageSwitcher';
import styled from 'styled-components';
import DonateButton from '../donateButton/DonateButton';
import SocialLinks from '../../components/socialLinks/SocialLinks';
import BurgerMenu from '../../components/burgerMenu/BurgerMenu';

const Nav = styled.nav`
  backdrop-filter: blur(10px);
  background: var(--blur-bg);
  padding: 1rem;
  display: flex;
  align-items: center;
  position: sticky;
  top:0;
  z-index: 5;
  justify-content: space-between;
      @media (max-width: 1200px) {
    justify-content: end;
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const NavLink = styled.a`
  color: var(--text-in-boxes);
  text-decoration: none;
  font-family: 'Montserrat', sans-serif;
  transition: border-bottom 0.3s ease;
  padding: 4px 0;
  font-weight: 600;
  font-size: clamp(16px, 1.5vw, 20px);
  &:hover {
    border-bottom: 2px solid var(--text-in-boxes);
  }
        @media (min-width: 1200px) {
    display: flex;
  }
  @media (max-width: 1200px) {
    display: none;
  }
`;

const ThemeSwitcher = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.7;
  }

  svg {
    width: 48px;
    height: 48px;
    fill: var(--text-in-boxes); /* Теперь иконки адаптируются к цвету текста */
  }
`;

const Header: React.FC = () => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <Nav>
      <LanguageSwitcher />
      <NavLinks>
        <NavLink href="/">HOME</NavLink>
        <NavLink href="/mission">OUR MISSION</NavLink>
        <NavLink href="/get-involved">BECOME A CORPORATE PARTNER</NavLink>
        <NavLink href="/contact-us">CONTACT US</NavLink>
        <NavLink href="/volunteer">VOLLUNTEER</NavLink>
        <DonateButton />
      </NavLinks>
      <SocialLinks size={48} isVisible={false} />
      <ThemeSwitcher onClick={toggleTheme}>
        {theme === 'light' ? (
          // **Луна при светлой теме**
          <svg viewBox="0 0 24 24">
            <path d="M15 3.5a9 9 0 00-9 9 9 9 0 0012 5.5A7 7 0 1119 3.5z" fill="black"/>
          </svg>
        ) : (
          // **Солнце при темной теме (белое)**
          <svg viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="5" fill="white" />
            <path d="M12 4V2M12 22v-2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" stroke="white" strokeWidth="2"/>
          </svg>
        )}
      </ThemeSwitcher>
      <BurgerMenu />
    </Nav>
  );
};

export default Header;
