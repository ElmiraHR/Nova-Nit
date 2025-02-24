import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const navigate = useNavigate();

  const pages = ['Landing', 'Mission', 'HowDoesItWork', 'Partners', 'GetInvolved', 'Contact', 'Volunteer', 'FAQ'];

  // ✅ Функция для логаута
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn'); // Удаляем токен авторизации
    navigate('/login'); // Перенаправляем на страницу логина
  };

  return (
    <div className={styles.sidebar}>
      <h2>Pages</h2>
      <ul>
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
