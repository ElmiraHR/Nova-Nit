import React, { useState, useEffect, useRef } from 'react';
import { fetchPage, updatePartners } from '../../services/pageService';
import styles from './Partners.module.css';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';

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
  const [mainImageName, setMainImageName] = useState('No file selected');
  const [logosFileNames, setLogosFileNames] = useState('No files selected');

  const mainImageInputRef = useRef<HTMLInputElement | null>(null);
  const logosInputRef = useRef<HTMLInputElement | null>(null);

  const slug = 'landing';

  const loadData = async () => {
    try {
      const pageData = await fetchPage(slug);
      setTitleEN(pageData.partners_title_en || '');
      setTitleME(pageData.partners_title_me || '');
      setInfoEN(pageData.partners_info_en || '');
      setInfoME(pageData.partners_info_me || '');
      setStoredMainImage(pageData.partners_image_path || '');

      const parsed = Array.isArray(pageData.partners_logos)
        ? pageData.partners_logos
        : JSON.parse(pageData.partners_logos || '[]');
      setStoredLogos(parsed);
    } catch (error) {
      console.error('Error loading partners data', error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (notification === 'Changes saved successfully!') {
      loadData();
    }
  }, [notification]);

  const handleMainImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setMainImage(e.target.files[0]);
      setMainImageName(e.target.files[0].name);
      setShowReplaceMessage(true);
    }
  };

  const handleCancelMainImage = () => {
    setMainImage(null);
    setShowReplaceMessage(false);
    setMainImageName('No file selected');
    if (mainImageInputRef.current) mainImageInputRef.current.value = '';
  };

  const handleLogosChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setLogos((prev) => [...prev, ...files]);
    const fileNames = files.map((file) => file.name).join(', ') || 'No files selected';
    setLogosFileNames(fileNames);
  };

  const handleDeleteStoredLogo = (index: number) => {
    setStoredLogos((prev) => {
      const updated = [...prev];
      updated.splice(index, 1);
      return updated;
    });
  };

  const handleDeleteNewLogo = (index: number) => {
    setLogos((prev) => prev.filter((_, i) => i !== index));
    if (logosInputRef.current && logos.length === 1) logosInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        partners_title_en: titleEN,
        partners_title_me: titleME,
        partners_info_en: infoEN,
        partners_info_me: infoME,
        partners_logos: storedLogos,
      };

      const response = await updatePartners(slug, payload, mainImage ?? undefined, logos);

      setStoredMainImage(response.partners_image_path || '');
      const updatedLogos = Array.isArray(response.partners_logos)
        ? response.partners_logos
        : JSON.parse(response.partners_logos || '[]');
      setStoredLogos(updatedLogos);
      setLogos([]);
      setMainImage(null);
      setShowReplaceMessage(false);
      setMainImageName('No file selected');
      setLogosFileNames('No files selected');

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

      <label>Partners Title (EN):</label>
      <RichTextEditor value={titleEN} onChange={setTitleEN} minHeight={50} />

      <label>Partners Title (ME):</label>
      <RichTextEditor value={titleME} onChange={setTitleME} minHeight={50} />

      <label>Partners Info (EN):</label>
      <RichTextEditor value={infoEN} onChange={setInfoEN} minHeight={120} />

      <label>Partners Info (ME):</label>
      <RichTextEditor value={infoME} onChange={setInfoME} minHeight={120} />

      <label>Left Big Picture:</label>
      <div className={styles.fileInputWrapper}>
        <button className={styles.uploadButton} onClick={() => mainImageInputRef.current?.click()}>
          Choose File
        </button>
        <span>{mainImageName}</span>
        <input
          ref={mainImageInputRef}
          type="file"
          onChange={handleMainImageChange}
          className={styles.hiddenInput}
        />
      </div>

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
              <button className={styles.cancelButton} onClick={handleCancelMainImage}>
                Cancel
              </button>
            </div>
          )}
        </div>
      )}

      <label>Partners Logos:</label>
      <div className={styles.fileInputWrapper}>
        <button className={styles.uploadButton} onClick={() => logosInputRef.current?.click()}>
          Choose Files
        </button>
        <span>{logosFileNames}</span>
        <input
          ref={logosInputRef}
          type="file"
          multiple
          onChange={handleLogosChange}
          className={styles.hiddenInput}
        />
      </div>

      <div className={styles.partnerList}>
        {storedLogos.map((logo, idx) => (
          <div key={`stored-${idx}`} className={styles.partnerCard}>
            <img
              src={`http://localhost:8080${logo}`}
              alt={`Logo ${idx + 1}`}
              className={styles.partnerImage}
            />
            <button className={styles.deleteButton} onClick={() => handleDeleteStoredLogo(idx)}>
              Delete
            </button>
          </div>
        ))}

        {logos.map((file, idx) => (
          <div key={`new-${idx}`} className={`${styles.partnerCard} ${styles.previewCard}`}>
            <img
              src={URL.createObjectURL(file)}
              alt={`New Logo ${idx + 1}`}
              className={styles.partnerImage}
            />
            <button className={styles.deleteButton} onClick={() => handleDeleteNewLogo(idx)}>
              Remove
            </button>
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