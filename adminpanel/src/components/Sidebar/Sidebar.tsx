import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Sidebar.module.css';

const Sidebar = () => {
  const pages = ['Landing', 'Mission', 'HowDoesItWork', 'Partners', 'GetInvolved', 'Contact', 'Volunteer', 'FAQ'];

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
    </div>
  );
};

export default Sidebar;
