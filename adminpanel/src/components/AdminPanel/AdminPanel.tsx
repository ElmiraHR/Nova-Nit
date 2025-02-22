import React from 'react';
import { Routes, Route, BrowserRouter as Router } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';  // Ваш компонент сайдбара
import PageEditor from '../PageEditor/PageEditor';  // Страница для редактирования
import styles from './AdminPanel.module.css';  // Стили для панели

const AdminPanel = () => {
  return (
    <div className={styles.adminPanel}>
      <Sidebar />  {/* Сайдбар слева */}
      <div className={styles.mainContent}>
        <Routes>
          {/* Динамический путь для редактирования страниц */}
          <Route path="/adminpanel/:page" element={<PageEditor />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
