import React, { useState, useEffect } from 'react';
import { fetchPage, updatePage } from '../../services/pageService';
import styles from './BodyInfo.module.css';

const BodyInfo = () => {
  const [bodyTitleEN, setBodyTitleEN] = useState('');
  const [bodyTitleME, setBodyTitleME] = useState('');
  const [bodyTextEN, setBodyTextEN] = useState('');
  const [bodyTextME, setBodyTextME] = useState('');
  const [sections, setSections] = useState([
    { en: '', me: '' },
    { en: '', me: '' },
    { en: '', me: '' },
  ]);
  const [notification, setNotification] = useState('');
  const slug = 'landing';

  useEffect(() => {
    const loadPageData = async () => {
      try {
        const pageData = await fetchPage(slug);
        setBodyTitleEN(pageData.body_title_en || '');
        setBodyTitleME(pageData.body_title_me || '');
        setBodyTextEN(pageData.body_info_en || '');
        setBodyTextME(pageData.body_info_me || '');
        setSections([
          { en: pageData.section1_en || '', me: pageData.section1_me || '' },
          { en: pageData.section2_en || '', me: pageData.section2_me || '' },
          { en: pageData.section3_en || '', me: pageData.section3_me || '' },
        ]);
      } catch (error) {
        console.error('Error loading page data:', error);
        setNotification('Failed to load data');
      }
    };

    loadPageData();
  }, [slug]);

  const handleSectionChange = (index: number, lang: 'en' | 'me', value: string) => {
    const updatedSections = [...sections];
    updatedSections[index][lang] = value;
    setSections(updatedSections);
  };

  const handleSubmit = async () => {
    const payload = {
      body_title_en: bodyTitleEN,
      body_title_me: bodyTitleME,
      body_info_en: bodyTextEN,
      body_info_me: bodyTextME,
      section1_en: sections[0].en,
      section1_me: sections[0].me,
      section2_en: sections[1].en,
      section2_me: sections[1].me,
      section3_en: sections[2].en,
      section3_me: sections[2].me,
    };

    try {
      await updatePage(slug, payload);
      setNotification('Changes saved successfully!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Error updating Body Info:', error);
      setNotification('Failed to save changes');
    }
  };

  return (
    <div className={styles.bodyInfoContainer}>
      <h2 className={styles.sectionTitle}>Body Info</h2>

      {notification && <div className={styles.notification}>{notification}</div>}

      {/* Заголовок */}
      <label>Body Title (EN):</label>
      <input
        className={styles.inputField}
        value={bodyTitleEN}
        onChange={(e) => setBodyTitleEN(e.target.value)}
      />

      <label>Body Title (ME):</label>
      <input
        className={styles.inputField}
        value={bodyTitleME}
        onChange={(e) => setBodyTitleME(e.target.value)}
      />

      {/* Текст */}
      <label>Body Text (EN):</label>
      <textarea
        className={styles.textareaField}
        value={bodyTextEN}
        onChange={(e) => setBodyTextEN(e.target.value)}
      />

      <label>Body Text (ME):</label>
      <textarea
        className={styles.textareaField}
        value={bodyTextME}
        onChange={(e) => setBodyTextME(e.target.value)}
      />

      {/* Секции */}
      {sections.map((section, index) => (
        <div key={index} className={styles.sectionBlock}>
          <h3>Section {index + 1}</h3>

          <label>Section {index + 1} (EN):</label>
          <textarea
            className={styles.textareaFieldSection}
            value={section.en}
            onChange={(e) => handleSectionChange(index, 'en', e.target.value)}
          />

          <label>Section {index + 1} (ME):</label>
          <textarea
            className={styles.textareaFieldSection}
            value={section.me}
            onChange={(e) => handleSectionChange(index, 'me', e.target.value)}
          />
        </div>
      ))}

      <button className={styles.saveButton} onClick={handleSubmit}>
        Save Changes
      </button>
    </div>
  );
};

export default BodyInfo;
