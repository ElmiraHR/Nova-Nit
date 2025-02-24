import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import HeroBanner from '../Landing/HeroBanner';
import BodyInfo from '../Landing/BodyInfo';
import Partners from '../Landing/Partners';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  return (
    <div className={styles.adminPanel}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<h2>Welcome to Admin Panel</h2>} />
          <Route path="/landing/hero-banner" element={<HeroBanner />} />
          <Route path="/landing/body-info" element={<BodyInfo />} />
          <Route path="/landing/partners" element={<Partners />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
