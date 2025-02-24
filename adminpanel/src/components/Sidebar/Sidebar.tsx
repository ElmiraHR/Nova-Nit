import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [showLandingSubmenu, setShowLandingSubmenu] = useState(false);

  const pages = ['Mission', 'HowDoesItWork', 'Partners', 'GetInvolved', 'Contact', 'Volunteer', 'FAQ'];

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
      </ul>

      {/* ✅ Кнопка логаута */}
      <button className={styles.logoutButton} onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
};

export default Sidebar;
