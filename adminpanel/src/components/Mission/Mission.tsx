import React, { useState, useEffect, useRef } from 'react';
import { fetchPage, updateMission } from '../../services/pageService';
import styles from './Mission.module.css';

const Mission = () => {
  const [titleEN, setTitleEN] = useState('');
  const [titleME, setTitleME] = useState('');
  const [textEN, setTextEN] = useState('');
  const [textME, setTextME] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [storedImagePath, setStoredImagePath] = useState('');
  const [notification, setNotification] = useState('');
  const [showReplaceMessage, setShowReplaceMessage] = useState(false);
  const [imageName, setImageName] = useState('No file selected');

  const slug = 'mission';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage(slug);
        setTitleEN(pageData.title_en || '');
        setTitleME(pageData.title_me || '');
        setTextEN(pageData.text_en || '');
        setTextME(pageData.text_me || '');
  
        // ✅ Теперь картинка загружается корректно
        if (pageData.mission_image_path) {
          setStoredImagePath(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}${pageData.mission_image_path}?t=${new Date().getTime()}`);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setNotification('Не удалось загрузить данные');
      }
    };
  
    loadPageData();
  }, [slug]);
  

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageName(e.target.files[0].name);
      setShowReplaceMessage(true);
    }
  };

  const handleCancelImage = () => {
    setImage(null);
    setShowReplaceMessage(false);
    setImageName('No file selected');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append('title_en', titleEN);
      formData.append('title_me', titleME);
      formData.append('text_en', textEN);
      formData.append('text_me', textME);
  
      // ✅ Если загружена новая картинка, сразу обновляем локальное состояние
      if (image) {
        formData.append('image', image);
        setStoredImagePath(URL.createObjectURL(image)); // Показываем новую картинку сразу
      } else if (storedImagePath) {
        formData.append('mission_image_path', storedImagePath.replace(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}`, ''));
      }
  
      console.log("Отправляем formData:", formData);
      const response = await updateMission(slug, formData); // ✅ Отправляем данные
  
      // ✅ После ответа сервера обновляем путь к картинке с сервера
      if (response.mission_image_path || response.image_path) {
        setStoredImagePath(`${process.env.REACT_APP_API_URL || 'http://localhost:8080'}${response.mission_image_path || response.image_path}?t=${new Date().getTime()}`);
      }
  
      // ✅ Сбрасываем состояние
      setImage(null);
      setShowReplaceMessage(false);
      setImageName('No file selected');
  
      setNotification('Изменения сохранены!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Ошибка обновления миссии:', error);
      setNotification('Ошибка при сохранении');
    }
  };
  
  

  return (
    <div className={styles.missionContainer}>
      <h2 className={styles.sectionTitle}>Mission</h2>
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
      <label>Mission Picture:</label>
      <div className={styles.imageContainer}>
        <div className={styles.fileInputWrapper}>
          <button className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>Choose File</button>
          <span>{imageName}</span>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleImageChange}
            className={styles.hiddenInput}
          />
        </div>
        {(image || storedImagePath) && (
          <div className={styles.mainImageWrapper}>
            <img
              src={image ? URL.createObjectURL(image) : storedImagePath}
              alt="Mission"
              className={image ? styles.previewMainImage : styles.mainImage}
            />
            {image && (
              <div className={styles.replaceMessage}>
                Saving this image will replace the current one.
                <button className={styles.cancelButton} onClick={handleCancelImage}>Cancel</button>
              </div>
            )}
          </div>
        )}
      </div>
      <button className={styles.saveButton} onClick={handleSubmit}>
        Save Changes
      </button>
    </div>
  );
};

export default Mission;