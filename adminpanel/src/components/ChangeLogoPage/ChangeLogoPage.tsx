import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/pageService';
import styles from './ChangeLogoPage.module.css';

const ChangeLogoPage = () => {
  const [darkLogo, setDarkLogo] = useState<File | null>(null);
  const [lightLogo, setLightLogo] = useState<File | null>(null);
  const [currentLogos, setCurrentLogos] = useState<{ dark_logo: string; light_logo: string } | null>(null);
  const [notification, setNotification] = useState('');
  const darkRef = useRef<HTMLInputElement | null>(null);
  const lightRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchCurrentLogos();
  }, []);

  const fetchCurrentLogos = async () => {
    try {
        const res = await axios.get<{ dark_logo: string; light_logo: string }>(`${API_URL}/api/logo`);

      setCurrentLogos(res.data);
    } catch (error) {
      console.error('Failed to load current logos:', error);
      setNotification('Failed to load logos');
    }
  };

  const handleUpload = async () => {
    const formData = new FormData();
    if (darkLogo) formData.append('dark_logo', darkLogo);
    if (lightLogo) formData.append('light_logo', lightLogo);
  
    try {
      await axios.post(`${API_URL}/api/logo/update`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      setNotification('Logo updated successfully!');
      await fetchCurrentLogos(); // ✅ ждём, пока обновлённые лого загрузятся
      setDarkLogo(null);
      setLightLogo(null);
      if (darkRef.current) darkRef.current.value = '';
      if (lightRef.current) lightRef.current.value = '';
  
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setNotification('Upload failed!');
    }
  };
  

  const renderPreview = (file: File | null, url?: string) => {
    if (file) {
      return <img src={URL.createObjectURL(file)} className={styles.previewImage} alt="Preview" />;
    } else if (url) {
      return <img src={`${API_URL}/${url}`} className={styles.savedImage} alt="Current Logo" />;
    }
    return null;
  };

  return (
    <div className={styles.container}>
    <h2 className={styles.title}>Change Logo</h2>
    <p className={styles.notice}>Uploading new logo will replace the current one.</p>
    {notification && <div className={styles.notification}>{notification}</div>}

    <div className={styles.logoWrapper}>
      <div className={styles.logoBlock}>
        <label>Dark Logo:</label>
        {renderPreview(darkLogo, currentLogos?.dark_logo)}
        <input
          type="file"
          onChange={(e) => setDarkLogo(e.target.files?.[0] || null)}
          ref={darkRef}
          className={styles.hiddenInput}
          id="darkLogoInput"
        />
        <button
          className={styles.chooseButton}
          onClick={() => darkRef.current?.click()}
        >
          Choose Dark Logo
        </button>
      </div>

      <div className={styles.logoBlock}>
        <label>Light Logo:</label>
        {renderPreview(lightLogo, currentLogos?.light_logo)}
        <input
          type="file"
          onChange={(e) => setLightLogo(e.target.files?.[0] || null)}
          ref={lightRef}
          className={styles.hiddenInput}
          id="lightLogoInput"
        />
        <button
          className={styles.chooseButton}
          onClick={() => lightRef.current?.click()}
        >
          Choose Light Logo
        </button>
      </div>
    </div>

    <div style={{ textAlign: 'center', marginTop: '30px' }}>
      <button className={styles.uploadButton} onClick={handleUpload}>
        Upload Logo
      </button>
    </div>
  </div>
  
  );
};

export default ChangeLogoPage;
