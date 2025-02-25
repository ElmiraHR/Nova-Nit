import React, { useState, useEffect, useRef } from 'react';
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
  const [showReplaceMessage, setShowReplaceMessage] = useState(false);
  const [imageName, setImageName] = useState('No file selected');

  const slug = 'landing';
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage(slug);
        setTitleEN(pageData.hero_title_en || '');
        setTitleME(pageData.hero_title_me || '');
        setTextEN(pageData.hero_text_en || '');
        setTextME(pageData.hero_text_me || '');
        setStoredImagePath(pageData.hero_image_path || pageData.image_path || '');
      } catch (error) {
        console.error('Error loading page data:', error);
        setNotification('Failed to load data');
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
      const currentData = await fetchPage(slug);

      const updatedData = {
        ...currentData,
        hero_title_en: titleEN,
        hero_title_me: titleME,
        hero_text_en: textEN,
        hero_text_me: textME,
      };

      const formData = new FormData();
      Object.keys(updatedData).forEach((key) => {
        const value = updatedData[key as keyof typeof updatedData] || '';
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      });

      if (image) {
        formData.append('image', image);
      }

      const response = await updatePage(slug, updatedData, image ?? undefined);

      if (response.hero_image_path) {
        setStoredImagePath(`http://localhost:8080${response.hero_image_path}?t=${new Date().getTime()}`);
      }

      setImage(null);
      setImageName('No file selected');
      setShowReplaceMessage(false);
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
              alt="Hero Banner"
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

export default HeroBanner;
