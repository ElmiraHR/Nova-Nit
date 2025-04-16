import React, { useState, useEffect } from 'react';
import { fetchPage, updatePage } from '../../services/pageService';
import styles from './BodyInfo.module.css';
import RichTextEditor from '../../components/RichTextEditor/RichTextEditor';

const BodyInfo = () => {
  const [bodyTitleEN, setBodyTitleEN] = useState('');
  const [bodyTitleME, setBodyTitleME] = useState('');
  const [bodyTextEN, setBodyTextEN] = useState('');
  const [bodyTextME, setBodyTextME] = useState('');
  const [bodyTitleLink, setBodyTitleLink] = useState('');

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
        setBodyTitleLink(pageData.body_title_link || '');

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
    try {
      const currentData = await fetchPage(slug);

      const updatedData = {
        ...currentData,
        body_title_en: bodyTitleEN,
        body_title_me: bodyTitleME,
        body_title_link: bodyTitleLink,
        body_info_en: bodyTextEN,
        body_info_me: bodyTextME,
        section1_en: sections[0].en,
        section1_me: sections[0].me,
        section2_en: sections[1].en,
        section2_me: sections[1].me,
        section3_en: sections[2].en,
        section3_me: sections[2].me,
      };

      const formData = new FormData();
      Object.keys(updatedData).forEach((key) => {
        const value = updatedData[key as keyof typeof updatedData] || '';
        formData.append(key, Array.isArray(value) ? JSON.stringify(value) : value);
      });

      await updatePage(slug, updatedData);
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

      <label>Body Title (EN):</label>
      <RichTextEditor value={bodyTitleEN} onChange={setBodyTitleEN} minHeight={50} />

      <label>Body Title (ME):</label>
      <RichTextEditor value={bodyTitleME} onChange={setBodyTitleME} minHeight={50} />

      <label>Body Title Link:</label>
      <input
        className={styles.inputField}
        value={bodyTitleLink}
        onChange={(e) => setBodyTitleLink(e.target.value)}
      />

      <label>Body Text (EN):</label>
      <RichTextEditor value={bodyTextEN} onChange={setBodyTextEN} minHeight={120} />

      <label>Body Text (ME):</label>
      <RichTextEditor value={bodyTextME} onChange={setBodyTextME} minHeight={120} />

      {sections.map((section, index) => (
        <div key={index} className={styles.sectionBlock}>
          <h3>Section {index + 1}</h3>

          <label>Section {index + 1} (EN):</label>
          <RichTextEditor
            value={section.en}
            onChange={(value) => handleSectionChange(index, 'en', value)}
            minHeight={100}
          />

          <label>Section {index + 1} (ME):</label>
          <RichTextEditor
            value={section.me}
            onChange={(value) => handleSectionChange(index, 'me', value)}
            minHeight={100}
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