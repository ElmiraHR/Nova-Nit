import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/pageService';
import styles from './ContactUs.module.css';

const ContactUs: React.FC = () => {
  const [image, setImage] = useState<File | null>(null);
  const [storedImage, setStoredImage] = useState('');
  const [imageName, setImageName] = useState('No file selected');
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchImage();
  }, []);

  interface ContactImageResponse {
    image_url: string;
  }

  const fetchImage = async () => {
    try {
      const res = await axios.get<ContactImageResponse>(`${API_URL}/api/contact-image`);
      if (res.data?.image_url) {
        setStoredImage(`${API_URL}/${res.data.image_url}`);
      }
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setImageName(e.target.files[0].name);
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    try {
      const formData = new FormData();
      formData.append('image', image);

      const res = await axios.post<ContactImageResponse>(`${API_URL}/api/contact-image/upload`, formData);
      setStoredImage(`${API_URL}/${res.data.image_url}`);
      setImage(null);
      setImageName('No file selected');
      if (fileInputRef.current) fileInputRef.current.value = '';

      setNotification('Image uploaded!');
      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setNotification('Upload failed');
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Contact Us Image</h2>
      {notification && <div className={styles.notification}>{notification}</div>}

      <div className={styles.uploadSection}>
        <button className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>
          Choose File
        </button>
       
        <input
          type="file"
          onChange={handleFileChange}
          ref={fileInputRef}
          className={styles.hiddenInput}
        />
        <button className={styles.saveButton} onClick={handleUpload}>
          Upload
        </button>
      </div>

      <div className={styles.previewContainer}>
        {storedImage && (
          <div className={styles.imageBlock}>
            <span className={styles.imageLabel}>Current Image:</span>
            <img src={storedImage} alt="Contact" className={styles.image} />
          </div>
        )}
        {image && (
          <div className={styles.imageBlock}>
            <span className={styles.imageLabel}>New Image after upload (will replace current):</span>
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className={`${styles.image} ${styles.previewing}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
