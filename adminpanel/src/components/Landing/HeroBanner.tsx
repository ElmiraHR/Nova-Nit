import React, { useState, useEffect } from 'react';
import { fetchPage, updatePage } from '../../services/pageService';
import styles from './HeroBanner.module.css';

const HeroBanner = () => {
  const [titleEN, setTitleEN] = useState('');
  const [titleME, setTitleME] = useState('');
  const [textEN, setTextEN] = useState('');
  const [textME, setTextME] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [storedImagePath, setStoredImagePath] = useState('');
  const [notification, setNotification] = useState('');
  const slug = 'landing'; // Slug для страницы

  // Загрузка данных при монтировании компонента
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage(slug);
        setTitleEN(pageData.hero_title_en || '');
        setTitleME(pageData.hero_title_me || '');
        setTextEN(pageData.hero_text_en || '');
        setTextME(pageData.hero_text_me || '');
        // Если hero_image_path отсутствует, пробуем image_path
        setStoredImagePath(pageData.hero_image_path || pageData.image_path || '');
      } catch (error) {
        console.error('Error loading page data:', error);
        setNotification('Failed to load data');
      }
    };

    loadPageData();
  }, [slug]);

  // Обработчик загрузки изображения
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  // Сохранение данных в БД и уведомление
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('hero_title_en', titleEN);
    formData.append('hero_title_me', titleME);
    formData.append('hero_text_en', textEN);
    formData.append('hero_text_me', textME);
  
    if (image) {
      formData.append('image', image);
    }
  
    // Логируем FormData для отладки
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
  
    try {
      // ✅ Делаем запрос на обновление страницы
      const response = await updatePage(slug, {
        hero_title_en: titleEN,
        hero_title_me: titleME,
        hero_text_en: textEN,
        hero_text_me: textME,
        hero_image_path: storedImagePath,
      }, image ?? undefined); // ✅ null заменяется на undefined
  
      // ✅ Если сервер вернул новый путь к картинке — обновляем storedImagePath
      if (response.hero_image_path) {
        // Добавляем параметр времени для обхода кеша
        setStoredImagePath(`http://localhost:8080${response.hero_image_path}?t=${new Date().getTime()}`);
      }
  
      setNotification('Changes saved successfully!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error updating Hero Banner:', error);
      setNotification('Failed to save changes');
    }
  };

  return (
    <div className={styles.heroBannerContainer}>
      <h2 className={styles.sectionTitle}>Hero Banner</h2>

      {notification && <div className={styles.notification}>{notification}</div>}

      <label>Title (English):</label>
      <input
        className={styles.inputField}
        value={titleEN}
        onChange={(e) => setTitleEN(e.target.value)}
      />

      <label>Title (Montenegrin):</label>
      <input
        className={styles.inputField}
        value={titleME}
        onChange={(e) => setTitleME(e.target.value)}
      />

      <label>Text (English):</label>
      <textarea
        className={styles.textareaField}
        value={textEN}
        onChange={(e) => setTextEN(e.target.value)}
      />

      <label>Text (Montenegrin):</label>
      <textarea
        className={styles.textareaField}
        value={textME}
        onChange={(e) => setTextME(e.target.value)}
      />

      <label>Hero Banner Picture:</label>
      <div className={styles.imageContainer}>
        {storedImagePath && (
          <img
            src={storedImagePath}
            alt="Hero Banner"
            style={{ width: '150px', height: '150px', objectFit: 'cover' }}
          />
        )}
        {/* Скрытый input для загрузки файла */}
        <input
          id="fileInput"
          type="file"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        {/* Кастомная кнопка выбора файла */}
        <label htmlFor="fileInput" className={styles.customFileLabel}>
          choose file
        </label>
      </div>

      <button className={styles.saveButton} onClick={handleSubmit}>
        Save changes
      </button>
    </div>
  );
};

export default HeroBanner;
