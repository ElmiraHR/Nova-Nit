import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import HeroBanner from '../Landing/HeroBanner';
import BodyInfo from '../Landing/BodyInfo';
import Partners from '../Landing/Partners';
import Mission from '../Mission/Mission';
import PartnersPage from '../Partners/PartnersPage';
import HowDoesWork from '../HowDoesWork/HowDoesWork'; 
import GetInvolved from '../GetInvolved/GetInvolved';
import ContactUs from '../ContactUs/ContactUs'; 
import AllImages from '../AllImages/AllImages'; 
import FAQ from '../FAQ/FAQ';
import VolunteerPage from '../Volunteer/VolunteerPage';
import ChangeLogoPage from '../ChangeLogoPage/ChangeLogoPage';


import styles from './AdminPanel.module.css';


const AdminPanel = () => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true';

  return (
    <div className={styles.adminPanel}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Routes>
          <Route path="/" element={<h2>Welcome to Admin Panel</h2>} />
          <Route path="/landing/hero-banner" element={isAuthenticated ? <HeroBanner /> : <Navigate to="/login" />} />
          <Route path="/landing/body-info" element={isAuthenticated ? <BodyInfo /> : <Navigate to="/login" />} />
          <Route path="/landing/partners" element={isAuthenticated ? <Partners /> : <Navigate to="/login" />} />
          <Route path="/mission/mission" element={isAuthenticated ? <Mission /> : <Navigate to="/login" />} />
          <Route path="/howdoeswork" element={isAuthenticated ? <HowDoesWork /> : <Navigate to="/login" />} /> {/* ✅ Новый роут */}
          <Route path="/partners" element={isAuthenticated ? <PartnersPage />: <Navigate to="/login" />} />
          <Route path="/getinvolved" element={isAuthenticated ? <GetInvolved /> : <Navigate to="/login" />} />
          <Route path="/contact" element={isAuthenticated ? <ContactUs />: <Navigate to="/login" />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/allimages" element={isAuthenticated ? <AllImages />: <Navigate to="/login" />} />
          <Route path="/change-logo" element={isAuthenticated ? <ChangeLogoPage /> : <Navigate to="/login" />} />
          <Route path="/faq" element={isAuthenticated ? <FAQ /> : <Navigate to="/login" />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
