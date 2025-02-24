import React, { useState } from 'react';
import styles from './Partners.module.css';

const Partners = () => {
  const [title, setTitle] = useState('');
  const [info, setInfo] = useState('');
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    console.log({ title, info, image });
  };

  return (
    <div className={styles.partnersContainer}>
      <h2 className={styles.sectionTitle}>Landing page Partners</h2>

      <label>Partners Title:</label>
      <input
        className={styles.inputField}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <label>Partners Info:</label>
      <textarea
        className={styles.textareaField}
        value={info}
        onChange={(e) => setInfo(e.target.value)}
      />

      <label>Partners Image:</label>
      <input className={styles.imageUpload} type="file" onChange={handleImageChange} />

      <button className={styles.saveButton} onClick={handleSubmit}>
        Save changes
      </button>
    </div>
  );
};

export default Partners;
