import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';
import PageEditor from '../PageEditor/PageEditor';
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
  return (
    <div className={styles.adminPanel}>
      <Sidebar />
      <div className={styles.mainContent}>
        <Routes>
          <Route path=":page" element={<PageEditor />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
