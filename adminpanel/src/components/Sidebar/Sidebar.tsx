import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLandingSubmenu, setShowLandingSubmenu] = useState(false);

  const pages = ['Volunteer']; // Удаляем этот массив с дублирующимися ссылками.

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  return (
    <div className={styles.sidebar}>
      <h2>Pages</h2>
      <ul>
        {/* ✅ Landing с подменю */}
        <li>
          <span
            className={styles.parentMenu}
            onClick={() => setShowLandingSubmenu(!showLandingSubmenu)}
          >
            Landing {showLandingSubmenu ? '▲' : '▼'}
          </span>
          {showLandingSubmenu && (
            <ul className={styles.submenu}>
              <li>
                <NavLink
                  to="/adminpanel/landing/hero-banner"
                  className={({ isActive }) => (isActive ? styles.active : '')}
                >
                  Hero Banner
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/adminpanel/landing/body-info"
                  className={({ isActive }) => (isActive ? styles.active : '')}
                >
                  Body Info
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/adminpanel/landing/partners"
                  className={({ isActive }) => (isActive ? styles.active : '')}
                >
                  Partners
                </NavLink>
              </li>
            </ul>
          )}
        </li>

        {/* ✅ Ссылка на Mission */}
        <li>
          <NavLink
            to="/adminpanel/mission/mission"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            Mission
          </NavLink>
        </li>

        {/* ✅ Добавляем ссылку на HowDoesWork */}
        <li>
          <NavLink
            to="/adminpanel/howdoeswork"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            HowDoesWork
          </NavLink>
        </li>

        {/* ✅ Партнеры */}
        <li>
          <NavLink
            to="/adminpanel/partners"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            Partners
          </NavLink>
        </li>

        {/* ✅ Ссылка на Volunteer with Us */}
        <li>
          <NavLink
            to="/adminpanel/volunteer"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            Volunteer with Us
          </NavLink>
        </li>

        {/* ✅ Остальные ссылки */}
        <li>
          <NavLink
            to="/adminpanel/getinvolved"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            Get Involved
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/adminpanel/contact"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            Contact Us
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/adminpanel/faq"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            FAQ image
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/adminpanel/allimages"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            All Images
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/adminpanel/change-logo"
            className={({ isActive }) => (isActive ? styles.activeLink : '')}
          >
            Change Logo
          </NavLink>
        </li>
      </ul>

      {/* ✅ Кнопка логаута */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
