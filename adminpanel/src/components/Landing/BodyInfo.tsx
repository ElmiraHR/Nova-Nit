import React, { useState } from 'react';
import styles from './BodyInfo.module.css';

const BodyInfo = () => {
  const [sections, setSections] = useState([
    { id: 1, textEN: '', textME: '' },
    { id: 2, textEN: '', textME: '' },
    { id: 3, textEN: '', textME: '' },
  ]);

  const handleChange = (index: number, lang: 'EN' | 'ME', value: string) => {
    const updatedSections = [...sections];
    updatedSections[index][`text${lang}`] = value;
    setSections(updatedSections);
  };

  const handleSubmit = () => {
    console.log(sections);
  };

  return (
    <div className={styles.bodyInfoContainer}>
      <h2 className={styles.sectionTitle}>Body Info</h2>
      {sections.map((section, index) => (
        <div key={section.id} className={styles.sectionBlock}>
          <h3>Section {index + 1}</h3>

          <label className={styles.label}>Text (English):</label>
          <textarea
            className={styles.textareaField}
            value={section.textEN}
            onChange={(e) => handleChange(index, 'EN', e.target.value)}
          />

          <label className={styles.label}>Text (Montenegrin):</label>
          <textarea
            className={styles.textareaField}
            value={section.textME}
            onChange={(e) => handleChange(index, 'ME', e.target.value)}
          />
        </div>
      ))}
      <button className={styles.saveButton} onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
};

export default BodyInfo;
