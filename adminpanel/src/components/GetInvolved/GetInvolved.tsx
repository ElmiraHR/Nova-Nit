import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_URL } from '../../services/pageService';
import styles from './GetInvolved.module.css';

interface ImageData {
  id: number;
  image_url: string;
}

const GetInvolved: React.FC = () => {
  const [images, setImages] = useState<File[]>([]);
  const [storedImages, setStoredImages] = useState<ImageData[]>([]);
  const [fileNames, setFileNames] = useState('No files selected');
  const [notification, setNotification] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get<ImageData[]>(`${API_URL}/api/getinvolved`);
      setStoredImages(res.data);
    } catch (error) {
      console.error('Error loading images:', error);
      setNotification('Error loading images');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setImages(prev => [...prev, ...files]);

    const names = files.map(file => file.name).join(', ') || 'No files selected';
    setFileNames(names);
  };

  const handleUpload = async () => {
    try {
      for (const file of images) {
        const formData = new FormData();
        formData.append('image', file);
        await axios.post(`${API_URL}/api/getinvolved/upload`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setNotification('Images uploaded successfully!');
      setImages([]);
      setFileNames('No files selected');
      if (fileInputRef.current) fileInputRef.current.value = '';
      fetchImages();

      setTimeout(() => setNotification(''), 3000);
    } catch (error) {
      console.error('Upload failed:', error);
      setNotification('Upload failed!');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_URL}/api/getinvolved/${id}`);
      fetchImages();
    } catch (error) {
      console.error('Delete failed:', error);
      setNotification('Delete failed!');
    }
  };

  const handleRemoveNewImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.sectionTitle}>Get Involved Images</h2>

      {notification && <div className={styles.notification}>{notification}</div>}

      <div className={styles.uploadSection}>
        <button className={styles.uploadButton} onClick={() => fileInputRef.current?.click()}>
          Choose Files
        </button>
        <span>{fileNames}</span>
        <input
          type="file"
          multiple
          onChange={handleFileChange}
          ref={fileInputRef}
          className={styles.hiddenInput}
        />
        <button className={styles.saveButton} onClick={handleUpload}>
          Upload
        </button>
      </div>

      <div className={styles.imageGrid}>
        {storedImages.map((img) => (
          <div key={img.id} className={styles.imageItem}>
            <img
              src={`${API_URL}/${img.image_url}`}
              alt={`Stored ${img.id}`}
              className={styles.image}
            />
            <button className={styles.deleteButton} onClick={() => handleDelete(img.id)}>
              Delete
            </button>
          </div>
        ))}

        {images.map((file, idx) => (
          <div key={`new-${idx}`} className={`${styles.imageItem} ${styles.preview}`}>
            <img
              src={URL.createObjectURL(file)}
              alt={`New ${idx}`}
              className={styles.image}
            />
            <button className={styles.deleteButton} onClick={() => handleRemoveNewImage(idx)}>
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GetInvolved;
