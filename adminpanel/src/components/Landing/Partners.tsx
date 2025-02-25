import React, { useState, useEffect, useRef } from 'react';
import { fetchPage, updatePartners } from '../../services/pageService';
import styles from './Partners.module.css';

const Partners = () => {
  const [titleEN, setTitleEN] = useState('');
  const [titleME, setTitleME] = useState('');
  const [infoEN, setInfoEN] = useState('');
  const [infoME, setInfoME] = useState('');
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [storedMainImage, setStoredMainImage] = useState('');
  const [logos, setLogos] = useState<File[]>([]);
  const [storedLogos, setStoredLogos] = useState<string[]>([]);
  const [notification, setNotification] = useState('');
  const [showReplaceMessage, setShowReplaceMessage] = useState(false);

  // ✅ Ссылки на input для сброса значения
  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const logosInputRef = useRef<HTMLInputElement | null>(null);

  const slug = 'landing';

  // ✅ Загрузка данных из БД при монтировании
  useEffect(() => {
    const loadData = async () => {
      try {
        const pageData = await fetchPage(slug);
        setTitleEN(pageData.partners_title_en || '');
        setTitleME(pageData.partners_title_me || '');
        setInfoEN(pageData.partners_info_en || '');
        setInfoME(pageData.partners_info_me || '');
        setStoredMainImage(pageData.partners_image_path || '');
        setStoredLogos(Array.isArray(pageData.partners_logos) ? pageData.partners_logos : JSON.parse(pageData.partners_logos || '[]'));
      } catch (error) {
        console.error('Error loading partners data', error);
      }
    };

    loadData();
  }, [slug]);

  // ✅ Обработчик для загрузки основной картинки
  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
      setShowReplaceMessage(true);
    }
  };

  // ✅ Отмена выбранной картинки
  const handleCancelMainImage = () => {
    setMainImage(null);
    setShowReplaceMessage(false);

    // Сброс input
    if (mainImageInputRef.current) {
      mainImageInputRef.current.value = '';
    }
  };

  // ✅ Обработчик для логотипов
  const handleLogosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setLogos((prev) => [...prev, ...files]);
  };

  // ✅ Удаление логотипа (из сохранённых)
  const handleDeleteStoredLogo = (index: number) => {
    setStoredLogos((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ Удаление логотипа (из новых, не сохранённых)
  const handleDeleteNewLogo = (index: number) => {
    setLogos((prev) => prev.filter((_, i) => i !== index));

    // Сброс input если все логотипы удалены
    if (logosInputRef.current && logos.length === 1) {
      logosInputRef.current.value = '';
    }
  };

  // ✅ Сохранение данных
  const handleSubmit = async () => {
    const payload = {
      partners_title_en: titleEN,
      partners_title_me: titleME,
      partners_info_en: infoEN,
      partners_info_me: infoME,
      partners_logos: storedLogos,
    };

    try {
      const response = await updatePartners(slug, payload, mainImage ?? undefined, logos);
      setStoredMainImage(response.partners_image_path || storedMainImage);
      setStoredLogos(response.partners_logos || storedLogos);
      setLogos([]);
      setMainImage(null);
      setShowReplaceMessage(false);

      if (mainImageInputRef.current) mainImageInputRef.current.value = '';
      if (logosInputRef.current) logosInputRef.current.value = '';

      setNotification('Changes saved successfully!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error updating partners data', error);
      setNotification('Failed to save changes');
    }
  };

  return (
    <div className={styles.partnersContainer}>
      <h2 className={styles.sectionTitle}>Landing Page Partners</h2>

      {notification && <div className={styles.notification}>{notification}</div>}

      {/* ✅ Заголовки */}
      <label>Partners Title (EN):</label>
      <input className={styles.inputField} value={titleEN} onChange={(e) => setTitleEN(e.target.value)} />

      <label>Partners Title (ME):</label>
      <input className={styles.inputField} value={titleME} onChange={(e) => setTitleME(e.target.value)} />

      {/* ✅ Тексты */}
      <label>Partners Info (EN):</label>
      <textarea className={styles.textareaField} value={infoEN} onChange={(e) => setInfoEN(e.target.value)} />

      <label>Partners Info (ME):</label>
      <textarea className={styles.textareaField} value={infoME} onChange={(e) => setInfoME(e.target.value)} />

      {/* ✅ Основная картинка (левая большая) */}
      <label>Left Big Picture:</label>
      <input
        ref={mainImageInputRef}
        className={styles.imageUpload}
        type="file"
        onChange={handleMainImageChange}
        aria-label="Choose File"
      />
      {(mainImage || storedMainImage) && (
        <div className={styles.mainImageWrapper}>
          <img
            src={mainImage ? URL.createObjectURL(mainImage) : `http://localhost:8080${storedMainImage}`}
            alt="Main"
            className={mainImage ? styles.previewMainImage : styles.mainImage}
          />
          {mainImage && (
            <div className={styles.replaceMessage}>
              Saving this image will replace the current one.
              <button className={styles.cancelButton} onClick={handleCancelMainImage}>Cancel</button>
            </div>
          )}
        </div>
      )}

      {/* ✅ Логотипы партнеров */}
      <label>Partners Logos:</label>
      <input
        ref={logosInputRef}
        className={styles.imageUpload}
        type="file"
        multiple
        onChange={handleLogosChange}
        aria-label="Choose Files"
      />
      <div className={styles.partnerList}>
        {/* ✅ Сохранённые логотипы */}
        {storedLogos.map((logo, idx) => (
          <div key={`stored-${idx}`} className={styles.partnerCard}>
            <img src={`http://localhost:8080${logo}`} alt={`Logo ${idx + 1}`} className={styles.partnerImage} />
            <button className={styles.deleteButton} onClick={() => handleDeleteStoredLogo(idx)}>Delete</button>
          </div>
        ))}

        {/* ✅ Новые логотипы (предпросмотр) */}
        {logos.map((file, idx) => (
          <div key={`new-${idx}`} className={`${styles.partnerCard} ${styles.previewCard}`}>
            <img src={URL.createObjectURL(file)} alt={`New Logo ${idx + 1}`} className={styles.partnerImage} />
            <button className={styles.deleteButton} onClick={() => handleDeleteNewLogo(idx)}>Remove</button>
          </div>
        ))}
      </div>

      <button className={styles.saveButton} onClick={handleSubmit}>
        Save Changes
      </button>
    </div>
  );
};

export default Partners;
