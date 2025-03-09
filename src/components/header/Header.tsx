import React, { useState, useEffect } from 'react';
import LanguageSwitcher from '../LanguageSwitcher';
import styled from 'styled-components';

const Nav = styled.nav`
  background: var(--header-bg);
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  &:hover {
   
    text-decoration: underline;
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
    width: 28px;
    height: 28px;
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
        <NavLink href="/">Home</NavLink>
        <NavLink href="/mission">Mission</NavLink>
        <NavLink href="/how-does-it-work">How It Works</NavLink>
        <NavLink href="/partners">Partners</NavLink>
        <NavLink href="/get-involved">Get Involved</NavLink>
        <NavLink href="/contact-us">Contact Us</NavLink>
      </NavLinks>
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
    </Nav>
  );
};

export default Header;
