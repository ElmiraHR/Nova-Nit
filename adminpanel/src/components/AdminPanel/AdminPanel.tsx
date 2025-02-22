import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '../Sidebar/Sidebar';  // Ваш компонент сайдбара
import PageEditor from '../PageEditor/PageEditor';  // Страница для редактирования
import styles from './AdminPanel.module.css';  // Стили для панели

const AdminPanel = () => {
  return (
    <div className={styles.adminPanel}>
      <Sidebar />  {/* Сайдбар слева */}
      <div className={styles.mainContent}>
        <Routes>
          {/* Если на пути /adminpanel, то загружается редактор */}
          <Route path="/" element={<PageEditor />} />
          
          {/* Динамический путь для редактирования страниц */}
          <Route path="/:page" element={<PageEditor />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminPanel;
