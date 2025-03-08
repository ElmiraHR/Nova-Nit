import React, { useState, useEffect, useRef } from 'react';
import { fetchPage, updateHowDoesWork, API_URL } from '../../services/pageService';
import styles from './HowDoesWork.module.css';

const HowDoesWork = () => {
  const [titleEN, setTitleEN] = useState('');
  const [titleME, setTitleME] = useState('');
  const [textEN, setTextEN] = useState('');
  const [textME, setTextME] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [storedImagePath, setStoredImagePath] = useState('');
  const [notification, setNotification] = useState('');
  const [imageName, setImageName] = useState('No file selected');
  const [showReplaceMessage, setShowReplaceMessage] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Статус загрузки

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const slug = 'howdoeswork';

  // ✅ Загружаем данные при загрузке компонента
  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage(slug);
        setTitleEN(pageData.title_en || '');
        setTitleME(pageData.title_me || '');
        setTextEN(pageData.text_en || '');
        setTextME(pageData.text_me || '');

        if (pageData.how_work_image_path) {
          const fullPath = pageData.how_work_image_path.startsWith('http')
            ? pageData.how_work_image_path
            : `${API_URL}${pageData.how_work_image_path}`;

          console.log("✅ Загруженное изображение:", fullPath);
          setStoredImagePath(fullPath);
        }
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
        setNotification('Не удалось загрузить данные');
      }
    };

    loadPageData();
  }, []);

  // ✅ Обработчик загрузки файла
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageName(e.target.files[0].name);
      setShowReplaceMessage(true);
    }
  };

  const handleCancelImage = () => {
    setImage(null);
    setImageName('No file selected');
    setShowReplaceMessage(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // ✅ Отправка формы
  const handleSubmit = async () => {
    try {
      setIsUploading(true); // Устанавливаем статус загрузки
      const formData = new FormData();
      formData.append('title_en', titleEN);
      formData.append('title_me', titleME);
      formData.append('text_en', textEN);
      formData.append('text_me', textME);

      if (image) {
        formData.append('image', image);
      }

      console.log("✅ Отправляем formData:", formData);
      const response = await updateHowDoesWork(formData);

      // ✅ Отображаем временное изображение с прозрачностью
      if (image) {
        const newImageURL = URL.createObjectURL(image);
        setStoredImagePath(newImageURL);
      }

      // ✅ Обновляем путь к новому изображению после загрузки
      setTimeout(() => {
        if (response.how_work_image_path) {
          const newImagePath = `${API_URL}${response.how_work_image_path}?t=${new Date().getTime()}`;
          console.log("✅ Новое изображение загружено:", newImagePath);
          setStoredImagePath(newImagePath);
        }
        setIsUploading(false); // Сбрасываем статус загрузки
      }, 1000);

      // ✅ Очищаем состояние формы
      setImage(null);
      setImageName('No file selected');
      setShowReplaceMessage(false);
      setNotification('Изменения сохранены!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('❌ Ошибка обновления How Does Work:', error);
      setNotification('Ошибка при сохранении');
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.howDoesWorkContainer}>
      <h2 className={styles.sectionTitle}>How Does It Work</h2>
      {notification && <div className={styles.notification}>{notification}</div>}

      <label>Title (English):</label>
      <input className={styles.inputField} value={titleEN} onChange={(e) => setTitleEN(e.target.value)} />

      <label>Title (Montenegrin):</label>
      <input className={styles.inputField} value={titleME} onChange={(e) => setTitleME(e.target.value)} />

      <label>Text (English):</label>
      <textarea className={styles.textareaField} value={textEN} onChange={(e) => setTextEN(e.target.value)} />

      <label>Text (Montenegrin):</label>
      <textarea className={styles.textareaField} value={textME} onChange={(e) => setTextME(e.target.value)} />

      <label>How Does It Work Picture:</label>
      <div className={styles.imageContainer}>
        <div className={styles.fileInputWrapper}>
          <button className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>
            Choose File
          </button>
          <span>{imageName}</span>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleImageChange}
            className={styles.hiddenInput}
          />
        </div>

        {/* ✅ Исправленный рендеринг изображения */}
        {(image || storedImagePath) && (
    <div className={styles.mainImageWrapper}>
      <img
        src={image ? URL.createObjectURL(image) : storedImagePath}
        alt="How Does It Work"
        className={image ? styles.previewMainImage : styles.mainImage} // Прозрачность у загруженного, но не сохранённого
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

      <button className={styles.saveButton} onClick={handleSubmit} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Save Changes'}
      </button>
    </div>
  );
};

export default HowDoesWork;
