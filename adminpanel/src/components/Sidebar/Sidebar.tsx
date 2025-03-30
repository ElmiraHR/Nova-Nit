import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLandingSubmenu, setShowLandingSubmenu] = useState(false);

  const pages = [ 'Volunteer'];

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

        {/* ✅ Остальные страницы */}
        {pages.map((page) => (
          <li key={page}>
            <NavLink
              to={`/adminpanel/${page.toLowerCase()}`}
              className={({ isActive }) => (isActive ? styles.active : '')}
            >
              {page}
            </NavLink>
          </li>
        ))}

        {/* ✅ Ссылка на Mission */}
        <li>
          <NavLink
            to="/adminpanel/mission/mission"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            Mission
          </NavLink>
        </li>

        {/* ✅ Добавляем ссылку на HowDoesWork */}
        <li>
          <NavLink
            to="/adminpanel/howdoeswork"
            className={({ isActive }) => (isActive ? styles.active : '')}
          >
            HowDoesWork
          </NavLink>
        </li>
        <li>
      <NavLink
       to="/adminpanel/partners"
       className={({ isActive }) => (isActive ? styles.active : '')}
       >
       Partners
      </NavLink>
      </li>
      <li>
     <NavLink
       to="/adminpanel/getinvolved"
       className={({ isActive }) => (isActive ? styles.activeLink : '')}
      >
       Get Involved
      </NavLink>
      </li>
      <li>
    <NavLink to="/adminpanel/contact" 
    className={({ isActive }) => (isActive ? styles.activeLink : '')}>
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
    <NavLink to="/adminpanel/allimages" 
    className={({ isActive }) => (isActive ? styles.activeLink : '')}>
      All Images
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
